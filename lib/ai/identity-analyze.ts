import OpenAI from 'openai';
import {
  IDENTITY_ANALYSIS_PROMPT,
  IDENTITY_EYES_DARK_COAT_HINT,
  IDENTITY_SYSTEM_PROMPT,
} from './prompt-templates';
import type { IdentityAnalysisResult, IdentityRegion } from '@/lib/id/types';
import { IDENTITY_REGIONS } from '@/lib/id/types';

const BASE_REGION_RESULT_SCHEMA = {
  type: 'object' as const,
  properties: {
    descriptors: {
      type: 'array',
      items: { type: 'string' },
      description: '3-8 objective identity phrases',
    },
    qualityScore: { type: 'number', description: '0-1' },
    qualityIssues: { type: 'array', items: { type: 'string' } },
  },
  required: ['descriptors', 'qualityScore', 'qualityIssues'],
  additionalProperties: false,
};

/** OpenAI strict JSON schema requires every property key in `required`. */
const POSTURE_REGION_RESULT_SCHEMA = {
  type: 'object' as const,
  properties: {
    descriptors: { type: 'array', items: { type: 'string' } },
    qualityScore: { type: 'number' },
    qualityIssues: { type: 'array', items: { type: 'string' } },
    postureClass: { type: ['string', 'null'] },
  },
  required: ['descriptors', 'qualityScore', 'qualityIssues', 'postureClass'],
  additionalProperties: false,
};

const GAIT_REGION_RESULT_SCHEMA = {
  type: 'object' as const,
  properties: {
    descriptors: { type: 'array', items: { type: 'string' } },
    qualityScore: { type: 'number' },
    qualityIssues: { type: 'array', items: { type: 'string' } },
    gaitDescriptor: { type: ['string', 'null'] },
    limbSymmetry: {
      type: ['string', 'null'],
      enum: ['symmetric', 'mild_asymmetry', 'marked_asymmetry', 'unknown', null],
    },
  },
  required: ['descriptors', 'qualityScore', 'qualityIssues', 'gaitDescriptor', 'limbSymmetry'],
  additionalProperties: false,
};

function regionResultSchema(region: IdentityRegion) {
  if (region === 'posture') return POSTURE_REGION_RESULT_SCHEMA;
  if (region === 'gait') return GAIT_REGION_RESULT_SCHEMA;
  return BASE_REGION_RESULT_SCHEMA;
}

const VALID_REGIONS = new Set<string>(IDENTITY_REGIONS);

/** Per-region minimums — eyes relaxed for dark-coated dogs (black pugs, etc.) */
export const REGION_CAPTURE_THRESHOLDS: Record<
  IdentityRegion,
  { minScore: number; minDescriptors: number }
> = {
  eyes: { minScore: 0.42, minDescriptors: 2 },
  face: { minScore: 0.55, minDescriptors: 3 },
  body: { minScore: 0.6, minDescriptors: 3 },
  posture: { minScore: 0.55, minDescriptors: 2 },
  gait: { minScore: 0.55, minDescriptors: 2 },
};

function buildIdentityResponseSchema(requested: IdentityRegion[]) {
  const regionProperties: Record<string, ReturnType<typeof regionResultSchema>> = {};
  for (const region of requested) {
    regionProperties[region] = regionResultSchema(region);
  }
  return {
    type: 'object' as const,
    properties: {
      regions: {
        type: 'object' as const,
        properties: regionProperties,
        required: requested,
        additionalProperties: false,
      },
      fusedDescriptorText: { type: 'string' },
      enrollReady: { type: 'boolean' },
      disclaimer: { type: 'string' },
    },
    required: ['regions', 'fusedDescriptorText', 'enrollReady', 'disclaimer'],
    additionalProperties: false,
  };
}

function regionCaptureHint(region: IdentityRegion): string {
  if (region === 'eyes') return IDENTITY_EYES_DARK_COAT_HINT;
  return '';
}

function visionDetailForRegions(
  regions: IdentityRegion[],
  frameCount: number,
  mediaType: 'photo' | 'video'
): 'low' | 'high' | 'auto' {
  if (mediaType === 'photo' && frameCount <= 2) {
    if (regions.some((r) => r === 'eyes' || r === 'face')) return 'high';
  }
  return frameCount <= 2 ? 'high' : 'low';
}

