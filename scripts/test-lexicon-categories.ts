#!/usr/bin/env npx tsx
/**
 * Run ViT lexicon checks for all 10 spec categories + overlap pairs.
 * Usage: npm run symptom:test:all
 */
import { normalizeSymptoms } from '../lib/ai/normalize-symptoms';
import { rankTopTwoProtocols } from '../lib/ai/rank-protocols';
import { protocolDisplayName } from '../lib/ai/symptom-lexicon';

type Case = {
  category: string;
  input: string;
  primary: string;
  secondary?: string;
  overlap?: boolean;
};

const CASES: Case[] = [
  {
    category: '1 Immune Vitality',
    input: 'weak immune system, always getting sick',
    primary: 'Patriot Defender',
  },
  {
    category: '1 Immune — wellness baseline',
    input: 'holistic wellness support, preventive care',
    primary: 'Patriot Defender',
  },
  {
    category: '2 Joint & Mobility',
    input: "won't jump on couch, slow on walks, stiff legs",
    primary: 'Max Movement',
  },
  {
    category: '3 Skin & Coat',
    input: 'itchy skin, red bumps, smelly skin',
    primary: 'Allergy Shield',
  },
  {
    category: '4 Digestive Harmony',
    input: 'diarrhea, mucus in stool, picky eater',
    primary: "Buddy's Gut",
  },
  {
    category: '5 Heart & Vitals',
    input: 'coughing, fainting on walks, blue gums',
    primary: 'Heart Strong',
  },
  {
    category: '5 Liver & Kidney',
    input: 'kidney failure, drinking lots of water, blood in urine',
    primary: 'Foundation Liver',
  },
  {
    category: '5 Heart + Kidney overlap',
    input: 'heart and kidney disease, drinking a lot and coughing',
    primary: 'Heart Strong',
    secondary: 'Foundation Liver',
    overlap: true,
  },
  {
    category: '6 Cognitive & Senior overlap',
    input: 'senior dog pacing at night, confused',
    primary: 'Patriot Defender',
    secondary: 'Freedom Calm',
    overlap: true,
  },
  {
    category: '6 Calm standalone',
    input: 'thunder anxiety, vet fear, cannot relax',
    primary: 'Freedom Calm',
  },
  {
    category: '7 Eye & Vision',
    input: 'cloudy eyes, dry eye, squinting',
    primary: 'Clear Vision',
  },
  {
    category: '8 Allergy & Respiratory',
    input: 'sneezing, reverse sneezing, seasonal allergies',
    primary: 'Allergy Shield',
  },
  {
    category: '9 Musculoskeletal overlap',
    input: 'back and hip pain, weak back legs',
    primary: 'Max Movement',
    secondary: 'Red Light Spine',
    overlap: true,
  },
  {
    category: '9 Injury recovery',
    input: 'recovering from surgery, soft tissue injury',
    primary: 'Red Light Spine',
    secondary: 'Max Movement',
    overlap: true,
  },
  {
    category: '10 Dental / Baseline',
    input: 'bad breath, tartar, gum disease',
    primary: 'Fresh Smile',
  },
];

function shortName(title: string): string {
  return protocolDisplayName(title);
}

let passed = 0;
let failed = 0;

console.log('\n── ViT Lexicon — All Categories ──\n');

for (const c of CASES) {
  const parsed = normalizeSymptoms(c.input);
  const ranked = rankTopTwoProtocols({
    matches: parsed.matches,
    protocolTitles: parsed.protocols,
    usedFallback: parsed.usedFallback,
    unknownPhrases: parsed.unknownPhrases,
  });

  const p1 = shortName(ranked.primary.protocolTitle);
  const p2 = ranked.secondary ? shortName(ranked.secondary.protocolTitle) : null;

  const primaryOk = p1.includes(c.primary);
  const secondaryOk = c.secondary ? Boolean(p2?.includes(c.secondary)) : true;
  const overlapOk = c.overlap ? ranked.forcedPairUsed : true;
  const noFallback = !parsed.usedFallback;

  const ok = primaryOk && secondaryOk && overlapOk && noFallback;

  if (ok) {
    passed += 1;
    console.log(`✓ ${c.category}`);
    console.log(`  "${c.input}"`);
    console.log(`  → #1 ${p1}${p2 ? ` · #2 ${p2}` : ''}\n`);
  } else {
    failed += 1;
    console.log(`✗ ${c.category}`);
    console.log(`  "${c.input}"`);
    console.log(`  expected #1 ${c.primary}${c.secondary ? ` · #2 ${c.secondary}` : ''}`);
    console.log(`  got       #1 ${p1}${p2 ? ` · #2 ${p2}` : ''}`);
    console.log(`  fallback=${parsed.usedFallback} overlap=${ranked.forcedPairUsed}`);
    console.log(`  unknown: ${parsed.unknownPhrases.join('; ') || '(none)'}\n`);
  }
}

console.log(`Results: ${passed}/${CASES.length} passed${failed ? `, ${failed} FAILED` : ''}\n`);
process.exit(failed > 0 ? 1 : 0);
