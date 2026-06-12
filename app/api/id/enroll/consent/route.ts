import { NextRequest, NextResponse } from 'next/server';
import { BIOMETRIC_CONSENT_VERSION } from '@/lib/id/consent';
import { requireApiUser } from '@/lib/api/auth';
import { recordConsent } from '@/lib/id/enroll-server';

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  try {
    const body = (await request.json()) as {
      enrollmentId?: string;
      consentVersion?: string;
      agreed?: boolean;
    };

    if (!body.enrollmentId?.trim()) {
      return NextResponse.json({ success: false, error: 'enrollmentId is required.' }, { status: 400 });
    }
    if (!body.agreed) {
      return NextResponse.json({ success: false, error: 'Consent must be accepted.' }, { status: 400 });
    }
    if (body.consentVersion && body.consentVersion !== BIOMETRIC_CONSENT_VERSION) {
      return NextResponse.json(
        { success: false, error: 'Consent version mismatch. Refresh and try again.' },
        { status: 400 }
      );
    }

    const enrollment = await recordConsent(user!.id, body.enrollmentId.trim());
    return NextResponse.json({
      success: true,
      enrollment,
      consentVersion: BIOMETRIC_CONSENT_VERSION,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not record consent.';
    console.error('[api/id/enroll/consent]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
