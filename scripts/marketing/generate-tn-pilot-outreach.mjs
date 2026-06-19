#!/usr/bin/env node
/**
 * Generate ready-to-review outreach drafts for 6 LIVE TN pilot partners.
 * WRITE-ONLY — writes markdown to outbox/. Does NOT send email.
 * See docs/marketing/ACTIVATION-GATE.md before any outbound.
 * Usage: npm run marketing:tn-outreach
 *
 * Optional env: FOUNDER_NAME, CAL_LINK (from .env.local)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCsv, rowsToObjects } from './lib/csv.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const ENV_PATH = path.join(ROOT, '.env.local');
const INPUT = path.join(ROOT, 'docs/Freedom-Paws-Master-Marketing-Contact-Directory-June-2026.csv');
const TEMPLATES = path.join(ROOT, 'docs/marketing/templates');
const OUTBOX = path.join(ROOT, 'docs/marketing/outbox/tn-pilot');

function loadEnv() {
  const out = {};
  if (!fs.existsSync(ENV_PATH)) return out;
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[t.slice(0, eq).trim()] = val;
  }
  return out;
}

function slugFromNotes(notes) {
  const m = /FP slug ([a-z0-9-]+)/i.exec(notes || '');
  return m ? m[1] : '';
}

function cleanOrgName(org) {
  return (org || '')
    .replace(/\s*\(LIVE\)\s*/gi, '')
    .replace(/\s*—.*$/, '')
    .trim();
}

function applyTemplate(template, vars) {
  let out = template;
  for (const [key, val] of Object.entries(vars)) {
    out = out.split(`{${key}}`).join(val);
  }
  return out;
}

function main() {
  const env = { ...process.env, ...loadEnv() };
  const founderName = env.FOUNDER_NAME || env.FP_FOUNDER_NAME || '[Founder name]';
  const calLink = env.CAL_LINK || env.CAL_COM_LINK || 'https://cal.com/[your-link]';

  const rows = parseCsv(fs.readFileSync(INPUT, 'utf8'));
  const contacts = rowsToObjects(rows).filter(
    (r) =>
      r.Category === 'Adoption Network TN Pilot' &&
      /\(LIVE\)/i.test(r.Organization) &&
      Number(r.Rank) >= 1 &&
      Number(r.Rank) <= 6
  );

  if (contacts.length === 0) {
    console.error('No LIVE TN pilot rows found in master CSV (ranks 1–6).');
    process.exit(1);
  }

  const shelterTpl = fs.readFileSync(path.join(TEMPLATES, 'shelter-onboarding-email-1.md'), 'utf8');
  const municipalTpl = fs.readFileSync(path.join(TEMPLATES, 'municipal-onboarding-email-1.md'), 'utf8');
  const followTpl = fs.readFileSync(path.join(TEMPLATES, 'shelter-onboarding-email-2.md'), 'utf8');

  fs.mkdirSync(OUTBOX, { recursive: true });
  const manifest = [];

  for (const row of contacts) {
    const slug = slugFromNotes(row.Outreach_Notes);
    const org = cleanOrgName(row.Organization);
    const isMunicipal = /municipal|county/i.test(row.Contact_Model || '');
    const email1 = applyTemplate(isMunicipal ? municipalTpl : shelterTpl, {
      ORGANIZATION: org,
      CONTACT_NAME: 'Team',
      CONTACT_EMAIL: row.Public_Email || 'partnership inbox',
      FP_SLUG: slug,
      CAL_LINK: calLink,
      FOUNDER_NAME: founderName,
    });
    const email2 = applyTemplate(followTpl, {
      ORGANIZATION: org,
      CONTACT_NAME: 'Team',
      CAL_LINK: calLink,
      FOUNDER_NAME: founderName,
    });

    const base = `${String(row.Rank).padStart(2, '0')}-${slug || org.toLowerCase().replace(/\s+/g, '-')}`;
    const file1 = `${base}-email-1.md`;
    const file2 = `${base}-email-2-day5.md`;
    fs.writeFileSync(path.join(OUTBOX, file1), email1, 'utf8');
    fs.writeFileSync(path.join(OUTBOX, file2), email2, 'utf8');

    manifest.push({
      rank: row.Rank,
      organization: org,
      slug,
      inbox: 'shelter@freedompawsinc.com',
      email1: file1,
      email2: file2,
      publicDirectory: slug ? `https://app.freedompawsinc.com/adopt/tn/${slug}` : '',
      partnerPortal: 'https://shelter.freedompawsinc.com/partner/listings',
    });
  }

  fs.writeFileSync(
    path.join(OUTBOX, 'manifest.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), partners: manifest }, null, 2),
    'utf8'
  );

  console.log(`✓ Generated ${contacts.length} partner draft sets → ${OUTBOX}`);
  for (const m of manifest) {
    console.log(`  ${m.rank}. ${m.organization} (${m.slug})`);
  }
  console.log('\nDrafts only — nothing sent. See docs/marketing/ACTIVATION-GATE.md before outbound.');
}

main();
