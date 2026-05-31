import { normalizeSymptoms } from './normalize-symptoms';
import { protocolDisplayName } from './symptom-lexicon';
import type { ApprovedAlias } from '../symptom-feedback-store';
import { AnalysisResponse } from './types';

export type SymptomAnalysisResult = NonNullable<AnalysisResponse['data']> & {
  analysisMeta: {
    matchedTerms: string[];
    unknownPhrases: string[];
    usedFallback: boolean;
    normalized: string;
  };
};

export async function analyzeDogImage(
  file: File,
  petContext?: { symptoms?: string },
  approved: ApprovedAlias[] = []
): Promise<AnalysisResponse & { analysisMeta?: SymptomAnalysisResult['analysisMeta'] }> {
  const parsed = normalizeSymptoms(petContext?.symptoms || '', approved);

  const primaryFull = parsed.protocols[0];
  const secondaryFull = parsed.protocols.length > 1 ? parsed.protocols[1] : null;

  const primary = protocolDisplayName(primaryFull);
  const secondary = secondaryFull ? protocolDisplayName(secondaryFull) : null;

  const confidence =
    parsed.usedFallback
      ? 68
      : parsed.unknownPhrases.length > 0
        ? Math.max(72, 88 - parsed.unknownPhrases.length * 4)
        : parsed.matches.length === 1
          ? 92
          : Math.max(85, 94 - parsed.matches.length * 2);

  const termSummary =
    parsed.canonicalTerms.length > 0
      ? parsed.canonicalTerms.slice(0, 4).join('; ')
      : 'general wellness check';

  const reasoning =
    parsed.usedFallback
      ? `No lexicon match — queued unknown phrases for review: ${parsed.unknownPhrases.join(', ') || parsed.raw}.`
      : parsed.unknownPhrases.length > 0
        ? `Matched: ${termSummary}. Unknown phrases queued: ${parsed.unknownPhrases.join(', ')}.`
        : secondary
          ? `Matched: ${termSummary}. Multiple protocol areas detected.`
          : `Matched: ${termSummary}. Strong alignment with ${primary}.`;

  const analysisMeta = {
    matchedTerms: parsed.canonicalTerms,
    unknownPhrases: parsed.unknownPhrases,
    usedFallback: parsed.usedFallback,
    normalized: parsed.normalized,
  };

  return {
    success: true,
    data: {
      protocol: primary,
      primaryProtocol: primary,
      secondaryProtocol: secondary,
      finding: `Primary: ${primary}`,
      reasoning,
      confidence,
      recommendations: [
        `✅ PRIMARY: ${primary}`,
        secondary ? `⚠️ SECONDARY: ${secondary}` : '',
      ].filter(Boolean),
      disclaimer: 'Educational tool only. Not a substitute for veterinary care.',
      analyzedAt: new Date().toISOString(),
    },
    analysisMeta,
  };
}
