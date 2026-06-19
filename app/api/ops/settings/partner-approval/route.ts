import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { writeAuditLog } from '@/lib/id/audit';
import { setPartnerApproval } from '@/lib/ops/settings-server';

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireFpOps();
  if (error) return error;

  let body: { slug?: string; approved?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug) {
    return NextResponse.json({ success: false, error: 'slug required' }, { status: 400 });
  }

  try {
    const settings = await setPartnerApproval(user!.id, slug, Boolean(body.approved));
    await writeAuditLog(user!.id, 'ops.marketing.approval', 'partner', null, {
      slug,
      approved: Boolean(body.approved),
    });
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Save failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
