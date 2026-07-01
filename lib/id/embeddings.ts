import OpenAI from 'openai';
import { REGION_CAPTURE_THRESHOLDS } from '@/lib/ai/identity-analyze';
import { ID_MATCH_THRESHOLD_DEFAULT } from '@/lib/id/types';

export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const EMBEDDING_DIMENSIONS = 1536;
export const EMBEDDING_MODEL_VERSION = 'text-embedding-3-small-v1';
export const INTAKE_MIRROR_MODEL_VERSION = 'text-embedding-3-small-intake-mirror-v1';

/** Regions aligned between enrollment mirror and shelter found photo intake */
export const INTAKE_FUSION_REGIONS = ['eyes', 'face', 'body', 'posture'] as const;

type MediaRow = {
  region: string;
  angle: string | null;
  quality_score: number | null;
  descriptors: string[] | unknown;
};

/** One row per region+angle slot — highest quality wins (handles duplicate NULL-angle rows). */
export function bestMediaPerSlot(rows: MediaRow[]): MediaRow[] {
  const bySlot = new Map<string, MediaRow>();
  for (const row of rows) {
    const key = `${row.region}:${row.angle ?? ''}`;
    const existing = bySlot.get(key);
    const score = Number(row.quality_score ?? 0);
    const existingScore = Number(existing?.quality_score ?? 0);
    if (!existing || score > existingScore) {
      bySlot.set(key, row);
    }
  }
  return Array.from(bySlot.values());
}

export type IntakeFusionRow = {
  region: string;
  angle: string | null;
  descriptors: string[] | unknown;
};

function descriptorList(row: IntakeFusionRow | MediaRow | undefined): string[] {
  if (!row) return [];
  return Array.isArray(row.descriptors)
    ? row.descriptors.filter((d): d is string => typeof d === 'string')
    : [];
}

/** Shared label order for found intake + enrollment intake mirror. */
export function fuseIntakeAlignedDescriptors(rows: IntakeFusionRow[]): string {
  const parts: string[] = [];

  const append = (label: string, row: IntakeFusionRow | undefined) => {
    const desc = descriptorList(row);
    if (desc.length) parts.push(`${label}: ${desc.join('; ')}`);
  };

  const byKey = (region: string, angle?: string | null) =>
    rows.find((r) => r.region === region && (angle ? r.angle === angle : !r.angle));

  append('eyes', byKey('eyes'));
  append('face', byKey('face'));
  append('body', byKey('body', 'front') ?? byKey('body', 'side') ?? byKey('body'));
  append('posture', byKey('posture'));

  return parts.join(' | ').slice(0, 8000);
}

export function fuseIntakeMirrorFromEnrollment(rows: MediaRow[]): string {
  return fuseIntakeAlignedDescriptors(
    rows.map((r) => ({
      region: r.region,
      angle: r.angle,
      descriptors: r.descriptors,
    }))
  );
}

/** Found-dog intake — structured fusion aligned with enrollment mirror. */
export function fuseFoundIntakeDescriptors(analysis: {
  regions: Partial<
    Record<
      string,
      { descriptors?: string[]; gaitDescriptor?: string; postureClass?: string }
    >
  >;
  fusedDescriptorText?: string;
}): string {
  const rows: IntakeFusionRow[] = [];
  for (const [region, data] of Object.entries(analysis.regions)) {
    if (!data || region === 'gait') continue;
    rows.push({
      region,
      angle: null,
      descriptors: data.descriptors ?? [],
    });
  }

  let fused = fuseIntakeAlignedDescriptors(rows);

  const gait = analysis.regions.gait;
  if (gait?.gaitDescriptor?.trim()) {
    fused = fused
      ? `${fused} | gait_motion: ${gait.gaitDescriptor.trim()}`
      : `gait_motion: ${gait.gaitDescriptor.trim()}`;
  }

  if (fused.trim()) return fused.slice(0, 8000);

  return analysis.fusedDescriptorText?.trim().slice(0, 8000) ?? '';
}

export function fuseEnrollmentDescriptors(rows: MediaRow[]): string {
  const parts: string[] = [];
  const slots = bestMediaPerSlot(rows);

  const byKey = (region: string, angle?: string | null) =>
    slots.find((r) => r.region === region && (angle ? r.angle === angle : !r.angle));

  const append = (label: string, row: MediaRow | undefined) => {
    if (!row) return;
    const desc = Array.isArray(row.descriptors)
      ? row.descriptors.filter((d): d is string => typeof d === 'string')
      : [];
    if (desc.length === 0) return;
    parts.push(`${label}: ${desc.join('; ')}`);
  };

  append('eyes', byKey('eyes'));
  append('face', byKey('face'));
  append('body_front', byKey('body', 'front'));
  append('body_side', byKey('body', 'side'));
  append('posture', byKey('posture'));
  append('gait', byKey('gait'));

  return parts.join(' | ').slice(0, 8000);
}

export async function createDescriptorEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured — cannot create embedding');
  }
  if (!text.trim()) {
    throw new Error('No descriptor text to embed');
  }

  const client = new OpenAI({ apiKey });
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });

  const vector = response.data[0]?.embedding;
  if (!vector?.length) {
    throw new Error('Embedding API returned empty vector');
  }
  return vector;
}

/** Format: FP-XXXXXXXX (8 hex chars from enrollment id) */
export function generateFreedomPawsId(enrollmentId: string): string {
  const hex = enrollmentId.replace(/-/g, '').slice(0, 8).toUpperCase();
  return `FP-${hex}`;
}

export function generateQrSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 12; i += 1) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

export function validateEnrollmentMedia(rows: MediaRow[]): {
  ok: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const slots = bestMediaPerSlot(rows);

  const requireRegion = (region: string, angle?: string) => {
    const row = slots.find((r) => r.region === region && (angle ? r.angle === angle : !r.angle));
    const thresholds =
      REGION_CAPTURE_THRESHOLDS[region as keyof typeof REGION_CAPTURE_THRESHOLDS] ?? {
        minScore: 0.65,
        minDescriptors: 3,
      };
    const minQuality = thresholds.minScore;
    const minDescriptors = thresholds.minDescriptors;

    if (!row) {
      issues.push(`Missing ${region}${angle ? ` (${angle})` : ''} capture`);
      return;
    }
    const score = Number(row.quality_score ?? 0);
    if (score < minQuality) {
      issues.push(`${region}${angle ? ` (${angle})` : ''} quality too low (${Math.round(score * 100)}%)`);
    }
    const desc = Array.isArray(row.descriptors) ? row.descriptors : [];
    if (desc.length < minDescriptors) {
      issues.push(`${region}${angle ? ` (${angle})` : ''} needs more descriptors`);
    }
  };

  requireRegion('eyes');
  requireRegion('face');
  requireRegion('body', 'front');
  requireRegion('body', 'side');
  requireRegion('posture');
  requireRegion('gait');

  return { ok: issues.length === 0, issues };
}

export { ID_MATCH_THRESHOLD_DEFAULT };
