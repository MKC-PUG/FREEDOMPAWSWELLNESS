# Freedom Paws Wellness
# Founder Master Schedule & Checklist — Now → Launch → Post-Launch → ViT Pro

**Created:** June 21, 2026 · **Updated:** June 30, 2026  
**For:** Solo founder · 10–15 hrs/day · $0 cash runway · investment target ~September  
**App:** `https://app.freedompawsinc.com` · PWA **v94**  
**Website:** `https://freedompawsinc.com` (Framer) · **Member Tools** `/member-tools` — Part L signed **June 30, 2026**  
**How to use:** Work **one department block per day** (or half-day). Check boxes. Do not start Phase 1 outreach until **Launch Activation** gates pass.

**Companion docs (do not duplicate — link only):**
- `docs/marketing/DAY-1-14-Execution-Checklist-June-2026.md` — outreach automation **prepare-only**
- `docs/Freedom-Paws-Launch-Master-Checklist-June-2026.md` — engineering tracks (June 14)
- `docs/Freedom-Paws-Website-Post-Launch-Completion-Report-May-2026.md` — Framer punch list
- `docs/training/Freedom-Paws-Founder-CEO-Developer-Manual-May-2026.md` — ops daily reference

---

## Quick answer: Is the 14-Day Automation Checklist for the CRM?

**Partially — but it is not “build a CRM product.”**

| What it is | What it is not |
|------------|----------------|
| **Prepare** partner outreach: export CSV → Google Sheets CRM, draft emails, wire n8n (inactive) | Building HubSpot/Salesforce-style software |
| **Phase 0** = safe now (local files, no sends) | Something to run before the app + website are ready |
| **Phase 1** = real emails to TN shelters (after activation gate) | Urgent compared to Framer layout + legal + member QA |

**Do Phase 0 now?** Yes — **1–2 hours total**, spread across a week:
- [ ] Run `npm run marketing:crm-export`
- [ ] Run `npm run marketing:tn-outreach`
- [ ] Skim drafts in `docs/marketing/outbox/tn-pilot/`
- [ ] Optional: import CSV to Google Sheets — leave **`Approved` blank**

**Do Phase 1 (sends) now?** **No.** Wait until **Launch Activation** (Section 4) — you need trademark path, attorney-reviewed Terms, Framer `/adopt` live, and at least one iPhone sign-off on ViT + Photo Booth.

---

## Your operating system (solo founder, no distractions)

### Weekly rhythm

| Day | Primary block (3–4 hrs) | Secondary block (2–3 hrs) |
|-----|-------------------------|---------------------------|
| **Mon** | Plan week — pick 5 department blocks | Ops: `/ops` dashboard review |
| **Tue** | **Product / Engineering** (app) | Founder QA on iPhone |
| **Wed** | **Website / Framer** | Legal / admin (calls, forms) |
| **Thu** | **Adoption + partnerships prep** | CRM Phase 0 only |
| **Fri** | **Content / brand / grants** | Week review — check boxes |
| **Sat** | Deep build OR catch-up | ViT Pro / docs |
| **Sun** | Rest OR light planning | No guilt — sustainability wins |

### Daily rule (non-negotiable)

1. **One primary department** until its block timer ends.  
2. **No outbound email** until Launch Activation.  
3. **No new features** until current track gate is 🟢.  
4. End day with **3 checked boxes** minimum — momentum > perfection.

### Money reality (June → September)

| Can do $0 | Needs funding later |
|-----------|---------------------|
| Build, QA, Framer (you), grants, XRPL apps, organic social prep | Vet association fees, product inventory, TN relocation, paid ads, attorney retainers beyond basics, Monitor cloud infra at scale |
| Phase 0 CRM + draft outreach | Phase 1 scaled outreach + Impact.com |
| Copyright filing (relatively low cost — prioritize) | Trademark attorney full engagement |
| ViT Pro advisor relationships (time, not cash) | Clinical validation studies, SaMD path |

---

## Phase map

