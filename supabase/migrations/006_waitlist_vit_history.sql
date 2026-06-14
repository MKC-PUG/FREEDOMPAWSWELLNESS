-- Sprint 1/2: founding waitlist + ViT run history per pet
-- Requires: 001–005

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_unique unique (email)
);

comment on table public.waitlist_signups is
  'Founding community waitlist — inserted via API (service role)';

alter table public.waitlist_signups enable row level security;

create table if not exists public.pet_vit_runs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  primary_protocol_slug text,
  primary_protocol_title text,
  primary_confidence smallint,
  secondary_protocol_slug text,
  secondary_protocol_title text,
  vet_urgent boolean not null default false,
  media_type text,
  analysis_id text,
  created_at timestamptz not null default now()
);

create index if not exists pet_vit_runs_pet_created_idx
  on public.pet_vit_runs (pet_id, created_at desc);

comment on table public.pet_vit_runs is
  'Last ViT diagnostic runs per pet for My Pets history';

alter table public.pet_vit_runs enable row level security;

create policy "Owners read own pet vit runs"
  on public.pet_vit_runs
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy "Owners insert own pet vit runs"
  on public.pet_vit_runs
  for insert
  to authenticated
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.pets p
      where p.id = pet_id and p.owner_id = auth.uid()
    )
  );
