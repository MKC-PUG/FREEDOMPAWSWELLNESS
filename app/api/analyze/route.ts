import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { analyzeDogMedia } from '@/lib/ai/diagnostics';
import { analyzeIdentityFrames, parseIdentityRegions } from '@/lib/ai/identity-analyze';
import {
  collectAnalyzeFrameFiles,
  isValidAnalyzeImage,
} from '@/lib/ai/media-utils';
import type { AnalyzeMode } from '@/lib/id/types';
import {
  toAnalyzeApiResponse,
  toBothAnalyzeApiResponse,
  toIdentityAnalyzeApiResponse,
  toVitProAnalyzeApiResponse,
} from '@/lib/ai/types';
import { getApprovedAliases, recordAnalysis } from '@/lib/symptom-feedback-store';
import { analyzeVitPro } from '@/lib/vit-pro/vit-pro-analyze';
import { parseVitProRegionHint } from '@/lib/vit-pro/detect-region';

function parseAnalyzeMode(raw: string): AnalyzeMode {
  const mode = raw.trim().toLowerCase();
  if (mode === 'identity' || mode === 'both' || mode === 'vit_pro') return mode;
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

    if (mode === 'identity' || mode === 'both') {
      const regions = parseIdentityRegions(regionsRaw);
      if (mediaType === 'video' && !regions.includes('gait') && !regions.includes('posture')) {
        regions.push('gait');
      }

      if (mode === 'both') {
        if (!symptoms) {
          return NextResponse.json(
            { success: false, error: 'Please describe symptoms before analyzing.' },
            { status: 400 }
          );
        }
        if (regions.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Select at least one identity region for combined analysis.' },
            { status: 400 }
          );
        }

        const approved = await getApprovedAliases();
        const [wellness, identity] = await Promise.all([
          analyzeDogMedia({ symptoms, mediaType, frames }, approved),
          analyzeIdentityFrames(frames, regions, mediaType, identityNotes),
        ]);

        if (!wellness.success || !wellness.data) {
          return NextResponse.json({
            success: false,
            error: wellness.error || 'Wellness analysis failed',
          });
        }

        let analysisId: string = randomUUID();
        try {
          const saved = await recordAnalysis({
            symptoms,
            normalized: wellness.analysisMeta?.normalized ?? symptoms.toLowerCase(),
            primaryProtocol: wellness.data.primaryProtocol,
            secondaryProtocol: wellness.data.secondaryProtocol,
            confidence: wellness.data.confidence,
            matchedTerms: wellness.analysisMeta?.matchedTerms ?? [],
            unknownPhrases: wellness.analysisMeta?.unknownPhrases ?? [],
            usedFallback: wellness.analysisMeta?.usedFallback ?? false,
          });
          analysisId = saved.id;
        } catch (persistErr) {
          console.warn('Analysis record not persisted (continuing):', persistErr);
        }

        return NextResponse.json(
          toBothAnalyzeApiResponse(analysisId, wellness.data, identity, {
            matchedTerms: wellness.analysisMeta?.matchedTerms ?? [],
            unknownPhrases: wellness.analysisMeta?.unknownPhrases ?? [],
            usedVision: identity.usedVision || Boolean(wellness.data.usedVision),
            mediaType: identity.mediaType,
            frameCount: identity.frameCount,
          })
        );
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

    if (mode === 'vit_pro') {
      const signalmentNotes = (formData.get('signalmentNotes') || '').toString().trim() || undefined;
      const regionHint = parseVitProRegionHint((formData.get('vitRegion') || '').toString());
      const outputTier = (formData.get('outputTier') || 'vet').toString().trim().toLowerCase();

      const vitResult = await analyzeVitPro({
        symptoms,
        frames,
        mediaType,
        signalmentNotes,
        regionHint,
      });

      if (!vitResult.success || !vitResult.vet) {
        return NextResponse.json(
          { success: false, error: vitResult.error || 'ViT Pro analysis failed' },
          { status: vitResult.error?.includes('not enabled') ? 503 : 400 }
        );
      }

      const analysisId = vitResult.vet.reportId;
      return NextResponse.json(
        toVitProAnalyzeApiResponse(analysisId, vitResult.vet, {
          includePublic: outputTier === 'both',
          publicOutput: vitResult.public,
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
