/** Me & My Pup — dual circular portrait layout and drawing. */

import { drawThemeBackground } from '@/lib/photobooth/draw-theme-background';

export type MeAndMyPupVariant = 'classic' | 'lake' | 'patriot' | 'birthday';

export type SlotId = 'dog' | 'owner';

export type SlotTransform = {
  /** Pan as fraction of slot radius (−1…1) */
  panX: number;
  panY: number;
  /** 1 = default cover; pinch to zoom */
  scale: number;
};

export type CircleSlot = {
  cx: number;
  cy: number;
  radius: number;
};

export type SlotLayout = {
  dog: CircleSlot;
  owner: CircleSlot;
};

export const ME_AND_MY_PUP_VARIANTS: { id: MeAndMyPupVariant; name: string; emoji: string }[] = [
  { id: 'classic', name: 'Classic Navy', emoji: '💙' },
  { id: 'lake', name: 'Lake Day', emoji: '🌅' },
  { id: 'patriot', name: 'Patriot', emoji: '🇺🇸' },
  { id: 'birthday', name: 'Birthday', emoji: '🎉' },
];

const VARIANT_THEME: Record<Exclude<MeAndMyPupVariant, 'classic'>, string> = {
  lake: 'lake-legend',
  patriot: 'patriot-pup',
  birthday: 'birthday-bash',
};

export const DEFAULT_SLOT_TRANSFORM: SlotTransform = { panX: 0, panY: 0, scale: 1 };

export function getSlotLayout(cw: number, ch: number): SlotLayout {
  const minDim = Math.min(cw, ch);
  return {
    dog: { cx: cw * 0.355, cy: ch * 0.47, radius: minDim * 0.295 },
    owner: { cx: cw * 0.715, cy: ch * 0.47, radius: minDim * 0.225 },
  };
}

function drawClassicCardBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0A1625');
  grad.addColorStop(0.45, '#152642');
  grad.addColorStop(1, '#1a0f2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(245, 194, 66, 0.08)';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.88, w * 0.42, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function drawMeAndMyPupBackground(
  ctx: CanvasRenderingContext2D,
  variant: MeAndMyPupVariant,
  w: number,
  h: number,
  photoBg: HTMLImageElement | null
) {
  if (variant === 'classic') {
    drawClassicCardBg(ctx, w, h);
    return;
  }
  if (photoBg) {
    const iw = photoBg.naturalWidth || photoBg.width;
    const ih = photoBg.naturalHeight || photoBg.height;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(photoBg, (w - dw) / 2, (h - dh) / 2, dw, dh);
    ctx.fillStyle = 'rgba(10, 22, 37, 0.45)';
    ctx.fillRect(0, 0, w, h);
    return;
  }
  drawThemeBackground(ctx, VARIANT_THEME[variant], w, h);
}

function drawCoverInCircle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  slot: CircleSlot,
  transform: SlotTransform
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(slot.cx, slot.cy, slot.radius, 0, Math.PI * 2);
  ctx.clip();

  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const base = Math.max((slot.radius * 2) / iw, (slot.radius * 2) / ih);
  const scale = base * transform.scale;
  const dw = iw * scale;
  const dh = ih * scale;
  const panX = transform.panX * slot.radius;
  const panY = transform.panY * slot.radius;
  ctx.drawImage(img, slot.cx - dw / 2 + panX, slot.cy - dh / 2 + panY, dw, dh);
  ctx.restore();
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, slot: CircleSlot) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(slot.cx, slot.cy, slot.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 30, 56, 0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 194, 66, 0.55)';
  ctx.lineWidth = Math.max(2, slot.radius * 0.04);
  ctx.setLineDash([8, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `600 ${Math.max(11, slot.radius * 0.22)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Your', slot.cx, slot.cy - slot.radius * 0.12);
  ctx.fillText('photo', slot.cx, slot.cy + slot.radius * 0.12);
  ctx.restore();
}

function drawGoldRing(
  ctx: CanvasRenderingContext2D,
  slot: CircleSlot,
  selected: boolean,
  label: string
) {
  const lw = Math.max(2.5, slot.radius * 0.045);
  ctx.beginPath();
  ctx.arc(slot.cx, slot.cy, slot.radius + lw * 0.6, 0, Math.PI * 2);
  ctx.strokeStyle = selected ? '#FFE082' : '#F5C242';
  ctx.lineWidth = selected ? lw * 1.35 : lw;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(slot.cx, slot.cy, slot.radius + lw * 1.8, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = Math.max(1, lw * 0.35);
  ctx.stroke();

  const fontSize = Math.max(9, slot.radius * 0.19);
  ctx.font = `700 ${fontSize}px system-ui, sans-serif`;
  ctx.fillStyle = selected ? '#FFE082' : 'rgba(255,255,255,0.75)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(label, slot.cx, slot.cy + slot.radius + lw * 2.2);
}

function drawPawConnector(ctx: CanvasRenderingContext2D, layout: SlotLayout) {
  const midX = (layout.dog.cx + layout.owner.cx) / 2;
  const y = layout.dog.cy + layout.dog.radius * 0.15;
  ctx.font = `${Math.max(14, layout.dog.radius * 0.35)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(245, 194, 66, 0.85)';
  ctx.fillText('🐾', midX, y);
}

function drawHeader(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const titleSize = Math.max(14, w * 0.042);
  ctx.font = `800 ${titleSize}px system-ui, sans-serif`;
  ctx.fillStyle = '#F5C242';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Me & My Pup', w / 2, h * 0.06);

  const subSize = Math.max(10, w * 0.028);
  ctx.font = `600 ${subSize}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillText('Best friends · Freedom Paws', w / 2, h * 0.06 + titleSize + 4);
}

type DrawFrameOpts = {
  ctx: CanvasRenderingContext2D;
  cw: number;
  ch: number;
  variant: MeAndMyPupVariant;
  photoBg: HTMLImageElement | null;
  dogImg: HTMLImageElement | null;
  ownerImg: HTMLImageElement | null;
  dogTransform: SlotTransform;
  ownerTransform: SlotTransform;
  selectedSlot: SlotId | null;
  showWatermark?: boolean;
};

export function drawMeAndMyPupFrame(opts: DrawFrameOpts) {
  const {
    ctx,
    cw,
    ch,
    variant,
    photoBg,
    dogImg,
    ownerImg,
    dogTransform,
    ownerTransform,
    selectedSlot,
    showWatermark = true,
  } = opts;

  drawMeAndMyPupBackground(ctx, variant, cw, ch, photoBg);
  drawHeader(ctx, cw, ch);

  const layout = getSlotLayout(cw, ch);

  if (dogImg) {
    drawCoverInCircle(ctx, dogImg, layout.dog, dogTransform);
  } else {
    drawPlaceholder(ctx, layout.dog);
  }

  if (ownerImg) {
    drawCoverInCircle(ctx, ownerImg, layout.owner, ownerTransform);
  } else {
    drawPlaceholder(ctx, layout.owner);
  }

  drawPawConnector(ctx, layout);
  drawGoldRing(ctx, layout.dog, selectedSlot === 'dog', 'MY PUP');
  drawGoldRing(ctx, layout.owner, selectedSlot === 'owner', 'ME');

  if (showWatermark) {
    const fontSize = Math.max(9, cw * 0.024);
    ctx.font = `${fontSize}px system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Made with Freedom Paws', cw - 8, ch - 8);
  }
}

export function hitTestSlot(px: number, py: number, cw: number, ch: number): SlotId | null {
  const layout = getSlotLayout(cw, ch);
  const dogDist = Math.hypot(px - layout.dog.cx, py - layout.dog.cy);
  const ownerDist = Math.hypot(px - layout.owner.cx, py - layout.owner.cy);
  if (dogDist <= layout.dog.radius * 1.08) return 'dog';
  if (ownerDist <= layout.owner.radius * 1.08) return 'owner';
  return null;
}

export function variantBackgroundUrls(variant: MeAndMyPupVariant): string[] {
  if (variant === 'classic') return [];
  if (variant === 'lake') {
    return ['/images/photobooth/backgrounds/bg-lake-legend.jpg', '/images/tn-lake-bg.jpg'];
  }
  if (variant === 'patriot') {
    return ['/images/photobooth/backgrounds/bg-patriot-pup.png'];
  }
  return ['/images/photobooth/backgrounds/bg-birthday-bash.png'];
}
