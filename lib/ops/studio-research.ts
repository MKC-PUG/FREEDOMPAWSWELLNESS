import { findBannedPhrase } from '@/lib/ops/studio-compliance';

export type ResearchHit = {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  kind: 'article' | 'paper';
};

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'FreedomPawsOps/1.0 (studio research; info@freedompawsinc.com)',
};

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function dogQuery(query: string): string {
  if (/\b(dog|dogs|canine|puppy|pug|vet|veterinar)/i.test(query)) return query;
  return `${query} dog`;
}

async function searchWikipedia(query: string): Promise<ResearchHit[]> {
  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('list', 'search');
  url.searchParams.set('srsearch', dogQuery(query));
  url.searchParams.set('srlimit', '5');
  url.searchParams.set('utf8', '1');
  url.searchParams.set('format', 'json');
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(12_000) });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    query?: { search?: Array<{ title?: string; snippet?: string }> };
  };
  const hits: ResearchHit[] = [];
  for (const row of json.query?.search ?? []) {
    const title = row.title?.trim() || '';
    if (!title) continue;
    hits.push({
      id: `wiki-${title}`,
      title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
      source: 'Wikipedia',
      summary: stripHtml(row.snippet || ''),
      kind: 'article',
    });
  }
  return hits;
}

async function searchPubMed(query: string): Promise<ResearchHit[]> {
  const term = `${dogQuery(query)} AND (canine[Title/Abstract] OR dog[Title/Abstract])`;
  const searchUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');
  searchUrl.searchParams.set('db', 'pubmed');
  searchUrl.searchParams.set('retmode', 'json');
  searchUrl.searchParams.set('retmax', '5');
  searchUrl.searchParams.set('sort', 'relevance');
  searchUrl.searchParams.set('term', term);
  searchUrl.searchParams.set('tool', 'freedompaws-ops');
  searchUrl.searchParams.set('email', 'info@freedompawsinc.com');
  const found = await fetch(searchUrl, { headers: HEADERS, signal: AbortSignal.timeout(12_000) });
  if (!found.ok) return [];
  const foundJson = (await found.json()) as { esearchresult?: { idlist?: string[] } };
  const ids = foundJson.esearchresult?.idlist ?? [];
  if (ids.length === 0) return [];

  const summaryUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi');
  summaryUrl.searchParams.set('db', 'pubmed');
  summaryUrl.searchParams.set('retmode', 'json');
  summaryUrl.searchParams.set('id', ids.join(','));
  summaryUrl.searchParams.set('tool', 'freedompaws-ops');
  summaryUrl.searchParams.set('email', 'info@freedompawsinc.com');
  const summary = await fetch(summaryUrl, { headers: HEADERS, signal: AbortSignal.timeout(12_000) });
  if (!summary.ok) return [];
  const summaryJson = (await summary.json()) as {
    result?: Record<string, { title?: string; source?: string; pubdate?: string; uid?: string }>;
  };
  const result = summaryJson.result ?? {};
  const hits: ResearchHit[] = [];
  for (const id of ids) {
    const row = result[id];
    const title = row?.title?.trim() || '';
    if (!title) continue;
    const journal = [row.source, row.pubdate].filter(Boolean).join(' · ');
    hits.push({
      id: `pubmed-${id}`,
      title: stripHtml(title),
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      source: journal ? `PubMed · ${journal}` : 'PubMed',
      summary: 'Open the article to read it. Keep SuperBud to what an owner can notice, then a vet call.',
      kind: 'paper',
    });
  }
  return hits;
}

export async function searchDogTopics(query: string): Promise<ResearchHit[]> {
  const q = query.trim();
  if (q.length < 3) throw new Error('Type at least 3 letters.');
  const [articles, papers] = await Promise.all([searchWikipedia(q), searchPubMed(q)]);
  const hits = [...articles, ...papers];
  if (hits.length === 0) {
    throw new Error('No readable sources came back. Try a plainer phrase, such as “dog itchy skin”.');
  }
  return hits.slice(0, 8);
}

export function factCardFromHit(hit: ResearchHit): { factCard: string; doNotSay: string } {
  const doNotSay = 'Naming a condition as the answer, a treatment promise, a dose, or a reunion promise.';
  const blurb = hit.summary
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence && !findBannedPhrase(sentence))
    .join(' ')
    .slice(0, 420);
  const factCard = [
    `Source: ${hit.source} — ${hit.title}`,
    hit.url,
    blurb ? `From the source: ${blurb}` : 'Open the source and keep one owner-facing sentence.',
    'SuperBud may say: notice the change, write it down, and call your own veterinarian if it continues.',
    `Do not say: ${doNotSay}`,
  ].join('\n');
  return { factCard, doNotSay };
}
