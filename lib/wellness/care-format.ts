import { PROTOCOL_AFFILIATE_CATALOG } from '@/lib/protocols/affiliates';

export type SupportCard = {
  id: string;
  title: string;
  detail: string;
  kind: 'plan' | 'sponsored';
  /** Protocol slug when this card opens a Freedom Paws plan. */
  planSlug?: string;
};

export type FoodPick = {
  id: string;
  title: string;
  detail: string;
};

export type CareFormat = {
  slug: string;
  specShort: string;
  seen: string;
  monitor: string[];
  actions: string[];
  pamphletTitle: string;
  photoNote: string;
  includesWalk: boolean;
  saveGaitVideo: boolean;
  cards: SupportCard[];
  foods: FoodPick[];
};

const HARNESS: SupportCard = {
  id: 'harness',
  title: 'Walking harness',
  detail:
    'A well-fitted harness for leash walks. It sits on the chest and keeps the leash off the neck.',
  kind: 'sponsored',
};

function foodsFor(slug: string): FoodPick[] {
  return (PROTOCOL_AFFILIATE_CATALOG[slug] ?? []).map((pick) => ({
    id: pick.id,
    title: pick.brandName,
    detail: pick.label,
  }));
}

function plan(id: string, title: string, detail: string, planSlug: string): SupportCard {
  return { id, title, detail, kind: 'plan', planSlug };
}

function sponsored(id: string, title: string, detail: string): SupportCard {
  return { id, title, detail, kind: 'sponsored' };
}

const HARNESS_ACTION =
  'On every leash walk, use a well-fitted harness. The leash clips to the harness, not the neck.';

