import OpenAI from 'openai';
import { SEVERE_CONDITION_IDS } from './severe-conditions-db';
import { PROTOCOL_BY_SLUG } from './protocol-registry';
import { SYSTEM_PROMPT } from './prompt-templates';
import { assessUrgentNeed } from './urgent-assessment';

export type VisionAnalysisResult = {
  usedVision: boolean;
  visualFindings: string[];
  vetUrgent: boolean;
  vetUrgentReason: string | null;
  urgentCongruency: number;
  matchedSevereCondition: string | null;
  mildModerateOnly: boolean;
  severeIndicatorHits: Array<{ conditionId: string; confidence: number }>;
  primaryProtocolTitle: string | null;
  secondaryProtocolTitle: string | null;
  confidenceBoost: number;
  reasoning: string;
  frameCount: number;
  mediaType: 'photo' | 'video';
};

const SLUG_TO_TITLE: Record<string, string> = Object.fromEntries(
  Object.entries(PROTOCOL_BY_SLUG).map(([slug, rec]) => [slug, rec.brandedTitle])
);

const VALID_SLUGS = new Set(Object.keys(PROTOCOL_BY_SLUG));

const VALID_SEVERE_IDS = new Set(SEVERE_CONDITION_IDS);

const RESPONSE_SCHEMA = {
  type: 'object' as const,
  properties: {
    visualFindings: {
      type: 'array',
      items: { type: 'string' },
      description: 'Observable visual signs across all frames (max 6 short phrases)',
    },
    severeIndicatorHits: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          conditionId: {
            type: 'string',
            description: 'Severe condition ID from the allowed severe list',
          },
          confidence: { type: 'number', description: '0-100 confidence for this severe indicator' },
        },
        required: ['conditionId', 'confidence'],
        additionalProperties: false,
      },
      description: 'Only severe conditions from the allowed ID list — omit mild/moderate signs',
    },
    primaryProtocolSlug: {
      type: 'string',
      description: 'Best-matching protocol slug from the allowed list',
    },
    secondaryProtocolSlug: {
      type: ['string', 'null'],
      description: 'Second protocol slug if a distinct overlap area is visible',
    },
    confidencePrimary: { type: 'number', description: '0-100' },
    reasoning: { type: 'string' },
  },
  required: [
    'visualFindings',
    'severeIndicatorHits',
    'primaryProtocolSlug',
    'secondaryProtocolSlug',
    'confidencePrimary',
    'reasoning',
  ],
  additionalProperties: false,
};

function slugToTitle(slug: string | null | undefined): string | null {
  if (!slug || !VALID_SLUGS.has(slug)) return null;
  return SLUG_TO_TITLE[slug] ?? PROTOCOL_BY_SLUG[slug]?.brandedTitle ?? null;
}

