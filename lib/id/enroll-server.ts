import { analyzeIdentityFrames, regionCaptureMeetsThreshold } from '@/lib/ai/identity-analyze';
import type { IdentityRegion } from '@/lib/id/types';
import { BIOMETRIC_CONSENT_VERSION } from '@/lib/id/consent';
import {
  createDescriptorEmbedding,
  EMBEDDING_MODEL_VERSION,
  fuseEnrollmentDescriptors,
  fuseIntakeMirrorFromEnrollment,
  generateFreedomPawsId,
  generateQrSlug,
  validateEnrollmentMedia,
} from '@/lib/id/embeddings';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type EnrollmentRow = {
  id: string;
  pet_id: string;
  owner_id: string;
  status: string;
  consent_version: string | null;
  consented_at: string | null;
  freedom_paws_id: string | null;
  qr_slug: string | null;
  current_step: number;
  created_at: string;
  updated_at: string;
};

export type EnrollmentMediaSummary = {
  region: string;
  angle: string | null;
  qualityScore: number;
  descriptors: string[];
  analyzedAt: string;
};

export type EnrollmentDraft = {
  id: string;
  petId: string;
  status: string;
  consentVersion: string | null;
  consentedAt: string | null;
  currentStep: number;
  freedomPawsId: string | null;
  qrSlug: string | null;
};

export type EnrollmentStatus = EnrollmentDraft & {
  petName: string;
  media: EnrollmentMediaSummary[];
  reviewReady: boolean;
  reviewIssues: string[];
};

function rowToDraft(row: EnrollmentRow): EnrollmentDraft {
  return {
    id: row.id,
    petId: row.pet_id,
    status: row.status,
    consentVersion: row.consent_version,
    consentedAt: row.consented_at,
    currentStep: row.current_step,
    freedomPawsId: row.freedom_paws_id,
    qrSlug: row.qr_slug,
  };
}

function parseMediaRows(
  rows: {
    region: string;
    angle: string | null;
    quality_score: number | null;
    descriptors: unknown;
    analyzed_at: string;
  }[]
): EnrollmentMediaSummary[] {
  return rows.map((r) => ({
    region: r.region,
    angle: r.angle,
    qualityScore: Number(r.quality_score ?? 0),
    descriptors: Array.isArray(r.descriptors)
      ? r.descriptors.filter((d): d is string => typeof d === 'string')
      : [],
    analyzedAt: r.analyzed_at,
  }));
}

