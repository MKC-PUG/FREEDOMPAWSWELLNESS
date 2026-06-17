-- Freedom Paws Adoption Network — adoption listings (Phase 2)
-- Public: available + pending on freedompawsinc.com/adopt/tn (app routes)

-- ---------------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------------
create table if not exists public.adoption_listings (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid not null references public.shelters (id) on delete cascade,
  slug text not null,
  display_name text not null,
  breed_primary text not null,
  breed_secondary text,
  sex text not null default 'unknown'
    check (sex in ('male', 'female', 'unknown')),
  age_band text not null default 'unknown'
    check (age_band in ('puppy', 'young', 'adult', 'senior', 'unknown')),
  size text default 'unknown'
    check (size is null or size in ('small', 'medium', 'large', 'xl', 'unknown')),
  bio text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'available', 'pending', 'adopted', 'archived')),
  photo_urls text[] not null default '{}',
  primary_photo_url text,
  created_by uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  adopted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shelter_id, slug)
);

create index if not exists adoption_listings_shelter_idx
  on public.adoption_listings (shelter_id);

create index if not exists adoption_listings_status_idx
  on public.adoption_listings (status);

create index if not exists adoption_listings_public_idx
  on public.adoption_listings (status, shelter_id)
  where status in ('available', 'pending');

drop trigger if exists adoption_listings_updated_at on public.adoption_listings;
create trigger adoption_listings_updated_at
  before update on public.adoption_listings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.adoption_listings enable row level security;

create policy "adoption_listings_public_read"
  on public.adoption_listings for select
  to anon, authenticated
  using (
    status in ('available', 'pending')
    and exists (
      select 1 from public.shelters s
      where s.id = shelter_id and s.listings_enabled = true
    )
  );

create policy "adoption_listings_partner_read"
  on public.adoption_listings for select
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'shelter_staff', 'fp_ops')
        and (up.role = 'fp_ops' or up.shelter_id = shelter_id)
    )
  );

create policy "adoption_listings_partner_insert"
  on public.adoption_listings for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'shelter_staff', 'fp_ops')
        and (up.role = 'fp_ops' or up.shelter_id = shelter_id)
    )
  );

create policy "adoption_listings_partner_update"
  on public.adoption_listings for update
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'shelter_staff', 'fp_ops')
        and (up.role = 'fp_ops' or up.shelter_id = shelter_id)
    )
  );

-- ---------------------------------------------------------------------------
-- Storage bucket for listing photos (public read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'adoption-listings',
  'adoption-listings',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "adoption_listings_storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'adoption-listings');

create policy "adoption_listings_storage_partner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'adoption-listings'
    and exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'shelter_staff', 'fp_ops')
    )
  );

create policy "adoption_listings_storage_partner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'adoption-listings'
    and exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid()
        and up.role in ('shelter_admin', 'shelter_staff', 'fp_ops')
    )
  );
