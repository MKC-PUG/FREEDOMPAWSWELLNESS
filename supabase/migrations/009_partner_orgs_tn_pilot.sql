-- Freedom Paws Adoption Network — partner org schema + TN pilot seed (6 partners)
-- Phase 1 engineering · May 2026

-- ---------------------------------------------------------------------------
-- Extend shelters → partner organizations
-- ---------------------------------------------------------------------------
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

create unique index if not exists shelters_slug_unique
  on public.shelters (slug)
  where slug is not null;

drop trigger if exists shelters_updated_at on public.shelters;
create trigger shelters_updated_at
  before update on public.shelters
  for each row execute function public.set_updated_at();

-- Backfill state_code from legacy state column
update public.shelters
set state_code = case
  when state = 'Tennessee' then 'TN'
  when state = 'California' then 'CA'
  else state_code
end
where state_code is null;

-- Remove legacy placeholder pilot rows (pre-launch; not the TN Adoption Network partners)
delete from public.shelters
where name like 'Freedom Paws Pilot%';

-- ---------------------------------------------------------------------------
-- TN pilot partners — municipal (3) + private (3)
-- ---------------------------------------------------------------------------
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
