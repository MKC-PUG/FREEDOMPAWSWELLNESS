import { NextRequest, NextResponse } from 'next/server';
import { analyzeDogImage } from '@/lib/ai/diagnostics';
import { isValidImageFile } from '@/lib/ai/image-utils';
import { getApprovedAliases, recordAnalysis } from '@/lib/symptom-feedback-store';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const symptoms = (formData.get('symptoms') || '').toString().trim();

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Please upload a photo before analyzing.' },
        { status: 400 }
      );
    }

    if (!isValidImageFile(image)) {
      return NextResponse.json(
        { success: false, error: 'Invalid image. Use JPG, PNG, or HEIC under 15MB.' },
        { status: 400 }
      );
    }

    if (!symptoms) {
      return NextResponse.json(
        { success: false, error: 'Please describe symptoms before analyzing.' },
        { status: 400 }
      );
    }

    const approved = await getApprovedAliases();
    const analysis = await analyzeDogImage(image, { symptoms }, approved);

    if (!analysis.success || !analysis.data) {
      return NextResponse.json({
        success: false,
        error: analysis.error || 'Analysis failed',
      });
    }

    const { data, analysisMeta } = analysis;

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

    return NextResponse.json({
      success: true,
      analysisId: saved.id,
      primary: {
        protocol: data.primaryProtocol,
        confidence: `${data.confidence}%`,
      },
      secondary: data.secondaryProtocol
        ? {
            protocol: data.secondaryProtocol,
            confidence: `${Math.max(data.confidence - 8, 60)}%`,
          }
        : null,
      finding: data.finding,
      reasoning: data.reasoning,
      matchedTerms: analysisMeta?.matchedTerms ?? [],
      unknownPhrases: analysisMeta?.unknownPhrases ?? [],
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ success: false, error: 'Analysis failed' });
  }
}
