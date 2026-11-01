-- Canva layout draft on a Studio job. Empty until you ask for one.
-- status inside the object is ready or approved. Approval is a separate click.
-- Run in the Supabase SQL Editor after 018_ops_job_storyboard.sql.

alter table public.ops_jobs
  add column if not exists canva_draft jsonb not null default '{}'::jsonb;
