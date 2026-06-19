#!/usr/bin/env node
/**
 * Export master contact CSV with CRM columns for Google Sheets import.
 * WRITE-ONLY — does not send email or call external APIs.
 * Approved column is always empty (activation gate). See docs/marketing/ACTIVATION-GATE.md
 * Usage: npm run marketing:crm-export
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCsv, toCsv } from './lib/csv.mjs';
import { CRM_COLUMNS, defaultCrmRow } from './lib/crm-rules.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const INPUT = path.join(ROOT, 'docs/Freedom-Paws-Master-Marketing-Contact-Directory-June-2026.csv');
const OUTPUT = path.join(ROOT, 'docs/marketing/Freedom-Paws-CRM-Import-Ready-June-2026.csv');

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Missing master CSV:', INPUT);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(INPUT, 'utf8'));
  const headers = [...rows[0], ...CRM_COLUMNS];
  const out = [headers];

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (cells.length === 0) continue;
    const rowObj = {};
    rows[0].forEach((h, j) => {
      rowObj[h] = cells[j] ?? '';
    });
    const crm = defaultCrmRow(rowObj);
    out.push([...cells, ...CRM_COLUMNS.map((k) => crm[k])]);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, toCsv(out) + '\n', 'utf8');

  const tnLive = out.filter(
    (r, idx) =>
      idx > 0 &&
      r[0] === 'Adoption Network TN Pilot' &&
      /\(LIVE\)/i.test(r[2] || '')
  ).length;

  console.log(`✓ Wrote ${out.length - 1} rows → ${OUTPUT}`);
  console.log(`  TN LIVE pilot partners pre-scored: ${tnLive}`);
  console.log('Next: Google Sheets → File → Import → upload this CSV');
}

main();