function emptyVision(
  reason: string,
  mediaType: 'photo' | 'video' = 'photo',
  frameCount = 0
): VisionAnalysisResult {
  return {
    usedVision: false,
    visualFindings: [],
    vetUrgent: false,
    vetUrgentReason: null,
    urgentCongruency: 0,
    matchedSevereCondition: null,
    mildModerateOnly: false,
    severeIndicatorHits: [],
    primaryProtocolTitle: null,
    secondaryProtocolTitle: null,
    confidenceBoost: 0,
    reasoning: reason,
    frameCount,
    mediaType,
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');
  const mime = file.type || 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

function parseVisionResponse(raw: string): {
  visualFindings: string[];
  severeIndicatorHits: Array<{ conditionId: string; confidence: number }>;
  primaryProtocolSlug: string;
  secondaryProtocolSlug: string | null;
  confidencePrimary: number;
  reasoning: string;
} {
  return JSON.parse(raw) as {
    visualFindings: string[];
    severeIndicatorHits: Array<{ conditionId: string; confidence: number }>;
    primaryProtocolSlug: string;
    secondaryProtocolSlug: string | null;
    confidencePrimary: number;
    reasoning: string;
  };
}

function sanitizeSevereHits(
  hits: Array<{ conditionId: string; confidence: number }> | undefined
): Array<{ conditionId: string; confidence: number }> {
  if (!hits?.length) return [];
  return hits
    .filter((h) => VALID_SEVERE_IDS.has(h.conditionId) && h.confidence >= 70)
    .map((h) => ({
      conditionId: h.conditionId,
      confidence: Math.min(100, Math.max(0, Math.round(h.confidence))),
    }));
}

function buildVisionResult(
  parsed: ReturnType<typeof parseVisionResponse>,
  mediaType: 'photo' | 'video',
  frameCount: number,
  symptoms: string
): VisionAnalysisResult {
  const primary = slugToTitle(parsed.primaryProtocolSlug);
  const secondary = slugToTitle(parsed.secondaryProtocolSlug);
  const boost =
    primary && parsed.confidencePrimary >= 75
      ? Math.min(8, Math.round((parsed.confidencePrimary - 70) / 3))
      : 0;

  const severeIndicatorHits = sanitizeSevereHits(parsed.severeIndicatorHits);
  const visualFindings = parsed.visualFindings?.slice(0, 6) ?? [];

  const urgent = assessUrgentNeed({
    symptoms,
    visualFindings,
    aiSevereHits: severeIndicatorHits,
  });

  return {
    usedVision: true,
    visualFindings,
    vetUrgent: urgent.vetUrgent,
    vetUrgentReason: urgent.vetUrgentReason,
    urgentCongruency: urgent.congruencyScore,
    matchedSevereCondition: urgent.matchedConditionName,
    mildModerateOnly: urgent.mildModerateOnly,
    severeIndicatorHits,
    primaryProtocolTitle: primary,
    secondaryProtocolTitle: secondary,
    confidenceBoost: boost,
    reasoning: parsed.reasoning || '',
    frameCount,
    mediaType,
  };
}

/**
 * Analyze one or more still frames (photo or extracted video frames) with OpenAI vision.
 */
export async function analyzeVisionFrames(
  files: File[],
  symptoms: string,
  mediaType: 'photo' | 'video' = 'photo'
): Promise<VisionAnalysisResult> {
  const frames = files.filter((f) => f.size > 0).slice(0, 5);
  if (frames.length === 0) {
    return emptyVision('No image frames to analyze.', mediaType, 0);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return emptyVision('Vision analysis skipped — OPENAI_API_KEY not configured.', mediaType, frames.length);
  }

  const slugList = [...VALID_SLUGS].join(', ');
  const severeList = [...VALID_SEVERE_IDS].join(', ');
  const mediaNote =
    mediaType === 'video'
      ? `This is a short dog video represented by ${frames.length} sampled frames. Consider gait, posture, and movement across frames.`
      : 'Analyze the dog photo for visible signs.';

  const userText = `Owner-reported symptoms: "${symptoms}"

Allowed protocol slugs (use exactly these): ${slugList}

Allowed severe condition IDs for severeIndicatorHits (exact IDs only): ${severeList}

Overlap rule example: senior cognitive signs → primary patriot-immune, secondary freedom-calm.

${mediaNote}
Combine visual signals with symptoms. Never diagnose — suggest protocol alignment only. Return JSON only.`;

  try {
    const imageParts = await Promise.all(
      frames.map(async (file) => ({
        type: 'image_url' as const,
        image_url: { url: await fileToDataUrl(file), detail: 'low' as const },
      }))
    );

    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_VISION_MODEL?.trim() || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [{ type: 'text', text: userText }, ...imageParts],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'vit_dog_analysis',
          strict: true,
          schema: RESPONSE_SCHEMA,
        },
      },
      max_tokens: 900,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return emptyVision('Vision model returned no content.', mediaType, frames.length);

    return buildVisionResult(parseVisionResponse(raw), mediaType, frames.length, symptoms);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Vision request failed';
    console.error('[vision-analyze]', msg);
    return emptyVision(
      `Vision analysis unavailable (${msg}). Using symptom matching.`,
      mediaType,
      frames.length
    );
  }
}

/** @deprecated Use analyzeVisionFrames — single photo wrapper */
export async function analyzePhotoVision(file: File, symptoms: string): Promise<VisionAnalysisResult> {
  return analyzeVisionFrames([file], symptoms, 'photo');
}
