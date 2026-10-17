import type { SocialPillarId, SocialPlatform } from '@/lib/ops/social-pillars';

export type StudioSeat = 'fact' | 'bud' | 'echo' | 'forge' | 'lex';
export type StudioKind = 'superbud_video' | 'general';
export type StudioStatus =
  | 'research'
  | 'script'
  | 'rendering'
  | 'watch'
  | 'queued'
  | 'done'
  | 'hold';

export type StudioTopic = {
  code: string;
  title: string;
  teach: string;
  doNotSay: string;
  ctaPath: string;
  pillar: SocialPillarId;
  costume: string;
};

/** Rows taken from the locked SuperBud topic catalog. Education and promos only. */
export const STUDIO_TOPICS: StudioTopic[] = [
  {
    code: 'HA-01',
    title: 'Watch how your dog walks',
    teach:
      'A change in stride, a limp that comes and goes, or reluctance on stairs is worth writing down and calling your vet.',
    doNotSay: 'The app detects gait asymmetry.',
    ctaPath: '/diagnostics',
    pillar: 'diagnostics',
    costume: 'White coat, locked plate',
  },
  {
    code: 'HA-02',
    title: 'Watch how your dog eats',
    teach:
      'Skipping a meal, guarding the bowl, or dropping food can be the first change you notice. Note it. Call your vet if it repeats.',
    doNotSay: 'A cause, a disease name as a conclusion, or a supplement as the fix.',
    ctaPath: '/diagnostics',
    pillar: 'diagnostics',
    costume: 'White coat, locked plate',
  },
  {
    code: 'HA-05',
    title: 'Skin and coat you can see',
    teach:
      'New redness, bald patches, a dull coat, or nonstop scratching gets a photo and a vet call.',
    doNotSay: 'The app reads liver markers from the coat.',
    ctaPath: '/diagnostics',
    pillar: 'diagnostics',
    costume: 'White coat, locked plate',
  },
  {
    code: 'HA-16',
    title: 'What the wellness check-in is',
    teach:
      'A Freedom Paws check-in helps you notice and describe changes. It does not diagnose, prescribe, or replace your vet.',
    doNotSay: 'AI vet, detects disease, replaces your veterinarian.',
    ctaPath: '/diagnostics',
    pillar: 'diagnostics',
    costume: 'White coat, locked plate',
  },
  {
    code: 'HA-17',
    title: 'What to write down before the visit',
    teach:
      'When it started, how often, what you saw, and a short phone video of the walk or the symptom. Bring that, not a theory.',
    doNotSay: 'Coaching the owner to argue with the vet.',
    ctaPath: '/diagnostics',
    pillar: 'diagnostics',
    costume: 'White coat, locked plate',
  },
  {
    code: 'PR-PB',
    title: 'Photo Booth',
    teach: 'SuperBud invites the owner to take a Photo Booth picture with their dog and share it.',
    doNotSay: 'The booth diagnoses, reads health, or sells a product.',
    ctaPath: '/photobooth',
    pillar: 'photobooth',
    costume: 'Host cape. Show the real booth screen.',
  },
  {
    code: 'PR-ID',
    title: 'Freedom Paws ID',
    teach:
      'Enroll a dog so a found-dog report can be reviewed by a person before anyone contacts an owner.',
    doNotSay: 'Guaranteed reunion, match live nationally, or a government license.',
    ctaPath: '/id/enroll',
    pillar: 'freedom_paws_id',
    costume: 'Host cape',
  },
  {
    code: 'PR-AN',
    title: 'Adoption Network',
    teach:
      'The Tennessee pilot lists adoptable dogs from partner shelters. Freedom Paws is not the shelter.',
    doNotSay: 'Adoption fees, a reunion promise, or a partnership that is only an outreach target.',
    ctaPath: '/adopt/tn',
    pillar: 'adoption_tn',
    costume: 'Host cape',
  },
];

export const STUDIO_SEATS: { id: StudioSeat; label: string }[] = [
  { id: 'fact', label: 'FACT' },
  { id: 'bud', label: 'BUD' },
  { id: 'echo', label: 'ECHO' },
  { id: 'forge', label: 'FORGE' },
  { id: 'lex', label: 'LEX' },
];

export const STUDIO_STATUS_LABEL: Record<StudioStatus, string> = {
  research: 'Research',
  script: 'Script',
  rendering: 'Rendering',
  watch: 'Your watch',
  queued: 'Queued',
  done: 'Done',
  hold: 'Hold',
};

export const LOCKED_VOICE_ID = '99s7C3P60wz7zQFwG3Ww';
export const LOCKED_VOICE_NAME = 'SuperBud-FP-Designed';
export const LOCKED_STILL_RELATIVE = 'docs/brand/SuperBud-Master/frames/SB-HOST-FRONT-CANON.png';

export const WELLNESS_DISCLAIMER =
  'SuperBud and Freedom Paws provide general pet wellness education only. This is not veterinary advice and not a diagnosis or treatment plan. Always consult a licensed veterinarian, or a holistic veterinarian, for the individual dog.';

export const SPOKEN_CLOSER =
  'This is general pet wellness education, not a veterinary diagnosis. If something seems different, call your own veterinarian.';

export function getStudioTopic(code: string): StudioTopic | undefined {
  return STUDIO_TOPICS.find((topic) => topic.code === code);
}

export function isSocialPlatform(value: string): value is SocialPlatform {
  return value === 'instagram' || value === 'tiktok' || value === 'youtube' || value === 'facebook';
}

export type StudioJob = {
  id: string;
  kind: StudioKind;
  seat: StudioSeat;
  status: StudioStatus;
  title: string;
  catalogCode: string | null;
  pillar: string | null;
  platform: string;
  ctaPath: string;
  factCard: string;
  script: string;
  doNotSay: string;
  echoCaption: string;
  echoArticle: string;
  echoAds: string[];
  prompt: string;
  audioUrl: string | null;
  audioAssetId: string | null;
  renderedScript: string | null;
  videoUrl: string | null;
  heygenVideoId: string | null;
  socialPostId: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudioKeyStatus = {
  elevenlabs: boolean;
  heygen: boolean;
  draftModel: boolean;
};
