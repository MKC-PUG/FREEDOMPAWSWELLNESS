import { readFileSync } from 'node:fs';
import path from 'node:path';

export const SUPERBUD_PAGE_MANUAL_MD = path.join(
  process.cwd(),
  'docs/(UPDATED 10-24-26) Freedom-Paws-SuperBud-Page-Click-by-Click-Manual.md'
);

export const SUPERBUD_PAGE_MANUAL_PDF = path.join(
  process.cwd(),
  'docs/(UPDATED 10-24-26) Freedom-Paws-SuperBud-Page-Click-by-Click-Manual.pdf'
);

export function readSuperbudPageManual(): string {
  return readFileSync(SUPERBUD_PAGE_MANUAL_MD, 'utf8');
}
