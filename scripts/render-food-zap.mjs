/**
 * Food zap. First cut. Not locked.
 * The locked host still sends a gold beam from the shield to a bowl of ordinary food.
 * The face is not redrawn. The stray is not in this cut. There is no recipient yet.
 */
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const host = join(root, 'public/images/brand/sb-host-front-canon.png');
const outDir = join(root, 'tmp/food-zap-frames');
const W = 720;
const H = 1280;
const FRAMES = 72;

const SHIELD = { x: 360, y: 980 };
const BOWL = { x: 390, y: 1210 };

function lerp(a, b, u) {
  return a + (b - a) * u;
}

function ease(u) {
  const t = Math.min(1, Math.max(0, u));
  return t * t * (3 - 2 * t);
}

async function fittedHost() {
  const meta = await sharp(host).metadata();
  const scale = Math.max(W / meta.width, H / meta.height);
  const rw = Math.round(meta.width * scale);
  const rh = Math.round(meta.height * scale);
  const left = Math.min(rw - W, Math.max(0, Math.round((rw - W) / 2) - 48));
  const top = Math.min(rh - H, Math.max(0, Math.round((rh - H) / 2)));
  return sharp(host).resize(rw, rh).extract({ left, top, width: W, height: H }).png().toBuffer();
}

function overlay(frame) {
  const bowlIn = ease(frame / 14);
  const beamU = frame < 16 ? 0 : ease((frame - 16) / 28);
  const beamFade = frame < 56 ? 1 : 1 - ease((frame - 56) / 16);
  const glow = beamU * beamFade;
  const tipX = lerp(SHIELD.x, BOWL.x, beamU);
  const tipY = lerp(SHIELD.y, BOWL.y, beamU);
  const sparks = [];
  for (let i = 0; i < 7; i += 1) {
    const along = beamU * (0.15 + i * 0.12);
    if (along <= 0) continue;
    const wobble = Math.sin(frame * 0.45 + i) * 10;
    const x = lerp(SHIELD.x, BOWL.x, along) + wobble;
    const y = lerp(SHIELD.y, BOWL.y, along);
    sparks.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(4 + (i % 3) * 2).toFixed(1)}" fill="#FFE08A"/>`,
    );
  }
  const kibble = [
    [0, 6, 18],
    [-36, 2, 15],
    [34, 0, 16],
    [-16, 16, 13],
    [18, 16, 14],
    [-52, 12, 12],
    [50, 12, 13],
    [0, 18, 12],
  ]
    .map(([x, y, r], i) => {
      const fill = i % 2 === 0 ? '#A67C2D' : '#C9842A';
      return `<ellipse cx="${BOWL.x + x}" cy="${BOWL.y - 18 + y}" rx="${r}" ry="${(r * 0.72).toFixed(1)}" fill="${fill}"/>`;
    })
    .join('');

  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFE08A"/>
        <stop offset="0.55" stop-color="#F6C84A"/>
        <stop offset="1" stop-color="#C9842A"/>
      </linearGradient>
      <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="8"/>
      </filter>
    </defs>
    <g opacity="${(glow * 0.85).toFixed(3)}" filter="url(#soft)">
      <line x1="${SHIELD.x}" y1="${SHIELD.y}" x2="${tipX.toFixed(1)}" y2="${tipY.toFixed(1)}" stroke="#F6C84A" stroke-width="54" stroke-linecap="round"/>
    </g>
    <line x1="${SHIELD.x}" y1="${SHIELD.y}" x2="${tipX.toFixed(1)}" y2="${tipY.toFixed(1)}" stroke="url(#beam)" stroke-width="22" stroke-linecap="round" opacity="${glow.toFixed(3)}"/>
    <g opacity="${(glow * 0.9).toFixed(3)}">${sparks.join('')}</g>
    <g opacity="${bowlIn.toFixed(3)}">
      <ellipse cx="${BOWL.x}" cy="${BOWL.y + 22}" rx="150" ry="26" fill="#1F2937" opacity="0.35"/>
      <ellipse cx="${BOWL.x}" cy="${BOWL.y}" rx="146" ry="48" fill="#C5CCD6"/>
      <ellipse cx="${BOWL.x}" cy="${BOWL.y + 6}" rx="146" ry="36" fill="#8B939E"/>
      <ellipse cx="${BOWL.x}" cy="${BOWL.y - 6}" rx="118" ry="32" fill="#3F4752"/>
      ${kibble}
      <ellipse cx="${BOWL.x}" cy="${BOWL.y - 18}" rx="132" ry="18" fill="none" stroke="#F3F4F6" stroke-width="8"/>
      <ellipse cx="${BOWL.x}" cy="${BOWL.y - 10}" rx="46" ry="16" fill="#FFE08A" opacity="${(glow * 0.55).toFixed(3)}"/>
    </g>
    <circle cx="${SHIELD.x}" cy="${SHIELD.y}" r="${(10 + glow * 8).toFixed(1)}" fill="#FFE08A" opacity="${(glow * 0.8).toFixed(3)}"/>
  </svg>`);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const plate = await fittedHost();
for (let frame = 0; frame < FRAMES; frame += 1) {
  await sharp(plate)
    .composite([{ input: overlay(frame), top: 0, left: 0 }])
    .png()
    .toFile(join(outDir, `f${String(frame).padStart(3, '0')}.png`));
  if (frame % 18 === 0) console.log('frame', frame);
}
console.log('frames', FRAMES, outDir);
