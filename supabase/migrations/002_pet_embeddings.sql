-- Freedom Paws ID — embeddings + public QR card lookup
-- Requires: 001_freedom_paws_id.sql

create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- Pet embeddings (pgvector)
-- ---------------------------------------------------------------------------
create table if not exists public.pet_embeddings (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  enrollment_id uuid not null references public.biometric_enrollments (id) on delete cascade,
  embedding vector(1536) not null,
  model_version text not null default 'text-embedding-3-small',
  fused_descriptor_text text not null,
  created_at timestamptz not null default now(),
  unique (enrollment_id)
);

create index if not exists pet_embeddings_pet_id_idx on public.pet_embeddings (pet_id);

create unique index if not exists biometric_enrollments_qr_slug_idx
  on public.biometric_enrollments (qr_slug)
  where qr_slug is not null;

alter table public.pet_embeddings enable row level security;

create policy "embeddings_select_own"
  on public.pet_embeddings for select
  using (
    exists (
      select 1 from public.pets p
      where p.id = pet_id and p.owner_id = auth.uid()
    )
  );

create policy "embeddings_insert_own"
  on public.pet_embeddings for insert
  with check (
    exists (
      select 1 from public.pets p
      where p.id = pet_id and p.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Public pet card (sanitized — no owner PII)
-- ---------------------------------------------------------------------------
create or replace function public.get_pet_card(p_slug text)
returns table (
  freedom_paws_id text,
  pet_name text,
  breed text,
  enrolled_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select e.freedom_paws_id, p.name, p.breed, e.updated_at
  from biometric_enrollments e
  join pets p on p.id = e.pet_id
  where e.qr_slug = p_slug
    and e.status = 'complete'
    and e.freedom_paws_id is not null;
$$;

revoke all on function public.get_pet_card(text) from public;
grant execute on function public.get_pet_card(text) to anon, authenticated;
