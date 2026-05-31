#!/usr/bin/env node
/** Download IMG.LY model/WASM assets into public/ for reliable PWA loading (Vercel + iPhone). */
import { access, cp, mkdir, rm, writeFile } from 'fs/promises';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const VERSION = '1.7.0';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'imgly-bg-removal');
const MARKER = path.join(OUT, 'resources.json');
const TARBALL_URL = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/package.tgz`;
const TMP = path.join(ROOT, '.tmp-imgly-bg');

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (await exists(MARKER)) {
    console.log('imgly background-removal assets already present — skip');
    return;
  }

  console.log(`Fetching IMG.LY assets v${VERSION}…`);
  await rm(TMP, { recursive: true, force: true });
  await mkdir(TMP, { recursive: true });
  await mkdir(OUT, { recursive: true });

  const tgz = path.join(TMP, 'package.tgz');
  execSync(`curl -fsSL "${TARBALL_URL}" -o "${tgz}"`, { stdio: 'inherit' });
  execSync(`tar -xzf "${tgz}" -C "${TMP}"`, { stdio: 'inherit' });

  const dist = path.join(TMP, 'package', 'dist');
  if (!(await exists(dist))) {
    throw new Error('Unexpected tarball layout — package/dist missing');
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await cp(dist, OUT, { recursive: true });
  await writeFile(path.join(OUT, '.version'), `${VERSION}\n`);
  await rm(TMP, { recursive: true, force: true });

  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error('fetch-imgly-bg-assets failed:', err.message);
  process.exit(1);
});
