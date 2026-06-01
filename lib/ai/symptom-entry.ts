/** Shared symptom lexicon entry shape (used by core + spec expansions). */
export type SymptomEntry = {
  id: string;
  canonical: string;
  aliases: string[];
  /** Full protocol title from app/protocols/protocols.ts */
  protocol: string;
  /** Lower number = higher priority when choosing primary recommendation */
  priority: number;
  /** When this entry matches, recommend this as #2 supplement (overlap pairing) */
  forcedSecondary?: string;
};
