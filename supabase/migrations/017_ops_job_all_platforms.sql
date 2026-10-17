-- One SuperBud job can queue Instagram, TikTok, YouTube, and Facebook together.
-- Run in Supabase SQL Editor after 016_ops_studio_jobs.sql

alter table public.ops_jobs
  add column if not exists social_post_ids jsonb not null default '[]'::jsonb;
