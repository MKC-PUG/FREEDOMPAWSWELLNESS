import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { deleteEnrollmentMedia } from '@/lib/id/enroll-server';

export async function DELETE(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  try {
    const body = (await request.json()) as { enrollmentId?: string; mediaId?: string };
    const enrollmentId = body.enrollmentId?.trim();
    const mediaId = body.mediaId?.trim();

    if (!enrollmentId || !mediaId) {
      return NextResponse.json(
        { success: false, error: 'enrollmentId and mediaId are required.' },
        { status: 400 }
      );
    }

    await deleteEnrollmentMedia(user!.id, enrollmentId, mediaId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not remove capture.';
    console.error('[api/id/enroll/media]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
