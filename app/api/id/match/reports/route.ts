import { NextResponse } from 'next/server';
import { requireMatchReviewer } from '@/lib/api/auth';
import { listFoundReportsForReviewer } from '@/lib/id/found-server';

export async function GET() {
  const { error } = await requireMatchReviewer();
  if (error) return error;

  try {
    const reports = await listFoundReportsForReviewer();
    return NextResponse.json({ success: true, reports });
  } catch (err) {
    console.error('[api/id/match/reports]', err);
    return NextResponse.json({ success: false, error: 'Could not load reports.' }, { status: 500 });
  }
}
