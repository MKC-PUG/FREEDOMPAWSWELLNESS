import { analyzeIdentityFrames } from '@/lib/ai/identity-analyze';
import type { IdentityRegion } from '@/lib/id/types';
import {
  createDescriptorEmbedding,
  EMBEDDING_MODEL_VERSION,
  fuseFoundIntakeDescriptors,
} from '@/lib/id/embeddings';
import { writeAuditLog } from '@/lib/id/audit';
import { ID_MATCH_THRESHOLD_DEFAULT } from '@/lib/id/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { IdUserRole } from '@/lib/id/types';

export type ShelterOption = {
  id: string;
  name: string;
  state: string;
};

export type SimilarPetMatch = {
  enrollmentId: string;
  petId: string;
  similarity: number;
  freedomPawsId: string;
  petName: string;
  breed: string;
};

export type FoundReportResult = {
  reportId: string;
  status: string;
  candidateCount: number;
  matches: SimilarPetMatch[];
  fusedDescriptorText: string;
};

const INTAKE_REGIONS: IdentityRegion[] = ['face', 'body', 'posture'];

export async function listPilotShelters(): Promise<ShelterOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shelters')
    .select('id, name, state')
    .order('state')
    .order('name');

  if (error) throw error;
  return (data ?? []).map((s) => ({
    id: s.id as string,
    name: s.name as string,
    state: s.state as string,
  }));
}

export async function submitFoundDogReport(
  userId: string,
  reporterRole: IdUserRole,
  input: {
    shelterId: string;
    notes?: string;
    frames: File[];
    mediaType: 'photo' | 'video';
    threshold?: number;
  }
): Promise<FoundReportResult> {
  const supabase = await createSupabaseServerClient();

  const { data: shelter } = await supabase
    .from('shelters')
    .select('id')
    .eq('id', input.shelterId)
    .maybeSingle();
  if (!shelter) throw new Error('Shelter not found');

  const regions: IdentityRegion[] =
    input.mediaType === 'video' ? ['face', 'body', 'posture', 'gait'] : INTAKE_REGIONS;

  const analysis = await analyzeIdentityFrames(
    input.frames,
    regions,
    input.mediaType,
    input.notes
  );

  const fused = fuseFoundIntakeDescriptors(analysis);
  if (!fused.trim()) {
    throw new Error('Could not extract identity descriptors from intake media');
  }

  const { data: report, error: reportError } = await supabase
    .from('found_dog_reports')
    .insert({
      shelter_id: input.shelterId,
      reporter_id: userId,
      reporter_role: reporterRole,
      notes: input.notes?.trim() || null,
      fused_descriptor_text: fused,
      status: 'searching',
    })
    .select('id')
    .single();

  if (reportError) throw reportError;
  const reportId = report.id as string;

  const embedding = await createDescriptorEmbedding(fused);
  const { error: embedError } = await supabase.from('found_report_embeddings').insert({
    report_id: reportId,
    embedding,
    model_version: EMBEDDING_MODEL_VERSION,
  });
  if (embedError) throw embedError;

  const threshold = input.threshold ?? ID_MATCH_THRESHOLD_DEFAULT;
  const { data: similar, error: searchError } = await supabase.rpc('search_pet_embeddings', {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: 5,
  });

  if (searchError) throw searchError;

  const matches: SimilarPetMatch[] = (similar ?? []).map(
    (row: {
      enrollment_id: string;
      pet_id: string;
      similarity: number;
      freedom_paws_id: string;
      pet_name: string;
      breed: string;
    }) => ({
      enrollmentId: row.enrollment_id,
      petId: row.pet_id,
      similarity: Number(row.similarity),
      freedomPawsId: row.freedom_paws_id,
      petName: row.pet_name,
      breed: row.breed ?? '',
    })
  );

  if (matches.length > 0) {
    const { error: candError } = await supabase.from('match_candidates').insert(
      matches.map((m) => ({
        found_report_id: reportId,
        pet_id: m.petId,
        enrollment_id: m.enrollmentId,
        similarity_score: m.similarity,
        review_status: 'pending',
      }))
    );
    if (candError) throw candError;
  }

  const status = matches.length > 0 ? 'candidates_ready' : 'submitted';
  await supabase.from('found_dog_reports').update({ status }).eq('id', reportId);

  await writeAuditLog(userId, 'found.report.submit', 'found_dog_report', reportId, {
    shelterId: input.shelterId,
    candidateCount: matches.length,
  });

  return {
    reportId,
    status,
    candidateCount: matches.length,
    matches,
    fusedDescriptorText: fused,
  };
}

export type FoundReportSummary = {
  id: string;
  shelterName: string;
  state: string;
  status: string;
  notes: string | null;
  candidateCount: number;
  pendingReviews: number;
  createdAt: string;
};

export async function listFoundReportsForReviewer(): Promise<FoundReportSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data: reports, error } = await supabase
    .from('found_dog_reports')
    .select('id, status, notes, created_at, shelter_id')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  const shelterIds = [...new Set((reports ?? []).map((r) => r.shelter_id as string).filter(Boolean))];
  const { data: shelterRows } = await supabase
    .from('shelters')
    .select('id, name, state')
    .in('id', shelterIds.length ? shelterIds : ['00000000-0000-0000-0000-000000000000']);

  const shelterMap = new Map(
    (shelterRows ?? []).map((s) => [s.id as string, { name: s.name as string, state: s.state as string }])
  );

  const summaries: FoundReportSummary[] = [];
  for (const r of reports ?? []) {
    const shelter = shelterMap.get(r.shelter_id as string);
    const { count: candidateCount } = await supabase
      .from('match_candidates')
      .select('id', { count: 'exact', head: true })
      .eq('found_report_id', r.id);

    const { count: pendingReviews } = await supabase
      .from('match_candidates')
      .select('id', { count: 'exact', head: true })
      .eq('found_report_id', r.id)
      .eq('review_status', 'pending');

    summaries.push({
      id: r.id as string,
      shelterName: shelter?.name ?? 'Unknown shelter',
      state: shelter?.state ?? '',
      status: r.status as string,
      notes: r.notes as string | null,
      candidateCount: candidateCount ?? 0,
      pendingReviews: pendingReviews ?? 0,
      createdAt: r.created_at as string,
    });
  }

  return summaries;
}
