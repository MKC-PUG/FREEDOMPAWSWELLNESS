-- Freedom Paws ID — audit log + owner alert preferences

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_actor_idx on public.audit_log (actor_id);
create index if not exists audit_log_resource_idx on public.audit_log (resource_type, resource_id);
create index if not exists audit_log_created_idx on public.audit_log (created_at desc);

alter table public.audit_log enable row level security;

create policy "audit_select_fp_ops"
  on public.audit_log for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'fp_ops'
    )
  );

create policy "audit_insert_authenticated"
  on public.audit_log for insert
  with check (auth.uid() = actor_id);

alter table public.user_profiles
  add column if not exists alert_email_enabled boolean not null default true;
