import type { ProtocolRecommendation } from './protocol-registry';
import type {
  AnalyzeMode,
  IdentityAnalysisResult,
  IdentityRegion,
} from '@/lib/id/types';
import type { VitProPublicOutput, VitProVetOutput } from '@/lib/vit-pro/types';

export type { AnalyzeMode, IdentityRegion, IdentityAnalysisResult };
export type { VitProPublicOutput, VitProVetOutput };

export interface AnalysisResponse {
  success: boolean;
  data?: {
    protocol: string;
    primaryProtocol: string;
    secondaryProtocol: string | null;
    primary: ProtocolRecommendation;
    secondary: ProtocolRecommendation | null;
    finding: string;
    reasoning: string;
    confidence: number;
    recommendations: string[];
    disclaimer: string;
    analyzedAt: string;
    vetUrgent?: boolean;
    vetUrgentReason?: string | null;
    urgentCongruency?: number;
    matchedSevereCondition?: string | null;
    mildModerateOnly?: boolean;
    visualFindings?: string[];
    usedVision?: boolean;
    mediaType?: 'photo' | 'video';
    frameCount?: number;
  };
  error?: string;
}

export interface ImageQuality {
  isValid: boolean;
  issues: string[];
  score: number;
  suggestions: string[];
}

export type ApiProtocolResult = {
  protocol: string;
  specCategory: string;
  specShort: string;
  brandedTitle: string;
  slug: string;
  confidence: string;
  confidenceValue: number;
};

export type AnalyzeApiResponse = {
  success: boolean;
  analysisId?: string;
  error?: string;
  mode?: AnalyzeMode;
  primary?: ApiProtocolResult;
  secondary?: ApiProtocolResult | null;
  finding?: string;
  reasoning?: string;
  matchedTerms?: string[];
  unknownPhrases?: string[];
  vetUrgent?: boolean;
  vetUrgentReason?: string | null;
  urgentCongruency?: number;
  matchedSevereCondition?: string | null;
  mildModerateOnly?: boolean;
  visualFindings?: string[];
  usedVision?: boolean;
  mediaType?: 'photo' | 'video';
  frameCount?: number;
  analyzedAt?: string;
  disclaimer?: string;
  identity?: IdentityAnalysisResult;
  /** Present when mode=vit_pro (Tier B vet CDS). */
  vitPro?: VitProVetOutput;
  /** Present when mode=vit_pro and outputTier=both — includes Tier A summary. */
  vitProPublic?: VitProPublicOutput;
};

export function toVitProAnalyzeApiResponse(
  analysisId: string,
  vet: VitProVetOutput,
  options?: { includePublic?: boolean; publicOutput?: VitProPublicOutput }
): AnalyzeApiResponse {
  const visualFindings = vet.regions.flatMap((r) => r.visualFindings).slice(0, 12);
  return {
    success: true,
    analysisId,
    mode: 'vit_pro',
    finding: vet.urgency === 'urgent' ? 'Urgent evaluation recommended' : 'ViT Pro CDS report generated',
    reasoning: vet.regions.map((r) => r.visualFindings.join('; ')).filter(Boolean).join(' | ') || vet.historySummary.slice(0, 200),
    visualFindings,
    usedVision: true,
    mediaType: vet.audit.mediaType,
    frameCount: vet.audit.frameCount,
    analyzedAt: vet.analyzedAt,
    disclaimer: vet.disclaimer,
    vetUrgent: vet.urgency === 'urgent' || vet.urgency === 'prompt_vet',
    vetUrgentReason: vet.urgencyReason,
    urgentCongruency: vet.urgentCongruency,
    matchedSevereCondition: vet.matchedSevereCondition,
    vitPro: vet,
    vitProPublic: options?.includePublic ? options.publicOutput : undefined,
  };
}

function toApiProtocol(rec: ProtocolRecommendation): ApiProtocolResult {
  return {
    protocol: `${rec.specShort} → ${rec.brandedTitle.split(' – ')[0]}`,
    specCategory: rec.specCategory,
    specShort: rec.specShort,
    brandedTitle: rec.brandedTitle,
    slug: rec.slug,
    confidence: `${rec.confidence}%`,
    confidenceValue: rec.confidence,
  };
}

export function toAnalyzeApiResponse(
  analysisId: string,
  data: NonNullable<AnalysisResponse['data']>,
  analysisMeta?: {
    matchedTerms: string[];
    unknownPhrases: string[];
  }
): AnalyzeApiResponse {
  return {
    success: true,
    analysisId,
    mode: 'wellness',
    primary: toApiProtocol(data.primary),
    secondary: data.secondary ? toApiProtocol(data.secondary) : null,
    finding: data.finding,
    reasoning: data.reasoning,
    matchedTerms: analysisMeta?.matchedTerms ?? [],
    unknownPhrases: analysisMeta?.unknownPhrases ?? [],
    vetUrgent: data.vetUrgent,
    vetUrgentReason: data.vetUrgentReason,
    urgentCongruency: data.urgentCongruency,
    matchedSevereCondition: data.matchedSevereCondition,
    mildModerateOnly: data.mildModerateOnly,
    visualFindings: data.visualFindings,
    usedVision: data.usedVision,
    mediaType: data.mediaType,
    frameCount: data.frameCount,
    analyzedAt: data.analyzedAt,
    disclaimer: data.disclaimer,
  };
}

export function toIdentityAnalyzeApiResponse(
  analysisId: string,
  identity: IdentityAnalysisResult,
  meta: {
    usedVision: boolean;
    mediaType: 'photo' | 'video';
    frameCount: number;
  }
): AnalyzeApiResponse {
  const visualFindings = Object.values(identity.regions).flatMap((r) => r?.descriptors ?? []);
  return {
    success: true,
    analysisId,
    mode: 'identity',
    finding: identity.enrollReady
      ? 'Region quality sufficient for enrollment'
      : 'More capture needed before enrollment',
    reasoning: identity.fusedDescriptorText,
    visualFindings: visualFindings.slice(0, 12),
    usedVision: meta.usedVision,
    mediaType: meta.mediaType,
    frameCount: meta.frameCount,
    analyzedAt: new Date().toISOString(),
    disclaimer: identity.disclaimer,
    identity,
  };
}
