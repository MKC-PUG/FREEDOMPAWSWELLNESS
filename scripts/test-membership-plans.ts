import assert from 'node:assert/strict';
import {
  featuredAnnualPlan,
  foundingIsOpen,
  planIsOffered,
  scanAllowed,
  xrpForUsd,
} from '../lib/shop/membership-plans';

const before = new Date('2027-04-30T12:00:00-05:00');
const after = new Date('2027-05-01T12:00:00-05:00');

assert.equal(foundingIsOpen(before), true);
assert.equal(foundingIsOpen(after), false);
assert.equal(featuredAnnualPlan(before), 'founding_annual');
assert.equal(featuredAnnualPlan(after), 'annual');
assert.equal(planIsOffered('founding_annual', after), false);
assert.equal(planIsOffered('annual', before), false);
assert.equal(planIsOffered('monthly', before), true);
assert.equal(planIsOffered('pass', after), true);

assert.equal(scanAllowed('vit', false, 0), true);
assert.equal(scanAllowed('vit', false, 1), false);
assert.equal(scanAllowed('label', false, 0), false);
assert.equal(scanAllowed('vit', true, 7), true);
assert.equal(scanAllowed('vit', true, 8), false);
assert.equal(scanAllowed('label', true, 7), true);
assert.equal(scanAllowed('label', true, 8), false);

assert.equal(xrpForUsd(79, 0.5), 158);
assert.equal(xrpForUsd(18, 0), 25);

console.log('membership plan checks passed');
