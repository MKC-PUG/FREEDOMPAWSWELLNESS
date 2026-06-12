import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import {
  advanceEnrollmentStep,
  captureEnrollmentRegion,
} from '@/lib/id/enroll-server';
import {
  collectAnalyzeFrameFiles,
  isValidAnalyzeImage,
} from '@/lib/ai/media-utils';
import type { IdentityRegion } from '@/lib/id/types';

const VALID_REGIONS = new Set<string>(['eyes', 'face', 'body', 'posture', 'gait']);
const STEP_AFTER_REGION: Partial<Record<IdentityRegion, number>> = {
  eyes: 4,
  face: 5,
  posture: 7,
  gait: 8,
};

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  try {
    const formData = await request.formData();
    const enrollmentId = (formData.get('enrollmentId') || '').toString().trim();
    const regionRaw = (formData.get('region') || '').toString().trim().toLowerCase();
    const angle = (formData.get('angle') || '').toString().trim() || null;
    const mediaTypeRaw = (formData.get('mediaType') || 'photo').toString();
    const mediaType = mediaTypeRaw === 'video' ? 'video' : 'photo';

    if (!enrollmentId) {
      return NextResponse.json({ success: false, error: 'enrollmentId is required.' }, { status: 400 });
    }
    if (!VALID_REGIONS.has(regionRaw)) {
      return NextResponse.json({ success: false, error: 'Invalid region.' }, { status: 400 });
    }

    const image = formData.get('image');
    const extraFrames = collectAnalyzeFrameFiles(formData);
    const frames: File[] = [];

    if (image instanceof File && image.size > 0) frames.push(image);
    for (const f of extraFrames) {
      if (!frames.some((x) => x.name === f.name && x.size === f.size)) frames.push(f);
    }

    if (frames.length === 0) {
      return NextResponse.json({ success: false, error: 'Upload a photo or video frame.' }, { status: 400 });
    }

    for (const frame of frames) {
      if (!isValidAnalyzeImage(frame)) {
        return NextResponse.json(
          { success: false, error: 'Invalid image. Use JPG or PNG under 15MB per frame.' },
          { status: 400 }
        );
      }
    }

    const region = regionRaw as IdentityRegion;
    const capture = await captureEnrollmentRegion(
      user!.id,
      enrollmentId,
      region,
      frames,
      mediaType,
      angle
    );

    let nextStep = STEP_AFTER_REGION[region];
    if (region === 'body' && angle === 'side') {
      nextStep = 6;
    }
    if (nextStep) {
      await advanceEnrollmentStep(user!.id, enrollmentId, nextStep);
    }

    return NextResponse.json({ success: true, capture });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Region capture failed.';
    console.error('[api/id/enroll/region]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
