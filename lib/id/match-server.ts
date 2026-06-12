import { writeAuditLog } from '@/lib/id/audit';
import { sendMatchApprovedOwnerAlert } from '@/lib/email/match-owner-alert';
import type { MatchReviewStatus } from '@/lib/id/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type MatchCandidateDetail = {
  id: string;
  foundReportId: string;
  petId: string;
  enrollmentId: string;
  similarityScore: number;
  reviewStatus: MatchReviewStatus;
  freedomPawsId: string;
  petName: string;
  breed: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
};

export async function listMatchCandidates(
  reportId: string,
  actorId?: string
): Promise<MatchCandidateDetail[]> {
  const supabase = await createSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from('match_candidates')
    .select(
      'id, found_report_id, pet_id, enrollment_id, similarity_score, review_status, reviewed_at, review_notes'
    )
    .eq('found_report_id', reportId)
    .order('similarity_score', { ascending: false });

  if (error) throw error;
  if (!rows?.length) return [];

  const enrollmentIds = [...new Set(rows.map((r) => r.enrollment_id as string))];
  const petIds = [...new Set(rows.map((r) => r.pet_id as string))];

  const [{ data: enrollments }, { data: pets }] = await Promise.all([
    supabase
      .from('biometric_enrollments')
      .select('id, freedom_paws_id')
      .in('id', enrollmentIds),
    supabase.from('pets').select('id, name, breed').in('id', petIds),
  ]);

  const enrollmentMap = new Map(
    (enrollments ?? []).map((e) => [e.id as string, e.freedom_paws_id as string])
  );
  const petMap = new Map(
    (pets ?? []).map((p) => [p.id as string, { name: p.name as string, breed: p.breed as string }])
  );

  const results = rows.map((row) => {
    const pet = petMap.get(row.pet_id as string);
    return {
      id: row.id as string,
      foundReportId: row.found_report_id as string,
      petId: row.pet_id as string,
      enrollmentId: row.enrollment_id as string,
      similarityScore: Number(row.similarity_score),
      reviewStatus: row.review_status as MatchReviewStatus,
      freedomPawsId: enrollmentMap.get(row.enrollment_id as string) ?? '',
      petName: pet?.name ?? 'Unknown',
      breed: pet?.breed ?? '',
      reviewedAt: (row.reviewed_at as string) ?? null,
      reviewNotes: (row.review_notes as string) ?? null,
    };
  });

  if (actorId && results.length > 0) {
    await writeAuditLog(actorId, 'match.candidates.view', 'found_dog_report', reportId, {
      candidateCount: results.length,
    });
  }

  return results;
}

export type MatchReviewResult = MatchCandidateDetail & {
  ownerEmailSent?: boolean;
};

export async function reviewMatchCandidate(
  reviewerId: string,
  input: {
    candidateId: string;
    decision: MatchReviewStatus;
    notes?: string;
  }
): Promise<MatchReviewResult> {
  if (!['approved', 'rejected', 'insufficient_evidence'].includes(input.decision)) {
    throw new Error('Invalid review decision');
  }

  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  const { data: before, error: loadError } = await supabase
    .from('match_candidates')
    .select('found_report_id, pet_id, enrollment_id, similarity_score')
    .eq('id', input.candidateId)
    .maybeSingle();

  if (loadError) throw loadError;
  if (!before) throw new Error('Candidate not found');

  const { data: updated, error } = await supabase
    .from('match_candidates')
    .update({
      review_status: input.decision,
      reviewed_by: reviewerId,
      reviewed_at: now,
      review_notes: input.notes?.trim() || null,
    })
    .eq('id', input.candidateId)
    .select('found_report_id')
    .maybeSingle();

  if (error) throw error;
  if (!updated) throw new Error('Candidate not found');

  let ownerEmailSent = false;

  await writeAuditLog(reviewerId, 'match.candidate.review', 'match_candidate', input.candidateId, {
    decision: input.decision,
    reportId: before.found_report_id as string,
  });

  if (input.decision === 'approved') {
    const reportId = updated.found_report_id as string;

    await supabase.from('found_dog_reports').update({ status: 'matched' }).eq('id', reportId);

    const [{ data: pet }, { data: report }] = await Promise.all([
      supabase.from('pets').select('owner_id, name').eq('id', before.pet_id as string).maybeSingle(),
      supabase
        .from('found_dog_reports')
        .select('shelter_id')
        .eq('id', reportId)
        .maybeSingle(),
    ]);

    let shelterName = 'Pilot shelter';
    let shelterState = '';
    if (report?.shelter_id) {
      const { data: shelter } = await supabase
        .from('shelters')
        .select('name, state')
        .eq('id', report.shelter_id as string)
        .maybeSingle();
      if (shelter) {
        shelterName = shelter.name as string;
        shelterState = shelter.state as string;
      }
    }

    const candidates = await listMatchCandidates(reportId);
    const matchDetail = candidates.find((c) => c.id === input.candidateId);

    if (pet?.owner_id) {
      const { data: ownerProfile } = await supabase
        .from('user_profiles')
        .select('alert_email_enabled')
        .eq('id', pet.owner_id as string)
        .maybeSingle();

      if (ownerProfile?.alert_email_enabled === false) {
        ownerEmailSent = false;
      } else {
      const alert = await sendMatchApprovedOwnerAlert({
        ownerId: pet.owner_id as string,
        petName: (pet.name as string) || matchDetail?.petName || 'your pet',
        freedomPawsId: matchDetail?.freedomPawsId ?? '',
        shelterName,
        shelterState,
        similarityScore: Number(before.similarity_score),
        reportId,
      });
      ownerEmailSent = alert.sent;
      if (alert.sent) {
        await writeAuditLog(reviewerId, 'match.owner_email.sent', 'match_candidate', input.candidateId, {
          reportId,
          freedomPawsId: matchDetail?.freedomPawsId,
        });
      }
      }
    }
  }

  const candidates = await listMatchCandidates(updated.found_report_id as string, reviewerId);
  const found = candidates.find((c) => c.id === input.candidateId);
  if (!found) throw new Error('Could not load updated candidate');
  return { ...found, ownerEmailSent };
}
