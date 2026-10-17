import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { writeAuditLog } from '@/lib/id/audit';
import {
  acceptResearch,
  approveScript,
  createGeneralJob,
  createVideoJob,
  listStudioJobs,
  pollStudioRender,
  queueSocialPost,
  saveStudioJob,
  setStudioStatus,
} from '@/lib/ops/studio-server';

export const maxDuration = 60;

function tableError(message: string) {
  if (message.includes('ops_jobs')) {
    return NextResponse.json({ success: false, error: message, jobs: [] }, { status: 503 });
  }
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

export async function GET() {
  const { error } = await requireFpOps();
  if (error) return error;
  try {
    const jobs = await listStudioJobs(40);
    return NextResponse.json({ success: true, jobs });
  } catch (e) {
    return tableError(e instanceof Error ? e.message : 'Load failed');
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireFpOps();
  if (error) return error;

  let body: {
    action?: string;
    id?: string;
    catalogCode?: string;
    platform?: string;
    seat?: string;
    title?: string;
    brief?: string;
    factCard?: string;
    script?: string;
    echoCaption?: string;
    echoArticle?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const userId = user!.id;
    let job;
    switch (body.action) {
      case 'create_video':
        job = await createVideoJob({
          catalogCode: body.catalogCode || '',
          platform: body.platform || 'instagram',
          userId,
        });
        break;
      case 'create_general':
        job = await createGeneralJob({
          seat: body.seat || '',
          title: body.title || '',
          brief: body.brief || '',
          userId,
        });
        break;
      case 'save':
        if (!body.id) throw new Error('Job id is required');
        job = await saveStudioJob(body.id, {
          factCard: body.factCard,
          script: body.script,
          echoCaption: body.echoCaption,
          echoArticle: body.echoArticle,
        });
        break;
      case 'accept_research':
        if (!body.id) throw new Error('Job id is required');
        job = await acceptResearch(body.id);
        break;
      case 'approve_script':
        if (!body.id) throw new Error('Job id is required');
        job = await approveScript(body.id);
        break;
      case 'poll_render':
        if (!body.id) throw new Error('Job id is required');
        job = await pollStudioRender(body.id);
        break;
      case 'queue_social':
        if (!body.id) throw new Error('Job id is required');
        job = await queueSocialPost(body.id, userId);
        break;
      case 'hold':
      case 'done':
        if (!body.id) throw new Error('Job id is required');
        job = await setStudioStatus(body.id, body.action);
        break;
      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }

    await writeAuditLog(userId, 'ops.desk.update', 'ops_job', job.id, { action: body.action });
    return NextResponse.json({ success: true, job });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Desk action failed';
    if (message.includes('ops_jobs')) return tableError(message);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
