#!/usr/bin/env node
/**
 * Draft cape cutouts from existing Freedom Paws hero / protocol art.
 *
 * Output is a STARTING POINT — open in Canva or Photopea, erase dog body / text,
 * clean edges, then save as:
 *   public/images/photobooth/stickers/sticker-cape-superbud.png
 *   public/images/photobooth/stickers/sticker-cape-patriotic.png
 *
 * The Photo Booth loads .png first, then falls back to .svg placeholders.
 *
 * Usage: node scripts/extract-cape-draft.mjs
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public/images/photobooth/stickers');

/** Keep pixels that look like red cape fabric; everything else → transparent. */
function redCapeAlpha(data) {
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const isRed = r > 90 && r > g * 1.15 && r > b * 1.15 && r - Math.min(g, b) > 25;
    const isDarkRed = r > 60 && r > g && r > b && r + g + b < 380;
    const keep = isRed || isDarkRed;
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = keep ? Math.min(255, Math.max(80, r - Math.min(g, b) + 100)) : 0;
  }
  return out;
}

async function extractRedCape(inputRel, crop, outName) {
  const input = path.join(root, inputRel);
  const cropped = await sharp(input)
    .extract(crop)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
  const rgba = redCapeAlpha(data);
  const outPath = path.join(outDir, outName);
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(outPath);
  console.log('✓', outPath, `(${info.width}×${info.height})`);
}

const sources = [
  {
    input: 'public/images/superbud-hero.png',
    crop: { left: 430, top: 300, width: 320, height: 380 },
    out: 'sticker-cape-superbud-draft.png',
    note: 'Center pug — best “real” satin cape. Crop includes chest logo; erase in editor.',
  },
  {
    input: 'public/images/protocols/max-movement.png',
    crop: { left: 180, top: 80, width: 280, height: 220 },
    out: 'sticker-cape-max-movement-draft.png',
    note: 'Flying SuperBud — flowing cape + “Super” text. Paint out text for clean sticker.',
  },
  {
    input: 'public/images/protocols/patriot-immune.png',
    crop: { left: 120, top: 60, width: 320, height: 240 },
    out: 'sticker-cape-patriotic-draft.png',
    note: 'Patriot Immune — flag cape for Patriot Pup theme.',
  },
];

console.log('Extracting draft cape PNGs (manual cleanup required)…\n');
for (const s of sources) {
  console.log(s.note);
  await extractRedCape(s.input, s.crop, s.out);
  console.log('');
}
console.log('Done. Rename polished files to sticker-cape-superbud.png etc. when ready.');
