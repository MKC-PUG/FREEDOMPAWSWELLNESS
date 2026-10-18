/**
 * Buddy to SuperBud. Second tornado cut. Not locked.
 * A small cone starts at each paw, narrow at the ground and wide at the top.
 * The four whirl and join into one cone. That cone grows until it covers
 * Buddy, then lifts off to the upper left. SuperBud is standing as it goes.
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

function wedge(cx, footY, topY, baseHalf, topHalf) {
  const midY = footY - (footY - topY) * 0.5;
  const midHalf = (baseHalf + topHalf) * 0.5;
  return `M ${(cx - baseHalf).toFixed(1)} ${footY.toFixed(1)}
    Q ${(cx - midHalf).toFixed(1)} ${midY.toFixed(1)}, ${(cx - topHalf).toFixed(1)} ${topY.toFixed(1)}
    L ${(cx + topHalf).toFixed(1)} ${topY.toFixed(1)}
    Q ${(cx + midHalf).toFixed(1)} ${midY.toFixed(1)}, ${(cx + baseHalf).toFixed(1)} ${footY.toFixed(1)} Z`;
}

function stage(frame) {
  if (frame < 14 || frame > 176) return null;
  if (frame < 58) {
    const u = (frame - 14) / 44;
    return PAWS.map((paw, i) => ({
      x: paw.x,
      y: paw.y,
      h: 32 + u * 160,
      base: 5 + u * 5,
      top: 16 + u * 40,
      spin: frame * 0.62 + i * 1.5,
      fade: 0.5 + u * 0.45,
    }));
  }
  if (frame < 96) {
    const u = (frame - 58) / 38;
    return PAWS.map((paw, i) => ({
      x: paw.x + (W / 2 - paw.x) * u,
      y: paw.y + (1268 - paw.y) * u,
      h: 192 + u * 430,
      base: 10 + u * 16,
      top: 56 + u * 130,
      spin: frame * 0.75 + i,
      fade: 0.94,
    }));
  }
  if (frame < 132) {
    const u = (frame - 96) / 36;
    return [
      {
        x: W / 2,
        y: 1270,
        h: 860 + u * 800,
        base: 190 + u * 30,
        top: 430 + u * 140,
        spin: frame * 0.85,
        fade: 1,
        wobble: 0,
      },
    ];
  }
  const u = (frame - 132) / 44;
  const ease = u * u;
  return [
    {
      x: W / 2 - ease * 1100,
      y: 1270 - ease * 1800,
      h: 1620,
      base: 160,
      top: 480,
      spin: frame * 0.9,
      fade: 1,
      wobble: 2,
      tilt: -24 * u,
    },
  ];
}

function windSvg(cones) {
  const groups = cones.map((cone) => {
    const topY = cone.y - cone.h;
    const tilt = (Math.sin(cone.spin) * (cone.wobble ?? 8) + (cone.tilt || 0)).toFixed(2);
    const rings = [];
    for (let i = 0; i < 8; i += 1) {
      const t = (i + 0.6) / 8;
      const y = cone.y - cone.h * t;
      const half = cone.base + (cone.top - cone.base) * t;
      const x = cone.x + Math.sin(cone.spin * 1.3 + i * 0.9) * half * 0.28;
      const color = i % 2 === 0 ? '#FFF6E4' : '#F0C24A';
      rings.push(
        `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(half * 0.92).toFixed(1)}" ry="${(3 + t * 6).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(1.4 + t * 2.2).toFixed(1)}" opacity="0.9"/>`,
      );
    }
    const body = wedge(cone.x, cone.y, topY, cone.base, cone.top);
    const core = wedge(cone.x, cone.y, topY + cone.h * 0.04, cone.base * 0.45, cone.top * 0.55);
    return `<g opacity="${cone.fade.toFixed(3)}" transform="rotate(${tilt} ${cone.x.toFixed(1)} ${cone.y.toFixed(1)})">
      <path d="${body}" fill="#E7D3A6"/>
      <path d="${core}" fill="#B99255" opacity="0.55"/>
      ${rings.join('')}
    </g>`;
  });
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="soft" x="-30%" y="-20%" width="160%" height="140%">
        <feGaussianBlur stdDeviation="1.3"/>
      </filter>
    </defs>
    <g filter="url(#soft)">${groups.join('')}</g>
  </svg>`);
}

const buddy = await fit(join(clipDir, 'buddy-full-neutral.jpg'));
const superbud = await fit(join(clipDir, 'superbud-full-body.jpg'));
const only = process.env.FRAME === undefined ? null : Number(process.env.FRAME);
if (only === null) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
for (let frame = 0; frame < FRAMES; frame += 1) {
  if (only !== null && frame !== only) continue;
  const dog = frame >= 128 ? superbud : buddy;
  const cones = stage(frame);
  const layers = [];
  if (cones) layers.push({ input: windSvg(cones), left: 0, top: 0 });
  await sharp(dog, { raw: { width: W, height: H, channels: 4 } })
    .composite(layers)
    .png()
    .toFile(join(outDir, `f${String(frame).padStart(3, '0')}.png`));
  if (frame % 12 === 0) console.log('frame', frame);
}

console.log(outDir);
