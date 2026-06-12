import { NextRequest, NextResponse } from 'next/server';
import { requireFoundReporter } from '@/lib/api/auth';
import { listPilotShelters, submitFoundDogReport } from '@/lib/id/found-server';
import {
  collectAnalyzeFrameFiles,
  isValidAnalyzeImage,
} from '@/lib/ai/media-utils';

export async function GET() {
  const { error } = await requireFoundReporter();
  if (error) return error;

  try {
    const shelters = await listPilotShelters();
    return NextResponse.json({ success: true, shelters });
  } catch (err) {
    console.error('[api/id/found GET]', err);
    return NextResponse.json({ success: false, error: 'Could not load shelters.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, profile, error } = await requireFoundReporter();
  if (error) return error;

  try {
    const formData = await request.formData();
    const shelterId = (formData.get('shelterId') || '').toString().trim();
    const notes = (formData.get('notes') || '').toString().trim();
    const mediaTypeRaw = (formData.get('mediaType') || 'photo').toString();
    const mediaType = mediaTypeRaw === 'video' ? 'video' : 'photo';

    if (!shelterId) {
      return NextResponse.json({ success: false, error: 'Select a pilot shelter.' }, { status: 400 });
    }

    const image = formData.get('image');
    const extraFrames = collectAnalyzeFrameFiles(formData);
    const frames: File[] = [];

    if (image instanceof File && image.size > 0) frames.push(image);
    for (const f of extraFrames) {
      if (!frames.some((x) => x.name === f.name && x.size === f.size)) frames.push(f);
    }

    if (frames.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Upload at least one photo or video frames.' },
        { status: 400 }
      );
    }

    for (const frame of frames) {
      if (!isValidAnalyzeImage(frame)) {
        return NextResponse.json(
          { success: false, error: 'Invalid image. Use JPG or PNG under 15MB per frame.' },
          { status: 400 }
        );
      }
    }

    const result = await submitFoundDogReport(user!.id, profile!.role, {
      shelterId,
      notes,
      frames,
      mediaType,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Found-dog intake failed.';
    console.error('[api/id/found POST]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
