/**
 * Retired drawn tornado. Do not render this over public/clips/tornado.mp4.
 * The locked desk cut is the outdoor dust master.
 */
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const outDir = join(root, 'tmp/tornado-frames');
const clipDir = join(root, 'public/images/brand/clips');
const W = 720;
const H = 1280;
const FRAMES = 180;
const PAWS = [
  { x: 36, y: 1248 },
  { x: 190, y: 1252 },
  { x: 410, y: 1248 },
  { x: 660, y: 1252 },
];

async function fit(file) {
  const meta = await sharp(file).metadata();
  const scale = Math.max(W / meta.width, H / meta.height);
  const rw = Math.round(meta.width * scale);
  const rh = Math.round(meta.height * scale);
  const left = Math.max(0, Math.round((rw - W) / 2));
  const top = Math.max(0, Math.round((rh - H) / 2));
  return sharp(file)
    .resize(rw, rh)
    .extract({ left, top, width: W, height: H })
    .ensureAlpha()
    .raw()
    .toBuffer();
}

function fullFunnel(x, y, screen) {
  return {
    x,
    y,
    h: 1900,
    base: 520,
    top: 680,
    spin: 0,
    fade: 1,
    wobble: 0,
    screen,
  };
}

function stage(frame) {
  if (frame < 6 || frame > 168) return null;
  if (frame < 28) {
    const u = (frame - 6) / 22;
    return PAWS.map((paw, i) => ({
      x: paw.x,
      y: paw.y,
      h: 78 + u * 220,
      base: 12 + u * 10,
      top: 34 + u * 70,
      spin: frame * 0.62 + i * 1.5,
      fade: 0.55 + u * 0.4,
    }));
  }
  if (frame < 47) {
    const u = (frame - 28) / 19;
    return PAWS.map((paw, i) => ({
      x: paw.x + (W / 2 - paw.x) * u,
      y: paw.y + (1320 - paw.y) * u,
      h: 300 + u * 700,
      base: 22 + u * 180,
      top: 104 + u * 280,
      spin: frame * 0.75 + i,
      fade: 1,
      screen: u > 0.82,
    }));
  }
  if (frame < 65) {
    const u = (frame - 47) / 18;
    return [
      {
        x: W / 2,
        y: 1360,
        h: 1000 + u * 900,
        base: 220 + u * 300,
        top: 400 + u * 280,
        spin: frame * 0.85,
        fade: 1,
        wobble: 0,
        screen: u > 0.45,
      },
    ];
  }
  if (frame < 78) return [fullFunnel(W / 2, 1360, true)];
  const u = (frame - 78) / 80;
  const ease = u * u;
  return [fullFunnel(W / 2 - ease * 1600, 1360 - ease * 2000, true)];
}

function dustPath(funnel, frame) {
  const topY = funnel.y - funnel.h;
  const midY = funnel.y - funnel.h * 0.52;
  const wobble = Math.sin(frame * 1.9 + funnel.x * 0.01) * funnel.top * 0.1;
  const mid = funnel.base + (funnel.top - funnel.base) * 0.42;
  return `M ${(funnel.x - funnel.base).toFixed(1)} ${funnel.y.toFixed(1)}
    C ${(funnel.x - funnel.base * 1.6).toFixed(1)} ${(funnel.y - funnel.h * 0.18).toFixed(1)}, ${(funnel.x - mid - wobble).toFixed(1)} ${midY.toFixed(1)}, ${(funnel.x - funnel.top + wobble).toFixed(1)} ${topY.toFixed(1)}
    L ${(funnel.x + funnel.top + wobble * 0.4).toFixed(1)} ${topY.toFixed(1)}
    C ${(funnel.x + mid - wobble * 0.5).toFixed(1)} ${midY.toFixed(1)}, ${(funnel.x + funnel.base * 1.5).toFixed(1)} ${(funnel.y - funnel.h * 0.22).toFixed(1)}, ${(funnel.x + funnel.base).toFixed(1)} ${funnel.y.toFixed(1)} Z`;
}

function skirtMarkup(funnel) {
  const skirt = Math.max(18, funnel.base * 2.1 + 8);
  return `<ellipse cx="${funnel.x.toFixed(1)}" cy="${(funnel.y + 2).toFixed(1)}" rx="${skirt.toFixed(1)}" ry="${Math.max(8, skirt * 0.2).toFixed(1)}" fill="#6A5E52" opacity="0.8"/>`;
}

