import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { completeEnrollment } from '@/lib/id/enroll-server';

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  try {
    const body = (await request.json()) as { enrollmentId?: string };
    if (!body.enrollmentId?.trim()) {
      return NextResponse.json({ success: false, error: 'enrollmentId is required.' }, { status: 400 });
    }

    const result = await completeEnrollment(user!.id, body.enrollmentId.trim());
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not complete enrollment.';
    console.error('[api/id/enroll/complete]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
