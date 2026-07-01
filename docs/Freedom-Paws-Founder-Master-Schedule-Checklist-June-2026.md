# Freedom Paws Wellness
# Founder Master Schedule & Checklist — Now → Launch → Post-Launch → ViT Pro

**Created:** June 21, 2026  
**For:** Solo founder · 10–15 hrs/day · $0 cash runway · investment target ~September  
**App:** `https://app.freedompawsinc.com` · PWA **v84**  
**Website:** `https://freedompawsinc.com` (Framer)  
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
| **0 — Finish the machine** | Now → ~4–8 weeks | App + website + legal prep ready to flip `SITE_MODE=public` |
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

---

# DEPARTMENT 2 — Legal, IP & Compliance

## Phase 0 — Now (highest ROI for outreach delay)

- [ ] **Copyright** — file for key materials (binders, training manuals, protocol copy) ASAP
- [ ] **Trademark** — Freedom Paws Wellness / logo — consult or file intent-to-use when budget allows
- [ ] LLC / entity status — confirm good standing for contracts
- [ ] Attorney review queue:
  - [ ] `/terms` and `/privacy` on app
  - [ ] ViT “not a diagnosis” / vet urgency banner copy
  - [ ] ID enroll / biometric consent language
  - [ ] 10% give-back / donation claims on Framer (if stated)
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

### Gate B — Photo Booth 🟡
- [ ] Phase 4 background JPGs in `public/images/photobooth/backgrounds/`
- [ ] iPhone sign-off checklist (`Today-Session-Founder-Checklists-June-2026.md` → T3)
- [ ] Credits decrement correctly after AI Magic Look

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
- [ ] Home screen icon: paw fill (v84) — re-add shortcut after deploy
- [ ] Nav: paw + “Freedom Paws Wellness” text
- [ ] Service worker updates on deploy

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
- [ ] **Fix ID & Tool Box page Phone layout** (overlap, clip, black gaps) — contractor if needed
- [ ] **Build `/adopt` marketing page** → CTA `https://app.freedompawsinc.com/adopt/tn`
- [ ] Add **Adopt** to site nav

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
- [ ] Resend: domain verified; shelter@ + partners@ forward to you (receive only)
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

- [ ] Track 1 flows: enroll, found, match, shelter dashboard — iPhone smoke test
- [ ] Supabase ID migrations applied in production
- [ ] Resend match email tested (staging or controlled prod test)
- [ ] Framer ID page copy = Option A (softened claims)
- [ ] **Blocker:** Framer ID page Phone layout fixed

## Phase 1 — Launch activation

- [ ] ID marketing page live + 6-tap iPhone pass
- [ ] Shelter workflow demo ready for partner calls

## Phase 2 — Post-launch

- [ ] Track 2: order HID scanner hardware (`Freedom-Paws-ID-Track-2-Supplies-Shopping-Guide-June-2026.md`)
- [ ] `/id/scan` MVP with hardware
- [ ] Retail scanner kit plan (`docs/ops/TRACK-2-RETAIL-SCANNER-KIT-PLAN-June-20-2026.md`)

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

| # | Gate | Owner |
|---|------|-------|
| L1 | ViT iPhone prod test pass | Founder |
| L2 | Photo Booth iPhone sign-off (or explicit deferral from marketing) | Founder |
| L3 | Framer ID page Phone layout fixed | Founder/contractor |
| L4 | Framer `/adopt` page published | Founder |
| L5 | Attorney review Terms/Privacy (minimum viable) | Counsel |
| L6 | Copyright filed (recommended before outreach) | Founder |
| L7 | Test adoption listing E2E works | Founder |
| L8 | `npm run build` + deploy green | Engineering |
| L9 | Activation gate read (`ACTIVATION-GATE.md`) | Founder |

**Then:**
- [ ] `NEXT_PUBLIC_SITE_MODE=public`
- [ ] First manual partner email (one org)
- [ ] Social launch posts

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

# SECTION 6 — What to do THIS WEEK (June 21, 2026)

**If you only do five things:**

1. [ ] **Copyright filing** — unlocks confident outreach copy  
2. [ ] **ViT iPhone prod test** (T1 checklist) — 10 min  
3. [ ] **Framer: ID page layout** OR book contractor — unblocks website  
4. [ ] **Framer: start `/adopt` page** — app directory already live  
5. [ ] **CRM Phase 0** — run two npm scripts, skim drafts (1 hr max)  

**Explicitly defer:**
- n8n workflow activation  
- Paid ads  
- TN relocation  
- Vet association fees  
- Monitor cloud build (unless you choose to drop Monitor from v1 marketing)  

---

# SECTION 7 — Progress tracker

| Department | Phase 0 % est. | Launch blocker? |
|------------|----------------|-----------------|
| Executive Ops | 85% | No |
| Legal / IP | 40% | **Yes** |
| App Engineering | 80% | Monitor optional |
| Framer Website | 70% | **Yes** (layout + /adopt) |
| Adoption Network | 90% | Need live partner listing |
| Marketing Automation | 60% prepare | Phase 1 gated |
| Brand / Social | 50% prep | No |
| Finance / Grants | 30% | No |
| Ops Command Center | 95% | No |
| Freedom Paws ID | 75% | Framer layout |
| Wellness | 70% | Partner URLs |
| ViT Pro | 85% V0 | No (parallel) |

---

# Closing — Realistic inspiration

You are not behind. You shipped **more than most funded startups build in year one**: a multi-surface PWA, partner portal, adoption directory, ops center, ViT Pro V0, ID workflows, token shop, and a full training library — **solo, on zero budget**.

Your constraint is not talent or work ethic. It is **sequencing**: the world sees one brand, but you are running twelve departments. The fix is not more hours — it is **fewer open fronts per day**.

**The next 60 days in one sentence:** Finish the storefront (Framer), lock the legal floor (copyright + Terms), prove the product in your hand (ViT + Photo Booth on iPhone), then send **one** shelter email — not six workflows at once.

When September capital arrives, you will not be “starting.” You will be **activating** a machine you already built: flip public mode, fund TN move, pay counsel, stock product, and scale what is already working.

**Buddy's legacy is not built in a single sprint. It is built in checked boxes — one department, one day, until the doors open.**

---

*Regenerate PDFs for grant packets: `npm run binders:pdf`*  
*Questions for next Cursor session: “Deploy X,” “Fix Framer blocker Y,” “Run symptom merge.”*
