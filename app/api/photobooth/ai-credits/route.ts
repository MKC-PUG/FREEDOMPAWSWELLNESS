import { NextRequest, NextResponse } from 'next/server';
import { getAiCreditStatus } from '@/lib/photobooth/ai-credits-server';

export async function GET(request: NextRequest) {
  try {
    const status = await getAiCreditStatus(request);
    return NextResponse.json(status);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Credits unavailable';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
