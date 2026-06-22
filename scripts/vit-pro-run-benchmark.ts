#!/usr/bin/env npx tsx
/**
 * ViT Pro Phase V0 — run internal benchmark cases and write advisor review CSV.
 *
 * Usage:
 *   cp data/vit-pro/benchmark/cases.template.json data/vit-pro/benchmark/cases.json
 *   # add images + cases
 *   npm run vit-pro:benchmark
 *
 * Requires OPENAI_API_KEY in environment (.env.local loaded if present).
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const CASES_PATH = join(ROOT, 'data/vit-pro/benchmark/cases.json');
const OUT_DIR = join(ROOT, 'data/vit-pro/benchmark/results');

type BenchmarkCase = {
  id: string;
  region: 'eye' | 'skin' | 'oral';
  imagePath: string;
  symptoms: string;
  signalmentNotes?: string;
  advisorReview?: {
    urgentExpected?: boolean;
    topDifferentials?: string[];
    notes?: string;
  };
};

type CasesFile = {
  cases: BenchmarkCase[];
};

function loadEnvLocal() {
  const envPath = join(ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function fileToWebFile(absPath: string): File {
  const buf = readFileSync(absPath);
  const name = absPath.split('/').pop() || 'image.jpg';
  const ext = name.split('.').pop()?.toLowerCase();
  const type = ext === 'png' ? 'image/png' : 'image/jpeg';
  return new File([buf], name, { type });
}

async function main() {
  loadEnvLocal();

  if (!existsSync(CASES_PATH)) {
    console.error(`Missing ${CASES_PATH}`);
    console.error('Copy cases.template.json to cases.json and add benchmark images.');
    process.exit(1);
  }

  const { analyzeVitPro } = await import('../lib/vit-pro/vit-pro-analyze');
  const data = JSON.parse(readFileSync(CASES_PATH, 'utf8')) as CasesFile;
  const rows: string[] = [
    'case_id,region,urgency,citation_count,differential_count,vet_urgent_flag,missed_critical_urgent,advisor_agreement_pct,notes',
  ];

  mkdirSync(OUT_DIR, { recursive: true });
  const jsonResults: Record<string, unknown>[] = [];

  for (const c of data.cases) {
    const absImage = join(ROOT, c.imagePath);
    if (!existsSync(absImage)) {
      console.warn(`Skip ${c.id}: missing image ${c.imagePath}`);
      rows.push(`${c.id},${c.region},,,,,,,"missing image"`);
      continue;
    }

    console.log(`Running ${c.id} (${c.region})...`);
    const file = fileToWebFile(absImage);
    const result = await analyzeVitPro({
      symptoms: c.symptoms,
      frames: [file],
      mediaType: 'photo',
      signalmentNotes: c.signalmentNotes,
      regionHint: c.region,
    });

    if (!result.success || !result.vet) {
      rows.push(`${c.id},${c.region},error,,,,,,"${result.error || 'failed'}"`);
      continue;
    }

    const vet = result.vet;
    const citationCount = vet.citations.length;
    const diffCount = vet.differentialConsiderations.length;
    const missedCritical =
      c.advisorReview?.urgentExpected === true &&
      vet.urgency !== 'urgent' &&
      vet.urgency !== 'prompt_vet';

    jsonResults.push({
      caseId: c.id,
      reportId: vet.reportId,
      vet,
      public: result.public,
    });

    rows.push(
      [
        c.id,
        c.region,
        vet.urgency,
        citationCount,
        diffCount,
        vet.urgency === 'urgent' || vet.urgency === 'prompt_vet' ? 'yes' : 'no',
        missedCritical ? 'YES' : 'no',
        '',
        '',
      ].join(',')
    );
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const csvPath = join(OUT_DIR, `benchmark-${stamp}.csv`);
  const jsonPath = join(OUT_DIR, `benchmark-${stamp}.json`);
  writeFileSync(csvPath, rows.join('\n'));
  writeFileSync(jsonPath, JSON.stringify(jsonResults, null, 2));

  console.log(`\nWrote ${csvPath}`);
  console.log(`Wrote ${jsonPath}`);
  console.log('Share JSON reports with veterinary advisor for manual agreement scoring.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
