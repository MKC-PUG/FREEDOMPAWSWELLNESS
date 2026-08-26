import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { writeAuditLog } from '@/lib/id/audit';
import { sendSocialPostToBuffer } from '@/lib/ops/social-server';

export async function POST(request: NextRequest) {
  const { user, error } = await requireFpOps();
  if (error) return error;

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
  }

  try {
    const post = await sendSocialPostToBuffer(body.id);
    await writeAuditLog(user!.id, 'ops.social.buffer', 'social_post', post.id, {
      status: post.status,
      dryRun: !process.env.BUFFER_WEBHOOK_URL && !process.env.N8N_SOCIAL_BUFFER_WEBHOOK_URL,
    });
    return NextResponse.json({
      success: true,
      post,
      dryRun: post.bufferPayload?.mode === 'dry_run',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Buffer send failed';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
