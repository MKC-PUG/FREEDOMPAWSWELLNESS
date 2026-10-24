-- FORGE is no longer a studio agent seat. Drop those jobs, then tighten the seat check.
-- Run in Supabase SQL Editor after 018_ops_job_storyboard.sql

delete from public.ops_jobs where seat = 'forge';

alter table public.ops_jobs drop constraint if exists ops_jobs_seat_check;

alter table public.ops_jobs
  add constraint ops_jobs_seat_check
  check (seat in ('fact', 'bud', 'echo', 'lex'));
