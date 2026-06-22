import manifest from '../corpus/manifest.json';
import type { VitProCitation, VitProRegion } from '../types';

export type CorpusChunk = {
  id: string;
  title: string;
  source: string;
  url?: string;
  regions: VitProRegion[];
  keywords: string[];
  chunk: string;
};

export type RetrieveCorpusInput = {
  regions: VitProRegion[];
  symptoms: string;
  visualFindings: string[];
  limit?: number;
};

export type ScoredChunk = CorpusChunk & { score: number };

const CHUNKS: CorpusChunk[] = manifest.sources as CorpusChunk[];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): Set<string> {
  const n = normalize(text);
  const tokens = new Set<string>();
  for (const word of n.split(' ')) {
    if (word.length >= 3) tokens.add(word);
  }
  return tokens;
}

function scoreChunk(
  chunk: CorpusChunk,
  regions: VitProRegion[],
  queryTokens: Set<string>
): number {
  let score = 0;
  if (chunk.regions.some((r) => regions.includes(r))) score += 3;
  for (const kw of chunk.keywords) {
    const kn = normalize(kw);
    if (queryTokens.has(kn)) score += 4;
    for (const t of queryTokens) {
      if (kn.includes(t) || t.includes(kn)) score += 2;
    }
  }
  const chunkTokens = tokenize(`${chunk.title} ${chunk.chunk}`);
  for (const t of queryTokens) {
    if (chunkTokens.has(t)) score += 1;
  }
  return score;
}

/**
 * Phase V0 keyword RAG — no vector DB. Upgrade to embeddings in V1.
 */
export function retrieveCorpusChunks(input: RetrieveCorpusInput): ScoredChunk[] {
  const limit = input.limit ?? 5;
  const queryText = [input.symptoms, ...input.visualFindings].join(' ');
  const queryTokens = tokenize(queryText);

  const scored = CHUNKS.map((chunk) => ({
    ...chunk,
    score: scoreChunk(chunk, input.regions, queryTokens),
  }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length >= limit) return scored.slice(0, limit);

  const regionFallback = CHUNKS.filter((c) => c.regions.some((r) => input.regions.includes(r))).map(
    (chunk) => ({
      ...chunk,
      score: scoreChunk(chunk, input.regions, queryTokens) || 1,
    })
  );

  const seen = new Set(scored.map((s) => s.id));
  for (const fb of regionFallback) {
    if (scored.length >= limit) break;
    if (!seen.has(fb.id)) {
      scored.push(fb);
      seen.add(fb.id);
    }
  }

  return scored.slice(0, limit);
}

export function chunksToCitations(chunks: ScoredChunk[]): VitProCitation[] {
  return chunks.map((c) => ({
    id: c.id,
    title: c.title,
    source: c.source,
    url: c.url || undefined,
    excerpt: c.chunk.slice(0, 280),
  }));
}

export function getCorpusVersion(): string {
  return manifest.version;
}

export function listCorpusSources(): CorpusChunk[] {
  return [...CHUNKS];
}
