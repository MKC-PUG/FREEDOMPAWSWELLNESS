-- Freedom Paws ID — intake mirror embeddings (found-dog match alignment)
-- Requires: 001–004
-- Run in Supabase SQL Editor after prior migrations.

alter table public.pet_embeddings
  add column if not exists intake_mirror_embedding vector(1536),
  add column if not exists intake_mirror_descriptor_text text;

comment on column public.pet_embeddings.intake_mirror_embedding is
  'Embedding fused like shelter found intake (eyes, face, body, posture) for max-similarity search';

-- Search uses best of full enrollment embedding vs intake mirror
create or replace function public.search_pet_embeddings(
  query_embedding vector(1536),
  match_threshold float default 0.72,
  match_count int default 5
)
returns table (
  enrollment_id uuid,
  pet_id uuid,
  similarity float,
  freedom_paws_id text,
  pet_name text,
  breed text
)
language sql
stable
security definer
set search_path = public
as $$
  with scored as (
    select
      pe.enrollment_id,
      pe.pet_id,
      e.freedom_paws_id,
      p.name as pet_name,
      p.breed,
      greatest(
        (1 - (pe.embedding <=> query_embedding))::float,
        case
          when pe.intake_mirror_embedding is not null then
            (1 - (pe.intake_mirror_embedding <=> query_embedding))::float
          else 0::float
        end
      )::float as similarity
    from pet_embeddings pe
    join biometric_enrollments e on e.id = pe.enrollment_id
    join pets p on p.id = pe.pet_id
    where e.status = 'complete'
      and e.freedom_paws_id is not null
  )
  select
    scored.enrollment_id,
    scored.pet_id,
    scored.similarity,
    scored.freedom_paws_id,
    scored.pet_name,
    scored.breed
  from scored
  where scored.similarity >= match_threshold
  order by scored.similarity desc
  limit greatest(1, least(match_count, 20));
$$;

revoke all on function public.search_pet_embeddings(vector, float, int) from public;
grant execute on function public.search_pet_embeddings(vector, float, int) to authenticated;
