-- Storyboard choices for a SuperBud render: plate, motion, and on-screen title.
-- Run in the Supabase SQL Editor after 017_ops_job_all_platforms.sql

alter table public.ops_jobs
  add column if not exists background_id text not null default 'locked',
  add column if not exists motion_id text not null default 'subtle',
  add column if not exists on_screen_text text not null default '';
