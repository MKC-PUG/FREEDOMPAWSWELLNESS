-- AI Magic Look credits (Photo Booth costumes + future metered AI)
-- Requires: auth.users (Supabase Auth)
-- Run in Supabase SQL Editor after 001–007.

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------
create table if not exists public.ai_credit_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  guest_key text,
  tier text not null default 'guest'
    check (tier in ('guest', 'free', 'member', 'founding')),
  credits_balance int not null default 0,
  monthly_allowance int not null default 3,
  allowance_reset_at timestamptz not null default (date_trunc('month', now()) + interval '1 month'),
  daily_used int not null default 0,
  daily_reset_on date not null default (timezone('utc', now()))::date,
  last_costume_at timestamptz,
  lifetime_used int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_credit_owner_or_guest check (
    (owner_id is not null and guest_key is null)
    or (owner_id is null and guest_key is not null)
  )
);

create unique index if not exists ai_credit_accounts_owner_uidx
  on public.ai_credit_accounts (owner_id)
  where owner_id is not null;

create unique index if not exists ai_credit_accounts_guest_uidx
  on public.ai_credit_accounts (guest_key)
  where guest_key is not null;

comment on table public.ai_credit_accounts is
  'Metered AI credits for Photo Booth Magic Look and future AI features';

-- ---------------------------------------------------------------------------
-- Ledger (audit trail)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.ai_credit_accounts(id) on delete cascade,
  delta int not null,
  reason text not null,
  costume_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_credit_ledger_account_created_idx
  on public.ai_credit_ledger (account_id, created_at desc);

comment on table public.ai_credit_ledger is
  'Append-only log of credit grants, purchases, and consumption';

