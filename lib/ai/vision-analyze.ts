import OpenAI from 'openai';
import { PROTOCOL_BY_SLUG } from './protocol-registry';
import { SYSTEM_PROMPT } from './prompt-templates';

export type VisionAnalysisResult = {
  usedVision: boolean;
  visualFindings: string[];
  vetUrgent: boolean;
  vetUrgentReason: string | null;
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

const RESPONSE_SCHEMA = {
  type: 'object' as const,
  properties: {
    visualFindings: {
      type: 'array',
      items: { type: 'string' },
      description: 'Observable visual signs across all frames (max 6 short phrases)',
    },
    vetUrgent: { type: 'boolean' },
    vetUrgentReason: { type: ['string', 'null'] },
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
    'vetUrgent',
    'vetUrgentReason',
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
  vetUrgent: boolean;
  vetUrgentReason: string | null;
  primaryProtocolSlug: string;
  secondaryProtocolSlug: string | null;
  confidencePrimary: number;
  reasoning: string;
} {
  return JSON.parse(raw) as {
    visualFindings: string[];
    vetUrgent: boolean;
    vetUrgentReason: string | null;
    primaryProtocolSlug: string;
    secondaryProtocolSlug: string | null;
    confidencePrimary: number;
    reasoning: string;
  };
}

function buildVisionResult(
  parsed: ReturnType<typeof parseVisionResponse>,
  mediaType: 'photo' | 'video',
  frameCount: number
): VisionAnalysisResult {
  const primary = slugToTitle(parsed.primaryProtocolSlug);
  const secondary = slugToTitle(parsed.secondaryProtocolSlug);
  const boost =
    primary && parsed.confidencePrimary >= 75
      ? Math.min(8, Math.round((parsed.confidencePrimary - 70) / 3))
      : 0;

  return {
    usedVision: true,
    visualFindings: parsed.visualFindings?.slice(0, 6) ?? [],
    vetUrgent: Boolean(parsed.vetUrgent),
    vetUrgentReason: parsed.vetUrgentReason,
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
  const mediaNote =
    mediaType === 'video'
      ? `This is a short dog video represented by ${frames.length} sampled frames. Consider gait, posture, and movement across frames.`
      : 'Analyze the dog photo for visible signs.';

  const userText = `Owner-reported symptoms: "${symptoms}"

Allowed protocol slugs (use exactly these): ${slugList}

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

    return buildVisionResult(parseVisionResponse(raw), mediaType, frames.length);
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
