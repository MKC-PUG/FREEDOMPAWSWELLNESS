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
