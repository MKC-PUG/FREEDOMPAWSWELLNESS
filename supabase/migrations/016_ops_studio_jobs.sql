-- Studio desk jobs: SuperBud video + social package, and general agent tasks.
-- Run in Supabase SQL Editor after 015_social_posts.sql

create table if not exists public.ops_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('superbud_video', 'general')),
  seat text not null check (seat in ('fact', 'bud', 'echo', 'forge', 'lex')),
  status text not null default 'research'
    check (status in ('research', 'script', 'rendering', 'watch', 'queued', 'done', 'hold')),
  title text not null,
  catalog_code text,
  pillar text,
  platform text not null default 'instagram',
  cta_path text not null default '',
  fact_card text not null default '',
  script text not null default '',
  do_not_say text not null default '',
  echo_caption text not null default '',
  echo_article text not null default '',
  echo_ads jsonb not null default '[]'::jsonb,
  prompt text not null default '',
  audio_url text,
  audio_asset_id text,
  rendered_script text,
  video_url text,
  heygen_video_id text,
  social_post_id uuid references public.social_posts (id) on delete set null,
  error_message text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ops_jobs_status_idx on public.ops_jobs (status, created_at desc);

alter table public.ops_jobs enable row level security;

drop policy if exists "ops_jobs_fp_ops_select" on public.ops_jobs;
create policy "ops_jobs_fp_ops_select"
  on public.ops_jobs for select
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

drop policy if exists "ops_jobs_fp_ops_insert" on public.ops_jobs;
create policy "ops_jobs_fp_ops_insert"
  on public.ops_jobs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

drop policy if exists "ops_jobs_fp_ops_update" on public.ops_jobs;
create policy "ops_jobs_fp_ops_update"
  on public.ops_jobs for update
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

drop policy if exists "ops_jobs_fp_ops_delete" on public.ops_jobs;
create policy "ops_jobs_fp_ops_delete"
  on public.ops_jobs for delete
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );
