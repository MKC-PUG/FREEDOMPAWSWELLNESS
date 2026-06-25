#!/usr/bin/env node
/**
 * Generate redacted source-code PDF for Copyright Office deposit (Circular 61).
 * Output: ~/Documents/Freedom Paws Wellness/copyright-deposit-freedompaws-app-source.pdf
 * Usage: node scripts/generate-copyright-code-deposit.mjs
 */
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(process.env.HOME || '', 'Documents/Freedom Paws Wellness');
const BUILD = join(ROOT, 'docs/binders/.pdf-build');
const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const FILES = [
  'package.json',
  'lib/pwa-version.ts',
  'public/manifest.json',
  'app/layout.tsx',
  'app/page.tsx',
  'app/api/analyze/route.ts',
  'lib/ai/types.ts',
  'lib/ai/diagnostics.ts',
  'lib/ai/urgent-assessment.ts',
  'lib/shop/protocol-catalog.ts',
  'lib/id/types.ts',
  'lib/vit-pro/types.ts',
  'app/diagnostics/page.tsx',
  'app/vit-pro/page.tsx',
  'app/adopt/tn/page.tsx',
  'app/components/BrandLogo.tsx',
  'public/sw.js',
];

function redact(text) {
  return text
    .replace(/sk-[a-zA-Z0-9_-]{10,}/g, 'REDACTED_OPENAI_KEY')
    .replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, 'REDACTED_JWT')
    .replace(/(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]+['"]/gi, '$1: "REDACTED"')
    .replace(/process\.env\.[A-Z0-9_]+/g, 'process.env.REDACTED');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHtml() {
  const sections = FILES.map((rel) => {
    const path = join(ROOT, rel);
    if (!existsSync(path)) return `<!-- missing: ${rel} -->`;
    const body = redact(readFileSync(path, 'utf8'));
    return `<section class="file"><h2>${escapeHtml(rel)}</h2><pre>${escapeHtml(body)}</pre></section>`;
  });

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>freedompaws-app source deposit</title>
<style>
  body { font-family: Menlo, Monaco, monospace; font-size: 9pt; margin: 0.75in; }
  h1 { font-size: 14pt; }
  h2 { font-size: 10pt; margin-top: 1.2em; page-break-before: auto; }
  pre { white-space: pre-wrap; word-break: break-word; line-height: 1.35; }
  .cover { margin-bottom: 2em; }
</style></head><body>
<div class="cover">
<h1>Freedom Paws Wellness Progressive Web Application</h1>
<p>Deposit copy for U.S. Copyright registration — freedompaws-app</p>
<p>Version: PWA v84 · Year: 2026 · Trade secrets redacted</p>
<p>Representative source files from github.com/MKC-PUG/FREEDOMPAWSWELLNESS</p>
</div>
${sections.join('\n')}
</body></html>`;
}

function chromePdf(htmlPath, pdfPath) {
  if (!existsSync(CHROME)) {
    throw new Error('Google Chrome required to generate PDF. Open the HTML file and Print to PDF.');
  }
  const cmd = `"${CHROME}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file://${htmlPath}"`;
  execSync(cmd, { stdio: 'pipe' });
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(BUILD, { recursive: true });

const htmlPath = join(BUILD, 'copyright-deposit-freedompaws-app-source.html');
const pdfPath = join(OUT_DIR, 'copyright-deposit-freedompaws-app-source.pdf');

writeFileSync(htmlPath, buildHtml());
chromePdf(htmlPath, pdfPath);

console.log('Copyright code deposit PDF:', pdfPath);
console.log('Open and skim for REDACTED markers before uploading to eCO.');
