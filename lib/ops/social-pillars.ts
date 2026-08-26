/**
 * SuperBud content pillars for Freedom Paws social / production studio.
 * CTA paths are app-relative; full URLs use NEXT_PUBLIC_APP_URL when present.
 */

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook';

export type SocialPostStatus =
  | 'draft'
  | 'needs_approval'
  | 'approved'
  | 'scheduled'
  | 'posted'
  | 'failed'
  | 'archived';

export type SocialPillarId =
  | 'adoption_tn'
  | 'freedom_paws_id'
  | 'diagnostics'
  | 'mypets_vault'
  | 'photobooth'
  | 'wellness'
  | 'token_shop'
  | 'mission';

export type ProductionToolId =
  | 'chatgpt'
  | 'claude'
  | 'canva'
  | 'capcut'
  | 'runway'
  | 'elevenlabs'
  | 'buffer'
  | 'descript';

export type SocialPillar = {
  id: SocialPillarId;
  label: string;
  description: string;
  ctaPath: string;
  defaultPlatforms: SocialPlatform[];
  hookIdeas: string[];
};

export type ProductionTool = {
  id: ProductionToolId;
  name: string;
  role: string;
  url: string;
  whenToUse: string;
};

export const SUPERBUD_ASSET = '/images/brand/superbud.png';
export const SUPERBUD_HERO = '/images/superbud-hero.png';

export const SOCIAL_PILLARS: SocialPillar[] = [
  {
    id: 'adoption_tn',
    label: 'Adoption Network · TN',
    description: 'Adoptable dogs and partner shelters in the Tennessee pilot.',
    ctaPath: '/adopt/tn',
    defaultPlatforms: ['instagram', 'tiktok', 'facebook'],
    hookIdeas: [
      'SuperBud introduces a TN shelter partner looking for forever homes.',
      'Meet this week’s adoptable dogs — tap to browse live listings.',
      'Municipal + private rescues, one Freedom Paws directory.',
    ],
  },
  {
    id: 'freedom_paws_id',
    label: 'Freedom Paws ID',
    description: 'Biometric enroll, found-dog intake, and reunion tools.',
    ctaPath: '/id',
    defaultPlatforms: ['instagram', 'tiktok', 'youtube'],
    hookIdeas: [
      'SuperBud explains why a Freedom Paws ID beats a tag that falls off.',
      '30-second enroll teaser → full wizard in the app.',
      'Found a dog? Shelter intake starts at /id/found.',
    ],
  },
  {
    id: 'diagnostics',
    label: 'ViT Diagnostics',
    description: 'Visual wellness scans — education first, not a diagnosis.',
    ctaPath: '/diagnostics',
    defaultPlatforms: ['instagram', 'tiktok', 'youtube'],
    hookIdeas: [
      'SuperBud demos a calm scan flow and wellness-first next steps.',
      'See → learn → protocol — always “not a veterinary diagnosis.”',
      'From scan results into Safe Picks and partner education.',
    ],
  },
  {
    id: 'mypets_vault',
    label: 'My Pets Vault',
    description: 'Records, notes, and history for every pet profile.',
    ctaPath: '/mypets',
    defaultPlatforms: ['instagram', 'facebook'],
    hookIdeas: [
      'Keep vaccines and daily notes where SuperBud can help you stay organized.',
      'One vault per pet — ready for travel, sitters, and vets.',
    ],
  },
  {
    id: 'photobooth',
    label: 'Photo Booth',
    description: 'Fun portraits, SuperBud scenes, shareable keepsakes.',
    ctaPath: '/photobooth',
    defaultPlatforms: ['instagram', 'tiktok'],
    hookIdeas: [
      'Drop your dog into a SuperBud hero scene in Photo Booth.',
      'Holiday props + wellness warrior backgrounds — share with friends.',
    ],
  },
  {
    id: 'wellness',
    label: 'Wellness Partners',
    description: 'Insurance & telehealth education with FP standards.',
    ctaPath: '/wellness',
    defaultPlatforms: ['instagram', 'facebook', 'youtube'],
    hookIdeas: [
      'SuperBud walks through wellness-first partner standards.',
      'Lost-dog + urgent-care coverage education (disclosed affiliates).',
    ],
  },
  {
    id: 'token_shop',
    label: 'Token Shop',
    description: 'Protocol unlocks and shop CTAs.',
    ctaPath: '/token-shop',
    defaultPlatforms: ['instagram', 'tiktok'],
    hookIdeas: [
      'Unlock a SuperBud protocol pack — wellness rituals at home.',
    ],
  },
  {
    id: 'mission',
    label: 'Mission & Veterans',
    description: 'Buddy’s legacy, shelters, and community give-back.',
    ctaPath: '/waitlist',
    defaultPlatforms: ['instagram', 'facebook', 'youtube'],
    hookIdeas: [
      'Why SuperBud exists — honor Buddy, help shelters, serve veterans.',
      'Join the founding waitlist for Freedom Paws Wellness.',
    ],
  },
];

