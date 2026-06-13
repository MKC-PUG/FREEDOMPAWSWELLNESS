/**
 * Quick sanity checks for severe-condition urgent gating.
 * Run: npx tsx scripts/test-urgent-assessment.ts
 */
import { assessUrgentNeed } from '../lib/ai/urgent-assessment';
import { URGENT_CONGRUENCY_THRESHOLD } from '../lib/ai/severe-conditions-db';

function assert(label: string, condition: boolean) {
  if (!condition) {
    console.error(`FAIL: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`ok: ${label}`);
  }
}

const mild = assessUrgentNeed({
  symptoms: 'My dog has a mild limp after playing and occasional soft stool',
  visualFindings: ['mild stiffness'],
});
assert('mild limp does not trigger urgent', !mild.vetUrgent && mild.mildModerateOnly);

const jaundice = assessUrgentNeed({
  symptoms: 'yellow gums and jaundice, yellow eyes',
  visualFindings: ['yellow gums', 'icteric sclera'],
  aiSevereHits: [{ conditionId: 'jaundice', confidence: 88 }],
});
assert(
  `jaundice triggers urgent at ≥${URGENT_CONGRUENCY_THRESHOLD}%`,
  jaundice.vetUrgent && jaundice.congruencyScore >= URGENT_CONGRUENCY_THRESHOLD
);

const tumor = assessUrgentNeed({
  symptoms: 'fast growing lump bleeding on leg',
  visualFindings: ['ulcerated lump', 'bleeding mass'],
  aiSevereHits: [{ conditionId: 'malignant_mass', confidence: 85 }],
});
assert('suspicious mass triggers urgent', tumor.vetUrgent);

const weak = assessUrgentNeed({
  symptoms: 'dog seems a bit tired today',
  visualFindings: [],
});
assert('vague mild signs do not trigger urgent', !weak.vetUrgent);

console.log('\nThreshold:', URGENT_CONGRUENCY_THRESHOLD);
if (process.exitCode) process.exit(process.exitCode);
console.log('\nAll urgent assessment checks passed.');
