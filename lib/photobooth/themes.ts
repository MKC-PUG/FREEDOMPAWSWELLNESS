/** Normalized placement (0–1) on canvas width/height. */

export type StickerPlacement = {
  /** Path under /public, e.g. /images/photobooth/stickers/sticker-glasses-cool.png */
  src: string;
  label: string;
  /** Center X as fraction of canvas width */
  x: number;
  /** Center Y as fraction of canvas height */
  y: number;
  /** Width as fraction of canvas width */
  scale: number;
};

export type PhotoBoothTheme = {
  id: string;
  name: string;
  emoji: string;
  background: string;
  /** Fallback if primary background file missing */
  backgroundFallback?: string;
  /** Themes are backgrounds only — members add accessories manually */
  stickers: StickerPlacement[];
};

const BG = (file: string) => `/images/photobooth/backgrounds/${file}`;
const ST = (file: string) => `/images/photobooth/stickers/${file}`;

export const PHOTO_BOOTH_THEMES: PhotoBoothTheme[] = [
  {
    id: 'frame-only',
    name: 'Frame Only',
    emoji: '🖼️',
    background: '',
    stickers: [],
  },
  {
    id: 'accessories-only',
    name: 'No Background',
    emoji: '✨',
    background: '',
    stickers: [],
  },
  {
    id: 'superbud-hero',
    name: 'SuperBud Hero',
    emoji: '🦸',
    background: BG('bg-superbud-hero.png'),
    backgroundFallback: '/images/superbud-hero.png',
    stickers: [],
  },
  {
    id: 'lake-legend',
    name: 'Lake Legend',
    emoji: '🌅',
    background: BG('bg-lake-legend.jpg'),
    backgroundFallback: '/images/tn-lake-bg.jpg',
    stickers: [],
  },
  {
    id: 'patriot-pup',
    name: 'Patriot Pup',
    emoji: '🇺🇸',
    background: '',
    stickers: [],
  },
  {
    id: 'hollywood-star',
    name: 'Hollywood Star',
    emoji: '⭐',
    background: '',
    stickers: [],
  },
  {
    id: 'wellness-warrior',
    name: 'Wellness Warrior',
    emoji: '💚',
    background: '',
    stickers: [],
  },
  {
    id: 'birthday-bash',
    name: 'Birthday Bash',
    emoji: '🎉',
    background: '',
    stickers: [],
  },
];

/** Tap-to-add accessories — user places, resizes, and removes on canvas */
export const ACCESSORY_STICKERS: StickerPlacement[] = [
  { src: ST('sticker-cape-superbud.png'), label: 'Cape', x: 0.5, y: 0.55, scale: 0.55 },
  { src: ST('sticker-cape-patriotic.png'), label: 'Patriot cape', x: 0.5, y: 0.58, scale: 0.5 },
  { src: ST('sticker-hat-patriotic.png'), label: 'Patriot hat', x: 0.5, y: 0.22, scale: 0.24 },
  { src: ST('sticker-hat-party.png'), label: 'Party hat', x: 0.5, y: 0.2, scale: 0.22 },
  { src: ST('sticker-hat-cowboy.png'), label: 'Cowboy hat', x: 0.5, y: 0.2, scale: 0.22 },
  { src: ST('sticker-hat-crown.png'), label: 'Crown', x: 0.5, y: 0.18, scale: 0.2 },
  { src: ST('sticker-glasses-cool.png'), label: 'Shades', x: 0.5, y: 0.32, scale: 0.22 },
  { src: ST('sticker-glasses-star.png'), label: 'Star glasses', x: 0.5, y: 0.32, scale: 0.22 },
  { src: ST('sticker-glasses-heart.png'), label: 'Heart glasses', x: 0.5, y: 0.34, scale: 0.2 },
  { src: ST('sticker-bandana-red.png'), label: 'Bandana', x: 0.5, y: 0.62, scale: 0.2 },
  { src: ST('sticker-bow-pink.png'), label: 'Bow', x: 0.5, y: 0.28, scale: 0.14 },
  { src: ST('sticker-scarf-wellness.png'), label: 'Scarf', x: 0.5, y: 0.58, scale: 0.22 },
  { src: ST('sticker-medal-gold.png'), label: 'Medal', x: 0.75, y: 0.7, scale: 0.15 },
  { src: ST('sticker-sparkle.png'), label: 'Sparkle', x: 0.85, y: 0.2, scale: 0.12 },
];

/** @deprecated Use ACCESSORY_STICKERS */
export const EXTRA_STICKERS = ACCESSORY_STICKERS;

export function getTheme(id: string): PhotoBoothTheme {
  return PHOTO_BOOTH_THEMES.find((t) => t.id === id) ?? PHOTO_BOOTH_THEMES[0];
}

/** Candidate URLs for a background (primary, then fallback). */
export function backgroundCandidates(theme: PhotoBoothTheme): string[] {
  return [theme.background, theme.backgroundFallback].filter(Boolean) as string[];
}

/** Candidate URLs for a sticker (.png art, then .svg placeholder). */
export function stickerCandidates(pngPath: string): string[] {
  const svgPath = pngPath.replace(/\.png$/i, '.svg');
  return svgPath !== pngPath ? [pngPath, svgPath] : [pngPath];
}
