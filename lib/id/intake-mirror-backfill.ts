import type { SupabaseClient } from '@supabase/supabase-js';
import {
  createDescriptorEmbedding,
  fuseIntakeMirrorFromEnrollment,
} from '@/lib/id/embeddings';

type MediaRow = {
  region: string;
  angle: string | null;
  descriptors: string[] | unknown;
};

export type IntakeMirrorBackfillResult = {
  enrollmentId: string;
  freedomPawsId: string | null;
  updated: boolean;
  skipped?: string;
  mirrorTextLength?: number;
};

export async function backfillIntakeMirrorForEnrollment(
  admin: SupabaseClient,
  enrollmentId: string
): Promise<IntakeMirrorBackfillResult> {
  const { data: enrollment, error: enrollError } = await admin
    .from('biometric_enrollments')
    .select('id, freedom_paws_id, status')
    .eq('id', enrollmentId)
    .maybeSingle();

  if (enrollError) throw enrollError;
  if (!enrollment) {
    return { enrollmentId, freedomPawsId: null, updated: false, skipped: 'enrollment not found' };
  }
  if (enrollment.status !== 'complete') {
    return {
      enrollmentId,
      freedomPawsId: (enrollment.freedom_paws_id as string) ?? null,
      updated: false,
      skipped: `status=${enrollment.status as string}`,
    };
  }

  const { data: media, error: mediaError } = await admin
    .from('enrollment_media')
    .select('region, angle, descriptors')
    .eq('enrollment_id', enrollmentId);

  if (mediaError) throw mediaError;

  const rows: MediaRow[] = (media ?? []).map((m) => ({
    region: m.region as string,
    angle: (m.angle as string) ?? null,
    descriptors: m.descriptors,
  }));

  const mirrorText = fuseIntakeMirrorFromEnrollment(
    rows.map((r) => ({
      region: r.region,
      angle: r.angle,
      quality_score: null,
      descriptors: r.descriptors,
    }))
  );

  if (!mirrorText.trim()) {
    return {
      enrollmentId,
      freedomPawsId: (enrollment.freedom_paws_id as string) ?? null,
      updated: false,
      skipped: 'no mirror descriptor text',
    };
  }

  const intakeMirrorEmbedding = await createDescriptorEmbedding(mirrorText);

  const { error: updateError } = await admin
    .from('pet_embeddings')
    .update({
      intake_mirror_embedding: intakeMirrorEmbedding,
      intake_mirror_descriptor_text: mirrorText,
    })
    .eq('enrollment_id', enrollmentId);

  if (updateError) throw updateError;

  return {
    enrollmentId,
    freedomPawsId: (enrollment.freedom_paws_id as string) ?? null,
    updated: true,
    mirrorTextLength: mirrorText.length,
  };
}

export async function backfillAllIntakeMirrors(
  admin: SupabaseClient
): Promise<IntakeMirrorBackfillResult[]> {
  const { data: enrollments, error } = await admin
    .from('biometric_enrollments')
    .select('id')
    .eq('status', 'complete');

  if (error) throw error;

  const results: IntakeMirrorBackfillResult[] = [];
  for (const row of enrollments ?? []) {
    results.push(await backfillIntakeMirrorForEnrollment(admin, row.id as string));
  }
  return results;
}