export async function startEnrollment(
  userId: string,
  petId: string
): Promise<EnrollmentDraft> {
  const supabase = await createSupabaseServerClient();

  const { data: pet, error: petError } = await supabase
    .from('pets')
    .select('id')
    .eq('id', petId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (petError) throw petError;
  if (!pet) throw new Error('Pet not found');

  const { data: existing } = await supabase
    .from('biometric_enrollments')
    .select('*')
    .eq('pet_id', petId)
    .eq('owner_id', userId)
    .in('status', ['draft', 'consented'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return rowToDraft(existing as EnrollmentRow);
  }

  const { data, error } = await supabase
    .from('biometric_enrollments')
    .insert({
      pet_id: petId,
      owner_id: userId,
      status: 'draft',
      current_step: 1,
    })
    .select('*')
    .single();

  if (error) throw error;
  return rowToDraft(data as EnrollmentRow);
}

export async function recordConsent(
  userId: string,
  enrollmentId: string
): Promise<EnrollmentDraft> {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('biometric_enrollments')
    .update({
      status: 'consented',
      consent_version: BIOMETRIC_CONSENT_VERSION,
      consented_at: now,
      current_step: 3,
    })
    .eq('id', enrollmentId)
    .eq('owner_id', userId)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Enrollment not found');
  return rowToDraft(data as EnrollmentRow);
}

export async function getEnrollmentForUser(
  userId: string,
  enrollmentId: string
): Promise<EnrollmentDraft | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('biometric_enrollments')
    .select('*')
    .eq('id', enrollmentId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToDraft(data as EnrollmentRow) : null;
}

export async function advanceEnrollmentStep(
  userId: string,
  enrollmentId: string,
  step: number
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('biometric_enrollments')
    .update({ current_step: step })
    .eq('id', enrollmentId)
    .eq('owner_id', userId);

  if (error) throw error;
}

export async function captureEnrollmentRegion(
  userId: string,
  enrollmentId: string,
  region: IdentityRegion,
  frames: File[],
  mediaType: 'photo' | 'video',
  angle?: string | null
) {
  const enrollment = await getEnrollmentForUser(userId, enrollmentId);
  if (!enrollment) throw new Error('Enrollment not found');
  if (enrollment.status !== 'consented') {
    throw new Error('Consent required before capture');
  }

  const analysis = await analyzeIdentityFrames(frames, [region], mediaType);
  const regionResult = analysis.regions[region];
  if (!regionResult) {
    const hint =
      region === 'eyes'
        ? 'Try brighter light, fill the frame with both eyes, or use a flash photo — dark-coated dogs need catchlight on the eyes.'
        : 'Try another photo with better lighting and the region centered.';
    throw new Error(
      analysis.fusedDescriptorText?.includes('unavailable')
        ? analysis.fusedDescriptorText
        : `Could not analyze ${region}. ${hint}`
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('enrollment_media').upsert(
    {
      enrollment_id: enrollmentId,
      region,
      angle: angle ?? null,
      quality_score: regionResult.qualityScore,
      descriptors: regionResult.descriptors,
      quality_issues: regionResult.qualityIssues,
      analyzed_at: new Date().toISOString(),
    },
    { onConflict: 'enrollment_id,region,angle' }
  );

  if (error) throw error;

  return {
    region,
    angle: angle ?? null,
    qualityScore: regionResult.qualityScore,
    descriptors: regionResult.descriptors,
    qualityIssues: regionResult.qualityIssues,
    enrollReady: regionCaptureMeetsThreshold(
      region,
      regionResult.qualityScore,
      regionResult.descriptors.length
    ),
    fusedDescriptorText: analysis.fusedDescriptorText,
  };
}

export async function listEnrollmentMedia(userId: string, enrollmentId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('enrollment_media')
    .select('region, angle, quality_score, descriptors, analyzed_at')
    .eq('enrollment_id', enrollmentId);

  if (error) throw error;

  const enrollment = await getEnrollmentForUser(userId, enrollmentId);
  if (!enrollment) throw new Error('Enrollment not found');

  return parseMediaRows(data ?? []);
}

export async function getEnrollmentStatus(
  userId: string,
  enrollmentId: string
): Promise<EnrollmentStatus | null> {
  const supabase = await createSupabaseServerClient();
  const { data: row, error } = await supabase
    .from('biometric_enrollments')
    .select('*')
    .eq('id', enrollmentId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  const { data: pet } = await supabase
    .from('pets')
    .select('name')
    .eq('id', (row as EnrollmentRow).pet_id)
    .maybeSingle();

  const media = await listEnrollmentMedia(userId, enrollmentId);
  const validation = validateEnrollmentMedia(
    media.map((m) => ({
      region: m.region,
      angle: m.angle,
      quality_score: m.qualityScore,
      descriptors: m.descriptors,
    }))
  );

  return {
    ...rowToDraft(row as EnrollmentRow),
    petName: (pet?.name as string) ?? 'Your pet',
    media,
    reviewReady: validation.ok,
    reviewIssues: validation.issues,
  };
}

export type CompleteEnrollmentResult = {
  enrollmentId: string;
  freedomPawsId: string;
  qrSlug: string;
  fusedDescriptorText: string;
};

export async function completeEnrollment(
  userId: string,
  enrollmentId: string
): Promise<CompleteEnrollmentResult> {
  const status = await getEnrollmentStatus(userId, enrollmentId);
  if (!status) throw new Error('Enrollment not found');
  if (status.status === 'complete') {
    return {
      enrollmentId: status.id,
      freedomPawsId: status.freedomPawsId!,
      qrSlug: status.qrSlug!,
      fusedDescriptorText: '',
    };
  }
  if (!status.reviewReady) {
    throw new Error(`Enrollment incomplete: ${status.reviewIssues.join('; ')}`);
  }

  const fused = fuseEnrollmentDescriptors(
    status.media.map((m) => ({
      region: m.region,
      angle: m.angle,
      quality_score: m.qualityScore,
      descriptors: m.descriptors,
    }))
  );

  const mirrorText = fuseIntakeMirrorFromEnrollment(
    status.media.map((m) => ({
      region: m.region,
      angle: m.angle,
      quality_score: m.qualityScore,
      descriptors: m.descriptors,
    }))
  );

  const embedding = await createDescriptorEmbedding(fused);
  const intakeMirrorEmbedding = mirrorText.trim()
    ? await createDescriptorEmbedding(mirrorText)
    : null;
  const freedomPawsId = generateFreedomPawsId(enrollmentId);
  let qrSlug = generateQrSlug();

  const supabase = await createSupabaseServerClient();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: clash } = await supabase
      .from('biometric_enrollments')
      .select('id')
      .eq('qr_slug', qrSlug)
      .maybeSingle();
    if (!clash) break;
    qrSlug = generateQrSlug();
  }

  const { error: embedError } = await supabase.from('pet_embeddings').upsert(
    {
      pet_id: status.petId,
      enrollment_id: enrollmentId,
      embedding,
      model_version: EMBEDDING_MODEL_VERSION,
      fused_descriptor_text: fused,
      intake_mirror_embedding: intakeMirrorEmbedding,
      intake_mirror_descriptor_text: mirrorText.trim() || null,
    },
    { onConflict: 'enrollment_id' }
  );
  if (embedError) throw embedError;

  const { error: enrollError } = await supabase
    .from('biometric_enrollments')
    .update({
      status: 'complete',
      freedom_paws_id: freedomPawsId,
      qr_slug: qrSlug,
      current_step: 9,
    })
    .eq('id', enrollmentId)
    .eq('owner_id', userId);

  if (enrollError) throw enrollError;

  return { enrollmentId, freedomPawsId, qrSlug, fusedDescriptorText: fused };
}
