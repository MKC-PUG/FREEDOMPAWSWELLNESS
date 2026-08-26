import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { writeAuditLog } from '@/lib/id/audit';
import {
  createSocialPost,
  generateSocialDraft,
  listSocialPosts,
  updateSocialPost,
} from '@/lib/ops/social-server';
import type { SocialPillarId, SocialPlatform } from '@/lib/ops/social-pillars';

export async function GET() {
  const { error } = await requireFpOps();
  if (error) return error;

  try {
    const posts = await listSocialPosts(60);
    return NextResponse.json({ success: true, posts });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Load failed';
    if (msg.includes('social_posts') || msg.includes('schema cache')) {
      return NextResponse.json(
        {
          success: false,
          error:
            'social_posts table missing. Run supabase/migrations/015_social_posts.sql in Supabase SQL Editor.',
          posts: [],
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireFpOps();
  if (error) return error;

  let body: {
    action?: 'create' | 'generate';
    pillar?: SocialPillarId;
    platform?: SocialPlatform;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.pillar || !body.platform) {
    return NextResponse.json(
      { success: false, error: 'pillar and platform are required' },
      { status: 400 }
    );
  }

  try {
    const post =
      body.action === 'generate'
        ? await generateSocialDraft({
            pillar: body.pillar,
            platform: body.platform,
            userId: user!.id,
          })
        : await createSocialPost({
            pillar: body.pillar,
            platform: body.platform,
            userId: user!.id,
          });

    await writeAuditLog(user!.id, 'ops.social.create', 'social_post', post.id, {
      pillar: body.pillar,
      platform: body.platform,
      action: body.action ?? 'create',
    });

    return NextResponse.json({ success: true, post });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Create failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireFpOps();
  if (error) return error;

  let body: {
    id?: string;
    action?: 'approve' | 'needs_approval' | 'archive' | 'update';
    title?: string;
    caption?: string;
    script?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
  }

  try {
    let post;
    if (body.action === 'approve') {
      post = await updateSocialPost(body.id, {
        status: 'approved',
        approvedBy: user!.id,
        approvedAt: new Date().toISOString(),
        errorMessage: null,
      });
    } else if (body.action === 'needs_approval') {
      post = await updateSocialPost(body.id, { status: 'needs_approval' });
    } else if (body.action === 'archive') {
      post = await updateSocialPost(body.id, { status: 'archived' });
    } else {
      post = await updateSocialPost(body.id, {
        title: body.title,
        caption: body.caption,
        script: body.script,
      });
    }

    await writeAuditLog(user!.id, 'ops.social.update', 'social_post', post.id, {
      action: body.action ?? 'update',
    });

    return NextResponse.json({ success: true, post });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Update failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
