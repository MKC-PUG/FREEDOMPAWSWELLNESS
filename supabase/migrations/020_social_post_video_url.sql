-- Public https address of the finished CapCut mp4.
-- Buffer downloads this file when the post is created and again when it publishes.
-- Run in Supabase SQL Editor after 015_social_posts.sql.

alter table public.social_posts
  add column if not exists video_url text;
