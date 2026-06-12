import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { getEnrollmentStatus } from '@/lib/id/enroll-server';

export async function GET(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const enrollmentId = request.nextUrl.searchParams.get('enrollmentId')?.trim();
  if (!enrollmentId) {
    return NextResponse.json({ success: false, error: 'enrollmentId is required.' }, { status: 400 });
  }

  try {
    const status = await getEnrollmentStatus(user!.id, enrollmentId);
    if (!status) {
      return NextResponse.json({ success: false, error: 'Enrollment not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error('[api/id/enroll/status]', err);
    return NextResponse.json({ success: false, error: 'Could not load enrollment.' }, { status: 500 });
  }
}
