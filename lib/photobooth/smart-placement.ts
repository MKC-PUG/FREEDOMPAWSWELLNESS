import type { PetRect } from '@/lib/photobooth/frames';
import type { StickerPlacement } from '@/lib/photobooth/themes';

export type AccessoryZone = 'head' | 'neck' | 'body' | 'corner';

/** Map accessory label to pet body zone for smarter initial placement. */
export function accessoryZone(label: string): AccessoryZone {
  const l = label.toLowerCase();
  if (
    l.includes('hat') ||
    l.includes('helmet') ||
    l.includes('crown') ||
    l.includes('bow') ||
    l.includes('glass') ||
    l.includes('shade')
  ) {
    return 'head';
  }
  if (l.includes('bandana') || l.includes('scarf')) return 'neck';
  if (l.includes('sparkle')) return 'corner';
  if (l.includes('cape') || l.includes('medal')) return 'body';
  return 'body';
}

const ZONE_Y: Record<AccessoryZone, number> = {
  head: 0.2,
  neck: 0.38,
  body: 0.58,
  corner: 0.15,
};

const ZONE_SCALE: Record<AccessoryZone, number> = {
  head: 0.32,
  neck: 0.22,
  body: 0.48,
  corner: 0.14,
};

/**
 * Place accessory relative to the current pet bounding box (normalized 0–1 coords).
 * Falls back to catalog defaults when pet rect is unavailable.
 */
export function smartStickerPlacement(
  placement: StickerPlacement,
  petRect: PetRect | null,
  cw: number,
  ch: number
): StickerPlacement {
  if (!petRect || cw <= 0 || ch <= 0) return placement;

  const zone = accessoryZone(placement.label);
  const cx = (petRect.left + petRect.width / 2) / cw;
  const baseScale = (petRect.width / cw) * ZONE_SCALE[zone];

  if (zone === 'corner') {
    return {
      ...placement,
      x: Math.min(0.92, (petRect.left + petRect.width * 0.88) / cw),
      y: Math.max(0.08, (petRect.top + petRect.height * ZONE_Y.corner) / ch),
      scale: baseScale,
    };
  }

  return {
    ...placement,
    x: cx,
    y: (petRect.top + petRect.height * ZONE_Y[zone]) / ch,
    scale: baseScale,
  };
}