| Phase | Timeline | Goal |
|-------|----------|------|
| **0 — Finish the machine** | Now → ~4–8 weeks | **~90%** — legal (L5) + one partner listing remain |
| **1 — Launch activation** | 1–2 weeks | Public index, first outreach, social ON |
| **2 — Post-launch (90 days)** | Months 1–3 | TN pilot live listings, members, feedback loops |
| **3 — ViT Pro buildout** | Parallel after V0 stable | Advisor bench, benchmark, packaging |
| **4 — Funded scale** | When capital lands (~Sept+) | Products, vet assoc, TN move, paid growth |

---

# DEPARTMENT 1 — Executive & Founder Ops

## Phase 0 — Now

- [ ] Read `docs/training/Freedom-Paws-Founder-CEO-Developer-Manual-May-2026.md` (skim § Ops Command Center)
- [ ] Bookmark `/ops` — login weekly: `https://app.freedompawsinc.com/ops`
- [ ] Confirm Vercel production env vars healthy (`/ops/system`)
- [ ] Set **one** weekly calendar block: ViT admin symptom queue (Monday 30 min)
- [ ] Maintain single “source of truth” folder: `~/Documents/Freedom Paws Wellness/`
- [ ] Run `npm run binders:pdf` after major doc updates

## Phase 1 — Launch activation

- [ ] Flip `NEXT_PUBLIC_SITE_MODE=public` (only after Legal gate)
- [ ] Remove or update preview-only messaging sitewide
- [ ] Announce launch on personal network + waitlist
- [ ] Log launch date in `/ops` audit notes

## Phase 2 — Post-launch (90 days)

- [ ] Weekly `/ops` KPI review (15 min)
- [ ] Monthly: regenerate binders PDF for grant packets
- [ ] Quarterly: revisit 10-year vision doc against actual metrics
- [ ] **Impact Dashboard gate:** start live public build after **first confirmed reunion** **OR** **Jan 2027 promotion prep** (whichever first). Not before L5; Framer methodology OK earlier. Plan: `Freedom-Paws-Impact-Dashboard-Plan-July-2026.md`

---

# DEPARTMENT 2 — Legal, IP & Compliance

## Phase 0 — Now (highest ROI for outreach delay)

- [x] **Copyright** — filed **June 25, 2026** for all **6 binders** and key documents *(L6 cleared)*
- [ ] **Trademark** — Freedom Paws Wellness / logo — consult or file intent-to-use when budget allows
- [ ] LLC / entity status — confirm good standing for contracts
- [ ] **Attorney review queue (L5 — critical path)** — see **Section 4A** below
  - [ ] `/terms` and `/privacy` on app — upgrade from founder draft (`lib/legal/content.ts`)
  - [ ] ViT “not a diagnosis” / vet urgency banner copy
  - [ ] ID enroll / biometric consent language (in-app + Framer Member Tools)
  - [ ] 10% give-back / donation claims — define **eligible revenue base** + Framer wording
- [ ] Insurance outreach kit — do not send until counsel clears (`Freedom-Paws-Insurance-Outreach-Kit-June-13-2026.md`)

## Phase 1 — Launch activation

- [ ] Counsel sign-off on public launch
- [ ] `SITE_MODE=public` + robots/indexing enabled
- [ ] Partner MOU template ready for TN shelters (even if informal pilot letter)

## Phase 2 — Post-launch

- [ ] Partner agreements executed with 1+ TN pilot org
- [ ] Privacy policy update if collecting new data types
- [ ] ViT Pro advisor agreements (NDA + advisory terms)

---

# DEPARTMENT 3 — Product Engineering (Member App)

**Primary doc:** `Freedom-Paws-Launch-Master-Checklist-June-2026.md`

## Phase 0 — Launch blockers (do in order)

### Gate A — ViT Diagnostics 🟡
- [ ] iPhone prod test: `/diagnostics` — photo + symptoms → top 2 protocols
- [ ] Feedback Yes/No works on production
- [ ] Weekly admin queue: `/admin/symptoms` → approve → `npm run symptom:merge` when batch ready
- [ ] Attorney copy pass on results disclaimers

### Gate B — Photo Booth 🟢
- [x] Phase 4 background JPGs in `public/images/photobooth/backgrounds/`
- [x] iPhone sign-off (core editor + share/save)
- [x] Print affiliate catalog + partners page (v94) — env URLs when partners signed
- [ ] Credits decrement correctly after AI Magic Look (quick retest on v94)

