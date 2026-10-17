/**
 * Buddy to SuperBud. Not locked.
 * Same face coloring as the locked SuperBud. He stands, the shake moves
 * continuously, then a gold smoke bomb goes off in front of him.
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
const FRAMES = 132;

function starPath(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 8; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.35;
    const a = -Math.PI / 2 + (i * Math.PI) / 4;
    points.push(`${(cx + Math.cos(a) * radius).toFixed(1)},${(cy + Math.sin(a) * radius).toFixed(1)}`);
  }
  return points.join(' ');
}

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

function findNeck(raw) {
  let top = H;
  let bottom = 0;
  for (let y = 0; y < H; y += 2) {
    for (let x = 40; x < W - 40; x += 4) {
      const i = (y * W + x) * 4;
      const r = raw[i];
      const g = raw[i + 1];
      const b = raw[i + 2];
      const sky = b > r + 18 && b > 130;
      const ground = y > H * 0.72 && r > 90 && r > b + 10 && g < 170;
      if (!sky && !ground) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  const span = Math.max(1, bottom - top);
  return {
    neckY: Math.round(top + span * 0.34),
    pinY: Math.round(top + span * 0.58),
    top,
    bottom,
  };
}

function sample(src, x, y) {
  const x0 = Math.max(0, Math.min(W - 1, Math.floor(x)));
  const y0 = Math.max(0, Math.min(H - 1, Math.floor(y)));
  const x1 = Math.min(W - 1, x0 + 1);
  const y1 = Math.min(H - 1, y0 + 1);
  const tx = Math.min(1, Math.max(0, x - x0));
  const ty = Math.min(1, Math.max(0, y - y0));
  const i00 = (y0 * W + x0) * 4;
  const i10 = (y0 * W + x1) * 4;
  const i01 = (y1 * W + x0) * 4;
  const i11 = (y1 * W + x1) * 4;
  const out = [0, 0, 0];
  for (let c = 0; c < 3; c += 1) {
    const a = src[i00 + c] * (1 - tx) + src[i10 + c] * tx;
    const b = src[i01 + c] * (1 - tx) + src[i11 + c] * tx;
    out[c] = a * (1 - ty) + b * ty;
  }
  return out;
}

function warp(src, phase, neckY, pinY) {
  const out = Buffer.from(src);
  const cx = W / 2;
  const angle = phase * 0.28;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const shift = phase * 96;
  const squash = 1 - Math.abs(phase) * 0.16;
  const yStart = Math.max(0, neckY - 420);
  for (let y = yStart; y < pinY; y += 1) {
    let t = y < neckY ? 1 : 1 - (y - neckY) / (pinY - neckY);
    t *= t;
    if (t < 0.002) continue;
    const aCos = 1 + (cos - 1) * t;
    const aSin = sin * t;
    const localShift = shift * t;
    const localSquash = 1 + (squash - 1) * t;
    for (let x = 0; x < W; x += 1) {
      const dx = (x - cx - localShift) / localSquash;
      const dy = y - neckY;
      const sx = cx + dx * aCos - dy * aSin;
      const sy = neckY + dx * aSin * t + dy;
      const rgb = sample(src, sx, sy);
      const di = (y * W + x) * 4;
      out[di] = rgb[0];
      out[di + 1] = rgb[1];
      out[di + 2] = rgb[2];
    }
  }
  return out;
}

function average(buffers) {
  const out = Buffer.alloc(W * H * 4);
  const n = buffers.length;
  for (let i = 0; i < W * H; i += 1) {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let k = 0; k < n; k += 1) {
      const p = i * 4;
      r += buffers[k][p];
      g += buffers[k][p + 1];
      b += buffers[k][p + 2];
    }
    const o = i * 4;
    out[o] = r / n;
    out[o + 1] = g / n;
    out[o + 2] = b / n;
    out[o + 3] = 255;
  }
  return out;
}

function shakePhase(frame) {
  if (frame < 22 || frame > 64) return 0;
  const time = (frame - 22) / FPS;
  const dur = (64 - 22) / FPS;
  const attack = Math.min(1, time / 0.16);
  const release = Math.min(1, (dur - time) / 0.2);
  const envelope = Math.min(attack, release);
  return envelope * Math.sin(time * Math.PI * 2 * 4.2);
}

function bombAt(frame) {
  if (frame < 66) return null;
  if (frame < 84) {
    const u = (frame - 66) / 18;
    const cover = u * u * (3 - 2 * u);
    return { spread: 0.22 + cover * 0.95, fade: Math.min(1, cover * 1.35), cover };
  }
  if (frame < 98) return { spread: 1.17, fade: 1, cover: 1 };
  if (frame < 122) {
    const u = (frame - 98) / 24;
    const ease = u * u * (3 - 2 * u);
    return { spread: 1.17 + ease * 0.55, fade: 1 - ease, cover: 1 - ease };
  }
  return null;
}

function smokeSvg(bomb, frame) {
  const cx = W / 2;
  const cy = H * 0.52;
  const { spread, fade } = bomb;
  const fills = ['#A86812', '#C9842A', '#E8A317', '#F6C84A', '#FFE08A'];
  const puffs = [];
  let n = 0;
  for (let row = -8; row <= 8; row += 1) {
    for (let col = -4; col <= 4; col += 1) {
      const wobble = Math.sin(n * 1.7 + frame * 0.3) * 22;
      const x = cx + (col * 62 + wobble) * (0.35 + spread * 0.75);
      const y = cy + (row * 48 + Math.cos(n * 1.3) * 16) * (0.35 + spread * 0.8);
      const rx = (70 + (n % 5) * 18) * (0.5 + spread * 0.6);
      const ry = rx * (0.62 + (n % 3) * 0.16);
      puffs.push(
        `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${fills[n % fills.length]}"/>`,
      );
      n += 1;
    }
  }
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="smoke" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="28"/>
      </filter>
    </defs>
    <g filter="url(#smoke)" opacity="${fade.toFixed(3)}">${puffs.join('')}</g>
  </svg>`);
}

function poseFor(frame) {
  return frame < 90 ? 'buddy' : 'super';
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const buddy = await fit(join(clipDir, 'buddy-full-neutral.jpg'));
const superbud = await fit(join(clipDir, 'superbud-full-body.jpg'));
const { neckY, pinY, top, bottom } = findNeck(buddy);
console.log('neck', neckY, 'pin', pinY, 'dog', top, bottom);

for (let frame = 0; frame < FRAMES; frame += 1) {
  const phase = shakePhase(frame);
  let dog;
  if (poseFor(frame) === 'super') dog = superbud;
  else dog = warp(buddy, phase, neckY, pinY);
  const bomb = bombAt(frame);
  const layers = [];
  if (bomb && bomb.fade > 0.02) layers.push({ input: smokeSvg(bomb, frame), left: 0, top: 0 });
  await sharp(dog, { raw: { width: W, height: H, channels: 4 } })
    .composite(layers)
    .png()
    .toFile(join(outDir, `f${String(frame).padStart(3, '0')}.png`));
  if (frame % 12 === 0) console.log('frame', frame);
}

console.log(outDir);
