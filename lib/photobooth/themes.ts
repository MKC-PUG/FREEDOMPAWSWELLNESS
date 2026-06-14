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
  /** Image under /public — .png or .jpg */
  background: string;
  /** Fallback if primary background file missing */
  backgroundFallback?: string;
  stickers: StickerPlacement[];
};

const BG = (file: string) => `/images/photobooth/backgrounds/${file}`;
const ST = (file: string) => `/images/photobooth/stickers/${file}`;

/** Default single-pet scenic theme — never Me & My Pup until user taps it. */
export const DEFAULT_PHOTO_BOOTH_THEME_ID = 'lake-legend';

const SCENIC_THEMES: PhotoBoothTheme[] = [
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
    id: 'snow-mountain',
    name: 'Snowy Mountain',
    emoji: '🏔️',
    background: BG('bg-snow-mountain.png'),
    stickers: [],
  },
  {
    id: 'tropical-beach',
    name: 'Tropical Beach',
    emoji: '🏝️',
    background: BG('bg-tropical-beach.png'),
    stickers: [],
  },
  {
    id: 'patriot-pup',
    name: 'Patriot Pup',
    emoji: '🇺🇸',
    background: BG('bg-patriot-pup.png'),
    stickers: [],
  },
  {
    id: 'hollywood-star',
    name: 'Hollywood Star',
    emoji: '⭐',
    background: BG('bg-hollywood-star.png'),
    stickers: [],
  },
  {
    id: 'wellness-warrior',
    name: 'Wellness Warrior',
    emoji: '💚',
    background: BG('bg-wellness-warrior.png'),
    stickers: [],
  },
  {
    id: 'birthday-bash',
    name: 'Birthday Bash',
    emoji: '🎉',
    background: BG('bg-birthday-bash.png'),
    stickers: [],
  },
];

/**
 * Holiday backgrounds — drop JPGs in /public/images/photobooth/backgrounds/.
 * Until files exist, canvas-drawn gradients still render (see draw-theme-background.ts).
 */
const HOLIDAY_THEMES: PhotoBoothTheme[] = [
  {
    id: 'holiday-new-years',
    name: "New Year's",
    emoji: '🎊',
    background: BG('bg-holiday-new-years.jpg'),
    stickers: [],
  },
  {
    id: 'holiday-st-patricks',
    name: "St. Patrick's",
    emoji: '☘️',
    background: BG('bg-holiday-st-patricks.jpg'),
    stickers: [],
  },
  {
    id: 'holiday-easter',
    name: 'Easter',
    emoji: '🐣',
    background: BG('bg-holiday-easter.jpg'),
    stickers: [],
  },
  {
    id: 'holiday-cinco-de-mayo',
    name: 'Cinco de Mayo',
    emoji: '🎺',
    background: BG('bg-holiday-cinco-de-mayo.jpg'),
    stickers: [],
  },
  {
    id: 'holiday-july-4th',
    name: '4th of July',
    emoji: '🎆',
    background: BG('bg-holiday-july-4th.jpg'),
    stickers: [],
  },
  {
    id: 'holiday-veterans',
    name: 'Veterans Day',
    emoji: '🎖️',
    background: BG('bg-holiday-veterans.jpg'),
    stickers: [],
  },
  {
    id: 'holiday-halloween',
    name: 'Halloween',
    emoji: '🎃',
    background: BG('bg-holiday-halloween.jpg'),
    stickers: [],
  },
  {
    id: 'holiday-thanksgiving',
    name: 'Thanksgiving',
    emoji: '🦃',
    background: BG('bg-holiday-thanksgiving.jpg'),
    stickers: [],
  },
  {
    id: 'holiday-christmas',
    name: 'Christmas',
    emoji: '🎄',
    background: BG('bg-holiday-christmas.jpg'),
    backgroundFallback: BG('bg-holiday-christmas-trees.jpg'),
    stickers: [],
  },
];

/** Real-photo adventures & US landmarks — same drop-in folder as holidays. */
const LANDMARK_THEMES: PhotoBoothTheme[] = [
  {
    id: 'ocean-boat',
    name: 'Ocean Adventure',
    emoji: '⛵',
    background: BG('bg-ocean-boat.jpg'),
    stickers: [],
  },
  {
    id: 'landmark-golden-gate',
    name: 'Golden Gate',
    emoji: '🌉',
    background: BG('bg-landmark-golden-gate.jpg'),
    stickers: [],
  },
  {
    id: 'landmark-grand-canyon',
    name: 'Grand Canyon',
    emoji: '🏜️',
    background: BG('bg-landmark-grand-canyon.jpg'),
    stickers: [],
  },
  {
    id: 'landmark-rushmore',
    name: 'Mount Rushmore',
    emoji: '🗿',
    background: BG('bg-landmark-rushmore.jpg'),
    stickers: [],
  },
  {
    id: 'landmark-national-mall',
    name: 'National Mall',
    emoji: '🏛️',
    background: BG('bg-landmark-national-mall.jpg'),
    stickers: [],
  },
];

