#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const dir = path.join(ROOT, 'supabase', 'migrations');
const files = [
  '001_freedom_paws_id.sql',
  '002_pet_embeddings.sql',
  '003_found_match.sql',
  '004_audit_settings.sql',
];

let out = `-- Freedom Paws ID — RUN ALL MIGRATIONS 001-004 (single paste in Supabase SQL Editor)\n-- Generated ${new Date().toISOString().slice(0, 10)}\n\n`;

for (const f of files) {
  out += `-- ========== ${f} ==========\n\n`;
  out += fs.readFileSync(path.join(dir, f), 'utf8').trim() + '\n\n';
}

const dest = path.join(ROOT, 'supabase', 'RUN_ALL_MIGRATIONS_001_004.sql');
fs.writeFileSync(dest, out);
console.log(`Wrote ${dest} (${out.length} bytes)`);
