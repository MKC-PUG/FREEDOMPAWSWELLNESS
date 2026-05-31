/** Me & My Pup — dual circular portrait layout and drawing. */

import { drawThemeBackground } from '@/lib/photobooth/draw-theme-background';

export type MeAndMyPupVariant = 'classic' | 'happy-birthday' | 'love-my-dog' | 'lives-whole';

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
  { id: 'happy-birthday', name: 'Happy Birthday!!', emoji: '🎉' },
  { id: 'love-my-dog', name: 'I Love My Dog', emoji: '💕' },
  { id: 'lives-whole', name: 'Lives Whole', emoji: '🐾' },
];

type VariantCopy = {
  lines: string[];
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
};

const VARIANT_COPY: Record<MeAndMyPupVariant, VariantCopy> = {
  classic: {
    lines: ['Me & My Pup'],
    subtitle: 'Best friends · Freedom Paws',
  },
  'happy-birthday': {
    lines: ['Happy Birthday!!'],
    subtitle: '🎈 Party time · Freedom Paws',
    titleColor: '#FFE082',
  },
  'love-my-dog': {
    lines: ['I Love My Dog'],
    subtitle: 'Forever in my heart',
    titleColor: '#FFFFFF',
    subtitleColor: 'rgba(255,255,255,0.85)',
  },
  'lives-whole': {
    lines: ['Dogs are not our whole lives,', 'but they make our lives whole'],
    titleColor: '#F5C242',
  },
};

/** Top band reserved for titles — slots sit below this. */
const HEADER_BAND = 0.24;

export const DEFAULT_SLOT_TRANSFORM: SlotTransform = { panX: 0, panY: 0, scale: 1 };

