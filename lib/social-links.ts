/** Update URLs here or set NEXT_PUBLIC_SOCIAL_* env vars on Vercel. */
export type SocialPlatform = 'x' | 'youtube' | 'instagram' | 'facebook';

export type SocialLink = {
  id: SocialPlatform;
  label: string;
  href: string;
};

const defaults: Record<SocialPlatform, string> = {
  x: 'https://x.com/FreedomPawsWellness',
  youtube: 'https://www.youtube.com/@FreedomPawsWellness',
  instagram: 'https://www.instagram.com/freedompawswellness',
  facebook: 'https://www.facebook.com/FreedomPawsWellness',
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'x',
    label: 'X',
    href: process.env.NEXT_PUBLIC_SOCIAL_X ?? defaults.x,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? defaults.youtube,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? defaults.instagram,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? defaults.facebook,
  },
];
