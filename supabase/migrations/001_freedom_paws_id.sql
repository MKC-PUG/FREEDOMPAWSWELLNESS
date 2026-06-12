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
