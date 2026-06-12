import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { startEnrollment } from '@/lib/id/enroll-server';

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  try {
    const body = (await request.json()) as { petId?: string };
    if (!body.petId?.trim()) {
      return NextResponse.json({ success: false, error: 'petId is required.' }, { status: 400 });
    }

    const enrollment = await startEnrollment(user!.id, body.petId.trim());
    return NextResponse.json({ success: true, enrollment });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not start enrollment.';
    console.error('[api/id/enroll/start]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
