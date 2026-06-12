import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { analyzeDogMedia } from '@/lib/ai/diagnostics';
import { analyzeIdentityFrames, parseIdentityRegions } from '@/lib/ai/identity-analyze';
import {
  collectAnalyzeFrameFiles,
  isValidAnalyzeImage,
} from '@/lib/ai/media-utils';
import type { AnalyzeMode } from '@/lib/id/types';
import { toAnalyzeApiResponse, toIdentityAnalyzeApiResponse } from '@/lib/ai/types';
import { getApprovedAliases, recordAnalysis } from '@/lib/symptom-feedback-store';

function parseAnalyzeMode(raw: string): AnalyzeMode {
  const mode = raw.trim().toLowerCase();
  if (mode === 'identity' || mode === 'both') return mode;
  return 'wellness';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const symptoms = (formData.get('symptoms') || '').toString().trim();
    const mode = parseAnalyzeMode((formData.get('mode') || 'wellness').toString());
    const regionsRaw = (formData.get('regions') || '').toString();
    const identityNotes = (formData.get('identityNotes') || '').toString().trim();
    const mediaTypeRaw = (formData.get('mediaType') || 'photo').toString();
    const mediaType = mediaTypeRaw === 'video' ? 'video' : 'photo';

    const extraFrames = collectAnalyzeFrameFiles(formData);
    const frames: File[] = [];

    if (image instanceof File && image.size > 0) {
      frames.push(image);
    }
    for (const f of extraFrames) {
      if (!frames.some((x) => x.name === f.name && x.size === f.size)) {
        frames.push(f);
      }
    }

    if (frames.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please upload a photo or short video before analyzing.' },
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

    if (mode === 'identity') {
      const regions = parseIdentityRegions(regionsRaw);
      if (mediaType === 'video' && !regions.includes('gait') && !regions.includes('posture')) {
        regions.push('gait');
      }

      const identity = await analyzeIdentityFrames(frames, regions, mediaType, identityNotes);
      const analysisId = randomUUID();

      return NextResponse.json(
        toIdentityAnalyzeApiResponse(analysisId, identity, {
          usedVision: identity.usedVision,
          mediaType: identity.mediaType,
          frameCount: identity.frameCount,
        })
      );
    }

    if (!symptoms) {
      return NextResponse.json(
        { success: false, error: 'Please describe symptoms before analyzing.' },
        { status: 400 }
      );
    }

    const approved = await getApprovedAliases();
    const analysis = await analyzeDogMedia(
      { symptoms, mediaType, frames },
      approved
    );

    if (!analysis.success || !analysis.data) {
      return NextResponse.json({
        success: false,
        error: analysis.error || 'Analysis failed',
      });
    }

    const { data, analysisMeta } = analysis;

    let analysisId: string = randomUUID();
    try {
      const saved = await recordAnalysis({
        symptoms,
        normalized: analysisMeta?.normalized ?? symptoms.toLowerCase(),
        primaryProtocol: data.primaryProtocol,
        secondaryProtocol: data.secondaryProtocol,
        confidence: data.confidence,
        matchedTerms: analysisMeta?.matchedTerms ?? [],
        unknownPhrases: analysisMeta?.unknownPhrases ?? [],
        usedFallback: analysisMeta?.usedFallback ?? false,
      });
      analysisId = saved.id;
    } catch (persistErr) {
      console.warn('Analysis record not persisted (continuing):', persistErr);
    }

    return NextResponse.json(
      toAnalyzeApiResponse(analysisId, data, {
        matchedTerms: analysisMeta?.matchedTerms ?? [],
        unknownPhrases: analysisMeta?.unknownPhrases ?? [],
      })
    );
  } catch (error) {
    console.error('Analysis error:', error);
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? detail : 'Analysis failed',
    });
  }
}
