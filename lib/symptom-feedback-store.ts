import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

export type AnalysisRecord = {
  id: string;
  symptoms: string;
  normalized: string;
  primaryProtocol: string;
  secondaryProtocol: string | null;
  confidence: number;
  matchedTerms: string[];
  unknownPhrases: string[];
  usedFallback: boolean;
  createdAt: string;
  userFeedback?: 'helpful' | 'wrong' | null;
  userSuggestedProtocol?: string;
};

export type PendingPhrase = {
  id: string;
  phrase: string;
  status: 'pending' | 'approved' | 'rejected';
  protocol: string | null;
  fromAnalysisId: string;
  rawSymptoms: string;
  matchedProtocols: string[];
  occurrenceCount: number;
  createdAt: string;
  reviewedAt?: string;
};

export type ApprovedAlias = {
  id: string;
  alias: string;
  protocol: string;
  canonical: string;
  approvedAt: string;
  sourcePhraseId?: string;
  /** True after npm run symptom:merge writes this alias to symptom-lexicon.ts */
  exportedToLexicon?: boolean;
};

type FeedbackDb = {
  analyses: AnalysisRecord[];
  pendingPhrases: PendingPhrase[];
  approvedAliases: ApprovedAlias[];
};

const dataDir = path.join(process.cwd(), 'data', 'symptom-feedback');
const dbPath = path.join(dataDir, 'feedback.json');

async function ensureDb(): Promise<FeedbackDb> {
  await mkdir(dataDir, { recursive: true });
  try {
    const raw = await readFile(dbPath, 'utf8');
    return JSON.parse(raw) as FeedbackDb;
  } catch {
    return { analyses: [], pendingPhrases: [], approvedAliases: [] };
  }
}

async function saveDb(db: FeedbackDb) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

export async function getApprovedAliases(): Promise<ApprovedAlias[]> {
  const db = await ensureDb();
  return db.approvedAliases.filter((a) => !a.exportedToLexicon);
}

export async function getAllApprovedAliases(): Promise<ApprovedAlias[]> {
  const db = await ensureDb();
  return db.approvedAliases;
}

export async function markAliasesExported(ids: string[]) {
  const db = await ensureDb();
  const idSet = new Set(ids);
  for (const alias of db.approvedAliases) {
    if (idSet.has(alias.id)) {
      alias.exportedToLexicon = true;
    }
  }
  await saveDb(db);
}

export async function recordAnalysis(record: Omit<AnalysisRecord, 'id' | 'createdAt'>): Promise<AnalysisRecord> {
  const db = await ensureDb();
  const full: AnalysisRecord = {
    ...record,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    userFeedback: null,
  };
  db.analyses.unshift(full);

  for (const phrase of record.unknownPhrases) {
    const normalized = phrase.toLowerCase().trim();
    if (normalized.length < 3) continue;

    const existing = db.pendingPhrases.find(
      (p) => p.status === 'pending' && p.phrase.toLowerCase() === normalized
    );

    if (existing) {
      existing.occurrenceCount += 1;
      existing.fromAnalysisId = full.id;
      existing.rawSymptoms = record.symptoms;
      existing.matchedProtocols = [record.primaryProtocol, record.secondaryProtocol].filter(
        Boolean
      ) as string[];
    } else {
      db.pendingPhrases.unshift({
        id: randomUUID(),
        phrase,
        status: 'pending',
        protocol: null,
        fromAnalysisId: full.id,
        rawSymptoms: record.symptoms,
        matchedProtocols: [record.primaryProtocol, record.secondaryProtocol].filter(
          Boolean
        ) as string[],
        occurrenceCount: 1,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Keep last 500 analyses
  db.analyses = db.analyses.slice(0, 500);
  await saveDb(db);
  return full;
}

export async function setUserFeedback(
  analysisId: string,
  feedback: 'helpful' | 'wrong',
  suggestedProtocol?: string
) {
  const db = await ensureDb();
  const record = db.analyses.find((a) => a.id === analysisId);
  if (!record) return null;

  record.userFeedback = feedback;
  if (suggestedProtocol) record.userSuggestedProtocol = suggestedProtocol;

  if (feedback === 'wrong') {
    for (const phrase of record.unknownPhrases.length > 0 ? record.unknownPhrases : [record.symptoms]) {
      const normalized = phrase.toLowerCase().trim();
      const existing = db.pendingPhrases.find(
        (p) => p.status === 'pending' && p.phrase.toLowerCase() === normalized
      );
      if (existing) {
        existing.occurrenceCount += 1;
        if (suggestedProtocol) existing.protocol = suggestedProtocol;
      } else {
        db.pendingPhrases.unshift({
          id: randomUUID(),
          phrase,
          status: 'pending',
          protocol: suggestedProtocol ?? null,
          fromAnalysisId: analysisId,
          rawSymptoms: record.symptoms,
          matchedProtocols: [record.primaryProtocol, record.secondaryProtocol].filter(
            Boolean
          ) as string[],
          occurrenceCount: 1,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  await saveDb(db);
  return record;
}

export async function listPendingPhrases(): Promise<PendingPhrase[]> {
  const db = await ensureDb();
  return db.pendingPhrases.filter((p) => p.status === 'pending');
}

export async function listRecentAnalyses(limit = 50): Promise<AnalysisRecord[]> {
  const db = await ensureDb();
  return db.analyses.slice(0, limit);
}

export async function approvePhrase(
  phraseId: string,
  protocol: string,
  canonical?: string
): Promise<ApprovedAlias | null> {
  const db = await ensureDb();
  const pending = db.pendingPhrases.find((p) => p.id === phraseId);
  if (!pending) return null;

  pending.status = 'approved';
  pending.protocol = protocol;
  pending.reviewedAt = new Date().toISOString();

  const approved: ApprovedAlias = {
    id: randomUUID(),
    alias: pending.phrase.toLowerCase().trim(),
    protocol,
    canonical: canonical || pending.phrase,
    approvedAt: new Date().toISOString(),
    sourcePhraseId: phraseId,
    exportedToLexicon: false,
  };

  const duplicate = db.approvedAliases.some(
    (a) => a.alias === approved.alias && a.protocol === protocol
  );
  if (!duplicate) {
    db.approvedAliases.push(approved);
  }

  await saveDb(db);
  return approved;
}

export async function rejectPhrase(phraseId: string) {
  const db = await ensureDb();
  const pending = db.pendingPhrases.find((p) => p.id === phraseId);
  if (!pending) return null;

  pending.status = 'rejected';
  pending.reviewedAt = new Date().toISOString();
  await saveDb(db);
  return pending;
}
