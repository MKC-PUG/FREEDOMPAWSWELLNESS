import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { writeAuditLog } from '@/lib/id/audit';
import { saveFeatureFlags } from '@/lib/ops/settings-server';
import type { FeatureFlags } from '@/lib/ops/types';

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireFpOps();
  if (error) return error;

  let body: Partial<FeatureFlags>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const flags = await saveFeatureFlags(user!.id, body);
    await writeAuditLog(user!.id, 'ops.settings.update', 'feature_flags', null, { patch: body });
    return NextResponse.json({ success: true, flags });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
