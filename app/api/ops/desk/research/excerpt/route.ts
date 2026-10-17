import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { excerptForSource } from '@/lib/ops/studio-research';

export async function GET(request: NextRequest) {
  const { error } = await requireFpOps();
  if (error) return error;
  const url = request.nextUrl.searchParams.get('url')?.trim() || '';
  const q = request.nextUrl.searchParams.get('q')?.trim() || '';
  const title = request.nextUrl.searchParams.get('title')?.trim() || '';
  try {
    const excerpt = await excerptForSource({ url, query: q, title });
    return NextResponse.json({ success: true, excerpt });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Excerpt failed';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
