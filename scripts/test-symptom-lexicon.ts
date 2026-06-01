#!/usr/bin/env npx tsx
/**
 * Local lexicon checker — run: npm run symptom:test
 * Optional args: npm run symptom:test -- "your symptom text here"
 */
import { normalizeSymptoms } from '../lib/ai/normalize-symptoms';
import { rankTopTwoProtocols } from '../lib/ai/rank-protocols';
import { formatDualLabel } from '../lib/ai/protocol-registry';

const DEFAULT =
  'senior dog pacing at night, confused';

const text = process.argv.slice(2).join(' ').trim() || DEFAULT;

const parsed = normalizeSymptoms(text);
const ranked = rankTopTwoProtocols({
  matches: parsed.matches,
  protocolTitles: parsed.protocols,
  usedFallback: parsed.usedFallback,
  unknownPhrases: parsed.unknownPhrases,
});

console.log('\n── ViT Lexicon Test ──');
console.log('Input:', text);
console.log('Normalized:', parsed.normalized || '(empty)');
console.log('\nLexicon matches:');
if (parsed.matches.length === 0) {
  console.log('  (none — would use fallback)');
} else {
  for (const m of parsed.matches) {
    console.log(
      `  • [${m.entry.id}] alias "${m.matchedAlias}" → ${m.entry.protocol} (priority ${m.entry.priority})`
    );
  }
}
console.log('\nCanonical terms:', parsed.canonicalTerms.join('; ') || '(none)');
console.log('Unknown phrases:', parsed.unknownPhrases.join('; ') || '(none)');
console.log('Used fallback:', parsed.usedFallback);
console.log('\nTop-2 supplements:');
console.log('  #1', formatDualLabel(ranked.primary.protocolTitle), `(${ranked.primary.confidence}%)`);
console.log(
  '  #2',
  ranked.secondary
    ? `${formatDualLabel(ranked.secondary.protocolTitle)} (${ranked.secondary.confidence}%)`
    : '(none)'
);
console.log('Overlap pair used:', ranked.forcedPairUsed);
console.log('');
