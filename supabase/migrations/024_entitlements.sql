-- Cash register: a membership or pass is a row on the server, tied to the account.
-- Run once in the Supabase SQL editor for project freedom-paws-id.

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('founding_annual', 'annual', 'monthly', 'pass')),
  status text not null default 'active' check (status in ('active', 'canceled')),
  protocol_slug text,
  period_end timestamptz not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_session_id text,
  source text not null check (source in ('stripe', 'xaman')),
  xumm_uuid text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entitlements_pass_slug check (
    (plan = 'pass' and protocol_slug is not null)
    or (plan <> 'pass' and protocol_slug is null)
  )
);

create unique index if not exists entitlements_one_membership
  on public.entitlements (user_id)
  where plan <> 'pass';

create unique index if not exists entitlements_one_pass
  on public.entitlements (user_id, protocol_slug)
  where plan = 'pass';

create unique index if not exists entitlements_stripe_session
  on public.entitlements (stripe_session_id)
  where stripe_session_id is not null;

create unique index if not exists entitlements_xumm_uuid
  on public.entitlements (xumm_uuid)
  where xumm_uuid is not null;

alter table public.entitlements enable row level security;

drop policy if exists "Accounts read own entitlements" on public.entitlements;
create policy "Accounts read own entitlements"
  on public.entitlements
  for select
  to authenticated
  using (user_id = auth.uid());

create table if not exists public.scan_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('vit', 'label')),
  created_at timestamptz not null default now()
);

create index if not exists scan_usage_user_kind_created_idx
  on public.scan_usage (user_id, kind, created_at desc);

alter table public.scan_usage enable row level security;

drop policy if exists "Accounts read own scan usage" on public.scan_usage;
create policy "Accounts read own scan usage"
  on public.scan_usage
  for select
  to authenticated
  using (user_id = auth.uid());
