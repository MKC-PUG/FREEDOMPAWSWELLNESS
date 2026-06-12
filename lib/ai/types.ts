import type { ProtocolRecommendation } from './protocol-registry';
import type {
  AnalyzeMode,
  IdentityAnalysisResult,
  IdentityRegion,
} from '@/lib/id/types';

export type { AnalyzeMode, IdentityRegion, IdentityAnalysisResult };

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
  visualFindings?: string[];
  usedVision?: boolean;
  mediaType?: 'photo' | 'video';
  frameCount?: number;
  analyzedAt?: string;
  disclaimer?: string;
  identity?: IdentityAnalysisResult;
};

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