### Gate C — My Pets + Vault 🟢
- [ ] Smoke test add/edit pet + vault upload
- [ ] Optional: per-pet protocol tracking (server unlock)

### Gate D — Monitor 🔴 (member launch blocker)
- [ ] Architecture spike: cloud relay (not founder-home-only)
- [ ] Member setup flow documented
- [ ] Production Wyze/go2rtc path OR defer Monitor from v1 launch marketing (explicit decision)

### Gate E — Token Shop + Xaman 🟢
- [ ] Test purchase flow on mainnet (small amount)
- [ ] Protocol slugs match Framer + `lib/shop/protocol-catalog.ts`

### Gate F — Protocols (10) 🟢
- [ ] All `/protocols/[slug]` pages load on iPhone
- [ ] Images and prices match source of truth

### Gate G — PWA / Brand 🟢
- [x] Home screen icon: paw fill — re-add shortcut after deploy
- [x] Nav: paw + “Freedom Paws Wellness” text
- [x] Service worker updates on deploy — **v94** live on `main`

### Gate H — Auth + Waitlist 🟢
- [ ] Magic link login works on production
- [ ] Waitlist captures emails

## Phase 1 — Launch activation

- [ ] `npm run build` clean before each major deploy
- [ ] Production smoke test all nav links from PWA
- [ ] Enable public indexing

## Phase 2 — Post-launch (90 days)

- [ ] ViT Phase 3: persistent upload storage
- [ ] Photo Booth: share card + QR
- [ ] Monitor cloud relay shipped OR removed from nav until ready
- [ ] Stripe webhook + membership (when funded)

---

# DEPARTMENT 4 — Marketing Website (Framer)

**Primary doc:** `Freedom-Paws-Website-Post-Launch-Completion-Report-May-2026.md`

## Phase 0 — Now (founder + contractor)

### P0 — Blockers
- [x] **Member Tools page** (`/member-tools`) — replaces ID & Tool Box · Part L signed June 30, 2026
- [x] **Fix ID & Tool Box / Member Tools Phone layout** — signed off in Framer publish
- [ ] **Build `/adopt` marketing page** → CTA `https://app.freedompawsinc.com/adopt/tn` *(nav shows Adopt — verify iPhone 4-tap)*
- [ ] Add **Adopt** to site nav *(likely done — confirm link)*

### P1 — High priority
- [ ] Update `/shelters` — TN pilot story + partner portal link
- [ ] Verify all 10 protocol cards: View → Framer detail, Buy → app token shop with slug
- [ ] Token Shop Framer page = teaser only → app checkout
- [ ] Homepage adoption block → `/adopt` or app directory

### P2 — Before public marketing push
- [ ] Framer **Publish** after layout fix
- [ ] iPhone 6-tap test: ID page (`Framer-CTA-Link-Map.md`)
- [ ] iPhone 4-tap test: `/adopt` page
- [ ] Monthly price sync ($18 / 25 XRP) with app

## Phase 1 — Launch activation

- [ ] Google Search Console — submit sitemap
- [ ] Social bios link to `freedompawsinc.com` + app install

## Phase 2 — Post-launch

- [ ] Wellness partner teasers when URLs live in `/ops/wellness`
- [ ] Grant landing page updates with traction metrics
- [ ] `.org` community site (future)

### Defensive domains — wire **after build + public launch** (not a launch blocker)

**Own now; redirect wiring later.** No app code or Vercel env changes required until this phase.

| Domain | Annual cost | Post-launch redirect target | Notes |
|--------|-------------|-------------------------------|--------|
| `freedompawz.com` | ~$11 | `https://freedompawsinc.com` | Typo defense only — never promote “Pawz” spelling |
| `vitproscan.com` | ~$11 | `https://app.freedompawsinc.com/vit-pro` | DVM **ViT Pro / VitProScan** brand — vet outreach, not consumer Photo Booth |

