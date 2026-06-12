import { NextRequest, NextResponse } from 'next/server';
import { requireMatchReviewer } from '@/lib/api/auth';
import { listMatchCandidates } from '@/lib/id/match-server';

export async function GET(request: NextRequest) {
  const { user, error } = await requireMatchReviewer();
  if (error) return error;

  const reportId = request.nextUrl.searchParams.get('reportId')?.trim();
  if (!reportId) {
    return NextResponse.json({ success: false, error: 'reportId is required.' }, { status: 400 });
  }

  try {
    const candidates = await listMatchCandidates(reportId, user!.id);
    return NextResponse.json({ success: true, candidates });
  } catch (err) {
    console.error('[api/id/match/candidates]', err);
    return NextResponse.json({ success: false, error: 'Could not load candidates.' }, { status: 500 });
  }
}
