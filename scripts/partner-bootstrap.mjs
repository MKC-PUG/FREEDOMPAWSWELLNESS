#!/usr/bin/env node
/**
 * Bootstrap FP ops + verify TN pilot partners via Supabase admin API.
 * Usage: npm run partner:bootstrap
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

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

async function main() {
  const env = { ...process.env, ...loadEnv() };
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const opsEmails = (env.FP_OPS_EMAILS || env.FP_OPS_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  console.log('Checking TN pilot partners…');
  const { data: partners, error: partnerErr } = await admin
    .from('shelters')
    .select('id, name, slug, pilot_tier')
    .eq('pilot_tier', 'tn_pilot')
    .not('slug', 'is', null);

  if (partnerErr) {
    console.error('Shelters query failed — run migrations first:', partnerErr.message);
    process.exit(1);
  }

  console.log(`✓ ${partners?.length ?? 0} TN pilot partners with slugs`);

  if (opsEmails.length === 0) {
    console.log('No FP_OPS_EMAILS set — skip role bootstrap');
    return;
  }

  const { data: listData, error: listErr } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (listErr) {
    console.error('Could not list auth users:', listErr.message);
    process.exit(1);
  }

  const users = listData.users.filter((u) => u.email && opsEmails.includes(u.email.toLowerCase()));
  if (users.length === 0) {
    console.log(`No signed-up users match FP_OPS_EMAILS (${opsEmails.join(', ')})`);
    console.log('Sign in once on the app, then re-run partner:bootstrap');
    return;
  }

  for (const user of users) {
    const { error } = await admin.from('user_profiles').upsert(
      { id: user.id, role: 'fp_ops' },
      { onConflict: 'id' }
    );
    if (error) {
      console.error(`Failed to set fp_ops for ${user.email}:`, error.message);
    } else {
      console.log(`✓ fp_ops → ${user.email}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