- [ ] **Now (optional):** Registrar “forward” to targets above — works without Vercel; swap to proper 301 when ready
- [ ] **Post-launch:** Add both domains in Vercel → Project → Domains (or keep registrar 301)
- [ ] **Post-launch:** If on Vercel, add host-based 301 in `next.config.ts` or `vercel.json` (eng session)
- [ ] **Post-launch:** Confirm redirects on iPhone (no mixed-content / wrong host in PWA)
- [ ] **Do not** add either domain to Framer CTAs, affiliate apps, or trademark specimens until counsel confirms use
- [ ] **Skip:** `freedompaws.com` ($8.7k), `vitpro.com` ($8k) — not required

**Free subdomains (same DNS pass as `app.` — no extra purchase):** optional `scan.freedompawsinc.com` → `/diagnostics` for consumer ViT marketing.

---

# DEPARTMENT 5 — Adoption Network & Shelter Partnerships

## Phase 0 — Now

- [ ] Confirm 6 TN pilot orgs in Supabase (`009` migration)
- [ ] Test public directory: `https://app.freedompawsinc.com/adopt/tn`
- [ ] Test partner portal: `https://shelter.freedompawsinc.com/partner`
- [ ] Create **one** test listing end-to-end (draft → available)
- [ ] Read `docs/ops/ADOPTION-KICKOFF-CLICK-BY-CLICK.md`
- [ ] Shelter portal training PDF ready to attach (when outreach starts)

## Phase 1 — Launch activation

- [ ] Framer `/adopt` live (story + CTA)
- [ ] Manual Email 1 to **one** TN partner (Memphis) — after Legal + Activation gate
- [ ] Onboard first partner admin account
- [ ] First **real** adoptable listing published by partner (not test)

## Phase 2 — Post-launch (90 days)

- [ ] 3+ partners with live listings
- [ ] 1+ adoption marked `adopted` in system (proof of loop)
- [ ] Partner feedback session notes → product backlog
- [ ] Expand beyond 6 orgs only after pilot success

---

# DEPARTMENT 6 — Marketing, CRM & Outreach Automation

**This is what the 14-Day Checklist is for — not app CRM software.**

## Phase 0 — Prepare only (safe now, 1–2 hrs/week)

- [ ] Read `docs/marketing/ACTIVATION-GATE.md`
- [ ] `npm run marketing:crm-export` → review CSV
- [ ] `npm run marketing:tn-outreach` → review 6 drafts in `outbox/tn-pilot/`
- [ ] Import CRM to Google Sheets — **`Approved` column empty**
- [x] Namecheap Private Email: info@ (catch-all), shelter@, partners@ live on iPhone + Mac Mail (IMAP) — completed July 12, 2026
- [ ] Cal.com booking link created (for drafts)
- [ ] n8n account — **workflows Inactive**
- [ ] Slack `#fp-approvals` + `#fp-metrics` (optional)

## Phase 1 — Launch activation (founder sends, not bots first)

- [ ] Activation gate signed (`ACTIVATION-GATE.md` checklist)
- [ ] Copyright filed (minimum)
- [ ] First send: **one** partner, manual, from shelter@
- [ ] Log in CRM: Status = Sent
- [ ] Then: remaining 5 TN pilots (staggered)
- [ ] Only then: activate n8n Workflow D with `Approved=YES`

## Phase 2 — Post-launch (90 days)

- [ ] Buffer/social scheduling (Workflow F) — after 2 weeks of manual rhythm
- [ ] Impact.com affiliate applications (when traffic exists)
- [ ] Insurance partner outreach (after legal kit cleared)
- [ ] Weekly: reply partners@ + shelter@; update CRM

## Emergency pause (memorize)

1. Deactivate all n8n workflows  
2. Clear `Approved` in CRM  
3. No cron = zero automated outbound  

---

# DEPARTMENT 7 — Brand, Content & Social Media

## Phase 0 — Now (prep only — no big spend)

- [ ] Brand assets current: `npm run brand:assets` after logo changes
- [ ] SuperBud / paw icons consistent (PWA v84)
- [ ] Draft 10 social posts (Canva) — **save as drafts, do not schedule**
- [ ] Write 30-day content calendar (topics only — ViT tips, adoption stories, Buddy legacy)
- [ ] Claim/hold handles: Instagram, Facebook, TikTok, LinkedIn (company page)
- [ ] `lib/social-links.ts` — real URLs when accounts exist
- [ ] 3 “founder story” video scripts (phone selfie OK for launch)

## Phase 1 — Launch activation

