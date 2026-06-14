import type { AnalyzeApiResponse } from '@/lib/ai/types';

export type VitRunSummary = {
  id: string;
  petId: string | null;
  petName: string | null;
  primarySlug: string | null;
  primaryTitle: string | null;
  primaryConfidence: number | null;
  secondarySlug: string | null;
  secondaryTitle: string | null;
  vetUrgent: boolean;
  mediaType: string | null;
  createdAt: string;
};

const LOCAL_KEY = 'fp-vit-run-history';

function summaryFromResult(
  result: AnalyzeApiResponse,
  petId: string | null,
  petName: string | null
): VitRunSummary {
  return {
    id: result.analysisId ?? `local-${Date.now()}`,
    petId,
    petName,
    primarySlug: result.primary?.slug ?? null,
    primaryTitle: result.primary?.brandedTitle ?? null,
    primaryConfidence: result.primary?.confidenceValue ?? null,
    secondarySlug: result.secondary?.slug ?? null,
    secondaryTitle: result.secondary?.brandedTitle ?? null,
    vetUrgent: Boolean(result.vetUrgent),
    mediaType: result.mediaType ?? null,
    createdAt: new Date().toISOString(),
  };
}

function readAllVitRunsLocal(): VitRunSummary[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VitRunSummary[];
  } catch {
    return [];
  }
}

export function saveVitRunLocal(
  result: AnalyzeApiResponse,
  petId: string | null,
  petName: string | null
): VitRunSummary {
  const summary = summaryFromResult(result, petId, petName);
  if (typeof window === 'undefined') return summary;

  const all = readAllVitRunsLocal();
  const samePet = all.filter((r) => r.petId === petId);
  const otherPets = all.filter((r) => r.petId !== petId);
  const nextForPet = [summary, ...samePet.filter((r) => r.id !== summary.id)].slice(0, 10);
  localStorage.setItem(LOCAL_KEY, JSON.stringify([...otherPets, ...nextForPet]));
  return summary;
}

export function readVitRunsLocal(petId?: string | null): VitRunSummary[] {
  const all = readAllVitRunsLocal();
  if (!petId) return all;
  return all
    .filter((r) => r.petId === petId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function latestVitRunLocal(petId: string): VitRunSummary | null {
  const runs = readVitRunsLocal(petId);
  return runs[0] ?? null;
}

export async function saveVitRunServer(
  petId: string,
  result: AnalyzeApiResponse
): Promise<boolean> {
  try {
    const res = await fetch(`/api/pets/${encodeURIComponent(petId)}/vit-runs`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        primarySlug: result.primary?.slug ?? null,
        primaryTitle: result.primary?.brandedTitle ?? null,
        primaryConfidence: result.primary?.confidenceValue ?? null,
        secondarySlug: result.secondary?.slug ?? null,
        secondaryTitle: result.secondary?.brandedTitle ?? null,
        vetUrgent: Boolean(result.vetUrgent),
        mediaType: result.mediaType ?? null,
        analysisId: result.analysisId ?? null,
      }),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function fetchVitRunsServer(petId: string): Promise<VitRunSummary[]> {
  try {
    const res = await fetch(`/api/pets/${encodeURIComponent(petId)}/vit-runs`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!data.success) return [];
    return (data.runs ?? []) as VitRunSummary[];
  } catch {
    return [];
  }
}
