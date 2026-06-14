/** Brand line on every exported Photo Booth image. */
export const PHOTO_BOOTH_WATERMARK = 'Freedom Paws Wellness';

export function drawPhotoBoothWatermark(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number
): void {
  const fontSize = Math.max(9, Math.round(cw * 0.026));
  const y = ch - Math.max(8, Math.round(ch * 0.018));

  ctx.save();
  ctx.font = `600 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 3;
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fillText(PHOTO_BOOTH_WATERMARK, cw / 2, y);
  ctx.restore();
}
