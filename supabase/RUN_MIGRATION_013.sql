-- Tennessee-only shelter pilot (migration 013)
-- Paste in Supabase Dashboard → SQL Editor → Run
-- Or: SUPABASE_DB_URL=postgresql://... npm run pilot:migrate

-- Shelter pilot: Tennessee only (expand to additional states via future migrations)
-- Removes legacy California placeholder rows and tightens state constraint.

delete from public.shelters
where state = 'California';

alter table public.shelters
  drop constraint if exists shelters_state_check;

alter table public.shelters
  add constraint shelters_state_check
  check (state = 'Tennessee');

-- Verify
select state, count(*) as shelters
from public.shelters
group by state
order by state;
