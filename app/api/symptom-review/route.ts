import { NextRequest, NextResponse } from 'next/server';
import {
  approvePhrase,
  getAllApprovedAliases,
  listPendingPhrases,
  listRecentAnalyses,
  rejectPhrase,
} from '@/lib/symptom-feedback-store';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const [pending, approved, recent] = await Promise.all([
    listPendingPhrases(),
    getAllApprovedAliases(),
    listRecentAnalyses(30),
  ]);

  return NextResponse.json({ pending, approved, recent });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  try {
    const body = (await request.json()) as {
      action?: 'approve' | 'reject';
      phraseId?: string;
      protocol?: string;
      canonical?: string;
    };

    if (!body.action || !body.phraseId) {
      return NextResponse.json({ success: false, error: 'Missing action or phraseId' }, { status: 400 });
    }

    if (body.action === 'approve') {
      if (!body.protocol) {
        return NextResponse.json({ success: false, error: 'Protocol required for approve' }, { status: 400 });
      }
      const approved = await approvePhrase(body.phraseId, body.protocol, body.canonical);
      if (!approved) {
        return NextResponse.json({ success: false, error: 'Phrase not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, approved });
    }

    const rejected = await rejectPhrase(body.phraseId);
    if (!rejected) {
      return NextResponse.json({ success: false, error: 'Phrase not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, rejected });
  } catch (error) {
    console.error('symptom-review error:', error);
    return NextResponse.json({ success: false, error: 'Review action failed' }, { status: 500 });
  }
}
