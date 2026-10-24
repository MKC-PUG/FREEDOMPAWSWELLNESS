import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { writeAuditLog } from '@/lib/id/audit';
import { getShelterDashboardStats } from '@/lib/id/shelter-stats';
import { saveCeoCard } from '@/lib/ops/ceo-desk-server';

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireFpOps();
  if (error) return error;

  let body: { id?: unknown; state?: unknown; note?: unknown; draft?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body.id !== 'string' || body.id.length < 3) {
    return NextResponse.json({ success: false, error: 'Missing card.' }, { status: 400 });
  }

  try {
    const shelter = await getShelterDashboardStats();
    const cards = await saveCeoCard(user!.id, shelter.pendingReviews, body);
    await writeAuditLog(user!.id, 'ops.settings.update', 'ceo_inbox', body.id, {
      state: body.state ?? null,
    });
    return NextResponse.json({ success: true, cards });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
