-- My Pets wellness vault — vet records, vaccinations, daily notes
-- Requires: 001–006

create table if not exists public.pet_vault_entries (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('vet_record', 'vaccination', 'daily_note')),
  title text not null,
  body text not null default '',
  record_date date,
  attachment_thumb text,
  attachment_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pet_vault_entries_pet_kind_idx
  on public.pet_vault_entries (pet_id, kind, record_date desc nulls last);

comment on table public.pet_vault_entries is
  'My Pets wellness vault — vet records, vaccinations, daily notes (compressed image thumbs)';

alter table public.pet_vault_entries enable row level security;

create policy "Owners read own vault entries"
  on public.pet_vault_entries
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy "Owners insert own vault entries"
  on public.pet_vault_entries
  for insert
  to authenticated
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.pets p
      where p.id = pet_id and p.owner_id = auth.uid()
    )
  );

create policy "Owners delete own vault entries"
  on public.pet_vault_entries
  for delete
  to authenticated
  using (owner_id = auth.uid());

create or replace function public.set_pet_vault_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pet_vault_entries_updated_at on public.pet_vault_entries;
create trigger pet_vault_entries_updated_at
  before update on public.pet_vault_entries
  for each row execute function public.set_pet_vault_updated_at();
