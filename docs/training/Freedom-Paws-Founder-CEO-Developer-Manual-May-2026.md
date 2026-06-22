# Freedom Paws — Founder / CEO / Developer Operations Manual

**Version:** 1.0  
**Date:** May 2026  
**Audience:** Founder, CEO, lead developer  
**Classification:** Internal — full system access  

---

## Table of contents

1. [Purpose & how to use this manual](#1-purpose--how-to-use-this-manual)
2. [System overview](#2-system-overview)
3. [URLs, domains & surfaces](#3-urls-domains--surfaces)
4. [Access control & roles](#4-access-control--roles)
5. [Sign-in (all portals)](#5-sign-in-all-portals)
6. [Command Center — `/ops`](#6-command-center--ops)
7. [Command Center modules — click by click](#7-command-center-modules--click-by-click)
8. [Reports & data available in Control Panel](#8-reports--data-available-in-control-panel)
9. [Member app (consumer PWA)](#9-member-app-consumer-pwa)
10. [Backend & infrastructure](#10-backend--infrastructure)
11. [Environment variables (founder reference)](#11-environment-variables-founder-reference)
12. [CLI scripts & generated reports](#12-cli-scripts--generated-reports)
13. [Deploy & release checklist](#13-deploy--release-checklist)
14. [Daily / weekly founder routines](#14-daily--weekly-founder-routines)
15. [Troubleshooting](#15-troubleshooting)
16. [Appendix A — URL quick reference](#appendix-a--url-quick-reference)
17. [Appendix B — Role matrix](#appendix-b--role-matrix)
18. [Appendix C — npm scripts](#appendix-c--npm-scripts)
19. [Appendix D — External dashboards](#appendix-d--external-dashboards)

---

## 1. Purpose & how to use this manual

This manual is the **primary training document** for running Freedom Paws as founder, CEO, and developer. It covers:

- How the **front end** (PWA, Framer, partner/vet portals) connects to the **back end** (Supabase, Vercel, OpenAI, XRPL)
- Every **URL and access point**
- The **Command Center** (`/ops`) — your control panel
- **Reports and KPIs** you can view without writing SQL
- **Click-by-click** tasks for operations you perform yourself

**Companion manuals (separate files):**

| Manual | Audience |
|--------|----------|
| `Freedom-Paws-Shelter-Portal-Training-Manual-May-2026.md` | Shelter staff & admins |
| `Freedom-Paws-Vet-Portal-Training-Manual-May-2026.md` | Veterinary advisors & ViT Pro users |

---

## 2. System overview

Freedom Paws is a **Next.js Progressive Web App** on Vercel with **Supabase** (auth + Postgres + pgvector). Three user-facing surfaces share one codebase:

```
┌─────────────────────────────────────────────────────────────┐
│  CONSUMER PWA          PARTNER PORTAL       OPS + VIT PRO     │
│  app.freedompawsinc.com   shelter.*.com    /ops  /vit-pro   │
│  Members · ViT · Shop     Shelters · ID      Founder console  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                    Supabase + OpenAI + XUMM/XRPL
```

| Layer | Technology |
|-------|------------|
| Hosting | Vercel |
| Database / Auth | Supabase |
| AI (ViT) | OpenAI GPT-4o-mini |
| Payments | Xaman (XRP/RLUSD) · Stripe (planned) |
| Email | Resend (magic links, match alerts) |
| Marketing site | Framer → freedompawsinc.com |

---

## 3. URLs, domains & surfaces

| Surface | URL | Who uses it |
|---------|-----|-------------|
| **Member app (PWA)** | https://app.freedompawsinc.com | Dog owners |
| **Marketing** | https://freedompawsinc.com | Public (Framer) |
| **Community (planned)** | https://freedompawsinc.org | Grants, donations |
| **Partner / shelter portal** | https://shelter.freedompawsinc.com/partner | Shelter staff |
| **Command Center** | https://app.freedompawsinc.com/ops | Founder (`fp_ops`) |
| **ViT Pro (vet CDS)** | https://app.freedompawsinc.com/vit-pro | Advisors, vets, you |
| **Public adoption TN** | https://app.freedompawsinc.com/adopt/tn | Public |
| **Login (all)** | https://app.freedompawsinc.com/login | Everyone with account |

**Local dev:** `npm run dev` → http://localhost:3000 (same routes).

---

## 4. Access control & roles

Roles live in Supabase `user_profiles.role`:

| Role | Access |
|------|--------|
| `owner` | Member app (default new user) |
| `shelter_staff` | Partner portal · found intake · draft listings |
| `shelter_admin` | Above + match review · publish listings |
| `vet_staff` | ViT Pro portal *(when assigned)* |
| `fp_ops` | **Everything** — `/ops`, match review, all partners |

**Founder access:** Add your email to `FP_OPS_EMAILS` in Vercel env (comma-separated). New users with that email auto-get `fp_ops` on first login.

**ViT Pro advisor access:** Add email to `VIT_PRO_ADVISOR_EMAILS` (or assign `vet_staff` / use `fp_ops`).

---

## 5. Sign-in (all portals)

### Click-by-click — first login as founder

1. Open **https://app.freedompawsinc.com/login?next=/ops**
2. Enter your email (must be in `FP_OPS_EMAILS`).
3. Tap **Send magic link**.
4. **Option A:** Open email on same device → tap link once in **Safari** (not in Gmail in-app browser if it breaks).
5. **Option B:** Enter **6-digit OTP** from same email on login page → **Verify code**.
6. You land on **Command Center** (`/ops`).

### If sign-in fails

- Confirm Supabase URL/keys in Vercel env.
- Confirm redirect URLs in Supabase dashboard include `app.freedompawsinc.com` and `shelter.freedompawsinc.com`.
- Use OTP fallback on login page.
- See `docs/Freedom-Paws-ID-Supabase-Setup-Checklist.md`.

---

## 6. Command Center — `/ops`

**URL:** https://app.freedompawsinc.com/ops  
**Nav bar:** COMMAND · ADOPTION · MARKETING · SHELTER & ID · WELLNESS · PRODUCT · SYSTEM

### Home dashboard KPIs (live snapshot)

| KPI | Meaning |
|-----|---------|
| **TN pilot partners** | Count of TN shelter orgs in database |
| **Available dogs** | Listings with status `available` |
| **Match queue** | Found-dog reports awaiting human review |
| **Waitlist** | `waitlist_signups` count (needs service role) |

### Quick actions (links on home)

| Link | Goes to |
|------|---------|
| Partner portal | `/partner` |
| ViT Pro CDS | `/vit-pro` |
| Public adopt TN | `/adopt/tn` |
| Match queue | `/id/match` |
| Symptom admin | `/admin/symptoms` |

### Recent audit

Last **15 actions** from `audit_log` table (marketing toggles, feature flags, partner approvals).

---

## 7. Command Center modules — click by click

### 7.1 ADOPTION — `/ops/adoption`

**Purpose:** TN pilot partner health, listing pipeline, outreach approval gates.

**Click-by-click — approve partner for marketing outreach**

1. Go to **https://app.freedompawsinc.com/ops/adoption**
2. Scroll to TN pilot partner card (e.g. Memphis Animal Services).
3. Find toggle **Approve for outreach** on the right.
4. Click to turn **ON** (green).
5. Setting saves to Supabase `ops_settings` — syncs to marketing gates.

**Click-by-click — check public listing page**

1. On partner card, click **Public page** (green link).
2. Opens `/adopt/tn/{partner-slug}` in new tab.
3. Verify dogs with status **available** or **pending** appear.

**Listing pipeline counts:** draft · available · pending · adopted · archived — all shelters combined.

---

### 7.2 MARKETING — `/ops/marketing`

**Purpose:** Record intent for CRM/n8n automation. **Does not send email from the UI** (dormant by default).

**Click-by-click — safe default check**

1. Go to **/ops/marketing**
2. Confirm **Emergency stop** is **ON** (red/blocked badge = safe).
3. Confirm **Master marketing enabled** is **OFF** unless you intentionally activate.

**Click-by-click — enable Workflow D (when ready + n8n connected)**

1. Read `docs/marketing/ACTIVATION-GATE.md` in repo first.
2. Turn **Emergency stop OFF** only when n8n is wired.
3. Turn **Master enabled ON**.
4. Enable individual workflow toggles (Shelter onboarding, etc.).
5. Run `npm run marketing:crm-export` locally to verify CSV — no send.

**Generate draft outreach emails (local, no send)**

```bash
cd freedompaws-app
npm run marketing:tn-outreach
```

Drafts appear in `docs/marketing/outbox/tn-pilot/`.

---

### 7.3 SHELTER & ID — `/ops/shelter-id`

**Purpose:** Freedom Paws ID stats + shortcuts to intake and match queue.

**KPIs:** Found reports · Pending reviews · Matched · ID enrollments

**Click-by-click — review a pending match as founder**

1. Go to **/ops/shelter-id**
2. Note **Pending reviews** count.
3. Click **Open match queue →**
4. Follow [Shelter Manual — Match Review](#) or:
   - Select report in list
   - Review candidate similarity scores
   - Add optional notes
   - Tap **Approve** or **Reject**
5. On approve: owner email sends if Resend + service role configured.

---

### 7.4 WELLNESS — `/ops/wellness`

**Purpose:** Insurance + telehealth partner URL readiness.

**Click-by-click — verify launch readiness**

1. Go to **/ops/wellness**
2. Check green/red rows for:
   - Insurance quote URL
   - Insurance lost-dog URL
   - Telehealth book URL
3. Open **https://app.freedompawsinc.com/api/wellness/config-status** — `"ready": true`
4. Fix missing vars in **Vercel dashboard** (not only `.env.local`).

---

### 7.5 PRODUCT — `/ops/product`

**Purpose:** PWA version, feature flags, shop readiness.

**Click-by-click — toggle a feature flag**

1. Go to **/ops/product**
2. Under **Feature flags**, flip desired switch (e.g. insurance module).
3. Change saves to Supabase immediately.

**Click-by-click — review ViT symptom feedback**

1. On Product page, click **Symptom admin →**
2. Enter admin password (from `SYMPTOM_ADMIN_PASSWORD` env).
3. Approve or reject unknown symptom phrases for lexicon merge.
4. Run locally: `npm run symptom:merge` then deploy.

---

### 7.6 SYSTEM — `/ops/system`

**Purpose:** Infrastructure health snapshot.

**Checklist rows:**

| Row | Must be green for production |
|-----|------------------------------|
| Supabase | Yes |
| Resend API | Yes (email) |
| Match owner email path | Yes (reunions) |
| FP_OPS_EMAILS | Yes (your access) |
| Service role key | Yes (waitlist, admin tasks) |

**External links:** Vercel · Supabase · Resend · n8n

---

## 8. Reports & data available in Control Panel

| Report / KPI | Where | Source |
|--------------|-------|--------|
| TN partner list + listing counts | /ops/adoption | `adoption_listings` + partners |
| Listing pipeline (5 statuses) | /ops/adoption | Aggregated counts |
| Partner outreach approvals | /ops/adoption toggles | `ops_settings` |
| Marketing workflow states | /ops/marketing | `ops_settings` |
| Found / pending / matched ID | /ops/shelter-id | ID tables |
| Waitlist signups | /ops home | `waitlist_signups` |
| Wellness config status | /ops/wellness + API | Env vars |
| PWA version | /ops/product | `lib/pwa-version.ts` |
| Xaman / Stripe ready | /ops/product | Env check |
| Feature flags | /ops/product | Supabase |
| Audit log (15 recent) | /ops home | `audit_log` |
| ViT Pro module status | /vit-pro + API | `/api/vit-pro/status` |

### Reports you generate via CLI (not in UI)

| Command | Output |
|---------|--------|
| `npm run marketing:crm-export` | CRM CSV |
| `npm run marketing:tn-outreach` | Draft emails in docs/outbox |
| `npm run vit-pro:benchmark` | Benchmark CSV + JSON in `data/vit-pro/benchmark/results/` |
| `npm run ops:verify` | Launch verification script |
| `npm run binders:pdf` | PDF binders to Documents |

---

## 9. Member app (consumer PWA)

| Module | Path | Founder test URL |
|--------|------|------------------|
| Home | `/` | Landing + feature cards |
| ViT Diagnostics | `/diagnostics` | Photo/video analyze |
| Protocols | `/protocols` | 10 protocol pages |
| Token Shop | `/token-shop` | Xaman checkout |
| Photo Booth | `/photobooth` | SuperBud editor |
| Freedom Paws ID | `/id` | Hub |
| ID Enroll | `/id/enroll` | Owner biometric enroll |
| My Pets | `/mypets` | Vault |
| Wellness | `/wellness` | Insurance + telehealth |
| Monitor | `/monitor` | Camera beta |
| Adopt TN | `/adopt/tn` | Public directory |

---

## 10. Backend & infrastructure

### Supabase

- **Migrations:** `supabase/migrations/` — run via SQL Editor or `npm run ops:migrate`
- **Combined script:** `supabase/RUN_ALL_MIGRATIONS_001_004.sql`
- **Partner bootstrap:** `npm run partner:bootstrap`

### Vercel

- Production deploys from `main` branch
- Env vars: **Project Settings → Environment Variables**
- Domains: `app.freedompawsinc.com`, `shelter.freedompawsinc.com`

### Key API routes (founder debugging)

| Route | Purpose |
|-------|---------|
| `POST /api/analyze` | ViT wellness, identity, vit_pro |
| `GET /api/wellness/config-status` | Partner URL readiness |
| `GET /api/vit-pro/status` | ViT Pro module stats |
| `/api/id/match/*` | Match queue CRUD |
| `/api/partner/listings/*` | Adoption listings |

---

## 11. Environment variables (founder reference)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin/waitlist/match email |
| `OPENAI_API_KEY` | ViT vision |
| `FP_OPS_EMAILS` | Founder ops access |
| `VIT_PRO_ADVISOR_EMAILS` | Vet portal access |
| `VIT_PRO_ENABLED` | Kill switch for ViT Pro |
| `RESEND_API_KEY` | Transactional email |
| `XUMM_*` | XRPL checkout |
| `NEXT_PUBLIC_APP_URL` | https://app.freedompawsinc.com |
| Wellness vars | See `/ops/wellness` |

**Never commit secrets.** Use Vercel for production; root `.env.local` for local dev only.

---

## 12. CLI scripts & generated reports

```bash
npm run dev              # Local server
npm run build            # Production build + PWA sync
npm run ops:migrate      # Ops settings migration
npm run ops:verify       # Launch checks
npm run partner:bootstrap # Seed partner orgs
npm run id:setup:check   # Supabase ID config
npm run vit-pro:benchmark # ViT Pro 50-photo run
npm run binders:pdf      # Regenerate PDF binders
npm run symptom:test:all # Lexicon category tests
```

---

## 13. Deploy & release checklist

1. `npm run build` — passes locally
2. Bump `PWA_VERSION` in `lib/pwa-version.ts` if user-facing change
3. `git push` to `main` → Vercel deploys
4. Verify https://app.freedompawsinc.com/api/wellness/config-status
5. Test login on iPhone (magic link + OTP)
6. Check `/ops/system` — all green

---

## 14. Daily / weekly founder routines

### Daily (5 min)

- [ ] Open `/ops` — check match queue + available listings
- [ ] Vercel dashboard — last deploy green

### Weekly

- [ ] `/ops/adoption` — partners with 0 listings → follow up
- [ ] `/admin/symptoms` — clear feedback queue
- [ ] Review ViT Pro benchmark progress if advisor engaged

### Pre-launch

- [ ] LLC/trademark clearance
- [ ] Framer `/adopt` publish
- [ ] First real TN listing live
- [ ] Partner onboarding email (when marketing gate open)

---

## 15. Troubleshooting

| Problem | Fix |
|---------|-----|
| Can't access `/ops` | Add email to `FP_OPS_EMAILS`; re-login |
| Magic link opens wrong page | Use `?next=/ops` on login URL |
| Match email not sent | Check Resend + service role on `/ops/system` |
| Listings not public | Status must be `available` or `pending` |
| ViT analyze fails | Check `OPENAI_API_KEY` on Vercel |
| Partner can't sign in | Supabase redirect URLs + shelter DNS |

---

## Appendix A — URL quick reference

| Name | URL |
|------|-----|
| App | https://app.freedompawsinc.com |
| Ops | https://app.freedompawsinc.com/ops |
| Partner | https://shelter.freedompawsinc.com/partner |
| ViT Pro | https://app.freedompawsinc.com/vit-pro |
| Adopt TN | https://app.freedompawsinc.com/adopt/tn |
| Login | https://app.freedompawsinc.com/login |
| Config status | https://app.freedompawsinc.com/api/wellness/config-status |

---

## Appendix B — Role matrix

| Action | owner | shelter_staff | shelter_admin | fp_ops |
|--------|:-----:|:-------------:|:-------------:|:------:|
| Member app | ✅ | ✅ | ✅ | ✅ |
| Partner portal | — | ✅ | ✅ | ✅ |
| Found intake | — | ✅ | ✅ | ✅ |
| Match approve | — | — | ✅ | ✅ |
| Draft listing | — | ✅ | ✅ | ✅ |
| Publish listing | — | — | ✅ | ✅ |
| Command Center | — | — | — | ✅ |
| ViT Pro | — | — | — | ✅* |

*Advisors: `VIT_PRO_ADVISOR_EMAILS` or `vet_staff`

---

## Appendix C — npm scripts

See `package.json` scripts section. Key: `dev`, `build`, `ops:migrate`, `ops:verify`, `partner:bootstrap`, `partner:migrate`, `vit-pro:benchmark`, `marketing:crm-export`, `marketing:tn-outreach`, `binders:pdf`.

---

## Appendix D — External dashboards

| Service | URL |
|---------|-----|
| Vercel | https://vercel.com/dashboard |
| Supabase | https://supabase.com/dashboard |
| Resend | https://resend.com/emails |
| GitHub | https://github.com/MKC-PUG/FREEDOMPAWSWELLNESS |

---

*Freedom Paws Wellness © 2026 · Internal founder manual · Honor Buddy's Legacy*