export function getSlotLayout(cw: number, ch: number): SlotLayout {
  const minDim = Math.min(cw, ch);
  const headerBottom = ch * HEADER_BAND;
  const slotCy = headerBottom + (ch - headerBottom) * 0.44;

  return {
    dog: { cx: cw * 0.355, cy: slotCy, radius: minDim * 0.265 },
    owner: { cx: cw * 0.715, cy: slotCy, radius: minDim * 0.205 },
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

function drawLoveMyDogBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#fce7f3');
  grad.addColorStop(0.35, '#f472b6');
  grad.addColorStop(0.7, '#ec4899');
  grad.addColorStop(1, '#be185d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const hearts = [
    { x: 0.08, y: 0.72, s: 18, a: 0.35 },
    { x: 0.92, y: 0.68, s: 22, a: 0.3 },
    { x: 0.15, y: 0.88, s: 14, a: 0.4 },
    { x: 0.85, y: 0.85, s: 16, a: 0.35 },
    { x: 0.5, y: 0.92, s: 12, a: 0.25 },
    { x: 0.72, y: 0.78, s: 10, a: 0.3 },
    { x: 0.28, y: 0.8, s: 11, a: 0.28 },
  ];
  for (const heart of hearts) {
    ctx.save();
    ctx.globalAlpha = heart.a;
    ctx.font = `${heart.s}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♥', w * heart.x, h * heart.y);
    ctx.restore();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 24; i += 1) {
    const x = ((i * 137) % 1000) / 1000 * w;
    const y = ((i * 89) % 1000) / 1000 * h * 0.55;
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLivesWholeBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#1a1208');
  grad.addColorStop(0.4, '#3d2e1a');
  grad.addColorStop(0.75, '#5c4a2a');
  grad.addColorStop(1, '#0A1625');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(245, 194, 66, 0.06)';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.9, w * 0.5, h * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `${Math.max(14, w * 0.04)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.12;
  ctx.fillText('🐾', w * 0.12, h * 0.82);
  ctx.fillText('🐾', w * 0.88, h * 0.8);
  ctx.globalAlpha = 1;
}

function drawBalloon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  stringH: number
) {
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.lineTo(x, y + r + stringH);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.85, r, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x - r * 0.25, y - r * 0.25, r * 0.18, r * 0.28, -0.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawBirthdayAccents(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const balloons = [
    { x: 0.1, y: 0.14, r: 14, c: '#EC4899', sh: 28 },
    { x: 0.22, y: 0.1, r: 11, c: '#3B82F6', sh: 22 },
    { x: 0.88, y: 0.12, r: 13, c: '#F5C242', sh: 26 },
    { x: 0.78, y: 0.08, r: 10, c: '#22C55E', sh: 20 },
    { x: 0.05, y: 0.78, r: 9, c: '#A855F7', sh: 18 },
    { x: 0.94, y: 0.75, r: 10, c: '#F97316', sh: 20 },
  ];
  for (const b of balloons) {
    drawBalloon(ctx, w * b.x, h * b.y, b.r, b.c, b.sh);
  }

  const favors = ['🎊', '🎁', '🎀', '✨', '🥳'];
  for (let i = 0; i < favors.length; i += 1) {
    ctx.font = `${Math.max(12, w * 0.034)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.75;
    const x = ((i * 211 + 40) % 900) / 1000 * w;
    const y = h * (0.86 + (i % 2) * 0.04);
    ctx.fillText(favors[i], x, y);
    ctx.globalAlpha = 1;
  }
}

function drawPhotoCover(
  ctx: CanvasRenderingContext2D,
  photoBg: HTMLImageElement,
  w: number,
  h: number,
  overlayAlpha: number
) {
  const iw = photoBg.naturalWidth || photoBg.width;
  const ih = photoBg.naturalHeight || photoBg.height;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(photoBg, (w - dw) / 2, (h - dh) / 2, dw, dh);
  if (overlayAlpha > 0) {
    ctx.fillStyle = `rgba(10, 22, 37, ${overlayAlpha})`;
    ctx.fillRect(0, 0, w, h);
  }
}

export function drawMeAndMyPupBackground(
  ctx: CanvasRenderingContext2D,
  variant: MeAndMyPupVariant,
  w: number,
  h: number,
  photoBg: HTMLImageElement | null
) {
  switch (variant) {
    case 'classic':
      drawClassicCardBg(ctx, w, h);
      return;
    case 'love-my-dog':
      drawLoveMyDogBg(ctx, w, h);
      return;
    case 'lives-whole':
      drawLivesWholeBg(ctx, w, h);
      return;
    case 'happy-birthday':
      if (photoBg) {
        drawPhotoCover(ctx, photoBg, w, h, 0.25);
      } else {
        drawThemeBackground(ctx, 'birthday-bash', w, h);
      }
      drawBirthdayAccents(ctx, w, h);
      return;
  }
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
  const y = layout.dog.cy + layout.dog.radius * 0.12;
  ctx.font = `${Math.max(14, layout.dog.radius * 0.35)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(245, 194, 66, 0.85)';
  ctx.fillText('🐾', midX, y);
}

function drawHeader(ctx: CanvasRenderingContext2D, w: number, h: number, variant: MeAndMyPupVariant) {
  const copy = VARIANT_COPY[variant];
  const isMultiLine = copy.lines.length > 1;
  const titleSize = isMultiLine
    ? Math.max(11, w * 0.032)
    : Math.max(14, w * 0.042);
  const lineHeight = titleSize * 1.15;
  const startY = h * 0.055;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = copy.titleColor ?? '#F5C242';

  copy.lines.forEach((line, i) => {
    ctx.font = `800 ${titleSize}px system-ui, sans-serif`;
    ctx.fillText(line, w / 2, startY + i * lineHeight);
  });

  if (copy.subtitle) {
    const subSize = Math.max(10, w * 0.028);
    ctx.font = `600 ${subSize}px system-ui, sans-serif`;
    ctx.fillStyle = copy.subtitleColor ?? 'rgba(255,255,255,0.65)';
    const subY = startY + copy.lines.length * lineHeight + 4;
    ctx.fillText(copy.subtitle, w / 2, subY);
  }
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
  drawHeader(ctx, cw, ch, variant);

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
  if (variant === 'happy-birthday') {
    return ['/images/photobooth/backgrounds/bg-birthday-bash.png'];
  }
  return [];
}
