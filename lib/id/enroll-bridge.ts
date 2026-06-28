import type { AnalyzeApiResponse } from '@/lib/ai/types';
import type { IdentityRegion } from '@/lib/id/types';
import { IDENTITY_REGIONS } from '@/lib/id/types';

const SESSION_KEY = 'fp-vit-id-bridge';

export type VitIdBridgeSession = {
  petId: string | null;
  analysisId: string;
  enrollReadyRegions: IdentityRegion[];
  focusRegion: IdentityRegion | null;
  savedAt: string;
};

const REGION_ENROLL_STEP: Record<IdentityRegion, number> = {
  eyes: 3,
  face: 4,
  body: 5,
  posture: 6,
  gait: 7,
};

export function enrollStepForRegion(region: IdentityRegion): number {
  return REGION_ENROLL_STEP[region];
}

export function bestFocusRegion(result: AnalyzeApiResponse): IdentityRegion | null {
  const regions = result.identity?.regions;
  if (!regions) return null;

  for (const region of IDENTITY_REGIONS) {
    const data = regions[region];
    if (data && data.qualityScore >= 0.65) return region;
  }

  for (const region of IDENTITY_REGIONS) {
    if (regions[region]) return region;
  }

  return null;
}

export function enrollReadyRegions(result: AnalyzeApiResponse): IdentityRegion[] {
  const regions = result.identity?.regions;
  if (!regions) return [];

  return IDENTITY_REGIONS.filter((region) => {
    const data = regions[region];
    return Boolean(data && data.qualityScore >= 0.65);
  });
}

export function buildEnrollHref(petId: string | null, result: AnalyzeApiResponse): string {
  const params = new URLSearchParams();
  if (petId) params.set('petId', petId);

  const focus = bestFocusRegion(result);
  if (focus) params.set('focusRegion', focus);

  if (result.identity?.enrollReady || enrollReadyRegions(result).length > 0) {
    params.set('fromVit', '1');
  }

  const qs = params.toString();
  return qs ? `/id/enroll?${qs}` : '/id/enroll';
}

export function saveVitIdBridgeSession(result: AnalyzeApiResponse, petId: string | null): void {
  if (typeof window === 'undefined' || !result.identity) return;

  const session: VitIdBridgeSession = {
    petId,
    analysisId: result.analysisId ?? `local-${Date.now()}`,
    enrollReadyRegions: enrollReadyRegions(result),
    focusRegion: bestFocusRegion(result),
    savedAt: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* quota / private mode */
  }
}

export function readVitIdBridgeSession(): VitIdBridgeSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VitIdBridgeSession;
  } catch {
    return null;
  }
}

export function clearVitIdBridgeSession(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
