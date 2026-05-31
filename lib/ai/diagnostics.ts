import { normalizeSymptoms } from './normalize-symptoms';
import { rankTopTwoProtocols } from './rank-protocols';
import { formatDualLabel } from './protocol-registry';
import type { ApprovedAlias } from '../symptom-feedback-store';
import { AnalysisResponse } from './types';
import { analyzePhotoVision } from './vision-analyze';

export type SymptomAnalysisResult = NonNullable<AnalysisResponse['data']> & {
  analysisMeta: {
    matchedTerms: string[];
    unknownPhrases: string[];
    usedFallback: boolean;
    normalized: string;
    usedVision: boolean;
    visualFindings: string[];
    vetUrgent: boolean;
  };
};

export async function analyzeDogImage(
  file: File,
  petContext?: { symptoms?: string },
  approved: ApprovedAlias[] = []
): Promise<AnalysisResponse & { analysisMeta?: SymptomAnalysisResult['analysisMeta'] }> {
  const symptoms = petContext?.symptoms || '';
  const parsed = normalizeSymptoms(symptoms, approved);
  const vision = await analyzePhotoVision(file, symptoms);

  const ranked = rankTopTwoProtocols({
    matches: parsed.matches,
    protocolTitles: parsed.protocols,
    usedFallback: parsed.usedFallback,
    unknownPhrases: parsed.unknownPhrases,
    visionPrimary: vision.primaryProtocolTitle,
    visionSecondary: vision.secondaryProtocolTitle,
    visionConfidenceBoost: vision.confidenceBoost,
  });

  const termSummary =
    parsed.canonicalTerms.length > 0
      ? parsed.canonicalTerms.slice(0, 4).join('; ')
      : 'general wellness check';

  let reasoning = parsed.usedFallback
    ? `No lexicon match — queued unknown phrases for review: ${parsed.unknownPhrases.join(', ') || parsed.raw}.`
    : parsed.unknownPhrases.length > 0
      ? `Matched: ${termSummary}. Unknown phrases queued: ${parsed.unknownPhrases.join(', ')}.`
      : `Matched: ${termSummary}.`;

  if (vision.usedVision && vision.reasoning) {
    reasoning += ` Visual analysis: ${vision.reasoning}`;
  }
  if (vision.visualFindings.length > 0) {
    reasoning += ` Observed: ${vision.visualFindings.join('; ')}.`;
  }
  if (ranked.forcedPairUsed) {
    reasoning += ' Overlap detected — prioritised top 2 supplement protocols.';
  }

  if (vision.vetUrgent) {
    reasoning = `⚠️ ${vision.vetUrgentReason || 'Signs warrant prompt veterinary evaluation.'} ${reasoning}`;
  }

  const primaryLabel = formatDualLabel(ranked.primary.protocolTitle);
  const secondaryLabel = ranked.secondary
    ? formatDualLabel(ranked.secondary.protocolTitle)
    : null;

  const analysisMeta = {
    matchedTerms: parsed.canonicalTerms,
    unknownPhrases: parsed.unknownPhrases,
    usedFallback: parsed.usedFallback,
    normalized: parsed.normalized,
    usedVision: vision.usedVision,
    visualFindings: vision.visualFindings,
    vetUrgent: vision.vetUrgent,
  };

  return {
    success: true,
    data: {
      protocol: primaryLabel,
      primaryProtocol: ranked.primary.brandedTitle,
      secondaryProtocol: ranked.secondary?.brandedTitle ?? null,
      primary: ranked.primary,
      secondary: ranked.secondary,
      finding: vision.vetUrgent
        ? 'Urgent veterinary evaluation recommended'
        : `Primary: ${primaryLabel}`,
      reasoning,
      confidence: ranked.primary.confidence,
      recommendations: [
        `✅ #1 SUPPLEMENT: ${primaryLabel} (${ranked.primary.confidence}%)`,
        ranked.secondary
          ? `✅ #2 SUPPLEMENT: ${secondaryLabel} (${ranked.secondary.confidence}%)`
          : '',
        vision.vetUrgent ? '⚠️ See a veterinarian promptly — do not delay care.' : '',
      ].filter(Boolean),
      disclaimer:
        'Educational tool only. Not a diagnosis or substitute for licensed veterinary care. Always consult your veterinarian.',
      analyzedAt: new Date().toISOString(),
      vetUrgent: vision.vetUrgent,
      vetUrgentReason: vision.vetUrgentReason,
      visualFindings: vision.visualFindings,
      usedVision: vision.usedVision,
    },
    analysisMeta,
  };
}
