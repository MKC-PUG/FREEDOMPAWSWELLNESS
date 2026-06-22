#!/usr/bin/env node
/**
 * Verify launch readiness (steps 1–3).
 * Usage: npm run ops:verify
 */
const BASE = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://app.freedompawsinc.com';

async function check(name, url, opts = {}) {
  try {
    const res = await fetch(url, { redirect: opts.followRedirect ? 'follow' : 'manual' });
    return { name, url, status: res.status, ok: opts.expect?.includes(res.status) ?? res.ok };
  } catch (e) {
    return { name, url, status: 0, ok: false, error: String(e) };
  }
}

async function main() {
  console.log(`Freedom Paws launch verify — ${BASE}\n`);

  const checks = await Promise.all([
    check('Ops (auth gate)', `${BASE}/ops`, { expect: [307, 302] }),
    check('Adopt TN page', `${BASE}/adopt/tn`, { expect: [200] }),
    check('Partner orgs API', `${BASE}/api/partner/orgs`, { expect: [200] }),
  ]);

  for (const c of checks) {
    const mark = c.ok ? '✓' : '✗';
    console.log(`${mark} ${c.name}: HTTP ${c.status}`);
  }

  try {
    const orgs = await fetch(`${BASE}/api/partner/orgs`).then((r) => r.json());
    const count = orgs.partners?.length ?? 0;
    console.log(`\nTN partners in public API: ${count}`);
    if (count === 0) {
      console.log('  → Run supabase/RUN_MIGRATIONS_011_012.sql (011 fixes anon read)');
    } else {
      orgs.partners.slice(0, 6).forEach((p) => console.log(`  · ${p.name} (${p.slug})`));
    }
  } catch {
    console.log('\nCould not parse partner orgs JSON');
  }

  console.log('\nLocal bootstrap: npm run partner:bootstrap');
  console.log('Ops sign-in: /ops with FP_OPS_EMAILS account');
}

main();
