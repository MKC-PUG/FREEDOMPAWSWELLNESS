#!/usr/bin/env node
/**
 * Apply migrations 011 + 012 when SUPABASE_DB_URL is set.
 * Usage: npm run ops:migrate
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env.local');

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const out = {};
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const MIGRATIONS = ['011_shelters_public_pilot_read.sql', '012_ops_settings.sql'];

async function main() {
  const env = { ...process.env, ...loadEnv() };
  const dbUrl = env.SUPABASE_DB_URL?.trim();
  if (!dbUrl) {
    console.error(
      'Missing SUPABASE_DB_URL — use Supabase SQL Editor instead:\n' +
        '  supabase/RUN_MIGRATIONS_011_012.sql'
    );
    process.exit(1);
  }

  const sql = postgres(dbUrl, { max: 1, idle_timeout: 30, connect_timeout: 30 });
  try {
    for (const file of MIGRATIONS) {
      const filePath = path.join(ROOT, 'supabase', 'migrations', file);
      console.log(`Applying ${file}…`);
      await sql.unsafe(fs.readFileSync(filePath, 'utf8'));
      console.log(`✓ ${file}`);
    }
    console.log('\n✓ Ops migrations 011 + 012 complete');
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
