#!/usr/bin/env node
/**
 * Apply migration 013 — Tennessee-only shelter pilot.
 * Usage: npm run pilot:migrate
 * Requires SUPABASE_DB_URL in .env.local (Session pooler URI).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env.local');
const MIGRATION = '013_tn_only_shelter_pilot.sql';

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

async function main() {
  const env = { ...process.env, ...loadEnv() };
  const dbUrl = env.SUPABASE_DB_URL?.trim();
  if (!dbUrl) {
    console.error(
      'Missing SUPABASE_DB_URL in .env.local\n\n' +
        'Supabase Dashboard → Settings → Database → Connection string (Session pooler)\n' +
        'Add: SUPABASE_DB_URL=postgresql://...\n\n' +
        'Or paste supabase/RUN_MIGRATION_013.sql in SQL Editor and Run.'
    );
    process.exit(1);
  }

  const filePath = path.join(ROOT, 'supabase', 'migrations', MIGRATION);
  const sql = postgres(dbUrl, { max: 1, idle_timeout: 30, connect_timeout: 30 });

  try {
    console.log(`Applying ${MIGRATION}…`);
    await sql.unsafe(fs.readFileSync(filePath, 'utf8'));
    console.log(`✓ ${MIGRATION}`);

    const rows = await sql`
      select state, count(*)::int as n
      from public.shelters
      group by state
      order by state
    `;
    console.log('\nShelters by state after migration:');
    for (const r of rows) console.log(`  ${r.state}: ${r.n}`);

    const [{ n: ca_left }] = await sql`
      select count(*)::int as n from public.shelters where state = 'California'
    `;
    if (ca_left > 0) {
      console.error(`\n⚠ Still ${ca_left} California row(s) — check FK references.`);
      process.exit(1);
    }

    console.log('\n✓ Tennessee-only shelter pilot locked');
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