- [ ] Profile photos + bios live with link to Framer + app
- [ ] Launch post (personal + brand page)
- [ ] 3 posts/week rhythm starts
- [ ] Join 2–3 senior-dog / rescue Facebook groups (lurking → value-first comments)

## Phase 2 — Post-launch (90 days)

- [ ] User-generated content from Photo Booth shares
- [ ] Partner spotlight posts (with permission)
- [ ] Grant announcement posts when submitted/awarded
- [ ] Email waitlist monthly update

---

# DEPARTMENT 8 — Finance, Grants & Funding

## Phase 0 — Now ($0 activities)

- [ ] XRPL grant application — gather: General Binder PDF, Technical Binder PDF, demo links
- [ ] List all grant deadlines in one sheet (XRPL, local TN, veteran-focused, animal welfare)
- [ ] Document use-of-funds for September investment (vet assoc, legal, products, TN move)
- [ ] Stripe account setup (test mode) — no live charges until counsel
- [ ] Track monthly burn: $0 tools list vs future paid tools

## Phase 1 — When first dollars arrive

- [ ] Trademark attorney retainer
- [ ] Product samples / protocol inventory
- [ ] Monitor cloud hosting budget
- [ ] TN relocation fund (separate bucket)

## Phase 2 — Post-launch

- [ ] Update grant applications with pilot metrics (listings, members, adoptions)
- [ ] Founding member / early supporter campaign (if counsel approves)

---

# DEPARTMENT 9 — Ops Command Center

## Phase 0 — Now

- [ ] Access `/ops` with `fp_ops` role
- [ ] Review modules: Marketing, Shelter-ID, Wellness, Product, System
- [ ] Confirm marketing emergency stop = ON (dormant)
- [ ] Feature flags understood (`/ops/product`)

## Phase 1 — Launch activation

- [ ] Marketing gates documented in `/ops/marketing`
- [ ] KPI baseline recorded (day 0)

## Phase 2 — Post-launch

- [ ] Weekly KPI: waitlist, listings, ViT runs, shop attempts
- [ ] Audit log review for partner actions

---

# DEPARTMENT 10 — Freedom Paws ID

## Phase 0 — Now

- [x] Track 1 flows: enroll, found, match — iPhone smoke test **PASS** (June 2026)
- [x] Track 2 chip MVP: `/id/scan`, `/id/lookup`, settings, My Pets — **v93** on production
- [x] Supabase ID migrations applied in production (`014_microchip_track2.sql`)
- [x] Resend match email tested (controlled prod test)
- [x] Framer **Member Tools** copy = launch-safe (Part L signed)
- [ ] **AAHA partnership email** — **not sent** — see **Section 4B** below
- [ ] Attorney: chip + registry disclaimer footers on `/id/lookup` + `/id/scan`

## Phase 1 — Launch activation

- [ ] ID marketing: **Member Tools** page live + Part L iPhone pass ✅ *(done June 30)*
- [ ] Shelter workflow demo ready for partner calls

## Phase 2 — Post-launch

- [ ] Track 2: order HID scanner hardware (`Freedom-Paws-ID-Track-2-Supplies-Shopping-Guide-June-2026.md`)
- [ ] `/id/scan` MVP with hardware
- [ ] Retail scanner kit plan (`docs/ops/TRACK-2-RETAIL-SCANNER-KIT-PLAN-June-20-2026.md`)
- [ ] **Impact Dashboard** (gated): live public counters after **first confirmed reunion** **OR** **Jan 2027 promotion prep** (earliest). Not before L5; Framer methodology OK earlier. Plan: `Freedom-Paws-Impact-Dashboard-Plan-July-2026.md`

---

# DEPARTMENT 11 — Wellness & Partner Integrations

## Phase 0 — Now

- [ ] `/wellness` hub loads
- [ ] `/ops/wellness` — document insurance + telehealth URL placeholders
- [ ] Safe products page accurate
- [ ] No live partner URLs until contracts exist

## Phase 1 — Launch activation

- [ ] Framer wellness teaser (optional) → app `/wellness`

## Phase 2 — Post-launch

- [ ] First insurance or telehealth partner env vars live
- [ ] Affiliate disclosure copy reviewed by counsel

