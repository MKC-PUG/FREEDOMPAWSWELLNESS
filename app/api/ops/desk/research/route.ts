import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { searchDogTopics } from '@/lib/ops/studio-research';

export async function GET(request: NextRequest) {
  const { error } = await requireFpOps();
  if (error) return error;
  const q = request.nextUrl.searchParams.get('q')?.trim() || '';
  try {
    const hits = await searchDogTopics(q);
    return NextResponse.json({ success: true, hits });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Research failed';
    return NextResponse.json({ success: false, error: message, hits: [] }, { status: 400 });
  }
}
