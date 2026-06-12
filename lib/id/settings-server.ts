import { writeAuditLog } from '@/lib/id/audit';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type OwnerEnrollmentSummary = {
  enrollmentId: string;
  petId: string;
  petName: string;
  status: string;
  freedomPawsId: string | null;
  qrSlug: string | null;
  consentedAt: string | null;
  createdAt: string;
};

export type OwnerIdSettings = {
  alertEmailEnabled: boolean;
  enrollments: OwnerEnrollmentSummary[];
};

export async function getOwnerIdSettings(userId: string): Promise<OwnerIdSettings> {
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('alert_email_enabled')
    .eq('id', userId)
    .maybeSingle();

  const { data: enrollments, error } = await supabase
    .from('biometric_enrollments')
    .select('id, pet_id, status, freedom_paws_id, qr_slug, consented_at, created_at')
    .eq('owner_id', userId)
    .in('status', ['complete', 'consented', 'draft'])
    .order('created_at', { ascending: false });

  if (error) throw error;

  const petIds = [...new Set((enrollments ?? []).map((e) => e.pet_id as string))];
  const { data: pets } = await supabase
    .from('pets')
    .select('id, name')
    .in('id', petIds.length ? petIds : ['00000000-0000-0000-0000-000000000000']);

  const petMap = new Map((pets ?? []).map((p) => [p.id as string, p.name as string]));

  return {
    alertEmailEnabled: profile?.alert_email_enabled !== false,
    enrollments: (enrollments ?? []).map((e) => ({
      enrollmentId: e.id as string,
      petId: e.pet_id as string,
      petName: petMap.get(e.pet_id as string) ?? 'Pet',
      status: e.status as string,
      freedomPawsId: (e.freedom_paws_id as string) ?? null,
      qrSlug: (e.qr_slug as string) ?? null,
      consentedAt: (e.consented_at as string) ?? null,
      createdAt: e.created_at as string,
    })),
  };
}

export async function setAlertEmailEnabled(userId: string, enabled: boolean): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('user_profiles')
    .update({ alert_email_enabled: enabled })
    .eq('id', userId);
  if (error) throw error;
}

export async function revokeBiometricEnrollment(
  userId: string,
  enrollmentId: string
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { data: enrollment, error: loadError } = await supabase
    .from('biometric_enrollments')
    .select('id, pet_id, status')
    .eq('id', enrollmentId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (loadError) throw loadError;
  if (!enrollment) throw new Error('Enrollment not found');

  await supabase.from('pet_embeddings').delete().eq('enrollment_id', enrollmentId);
  await supabase.from('enrollment_media').delete().eq('enrollment_id', enrollmentId);

  const { error } = await supabase
    .from('biometric_enrollments')
    .update({
      status: 'revoked',
      freedom_paws_id: null,
      qr_slug: null,
      consent_version: null,
      consented_at: null,
    })
    .eq('id', enrollmentId)
    .eq('owner_id', userId);

  if (error) throw error;

  await writeAuditLog(userId, 'enrollment.revoked', 'biometric_enrollment', enrollmentId, {
    petId: enrollment.pet_id,
  });
}
