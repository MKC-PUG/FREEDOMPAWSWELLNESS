/**
 * SuperBud fly and land. Second cut. Not locked.
 * Source: the founder's SuperBud FLYING movie, close pass only.
 * That pass has a flag on the outer cape and other dogs below him.
 * This cut stays on his face and chest: red cape, striped shirt, shield reading SuperBud.
 * The flag wing and the other dogs stay outside the frame.
 * He does not land. The side of the movie is a flag cape, so it is not in this cut.
 */
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const srcDir = join(root, 'tmp/fly-src/late');
const outDir = join(root, 'tmp/fly-land-frames');
const W = 720;
const H = 1280;

const files = readdirSync(srcDir)
  .filter((name) => /^f\d+\.jpg$/.test(name))
  .sort();
const first = 6;
const last = 12;
const hold = 8;

function lerp(a, b, u) {
  return a + (b - a) * u;
}

function windowFor(index, count) {
  const u = count <= 1 ? 0 : index / (count - 1);
  const ease = u * u * (3 - 2 * u);
  return {
    left: Math.round(lerp(520, 548, ease)),
    width: Math.round(lerp(500, 478, ease)),
    height: Math.round(lerp(640, 652, ease)),
  };
}

function fadeMask(height, fadeH) {
  const start = Math.max(0, (height - fadeH) / height);
  return Buffer.from(`<svg width="${W}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="${start}" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const chosen = files.slice(first - 1, last);
const total = chosen.length * hold;
let outIndex = 0;

for (let index = 0; index < chosen.length; index += 1) {
  const src = join(srcDir, chosen[index]);
  const win = windowFor(index, chosen.length);
  const meta = await sharp(src).metadata();
  const left = Math.max(0, Math.min(win.left, meta.width - win.width));
  const height = Math.min(win.height, meta.height);
  const plateH = Math.round(height * (W / win.width));
  const plate = await sharp(src)
    .extract({ left, top: 0, width: win.width, height })
    .resize(W, plateH)
    .png()
    .toBuffer();
  const bg = await sharp(src)
    .extract({ left: 900, top: 40, width: 360, height: 420 })
    .resize(W, H, { fit: 'cover' })
    .blur(42)
    .modulate({ brightness: 0.9, saturation: 0.85 })
    .png()
    .toBuffer();
  const faded = await sharp(plate)
    .composite([{ input: fadeMask(plateH, 200), blend: 'dest-in' }])
    .png()
    .toBuffer();
  const frame = await sharp(bg).composite([{ input: faded, top: 0, left: 0 }]).png().toBuffer();

  for (let copy = 0; copy < hold; copy += 1) {
    const t = total <= 1 ? 0 : outIndex / (total - 1);
    const zoom = 1 + 0.05 * t;
    const zw = Math.round(W / zoom);
    const zh = Math.round(H / zoom);
    const zx = Math.round((W - zw) / 2);
    const zy = Math.round((H - zh) * 0.35);
    await sharp(frame)
      .extract({ left: zx, top: zy, width: zw, height: zh })
      .resize(W, H)
      .png()
      .toFile(join(outDir, `f${String(outIndex).padStart(3, '0')}.png`));
    outIndex += 1;
  }
  console.log(chosen[index], 'left', left);
}

console.log('frames', outIndex, outDir);
