import type { SymptomMatch } from './normalize-symptoms';
import { toRecommendation, type ProtocolRecommendation } from './protocol-registry';
import { FALLBACK_PROTOCOL } from './symptom-lexicon';

export type RankedProtocols = {
  primary: ProtocolRecommendation;
  secondary: ProtocolRecommendation | null;
  forcedPairUsed: boolean;
};

function uniqueProtocolsOrdered(
  matches: SymptomMatch[],
  extraTitles: string[] = []
): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();

  for (const { entry } of matches) {
    if (!seen.has(entry.protocol)) {
      seen.add(entry.protocol);
      ordered.push(entry.protocol);
    }
  }

  for (const title of extraTitles) {
    if (title && !seen.has(title)) {
      seen.add(title);
      ordered.push(title);
    }
  }

  return ordered;
}

function findForcedSecondary(matches: SymptomMatch[], primaryTitle: string): string | null {
  for (const { entry } of matches) {
    if (entry.protocol === primaryTitle && entry.forcedSecondary) {
      return entry.forcedSecondary;
    }
  }
  for (const { entry } of matches) {
    if (entry.forcedSecondary) {
      return entry.forcedSecondary;
    }
  }
  return null;
}

function primaryConfidence(
  usedFallback: boolean,
  unknownCount: number,
  matchCount: number,
  visionBoost: number
): number {
  let base = usedFallback ? 68 : unknownCount > 0 ? Math.max(72, 88 - unknownCount * 4) : matchCount === 1 ? 92 : Math.max(85, 94 - matchCount * 2);
  base = Math.min(94, base + visionBoost);
  return base;
}

function secondaryConfidence(primaryConf: number, forcedPair: boolean, hasSecondMatch: boolean): number {
  if (forcedPair) return Math.min(88, Math.max(72, primaryConf - 6));
  if (hasSecondMatch) return Math.min(90, Math.max(65, primaryConf - 10));
  return Math.min(82, Math.max(60, primaryConf - 14));
}

/**
 * Resolve prioritised top-2 protocol supplement recommendations.
 * Overlap pairs (e.g. cognitive/senior → Immune + Freedom Calm) use forcedSecondary on lexicon entries.
 */
export function rankTopTwoProtocols(options: {
  matches: SymptomMatch[];
  protocolTitles: string[];
  usedFallback: boolean;
  unknownPhrases: string[];
  visionPrimary?: string | null;
  visionSecondary?: string | null;
  visionConfidenceBoost?: number;
}): RankedProtocols {
  const {
    matches,
    protocolTitles,
    usedFallback,
    unknownPhrases,
    visionPrimary,
    visionSecondary,
    visionConfidenceBoost = 0,
  } = options;

  const visionExtras = [visionPrimary, visionSecondary].filter(
    (t): t is string => Boolean(t)
  );

  let ordered = uniqueProtocolsOrdered(matches, [...protocolTitles, ...visionExtras]);

  if (visionPrimary && ordered[0] !== visionPrimary) {
    ordered = [visionPrimary, ...ordered.filter((p) => p !== visionPrimary)];
  }

  if (usedFallback && ordered.length === 0) {
    ordered = [FALLBACK_PROTOCOL];
  }

  const primaryTitle = ordered[0] ?? FALLBACK_PROTOCOL;
  let secondaryTitle: string | null = ordered.length > 1 ? ordered[1] : null;

  const forced = findForcedSecondary(matches, primaryTitle);
  let forcedPairUsed = false;
  if (forced && forced !== primaryTitle) {
    secondaryTitle = forced;
    forcedPairUsed = true;
  } else if (!secondaryTitle && visionSecondary && visionSecondary !== primaryTitle) {
    secondaryTitle = visionSecondary;
  }

  const primaryConf = primaryConfidence(
    usedFallback,
    unknownPhrases.length,
    matches.length,
    visionConfidenceBoost
  );
  const secondaryConf = secondaryTitle
    ? secondaryConfidence(primaryConf, forcedPairUsed, ordered.length > 1)
    : 0;

  return {
    primary: toRecommendation(primaryTitle, primaryConf),
    secondary: secondaryTitle ? toRecommendation(secondaryTitle, secondaryConf) : null,
    forcedPairUsed,
  };
}
