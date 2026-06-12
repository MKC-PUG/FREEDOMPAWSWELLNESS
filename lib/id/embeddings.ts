import OpenAI from 'openai';
import { REGION_CAPTURE_THRESHOLDS } from '@/lib/ai/identity-analyze';
import { ID_MATCH_THRESHOLD_DEFAULT } from '@/lib/id/types';

export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const EMBEDDING_DIMENSIONS = 1536;
export const EMBEDDING_MODEL_VERSION = 'text-embedding-3-small-v1';

type MediaRow = {
  region: string;
  angle: string | null;
  quality_score: number | null;
  descriptors: string[] | unknown;
};

/** Found-dog intake — fuse vision analysis (fewer regions than full enroll). */
export function fuseFoundIntakeDescriptors(analysis: {
  regions: Partial<
    Record<
      string,
      { descriptors?: string[]; gaitDescriptor?: string; postureClass?: string }
    >
  >;
  fusedDescriptorText?: string;
}): string {
  if (analysis.fusedDescriptorText?.trim()) {
    return analysis.fusedDescriptorText.trim().slice(0, 8000);
  }
  const parts: string[] = [];
  for (const [region, data] of Object.entries(analysis.regions)) {
    if (!data) continue;
    const desc = data.descriptors?.filter(Boolean) ?? [];
    if (desc.length) parts.push(`${region}: ${desc.join('; ')}`);
    if (data.gaitDescriptor) parts.push(`gait_motion: ${data.gaitDescriptor}`);
    if (data.postureClass) parts.push(`posture: ${data.postureClass}`);
  }
  return parts.join(' | ').slice(0, 8000);
}

export function fuseEnrollmentDescriptors(rows: MediaRow[]): string {
  const parts: string[] = [];

  const byKey = (region: string, angle?: string | null) =>
    rows.find((r) => r.region === region && (angle ? r.angle === angle : !r.angle));

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

  const requireRegion = (region: string, angle?: string) => {
    const row = rows.find((r) => r.region === region && (angle ? r.angle === angle : !r.angle));
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
