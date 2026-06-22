import OpenAI from 'openai';
import { PROTOCOL_BY_SLUG } from '@/lib/ai/protocol-registry';
import { SEVERE_CONDITION_IDS } from '@/lib/ai/severe-conditions-db';
import { assessUrgentNeed } from '@/lib/ai/urgent-assessment';
import { getRegionRubric } from './rubrics';
import type { VitProRegion, VitProVisionResult, VitProVisionRegionResult } from './types';

const VALID_SLUGS = new Set(Object.keys(PROTOCOL_BY_SLUG));
const VALID_SEVERE_IDS = new Set(SEVERE_CONDITION_IDS);

function buildResponseSchema(regions: VitProRegion[]) {
  const regionEnum =
    regions.length === 1 ? { type: 'string' as const, const: regions[0] } : { type: 'string' as const, enum: regions };

  return {
    type: 'object' as const,
    properties: {
      regions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            region: regionEnum,
            visualFindings: {
              type: 'array',
              items: { type: 'string' },
              description: 'Up to 5 short observable phrases',
            },
            structuredFindings: {
              type: 'object',
              properties: {},
              additionalProperties: { type: 'string' },
              description: 'Rubric field keys with enum string values',
            },
            differentialLabels: {
              type: 'array',
              items: { type: 'string' },
              description: '2–4 differential considerations from rubric list',
            },
            suggestedDiagnostics: {
              type: 'array',
              items: { type: 'string' },
              description: '2–4 suggested diagnostics from rubric list',
            },
            captureQuality: {
              type: 'string',
              enum: ['adequate', 'limited', 'poor'],
            },
            captureNotes: {
              type: 'array',
              items: { type: 'string' },
            },
            reasoning: { type: 'string' },
          },
          required: [
            'region',
            'visualFindings',
            'structuredFindings',
            'differentialLabels',
            'suggestedDiagnostics',
            'captureQuality',
            'captureNotes',
            'reasoning',
          ],
          additionalProperties: false,
        },
      },
      severeIndicatorHits: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            conditionId: { type: 'string' },
            confidence: { type: 'number' },
          },
          required: ['conditionId', 'confidence'],
          additionalProperties: false,
        },
      },
      primaryProtocolSlug: { type: 'string' },
      secondaryProtocolSlug: { type: ['string', 'null'] },
      reasoning: { type: 'string' },
    },
    required: ['regions', 'severeIndicatorHits', 'primaryProtocolSlug', 'secondaryProtocolSlug', 'reasoning'],
    additionalProperties: false,
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');
  const mime = file.type || 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

function emptyResult(
  reason: string,
  mediaType: 'photo' | 'video',
  frameCount: number,
  regions: VitProRegion[]
): VitProVisionResult {
  return {
    usedVision: false,
    regions: regions.map((region) => ({
      region,
      visualFindings: [],
      structuredFindings: {},
      differentialLabels: [],
      suggestedDiagnostics: [],
      captureQuality: 'poor' as const,
      captureNotes: [reason],
      reasoning: reason,
    })),
    severeIndicatorHits: [],
    primaryProtocolSlug: getRegionRubric(regions[0]).protocolSlug,
    secondaryProtocolSlug: null,
    reasoning: reason,
    frameCount,
    mediaType,
    vetUrgent: false,
    vetUrgentReason: null,
    urgentCongruency: 0,
    matchedSevereCondition: null,
    mildModerateOnly: true,
  };
}

const VIT_PRO_SYSTEM = `You are Dr. Atlas CDS — a veterinary clinical decision support assistant for licensed professionals (ViT Pro tier).
Analyze dog photo/video frames using the provided region rubrics.
Use decision-support language only — never state a definitive diagnosis.
Select structured finding enum values exactly from rubric allowed values.
Pick differentials and diagnostics from the rubric lists when possible.
Allowed protocol slugs: ${[...VALID_SLUGS].join(', ')}.
Allowed severe condition IDs: ${[...VALID_SEVERE_IDS].join(', ')}.`;

function sanitizeRegion(raw: Record<string, unknown>, expected: VitProRegion): VitProVisionRegionResult {
  const rubric = getRegionRubric(expected);
  const structured: Record<string, string | number | boolean | null> = {};
  const rawStructured = (raw.structuredFindings as Record<string, unknown>) ?? {};
  for (const f of rubric.findingFields) {
    const v = rawStructured[f.key];
    structured[f.key] = typeof v === 'string' ? v : 'unknown';
  }

  return {
    region: expected,
    visualFindings: Array.isArray(raw.visualFindings)
      ? (raw.visualFindings as string[]).slice(0, 5)
      : [],
    structuredFindings: structured,
    differentialLabels: Array.isArray(raw.differentialLabels)
      ? (raw.differentialLabels as string[]).slice(0, 4)
      : [],
    suggestedDiagnostics: Array.isArray(raw.suggestedDiagnostics)
      ? (raw.suggestedDiagnostics as string[]).slice(0, 4)
      : [],
    captureQuality:
      raw.captureQuality === 'adequate' || raw.captureQuality === 'limited' || raw.captureQuality === 'poor'
        ? raw.captureQuality
        : 'limited',
    captureNotes: Array.isArray(raw.captureNotes) ? (raw.captureNotes as string[]).slice(0, 3) : [],
    reasoning: typeof raw.reasoning === 'string' ? raw.reasoning : '',
  };
}

