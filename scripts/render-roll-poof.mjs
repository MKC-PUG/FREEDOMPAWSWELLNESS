/**
 * Retired drawn shake. Do not render this over public/clips/roll-poof.mp4.
 * The locked desk cut is the outdoor shiver and gold smoke master.
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
const FRAMES = 156;

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

function isBackground(src, x, y) {
  const i = (y * W + x) * 4;
  const r = src[i];
  const g = src[i + 1];
  const b = src[i + 2];
  const sky = (b > r + 8 && b > 100) || (y < H * 0.32 && r > 215 && g > 200 && b > 185);
  const ground = y > H * 0.9 && r > 55 && b < r - 8 && g < 155;
  return sky || ground;
}

function dogMask(src) {
  const mask = new Uint8Array(W * H);
  const qx = new Int32Array(W * H);
  const qy = new Int32Array(W * H);
  let qs = 0;
  let qe = 0;
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (mask[p] || isBackground(src, x, y)) return;
    mask[p] = 1;
    qx[qe] = x;
    qy[qe] = y;
    qe += 1;
  };
  push(Math.round(W / 2), Math.round(H * 0.42));
  push(Math.round(W / 2), Math.round(H * 0.62));
  while (qs < qe) {
    const x = qx[qs];
    const y = qy[qs];
    qs += 1;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  const grown = new Uint8Array(mask);
  for (let y = 1; y < H - 1; y += 1) {
    for (let x = 1; x < W - 1; x += 1) {
      const p = y * W + x;
      if (mask[p] || mask[p - 1] || mask[p + 1] || mask[p - W] || mask[p + W]) grown[p] = 1;
    }
  }
  return grown;
}

function plateBehind(src, mask) {
  const out = Buffer.from(src);
  for (let y = 0; y < H; y += 1) {
    let left = -1;
    let right = -1;
    for (let x = 0; x < W; x += 1) {
      if (!mask[y * W + x]) {
        if (left < 0) left = x;
        right = x;
      }
    }
    if (left < 0) continue;
    for (let x = 0; x < W; x += 1) {
      if (!mask[y * W + x]) continue;
      const use = Math.abs(x - left) < Math.abs(x - right) ? left : right;
      const si = (y * W + use) * 4;
      const di = (y * W + x) * 4;
      out[di] = src[si];
      out[di + 1] = src[si + 1];
      out[di + 2] = src[si + 2];
    }
  }
  return out;
}

function shiver(src, mask, behind, dx, dy, rot) {
  const out = Buffer.from(behind);
  const cx = W / 2;
  const cy = H * 0.5;
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const dx0 = x - dx - cx;
      const dy0 = y - dy - cy;
      const sx = cx + dx0 * cos + dy0 * sin;
      const sy = cy - dx0 * sin + dy0 * cos;
      const ix = Math.round(sx);
      const iy = Math.round(sy);
      if (ix < 0 || iy < 0 || ix >= W || iy >= H || !mask[iy * W + ix]) continue;
      const rgb = sample(src, sx, sy);
      const di = (y * W + x) * 4;
      out[di] = rgb[0];
      out[di + 1] = rgb[1];
      out[di + 2] = rgb[2];
    }
  }
  return out;
}

function shiverAt(frame) {
  if (frame < 18 || frame > 76) return null;
  const t = (frame - 18) / FPS;
  const u = Math.min(1, (frame - 18) / 50);
  const amp = 1.2 + u * u * 13;
  const freq = 13 + u * 5;
  return {
    amp,
    x: Math.sin(t * Math.PI * 2 * freq) * amp,
    y: Math.cos(t * Math.PI * 2 * freq * 1.37) * amp * 0.7,
    rot: Math.sin(t * Math.PI * 2 * freq * 0.73) * (0.004 + u * 0.018),
  };
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

function bombAt(frame) {
  if (frame < 32) return null;
  if (frame < 72) {
    const u = (frame - 32) / 40;
    const cover = u * u * (3 - 2 * u);
    return { spread: 0.12 + cover * 1.08, fade: Math.min(1, cover * 1.3), cover };
  }
  if (frame < 90) return { spread: 1.2, fade: 1, cover: 1 };
  if (frame < 150) {
    const u = (frame - 90) / 60;
    const ease = u * u * (3 - 2 * u);
    return { spread: 1.2 + ease * 0.08, fade: 1 - ease, cover: 1 - ease };
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

function mix(a, b, t) {
  const out = Buffer.alloc(a.length);
  const inv = 1 - t;
  for (let i = 0; i < a.length; i += 4) {
    out[i] = a[i] * inv + b[i] * t;
    out[i + 1] = a[i + 1] * inv + b[i + 1] * t;
    out[i + 2] = a[i + 2] * inv + b[i + 2] * t;
    out[i + 3] = 255;
  }
  return out;
}

function twistAt(frame) {
  if (frame < 16 || frame > 78) return null;
  const t = (frame - 16) / FPS;
  const u = Math.min(1, (frame - 16) / 52);
  const freq = 3.4 + u * 2.1;
  const wave = Math.sin(t * Math.PI * 2 * freq);
  const reach = Math.abs(wave) ** 0.55;
  const gate = 0.78 - u * 0.28;
  return { side: wave >= 0 ? 'left' : 'right', amount: reach > gate ? 1 : 0 };
}

function poseFor(frame) {
  return frame < 82 ? 'buddy' : 'super';
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

function motionBlur(src, radius) {
  const out = Buffer.alloc(src.length);
  const r = Math.max(2, Math.round(radius));
  const taps = [];
  let wsum = 0;
  for (let d = -r; d <= r; d += 2) {
    const w = r + 1 - Math.abs(d);
    taps.push([d, w]);
    wsum += w;
  }
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      let red = 0;
      let green = 0;
      let blue = 0;
      for (let i = 0; i < taps.length; i += 1) {
        const sx = Math.max(0, Math.min(W - 1, x + taps[i][0]));
        const si = (y * W + sx) * 4;
        const w = taps[i][1];
        red += src[si] * w;
        green += src[si + 1] * w;
        blue += src[si + 2] * w;
      }
      const di = (y * W + x) * 4;
      out[di] = red / wsum;
      out[di + 1] = green / wsum;
      out[di + 2] = blue / wsum;
      out[di + 3] = 255;
    }
  }
  return out;
}

const buddy = await fit(join(clipDir, 'buddy-full-neutral.jpg'));
const whipLeft = await fit(join(clipDir, 'buddy-shake-left.jpg'));
const whipRight = await fit(join(clipDir, 'buddy-shake-right.jpg'));
const superbud = await fit(join(clipDir, 'superbud-full-body.jpg'));

for (let frame = 0; frame < FRAMES; frame += 1) {
  const twist = twistAt(frame);
  let dog;
  if (poseFor(frame) === 'super') dog = superbud;
  else if (!twist || twist.amount < 0.04) dog = buddy;
  else {
    const u = Math.min(1, Math.max(0, (frame - 16) / 52));
    const plate = twist.side === 'left' ? whipLeft : whipRight;
    dog = motionBlur(plate, 6 + u * 16);
  }
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