/** External production tools — opened from Ops studio (founder accounts). */
export const PRODUCTION_TOOLS: ProductionTool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    role: 'Script & caption drafts',
    url: 'https://chatgpt.com',
    whenToUse: 'Expand hooks into 15s/30s/60s scripts and platform captions.',
  },
  {
    id: 'claude',
    name: 'Claude',
    role: 'Brand-safe rewrite',
    url: 'https://claude.ai',
    whenToUse: 'Tone check: wellness-first, no vet diagnosis claims.',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    role: 'Voiceover',
    url: 'https://elevenlabs.io/app/speech-synthesis',
    whenToUse: 'Generate SuperBud VO from approved script (licensed voice).',
  },
  {
    id: 'runway',
    name: 'Runway',
    role: 'AI video / motion',
    url: 'https://app.runwayml.com',
    whenToUse: 'Motion from stills or B-roll using SuperBud reference image.',
  },
  {
    id: 'canva',
    name: 'Canva',
    role: 'Thumbnails & storyboards',
    url: 'https://www.canva.com',
    whenToUse: 'Frames, captions, brand templates, storyboard boards.',
  },
  {
    id: 'capcut',
    name: 'CapCut',
    role: 'Edit & captions',
    url: 'https://www.capcut.com',
    whenToUse: 'Cut vertical clips, burn captions, export 9:16.',
  },
  {
    id: 'descript',
    name: 'Descript',
    role: 'Edit by transcript',
    url: 'https://www.descript.com',
    whenToUse: 'Tighten VO and remove filler before CapCut polish.',
  },
  {
    id: 'buffer',
    name: 'Buffer',
    role: 'Schedule & distribute',
    url: 'https://buffer.com',
    whenToUse: 'After Ops Approve — schedule IG / TikTok / YouTube / FB.',
  },
];

export const DEFAULT_PRODUCTION_CHECKLIST = [
  { id: 'script', label: 'Approve script (wellness-first, no diagnosis claims)', done: false },
  { id: 'storyboard', label: 'Storyboard 3–5 frames in Canva', done: false },
  { id: 'voice', label: 'Generate VO in ElevenLabs from approved script', done: false },
  { id: 'visual', label: 'Create/motion visuals (Runway and/or CapCut + SuperBud still)', done: false },
  { id: 'captions', label: 'Burn captions + end card with CTA URL', done: false },
  { id: 'export', label: 'Export 9:16 MP4 (and 1:1 square if IG feed)', done: false },
  { id: 'approve', label: 'Mark Approved in Ops before Buffer', done: false },
  { id: 'buffer', label: 'Send to Buffer / schedule', done: false },
] as const;

export function appCtaUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://app.freedompawsinc.com').replace(
    /\/$/,
    ''
  );
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function getPillar(id: SocialPillarId): SocialPillar {
  const found = SOCIAL_PILLARS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown pillar: ${id}`);
  return found;
}
