export type FrameStyleId = 'none' | 'walnut' | 'oak' | 'forest' | 'ocean' | 'sky' | 'black';

export type FrameStyle = {
  id: FrameStyleId;
  name: string;
  /** Preview swatch for picker */
  swatch: string;
};

export const FRAME_STYLES: FrameStyle[] = [
  { id: 'none', name: 'None', swatch: 'transparent' },
  { id: 'walnut', name: 'Walnut', swatch: '#5C4033' },
  { id: 'oak', name: 'Oak', swatch: '#A67B5B' },
  { id: 'forest', name: 'Forest', swatch: '#2F4F3E' },
  { id: 'ocean', name: 'Ocean', swatch: '#2A5F5A' },
  { id: 'sky', name: 'Sky', swatch: '#6B96AB' },
  { id: 'black', name: 'Black', swatch: '#1C1C1C' },
];

/** User-facing 0–1; maps to thin → thick frame on canvas. */
export const FRAME_WIDTH_MIN = 0.08;
export const FRAME_WIDTH_MAX = 1;

export function getFrameStyle(id: string): FrameStyle {
  return FRAME_STYLES.find((f) => f.id === id) ?? FRAME_STYLES[0];
}

export type PetRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function computePetRect(
  petImg: HTMLImageElement,
  cw: number,
  ch: number,
  maxWidthFrac = 0.85,
  maxHeightFrac = 0.88,
  centerY = 0.54
): PetRect {
  const iw = petImg.naturalWidth || petImg.width;
  const ih = petImg.naturalHeight || petImg.height;
  const maxW = cw * maxWidthFrac;
  const maxH = ch * maxHeightFrac;
  const scale = Math.min(maxW / iw, maxH / ih);
  const width = iw * scale;
  const height = ih * scale;
  const cx = cw / 2;
  const cy = ch * centerY;
  return {
    left: cx - width / 2,
    top: cy - height / 2,
    width,
    height,
  };
}

/** Frame thickness in canvas pixels from normalized slider value. */
export function frameThicknessPx(cw: number, ch: number, widthNorm: number): number {
  const t = Math.min(1, Math.max(0, widthNorm));
  const minDim = Math.min(cw, ch);
  return minDim * (0.022 + t * 0.13);
}

/** Cream mat between photo and frame. */
export function matPaddingPx(framePx: number): number {
  return Math.max(3, framePx * 0.18);
}
