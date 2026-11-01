import { NextRequest, NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { saveCanvaTemplates } from '@/lib/ops/canva';

export async function POST(request: NextRequest) {
  const { error } = await requireFpOps();
  if (error) return error;

  let body: { end_card?: string; thumbnail?: string; one_pager?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const saved = await saveCanvaTemplates({
      end_card: body.end_card || '',
      thumbnail: body.thumbnail || '',
      one_pager: body.one_pager || '',
    });
    return NextResponse.json({ success: true, saved });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not save the Canva templates';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
