import type { PetRect } from './frames';

export const FRAME_HEADLINE_MAX = 48;
export const FRAME_HEADLINE_OFFSET_MIN = -0.08;
export const FRAME_HEADLINE_OFFSET_MAX = 0.08;
export const FRAME_HEADLINE_OFFSET_STEP = 0.02;

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
  maxLines = 2
): string[] {
  const cleaned = text.trim().slice(0, FRAME_HEADLINE_MAX);
  if (!cleaned) return [];

  ctx.font = `800 ${fontSize}px Georgia, "Times New Roman", serif`;
  const words = cleaned.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    } else {
      current = test;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number,
  startSize: number
): number {
  let size = startSize;
  while (size > 9) {
    ctx.font = `800 ${size}px Georgia, "Times New Roman", serif`;
    const widest = Math.max(...lines.map((line) => ctx.measureText(line).width));
    if (widest <= maxWidth) return size;
    size -= 1;
  }
  return size;
}

/** Extra mat height below the photo so a print-style caption fits inside the frame. */
export function measureFrameHeadlineMatExtra(
  ctx: CanvasRenderingContext2D,
  text: string,
  matWidth: number,
  cw: number,
  matPx: number
): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  const fontSize = Math.max(11, cw * 0.034);
  const maxWidth = matWidth * 0.92;
  const lines = wrapLines(ctx, trimmed, maxWidth, fontSize);
  if (!lines.length) return 0;

  const fitted = fitFontSize(ctx, lines, maxWidth, fontSize);
  const lineHeight = fitted * 1.12;
  const pad = Math.max(8, cw * 0.018);
  const needed = lines.length * lineHeight + pad * 2;
  return Math.max(0, needed - matPx);
}

/** Serif caption on the cream mat below the photo — classic framed print look. */
export function drawFrameMatHeadline(
  ctx: CanvasRenderingContext2D,
  photo: PetRect,
  mat: PetRect,
  text: string,
  offsetYNorm: number,
  cw: number
): void {
  const trimmed = text.trim();
  if (!trimmed) return;

  const fontSize = Math.max(11, cw * 0.034);
  const maxWidth = mat.width * 0.92;
  const lines = wrapLines(ctx, trimmed, maxWidth, fontSize);
  if (!lines.length) return;

  const fitted = fitFontSize(ctx, lines, maxWidth, fontSize);
  const lineHeight = fitted * 1.12;

  const captionTop = photo.top + photo.height;
  const captionHeight = mat.top + mat.height - captionTop;
  const baseY = captionTop + captionHeight / 2;
  const offsetPx = offsetYNorm * cw;

  ctx.save();
  ctx.font = `800 ${fitted}px Georgia, "Times New Roman", serif`;
  ctx.fillStyle = '#2c2418';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const totalH = lines.length * lineHeight;
  let y = baseY - totalH / 2 + lineHeight / 2 + offsetPx;
  for (const line of lines) {
    ctx.fillText(line, mat.left + mat.width / 2, y);
    y += lineHeight;
  }
  ctx.restore();
}
