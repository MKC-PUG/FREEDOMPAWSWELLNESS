-- Freedom Paws ID Track 2 — microchip on pet profile + scan audit log
-- Run in Supabase SQL Editor after 001–013

alter table public.pets
  add column if not exists microchip_id text,
  add column if not exists microchip_id_normalized text,
  add column if not exists microchip_linked_at timestamptz;

create unique index if not exists pets_microchip_id_normalized_unique
  on public.pets (microchip_id_normalized)
  where microchip_id_normalized is not null;

comment on column public.pets.microchip_id is 'Display microchip ID as scanned (9/10/15 digit)';
comment on column public.pets.microchip_id_normalized is 'Digits-only normalized ID for lookup';

-- ---------------------------------------------------------------------------
-- Shelter / owner scan events (audit)
-- ---------------------------------------------------------------------------
create table if not exists public.chip_scan_events (
  id uuid primary key default gen_random_uuid(),
  scanner_user_id uuid references auth.users (id) on delete set null,
  shelter_id uuid references public.shelters (id) on delete set null,
  raw_input text not null,
  normalized_id text,
  digit_count smallint,
  validation_status text not null check (validation_status in ('valid', 'invalid', 'checksum_fail')),
  freedom_paws_pet_id uuid references public.pets (id) on delete set null,
  source text not null default 'manual' check (source in ('hid', 'manual', 'web_serial')),
  created_at timestamptz not null default now()
);

create index if not exists chip_scan_events_created_idx
  on public.chip_scan_events (created_at desc);

create index if not exists chip_scan_events_normalized_idx
  on public.chip_scan_events (normalized_id)
  where normalized_id is not null;

alter table public.chip_scan_events enable row level security;

create policy "chip_scan_events_insert_own"
  on public.chip_scan_events for insert
  with check (auth.uid() = scanner_user_id);

create policy "chip_scan_events_select_fp_ops"
  on public.chip_scan_events for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

create policy "chip_scan_events_select_shelter_staff"
  on public.chip_scan_events for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'shelter_staff', 'vet_staff')
    )
  );
