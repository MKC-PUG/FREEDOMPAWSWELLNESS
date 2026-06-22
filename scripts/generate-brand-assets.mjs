#!/usr/bin/env node
/**
 * Generate Freedom Paws brand assets.
 * Home-screen icons: paw-only, fills icon square (iOS label shows app name below).
 * Nav: paw mark PNG; title text rendered in BrandLogo component.
 */
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = join(root, 'public/images/brand');
const publicImages = join(root, 'public/images');
const docsBrand = join(process.env.HOME || '', 'Documents/Freedom Paws Wellness/brand');

const BRAND_NAVY = { r: 10, g: 20, b: 40, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

function listDir(dir) {
  try {
    return readdirSync(dir).map((f) => join(dir, f));
  } catch {
    return [];
  }
}

function findMasterSource() {
  const cursorAssets = join(
    process.env.HOME || '',
    '.cursor/projects/Users-valuedcustomer-freedompaws-app/assets'
  );
  const candidates = [
    join(root, 'assets/Freedom_Paws_Master_Logo.png'),
    ...listDir(join(root, 'assets')).filter((p) => /Freedom_Paws_Master_Logo/i.test(p)),
    ...listDir(cursorAssets).filter((p) => /Freedom_Paws_Master_Logo/i.test(p)),
    join(root, 'public/images/brand/logo-master-stacked.png'),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

function findAppThumbnailSource() {
  const cursorAssets = join(
    process.env.HOME || '',
    '.cursor/projects/Users-valuedcustomer-freedompaws-app/assets'
  );
  const candidates = [
    join(root, 'assets/Freedom_Paws_App_Thumbnail_Paw.png'),
    ...listDir(join(root, 'assets')).filter((p) => /App_Thumbnail_Paw|app_thumbnail.*Paw/i.test(p)),
    ...listDir(cursorAssets).filter((p) => /App_Thumbnail_Paw|app_thumbnail.*Paw/i.test(p)),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

async function main() {
  const sharp = (await import('sharp')).default;
  const src = findMasterSource();
  const thumbSrc = findAppThumbnailSource();

  if (!thumbSrc) {
    console.error('App thumbnail paw not found. Add assets/Freedom_Paws_App_Thumbnail_Paw.png');
    process.exit(1);
  }

  mkdirSync(brandDir, { recursive: true });

  let pawThumbBuf = await sharp(thumbSrc).ensureAlpha().png().toBuffer();
  try {
    pawThumbBuf = await sharp(pawThumbBuf).trim({ threshold: 18 }).png().toBuffer();
  } catch {
    /* keep full canvas */
  }

  const pawThumbPath = join(brandDir, 'logo-app-thumbnail-paw.png');
  await sharp(pawThumbBuf).toFile(pawThumbPath);
  await sharp(pawThumbBuf).toFile(join(brandDir, 'logo-paw.png'));

  await sharp(pawThumbBuf)
    .resize(40, 40, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toFile(join(brandDir, 'logo-paw-40.png'));

  if (src) {
    const masterBuf = await sharp(src).ensureAlpha().png().toBuffer();
    await sharp(masterBuf).toFile(join(brandDir, 'logo-master-stacked.png'));
    await sharp(masterBuf)
      .resize({ height: 128, fit: 'inside' })
      .png()
      .toFile(join(brandDir, 'logo-hero.png'));
    copyFileSync(join(brandDir, 'logo-master-stacked.png'), join(brandDir, 'logo-master-horizontal.png'));
  }

  /** Paw-only icon — fills square; no baked-in app name (OS shows label below). */
  async function writePawHomeIcon(size, outPath, { maskable = false } = {}) {
    const fill = maskable ? 0.78 : 0.94;
    const inner = Math.round(size * fill);
    const paw = await sharp(pawThumbBuf)
      .resize(inner, inner, { fit: 'contain', background: TRANSPARENT })
      .png()
      .toBuffer();
    const pawMeta = await sharp(paw).metadata();
    const pawW = pawMeta.width ?? inner;
    const pawH = pawMeta.height ?? inner;
    const left = Math.round((size - pawW) / 2);
    const top = Math.round((size - pawH) / 2);

    await sharp({
      create: { width: size, height: size, channels: 4, background: BRAND_NAVY },
    })
      .composite([{ input: paw, top, left }])
      .png()
      .toFile(outPath);
  }

  const icon192 = join(publicImages, 'icon-192.png');
  const icon512 = join(publicImages, 'icon-512.png');
  const appleTouch = join(publicImages, 'apple-touch-icon.png');
  const maskable = join(publicImages, 'icon-maskable-512.png');
  const favicon32 = join(brandDir, 'favicon-32.png');

  await writePawHomeIcon(192, icon192);
  await writePawHomeIcon(512, icon512);
  await writePawHomeIcon(180, appleTouch);
  await writePawHomeIcon(512, maskable, { maskable: true });
  await writePawHomeIcon(32, favicon32);
  copyFileSync(favicon32, join(root, 'public/favicon.png'));

  try {
    mkdirSync(docsBrand, { recursive: true });
    copyFileSync(pawThumbPath, join(docsBrand, 'Freedom_Paws_App_Thumbnail_Paw.png'));
    copyFileSync(icon512, join(docsBrand, 'LOGO_APP_ICON_512.png'));
    copyFileSync(icon192, join(docsBrand, 'LOGO_APP_ICON_192.png'));
    copyFileSync(appleTouch, join(docsBrand, 'LOGO_APPLE_TOUCH_180.png'));
    copyFileSync(maskable, join(docsBrand, 'LOGO_MASKABLE_512.png'));
    copyFileSync(favicon32, join(docsBrand, 'LOGO_FAVICON_32.png'));
    copyFileSync(join(brandDir, 'logo-paw.png'), join(docsBrand, 'LOGO_PAW_MARK.png'));

    writeFileSync(
      join(docsBrand, 'LOGO-ASSET-INDEX.md'),
      `# Freedom Paws — Logo Master Pack

Generated: ${new Date().toISOString().slice(0, 10)}

| File | Use |
|------|-----|
| Freedom_Paws_App_Thumbnail_Paw.png | Paw source |
| LOGO_APP_ICON_512.png | PWA install — **paw fills icon** |
| LOGO_APPLE_TOUCH_180.png | **iPhone home screen** (paw only; name from iOS label) |
| LOGO_PAW_MARK.png | Nav bar paw mark |

Regenerate: \`npm run brand:assets\`
`
    );
  } catch (err) {
    console.warn('Documents copy skipped:', err.message);
  }

  console.log('App icons (paw fill):', icon192, appleTouch);
  console.log('Nav paw:', join(brandDir, 'logo-paw.png'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
