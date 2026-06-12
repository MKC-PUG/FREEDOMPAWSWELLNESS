#!/usr/bin/env node
/**
 * Push production env vars from .env.local to Vercel (non-interactive per key).
 * Usage: node scripts/vercel-env-push.mjs
 * Requires: vercel CLI logged in, project linked (`vercel link`)
 */
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.local');

const PROD_KEYS = [
  'NEXT_PUBLIC_SITE_MODE',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_FRAMER_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'FP_OPS_EMAILS',
  'ADMIN_PASSWORD',
];

function parseEnv(text) {
  const out = {};
  for (const line of text.split('\n')) {
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
    out[key] = val;
  }
  return out;
}

if (!existsSync(envPath)) {
  console.error('Missing .env.local — create it first.');
  process.exit(1);
}

const env = parseEnv(readFileSync(envPath, 'utf8'));
const missing = PROD_KEYS.filter((k) => !env[k]?.trim());
if (missing.length) {
  console.warn('Warning — empty or missing in .env.local:', missing.join(', '));
}

console.log('Pushing env to Vercel (production)…\n');

for (const key of PROD_KEYS) {
  const value = env[key]?.trim();
  if (!value) {
    console.log(`skip ${key} (empty)`);
    continue;
  }
  const r = spawnSync(
    'npx',
    ['vercel', 'env', 'add', key, 'production', '--force'],
    {
      cwd: root,
      input: value,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );
  if (r.status !== 0) {
    console.error(`failed ${key}:`, r.stderr || r.stdout);
    process.exit(1);
  }
  console.log(`ok ${key}`);
}

console.log('\nDone. Redeploy: npx vercel --prod');
