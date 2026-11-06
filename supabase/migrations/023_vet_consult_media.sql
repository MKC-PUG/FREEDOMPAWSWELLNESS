-- Gait clips, the video file, and a private link for a veterinary visit.
-- Safe to run once. The visit link shows notes, pictures, and walking videos.

alter table public.pet_vault_entries drop constraint if exists pet_vault_entries_kind_check;

alter table public.pet_vault_entries
  add constraint pet_vault_entries_kind_check
  check (kind in ('vet_record', 'vaccination', 'daily_note', 'gait_clip'));

alter table public.pet_vault_entries
  add column if not exists storage_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pet-vault-media',
  'pet-vault-media',
  false,
  26214400,
  array['video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.pet_vault_shares (
  token text primary key,
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.pet_vault_shares enable row level security;

comment on table public.pet_vault_shares is
  'Owner-created visit links. A veterinarian opens one link for notes, pictures, and gait video. No public read policy; the app server reads with the service role.';
