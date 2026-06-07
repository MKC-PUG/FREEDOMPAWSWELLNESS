import {
  ACCESSORY_STICKERS,
  backgroundCandidates,
  PHOTO_BOOTH_THEMES,
  stickerCandidates,
} from './themes';

/** Warm browser cache for backgrounds + sticker art (non-blocking). */
export function preloadPhotoBoothAssets(): void {
  if (typeof window === 'undefined') return;
  const urls = new Set<string>();
  for (const theme of PHOTO_BOOTH_THEMES) {
    for (const url of backgroundCandidates(theme)) urls.add(url);
  }
  for (const sticker of ACCESSORY_STICKERS) {
    for (const url of stickerCandidates(sticker.src)) urls.add(url);
  }
  for (const url of urls) {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  }
}
