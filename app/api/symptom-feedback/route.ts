import { NextRequest, NextResponse } from 'next/server';
import { setUserFeedback } from '@/lib/symptom-feedback-store';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      analysisId?: string;
      feedback?: 'helpful' | 'wrong';
      suggestedProtocol?: string;
    };

    if (!body.analysisId || !body.feedback) {
      return NextResponse.json({ success: false, error: 'Missing analysisId or feedback' }, { status: 400 });
    }

    const record = await setUserFeedback(body.analysisId, body.feedback, body.suggestedProtocol);
    if (!record) {
      return NextResponse.json({ success: false, error: 'Analysis not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('symptom-feedback error:', error);
    return NextResponse.json({ success: false, error: 'Feedback failed' }, { status: 500 });
  }
}