-- ---------------------------------------------------------------------------
-- Pack purchases (Stripe top-ups — webhook fills this later)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_credit_pack_purchases (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.ai_credit_accounts(id) on delete cascade,
  pack_code text not null,
  credits_granted int not null,
  amount_cents int,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create unique index if not exists ai_credit_pack_stripe_session_uidx
  on public.ai_credit_pack_purchases (stripe_session_id)
  where stripe_session_id is not null;

alter table public.ai_credit_accounts enable row level security;
alter table public.ai_credit_ledger enable row level security;
alter table public.ai_credit_pack_purchases enable row level security;

-- Owners may read their own balance (writes via service role / RPC only)
create policy "Owners read own ai credits"
  on public.ai_credit_accounts
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy "Owners read own ai credit ledger"
  on public.ai_credit_ledger
  for select
  to authenticated
  using (
    exists (
      select 1 from public.ai_credit_accounts a
      where a.id = account_id and a.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Helpers: reset periods & grant monthly allowance
-- ---------------------------------------------------------------------------
create or replace function public.ai_credits_apply_period_reset(p_account_id uuid)
returns public.ai_credit_accounts
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.ai_credit_accounts%rowtype;
  v_today date := (timezone('utc', now()))::date;
begin
  select * into v from public.ai_credit_accounts where id = p_account_id for update;
  if not found then
    raise exception 'account not found';
  end if;

  if v.daily_reset_on < v_today then
    v.daily_used := 0;
    v.daily_reset_on := v_today;
  end if;

  if v.allowance_reset_at <= now() then
    v.credits_balance := v.monthly_allowance;
    v.allowance_reset_at := date_trunc('month', now()) + interval '1 month';
  end if;

  v.updated_at := now();
  update public.ai_credit_accounts set
    daily_used = v.daily_used,
    daily_reset_on = v.daily_reset_on,
    credits_balance = v.credits_balance,
    allowance_reset_at = v.allowance_reset_at,
    updated_at = v.updated_at
  where id = p_account_id;

  return v;
end;
$$;

-- ---------------------------------------------------------------------------
-- Get or create account (service role / security definer)
-- ---------------------------------------------------------------------------
create or replace function public.ai_credits_get_or_create(
  p_owner_id uuid,
  p_guest_key text,
  p_guest_monthly int default 3,
  p_free_monthly int default 5,
  p_member_monthly int default 20,
  p_founding_monthly int default 30
)
returns public.ai_credit_accounts
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.ai_credit_accounts%rowtype;
  v_monthly int;
  v_tier text;
begin
  if p_owner_id is not null then
    select * into v from public.ai_credit_accounts where owner_id = p_owner_id;
    if found then
      return public.ai_credits_apply_period_reset(v.id);
    end if;
    v_tier := 'free';
    v_monthly := p_free_monthly;
    insert into public.ai_credit_accounts (
      owner_id, tier, credits_balance, monthly_allowance
    ) values (
      p_owner_id, v_tier, v_monthly, v_monthly
    )
    returning * into v;
    insert into public.ai_credit_ledger (account_id, delta, reason)
    values (v.id, v_monthly, 'initial_monthly_grant');
    return v;
  end if;

  if p_guest_key is null or length(trim(p_guest_key)) < 8 then
    raise exception 'guest_key required for anonymous users';
  end if;

  select * into v from public.ai_credit_accounts where guest_key = p_guest_key;
  if found then
    return public.ai_credits_apply_period_reset(v.id);
  end if;

  v_monthly := p_guest_monthly;
  insert into public.ai_credit_accounts (
    guest_key, tier, credits_balance, monthly_allowance
  ) values (
    p_guest_key, 'guest', v_monthly, v_monthly
  )
  returning * into v;
  insert into public.ai_credit_ledger (account_id, delta, reason)
  values (v.id, v_monthly, 'initial_monthly_grant');
  return v;
end;
$$;

-- ---------------------------------------------------------------------------
-- Consume one credit (atomic) — returns JSON status
-- ---------------------------------------------------------------------------
create or replace function public.ai_credits_consume_magic_look(
  p_owner_id uuid,
  p_guest_key text,
  p_costume_id text,
  p_guest_monthly int default 3,
  p_free_monthly int default 5,
  p_member_monthly int default 20,
  p_founding_monthly int default 30,
  p_daily_cap int default 10,
  p_guest_daily_cap int default 5,
  p_min_interval_seconds int default 25
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.ai_credit_accounts%rowtype;
  v_daily_cap int;
  v_wait_seconds int;
begin
  v := public.ai_credits_get_or_create(
    p_owner_id, p_guest_key,
    p_guest_monthly, p_free_monthly, p_member_monthly, p_founding_monthly
  );

  v_daily_cap := case when v.tier = 'guest' then p_guest_daily_cap else p_daily_cap end;

  if v.last_costume_at is not null then
    v_wait_seconds := p_min_interval_seconds - extract(epoch from (now() - v.last_costume_at))::int;
    if v_wait_seconds > 0 then
      return jsonb_build_object(
        'allowed', false,
        'error_code', 'rate_limit',
        'wait_seconds', v_wait_seconds,
        'remaining', v.credits_balance,
        'tier', v.tier
      );
    end if;
  end if;

  if v.daily_used >= v_daily_cap then
    return jsonb_build_object(
      'allowed', false,
      'error_code', 'daily_cap',
      'remaining', v.credits_balance,
      'daily_cap', v_daily_cap,
      'tier', v.tier
    );
  end if;

  if v.credits_balance < 1 then
    return jsonb_build_object(
      'allowed', false,
      'error_code', 'no_credits',
      'remaining', 0,
      'monthly_allowance', v.monthly_allowance,
      'allowance_reset_at', v.allowance_reset_at,
      'tier', v.tier
    );
  end if;

  update public.ai_credit_accounts set
    credits_balance = credits_balance - 1,
    daily_used = daily_used + 1,
    lifetime_used = lifetime_used + 1,
    last_costume_at = now(),
    updated_at = now()
  where id = v.id
  returning * into v;

  insert into public.ai_credit_ledger (account_id, delta, reason, costume_id)
  values (v.id, -1, 'magic_look_costume', p_costume_id);

  return jsonb_build_object(
    'allowed', true,
    'remaining', v.credits_balance,
    'daily_used', v.daily_used,
    'daily_cap', v_daily_cap,
    'monthly_allowance', v.monthly_allowance,
    'allowance_reset_at', v.allowance_reset_at,
    'tier', v.tier
  );
end;
$$;

-- Refund on failed AI generation
create or replace function public.ai_credits_refund_magic_look(
  p_owner_id uuid,
  p_guest_key text,
  p_costume_id text,
  p_reason text default 'generation_failed'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.ai_credit_accounts%rowtype;
begin
  if p_owner_id is not null then
    select * into v from public.ai_credit_accounts where owner_id = p_owner_id for update;
  else
    select * into v from public.ai_credit_accounts where guest_key = p_guest_key for update;
  end if;

  if not found then
    return jsonb_build_object('refunded', false);
  end if;

  update public.ai_credit_accounts set
    credits_balance = credits_balance + 1,
    daily_used = greatest(0, daily_used - 1),
    updated_at = now()
  where id = v.id
  returning * into v;

  insert into public.ai_credit_ledger (account_id, delta, reason, costume_id, metadata)
  values (v.id, 1, p_reason, p_costume_id, jsonb_build_object('refund', true));

  return jsonb_build_object('refunded', true, 'remaining', v.credits_balance);
end;
$$;

-- Grant credits (pack purchase / admin)
create or replace function public.ai_credits_grant(
  p_account_id uuid,
  p_amount int,
  p_reason text,
  p_metadata jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.ai_credit_accounts%rowtype;
begin
  if p_amount < 1 then
    raise exception 'grant amount must be positive';
  end if;

  update public.ai_credit_accounts set
    credits_balance = credits_balance + p_amount,
    updated_at = now()
  where id = p_account_id
  returning * into v;

  if not found then
    raise exception 'account not found';
  end if;

  insert into public.ai_credit_ledger (account_id, delta, reason, metadata)
  values (v.id, p_amount, p_reason, p_metadata);

  return jsonb_build_object('remaining', v.credits_balance, 'granted', p_amount);
end;
$$;

-- Status only (no consume)
create or replace function public.ai_credits_status(
  p_owner_id uuid,
  p_guest_key text,
  p_guest_monthly int default 3,
  p_free_monthly int default 5,
  p_member_monthly int default 20,
  p_founding_monthly int default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.ai_credit_accounts%rowtype;
  v_daily_cap int;
begin
  v := public.ai_credits_get_or_create(
    p_owner_id, p_guest_key,
    p_guest_monthly, p_free_monthly, p_member_monthly, p_founding_monthly
  );
  v_daily_cap := case when v.tier = 'guest' then 5 else 10 end;

  return jsonb_build_object(
    'remaining', v.credits_balance,
    'monthly_allowance', v.monthly_allowance,
    'allowance_reset_at', v.allowance_reset_at,
    'daily_used', v.daily_used,
    'daily_cap', v_daily_cap,
    'tier', v.tier,
    'lifetime_used', v.lifetime_used
  );
end;
$$;

revoke all on function public.ai_credits_apply_period_reset(uuid) from public;
revoke all on function public.ai_credits_get_or_create(uuid, text, int, int, int, int) from public;
revoke all on function public.ai_credits_consume_magic_look(uuid, text, text, int, int, int, int, int, int, int) from public;
revoke all on function public.ai_credits_refund_magic_look(uuid, text, text, text) from public;
revoke all on function public.ai_credits_grant(uuid, int, text, jsonb) from public;
revoke all on function public.ai_credits_status(uuid, text, int, int, int, int) from public;
