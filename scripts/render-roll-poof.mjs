/**
 * First roll-and-poof cut. Locked photos only. The gold puff hides the change.
 * Buddy's plate dips, the puff covers him, the locked SuperBud host is revealed.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const outDir = join(root, 'tmp/roll-poof-frames');
const W = 720;
const H = 1280;
const FPS = 24;
const FRAMES = 72;

const buddyPath = join(root, 'public/images/brand/friends/buddy-front.jpg');
const hostPath = join(root, 'public/images/brand/sb-host-front-canon.png');

function puffSvg(size) {
  const c = size / 2;
  return Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="b" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="${Math.round(size * 0.035)}"/>
      </filter>
    </defs>
    <g filter="url(#b)">
      <ellipse cx="${c}" cy="${c + size * 0.04}" rx="${size * 0.38}" ry="${size * 0.32}" fill="#F5C242"/>
      <ellipse cx="${c - size * 0.16}" cy="${c - size * 0.08}" rx="${size * 0.24}" ry="${size * 0.2}" fill="#FFE7A0"/>
      <ellipse cx="${c + size * 0.18}" cy="${c - size * 0.1}" rx="${size * 0.22}" ry="${size * 0.18}" fill="#E8A317"/>
    </g>
    <ellipse cx="${c}" cy="${c}" rx="${size * 0.28}" ry="${size * 0.34}" fill="#F5C242"/>
    <ellipse cx="${c}" cy="${c - size * 0.04}" rx="${size * 0.16}" ry="${size * 0.14}" fill="#FFE7A0"/>
  </svg>`);
}

async function coverAt(file, zoom, dip) {
  const meta = await sharp(file).metadata();
  const srcW = meta.width;
  const srcH = meta.height;
  const targetRatio = W / H;
  const srcRatio = srcW / srcH;
  let cropW;
  let cropH;
  if (srcRatio > targetRatio) {
    cropH = srcH;
    cropW = Math.round(srcH * targetRatio);
  } else {
    cropW = srcW;
    cropH = Math.round(srcW / targetRatio);
  }
  cropW = Math.max(2, Math.round(cropW / zoom));
  cropH = Math.max(2, Math.round(cropH / zoom));
  const left = Math.max(0, Math.min(srcW - cropW, Math.round((srcW - cropW) / 2)));
  const top = Math.max(0, Math.min(srcH - cropH, Math.round((srcH - cropH) / 2 + dip * srcH)));
  return sharp(file)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(W, H)
    .png()
    .toBuffer();
}

function ease(t) {
  return t * t * (3 - 2 * t);
}

mkdirSync(outDir, { recursive: true });
const puffMaster = await sharp(puffSvg(900)).png().toBuffer();

for (let i = 0; i < FRAMES; i += 1) {
  const t = i / (FRAMES - 1);
  let file = buddyPath;
  let zoom = 1;
  let dip = 0;
  let puffScale = 0;
  let puffOpacity = 0;

  if (t < 0.22) {
    const u = ease(t / 0.22);
    dip = u * 0.08;
    zoom = 1 + u * 0.06;
  } else if (t < 0.46) {
    const u = ease((t - 0.22) / 0.24);
    dip = 0.08;
    zoom = 1.06;
    puffScale = 0.55 + u * 1.35;
    puffOpacity = Math.min(1, u * 1.2);
  } else if (t < 0.58) {
    file = t < 0.52 ? buddyPath : hostPath;
    dip = 0.08;
    zoom = 1.06;
    puffScale = 1.9;
    puffOpacity = 1;
  } else if (t < 0.8) {
    const u = ease((t - 0.58) / 0.22);
    file = hostPath;
    zoom = 1.08 - u * 0.08;
    dip = 0.04 * (1 - u);
    puffScale = 1.9 - u * 1.5;
    puffOpacity = 1 - u;
  } else {
    file = hostPath;
  }

  const layers = [];
  if (puffOpacity > 0.02 && puffScale > 0.05) {
    const size = Math.round(900 * puffScale);
    const mask = Buffer.from([255, 255, 255, Math.round(puffOpacity * 255)]);
    let puff = await sharp(puffMaster)
      .resize(size, size)
      .ensureAlpha()
      .composite([
        {
          input: mask,
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: 'dest-in',
        },
      ])
      .png()
      .toBuffer();
    let left = Math.round((W - size) / 2);
    let top = Math.round(H * 0.34 - size / 2);
    if (left < 0 || top < 0 || left + size > W || top + size > H) {
      const cropLeft = Math.max(0, -left);
      const cropTop = Math.max(0, -top);
      const cropW = Math.min(size - cropLeft, W - Math.max(0, left));
      const cropH = Math.min(size - cropTop, H - Math.max(0, top));
      puff = await sharp(puff).extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH }).png().toBuffer();
      left = Math.max(0, left);
      top = Math.max(0, top);
    }
    layers.push({ input: puff, left, top });
  }

  const base = await coverAt(file, zoom, dip);
  await sharp(base)
    .composite(layers)
    .png()
    .toFile(join(outDir, `f${String(i).padStart(3, '0')}.png`));
}

console.log(outDir);
