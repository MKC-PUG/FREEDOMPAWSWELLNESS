import assert from 'node:assert/strict';
import { matchNotGoodList } from '../lib/wellness/not-good-list.ts';

const xylitol = matchNotGoodList('Peanut butter, xylitol, salt', 'food');
assert.ok(xylitol.some((hit) => hit.id === 'xylitol'));

const grapeSeed = matchNotGoodList('Chicken, grape seed extract, blueberries', 'food');
assert.equal(
  grapeSeed.some((hit) => hit.id === 'grapes'),
  false
);

const raisins = matchNotGoodList('Oats and raisins', 'treat');
assert.ok(raisins.some((hit) => hit.id === 'grapes'));

const garlic = matchNotGoodList('Chicken meal, garlic powder', 'food');
assert.ok(garlic.some((hit) => hit.id === 'allium'));

const plain = matchNotGoodList('Deboned chicken, chicken meal, sweet potatoes', 'food');
assert.equal(
  plain.some((hit) => hit.id === 'allium' || hit.id === 'bha'),
  false
);
assert.ok(plain.some((hit) => hit.id === 'fda-dcm-ingredients'));

const bha = matchNotGoodList('Preserved with BHA and citric acid', 'food');
assert.ok(bha.some((hit) => hit.id === 'bha' && hit.tier === 'cancer_note'));

const leader = matchNotGoodList('Pack leader training toy', 'toy');
assert.equal(
  leader.some((hit) => hit.id === 'contact-chemicals'),
  false
);

const nylon = matchNotGoodList('Hard nylon chew', 'toy');
assert.ok(nylon.some((hit) => hit.id === 'hard-chew'));

const nylonFood = matchNotGoodList('nylon', 'food');
assert.equal(
  nylonFood.some((hit) => hit.id === 'hard-chew'),
  false
);

const red = matchNotGoodList('FD&C Red 40', 'treat');
assert.ok(red.some((hit) => hit.id === 'colors'));

console.log('not-good list checks passed');
