-- Social content pipeline for Ops Marketing (SuperBud production arm)
-- Run in Supabase SQL Editor after 012_ops_settings.sql

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  pillar text not null,
  platform text not null default 'instagram',
  status text not null default 'draft'
    check (status in ('draft', 'needs_approval', 'approved', 'scheduled', 'posted', 'failed', 'archived')),
  title text not null,
  caption text not null default '',
  cta_url text not null default '',
  hashtags text[] not null default '{}',
  script text,
  storyboard jsonb not null default '[]'::jsonb,
  production_checklist jsonb not null default '[]'::jsonb,
  buffer_payload jsonb,
  buffer_sent_at timestamptz,
  scheduled_for timestamptz,
  posted_at timestamptz,
  error_message text,
  created_by uuid references auth.users (id) on delete set null,
  approved_by uuid references auth.users (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists social_posts_status_idx on public.social_posts (status, created_at desc);
create index if not exists social_posts_pillar_idx on public.social_posts (pillar);

alter table public.social_posts enable row level security;

drop policy if exists "social_posts_fp_ops_select" on public.social_posts;
create policy "social_posts_fp_ops_select"
  on public.social_posts for select
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

drop policy if exists "social_posts_fp_ops_insert" on public.social_posts;
create policy "social_posts_fp_ops_insert"
  on public.social_posts for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

drop policy if exists "social_posts_fp_ops_update" on public.social_posts;
create policy "social_posts_fp_ops_update"
  on public.social_posts for update
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

drop policy if exists "social_posts_fp_ops_delete" on public.social_posts;
create policy "social_posts_fp_ops_delete"
  on public.social_posts for delete
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );
