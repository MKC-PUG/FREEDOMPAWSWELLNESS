/**
 * Buddy to SuperBud. Not locked.
 * He stands on all four legs, the shake triggers the change, a sparkling
 * gold cloud blows up around him, then SuperBud is standing.
 */
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const outDir = join(root, 'tmp/roll-poof-frames');
const clipDir = join(root, 'public/images/brand/clips');
const W = 720;
const H = 1280;
const FPS = 24;
const FRAMES = 120;
const BG = { r: 232, g: 228, b: 224 };
const KEY = { r: 222, g: 218, b: 217 };

function ease(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function starPath(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 8; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.28;
    const a = -Math.PI / 2 + (i * Math.PI) / 4;
    points.push(`${(cx + Math.cos(a) * radius).toFixed(1)},${(cy + Math.sin(a) * radius).toFixed(1)}`);
  }
  return points.join(' ');
}

async function cutout(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const i = (y * info.width + x) * 4;
      const dr = data[i] - KEY.r;
      const dg = data[i + 1] - KEY.g;
      const db = data[i + 2] - KEY.b;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist < 26) data[i + 3] = 0;
      else if (dist < 46) data[i + 3] = Math.round(((dist - 26) / 20) * 255);
      if (data[i + 3] > 40) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  const width = Math.max(2, maxX - minX + 1);
  const height = Math.max(2, maxY - minY + 1);
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: minX, top: minY, width, height })
    .png()
    .toBuffer();
}

async function plate(file) {
  const cut = await cutout(file);
  const meta = await sharp(cut).metadata();
  const maxH = Math.round(H * 0.74);
  const maxW = Math.round(W * 0.86);
  const scale = Math.min(maxW / meta.width, maxH / meta.height);
  const targetW = Math.max(2, Math.round(meta.width * scale));
  const targetH = Math.max(2, Math.round(meta.height * scale));
  const resized = await sharp(cut).resize(targetW, targetH).png().toBuffer();
  const left = Math.round((W - targetW) / 2);
  const top = Math.round((H - targetH) / 2);
  return sharp({
    create: { width: W, height: H, channels: 4, background: { ...BG, alpha: 1 } },
  })
    .composite([{ input: resized, left, top }])
    .png()
    .toBuffer();
}

function cloudSvg(scale, opacity, frame, sparkleOnly) {
  const cx = W / 2;
  const cy = H * 0.48;
  const R = 560 * scale;
  const blobs = [];
  for (let i = 0; i < 22; i += 1) {
    const a = (i / 22) * Math.PI * 2 + frame * 0.07;
    const ring = 0.08 + (i % 6) * 0.1;
    const x = cx + Math.cos(a) * R * ring;
    const y = cy + Math.sin(a) * R * ring * 0.9;
    const rx = R * (0.28 + (i % 4) * 0.05);
    const ry = rx * (0.8 + (i % 3) * 0.08);
    const fill = ['#FFF6D0', '#F6C84A', '#FFE08A', '#E8A317'][i % 4];
    blobs.push(
      `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${fill}"/>`,
    );
  }
  const stars = [];
  for (let i = 0; i < 48; i += 1) {
    const a = (i / 48) * Math.PI * 2 + frame * (i % 2 === 0 ? 0.2 : -0.14);
    const ring = 0.55 + (i % 6) * 0.08;
    const x = cx + Math.cos(a) * R * ring;
    const y = cy + Math.sin(a) * R * ring * 0.92;
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.9 + i * 1.7));
    const r = 4 + (i % 5) * 2.6;
    const fill = i % 3 === 0 ? '#FFFFFF' : '#FFF4C2';
    stars.push(
      `<polygon points="${starPath(x, y, r)}" fill="${fill}" opacity="${(twinkle * Math.min(1, opacity + 0.35)).toFixed(3)}"/>`,
    );
  }
  const mist = sparkleOnly
    ? ''
    : `<g filter="url(#mist)" opacity="${opacity.toFixed(3)}">
      ${blobs.join('')}
      <ellipse cx="${cx}" cy="${cy}" rx="${(R * 0.78).toFixed(1)}" ry="${(R * 0.95).toFixed(1)}" fill="#F5C242"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${(R * 0.5).toFixed(1)}" ry="${(R * 0.62).toFixed(1)}" fill="#FFE08A"/>
    </g>`;
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="mist" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="26"/>
      </filter>
    </defs>
    ${mist}
    ${stars.join('')}
  </svg>`);
}

function poseFor(frame) {
  if (frame < 24) return 'neutral';
  if (frame < 58) {
    const u = (frame - 24) / 34;
    const period = Math.max(2, Math.round(6 - u * 4));
    const n = Math.floor((frame - 24) / period);
    return n % 2 === 0 ? 'left' : 'right';
  }
  if (frame < 78) return 'neutral';
  return 'super';
}

function cloudAt(frame) {
  if (frame < 52) return { scale: 0, opacity: 0, sparkle: false };
  if (frame < 58) {
    const u = (frame - 52) / 6;
    return { scale: 0.28, opacity: 0.2 + u * 0.25, sparkle: true };
  }
  if (frame < 74) {
    const u = ease((frame - 58) / 16);
    return { scale: 0.34 + u * 0.86, opacity: Math.min(1, u * 1.35), sparkle: false };
  }
  if (frame < 88) return { scale: 1.2, opacity: 1, sparkle: false };
  if (frame < 112) {
    const u = ease((frame - 88) / 24);
    return { scale: 1.2 + u * 0.9, opacity: 1 - u, sparkle: false };
  }
  return { scale: 0, opacity: 0, sparkle: false };
}

mkdirSync(outDir, { recursive: true });

const plates = {
  neutral: await plate(join(clipDir, 'buddy-full-neutral.jpg')),
  left: await plate(join(clipDir, 'buddy-shake-left.jpg')),
  right: await plate(join(clipDir, 'buddy-shake-right.jpg')),
  super: await plate(join(clipDir, 'superbud-full-body.jpg')),
};

for (let i = 0; i < FRAMES; i += 1) {
  const name = poseFor(i);
  const { scale, opacity, sparkle } = cloudAt(i);
  const layers = [];
  if (i >= 24 && i < 58) {
    const smear = name === 'left' ? plates.right : plates.left;
    const faded = await sharp(smear)
      .ensureAlpha()
      .composite([
        {
          input: Buffer.from([255, 255, 255, 70]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: 'dest-in',
        },
      ])
      .png()
      .toBuffer();
    const shift = name === 'left' ? -18 : 18;
    layers.push({ input: faded, left: shift, top: 0 });
  }
  layers.push({ input: plates[name], left: 0, top: 0 });
  if (opacity > 0.02 && scale > 0.05) {
    layers.push({ input: cloudSvg(scale, opacity, i, sparkle), left: 0, top: 0 });
  }
  await sharp({
    create: { width: W, height: H, channels: 4, background: { ...BG, alpha: 1 } },
  })
    .composite(layers)
    .png()
    .toFile(join(outDir, `f${String(i).padStart(3, '0')}.png`));
  if (i % 12 === 0) console.log('frame', i);
}

console.log(outDir);
