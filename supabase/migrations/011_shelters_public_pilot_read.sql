-- Allow anonymous read of TN pilot shelters for public /adopt/tn directory
-- Run in Supabase SQL Editor if partner orgs API returns empty for anon users

drop policy if exists "shelters_public_pilot_read" on public.shelters;
create policy "shelters_public_pilot_read"
  on public.shelters for select
  to anon, authenticated
  using (
    listings_enabled = true
    and pilot_tier = 'tn_pilot'
    and slug is not null
  );
