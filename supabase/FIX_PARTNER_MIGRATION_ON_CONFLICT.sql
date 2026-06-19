-- FIX: Run this ENTIRE file in Supabase SQL Editor (one shot).
--
-- If you saw 42P10 (ON CONFLICT) or 42703 (column "slug" does not exist):
-- Supabase rolls back the whole script on error — schema + seed must run together here.

-- ========== 009 — partner columns on shelters ==========

alter table public.shelters
  add column if not exists slug text,
  add column if not exists org_type text
    check (org_type is null or org_type in ('municipal', 'county', 'private')),
  add column if not exists city text,
  add column if not exists county text,
  add column if not exists state_code char(2),
  add column if not exists pilot_tier text not null default 'tn_pilot'
    check (pilot_tier in ('tn_pilot', 'national', 'waitlist')),
  add column if not exists listings_enabled boolean not null default true,
  add column if not exists website text,
  add column if not exists phone text,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists shelters_updated_at on public.shelters;
create trigger shelters_updated_at
  before update on public.shelters
  for each row execute function public.set_updated_at();

update public.shelters
set state_code = case
  when state = 'Tennessee' then 'TN'
  when state = 'California' then 'CA'
  else state_code
end
where state_code is null;

delete from public.shelters
where name like 'Freedom Paws Pilot%';

-- Full unique index (required for ON CONFLICT (slug))
drop index if exists public.shelters_slug_unique;
create unique index if not exists shelters_slug_unique on public.shelters (slug);

-- ========== 009 — seed TN pilot partners ==========
insert into public.shelters (
  name, state, state_code, slug, org_type, city, county,
  pilot_tier, listings_enabled, website, phone
)
values
  (
    'Memphis Animal Services',
    'Tennessee', 'TN', 'memphis-animal-services', 'municipal',
    'Memphis', 'Shelby', 'tn_pilot', true,
    'https://memphisanimalservices.com', '901-636-1416'
  ),
  (
    'Metro Animal Care and Control',
    'Tennessee', 'TN', 'metro-animal-care-control', 'municipal',
    'Nashville', 'Davidson', 'tn_pilot', true,
    'https://www.nashville.gov/departments/health/animal-care-and-control',
    '615-862-7928'
  ),
  (
    'Young-Williams Animal Center',
    'Tennessee', 'TN', 'young-williams-animal-center', 'municipal',
    'Knoxville', 'Knox', 'tn_pilot', true,
    'https://www.young-williams.org', '865-215-6599'
  ),
  (
    'New Leash on Life',
    'Tennessee', 'TN', 'new-leash-on-life', 'private',
    'Lebanon', 'Wilson', 'tn_pilot', true,
    'https://www.newleashonline.org', '615-444-1144'
  ),
  (
    'Humane Society of Sumner County',
    'Tennessee', 'TN', 'humane-society-sumner-county', 'private',
    'Hendersonville', 'Sumner', 'tn_pilot', true,
    'https://www.sumnerhumane.org', null
  ),
  (
    'Safe Place for Animals',
    'Tennessee', 'TN', 'safe-place-for-animals', 'private',
    'Gallatin', 'Sumner', 'tn_pilot', true,
    'https://safeplaceforanimals.com', null
  )
on conflict (slug) do update set
  name = excluded.name,
  state = excluded.state,
  state_code = excluded.state_code,
  org_type = excluded.org_type,
  city = excluded.city,
  county = excluded.county,
  pilot_tier = excluded.pilot_tier,
  listings_enabled = excluded.listings_enabled,
  website = excluded.website,
  phone = excluded.phone,
  updated_at = now();

-- ========== 010 — adoption listings + RLS + storage ==========
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

alter table public.adoption_listings enable row level security;

drop policy if exists "adoption_listings_public_read" on public.adoption_listings;
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

drop policy if exists "adoption_listings_partner_read" on public.adoption_listings;
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

drop policy if exists "adoption_listings_partner_insert" on public.adoption_listings;
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

drop policy if exists "adoption_listings_partner_update" on public.adoption_listings;
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

drop policy if exists "adoption_listings_storage_public_read" on storage.objects;
create policy "adoption_listings_storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'adoption-listings');

drop policy if exists "adoption_listings_storage_partner_upload" on storage.objects;
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

drop policy if exists "adoption_listings_storage_partner_delete" on storage.objects;
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
