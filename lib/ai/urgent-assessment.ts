import {
  MILD_MODERATE_EXCLUSIONS,
  SEVERE_CONDITIONS,
  URGENT_CONGRUENCY_THRESHOLD,
  type SevereConditionRecord,
} from './severe-conditions-db';

export type AiSevereIndicatorHit = {
  conditionId: string;
  confidence: number;
};

export type UrgentAssessmentInput = {
  symptoms: string;
  visualFindings: string[];
  aiSevereHits?: AiSevereIndicatorHit[];
};

export type UrgentAssessmentResult = {
  vetUrgent: boolean;
  vetUrgentReason: string | null;
  /** Best-matching severe condition congruency (0–100). */
  congruencyScore: number;
  matchedConditionId: string | null;
  matchedConditionName: string | null;
  /** True when only mild/moderate patterns detected — wellness protocols recommended. */
  mildModerateOnly: boolean;
  /** All conditions scoring ≥ 50 for diagnostics transparency. */
  candidateScores: Array<{ id: string; name: string; score: number }>;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function phraseMatches(haystack: string, phrase: string): boolean {
  const p = normalize(phrase);
  if (!p) return false;
  if (p.includes(' ')) return haystack.includes(p);
  return new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(haystack);
}

function channelStrength(matchCount: number): number {
  if (matchCount >= 3) return 100;
  if (matchCount === 2) return 92;
  if (matchCount === 1) return 78;
  return 0;
}

function countMatches(haystack: string, indicators: string[]): number {
  let hits = 0;
  for (const ind of indicators) {
    if (phraseMatches(haystack, ind)) hits += 1;
  }
  return hits;
}

function scoreCondition(
  condition: SevereConditionRecord,
  normalizedSymptoms: string,
  normalizedVisual: string,
  aiHit?: AiSevereIndicatorHit
): number {
  const textMatches = countMatches(normalizedSymptoms, condition.indicators);
  const visualMatches = countMatches(normalizedVisual, condition.visualIndicators);

  const textStrength = channelStrength(textMatches);
  const visualStrength = channelStrength(visualMatches);
  const aiStrength = aiHit ? Math.min(100, Math.max(0, Math.round(aiHit.confidence))) : 0;

  const channels: number[] = [];
  if (textStrength > 0) channels.push(textStrength);
  if (visualStrength > 0) channels.push(visualStrength);
  if (aiStrength >= 70) channels.push(aiStrength);

  if (channels.length === 0) return 0;

  const agreementFactor = (channels.length / 3) * 40;
  const avgStrength = channels.reduce((a, b) => a + b, 0) / channels.length;
  const blended = Math.round(agreementFactor + avgStrength * 0.6);

  if (channels.length >= 2 && avgStrength >= 78) {
    return Math.max(blended, 82);
  }
  if (channels.length === 1 && aiStrength >= 90) {
    return aiStrength;
  }
  if (channels.length === 1 && (textStrength >= 92 || visualStrength >= 92)) {
    return Math.round(Math.max(textStrength, visualStrength) * 0.88);
  }

  return blended;
}

function detectMildModerateOnly(normalizedSymptoms: string, normalizedVisual: string): boolean {
  const combined = `${normalizedSymptoms} ${normalizedVisual}`;
  const mildHit = MILD_MODERATE_EXCLUSIONS.some((p) => phraseMatches(combined, p));
  if (!mildHit) return false;

  const anySevereSignal = SEVERE_CONDITIONS.some((c) => {
    const t = countMatches(normalizedSymptoms, c.indicators);
    const v = countMatches(normalizedVisual, c.visualIndicators);
    return t > 0 || v > 0;
  });

  return !anySevereSignal;
}

/**
 * Gate vetUrgent behind severe-condition database + ≥80% congruency.
 * Mild/moderate conditions never raise urgent — they route to wellness protocols.
 */
export function assessUrgentNeed(input: UrgentAssessmentInput): UrgentAssessmentResult {
  const normalizedSymptoms = normalize(input.symptoms);
  const normalizedVisual = normalize(input.visualFindings.join(' '));

  const aiMap = new Map<string, AiSevereIndicatorHit>();
  for (const hit of input.aiSevereHits ?? []) {
    const id = hit.conditionId?.trim();
    if (!id) continue;
    const prev = aiMap.get(id);
    if (!prev || hit.confidence > prev.confidence) {
      aiMap.set(id, hit);
    }
  }

  const candidateScores = SEVERE_CONDITIONS.map((c) => ({
    id: c.id,
    name: c.name,
    score: scoreCondition(c, normalizedSymptoms, normalizedVisual, aiMap.get(c.id)),
  }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = candidateScores[0];
  const mildModerateOnly = detectMildModerateOnly(normalizedSymptoms, normalizedVisual);

  if (mildModerateOnly && (!best || best.score < URGENT_CONGRUENCY_THRESHOLD)) {
    return {
      vetUrgent: false,
      vetUrgentReason: null,
      congruencyScore: best?.score ?? 0,
      matchedConditionId: null,
      matchedConditionName: null,
      mildModerateOnly: true,
      candidateScores: candidateScores.slice(0, 5),
    };
  }

  if (!best || best.score < URGENT_CONGRUENCY_THRESHOLD) {
    return {
      vetUrgent: false,
      vetUrgentReason: null,
      congruencyScore: best?.score ?? 0,
      matchedConditionId: null,
      matchedConditionName: null,
      mildModerateOnly: false,
      candidateScores: candidateScores.slice(0, 5),
    };
  }

  const condition = SEVERE_CONDITIONS.find((c) => c.id === best.id)!;

  return {
    vetUrgent: true,
    vetUrgentReason: `${condition.name} — ${best.score}% indicator congruency (≥${URGENT_CONGRUENCY_THRESHOLD}% threshold). Seek licensed veterinary triage promptly.`,
    congruencyScore: best.score,
    matchedConditionId: best.id,
    matchedConditionName: best.name,
    mildModerateOnly: false,
    candidateScores: candidateScores.slice(0, 5),
  };
}
