/** Me & My Pup — dual circular portrait layout and drawing. */

export type MeAndMyPupVariant =
  | 'classic'
  | 'happy-birthday'
  | 'love-my-dog'
  | 'lives-whole'
  | 'love-this-app';

export type SlotId = 'dog' | 'owner';

export type SlotTransform = {
  panX: number;
  panY: number;
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
  { id: 'lives-whole', name: 'Whole Lives', emoji: '🐾' },
  { id: 'love-this-app', name: 'I Love This App!', emoji: '📱' },
];

type VariantCopy = {
  lines: string[];
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  italicBold?: boolean;
  showLogo?: boolean;
  largeHeadline?: boolean;
};

const VARIANT_COPY: Record<MeAndMyPupVariant, VariantCopy> = {
  classic: {
    lines: ['Me & My Pup'],
    subtitle: 'Best friends · Freedom Paws',
  },
  'happy-birthday': {
    lines: ['Happy Birthday!!'],
    subtitle: 'Another Great Year With My Best Friend',
    titleColor: '#FFE082',
    largeHeadline: true,
  },
  'love-my-dog': {
    lines: ['I Love My Dog'],
    subtitle: 'Forever in my heart',
    titleColor: '#FFFFFF',
    subtitleColor: 'rgba(255,255,255,0.92)',
    largeHeadline: true,
  },
  'lives-whole': {
    lines: ['Dogs are not our whole lives,', 'but they make our lives whole'],
    titleColor: '#1a1208',
    italicBold: true,
  },
  'love-this-app': {
    lines: ['I Love This App!'],
    subtitle: 'Freedom Paws Wellness',
    titleColor: '#F5C242',
    subtitleColor: 'rgba(255,255,255,0.9)',
    showLogo: true,
  },
};

type LayoutTune = {
  headerStartY: number;
  slotCyRatio: number;
  dogRadius: number;
  ownerRadius: number;
};

function layoutTune(variant: MeAndMyPupVariant): LayoutTune {
  switch (variant) {
    case 'lives-whole':
      return {
        headerStartY: 0.1,
        slotCyRatio: 0.57,
        dogRadius: 0.24,
        ownerRadius: 0.185,
      };
    case 'happy-birthday':
    case 'love-my-dog':
      return {
        headerStartY: 0.05,
        slotCyRatio: 0.58,
        dogRadius: 0.255,
        ownerRadius: 0.198,
      };
    default:
      return {
        headerStartY: 0.055,
        slotCyRatio: 0.56,
        dogRadius: 0.265,
        ownerRadius: 0.205,
      };
  }
}

export const DEFAULT_SLOT_TRANSFORM: SlotTransform = { panX: 0, panY: 0, scale: 1 };