const EDITOR_THEMES: PhotoBoothTheme[] = [
  {
    id: 'me-and-my-pup',
    name: 'Me & My Pup',
    emoji: '💞',
    background: '',
    stickers: [],
  },
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
];

/** Scenic + landmarks + holidays first; duo / frame / checkerboard last. */
export const PHOTO_BOOTH_THEMES: PhotoBoothTheme[] = [
  ...SCENIC_THEMES,
  ...LANDMARK_THEMES,
  ...HOLIDAY_THEMES,
  ...EDITOR_THEMES,
];

/**
 * Transparent PNG photo props — add files under /public/images/photobooth/stickers/.
 * Shown first in the accessory drawer; hidden from list until PNG exists (drawer filters).
 */
export const PHOTO_PROP_ACCESSORIES: StickerPlacement[] = [
  { src: ST('prop-santa-hat.png'), label: 'Santa hat', x: 0.5, y: 0.18, scale: 0.22 },
  { src: ST('prop-cowboy-hat.png'), label: 'Cowboy hat', x: 0.5, y: 0.2, scale: 0.22 },
  { src: ST('prop-bandana-usa.png'), label: 'USA bandana', x: 0.5, y: 0.62, scale: 0.2 },
  { src: ST('prop-bandana-red.png'), label: 'Red bandana', x: 0.5, y: 0.62, scale: 0.2 },
  { src: ST('prop-sunglasses.png'), label: 'Sunglasses', x: 0.5, y: 0.32, scale: 0.22 },
  { src: ST('prop-bowtie.png'), label: 'Bow tie', x: 0.5, y: 0.55, scale: 0.16 },
  { src: ST('prop-scarf-plaid.png'), label: 'Plaid scarf', x: 0.5, y: 0.58, scale: 0.22 },
  { src: ST('prop-flower-lei.png'), label: 'Flower lei', x: 0.5, y: 0.58, scale: 0.24 },
  { src: ST('prop-pilot-goggles.png'), label: 'Aviator goggles', x: 0.5, y: 0.3, scale: 0.22 },
  { src: ST('prop-cape-red.png'), label: 'Hero cape', x: 0.5, y: 0.55, scale: 0.55 },
];

/** Cartoon SVG placeholders — replace any item by adding a PNG with the same base name. */
export const CARTOON_ACCESSORY_STICKERS: StickerPlacement[] = [
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

/** Photo props first, then cartoon — drawer may filter to available files only. */
export const ACCESSORY_STICKERS: StickerPlacement[] = [
  ...PHOTO_PROP_ACCESSORIES,
  ...CARTOON_ACCESSORY_STICKERS,
];

/** @deprecated Use ACCESSORY_STICKERS */
export const EXTRA_STICKERS = ACCESSORY_STICKERS;

/** Scenic backgrounds eligible for Surprise Me (excludes editor-only modes). */
export const SURPRISE_THEME_IDS = [
  'superbud-hero',
  'lake-legend',
  'snow-mountain',
  'tropical-beach',
  'patriot-pup',
  'hollywood-star',
  'wellness-warrior',
  'birthday-bash',
] as const;

export function pickRandomSurpriseThemeId(): string {
  const pool = SURPRISE_THEME_IDS;
  return pool[Math.floor(Math.random() * pool.length)] ?? 'superbud-hero';
}

export function getTheme(id: string): PhotoBoothTheme {
  return (
    PHOTO_BOOTH_THEMES.find((t) => t.id === id) ??
    PHOTO_BOOTH_THEMES.find((t) => t.id === DEFAULT_PHOTO_BOOTH_THEME_ID) ??
    PHOTO_BOOTH_THEMES[0]
  );
}

/** True when theme uses a PNG/JPG file from /public (not canvas-drawn gradient). */
export function themeUsesImageBackground(themeOrId: PhotoBoothTheme | string): boolean {
  const theme = typeof themeOrId === 'string' ? getTheme(themeOrId) : themeOrId;
  return Boolean(theme.background?.trim());
}

/** Candidate URLs for a background (primary, then fallback). Supports .png and .jpg */
export function backgroundCandidates(theme: PhotoBoothTheme): string[] {
  return [theme.background, theme.backgroundFallback].filter(Boolean) as string[];
}

/** Candidate URLs for a sticker (.png art, then .svg placeholder). */
export function stickerCandidates(pngPath: string): string[] {
  const base = pngPath.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const svgPath = `${base}.svg`;
  const paths = [pngPath];
  if (svgPath !== pngPath) paths.push(svgPath);
  return paths;
}
