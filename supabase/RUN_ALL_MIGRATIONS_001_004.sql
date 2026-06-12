-- Freedom Paws ID — RUN ALL MIGRATIONS 001-004 (single paste in Supabase SQL Editor)
-- Generated 2026-06-11

-- ========== 001_freedom_paws_id.sql ==========

-- Freedom Paws ID — pets + biometric enrollment (Track 1)
-- Run in Supabase SQL Editor or via CLI

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Pets (server-backed My Pets)
-- ---------------------------------------------------------------------------
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  breed text not null default '',
  age text not null default '',
  notes text not null default '',
  photo_url text,
  photo_thumb text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pets_owner_id_idx on public.pets (owner_id);

-- ---------------------------------------------------------------------------
-- Biometric enrollments
-- ---------------------------------------------------------------------------
create table if not exists public.biometric_enrollments (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft', 'consented', 'complete', 'revoked')),
  consent_version text,
  consented_at timestamptz,
  freedom_paws_id text,
  qr_slug text,
  current_step smallint not null default 1 check (current_step between 1 and 9),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists biometric_enrollments_owner_idx on public.biometric_enrollments (owner_id);
create index if not exists biometric_enrollments_pet_idx on public.biometric_enrollments (pet_id);

-- ---------------------------------------------------------------------------
-- Enrollment region captures
-- ---------------------------------------------------------------------------
create table if not exists public.enrollment_media (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.biometric_enrollments (id) on delete cascade,
  region text not null check (region in ('eyes', 'face', 'body', 'posture', 'gait')),
  angle text check (angle is null or angle in ('front', 'side', 'left', 'right')),
  storage_url text,
  quality_score numeric(4, 3),
  descriptors jsonb not null default '[]'::jsonb,
  quality_issues jsonb not null default '[]'::jsonb,
  analyzed_at timestamptz not null default now(),
  unique (enrollment_id, region, angle)
);

create index if not exists enrollment_media_enrollment_idx on public.enrollment_media (enrollment_id);

-- ---------------------------------------------------------------------------
-- Updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pets_updated_at on public.pets;
create trigger pets_updated_at
  before update on public.pets
  for each row execute function public.set_updated_at();

drop trigger if exists biometric_enrollments_updated_at on public.biometric_enrollments;
create trigger biometric_enrollments_updated_at
  before update on public.biometric_enrollments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.pets enable row level security;
alter table public.biometric_enrollments enable row level security;
alter table public.enrollment_media enable row level security;

create policy "pets_select_own"
  on public.pets for select
  using (auth.uid() = owner_id);

create policy "pets_insert_own"
  on public.pets for insert
  with check (auth.uid() = owner_id);

create policy "pets_update_own"
  on public.pets for update
  using (auth.uid() = owner_id);

create policy "pets_delete_own"
  on public.pets for delete
  using (auth.uid() = owner_id);

create policy "enrollments_select_own"
  on public.biometric_enrollments for select
  using (auth.uid() = owner_id);

create policy "enrollments_insert_own"
  on public.biometric_enrollments for insert
  with check (auth.uid() = owner_id);

create policy "enrollments_update_own"
  on public.biometric_enrollments for update
  using (auth.uid() = owner_id);

create policy "enrollment_media_select_own"
  on public.enrollment_media for select
  using (
    exists (
      select 1 from public.biometric_enrollments e
      where e.id = enrollment_id and e.owner_id = auth.uid()
    )
  );

create policy "enrollment_media_insert_own"
  on public.enrollment_media for insert
  with check (
    exists (
      select 1 from public.biometric_enrollments e
      where e.id = enrollment_id and e.owner_id = auth.uid()
    )
  );

create policy "enrollment_media_update_own"
  on public.enrollment_media for update
  using (
    exists (
      select 1 from public.biometric_enrollments e
      where e.id = enrollment_id and e.owner_id = auth.uid()
    )
  );

create policy "enrollment_media_delete_own"
  on public.enrollment_media for delete
  using (
    exists (
      select 1 from public.biometric_enrollments e
      where e.id = enrollment_id and e.owner_id = auth.uid()
    )
  );

-- ========== 002_pet_embeddings.sql ==========

-- Freedom Paws ID — embeddings + public QR card lookup
-- Requires: 001_freedom_paws_id.sql

create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- Pet embeddings (pgvector)
-- ---------------------------------------------------------------------------
create table if not exists public.pet_embeddings (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  enrollment_id uuid not null references public.biometric_enrollments (id) on delete cascade,
  embedding vector(1536) not null,
  model_version text not null default 'text-embedding-3-small',
  fused_descriptor_text text not null,
  created_at timestamptz not null default now(),
  unique (enrollment_id)
);

create index if not exists pet_embeddings_pet_id_idx on public.pet_embeddings (pet_id);

create unique index if not exists biometric_enrollments_qr_slug_idx
  on public.biometric_enrollments (qr_slug)
  where qr_slug is not null;

alter table public.pet_embeddings enable row level security;

create policy "embeddings_select_own"
  on public.pet_embeddings for select
  using (
    exists (
      select 1 from public.pets p
      where p.id = pet_id and p.owner_id = auth.uid()
    )
  );

create policy "embeddings_insert_own"
  on public.pet_embeddings for insert
  with check (
    exists (
      select 1 from public.pets p
      where p.id = pet_id and p.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Public pet card (sanitized — no owner PII)
-- ---------------------------------------------------------------------------
create or replace function public.get_pet_card(p_slug text)
returns table (
  freedom_paws_id text,
  pet_name text,
  breed text,
  enrolled_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select e.freedom_paws_id, p.name, p.breed, e.updated_at
  from biometric_enrollments e
  join pets p on p.id = e.pet_id
  where e.qr_slug = p_slug
    and e.status = 'complete'
    and e.freedom_paws_id is not null;
$$;

revoke all on function public.get_pet_card(text) from public;
grant execute on function public.get_pet_card(text) to anon, authenticated;

-- ========== 003_found_match.sql ==========

-- Freedom Paws ID — found-dog intake + match queue (Track 1 pilot)
-- Requires: 001 + 002

-- ---------------------------------------------------------------------------
-- Pilot shelters (CA / TN)
-- ---------------------------------------------------------------------------
create table if not exists public.shelters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null check (state in ('California', 'Tennessee')),
  created_at timestamptz not null default now()
);

insert into public.shelters (name, state)
select v.name, v.state
from (
  values
    ('Freedom Paws Pilot — Los Angeles, CA', 'California'),
    ('Freedom Paws Pilot — San Diego, CA', 'California'),
    ('Freedom Paws Pilot — Nashville, TN', 'Tennessee')
) as v(name, state)
where not exists (select 1 from public.shelters s where s.name = v.name);

-- ---------------------------------------------------------------------------
-- User profiles (roles)
-- ---------------------------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'owner'
    check (role in ('owner', 'shelter_admin', 'shelter_staff', 'vet_staff', 'fp_ops')),
  shelter_id uuid references public.shelters (id) on delete set null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Found dog reports
-- ---------------------------------------------------------------------------
create table if not exists public.found_dog_reports (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid references public.shelters (id) on delete set null,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reporter_role text not null default 'shelter_staff',
  notes text,
  fused_descriptor_text text,
  status text not null default 'submitted'
    check (status in ('submitted', 'searching', 'candidates_ready', 'matched', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists found_dog_reports_shelter_idx on public.found_dog_reports (shelter_id);
create index if not exists found_dog_reports_status_idx on public.found_dog_reports (status);

drop trigger if exists found_dog_reports_updated_at on public.found_dog_reports;
create trigger found_dog_reports_updated_at
  before update on public.found_dog_reports
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Query embedding per found report
-- ---------------------------------------------------------------------------
create table if not exists public.found_report_embeddings (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.found_dog_reports (id) on delete cascade unique,
  embedding vector(1536) not null,
  model_version text not null default 'text-embedding-3-small-v1',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Match candidates
-- ---------------------------------------------------------------------------
create table if not exists public.match_candidates (
  id uuid primary key default gen_random_uuid(),
  found_report_id uuid not null references public.found_dog_reports (id) on delete cascade,
  pet_id uuid not null references public.pets (id) on delete cascade,
  enrollment_id uuid not null references public.biometric_enrollments (id) on delete cascade,
  similarity_score numeric(5, 4) not null,
  review_status text not null default 'pending'
    check (review_status in ('pending', 'approved', 'rejected', 'insufficient_evidence')),
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  unique (found_report_id, enrollment_id)
);

create index if not exists match_candidates_report_idx on public.match_candidates (found_report_id);
create index if not exists match_candidates_status_idx on public.match_candidates (review_status);

-- ---------------------------------------------------------------------------
-- Similarity search (pgvector cosine)
-- ---------------------------------------------------------------------------
create or replace function public.search_pet_embeddings(
  query_embedding vector(1536),
  match_threshold float default 0.72,
  match_count int default 5
)
returns table (
  enrollment_id uuid,
  pet_id uuid,
  similarity float,
  freedom_paws_id text,
  pet_name text,
  breed text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    pe.enrollment_id,
    pe.pet_id,
    (1 - (pe.embedding <=> query_embedding))::float as similarity,
    e.freedom_paws_id,
    p.name as pet_name,
    p.breed
  from pet_embeddings pe
  join biometric_enrollments e on e.id = pe.enrollment_id
  join pets p on p.id = pe.pet_id
  where e.status = 'complete'
    and e.freedom_paws_id is not null
    and (1 - (pe.embedding <=> query_embedding)) >= match_threshold
  order by pe.embedding <=> query_embedding
  limit greatest(1, least(match_count, 20));
$$;

revoke all on function public.search_pet_embeddings(vector, float, int) from public;
grant execute on function public.search_pet_embeddings(vector, float, int) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.shelters enable row level security;
alter table public.user_profiles enable row level security;
alter table public.found_dog_reports enable row level security;
alter table public.found_report_embeddings enable row level security;
alter table public.match_candidates enable row level security;

create policy "shelters_read_all"
  on public.shelters for select
  to authenticated
  using (true);

create policy "profiles_select_own"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "found_reports_select_reporter_or_reviewer"
  on public.found_dog_reports for select
  using (
    auth.uid() = reporter_id
    or exists (
      select 1 from user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'shelter_staff', 'fp_ops')
    )
  );

create policy "found_reports_insert_auth"
  on public.found_dog_reports for insert
  with check (auth.uid() = reporter_id);

create policy "found_reports_update_reviewer"
  on public.found_dog_reports for update
  using (
    exists (
      select 1 from user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'fp_ops')
    )
  );

create policy "found_embeddings_select_reviewer"
  on public.found_report_embeddings for select
  using (
    exists (
      select 1 from found_dog_reports r
      where r.id = report_id
        and (
          r.reporter_id = auth.uid()
          or exists (
            select 1 from user_profiles up
            where up.id = auth.uid()
              and up.role in ('shelter_admin', 'shelter_staff', 'fp_ops')
          )
        )
    )
  );

create policy "found_embeddings_insert_reporter"
  on public.found_report_embeddings for insert
  with check (
    exists (
      select 1 from found_dog_reports r
      where r.id = report_id and r.reporter_id = auth.uid()
    )
  );

create policy "match_candidates_select_reviewer"
  on public.match_candidates for select
  using (
    exists (
      select 1 from user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'shelter_staff', 'fp_ops')
    )
    or exists (
      select 1 from found_dog_reports r
      where r.id = found_report_id and r.reporter_id = auth.uid()
    )
  );

create policy "match_candidates_insert_system"
  on public.match_candidates for insert
  with check (
    exists (
      select 1 from found_dog_reports r
      where r.id = found_report_id and r.reporter_id = auth.uid()
    )
    or exists (
      select 1 from user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

create policy "match_candidates_update_reviewer"
  on public.match_candidates for update
  using (
    exists (
      select 1 from user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'fp_ops')
    )
  );

-- ========== 004_audit_settings.sql ==========

-- Freedom Paws ID — audit log + owner alert preferences

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_actor_idx on public.audit_log (actor_id);
create index if not exists audit_log_resource_idx on public.audit_log (resource_type, resource_id);
create index if not exists audit_log_created_idx on public.audit_log (created_at desc);

alter table public.audit_log enable row level security;

create policy "audit_select_fp_ops"
  on public.audit_log for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

create policy "audit_insert_authenticated"
  on public.audit_log for insert
  with check (auth.uid() = actor_id);

alter table public.user_profiles
  add column if not exists alert_email_enabled boolean not null default true;

