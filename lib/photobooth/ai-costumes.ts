/** Holiday & hero AI costume definitions for Photo Booth (Replicate FLUX Kontext). */

export type AiCostumeId =
  | 'new-years'
  | 'st-patricks'
  | 'easter'
  | 'cinco-de-mayo'
  | 'july-4th'
  | 'veterans-army'
  | 'veterans-navy'
  | 'veterans-marines'
  | 'halloween'
  | 'thanksgiving'
  | 'christmas'
  | 'fireman'
  | 'policeman'
  | 'cowboy'
  | 'nurse'
  | 'diver'
  | 'angel';

export type AiCostume = {
  id: AiCostumeId;
  name: string;
  emoji: string;
  /** Matching scenic theme id when available */
  themeId: string;
  /** FLUX Kontext editing prompt — preserve pet identity */
  prompt: string;
};

const PRESERVE =
  "Keep the pet's exact face, breed, fur colors, body shape, pose and expression identical. Add costume accessories on the pet only. Replace the entire background with flat pure white (#FFFFFF) — no floor, rug, furniture, walls, or scenery. Pet only on white. Photorealistic pet photo. Do not blur or distort the pet.";

export const AI_COSTUMES: AiCostume[] = [
  {
    id: 'new-years',
    name: "New Year's",
    emoji: '🎊',
    themeId: 'holiday-new-years',
    prompt: `Add a festive New Year's Eve look: sparkly gold party hat, tiny champagne-colored bow tie or bandana, subtle confetti sparkle on fur edges. ${PRESERVE}`,
  },
  {
    id: 'st-patricks',
    name: "St. Patrick's Day",
    emoji: '☘️',
    themeId: 'holiday-st-patricks',
    prompt: `Dress this pet for St. Patrick's Day with a green top hat or shamrock bow tie, light green bandana with clover pattern. ${PRESERVE}`,
  },
  {
    id: 'easter',
    name: 'Easter',
    emoji: '🐣',
    themeId: 'holiday-easter',
    prompt: `Cute Easter costume: soft bunny ears headband, pastel yellow or pink bow, optional tiny basket accessory near paws. Spring pastel vibe on accessories only. ${PRESERVE}`,
  },
  {
    id: 'cinco-de-mayo',
    name: 'Cinco de Mayo',
    emoji: '🎺',
    themeId: 'holiday-cinco-de-mayo',
    prompt: `Festive Cinco de Mayo look: colorful sombrero sized for a pet, bright serape-style bandana in red green and white. ${PRESERVE}`,
  },
  {
    id: 'july-4th',
    name: '4th of July',
    emoji: '🎆',
    themeId: 'holiday-july-4th',
    prompt: `Patriotic Fourth of July costume: stars-and-stripes bandana, small Uncle Sam hat or red-white-blue bow. ${PRESERVE}`,
  },
  {
    id: 'veterans-army',
    name: 'Army (Veterans)',
    emoji: '🎖️',
    themeId: 'holiday-veterans',
    prompt: `Honor Veterans Day — Army tribute: olive drab camo bandana, small Army-style patrol cap fitted for a pet, respectful not cartoonish. ${PRESERVE}`,
  },
  {
    id: 'veterans-navy',
    name: 'Navy (Veterans)',
    emoji: '⚓',
    themeId: 'holiday-veterans',
    prompt: `Honor Veterans Day — Navy tribute: navy blue sailor-style hat or cracker jack collar scarf, gold anchor tag on bandana. ${PRESERVE}`,
  },
  {
    id: 'veterans-marines',
    name: 'Marines (Veterans)',
    emoji: '🦅',
    themeId: 'holiday-veterans',
    prompt: `Honor Veterans Day — Marines tribute: dress-blue inspired red collar or bandana, small Marine corps style cover hat for pet, respectful and dignified. ${PRESERVE}`,
  },
  {
    id: 'halloween',
    name: 'Halloween',
    emoji: '🎃',
    themeId: 'holiday-halloween',
    prompt: `Fun Halloween costume: cute witch hat or pumpkin bandana, optional tiny cape — playful not scary. ${PRESERVE}`,
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    emoji: '🦃',
    themeId: 'holiday-thanksgiving',
    prompt: `Thanksgiving pet costume: pilgrim-style hat or turkey-feather bandana in autumn orange and brown. ${PRESERVE}`,
  },
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    themeId: 'holiday-christmas',
    prompt: `Christmas costume: Santa hat, red and white scarf or reindeer antlers headband — cozy holiday look. ${PRESERVE}`,
  },
  {
    id: 'fireman',
    name: 'Firefighter',
    emoji: '🚒',
    themeId: 'lake-legend',
    prompt: `Complete firefighter costume on the pet: red turnout coat with reflective yellow-silver stripes, firefighter helmet with shield badge, professional photoreal K-9 style. ${PRESERVE}`,
  },
  {
    id: 'policeman',
    name: 'Police Officer',
    emoji: '👮',
    themeId: 'lake-legend',
    prompt: `Complete police officer uniform on the pet: navy police cap, navy uniform shirt with badge, duty belt with holster and sidearm prop — photoreal costume sized for a dog or cat. ${PRESERVE}`,
  },
  {
    id: 'cowboy',
    name: 'Cowboy',
    emoji: '🤠',
    themeId: 'lake-legend',
    prompt: `Complete western cowboy costume: brown cowboy hat, red bandana, leather vest or chaps, cowboy boots on paws if visible — photoreal rodeo style. ${PRESERVE}`,
  },
  {
    id: 'nurse',
    name: 'Nurse',
    emoji: '👩‍⚕️',
    themeId: 'wellness-warrior',
    prompt: `Complete nurse costume: white nurse cap with cross emblem, light blue scrubs or white nurse dress, stethoscope prop around neck — caring medical look, photoreal. ${PRESERVE}`,
  },
  {
    id: 'diver',
    name: 'Scuba Diver',
    emoji: '🤿',
    themeId: 'ocean-boat',
    prompt: `Complete scuba diver costume: black wetsuit, diving mask and snorkel on face, swim fins on paws if visible — photoreal underwater adventurer look. ${PRESERVE}`,
  },
  {
    id: 'angel',
    name: 'Angel',
    emoji: '👼',
    themeId: 'heaven-gates',
    prompt: `Complete angel costume: large white feather wings spread behind the pet, glowing golden halo above head, soft white satin ribbon — heavenly photoreal look. ${PRESERVE}`,
  },
];

export type AiCostumeGroup = {
  label: string;
  costumeIds: AiCostumeId[];
};

export const AI_COSTUME_GROUPS: AiCostumeGroup[] = [
  { label: 'Winter & New Year', costumeIds: ['new-years', 'christmas'] },
  { label: 'Spring', costumeIds: ['st-patricks', 'easter', 'cinco-de-mayo'] },
  { label: 'Summer & Patriot', costumeIds: ['july-4th', 'veterans-army', 'veterans-navy', 'veterans-marines'] },
  { label: 'Fall', costumeIds: ['halloween', 'thanksgiving'] },
  { label: 'Heroes & Roles', costumeIds: ['fireman', 'policeman', 'nurse', 'diver', 'cowboy'] },
  { label: 'Heaven & Spirit', costumeIds: ['angel'] },
];

export function getAiCostume(id: string): AiCostume | undefined {
  return AI_COSTUMES.find((c) => c.id === id);
}

export function isAiCostumeId(id: string): id is AiCostumeId {
  return AI_COSTUMES.some((c) => c.id === id);
}
