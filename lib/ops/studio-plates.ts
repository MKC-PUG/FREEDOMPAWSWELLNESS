import { atHomeComfort } from '@/lib/ops/studio-research';

export type StudioBackground = {
  id: string;
  label: string;
  kind: 'locked' | 'color' | 'image';
  color: string;
  path?: string;
};

export type StudioMotion = {
  id: string;
  label: string;
  prompt: string;
};

const PRESERVE =
  'Preserve the pug face, grey mask, ears, muzzle, cape, and shield exactly. Do not change the costume or the face.';

/** Plates HeyGen can place behind the locked still. The first keeps the sky already in the photo. */
export const STUDIO_BACKGROUNDS: StudioBackground[] = [
  { id: 'locked', label: 'Keep this picture', kind: 'locked', color: '#7EB6E6' },
  { id: 'navy', label: 'Freedom navy', kind: 'color', color: '#0A1428' },
  {
    id: 'lake',
    label: 'Lake Legend',
    kind: 'image',
    color: '#1B3A4B',
    path: '/images/photobooth/backgrounds/bg-lake-legend.jpg',
  },
  {
    id: 'wellness',
    label: 'Wellness Warrior',
    kind: 'image',
    color: '#1E3A2F',
    path: '/images/photobooth/backgrounds/bg-wellness-warrior.png',
  },
  {
    id: 'patriot',
    label: 'Patriot Pup',
    kind: 'image',
    color: '#1A2744',
    path: '/images/photobooth/backgrounds/bg-patriot-pup.png',
  },
  {
    id: 'hero',
    label: 'SuperBud Hero',
    kind: 'image',
    color: '#10243F',
    path: '/images/photobooth/backgrounds/bg-superbud-hero.png',
  },
  {
    id: 'snow',
    label: 'Snowy Mountain',
    kind: 'image',
    color: '#8AA4B5',
    path: '/images/photobooth/backgrounds/bg-snow-mountain.png',
  },
];

export const STUDIO_MOTIONS: StudioMotion[] = [
  { id: 'subtle', label: 'Subtle speaking', prompt: `Subtle speaking motion. ${PRESERVE}` },
  { id: 'nod', label: 'Small nod', prompt: `A small nod while speaking. ${PRESERVE}` },
  { id: 'tilt', label: 'Slight head tilt', prompt: `A slight head tilt while speaking. ${PRESERVE}` },
];

export type StoryboardFields = {
  script: string;
  onScreenText: string;
  backgroundId: string;
  motionId: string;
};

export function backgroundById(id: string | undefined): StudioBackground {
  return STUDIO_BACKGROUNDS.find((plate) => plate.id === id) ?? STUDIO_BACKGROUNDS[0];
}

export function motionById(id: string | undefined): StudioMotion {
  return STUDIO_MOTIONS.find((motion) => motion.id === id) ?? STUDIO_MOTIONS[0];
}

export function suggestBackgroundId(text: string): string {
  const topic = text.toLowerCase();
  if (/hind|hip|dysplas|arthritis|brace/.test(topic)) return 'navy';
  if (/harness|walk|lake|gait/.test(topic)) return 'lake';
  if (/dental|chew|teeth|rawhide/.test(topic)) return 'hero';
  if (/itch|skin|floor|clean|coat/.test(topic)) return 'wellness';
  if (/joint|topper|nutrition/.test(topic)) return 'navy';
  if (/patriot|flag|adopt/.test(topic)) return 'patriot';
  return 'locked';
}

export function shortOnScreenText(title: string): string {
  const clean = title.replace(/^[A-Z0-9-]+ · /, '').trim();
  return clean.length > 72 ? `${clean.slice(0, 69)}…` : clean;
}

export function draftTopicScript(title: string, extra = ''): string {
  const step = atHomeComfort(`${title} ${extra}`);
  return `Owners can notice this at home. ${step}`;
}

export function storyboardFor(
  title: string,
  extra = '',
  existing?: Partial<StoryboardFields>
): StoryboardFields {
  return {
    script: existing?.script?.trim() || draftTopicScript(title, extra),
    onScreenText: existing?.onScreenText?.trim() || shortOnScreenText(title),
    backgroundId: backgroundById(existing?.backgroundId || suggestBackgroundId(`${title} ${extra}`)).id,
    motionId: motionById(existing?.motionId).id,
  };
}
