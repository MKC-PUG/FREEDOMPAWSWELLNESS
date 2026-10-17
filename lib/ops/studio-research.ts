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

const STOP_HOME_CARE =
  'Skip home care and call your vet the same day if there is blood, swelling, repeated vomiting, or the dog will not get up.';

/** One gentle at-home step. No drugs, doses, essential oils, or anything put in the ear or eye. */
export function atHomeComfort(topic: string): string {
  const text = topic.toLowerCase();
  let step =
    'Keep the dog quiet, offer fresh water, and write down what you saw so you can tell your vet.';
  if (/topper|joint nutrition|mobility nutrition/.test(text) && !/brace|hind-leg|hind leg/.test(text)) {
    step =
      'Stir a measured topper into a normal meal. It is a food habit, not a treatment. Keep walks short and flat.';
  } else if (/hind|hip|dysplas|arthritis|arthritic|brace/.test(text)) {
    step =
      'For a dog who is otherwise bright but slow in the hind end, a properly fitted hind-leg support can steady short flat walks. Skip stairs. Ask your own veterinarian to check the fit before you use it every day.';
  } else if (/harness/.test(text)) {
    step =
      'Use a well-fitted harness, not a neck collar, for a short flat walk. Stop if the dog leans, limps, or will not continue.';
  } else if (/itch|scratch|skin|coat|hot spot|flea|rash/.test(text)) {
    step =
      'For itchy skin, a cool plain oatmeal bath can soothe: colloidal oatmeal in lukewarm water, a few minutes, then rinse well and dry.';
  } else if (/ear|head shak/.test(text)) {
    step =
      'Wipe only the outside of a dirty ear flap with a damp cloth. Do not put liquid, oil, or drops into the ear canal.';
  } else if (/eye|squint/.test(text)) {
    step =
      'Do not put drops in the eye. If the dog is calm, a cool damp cloth can clean the face around a closed eye.';
  } else if (/chew|rawhide/.test(text)) {
    step = 'Offer the chew only while you watch, and take it away if it breaks into small pieces.';
  } else if (/teeth|breath|gum|dental/.test(text)) {
    step = 'Brush with dog toothpaste on a dog toothbrush. Do not use human toothpaste.';
  } else if (/vomit|throw up|nausea/.test(text)) {
    step =
      'If the dog is otherwise bright, offer small drinks of water and skip the next big meal. Do not try to make the dog vomit.';
  } else if (/stool|diarrhea|loose/.test(text)) {
    step =
      'If the dog is otherwise bright, small meals of plain boiled chicken and rice for one day can rest the gut.';
  } else if (/paw|mud|nail|pad/.test(text)) {
    step = 'Rinse mud off the paws and dry between the toes. Do not cut into the quick of a nail.';
  } else if (/drink|water|pee|urin/.test(text)) {
    step = 'Keep fresh water available and note how often the dog drinks or needs to go out.';
  } else if (/night|pacing|restless|anx|thunder/.test(text)) {
    step = 'Offer a quiet room and a familiar bed. Do not scold the dog for pacing.';
  } else if (/heat|pant|hot car|summer/.test(text)) {
    step = 'Move the dog to shade and offer cool water. Do not use an ice bath.';
  } else if (/limp|walk|gait|stair|sore/.test(text)) {
    step = 'Keep walks short and flat, and skip stairs, until a vet has seen a limp that continues.';
  } else if (/cough/.test(text)) {
    step = 'Skip hard exercise and note when the cough happens, including at night or on a walk.';
  } else if (/weight|fat|rib/.test(text)) {
    step = 'Feel the ribs with your hands and keep meals measured. Do not start a crash diet.';
  }
  return `${step} ${STOP_HOME_CARE}`;
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
    `At-home comfort: ${atHomeComfort(`${hit.title} ${hit.summary}`)}`,
    'SuperBud may say the at-home step when the dog is otherwise bright, then tell the owner to call their own veterinarian if it continues or the dog seems worse.',
    `Do not say: ${doNotSay}`,
  ].join('\n');
  return { factCard, doNotSay };
}
