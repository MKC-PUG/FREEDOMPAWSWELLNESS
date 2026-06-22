-- Freedom Paws — run 011 + 012 in Supabase SQL Editor (single paste)
-- Dashboard → SQL Editor → New query → paste → Run

-- ========== 011: Public TN pilot shelter read (fixes empty /adopt/tn partner list) ==========
drop policy if exists "shelters_public_pilot_read" on public.shelters;
create policy "shelters_public_pilot_read"
  on public.shelters for select
  to anon, authenticated
  using (
    listings_enabled = true
    and pilot_tier = 'tn_pilot'
    and slug is not null
  );

-- ========== 012: Ops Command Center settings ==========
create table if not exists public.ops_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.ops_settings enable row level security;

drop policy if exists "ops_settings_fp_ops_select" on public.ops_settings;
create policy "ops_settings_fp_ops_select"
  on public.ops_settings for select
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

drop policy if exists "ops_settings_fp_ops_insert" on public.ops_settings;
create policy "ops_settings_fp_ops_insert"
  on public.ops_settings for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

drop policy if exists "ops_settings_fp_ops_update" on public.ops_settings;
create policy "ops_settings_fp_ops_update"
  on public.ops_settings for update
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

insert into public.ops_settings (key, value)
values (
  'marketing_automation',
  '{
    "emergencyStop": true,
    "masterEnabled": false,
    "workflows": {
      "a": false, "b": false, "c": false, "d": false, "e": false,
      "f": false, "g": false, "h": false, "i": false
    },
    "partnerApprovals": {},
    "n8nWebhookUrl": null
  }'::jsonb
)
on conflict (key) do nothing;

insert into public.ops_settings (key, value)
values (
  'feature_flags',
  '{
    "adoptDirectoryPublic": true,
    "waitlistOpen": true,
    "photoboothEnabled": true
  }'::jsonb
)
on conflict (key) do nothing;
