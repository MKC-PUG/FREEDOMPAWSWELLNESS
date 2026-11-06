export type OwnerPlan = {
  area: string;
  noticed: string;
  food: string;
  movement: string;
  training: string;
  call: string;
};

const CALL =
  'Call your own veterinarian if this continues, gets worse, or your dog is not otherwise bright. Blue gums, collapse, and severe breathing trouble need prompt attention.';

type AreaPlan = Pick<OwnerPlan, 'area' | 'food' | 'movement' | 'training'>;

const BY_SPEC: Record<string, AreaPlan> = {
  'Joint & Mobility': {
    area: 'Movement',
    food: 'Keep the same food today. Note appetite at each meal. Skip a new chew until you see how the next two days go.',
    movement: 'Use a shorter, slower walk. Note stairs, sofas, and any hesitation. Rest after the walk.',
    training: 'Practice one quiet settle on a mat after the walk. Five calm minutes counts.',
  },
  'Spine & Recovery': {
    area: 'Movement',
    food: 'Keep meals even through the day. Note whether your dog stands up easily after eating.',
    movement: 'Avoid jumping onto furniture today. Use a short leash walk on flat ground.',
    training: 'Reward a slow stand-up from a down. One session of a few repetitions.',
  },
  'Cognitive & Calm': {
    area: 'Rest and behavior',
    food: 'Feed at the usual times. Note pacing before or after the meal.',
    movement: 'One familiar walk, not a new long outing. Note whether your dog settles afterward.',
    training: 'A sniff scatter or a chew they already tolerate, then a settle in the same spot each evening.',
  },
  'Digestive Harmony': {
    area: 'Eating and stool',
    food: 'Do not change foods today. Note what went in the bowl, what was left, and the next stool.',
    movement: 'A calm leash walk after the meal. Skip rough play if the belly seems off.',
    training: 'Hand-feed a few bites of the usual food so you can watch chewing and swallowing.',
  },
  'Allergy & Respiratory': {
    area: 'Skin, coat, and comfort',
    food: 'Keep the current food. Note itching in the hour after eating. Do not add a new treat today.',
    movement: 'A normal walk unless breathing looks harder than usual. Note any cough on the way home.',
    training: 'Interrupt chewing at the paws with a known toy or a settle. Write down how long the itch lasted.',
  },
  'Dental & Oral': {
    area: 'Mouth care',
    food: 'Note dropped food, drool, and whether your dog prefers softer pieces of the same meal.',
    movement: 'A normal walk. The mouth, not the mileage, is what you are watching.',
    training: 'Offer a chew you already know they handle. Stop if they paw the mouth or drop it at once.',
  },
  'Eye & Vision': {
    area: 'Eyes',
    food: 'Keep meals the same. Note squinting while they eat.',
    movement: 'Walk a familiar route in good light. Note bumping, hesitation, or a new cloudiness you can see.',
    training: 'A short name-and-come in the house. You are watching comfort, not drilling a new skill.',
  },
  'Heart & Vitals': {
    area: 'Daily rhythm',
    food: 'Smaller, usual meals if your dog is otherwise bright. Note energy after eating.',
    movement: 'Short and slow. Stop if breathing stays hard after a minute of rest.',
    training: 'A quiet settle beside you. Skip exciting games today.',
  },
  'Liver & Kidney': {
    area: 'Daily rhythm',
    food: 'Keep the usual food and fresh water. Note thirst and appetite. Do not add a detox product from this screen.',
    movement: 'A short familiar walk. Note whether energy matches a normal day.',
    training: 'One calm rep of a skill they already know.',
  },
  'Immune Vitality': {
    area: 'Daily care',
    food: 'Same food, fresh water, and a note of appetite. One change at a time if you change anything later.',
    movement: 'The usual walk, shortened if your dog tires early.',
    training: 'A short play or settle they already enjoy. Write down what was different today.',
  },
  'Wellness Baseline': {
    area: 'Daily care',
    food: 'Write down the food, the amount, and whether the bowl was finished.',
    movement: 'Write down the walk: how long, and whether the stride looked like yesterday.',
    training: 'One five-minute rep from the training week: a settle, a come, or a chew-and-release.',
  },
};

const FALLBACK = BY_SPEC['Wellness Baseline'];

export function buildOwnerPlan(input: {
  specShort?: string | null;
  matchedTerms?: string[];
  visualFindings?: string[];
}): OwnerPlan {
  const areaPlan = (input.specShort && BY_SPEC[input.specShort]) || FALLBACK;
  const noticedParts = [
    ...(input.matchedTerms ?? []).slice(0, 4),
    ...(input.visualFindings ?? []).slice(0, 3),
  ].filter(Boolean);
  const noticed =
    noticedParts.length > 0
      ? noticedParts.join('; ')
      : 'What you typed, in your own words. Nothing on this card is a disease name.';
  return { ...areaPlan, noticed, call: CALL };
}