---

# DEPARTMENT 12 — ViT Pro (Clinical Decision Support)

**Not public marketing — advisor / vet channel parallel track**

## Phase 0 — V0 shipped (maintain)

- [ ] `/vit-pro` access for advisor emails in `VIT_PRO_ADVISOR_EMAILS`
- [ ] Run `npm run vit-pro:benchmark` — save results
- [ ] Corpus browser useful for 1 advisor demo
- [ ] Training manual PDF sent to first advisor prospect
- [ ] Business plan read: `docs/ops/ViT-PRO-BUSINESS-PLAN-AND-ROADMAP-June-2026.md`

## Phase 1 — Advisor bench (no SaMD claims)

- [ ] Recruit 2–3 licensed advisors (time trade, not cash)
- [ ] 10 structured benchmark cases documented
- [ ] Feedback → tier A/B output tuning
- [ ] No Framer page — onboarding via manual only

## Phase 2 — Packaging (3–6 months)

- [ ] Standalone SKUs defined in business plan
- [ ] Vet association conversation (when funded)
- [ ] Clinical validation roadmap (not diagnosis claims)
- [ ] Separate Terms addendum for B2B vet use

## Phase 3 — Funded scale (post-September)

- [ ] Paid pilot with clinic or telehealth partner
- [ ] VeNom / synonym expansion
- [ ] API metering / practice seats

---

# SECTION 4 — Launch Activation Gate (all must pass)

Do **not** flip public mode or send partner outreach until:

| # | Gate | Owner | Status (Jun 30) |
|---|------|-------|-----------------|
| L1 | ViT iPhone prod test pass | Founder | 🟡 Quick retest recommended |
| L2 | Photo Booth iPhone sign-off | Founder | 🟢 Core + v94 affiliates |
| L3 | Framer Member Tools page (`/member-tools`) | Founder | ✅ **Pass June 30** |
| L4 | Framer `/adopt` page published | Founder | 🟡 Verify CTA → app directory |
| L5 | Attorney review Terms/Privacy + consent + give-back | Counsel | 🔴 **Critical path** — see **4A** |
| L6 | Copyright filed | Founder | ✅ **Filed June 25, 2026** (6 binders) |
| L7 | Test adoption listing E2E works | Founder | 🟡 Open — need partner-published listing |
| L8 | `npm run build` + deploy green | Engineering | ✅ **v94** on `main` |
| L9 | Activation gate read (`ACTIVATION-GATE.md`) | Founder | 🟡 |

**Then:**
- [ ] `NEXT_PUBLIC_SITE_MODE=public`
- [ ] First manual partner email (one org)
- [ ] Social launch posts

---

## SECTION 4A — L5 Attorney queue: what to do (founder playbook)

**Goal:** Replace the yellow **“founder draft — not formal legal counsel”** banner on `/terms` and `/privacy` with **attorney-reviewed** text so you can flip `SITE_MODE=public` and send shelter outreach.

**You already have:** Draft sections in `lib/legal/content.ts` (Terms + Privacy, last updated June 13, 2026). Pages live at `app.freedompawsinc.com/terms` and `/privacy`.

### Step 1 — Pick counsel (1–2 hours)

| Option | When |
|--------|------|
| **Pet / health-tech friendly attorney** (recommended) | Before public launch |
| **LegalZoom / Rocket Lawyer business package** | Budget stopgap — still get ID + AI clauses reviewed |
| **WY LLC registered agent referral** | Often has partner list |

Ask for: **Terms of Use, Privacy Policy, biometric consent, affiliate disclosures, 10% give-back language** — flat-fee review if possible.

### Step 2 — Send counsel this packet (one email)

Attach or link:

| # | Document | Path |
|---|----------|------|
| 1 | Current Terms draft | `lib/legal/content.ts` → TERMS_SECTIONS |
| 2 | Current Privacy draft | `lib/legal/content.ts` → PRIVACY_SECTIONS |
| 3 | Live URLs | `https://app.freedompawsinc.com/terms` · `/privacy` |
| 4 | Framer Member Tools disclaimer | `freedompawsinc.com/member-tools` (screenshot) |
| 5 | ID enroll consent flow | Screenshot `/id/enroll` consent step |
| 6 | ViT results disclaimer | Screenshot `/diagnostics` results + urgency banner |
| 7 | Give-back methodology | `docs/Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md` § give-back |
| 8 | Copyright registration | Confirmation filed **June 25, 2026** (6 binders) |

