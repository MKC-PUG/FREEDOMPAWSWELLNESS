import { NextRequest, NextResponse } from 'next/server';
import { generateAiCostumeImage, isAiCostumeConfigured } from '@/lib/photobooth/ai-costume-generate';
import { isAiCostumeId } from '@/lib/photobooth/ai-costumes';

export const maxDuration = 120;

const MAX_BYTES = 8 * 1024 * 1024;

export async function GET() {
  return NextResponse.json({
    configured: isAiCostumeConfigured(),
    model: 'black-forest-labs/flux-kontext-pro',
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAiCostumeConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'AI Magic Look is coming online — Replicate API key not configured yet. Holiday backgrounds still work today.',
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image');
    const costumeId = (formData.get('costumeId') || '').toString().trim();

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ success: false, error: 'Photo required.' }, { status: 400 });
    }

    if (!isAiCostumeId(costumeId)) {
      return NextResponse.json({ success: false, error: 'Invalid costume.' }, { status: 400 });
    }

    if (image.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Photo too large — use under 8 MB.' },
        { status: 400 }
      );
    }

    const mime = image.type || 'image/jpeg';
    if (!mime.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Invalid image type.' }, { status: 400 });
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const out = await generateAiCostumeImage(bytes, mime, costumeId);
    const base64 = out.toString('base64');

    return NextResponse.json({
      success: true,
      imageDataUrl: `data:image/png;base64,${base64}`,
      costumeId,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'AI costume failed';
    console.error('[photobooth/ai-costume]', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
