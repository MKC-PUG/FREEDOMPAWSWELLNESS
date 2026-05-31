import {
  FALLBACK_PROTOCOL,
  MERGED_SYMPTOM_ENTRIES,
  protocolDisplayName,
  SYMPTOM_LEXICON,
  type SymptomEntry,
} from './symptom-lexicon';
import type { ApprovedAlias } from '../symptom-feedback-store';

export type SymptomMatch = {
  entry: SymptomEntry;
  matchedAlias: string;
};

export type NormalizedSymptoms = {
  /** Original owner text (trimmed) */
  raw: string;
  /** Normalized text used for matching */
  normalized: string;
  matches: SymptomMatch[];
  /** Full protocol titles, best-first, deduplicated */
  protocols: string[];
  /** Short names for UI */
  protocolLabels: string[];
  /** Canonical symptom phrases that matched */
  canonicalTerms: string[];
  /** Phrases in owner text with no lexicon match */
  unknownPhrases: string[];
  /** True when no lexicon entry matched */
  usedFallback: boolean;
};

/** Prepare free-text for alias lookup. */
export function normalizeSymptomText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function textContainsAlias(haystack: string, alias: string): boolean {
  const phrase = normalizeSymptomText(alias);
  if (!phrase) return false;

  if (phrase.includes(' ')) {
    return haystack.includes(phrase);
  }

  return new RegExp(`\\b${escapeRegex(phrase)}\\b`).test(haystack);
}

function approvedToEntries(approved: ApprovedAlias[]): SymptomEntry[] {
  return approved.map((a) => ({
    id: `approved_${a.id}`,
    canonical: a.canonical,
    aliases: [a.alias],
    protocol: a.protocol,
    priority: 45,
  }));
}

function buildLexicon(approved: ApprovedAlias[] = []): SymptomEntry[] {
  return [...SYMPTOM_LEXICON, ...MERGED_SYMPTOM_ENTRIES, ...approvedToEntries(approved)];
}

function segmentMatches(segment: string, lexicon: SymptomEntry[]): boolean {
  const normalized = normalizeSymptomText(segment);
  if (!normalized || normalized.length < 3) return true;

  for (const entry of lexicon) {
    for (const alias of entry.aliases) {
      if (textContainsAlias(normalized, alias)) return true;
    }
  }
  return false;
}

/** Split owner text into reviewable phrases not covered by the lexicon. */
export function extractUnknownPhrases(
  rawText: string,
  lexicon: SymptomEntry[] = SYMPTOM_LEXICON
): string[] {
  const segments = rawText
    .split(/\s*[,;]\s*|\s+\band\s+/i)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);

  const unknown: string[] = [];
  for (const segment of segments) {
    if (!segmentMatches(segment, lexicon)) {
      unknown.push(segment);
    }
  }

  return unknown;
}

function matchLexicon(normalized: string, lexicon: SymptomEntry[]): SymptomMatch[] {
  const matches: SymptomMatch[] = [];
  for (const entry of lexicon) {
    for (const alias of entry.aliases) {
      if (textContainsAlias(normalized, alias)) {
        matches.push({ entry, matchedAlias: alias });
        break;
      }
    }
  }
  matches.sort(
    (a, b) =>
      a.entry.priority - b.entry.priority ||
      a.entry.canonical.localeCompare(b.entry.canonical)
  );
  return matches;
}

/**
 * Layer 1: map owner symptom text → canonical terms → protocols.
 * Pass approved aliases from the review queue to extend the lexicon at runtime.
 */
export function normalizeSymptoms(
  rawText: string,
  approved: ApprovedAlias[] = []
): NormalizedSymptoms {
  const raw = rawText.trim();
  const normalized = normalizeSymptomText(raw);
  const lexicon = buildLexicon(approved);

  if (!normalized) {
    return {
      raw,
      normalized,
      matches: [],
      protocols: [FALLBACK_PROTOCOL],
      protocolLabels: [FALLBACK_PROTOCOL],
      canonicalTerms: [],
      unknownPhrases: [],
      usedFallback: true,
    };
  }

  const matches = matchLexicon(normalized, lexicon);
  const unknownPhrases = extractUnknownPhrases(raw, lexicon);

  const protocols: string[] = [];
  const canonicalTerms: string[] = [];
  const seenProtocols = new Set<string>();
  const seenCanonical = new Set<string>();

  for (const { entry } of matches) {
    if (!seenCanonical.has(entry.id)) {
      seenCanonical.add(entry.id);
      canonicalTerms.push(entry.canonical);
    }
    if (!seenProtocols.has(entry.protocol)) {
      seenProtocols.add(entry.protocol);
      protocols.push(entry.protocol);
    }
  }

  const usedFallback = protocols.length === 0;
  if (usedFallback) {
    protocols.push(FALLBACK_PROTOCOL);
  }

  return {
    raw,
    normalized,
    matches,
    protocols,
    protocolLabels: protocols.map(protocolDisplayName),
    canonicalTerms,
    unknownPhrases,
    usedFallback,
  };
}
