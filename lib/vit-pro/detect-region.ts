import type { VitProRegion } from './types';

const REGION_KEYWORDS: Record<VitProRegion, string[]> = {
  eye: [
    'eye',
    'eyes',
    'ocular',
    'conjunctiv',
    'cornea',
    'discharge',
    'squint',
    'cloudy',
    'tear',
    'epiphora',
    'red eye',
    'vision',
    'blind',
  ],
  skin: [
    'skin',
    'rash',
    'itch',
    'itchy',
    'pruritus',
    'hot spot',
    'alopecia',
    'hair loss',
    'lesion',
    'dermat',
    'coat',
    'flake',
    'scab',
    'hives',
    'allergy',
  ],
  oral: [
    'mouth',
    'oral',
    'teeth',
    'tooth',
    'dental',
    'tartar',
    'gum',
    'gingiv',
    'halitosis',
    'breath',
    'drool',
    'chew',
  ],
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ');
}

function scoreRegion(text: string, region: VitProRegion): number {
  const hay = normalize(text);
  let hits = 0;
  for (const kw of REGION_KEYWORDS[region]) {
    if (hay.includes(kw)) hits += 1;
  }
  return hits;
}

/**
 * Detect 1–3 ViT Pro regions from symptoms text and optional hint.
 */
export function detectVitProRegions(
  symptoms: string,
  regionHint?: VitProRegion
): VitProRegion[] {
  if (regionHint) {
    const others = (['eye', 'skin', 'oral'] as VitProRegion[])
      .filter((r) => r !== regionHint)
      .map((r) => ({ region: r, score: scoreRegion(symptoms, r) }))
      .filter((x) => x.score >= 2)
      .sort((a, b) => b.score - a.score);
    return [regionHint, ...others.slice(0, 1).map((x) => x.region)];
  }

  const ranked = (['eye', 'skin', 'oral'] as VitProRegion[])
    .map((region) => ({ region, score: scoreRegion(symptoms, region) }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  if (!top || top.score === 0) {
    return ['skin'];
  }

  const selected: VitProRegion[] = [top.region];
  for (const r of ranked.slice(1)) {
    if (r.score >= 2 && r.score >= top.score - 1) {
      selected.push(r.region);
    }
  }
  return selected.slice(0, 2);
}

export function parseVitProRegionHint(raw: string | null | undefined): VitProRegion | undefined {
  const v = raw?.trim().toLowerCase();
  if (v === 'eye' || v === 'skin' || v === 'oral') return v;
  return undefined;
}
