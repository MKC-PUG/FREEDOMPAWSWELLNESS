import { NextRequest, NextResponse } from 'next/server';
import { requireMatchDecider } from '@/lib/api/auth';
import { reviewMatchCandidate } from '@/lib/id/match-server';
import type { MatchReviewStatus } from '@/lib/id/types';

const VALID: MatchReviewStatus[] = ['approved', 'rejected', 'insufficient_evidence'];

export async function POST(request: NextRequest) {
  const { user, error } = await requireMatchDecider();
  if (error) return error;

  try {
    const body = (await request.json()) as {
      candidateId?: string;
      decision?: MatchReviewStatus;
      notes?: string;
    };

    if (!body.candidateId?.trim()) {
      return NextResponse.json({ success: false, error: 'candidateId is required.' }, { status: 400 });
    }
    if (!body.decision || !VALID.includes(body.decision)) {
      return NextResponse.json({ success: false, error: 'Invalid decision.' }, { status: 400 });
    }

    const candidate = await reviewMatchCandidate(user!.id, {
      candidateId: body.candidateId.trim(),
      decision: body.decision,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      candidate,
      ownerEmailSent: candidate.ownerEmailSent ?? false,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Review failed.';
    console.error('[api/id/match/review]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
