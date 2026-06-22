/**
 * ViT Pro dual-output schemas (Phase V0).
 * Internal pipeline produces VitProFullReport; mappers emit public or vet API shapes.
 */

export type VitProRegion = 'eye' | 'skin' | 'oral';

export type VitProConfidenceBand = 'low' | 'medium' | 'high';

export type VitProCitation = {
  id: string;
  title: string;
  source: string;
  url?: string;
  /** Short excerpt shown in vet report (corpus-owned or paraphrased). */
  excerpt?: string;
};

export type VitProDifferential = {
  label: string;
  confidenceBand: VitProConfidenceBand;
  rationale?: string;
};

export type VitProStructuredFinding = {
  key: string;
  label: string;
  value: string | number | boolean | null;
  unit?: string;
};

export type VitProRegionAssessment = {
  region: VitProRegion;
  rubricVersion: string;
  visualFindings: string[];
  structuredFindings: VitProStructuredFinding[];
  differentialConsiderations: VitProDifferential[];
  suggestedDiagnostics: string[];
  citations: VitProCitation[];
  captureQuality: 'adequate' | 'limited' | 'poor';
  captureNotes?: string[];
};

export type VitProUrgencyLevel = 'routine' | 'monitor' | 'prompt_vet' | 'urgent';

export type VitProAuditMeta = {
  pipelineVersion: string;
  reportSchemaVersion: string;
  ragCorpusVersion: string;
  model: string;
  regionsAnalyzed: VitProRegion[];
  frameCount: number;
  mediaType: 'photo' | 'video';
};

/** Internal canonical report — source of truth for dual output. */
export type VitProFullReport = {
  reportId: string;
  analyzedAt: string;
  historySummary: string;
  signalmentNotes?: string;
  regions: VitProRegionAssessment[];
  urgency: VitProUrgencyLevel;
  urgencyReason: string | null;
  urgentCongruency: number;
  matchedSevereCondition: string | null;
  mildModerateOnly: boolean;
  primaryProtocolSlug: string | null;
  secondaryProtocolSlug: string | null;
  globalCitations: VitProCitation[];
  audit: VitProAuditMeta;
};

/** Tier A — simplified public wellness output (mapped from full report). */
export type VitProPublicOutput = {
  tier: 'public';
  mode: 'wellness';
  finding: string;
  indications: string[];
  reasoning: string;
  primaryProtocolSlug: string | null;
  secondaryProtocolSlug: string | null;
  vetUrgent: boolean;
  vetUrgentReason: string | null;
  visualFindings: string[];
  disclaimer: string;
  analyzedAt: string;
  /** Omitted in public tier: differentials, diagnostics, citations. */
};

/** Tier B — vet CDS output with citations. */
export type VitProVetOutput = {
  tier: 'vet';
  mode: 'vit_pro';
  reportId: string;
  reportSchemaVersion: string;
  historySummary: string;
  signalmentNotes?: string;
  regions: VitProRegionAssessment[];
  urgency: VitProUrgencyLevel;
  urgencyReason: string | null;
  urgentCongruency: number;
  matchedSevereCondition: string | null;
  differentialConsiderations: VitProDifferential[];
  suggestedDiagnostics: string[];
  citations: VitProCitation[];
  primaryProtocolSlug: string | null;
  secondaryProtocolSlug: string | null;
  emrPlainText: string;
  disclaimer: string;
  analyzedAt: string;
  audit: VitProAuditMeta;
};

export type VitProVisionRegionResult = {
  region: VitProRegion;
  visualFindings: string[];
  structuredFindings: Record<string, string | number | boolean | null>;
  differentialLabels: string[];
  suggestedDiagnostics: string[];
  captureQuality: 'adequate' | 'limited' | 'poor';
  captureNotes: string[];
  reasoning: string;
};

export type VitProVisionResult = {
  usedVision: boolean;
  regions: VitProVisionRegionResult[];
  severeIndicatorHits: Array<{ conditionId: string; confidence: number }>;
  primaryProtocolSlug: string | null;
  secondaryProtocolSlug: string | null;
  reasoning: string;
  frameCount: number;
  mediaType: 'photo' | 'video';
  vetUrgent: boolean;
  vetUrgentReason: string | null;
  urgentCongruency: number;
  matchedSevereCondition: string | null;
  mildModerateOnly: boolean;
};

export type VitProAnalyzeInput = {
  symptoms: string;
  frames: File[];
  mediaType?: 'photo' | 'video';
  signalmentNotes?: string;
  /** Optional hint: eye | skin | oral */
  regionHint?: VitProRegion;
};
