import { randomUUID } from 'crypto';
import {
  VIT_PRO_PIPELINE_VERSION,
  VIT_PRO_REPORT_SCHEMA_VERSION,
} from './constants';
import { getCorpusVersion } from './rag/retrieve';
import { getRegionRubric } from './rubrics';
import type {
  VitProConfidenceBand,
  VitProDifferential,
  VitProFullReport,
  VitProRegion,
  VitProRegionAssessment,
  VitProStructuredFinding,
  VitProUrgencyLevel,
  VitProVisionResult,
} from './types';
import type { VitProCitation } from './types';
import type { ScoredChunk } from './rag/retrieve';

function bandFromIndex(i: number): VitProConfidenceBand {
  if (i === 0) return 'medium';
  if (i === 1) return 'medium';
  return 'low';
}

function toStructuredFindings(
  region: VitProRegion,
  raw: Record<string, string | number | boolean | null>
): VitProStructuredFinding[] {
  const rubric = getRegionRubric(region);
  return rubric.findingFields.map((f) => ({
    key: f.key,
    label: f.label,
    value: raw[f.key] ?? 'unknown',
  }));
}

function urgencyLevel(vision: VitProVisionResult): VitProUrgencyLevel {
  if (vision.vetUrgent) return 'urgent';
  if (vision.urgentCongruency >= 50) return 'prompt_vet';
  if (vision.mildModerateOnly) return 'monitor';
  return 'routine';
}

export type BuildReportInput = {
  symptoms: string;
  signalmentNotes?: string;
  vision: VitProVisionResult;
  regions: VitProRegion[];
  ragByRegion: Map<VitProRegion, ScoredChunk[]>;
  globalRag: ScoredChunk[];
  model: string;
};

export function buildVitProFullReport(input: BuildReportInput): VitProFullReport {
  const { vision, symptoms, signalmentNotes, regions, ragByRegion, globalRag, model } = input;

  const globalCitations: VitProCitation[] = globalRag.map((c) => ({
    id: c.id,
    title: c.title,
    source: c.source,
    url: c.url || undefined,
    excerpt: c.chunk.slice(0, 280),
  }));

  const regionAssessments: VitProRegionAssessment[] = vision.regions.map((vr) => {
    const rubric = getRegionRubric(vr.region);
    const ragChunks = ragByRegion.get(vr.region) ?? [];
    const citations: VitProCitation[] = ragChunks.map((c) => ({
      id: c.id,
      title: c.title,
      source: c.source,
      url: c.url || undefined,
      excerpt: c.chunk.slice(0, 280),
    }));

    const differentials: VitProDifferential[] = vr.differentialLabels.map((label, i) => ({
      label,
      confidenceBand: bandFromIndex(i),
      rationale: vr.reasoning ? undefined : undefined,
    }));

    return {
      region: vr.region,
      rubricVersion: rubric.version,
      visualFindings: vr.visualFindings,
      structuredFindings: toStructuredFindings(vr.region, vr.structuredFindings),
      differentialConsiderations: differentials,
      suggestedDiagnostics: vr.suggestedDiagnostics,
      citations,
      captureQuality: vr.captureQuality,
      captureNotes: vr.captureNotes.length ? vr.captureNotes : undefined,
    };
  });

  return {
    reportId: randomUUID(),
    analyzedAt: new Date().toISOString(),
    historySummary: symptoms,
    signalmentNotes,
    regions: regionAssessments,
    urgency: urgencyLevel(vision),
    urgencyReason: vision.vetUrgentReason,
    urgentCongruency: vision.urgentCongruency,
    matchedSevereCondition: vision.matchedSevereCondition,
    mildModerateOnly: vision.mildModerateOnly,
    primaryProtocolSlug: vision.primaryProtocolSlug,
    secondaryProtocolSlug: vision.secondaryProtocolSlug,
    globalCitations,
    audit: {
      pipelineVersion: VIT_PRO_PIPELINE_VERSION,
      reportSchemaVersion: VIT_PRO_REPORT_SCHEMA_VERSION,
      ragCorpusVersion: getCorpusVersion(),
      model,
      regionsAnalyzed: regions,
      frameCount: vision.frameCount,
      mediaType: vision.mediaType,
    },
  };
}
