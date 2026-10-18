/**
 * SuperBud fly and land. First cut. Not locked.
 * He is alone over the lake. The picture drifts, then he lowers toward the shore.
 * The crowd of dogs is not in this cut. The forest still is not in this cut.
 */
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const outDir = join(root, 'tmp/fly-land-frames');
const clipDir = join(root, 'public/images/brand/clips');
const W = 720;
const H = 1280;
const FRAMES = 156;
const BG_W = 980;

function fadeSvg(w, h) {
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset="0.2" stop-color="#fff" stop-opacity="1"/>
        <stop offset="0.94" stop-color="#fff" stop-opacity="1"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`);
}

async function loadShot(file, sky, ground) {
  const src = sharp(file);
  const meta = await src.metadata();
  const photoW = W;
  const photoH = Math.round((meta.height * photoW) / meta.width);
  const photo = await sharp(file).resize(photoW, photoH).ensureAlpha().png().toBuffer();
  const faded = await sharp(photo)
    .composite([{ input: fadeSvg(photoW, photoH), blend: 'dest-in' }])
    .png()
    .toBuffer();

  const skyBand = await sharp(file)
    .extract(sky)
    .resize(BG_W, 760, { fit: 'fill' })
    .blur(10)
    .png()
    .toBuffer();
  const groundTile = await sharp(file).extract(ground).resize(BG_W, 190, { fit: 'fill' }).png().toBuffer();
  const groundFlip = await sharp(groundTile).flip().png().toBuffer();
  const groundBand = await sharp({
    create: { width: BG_W, height: 760, channels: 3, background: '#6d7a4a' },
  })
    .composite([
      { input: groundTile, top: 0, left: 0 },
      { input: groundFlip, top: 190, left: 0 },
      { input: groundTile, top: 380, left: 0 },
      { input: groundFlip, top: 570, left: 0 },
    ])
    .blur(22)
    .png()
    .toBuffer();
  const background = await sharp({
    create: { width: BG_W, height: H, channels: 3, background: '#8aa0b0' },
  })
    .composite([
      { input: skyBand, top: 0, left: 0 },
      { input: groundBand, top: H - 760, left: 0 },
    ])
    .png()
    .toBuffer();

  return { faded, photoW, photoH, background };
}

function shotAt(frame) {
  const u = frame / (FRAMES - 1);
  const drift = u < 0.42 ? u / 0.42 : 1;
  const drop = u < 0.38 ? 0 : (u - 0.38) / 0.62;
  const ease = drop * drop * (3 - 2 * drop);
  return {
    which: 'lake',
    y: Math.round(150 + ease * 640),
    pan: Math.round(drift * 200),
  };
}

const lake = await loadShot(join(clipDir, 'superbud-fly-lake.jpg'), { left: 0, top: 0, width: 700, height: 110 }, {
  left: 420,
  top: 545,
  width: 560,
  height: 76,
});

const only = process.env.FRAME === undefined ? null : Number(process.env.FRAME);
if (only === null) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
} else {
  mkdirSync(outDir, { recursive: true });
}

for (let frame = 0; frame < FRAMES; frame += 1) {
  if (only !== null && frame !== only) continue;
  const shot = shotAt(frame);
  const plate = lake;
  const top = Math.max(0, Math.min(H - plate.photoH, shot.y));
  const bgLeft = Math.max(0, Math.min(BG_W - W, shot.pan));
  const bg = await sharp(plate.background).extract({ left: bgLeft, top: 0, width: W, height: H }).png().toBuffer();
  await sharp(bg)
    .composite([{ input: plate.faded, left: 0, top }])
    .png()
    .toFile(join(outDir, `f${String(frame).padStart(3, '0')}.png`));
  if (frame % 12 === 0) console.log('frame', frame);
}

console.log(outDir);
