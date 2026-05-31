import type { FrameStyleId, PetRect } from './frames';
import { frameThicknessPx, matPaddingPx } from './frames';

type RingRect = { outer: PetRect; mat: PetRect; photo: PetRect };

export function computeFrameRects(
  photo: PetRect,
  widthNorm: number,
  cw: number,
  ch: number
): { outer: PetRect; mat: PetRect; framePx: number; matPx: number } {
  const framePx = frameThicknessPx(cw, ch, widthNorm);
  const matPx = matPaddingPx(framePx);
  const mat: PetRect = {
    left: photo.left - matPx,
    top: photo.top - matPx,
    width: photo.width + matPx * 2,
    height: photo.height + matPx * 2,
  };
  const outer: PetRect = {
    left: mat.left - framePx,
    top: mat.top - framePx,
    width: mat.width + framePx * 2,
    height: mat.height + framePx * 2,
  };
  return { outer, mat, framePx, matPx };
}

function fillRect(ctx: CanvasRenderingContext2D, r: PetRect) {
  ctx.fillRect(r.left, r.top, r.width, r.height);
}

function strokeRect(ctx: CanvasRenderingContext2D, r: PetRect, color: string, lw = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.strokeRect(r.left + lw / 2, r.top + lw / 2, r.width - lw, r.height - lw);
}

/** Four opaque bars that form the frame ring (no hole-punch clip needed). */
function frameBands(outer: PetRect, mat: PetRect): PetRect[] {
  const { left: ol, top: ot, width: ow, height: oh } = outer;
  const { left: ml, top: mt, width: mw, height: mh } = mat;

  return [
    { left: ol, top: ot, width: ow, height: mt - ot },
    { left: ol, top: mt + mh, width: ow, height: ot + oh - (mt + mh) },
    { left: ol, top: mt, width: ml - ol, height: mh },
    { left: ml + mw, top: mt, width: ol + ow - (ml + mw), height: mh },
  ].filter((b) => b.width > 0.5 && b.height > 0.5);
}

function clipBand(ctx: CanvasRenderingContext2D, band: PetRect) {
  ctx.beginPath();
  ctx.rect(band.left, band.top, band.width, band.height);
  ctx.clip();
}

function forEachBand(
  ctx: CanvasRenderingContext2D,
  outer: PetRect,
  mat: PetRect,
  fn: (band: PetRect) => void
) {
  for (const band of frameBands(outer, mat)) {
    ctx.save();
    clipBand(ctx, band);
    fn(band);
    ctx.restore();
  }
}

/** Frame ring = outer minus mat area (drawn as filled rects). */
function fillFrameRing(ctx: CanvasRenderingContext2D, outer: PetRect, mat: PetRect) {
  const { left: ol, top: ot, width: ow, height: oh } = outer;
  const { left: ml, top: mt, width: mw, height: mh } = mat;

  ctx.fillRect(ol, ot, ow, mt - ot);
  ctx.fillRect(ol, mt + mh, ow, ot + oh - (mt + mh));
  ctx.fillRect(ol, mt, ml - ol, mh);
  ctx.fillRect(ml + mw, mt, ol + ow - (ml + mw), mh);
}

function drawWoodGrain(
  ctx: CanvasRenderingContext2D,
  outer: PetRect,
  mat: PetRect,
  base: string,
  mid: string,
  dark: string,
  light: string,
  grainDark: string,
  grainLight: string
) {
  ctx.save();
  ctx.globalAlpha = 1;

  const grad = ctx.createLinearGradient(outer.left, outer.top, outer.left, outer.top + outer.height);
  grad.addColorStop(0, light);
  grad.addColorStop(0.35, mid);
  grad.addColorStop(0.7, base);
  grad.addColorStop(1, dark);
  ctx.fillStyle = grad;
  fillFrameRing(ctx, outer, mat);

  forEachBand(ctx, outer, mat, (band) => {
    ctx.strokeStyle = grainDark;
    ctx.lineWidth = 1;
    const step = Math.max(3, band.height / 6);
    for (let y = band.top; y < band.top + band.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(band.left, y);
      ctx.lineTo(band.left + band.width, y);
      ctx.stroke();
    }
    ctx.strokeStyle = grainLight;
    for (let y = band.top + step / 2; y < band.top + band.height; y += step * 1.3) {
      ctx.beginPath();
      ctx.moveTo(band.left, y);
      ctx.lineTo(band.left + band.width, y);
      ctx.stroke();
    }

    const bevelH = Math.max(2, band.height * 0.35);
    ctx.fillStyle = light;
    ctx.fillRect(band.left, band.top, band.width, Math.min(bevelH, band.height));
    ctx.fillStyle = dark;
    ctx.fillRect(
      band.left,
      band.top + band.height - Math.min(bevelH, band.height),
      band.width,
      Math.min(bevelH, band.height)
    );
  });

  ctx.restore();
}

