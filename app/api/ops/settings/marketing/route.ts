import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { writeAuditLog } from '@/lib/id/audit';
import { saveMarketingSettings } from '@/lib/ops/settings-server';
import type { MarketingAutomationSettings } from '@/lib/ops/types';

export async function PATCH(request: NextRequest) {
  const { user, profile, error } = await requireFpOps();
  if (error) return error;

  let body: Partial<MarketingAutomationSettings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.emergencyStop === false && body.masterEnabled === true) {
    // Allow but no auto-send from API
  }

  try {
    const settings = await saveMarketingSettings(user!.id, body);
    await writeAuditLog(user!.id, 'ops.settings.update', 'marketing_automation', null, {
      patch: body,
    });
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
