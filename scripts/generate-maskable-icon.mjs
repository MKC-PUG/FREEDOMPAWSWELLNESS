#!/usr/bin/env node
/**
 * Builds icon-maskable-512.png — logo centered in maskable safe zone (80%).
 * Requires: npm install sharp (devDependency) OR run once on machine with sharp.
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public/images/icon-512.png');
const out = join(root, 'public/images/icon-maskable-512.png');

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('sharp not installed — skip maskable icon generation (use existing icon-512.png)');
    process.exit(0);
  }

  if (!existsSync(src)) {
    console.error('Missing', src);
    process.exit(1);
  }

  const size = 512;
  const inner = Math.round(size * 0.72);
  const logo = await sharp(src).resize(inner, inner, { fit: 'contain' }).png().toBuffer();
  const pad = Math.round((size - inner) / 2);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 10, g: 20, b: 40, alpha: 1 },
    },
  })
    .composite([{ input: logo, top: pad, left: pad }])
    .png()
    .toFile(out);

  console.log('Wrote', out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
