import { detectVitProRegions } from './detect-region';
import { buildVitProFullReport } from './build-report';
import { toDualOutput, toPublicOutput, toVetOutput } from './dual-output';
import { retrieveCorpusChunks } from './rag/retrieve';
import { analyzeVitProVision } from './vision-pro-analyze';
import type {
  VitProAnalyzeInput,
  VitProFullReport,
  VitProPublicOutput,
  VitProVetOutput,
} from './types';

export type VitProAnalyzeResult = {
  success: boolean;
  error?: string;
  fullReport?: VitProFullReport;
  public?: VitProPublicOutput;
  vet?: VitProVetOutput;
};

import { isVitProEnabled } from './access';

/**
 * Phase V0 ViT Pro pipeline — produces full report + dual tier outputs.
 */
export async function analyzeVitPro(input: VitProAnalyzeInput): Promise<VitProAnalyzeResult> {
  if (!isVitProEnabled()) {
    return { success: false, error: 'ViT Pro is not enabled on this deployment.' };
  }

  const symptoms = input.symptoms.trim();
  if (!symptoms) {
    return { success: false, error: 'History/symptoms text is required for ViT Pro analysis.' };
  }

  const frames = input.frames.filter((f) => f.size > 0);
  if (frames.length === 0) {
    return { success: false, error: 'At least one photo or video frame is required.' };
  }

  const mediaType = input.mediaType ?? 'photo';
  const regions = detectVitProRegions(symptoms, input.regionHint);
  const model = process.env.OPENAI_VISION_MODEL?.trim() || 'gpt-4o-mini';

  const vision = await analyzeVitProVision(frames, symptoms, regions, mediaType);

  const ragByRegion = new Map<
    import('./types').VitProRegion,
    import('./rag/retrieve').ScoredChunk[]
  >();

  for (const region of regions) {
    const vr = vision.regions.find((r) => r.region === region);
    const chunks = retrieveCorpusChunks({
      regions: [region],
      symptoms,
      visualFindings: vr?.visualFindings ?? [],
      limit: 3,
    });
    ragByRegion.set(region, chunks);
  }

  const globalRag = retrieveCorpusChunks({
    regions,
    symptoms,
    visualFindings: vision.regions.flatMap((r) => r.visualFindings),
    limit: 4,
  });

  const fullReport = buildVitProFullReport({
    symptoms,
    signalmentNotes: input.signalmentNotes,
    vision,
    regions,
    ragByRegion,
    globalRag,
    model,
  });

  const dual = toDualOutput(fullReport);

  return {
    success: true,
    fullReport,
    public: dual.public,
    vet: dual.vet,
  };
}

export { toPublicOutput, toVetOutput, toDualOutput };