function drawSolidFrame(
  ctx: CanvasRenderingContext2D,
  outer: PetRect,
  mat: PetRect,
  base: string,
  highlight: string,
  shadow: string
) {
  ctx.save();
  ctx.globalAlpha = 1;

  ctx.fillStyle = base;
  fillFrameRing(ctx, outer, mat);

  forEachBand(ctx, outer, mat, (band) => {
    const bevelH = Math.max(2, band.height * 0.4);
    ctx.fillStyle = highlight;
    ctx.fillRect(band.left, band.top, band.width, Math.min(bevelH, band.height));
    ctx.fillStyle = shadow;
    ctx.fillRect(
      band.left,
      band.top + band.height - Math.min(bevelH, band.height),
      band.width,
      Math.min(bevelH, band.height)
    );
  });

  strokeRect(ctx, outer, '#000000', 1);
  strokeRect(ctx, mat, '#FFFFFF', 1);
  ctx.restore();
}

/** Opaque cream mat — drawn under the pet photo. */
export function drawFrameMat(ctx: CanvasRenderingContext2D, mat: PetRect) {
  ctx.save();
  ctx.globalAlpha = 1;
  const grad = ctx.createLinearGradient(mat.left, mat.top, mat.left, mat.top + mat.height);
  grad.addColorStop(0, '#F7F3EB');
  grad.addColorStop(1, '#EDE6D8');
  ctx.fillStyle = grad;
  fillRect(ctx, mat);
  strokeRect(ctx, mat, '#D4CBB8', 1);
  ctx.restore();
}

/** Opaque frame border — drawn on top of photo & stickers. */
export function drawFrameBorder(
  ctx: CanvasRenderingContext2D,
  outer: PetRect,
  mat: PetRect,
  styleId: FrameStyleId
) {
  if (styleId === 'none') return;

  switch (styleId) {
    case 'walnut':
      drawWoodGrain(
        ctx,
        outer,
        mat,
        '#4A3228',
        '#6B4A3E',
        '#3A251C',
        '#8B6550',
        '#3A251C',
        '#9A7558'
      );
      break;
    case 'oak':
      drawWoodGrain(
        ctx,
        outer,
        mat,
        '#8B6914',
        '#A67B5B',
        '#6B4E2E',
        '#C4A882',
        '#6B4E2E',
        '#D4B892'
      );
      break;
    case 'forest':
      drawSolidFrame(ctx, outer, mat, '#2F4F3E', '#3D6652', '#1E3329');
      break;
    case 'ocean':
      drawSolidFrame(ctx, outer, mat, '#2A5F5A', '#357872', '#1A403C');
      break;
    case 'sky':
      drawSolidFrame(ctx, outer, mat, '#6B96AB', '#7FA8BC', '#4E7286');
      break;
    case 'black':
      drawSolidFrame(ctx, outer, mat, '#1C1C1C', '#2E2E2E', '#0A0A0A');
      break;
    default:
      break;
  }
}

/** @deprecated Use drawFrameMat + drawFrameBorder */
export function drawPhotoFrame(
  ctx: CanvasRenderingContext2D,
  photo: PetRect,
  styleId: FrameStyleId,
  widthNorm: number,
  cw: number,
  ch: number
) {
  if (styleId === 'none') return;
  const { outer, mat } = computeFrameRects(photo, widthNorm, cw, ch);
  drawFrameMat(ctx, mat);
  drawFrameBorder(ctx, outer, mat, styleId);
}

/** Plain studio backdrop — photo + frame only, no scenic theme. */
export function drawFrameOnlyBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#3d4554');
  grad.addColorStop(0.5, '#2c3442');
  grad.addColorStop(1, '#1f2633');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

/** Drop shadow behind framed area (drawn before mat). */
export function drawFrameShadow(ctx: CanvasRenderingContext2D, photo: PetRect, framePx: number, matPx: number) {
  const pad = framePx + matPx;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#0a0e14';
  ctx.fillRect(photo.left - pad + 5, photo.top - pad + 7, photo.width + pad * 2, photo.height + pad * 2);
  ctx.restore();
}
