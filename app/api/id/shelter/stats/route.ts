import { NextResponse } from 'next/server';
import { requireMatchReviewer } from '@/lib/api/auth';
import { getShelterDashboardStats } from '@/lib/id/shelter-stats';

export async function GET() {
  const { error } = await requireMatchReviewer();
  if (error) return error;

  try {
    const stats = await getShelterDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (err) {
    console.error('[api/id/shelter/stats]', err);
    return NextResponse.json({ success: false, error: 'Could not load stats.' }, { status: 500 });
  }
}
