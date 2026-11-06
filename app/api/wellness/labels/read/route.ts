import { NextRequest, NextResponse } from 'next/server';
import { resultFromText, transcriptFromImage } from '@/lib/wellness/read-label';
import type { LabelCategory } from '@/lib/wellness/not-good-list';

export const runtime = 'nodejs';

const CATEGORIES: LabelCategory[] = ['food', 'treat', 'chew', 'toy'];
const MAX_BYTES = 6 * 1024 * 1024;

function categoryFrom(raw: string | null | undefined): LabelCategory | null {
  const value = (raw ?? '').trim().toLowerCase();
  return CATEGORIES.includes(value as LabelCategory) ? (value as LabelCategory) : null;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const body = (await request.json()) as { text?: string; category?: string };
      const category = categoryFrom(body.category);
      if (!category) {
        return NextResponse.json({ success: false, error: 'Choose food, treat, chew, or toy.' }, { status: 400 });
      }
      const text = (body.text ?? '').trim();
      if (text.length < 3) {
        return NextResponse.json(
          { success: false, error: 'Paste the ingredient or material panel first.' },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, result: resultFromText(text, category, 'pasted-text') });
    }

    const form = await request.formData();
    const category = categoryFrom(form.get('category')?.toString());
    if (!category) {
      return NextResponse.json({ success: false, error: 'Choose food, treat, chew, or toy.' }, { status: 400 });
    }
    const image = form.get('image');
    if (!(image instanceof File) || image.size <= 0) {
      return NextResponse.json({ success: false, error: 'Add a photo of the label or paste the text.' }, { status: 400 });
    }
    if (image.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: 'Use a photo under 6 MB.' }, { status: 400 });
    }
    if (image.type && !image.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Upload a photo of the label.' }, { status: 400 });
    }

    const read = await transcriptFromImage(image);
    return NextResponse.json({
      success: true,
      result: resultFromText(read.transcript, category, 'photo', read.unreadable),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not read that label.';
    console.error('[labels/read]', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
