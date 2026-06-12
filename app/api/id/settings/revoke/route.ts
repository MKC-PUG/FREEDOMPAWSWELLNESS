import { NextRequest, NextResponse } from 'next/server';
import { requireApiUserWithProfile } from '@/lib/api/auth';
import { getOwnerIdSettings, revokeBiometricEnrollment } from '@/lib/id/settings-server';

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUserWithProfile();
  if (error) return error;

  try {
    const body = (await request.json()) as { enrollmentId?: string };
    if (!body.enrollmentId?.trim()) {
      return NextResponse.json({ success: false, error: 'enrollmentId is required.' }, { status: 400 });
    }

    await revokeBiometricEnrollment(user!.id, body.enrollmentId.trim());
    const settings = await getOwnerIdSettings(user!.id);
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Revoke failed.';
    console.error('[api/id/settings/revoke]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