function emptyIdentity(
  reason: string,
  frameCount: number,
  mediaType: 'photo' | 'video'
): IdentityAnalysisResult & { usedVision: boolean; frameCount: number; mediaType: 'photo' | 'video' } {
  return {
    usedVision: false,
    frameCount,
    mediaType,
    regions: {},
    fusedDescriptorText: reason,
    enrollReady: false,
    disclaimer:
      'Educational identity capture only — not a government license or veterinary diagnosis.',
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');
  const mime = file.type || 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

function parseRegions(raw: Record<string, unknown>): IdentityAnalysisResult['regions'] {
  const out: IdentityAnalysisResult['regions'] = {};
  for (const [key, val] of Object.entries(raw)) {
    if (!VALID_REGIONS.has(key) || !val || typeof val !== 'object') continue;
    const r = val as Record<string, unknown>;
    out[key as IdentityRegion] = {
      region: key as IdentityRegion,
      descriptors: Array.isArray(r.descriptors)
        ? r.descriptors.filter((d): d is string => typeof d === 'string').slice(0, 8)
        : [],
      qualityScore:
        typeof r.qualityScore === 'number' ? Math.min(1, Math.max(0, r.qualityScore)) : 0,
      qualityIssues: Array.isArray(r.qualityIssues)
        ? r.qualityIssues.filter((i): i is string => typeof i === 'string')
        : [],
      postureClass: typeof r.postureClass === 'string' ? r.postureClass : undefined,
      gaitDescriptor: typeof r.gaitDescriptor === 'string' ? r.gaitDescriptor : undefined,
      limbSymmetry:
        r.limbSymmetry === 'symmetric' ||
        r.limbSymmetry === 'mild_asymmetry' ||
        r.limbSymmetry === 'marked_asymmetry' ||
        r.limbSymmetry === 'unknown'
          ? r.limbSymmetry
          : undefined,
    };
  }
  return out;
}

export function regionCaptureMeetsThreshold(
  region: IdentityRegion,
  qualityScore: number,
  descriptorCount: number
): boolean {
  const t = REGION_CAPTURE_THRESHOLDS[region];
  return qualityScore >= t.minScore && descriptorCount >= t.minDescriptors;
}

function computeEnrollReady(
  regions: IdentityAnalysisResult['regions'],
  requested: IdentityRegion[]
): boolean {
  if (requested.length === 0) return false;
  return requested.every((region) => {
    const r = regions[region];
    if (!r) return false;
    return regionCaptureMeetsThreshold(region, r.qualityScore, r.descriptors.length);
  });
}

async function callIdentityModel(
  apiKey: string,
  userText: string,
  frames: File[],
  requested: IdentityRegion[],
  detail: 'low' | 'high' | 'auto'
): Promise<IdentityAnalysisResult['regions']> {
  const imageParts = await Promise.all(
    frames.map(async (file) => ({
      type: 'image_url' as const,
      image_url: { url: await fileToDataUrl(file), detail },
    }))
  );

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_VISION_MODEL?.trim() || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: IDENTITY_SYSTEM_PROMPT },
      {
        role: 'user',
        content: [{ type: 'text', text: userText }, ...imageParts],
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'freedom_paws_identity',
        strict: true,
        schema: buildIdentityResponseSchema(requested),
      },
    },
    max_tokens: 900,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) return {};

  const parsed = JSON.parse(raw) as {
    regions?: Record<string, unknown>;
    fusedDescriptorText?: string;
    enrollReady?: boolean;
    disclaimer?: string;
  };

  return parseRegions(parsed.regions ?? {});
}

/**
 * Analyze frames for Freedom Paws ID identity regions (Track 1).
 */
export async function analyzeIdentityFrames(
  files: File[],
  regions: IdentityRegion[],
  mediaType: 'photo' | 'video' = 'photo',
  notes?: string
): Promise<
  IdentityAnalysisResult & { usedVision: boolean; frameCount: number; mediaType: 'photo' | 'video' }
> {
  const frames = files.filter((f) => f.size > 0).slice(0, 5);
  const requested = regions.filter((r) => VALID_REGIONS.has(r));
  if (frames.length === 0) {
    return emptyIdentity('No image frames to analyze.', 0, mediaType);
  }
  if (requested.length === 0) {
    return emptyIdentity('No valid identity regions requested.', frames.length, mediaType);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return emptyIdentity(
      'Identity analysis skipped — OPENAI_API_KEY not configured.',
      frames.length,
      mediaType
    );
  }

  const regionList = requested.join(', ');
  const mediaNote =
    mediaType === 'video'
      ? `Short dog video represented by ${frames.length} sampled frames. Gait/posture regions should use motion across frames.`
      : 'Still photo — analyze visible identity features only.';

  const regionHints = requested
    .map((r) => regionCaptureHint(r))
    .filter(Boolean)
    .join('\n\n');

  const buildUserText = (retry: boolean) =>
    `${IDENTITY_ANALYSIS_PROMPT}

Requested region(s): ${regionList}
${notes?.trim() ? `Capture notes: "${notes.trim()}"` : ''}
${regionHints ? `\n${regionHints}\n` : ''}
${retry ? '\nRETRY: You MUST populate every requested region in JSON.regions with descriptors and qualityScore. For dark/black dogs, describe periocular geometry and catchlights even if pupils are not clearly visible.\n' : ''}

${mediaNote}

Return JSON only. Analyze ONLY the requested region(s).`;

  const detail = visionDetailForRegions(requested, frames.length, mediaType);

  try {
    let regionMap = await callIdentityModel(apiKey, buildUserText(false), frames, requested, detail);

    const missing = requested.filter((r) => !regionMap[r]);
    if (missing.length > 0) {
      regionMap = await callIdentityModel(
        apiKey,
        buildUserText(true),
        frames,
        requested,
        'high'
      );
    }

    const enrollReady = computeEnrollReady(regionMap, requested);

    return {
      usedVision: true,
      frameCount: frames.length,
      mediaType,
      regions: regionMap,
      fusedDescriptorText: Object.values(regionMap)
        .flatMap((r) => r?.descriptors ?? [])
        .slice(0, 12)
        .join('; '),
      enrollReady,
      disclaimer:
        'Educational identity capture only — not a government license or veterinary diagnosis.',
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Identity request failed';
    console.error('[identity-analyze]', msg);
    return emptyIdentity(`Identity analysis unavailable (${msg}).`, frames.length, mediaType);
  }
}

export function parseIdentityRegions(raw: string | null | undefined): IdentityRegion[] {
  if (!raw?.trim()) return ['face'];
  const parts = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is IdentityRegion => VALID_REGIONS.has(s));
  return parts.length > 0 ? parts : ['face'];
}
