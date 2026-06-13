/**
 * Backfill intake_mirror_embedding for completed enrollments (e.g. Buddy FP-2D1F1AF0).
 * Requires: migration 005, OPENAI_API_KEY, SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage: npx tsx scripts/backfill-intake-mirror.ts
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { backfillAllIntakeMirrors } from '@/lib/id/intake-mirror-backfill';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.local');

function loadEnvLocal() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error('Missing OPENAI_API_KEY in .env.local');
    process.exit(1);
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('Backfilling intake mirror embeddings…\n');

  try {
    const results = await backfillAllIntakeMirrors(admin);
    for (const r of results) {
      if (r.updated) {
        console.log(
          `✓ ${r.freedomPawsId ?? r.enrollmentId} — mirror updated (${r.mirrorTextLength} chars)`
        );
      } else {
        console.log(`– ${r.freedomPawsId ?? r.enrollmentId} — skipped: ${r.skipped ?? 'unknown'}`);
      }
    }
    const updated = results.filter((r) => r.updated).length;
    console.log(`\nDone: ${updated}/${results.length} updated.`);
    console.log('Run migration 005 in Supabase if search_pet_embeddings is not yet updated.');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('intake_mirror_embedding') || msg.includes('column')) {
      console.error(
        '\n✗ Database columns missing — run supabase/migrations/005_intake_mirror_embeddings.sql in Supabase SQL Editor first.'
      );
    }
    console.error(err);
    process.exit(1);
  }
}

void main();