export async function analyzeVitProVision(
  files: File[],
  symptoms: string,
  regions: VitProRegion[],
  mediaType: 'photo' | 'video' = 'photo'
): Promise<VitProVisionResult> {
  const frames = files.filter((f) => f.size > 0).slice(0, 5);
  if (frames.length === 0) {
    return emptyResult('No image frames to analyze.', mediaType, 0, regions);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return emptyResult('OPENAI_API_KEY not configured.', mediaType, frames.length, regions);
  }

  const rubricBlocks = regions
    .map((r) => {
      const rub = getRegionRubric(r);
      return `### ${r.toUpperCase()} rubric v${rub.version}
Capture: ${rub.captureGuidance.join('; ')}
Fields: ${rub.findingFields.map((f) => `${f.key} (${f.values?.join('|')})`).join(', ')}
Differentials: ${rub.differentialConsiderations.join('; ')}
Diagnostics: ${rub.suggestedDiagnostics.join('; ')}`;
    })
    .join('\n\n');

  const mediaNote =
    mediaType === 'video'
      ? `${frames.length} sampled video frames — note movement if relevant.`
      : 'Single or multi photo capture.';

  const userText = `History/symptoms: "${symptoms}"

Regions to assess (one entry per region in order): ${regions.join(', ')}

${rubricBlocks}

${mediaNote}
Return one region object per requested region. JSON only.`;

  try {
    const imageParts = await Promise.all(
      frames.map(async (file) => ({
        type: 'image_url' as const,
        image_url: { url: await fileToDataUrl(file), detail: 'low' as const },
      }))
    );

    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_VISION_MODEL?.trim() || 'gpt-4o-mini';

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: VIT_PRO_SYSTEM },
        { role: 'user', content: [{ type: 'text', text: userText }, ...imageParts] },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'vit_pro_region_analysis',
          strict: false,
          schema: buildResponseSchema(regions),
        },
      },
      max_tokens: 1400,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      return emptyResult('Vision model returned no content.', mediaType, frames.length, regions);
    }

    const parsed = JSON.parse(raw) as {
      regions: Record<string, unknown>[];
      severeIndicatorHits?: Array<{ conditionId: string; confidence: number }>;
      primaryProtocolSlug: string;
      secondaryProtocolSlug: string | null;
      reasoning: string;
    };

    const regionResults = regions.map((expected, i) =>
      sanitizeRegion(parsed.regions[i] ?? { region: expected }, expected)
    );

    const visualFindings = regionResults.flatMap((r) => r.visualFindings);
    const severeHits = (parsed.severeIndicatorHits ?? [])
      .filter((h) => VALID_SEVERE_IDS.has(h.conditionId) && h.confidence >= 70)
      .map((h) => ({
        conditionId: h.conditionId,
        confidence: Math.min(100, Math.max(0, Math.round(h.confidence))),
      }));

    const urgent = assessUrgentNeed({
      symptoms,
      visualFindings,
      aiSevereHits: severeHits,
    });

    const primarySlug = VALID_SLUGS.has(parsed.primaryProtocolSlug)
      ? parsed.primaryProtocolSlug
      : getRegionRubric(regions[0]).protocolSlug;
    const secondarySlug =
      parsed.secondaryProtocolSlug && VALID_SLUGS.has(parsed.secondaryProtocolSlug)
        ? parsed.secondaryProtocolSlug
        : null;

    return {
      usedVision: true,
      regions: regionResults,
      severeIndicatorHits: severeHits,
      primaryProtocolSlug: primarySlug,
      secondaryProtocolSlug: secondarySlug,
      reasoning: parsed.reasoning || '',
      frameCount: frames.length,
      mediaType,
      vetUrgent: urgent.vetUrgent,
      vetUrgentReason: urgent.vetUrgentReason,
      urgentCongruency: urgent.congruencyScore,
      matchedSevereCondition: urgent.matchedConditionName,
      mildModerateOnly: urgent.mildModerateOnly,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Vision request failed';
    console.error('[vit-pro vision]', msg);
    return emptyResult(`Vision unavailable (${msg}).`, mediaType, frames.length, regions);
  }
}
