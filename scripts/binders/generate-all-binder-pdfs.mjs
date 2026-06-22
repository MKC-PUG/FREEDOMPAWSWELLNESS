#!/usr/bin/env node
/**
 * Generate Freedom Paws binder PDFs + appendices → Documents folder.
 * Usage: node scripts/binders/generate-all-binder-pdfs.mjs
 */
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { convertFile } from './md-to-print-html.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const DOCS = join(process.env.HOME || '', 'Documents/Freedom Paws Wellness');
const BUILD = join(ROOT, 'docs/binders/.pdf-build');

const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function chromePdf(htmlPath, pdfPath) {
  if (!existsSync(CHROME)) {
    throw new Error('Google Chrome not found — install Chrome or export HTML manually.');
  }
  const cmd = `"${CHROME}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file://${htmlPath}"`;
  execSync(cmd, { stdio: 'pipe' });
}

function buildPdf(mdRel, pdfName, options = {}) {
  const mdPath = mdRel.startsWith('/') ? mdRel : join(ROOT, mdRel);
  const altDocs = join(DOCS, mdRel.split('/').pop());
  const source = existsSync(mdPath) ? mdPath : altDocs;
  if (!existsSync(source)) {
    console.warn('Skip (missing):', source);
    return null;
  }
  const base = pdfName.replace(/\.pdf$/i, '');
  const htmlPath = join(BUILD, `${base}.html`);
  convertFile(source, htmlPath, options);
  const pdfPath = join(DOCS, pdfName);
  chromePdf(htmlPath, pdfPath);
  console.log('PDF:', pdfPath);
  return pdfPath;
}

mkdirSync(BUILD, { recursive: true });
mkdirSync(DOCS, { recursive: true });

const jobs = [
  {
    md: 'docs/binders/Freedom-Paws-GENERAL-Master-Binder-May-2026.md',
    alt: join(DOCS, 'Freedom-Paws-GENERAL-Master-Binder-May-2026.md'),
    pdf: 'Freedom-Paws-GENERAL-Master-Binder-May-2026.pdf',
    opts: { title: 'Freedom Paws General Master Binder', variant: 'general' },
  },
  {
    md: 'docs/binders/Freedom-Paws-TECHNICAL-Master-Binder-May-2026.md',
    alt: join(DOCS, 'Freedom-Paws-TECHNICAL-Master-Binder-May-2026.md'),
    pdf: 'Freedom-Paws-TECHNICAL-Master-Binder-May-2026.pdf',
    opts: { title: 'Freedom Paws Technical Master Binder', variant: 'technical' },
  },
  {
    md: 'docs/binders/appendix/Appendix-A-Token-Shop-One-Pager.md',
    pdf: 'Appendix-A-Token-Shop-One-Pager.pdf',
    opts: { title: 'Appendix A — Token Shop', variant: 'general' },
  },
  {
    md: 'docs/binders/appendix/Appendix-B-ViT-Pro-Advisor-Sheet.md',
    pdf: 'Appendix-B-ViT-Pro-Advisor-Sheet.pdf',
    opts: { title: 'Appendix B — ViT Pro Advisor', variant: 'technical' },
  },
  {
    md: 'docs/binders/appendix/Appendix-C-Protocol-JSON-Metadata.md',
    pdf: 'Appendix-C-Protocol-JSON-Metadata-All-10.pdf',
    opts: { title: 'Appendix C — Protocol JSON Metadata', variant: 'technical' },
  },
  // Training manuals
  {
    md: 'docs/training/Freedom-Paws-Founder-CEO-Developer-Manual-May-2026.md',
    alt: join(DOCS, 'Freedom-Paws-Founder-CEO-Developer-Manual-May-2026.md'),
    pdf: 'Freedom-Paws-Founder-CEO-Developer-Manual-May-2026.pdf',
    opts: { title: 'Founder / CEO / Developer Manual', variant: 'technical' },
  },
  {
    md: 'docs/training/Freedom-Paws-Shelter-Portal-Training-Manual-May-2026.md',
    alt: join(DOCS, 'Freedom-Paws-Shelter-Portal-Training-Manual-May-2026.md'),
    pdf: 'Freedom-Paws-Shelter-Portal-Training-Manual-May-2026.pdf',
    opts: { title: 'Shelter Portal Training Manual', variant: 'general' },
  },
  {
    md: 'docs/training/Freedom-Paws-Vet-Portal-Training-Manual-May-2026.md',
    alt: join(DOCS, 'Freedom-Paws-Vet-Portal-Training-Manual-May-2026.md'),
    pdf: 'Freedom-Paws-Vet-Portal-Training-Manual-May-2026.pdf',
    opts: { title: 'ViT Pro Vet Portal Training Manual', variant: 'technical' },
  },
  {
    md: 'docs/Freedom-Paws-Website-Post-Launch-Completion-Report-May-2026.md',
    alt: join(DOCS, 'Freedom-Paws-Website-Post-Launch-Completion-Report-May-2026.md'),
    pdf: 'Freedom-Paws-Website-Post-Launch-Completion-Report-May-2026.pdf',
    opts: { title: 'Website Post-Launch Completion Report', variant: 'general' },
  },
];

for (const job of jobs) {
  let mdPath = join(ROOT, job.md);
  if (!existsSync(mdPath) && job.alt) mdPath = job.alt;
  if (!existsSync(mdPath)) {
    console.warn('Missing:', job.md);
    continue;
  }
  const htmlPath = join(BUILD, job.pdf.replace('.pdf', '.html'));
  convertFile(mdPath, htmlPath, job.opts);
  chromePdf(htmlPath, join(DOCS, job.pdf));
  console.log('PDF:', join(DOCS, job.pdf));
}

console.log('\nDone. Output folder:', DOCS);