**Subject line:** `Freedom Paws Wellness — Terms/Privacy/biometric review for Oct 2026 pilot launch`

### Step 3 — Ask counsel to sign off on these five items

| # | Topic | What attorney must confirm |
|---|--------|---------------------------|
| 1 | **Terms of Use** | Not veterinary advice; limitation of liability; XRPL/Token Shop; affiliate disclosures |
| 2 | **Privacy Policy** | Biometric descriptors/embeddings; OpenAI processing; Supabase; deletion rights |
| 3 | **Biometric consent** | In-app enroll consent + revoke in `/id/settings` — sufficient for TN pilot |
| 4 | **ViT / CDS language** | “Wellness guidance” / “not diagnosis” on consumer tier; urgent-care banners |
| 5 | **10% give-back** | Define **eligible net** (Token Shop + affiliate only); 50/50 vets/shelters; safe Framer wording |

### Step 4 — Implement attorney edits (engineering — ~1 hour)

1. Founder receives redline or replacement sections from counsel.
2. Update `lib/legal/content.ts` with approved text.
3. Set `LEGAL_LAST_UPDATED` to counsel sign-off date.
4. Remove or soften the yellow “founder draft” banner in `LegalPageShell.tsx` **only after** counsel approves.
5. Deploy to `main` → verify `/terms` and `/privacy` on iPhone.

### Step 5 — Mark L5 complete

- [ ] Written email or letter from counsel: “approved for pilot launch” (save PDF to `~/Documents/Freedom Paws Wellness/Legal/`)
- [ ] Log date in `/ops` audit notes
- [ ] **Then** flip `NEXT_PUBLIC_SITE_MODE=public` on Vercel

**Budget expectation:** $1,500–$4,000 for startup Terms + Privacy + biometric addendum (varies by market). Ask for **pilot-scope** review, not full SaMD/FDA package yet.

---

## SECTION 4B — AAHA partnership email: what to do (20 minutes)

**Status:** **Not sent** as of June 30, 2026.  
**This does not block consumer launch** — you already link out to AAHA from `/id/lookup`. The email starts the **embed/API partnership** path for Track 2 (2027).

**Why send now:** Starts a 4–12 week clock; no cost; shows registry good faith before scanner kit promotion (Jan 2027).

### Click-by-click

1. Open email (from `info@freedompawsinc.com` or `partners@freedompawsinc.com`).
2. **To:** `petmicrochiplookup@aaha.org`
3. **Subject:** `Freedom Paws ID — microchip lookup partnership inquiry (TN shelter pilot)`
4. **Paste body** (edit names as needed):

```
Hello AAHA Pet Microchip Lookup team,

Freedom Paws Wellness (https://app.freedompawsinc.com) is a nonprofit-aligned pet wellness PWA launching a Tennessee shelter adoption and reunion pilot in October 2026.

We have shipped a microchip scan and validate flow at /id/scan and currently direct users to your public lookup at /id/lookup (external link). We do not display owner contact information from registries.

We are requesting information on:
1. Partnership or API terms for in-app registry routing (chip → participating registry name/phone only, no owner PII).
2. Any requirements for shelters using our Universal Scan Kit with your lookup ecosystem.
3. Point of contact for technical integration questions.

Pilot partners: Tennessee municipal shelters and rescues (Freedom Paws Adoption Network). We are Wyoming LLC, counsel-reviewed Terms/Privacy in progress.

Thank you,
[Your name]
Founder, Freedom Paws Wellness LLC
info@freedompawsinc.com
https://freedompawsinc.com
```

5. **Send.**
6. Log in CRM or session log: **AAHA email sent — [date]**
7. When they reply → forward to attorney (counsel reviews any API/embed terms before you build embed).

**Reference:** `docs/ops/TRACK-2-SCAN-BUILD-SPEC-CLICK-BY-CLICK.md` § 2.1

---

# SECTION 5 — First 14 days after launch