function debrisMarkup(funnel, frame) {
  const bits = 8 + Math.round(funnel.h / 16);
  const specks = [];
  for (let i = 0; i < bits; i += 1) {
    const t = ((i * 0.41) % 1) ** 0.32;
    const y = funnel.y - funnel.h * t + Math.sin(i * 1.7) * 8;
    const half = funnel.base + (funnel.top - funnel.base) * t;
    const ang = frame * 0.85 + i * 2.4;
    const x = funnel.x + Math.cos(ang) * half * (0.96 + (i % 5) * 0.05);
    const size = 1.8 + (i % 4) * (0.8 + t * 2.2);
    specks.push(
      `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${size.toFixed(1)}" ry="${(size * 0.62).toFixed(1)}" fill="#1E1A16" opacity="${(0.35 + t * 0.6).toFixed(3)}"/>`,
    );
  }
  return specks.join('');
}

function windSvg(funnels, frame) {
  const clouds = funnels.map((funnel) => {
    const shift = Math.sin(frame * 2.15 + funnel.x * 0.02) * funnel.top * 0.35;
    const edge = funnel.top < 140 ? '#7C756C' : '#C9C3B8';
    const mid = funnel.top < 140 ? '#5C564F' : '#8E877E';
    const lean = ((funnel.tilt || 0) + Math.sin(frame * 0.35) * (funnel.wobble ?? 3)).toFixed(2);
    const gid = `g${Math.round(funnel.x)}${Math.round(funnel.y)}`;
    return `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${(funnel.x - funnel.top + shift).toFixed(1)}" x2="${(funnel.x + funnel.top + shift).toFixed(1)}" y1="0" y2="0">
      <stop offset="0" stop-color="${edge}"/>
      <stop offset="0.22" stop-color="${mid}"/>
      <stop offset="0.5" stop-color="#3E3A36"/>
      <stop offset="0.78" stop-color="${mid}"/>
      <stop offset="1" stop-color="${edge}"/>
    </linearGradient>
    <g opacity="${funnel.fade.toFixed(3)}" transform="rotate(${lean} ${funnel.x.toFixed(1)} ${funnel.y.toFixed(1)})">
      <path d="${dustPath(funnel, frame)}" fill="url(#${gid})"/>
      ${skirtMarkup(funnel)}
    </g>`;
  });
  const dirt = funnels
    .map((funnel) => {
      const lean = ((funnel.tilt || 0) + Math.sin(frame * 0.35) * (funnel.wobble ?? 3)).toFixed(2);
      return `<g opacity="${funnel.fade.toFixed(3)}" transform="rotate(${lean} ${funnel.x.toFixed(1)} ${funnel.y.toFixed(1)})">${debrisMarkup(funnel, frame)}</g>`;
    })
    .join('');
  const veil = funnels
    .filter((funnel) => funnel.screen)
    .map(
      (funnel) =>
        `<rect x="${(funnel.x - 900).toFixed(1)}" y="${(funnel.y - funnel.h - 240).toFixed(1)}" width="1800" height="${(funnel.h + 480).toFixed(1)}" fill="#5C574F"/>`,
    )
    .join('');
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    ${veil}
    <defs>
      <filter id="storm" x="-30%" y="-15%" width="160%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="${frame % 8}" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="34" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="3.5"/>
      </filter>
      <filter id="speck" x="-15%" y="-15%" width="130%" height="130%">
        <feGaussianBlur stdDeviation="1.4"/>
      </filter>
    </defs>
    <g filter="url(#storm)">${clouds.join('')}</g>
    <g filter="url(#speck)">${dirt}</g>
  </svg>`);
}

const buddy = await fit(join(clipDir, 'buddy-full-neutral.jpg'));
const superbud = await fit(join(clipDir, 'superbud-full-body.jpg'));
const only = process.env.FRAME === undefined ? null : Number(process.env.FRAME);
if (only === null) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
for (let frame = 0; frame < FRAMES; frame += 1) {
  if (only !== null && frame !== only) continue;
  const dog = frame >= 58 ? superbud : buddy;
  const cones = stage(frame);
  const layers = [];
  if (cones) layers.push({ input: windSvg(cones, frame), left: 0, top: 0 });
  await sharp(dog, { raw: { width: W, height: H, channels: 4 } })
    .composite(layers)
    .png()
    .toFile(join(outDir, `f${String(frame).padStart(3, '0')}.png`));
  if (frame % 12 === 0) console.log('frame', frame);
}

console.log(outDir);
