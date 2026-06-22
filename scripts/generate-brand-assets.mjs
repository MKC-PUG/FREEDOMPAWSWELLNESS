#!/usr/bin/env node
/**
 * Generate Freedom Paws brand assets.
 * Nav/hero: stacked master logo (paw + text).
 * App home-screen icons: paw-only thumbnail + "Freedom Paws" label on navy.
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

/** SVG label under paw for home-screen icons */
function freedomPawsLabelSvg(size) {
  const fontSize = Math.max(10, Math.round(size * 0.085));
  const y = Math.round(size * 0.9);
  return Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="${y}" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', Times, serif"
    font-size="${fontSize}" font-weight="700" fill="#FFFFFF">Freedom Paws</text>
</svg>`);
}

async function main() {
  const sharp = (await import('sharp')).default;
  const src = findMasterSource();
  const thumbSrc = findAppThumbnailSource();

  if (!src) {
    console.error('Master logo not found. Add assets/Freedom_Paws_Master_Logo.png');
    process.exit(1);
  }
  if (!thumbSrc) {
    console.error('App thumbnail paw not found. Add assets/Freedom_Paws_App_Thumbnail_Paw.png');
    process.exit(1);
  }

  mkdirSync(brandDir, { recursive: true });

  const masterBuf = await sharp(src).ensureAlpha().png().toBuffer();
  const meta = await sharp(masterBuf).metadata();
  const W = meta.width ?? 800;
  const H = meta.height ?? 800;

  let pawThumbBuf = await sharp(thumbSrc).ensureAlpha().png().toBuffer();
  try {
    pawThumbBuf = await sharp(pawThumbBuf).trim({ threshold: 18 }).png().toBuffer();
  } catch {
    /* keep full canvas */
  }

  const masterPath = join(brandDir, 'logo-master-stacked.png');
  await sharp(masterBuf).toFile(masterPath);

  const pawThumbPath = join(brandDir, 'logo-app-thumbnail-paw.png');
  await sharp(pawThumbBuf).toFile(pawThumbPath);
  await sharp(pawThumbBuf).toFile(join(brandDir, 'logo-paw.png'));

  // Nav / hero — stacked master (transparent)
  await sharp(masterBuf)
    .resize({ height: 56, fit: 'inside' })
    .png()
    .toFile(join(brandDir, 'logo-nav.png'));

  await sharp(masterBuf)
    .resize({ height: 128, fit: 'inside' })
    .png()
    .toFile(join(brandDir, 'logo-hero.png'));

  /** Home-screen icon: paw centered + "Freedom Paws" text below on navy */
  async function writeAppHomeIcon(size, outPath, { maskable = false, favicon = false } = {}) {
    if (favicon) {
      const inner = Math.round(size * 0.78);
      const paw = await sharp(pawThumbBuf)
        .resize(inner, inner, { fit: 'contain', background: TRANSPARENT })
        .png()
        .toBuffer();
      const pad = Math.round((size - inner) / 2);
      await sharp({
        create: { width: size, height: size, channels: 4, background: BRAND_NAVY },
      })
        .composite([{ input: paw, top: pad, left: pad }])
        .png()
        .toFile(outPath);
      return;
    }

    const pawScale = maskable ? 0.48 : 0.54;
    const pawTop = maskable ? Math.round(size * 0.1) : Math.round(size * 0.06);
    const pawInner = Math.round(size * pawScale);

    const paw = await sharp(pawThumbBuf)
      .resize(pawInner, pawInner, { fit: 'contain', background: TRANSPARENT })
      .png()
      .toBuffer();
    const pawMeta = await sharp(paw).metadata();
    const pawW = pawMeta.width ?? pawInner;
    const pawLeft = Math.round((size - pawW) / 2);

    await sharp({
      create: { width: size, height: size, channels: 4, background: BRAND_NAVY },
    })
      .composite([
        { input: paw, top: pawTop, left: pawLeft },
        { input: freedomPawsLabelSvg(size), top: 0, left: 0 },
      ])
      .png()
      .toFile(outPath);
  }

  const icon192 = join(publicImages, 'icon-192.png');
  const icon512 = join(publicImages, 'icon-512.png');
  const appleTouch = join(publicImages, 'apple-touch-icon.png');
  const maskable = join(publicImages, 'icon-maskable-512.png');
  const favicon32 = join(brandDir, 'favicon-32.png');

  await writeAppHomeIcon(192, icon192);
  await writeAppHomeIcon(512, icon512);
  await writeAppHomeIcon(180, appleTouch);
  await writeAppHomeIcon(512, maskable, { maskable: true });
  await writeAppHomeIcon(32, favicon32, { favicon: true });
  copyFileSync(favicon32, join(root, 'public/favicon.png'));

  copyFileSync(join(brandDir, 'logo-nav.png'), join(brandDir, 'logo-paw-40.png'));
  copyFileSync(masterPath, join(brandDir, 'logo-master-horizontal.png'));

  try {
    mkdirSync(docsBrand, { recursive: true });
    copyFileSync(masterPath, join(docsBrand, 'Freedom_Paws_Master_Logo.png'));
    copyFileSync(pawThumbPath, join(docsBrand, 'Freedom_Paws_App_Thumbnail_Paw.png'));
    copyFileSync(icon512, join(docsBrand, 'LOGO_APP_ICON_512.png'));
    copyFileSync(icon192, join(docsBrand, 'LOGO_APP_ICON_192.png'));
    copyFileSync(appleTouch, join(docsBrand, 'LOGO_APPLE_TOUCH_180.png'));
    copyFileSync(maskable, join(docsBrand, 'LOGO_MASKABLE_512.png'));
    copyFileSync(favicon32, join(docsBrand, 'LOGO_FAVICON_32.png'));
    copyFileSync(join(brandDir, 'logo-nav.png'), join(docsBrand, 'LOGO_NAV_STACKED_56.png'));
    copyFileSync(join(brandDir, 'logo-hero.png'), join(docsBrand, 'LOGO_HERO_128.png'));
    copyFileSync(join(brandDir, 'logo-paw.png'), join(docsBrand, 'LOGO_PAW_MARK.png'));

    writeFileSync(
      join(docsBrand, 'LOGO-ASSET-INDEX.md'),
      `# Freedom Paws — Logo Master Pack

Generated: ${new Date().toISOString().slice(0, 10)}

| File | Use |
|------|-----|
| Freedom_Paws_Master_Logo.png | Nav / hero — paw + text stacked |
| Freedom_Paws_App_Thumbnail_Paw.png | **Paw-only source for home-screen icon** |
| LOGO_APP_ICON_512.png | PWA install (paw + Freedom Paws label) |
| LOGO_APP_ICON_192.png | Android / shortcuts |
| LOGO_APPLE_TOUCH_180.png | **iPhone home screen** |
| LOGO_MASKABLE_512.png | Android adaptive |
| LOGO_FAVICON_32.png | Browser tab (paw only) |

Regenerate: \`npm run brand:assets\`
`
    );
    console.log('Documents pack:', docsBrand);
  } catch (err) {
    console.warn('Documents copy skipped:', err.message);
  }

  console.log('Nav/hero from:', src);
  console.log('App icons from:', thumbSrc);
  console.log('Home-screen icons:', icon192, icon512, appleTouch);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