| Day | Focus |
|-----|-------|
| 1 | Public announce + waitlist email |
| 2 | Manual partner Email 1 — Memphis only |
| 3 | Monitor replies; log CRM |
| 4 | Social post #2 + iPhone retest all nav |
| 5 | Partner portal walkthrough call (if reply) |
| 6 | ViT admin queue |
| 7 | Rest / content batch |
| 8 | Partner Email 1 — org #2 (if #1 went well) |
| 9 | Grant submission follow-up |
| 10 | Photo Booth UGC ask (friends/beta) |
| 11 | Framer link audit |
| 12 | Ops KPI review |
| 13 | ViT Pro advisor outreach (1 email) |
| 14 | Week retrospective — adjust schedule |

---

# SECTION 6 — What to do THIS WEEK (June 30, 2026)

**If you only do five things:**

1. [x] **Copyright filing** — **DONE June 25, 2026** (6 binders)  
2. [ ] **L5 attorney packet** — send counsel email per **Section 4A** (highest priority)  
3. [ ] **AAHA email** — send per **Section 4B** (20 min, non-blocking)  
4. [ ] **L7 adoption listing** — one partner publishes a real dog in portal  
5. [ ] **ViT iPhone prod test** (T1 checklist) — 10 min · close L1  

**Explicitly defer:**
- n8n workflow activation  
- Paid ads  
- TN relocation  
- Vet association fees  
- Monitor cloud build (unless you choose to drop Monitor from v1 marketing)  

---

# SECTION 7 — Progress tracker (updated June 30, 2026)

| Department | Phase 0 % est. | Launch blocker? | Notes |
|------------|----------------|-----------------|-------|
| Executive Ops | 90% | No | Founder docs committed; Member Tools signed off |
| Legal / IP | **55%** | **Yes — L5 only** | **L6 copyright filed 6/25/26** |
| App Engineering | **88%** | Monitor optional | **v94** · chip v93 · Photo Booth affiliates |
| Framer Website | **90%** | 🟡 `/adopt` verify | **Member Tools** live · Part L pass |
| Adoption Network | 90% | L7 partner listing | Portal + directory live |
| Marketing Automation | 60% prepare | Phase 1 gated | Wait for L5 |
| Brand / Social | 55% prep | No | |
| Finance / Grants | 45% | No | Product-line + investor docs in repo |
| Ops Command Center | 95% | No | |
| Freedom Paws ID | **85%** | AAHA email open | Track 2 MVP live |
| Wellness | 70% | Partner URLs | |
| ViT Pro | 88% V0 | No (parallel) | Advisor bench not started |

### Launch gate scorecard

| Cleared | Open |
|---------|------|
| L3 Member Tools ✅ | L5 Attorney ⛔ |
| L6 Copyright ✅ | L7 Partner listing |
| L8 v94 deploy ✅ | L1 ViT retest |
| L2 Photo Booth 🟢 | L4 `/adopt` verify |
| | L9 Activation doc read |

---

# Closing — Realistic inspiration

You are not behind. You shipped **more than most funded startups build in year one**: a multi-surface PWA, partner portal, adoption directory, ops center, ViT Pro V0, ID workflows, token shop, and a full training library — **solo, on zero budget**.

Your constraint is not talent or work ethic. It is **sequencing**: the world sees one brand, but you are running twelve departments. The fix is not more hours — it is **fewer open fronts per day**.

**The next 60 days in one sentence:** ~~Finish the storefront (Framer)~~ **Storefront largely done (Member Tools)** — **lock the legal floor (L5 attorney)**, prove one partner listing (L7), send AAHA inquiry, then **one** shelter email.

**June 30 milestone:** Copyright filed · Member Tools marketing hub live · app **v94** · **L5 is the remaining hard gate** before `SITE_MODE=public`.

When September capital arrives, you will not be “starting.” You will be **activating** a machine you already built: flip public mode, fund TN move, pay counsel, stock product, and scale what is already working.

**Buddy's legacy is not built in a single sprint. It is built in checked boxes — one department, one day, until the doors open.**

---

*Regenerate PDFs for grant packets: `npm run binders:pdf`*  
*Questions for next Cursor session: “Deploy X,” “Fix Framer blocker Y,” “Run symptom merge.”*