export function getSlotLayout(cw: number, ch: number, variant: MeAndMyPupVariant = 'classic'): SlotLayout {
  const minDim = Math.min(cw, ch);
  const tune = layoutTune(variant);
  const slotCy = ch * tune.slotCyRatio;

  return {
    dog: { cx: cw * 0.355, cy: slotCy, radius: minDim * tune.dogRadius },
    owner: { cx: cw * 0.715, cy: slotCy, radius: minDim * tune.ownerRadius },
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

function drawRose(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const petalColors = ['#DC2626', '#B91C1C', '#EF4444', '#991B1B'];
  for (let i = 0; i < 6; i += 1) {
    ctx.save();
    ctx.rotate((i / 6) * Math.PI * 2);
    ctx.fillStyle = petalColors[i % petalColors.length];
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.35, size * 0.28, size * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#7F1D1D';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.ellipse(size * 0.35, size * 0.15, size * 0.22, size * 0.12, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLoveMyDogBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#fce7f3');
  grad.addColorStop(0.35, '#f472b6');
  grad.addColorStop(0.7, '#ec4899');
  grad.addColorStop(1, '#be185d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const roses = [
    { x: 0.06, y: 0.12, s: 22, r: 0.2 },
    { x: 0.18, y: 0.28, s: 16, r: -0.3 },
    { x: 0.92, y: 0.15, s: 20, r: 0.5 },
    { x: 0.82, y: 0.32, s: 14, r: -0.1 },
    { x: 0.08, y: 0.55, s: 18, r: 0.4 },
    { x: 0.94, y: 0.52, s: 17, r: -0.5 },
    { x: 0.14, y: 0.78, s: 24, r: 0.15 },
    { x: 0.88, y: 0.72, s: 21, r: -0.2 },
    { x: 0.48, y: 0.88, s: 15, r: 0.35 },
    { x: 0.32, y: 0.68, s: 13, r: -0.4 },
    { x: 0.68, y: 0.85, s: 19, r: 0.6 },
    { x: 0.52, y: 0.14, s: 12, r: -0.15 },
    { x: 0.72, y: 0.22, s: 11, r: 0.25 },
    { x: 0.26, y: 0.42, s: 14, r: -0.55 },
    { x: 0.58, y: 0.58, s: 10, r: 0.1 },
    { x: 0.04, y: 0.38, s: 12, r: 0.45 },
    { x: 0.96, y: 0.38, s: 13, r: -0.35 },
  ];
  for (const rose of roses) {
    ctx.save();
    ctx.globalAlpha = 0.88;
    drawRose(ctx, w * rose.x, h * rose.y, rose.s, rose.r);
    ctx.restore();
  }

  for (let i = 0; i < 10; i += 1) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.font = `${10 + (i % 4) * 3}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const x = ((i * 173 + 55) % 880) / 1000 * w;
    const y = ((i * 97 + 120) % 820) / 1000 * h;
    ctx.fillText('🌹', x, y);
    ctx.restore();
  }
}

function drawTanBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#E8D5B5');
  grad.addColorStop(0.5, '#D4BC96');
  grad.addColorStop(1, '#C9AD82');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 149) % 1000) / 1000 * w;
    const y = ((i * 83) % 1000) / 1000 * h;
    ctx.beginPath();
    ctx.arc(x, y, 2 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBambooFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bw = Math.max(12, w * 0.028);
  const inset = bw * 0.6;

  ctx.fillStyle = '#1a0f0a';
  ctx.fillRect(0, 0, w, bw);
  ctx.fillRect(0, h - bw, w, bw);
  ctx.fillRect(0, 0, bw, h);
  ctx.fillRect(w - bw, 0, bw, h);

  ctx.strokeStyle = '#3d2817';
  ctx.lineWidth = Math.max(1.5, bw * 0.12);
  const segH = bw * 1.8;
  for (let y = segH; y < h; y += segH) {
    ctx.beginPath();
    ctx.moveTo(inset, y);
    ctx.lineTo(bw - inset, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w - bw + inset, y);
    ctx.lineTo(w - inset, y);
    ctx.stroke();
  }
  for (let x = segH; x < w; x += segH * 1.4) {
    ctx.beginPath();
    ctx.moveTo(x, inset);
    ctx.lineTo(x, bw - inset);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, h - bw + inset);
    ctx.lineTo(x, h - inset);
    ctx.stroke();
  }

  ctx.strokeStyle = '#2d1810';
  ctx.lineWidth = Math.max(2, bw * 0.18);
  ctx.strokeRect(bw * 0.35, bw * 0.35, w - bw * 0.7, h - bw * 0.7);
}

function drawPawPrint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  angle: number,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(245, 194, 66, 0.35)';
  const toe = size * 0.22;
  const positions = [
    [-size * 0.35, -size * 0.35],
    [-size * 0.12, -size * 0.55],
    [size * 0.12, -size * 0.55],
    [size * 0.35, -size * 0.35],
  ];
  for (const [tx, ty] of positions) {
    ctx.beginPath();
    ctx.arc(tx, ty, toe, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(0, size * 0.08, size * 0.38, size * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLoveThisAppBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0A1625');
  grad.addColorStop(0.5, '#0F1E38');
  grad.addColorStop(1, '#152642');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const prints = [
    { x: 0.1, y: 0.2, s: 28, a: 0.22, r: -0.3 },
    { x: 0.85, y: 0.18, s: 32, a: 0.2, r: 0.4 },
    { x: 0.22, y: 0.55, s: 24, a: 0.18, r: 0.15 },
    { x: 0.78, y: 0.5, s: 26, a: 0.2, r: -0.5 },
    { x: 0.12, y: 0.82, s: 30, a: 0.17, r: 0.25 },
    { x: 0.9, y: 0.78, s: 27, a: 0.19, r: -0.2 },
    { x: 0.5, y: 0.9, s: 22, a: 0.15, r: 0.1 },
    { x: 0.45, y: 0.35, s: 20, a: 0.12, r: -0.15 },
    { x: 0.65, y: 0.68, s: 18, a: 0.14, r: 0.35 },
    { x: 0.35, y: 0.72, s: 21, a: 0.13, r: -0.4 },
  ];
  for (const p of prints) {
    drawPawPrint(ctx, w * p.x, h * p.y, p.s, p.r, p.a);
  }
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

function drawFireworkBurst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  rays: number
) {
  ctx.save();
  ctx.globalAlpha = 0.85;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.15, color);
  grad.addColorStop(0.5, `${color}88`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.2, radius * 0.04);
  for (let i = 0; i < rays; i += 1) {
    const angle = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFireworks(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bursts = [
    { x: 0.28, y: 0.22, r: 48, c: '#F5C242', rays: 12 },
    { x: 0.72, y: 0.18, r: 42, c: '#EC4899', rays: 10 },
    { x: 0.5, y: 0.12, r: 36, c: '#60A5FA', rays: 10 },
    { x: 0.15, y: 0.35, r: 28, c: '#A78BFA', rays: 8 },
    { x: 0.88, y: 0.32, r: 32, c: '#34D399', rays: 9 },
    { x: 0.62, y: 0.38, r: 24, c: '#FB923C', rays: 8 },
  ];
  for (const b of bursts) {
    drawFireworkBurst(ctx, w * b.x, h * b.y, b.r, b.c, b.rays);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 35; i += 1) {
    const x = ((i * 137) % 1000) / 1000 * w;
    const y = ((i * 89) % 450) / 1000 * h;
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + (i % 3) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBirthdayAccents(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const balloons = [
    { x: 0.08, y: 0.72, r: 11, c: '#EC4899', sh: 22 },
    { x: 0.92, y: 0.7, r: 10, c: '#3B82F6', sh: 20 },
    { x: 0.06, y: 0.85, r: 9, c: '#F5C242', sh: 18 },
    { x: 0.94, y: 0.84, r: 9, c: '#22C55E', sh: 18 },
  ];
  for (const b of balloons) {
    drawBalloon(ctx, w * b.x, h * b.y, b.r, b.c, b.sh);
  }

  const favors = ['🎊', '🎁', '🎀', '✨'];
  for (let i = 0; i < favors.length; i += 1) {
    ctx.font = `${Math.max(12, w * 0.032)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.8;
    const x = ((i * 241 + 60) % 800) / 1000 * w;
    const y = h * (0.9 + (i % 2) * 0.03);
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
    ctx.fillStyle = `rgba(8, 16, 32, ${overlayAlpha})`;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawLakeNightFallback(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
  sky.addColorStop(0, '#0a1020');
  sky.addColorStop(1, '#1a2844');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.55);

  const water = ctx.createLinearGradient(0, h * 0.45, 0, h);
  water.addColorStop(0, '#1e3a5f');
  water.addColorStop(0.5, '#0f2847');
  water.addColorStop(1, '#081828');
  ctx.fillStyle = water;
  ctx.fillRect(0, h * 0.45, w, h * 0.55);

  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.ellipse(w * (0.1 + i * 0.07), h * (0.52 + (i % 3) * 0.04), w * 0.08, 3, 0, 0, Math.PI * 2);
    ctx.fill();
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
      drawTanBg(ctx, w, h);
      return;
    case 'love-this-app':
      drawLoveThisAppBg(ctx, w, h);
      return;
    case 'happy-birthday':
      if (photoBg) {
        drawPhotoCover(ctx, photoBg, w, h, 0.5);
      } else {
        drawLakeNightFallback(ctx, w, h);
      }
      drawFireworks(ctx, w, h);
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
  label: string,
  darkLabels = false
) {
  const lw = Math.max(2.5, slot.radius * 0.045);
  ctx.beginPath();
  ctx.arc(slot.cx, slot.cy, slot.radius + lw * 0.6, 0, Math.PI * 2);
  ctx.strokeStyle = selected ? '#FFE082' : darkLabels ? '#5c4a2a' : '#F5C242';
  ctx.lineWidth = selected ? lw * 1.35 : lw;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(slot.cx, slot.cy, slot.radius + lw * 1.8, 0, Math.PI * 2);
  ctx.strokeStyle = darkLabels ? 'rgba(26,18,8,0.25)' : 'rgba(255,255,255,0.25)';
  ctx.lineWidth = Math.max(1, lw * 0.35);
  ctx.stroke();

  const fontSize = Math.max(9, slot.radius * 0.19);
  ctx.font = `700 ${fontSize}px system-ui, sans-serif`;
  ctx.fillStyle = selected
    ? darkLabels
      ? '#1a1208'
      : '#FFE082'
    : darkLabels
      ? 'rgba(26,18,8,0.75)'
      : 'rgba(255,255,255,0.75)';
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

function fitTitleSize(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number,
  startSize: number,
  italicBold: boolean
): number {
  let size = startSize;
  const weight = italicBold ? 'italic 800' : '800';
  while (size > 9) {
    ctx.font = `${weight} ${size}px Georgia, "Times New Roman", serif`;
    const widest = Math.max(...lines.map((line) => ctx.measureText(line).width));
    if (widest <= maxWidth) return size;
    size -= 1;
  }
  return size;
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  variant: MeAndMyPupVariant,
  logoImg: HTMLImageElement | null
) {
  const copy = VARIANT_COPY[variant];
  const tune = layoutTune(variant);
  const isLivesWhole = variant === 'lives-whole';
  const isLargeHeadline = copy.largeHeadline === true;
  const maxTextWidth = isLivesWhole ? w * 0.78 : w * 0.92;
  const startSize = isLivesWhole
    ? h * 0.108
    : isLargeHeadline
      ? Math.max(20, w * 0.058)
      : Math.max(14, w * 0.042);
  const titleSize = isLivesWhole
    ? fitTitleSize(ctx, copy.lines, maxTextWidth, startSize, true)
    : copy.lines.length > 1
      ? Math.max(11, w * 0.032)
      : isLargeHeadline
        ? Math.max(20, w * 0.058)
        : Math.max(14, w * 0.042);
  const lineHeight = titleSize * (isLivesWhole ? 1.2 : 1.12);
  const startY = h * tune.headerStartY;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = copy.titleColor ?? '#F5C242';

  copy.lines.forEach((line, i) => {
    const weight = copy.italicBold ? 'italic 800' : '800';
    const family = copy.italicBold
      ? 'Georgia, "Times New Roman", serif'
      : 'system-ui, sans-serif';
    ctx.font = `${weight} ${titleSize}px ${family}`;
    ctx.fillText(line, w / 2, startY + i * lineHeight);
  });

  if (copy.subtitle) {
    const subSize = isLargeHeadline
      ? Math.max(13, w * 0.036)
      : Math.max(10, w * 0.028);
    ctx.font = `600 ${subSize}px system-ui, sans-serif`;
    ctx.fillStyle = copy.subtitleColor ?? 'rgba(255,255,255,0.65)';
    let subY = startY + copy.lines.length * lineHeight + (isLargeHeadline ? 8 : 6);

    if (copy.showLogo && logoImg) {
      const logoSize = Math.max(28, w * 0.09);
      ctx.drawImage(logoImg, w / 2 - logoSize / 2, subY, logoSize, logoSize);
      subY += logoSize + 4;
    }

    ctx.fillText(copy.subtitle, w / 2, subY);
  }
}

type DrawFrameOpts = {
  ctx: CanvasRenderingContext2D;
  cw: number;
  ch: number;
  variant: MeAndMyPupVariant;
  photoBg: HTMLImageElement | null;
  logoImg?: HTMLImageElement | null;
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
    logoImg = null,
    dogImg,
    ownerImg,
    dogTransform,
    ownerTransform,
    selectedSlot,
    showWatermark = true,
  } = opts;

  drawMeAndMyPupBackground(ctx, variant, cw, ch, photoBg);
  drawHeader(ctx, cw, ch, variant, logoImg ?? null);

  const layout = getSlotLayout(cw, ch, variant);

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
  const darkRings = variant === 'lives-whole';
  drawGoldRing(ctx, layout.dog, selectedSlot === 'dog', 'MY PUP', darkRings);
  drawGoldRing(ctx, layout.owner, selectedSlot === 'owner', 'ME', darkRings);

  if (variant === 'lives-whole') {
    drawBambooFrame(ctx, cw, ch);
  }

  if (showWatermark) {
    const fontSize = Math.max(9, cw * 0.024);
    ctx.font = `${fontSize}px system-ui, sans-serif`;
    ctx.fillStyle = variant === 'lives-whole' ? 'rgba(26,18,8,0.45)' : 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Made with Freedom Paws', cw - 8, ch - 8);
  }
}

export function hitTestSlot(
  px: number,
  py: number,
  cw: number,
  ch: number,
  variant: MeAndMyPupVariant = 'classic'
): SlotId | null {
  const layout = getSlotLayout(cw, ch, variant);
  const dogDist = Math.hypot(px - layout.dog.cx, py - layout.dog.cy);
  const ownerDist = Math.hypot(px - layout.owner.cx, py - layout.owner.cy);
  if (dogDist <= layout.dog.radius * 1.08) return 'dog';
  if (ownerDist <= layout.owner.radius * 1.08) return 'owner';
  return null;
}

export function variantBackgroundUrls(variant: MeAndMyPupVariant): string[] {
  if (variant === 'happy-birthday') {
    return ['/images/photobooth/backgrounds/bg-lake-legend.jpg', '/images/tn-lake-bg.jpg'];
  }
  return [];
}

export const ME_AND_MY_PUP_LOGO_URL = '/images/icon-192.png';

export function variantUsesLogo(variant: MeAndMyPupVariant): boolean {
  return variant === 'love-this-app';
}