export const CARE_FORMATS: CareFormat[] = [
  {
    slug: 'max-movement',
    specShort: 'Joint & Mobility',
    seen: 'Altered gait, limping, or hesitation on stairs',
    pamphletTitle: 'Limping and a shorter stride',
    photoNote: 'Walk toward the camera and away, same side, the leg you are watching.',
    includesWalk: true,
    saveGaitVideo: true,
    monitor: [
      'Which leg, after sleep and after a walk.',
      'Stairs, sofas, and getting into the car.',
      'Whether the limp is worse, the same, or easier tomorrow.',
    ],
    actions: [
      'Short, slow walks on flat ground for a few days.',
      'Skip jumping onto furniture.',
      HARNESS_ACTION,
      'Film 10–15 seconds of the limp and save it on this dog’s record.',
    ],
    cards: [
      plan(
        'max-movement',
        'Max Movement',
        'Food, short walks, and the notes for this dog.',
        'max-movement'
      ),
      plan(
        'red-light',
        'Red Light',
        'Light sessions and gentle movement at home.',
        'infrared-spine'
      ),
      sponsored(
        'hip-brace',
        'Hip brace',
        'External support on the hip while you follow the home plan. More than one brace will be listed once each has passed the standard.'
      ),
    ],
    foods: foodsFor('max-movement'),
  },
  {
    slug: 'infrared-spine',
    specShort: 'Spine & Recovery',
    seen: 'Slow to get up, turn, or climb',
    pamphletTitle: 'Getting up, turning, and climbing',
    photoNote: 'Film the dog rising from a down and walking away, same side each time.',
    includesWalk: true,
    saveGaitVideo: true,
    monitor: [
      'How they stand after rest.',
      'Tight turns and stairs.',
      'Whether the next day is harder or easier.',
    ],
    actions: [
      'Leash walks on flat ground. No jumping onto furniture.',
      HARNESS_ACTION,
      'A short red-light session only as the home plan describes it.',
      'Save a short video of the movement on this dog’s record.',
    ],
    cards: [
      plan(
        'red-light',
        'Red Light',
        'Light sessions and gentle movement at home.',
        'infrared-spine'
      ),
      plan(
        'max-movement',
        'Max Movement',
        'Food, short walks, and the notes for this dog.',
        'max-movement'
      ),
      sponsored(
        'hip-brace',
        'Hip brace',
        'External support while you follow the home plan, when the hind end is the part you are watching.'
      ),
    ],
    foods: foodsFor('infrared-spine'),
  },
  {
    slug: 'freedom-calm',
    specShort: 'Cognitive & Calm',
    seen: 'Panting, pacing, hiding, or not settling',
    pamphletTitle: 'Panting, pacing, and settling',
    photoNote: 'Note the place and the time of day. A short clip of the pacing is enough.',
    includesWalk: true,
    saveGaitVideo: false,
    monitor: [
      'When the pacing starts and when it stops.',
      'Sleep through the night, or waking.',
      'Whether a familiar walk helps them settle afterward.',
    ],
    actions: [
      'One familiar walk, not a new long outing.',
      HARNESS_ACTION,
      'A settle on the same mat each evening. Five quiet minutes counts.',
    ],
    cards: [
      plan(
        'freedom-calm',
        'Freedom Calm',
        'Food timing, a familiar walk, and a settle routine.',
        'freedom-calm'
      ),
      sponsored(
        'settle-mat',
        'Settle mat',
        'One mat that stays in the same spot, so the settle has a place.'
      ),
      sponsored(
        'snug-shirt',
        'Snug shirt',
        'A close-fitting shirt some dogs wear when noise or travel makes it hard to settle.'
      ),
    ],
    foods: foodsFor('freedom-calm'),
  },
  {
    slug: 'allergy-shield',
    specShort: 'Allergy & Respiratory',
    seen: 'Dull coat, scratching, a bare patch, or a sore',
    pamphletTitle: 'Coat, scratching, and sore spots',
    photoNote: 'Same light, same side of the body, so the next photo can be compared.',
    includesWalk: true,
    saveGaitVideo: false,
    monitor: [
      'Where they scratch or lick, and for how long.',
      'Whether the coat looks duller or the spot looks larger.',
      'Itching in the hour after a meal.',
    ],
    actions: [
      'Keep the current food today. Do not add a new treat.',
      'A light shirt over the itchy skin, so scratching has less to reach.',
      HARNESS_ACTION,
      'Photograph the same spot again in two days.',
    ],
    cards: [
      plan(
        'allergy-shield',
        'Coat and skin plan',
        'Food notes, grooming, and what to write down.',
        'allergy-shield'
      ),
      sponsored(
        'dog-shirt',
        'Dog shirt',
        'Covers itchy skin, which comforts many dogs and keeps claws and teeth off the spot.'
      ),
      sponsored(
        'lick-sleeve',
        'Lick sleeve',
        'A sleeve or light recovery collar when the shirt is not enough to stop chewing at the spot.'
      ),
    ],
    foods: foodsFor('allergy-shield'),
  },
  {
    slug: 'fresh-smile-dental',
    specShort: 'Dental & Oral',
    seen: 'Tartar, a dark spot on a tooth, or one-sided chewing',
    pamphletTitle: 'Mouth, tartar, and chewing',
    photoNote: 'Lift the lip in good light. Same side each time.',
    includesWalk: true,
    saveGaitVideo: false,
    monitor: [
      'Which side they chew on.',
      'Dropped food, drool, or pawing at the mouth.',
      'Breath, and whether a dark spot looks larger.',
    ],
    actions: [
      'Offer a chew they already handle. Stop if they drop it or paw the mouth.',
      'Note softer pieces of the same meal if they prefer them.',
      HARNESS_ACTION,
    ],
    cards: [
      plan(
        'fresh-smile',
        'Fresh Smile',
        'What to look at in the mouth and how to keep notes.',
        'fresh-smile-dental'
      ),
      sponsored(
        'dental-chew',
        'Dental chew',
        'A chew that passed the Freedom Paws standard. Stop if they paw the mouth.'
      ),
      sponsored(
        'finger-cloth',
        'Finger cloth',
        'A cloth on a finger for the teeth they already let you touch.'
      ),
    ],
    foods: foodsFor('fresh-smile-dental'),
  },
  {
    slug: 'clear-vision',
    specShort: 'Eye & Vision',
    seen: 'Cloudy eye, red eye, squinting, or rubbing',
    pamphletTitle: 'Cloudy, red, or squinting eyes',
    photoNote: 'Same eye, same light, the next day.',
    includesWalk: true,
    saveGaitVideo: false,
    monitor: [
      'Which eye.',
      'Squinting while they eat, or bumping on a familiar walk.',
      'Rubbing at the eye, and whether it looks worse tomorrow.',
    ],
    actions: [
      'Walk a familiar route in good light.',
      HARNESS_ACTION,
      'A recovery collar only to stop rubbing. No drops from this page.',
    ],
    cards: [
      plan(
        'clear-vision',
        'Clear Vision',
        'What to watch on the eye and on a familiar walk.',
        'clear-vision'
      ),
      sponsored(
        'recovery-collar',
        'Recovery collar',
        'Keeps a paw off the eye. This page does not suggest drops.'
      ),
    ],
    foods: foodsFor('clear-vision'),
  },
  {
    slug: 'gut-balance',
    specShort: 'Digestive Harmony',
    seen: 'Appetite, stool, and comfort after meals',
    pamphletTitle: 'Appetite, stool, and meals',
    photoNote: 'Write the meal and the next stool. A photo of the stool is optional.',
    includesWalk: true,
    saveGaitVideo: false,
    monitor: [
      'What went in the bowl and what was left.',
      'The next stool.',
      'Comfort in the hour after eating.',
    ],
    actions: [
      'Do not change foods today.',
      'A calm leash walk after the meal. Skip rough play if the belly seems off.',
      HARNESS_ACTION,
    ],
    cards: [
      plan(
        'gut-balance',
        'Gut balance',
        'Meal notes and a calm walk. No new food from this screen.',
        'gut-balance'
      ),
    ],
    foods: foodsFor('gut-balance'),
  },
  {
    slug: 'heart-strong',
    specShort: 'Heart & Vitals',
    seen: 'Tiring on a usual walk, or hard breathing after rest',
    pamphletTitle: 'Energy on a usual walk',
    photoNote: 'Note how far you got and how long breathing took to settle.',
    includesWalk: true,
    saveGaitVideo: false,
    monitor: [
      'How far along a usual route before they slow down.',
      'Breathing one minute after you stop.',
      'Interest in food and in you.',
    ],
    actions: [
      'Shorter and slower than usual.',
      HARNESS_ACTION,
      'Stop the walk if breathing stays hard after a minute of rest. That visit belongs on the red banner.',
    ],
    cards: [
      plan(
        'heart-strong',
        'Heart Strong',
        'Walk notes and meal size. This page does not name a heart product.',
        'heart-strong'
      ),
    ],
    foods: foodsFor('heart-strong'),
  },
  {
    slug: 'liver-kidney-detox',
    specShort: 'Liver & Kidney',
    seen: 'Thirst, appetite, energy, and how the coat looks',
    pamphletTitle: 'Thirst, appetite, and energy',
    photoNote: 'Note water, meals, and whether the coat looks duller than last week.',
    includesWalk: true,
    saveGaitVideo: false,
    monitor: [
      'How often they drink.',
      'Whether the bowl was finished.',
      'Energy on a short familiar walk.',
    ],
    actions: [
      'Keep the usual food and fresh water. Do not add a detox product from this screen.',
      'A short familiar walk.',
      HARNESS_ACTION,
    ],
    cards: [
      plan(
        'liver-kidney',
        'Daily rhythm',
        'Water, meals, and a short walk. No detox product from this page.',
        'liver-kidney-detox'
      ),
    ],
    foods: foodsFor('liver-kidney-detox'),
  },
  {
    slug: 'patriot-immune',
    specShort: 'Immune Vitality',
    seen: 'Energy, appetite, play, and sleep',
    pamphletTitle: 'Energy, appetite, play, and sleep',
    photoNote: 'Write what was different today: the walk, the meal, or the nap.',
    includesWalk: true,
    saveGaitVideo: false,
    monitor: [
      'Appetite at the usual meals.',
      'How long the usual walk lasted.',
      'Whether sleep looked like a normal day.',
    ],
    actions: [
      'Same food and fresh water.',
      'The usual walk, shortened if they tire early.',
      HARNESS_ACTION,
    ],
    cards: [
      plan(
        'patriot-immune',
        'Daily care',
        'Food, a walk, and a note. This page does not name an immune product.',
        'patriot-immune'
      ),
    ],
    foods: foodsFor('patriot-immune'),
  },
];

const BY_SLUG = Object.fromEntries(CARE_FORMATS.map((care) => [care.slug, care]));
const BY_SPEC = Object.fromEntries(CARE_FORMATS.map((care) => [care.specShort, care]));

BY_SPEC['Wellness Baseline'] = BY_SLUG['patriot-immune']!;

export function careForSlug(slug: string): CareFormat | null {
  return BY_SLUG[slug] ?? null;
}

export function careForSpec(specShort?: string | null): CareFormat | null {
  if (!specShort) return null;
  return BY_SPEC[specShort] ?? null;
}

const FINDING_BLOCK =
  /dysplas|cancer|carcinoma|disease|diagnos|arthrit|failure|infection|allerg|murmur|pyoderma|cataract|glaucoma|seizure|tumor|cystitis|pancreat/i;

export function visibleFindings(lines: string[] | undefined): string[] {
  return (lines ?? []).map((line) => line.trim()).filter((line) => line && !FINDING_BLOCK.test(line));
}
