import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { VitRunSummary } from '@/lib/vit/history';

type VitRunRow = {
  id: string;
  pet_id: string;
  primary_protocol_slug: string | null;
  primary_protocol_title: string | null;
  primary_confidence: number | null;
  secondary_protocol_slug: string | null;
  secondary_protocol_title: string | null;
  vet_urgent: boolean;
  media_type: string | null;
  created_at: string;
};

function rowToSummary(row: VitRunRow, petName: string | null): VitRunSummary {
  return {
    id: row.id,
    petId: row.pet_id,
    petName,
    primarySlug: row.primary_protocol_slug,
    primaryTitle: row.primary_protocol_title,
    primaryConfidence: row.primary_confidence,
    secondarySlug: row.secondary_protocol_slug,
    secondaryTitle: row.secondary_protocol_title,
    vetUrgent: row.vet_urgent,
    mediaType: row.media_type,
    createdAt: row.created_at,
  };
}

export type VitRunInput = {
  primarySlug?: string | null;
  primaryTitle?: string | null;
  primaryConfidence?: number | null;
  secondarySlug?: string | null;
  secondaryTitle?: string | null;
  vetUrgent?: boolean;
  mediaType?: string | null;
  analysisId?: string | null;
};

export async function listVitRunsForPet(
  userId: string,
  petId: string,
  petName: string | null,
  limit = 5
): Promise<VitRunSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pet_vit_runs')
    .select('*')
    .eq('pet_id', petId)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as VitRunRow[]).map((row) => rowToSummary(row, petName));
}

export async function createVitRunForPet(
  userId: string,
  petId: string,
  input: VitRunInput
): Promise<VitRunSummary | null> {
  const supabase = await createSupabaseServerClient();

  const { data: pet } = await supabase
    .from('pets')
    .select('id, name')
    .eq('id', petId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (!pet) return null;

  const { data, error } = await supabase
    .from('pet_vit_runs')
    .insert({
      pet_id: petId,
      owner_id: userId,
      primary_protocol_slug: input.primarySlug ?? null,
      primary_protocol_title: input.primaryTitle ?? null,
      primary_confidence: input.primaryConfidence ?? null,
      secondary_protocol_slug: input.secondarySlug ?? null,
      secondary_protocol_title: input.secondaryTitle ?? null,
      vet_urgent: Boolean(input.vetUrgent),
      media_type: input.mediaType ?? null,
      analysis_id: input.analysisId ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return rowToSummary(data as VitRunRow, pet.name as string);
}
