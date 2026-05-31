#!/usr/bin/env node
/** Keeps public/sw.js CACHE_NAME in sync with lib/pwa-version.ts */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const versionFile = join(root, 'lib/pwa-version.ts');
const swFile = join(root, 'public/sw.js');

const ts = readFileSync(versionFile, 'utf8');
const match = ts.match(/PWA_VERSION\s*=\s*['"]([^'"]+)['"]/);
if (!match) {
  console.error('Could not read PWA_VERSION from', versionFile);
  process.exit(1);
}

const version = match[1];
const cacheName = `freedom-paws-${version}`;
const sw = readFileSync(swFile, 'utf8');
const pattern = /const CACHE_NAME = 'freedom-paws-[^']*';/;

if (!pattern.test(sw)) {
  console.error('CACHE_NAME line not found in public/sw.js');
  process.exit(1);
}

if (sw.includes(`const CACHE_NAME = '${cacheName}';`)) {
  console.log('PWA cache already synced:', cacheName);
  process.exit(0);
}

const next = sw.replace(pattern, `const CACHE_NAME = '${cacheName}';`);
writeFileSync(swFile, next);
console.log('PWA cache updated:', cacheName);
