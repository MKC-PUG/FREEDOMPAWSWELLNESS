import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  VIT_PRO_PIPELINE_VERSION,
  VIT_PRO_RAG_CORPUS_VERSION,
  VIT_PRO_REPORT_SCHEMA_VERSION,
} from './constants';
import { getAllRubrics } from './rubrics';
import { getCorpusVersion, listCorpusSources } from './rag/retrieve';
import { isVitProEnabled } from './access';

export type VitProModuleStatus = {
  phase: 'V0';
  enabled: boolean;
  pipelineVersion: string;
  reportSchemaVersion: string;
  ragCorpusVersion: string;
  corpusChunkCount: number;
  rubrics: Array<{ region: string; version: string }>;
  benchmark: {
    casesFileExists: boolean;
    totalCases: number;
    casesWithImages: number;
    targetCases: 50;
  };
};

export function getVitProModuleStatus(): VitProModuleStatus {
  const casesPath = join(process.cwd(), 'data/vit-pro/benchmark/cases.json');
  let totalCases = 0;
  let casesWithImages = 0;
  const casesFileExists = existsSync(casesPath);

  if (casesFileExists) {
    try {
      const data = JSON.parse(readFileSync(casesPath, 'utf8')) as {
        cases?: Array<{ imagePath?: string }>;
      };
      const cases = data.cases ?? [];
      totalCases = cases.length;
      casesWithImages = cases.filter((c) => {
        if (!c.imagePath) return false;
        return existsSync(join(process.cwd(), c.imagePath));
      }).length;
    } catch {
      /* ignore parse errors */
    }
  }

  return {
    phase: 'V0',
    enabled: isVitProEnabled(),
    pipelineVersion: VIT_PRO_PIPELINE_VERSION,
    reportSchemaVersion: VIT_PRO_REPORT_SCHEMA_VERSION,
    ragCorpusVersion: getCorpusVersion() || VIT_PRO_RAG_CORPUS_VERSION,
    corpusChunkCount: listCorpusSources().length,
    rubrics: getAllRubrics().map((r) => ({ region: r.region, version: r.version })),
    benchmark: {
      casesFileExists,
      totalCases,
      casesWithImages,
      targetCases: 50,
    },
  };
}
