# Freedom Paws Wellness
# Master Business Plan, Pet Monitor Module, Pricing & 12–15 Week Launch Roadmap

**Document purpose:** Strategic plan for the “everything app” vision — US launch first, pet room monitoring module, hybrid protocol pricing, 5-year outlook, and week-by-week tasks to launch in 12–15 weeks.

**Last updated:** May 30, 2026  
**Project folder:** `freedompaws-app`  
**Companion spreadsheet:** `docs/Freedom-Paws-5-Year-Financial-Model.csv` (open in Excel or Google Sheets)  
**Related docs:** `Photo-Booth-Phase-1-Roadmap.md`, `PWA-Setup.md`, `Deploy-and-Brand-Protection.md`

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Vision: world’s first “everything” pet wellness app](#2-vision-worlds-first-everything-pet-wellness-app)
3. [Should pet monitoring come before finishing PWA?](#3-should-pet-monitoring-come-before-finishing-pwa)
4. [Pet room monitor module — concept & MVP](#4-pet-room-monitor-module--concept--mvp)
5. [Hybrid pricing recommendation](#5-hybrid-pricing-recommendation)
6. [Mission: veterans, shelters, grants, affiliates](#6-mission-veterans-shelters-grants-affiliates)
7. [Grassroots & social media growth](#7-grassroots--social-media-growth)
8. [Five-year business potential (analysis)](#8-five-year-business-potential-analysis)
9. [Financial model — how to use the spreadsheet](#9-financial-model--how-to-use-the-spreadsheet)
10. [Recommendations to make this real](#10-recommendations-to-make-this-real)
11. [12–15 week launch roadmap (detailed tasks)](#11-1215-week-launch-roadmap-detailed-tasks)
12. [Brand & IP protection (SuperBud, protocols)](#12-brand--ip-protection-superbud-protocols)
13. [Quick reference checklist](#13-quick-reference-checklist)

---

## 1. Executive summary

Freedom Paws is building toward a **US-first, mobile-first wellness platform** for dogs (and later cats): **ViT-style symptom guidance**, **holistic protocols**, **SuperBud Photo Booth**, **PWA home-screen app**, and next **room monitoring** with **off-the-shelf cameras** while members are away.

**Launch posture:** Private **preview** deploy now (HTTPS, not indexed by Google) while **LLC and SuperBud™ / Freedom Paws™ trademarks** proceed. Public marketing waits until legal counsel clears brand use.

**Revenue model (recommended):** **Hybrid** — low-cost **membership** for core access + **à la carte protocol unlocks** + **bundled “packs”** (better value than buying one-by-one).

**12–15 week goal:** Preview-ready platform with Photo Booth, ViT, protocols, PWA, **Monitor MVP (view-only, one camera)**, pricing pages, and soft launch to first 100–500 founding members via social/grassroots — not mass advertising.

**5-year potential (realistic base case in spreadsheet):** Low six figures revenue by Year 2–3 with disciplined spend; scalable to **$1M+ annual** by Year 5 **if** retention, affiliate revenue, and B2B shelter/veteran partnerships compound. See CSV for numbers.

---

## 2. Vision: world’s first “everything” pet wellness app

| Pillar | What it is | Status in app |
|--------|------------|---------------|
| **Diagnose / guide** | Photo + symptoms → protocol suggestions (ViT-style lexicon) | ✅ Working |
| **Protocols** | Tokenized holistic wellness journeys (10 protocols) | ✅ Content live |
| **Engage** | SuperBud Photo Booth, shareable UGC | ✅ Phase 1 done |
| **Monitor** | Room camera while away (off-shelf hardware) | 🔲 Next module |
| **Member wallet / tokens** | XRPL vision, grants, proceeds | 🔲 Planned |
| **Affiliates** | Whole-food supplements, vetted products | 🔲 Planned |
| **Give-back** | 10% to veterans & no-kill shelters | 🔲 Policy + tracking needed |

**“Everything app” sequencing:** Win **trust + daily habit** (diagnostics, protocols, photo booth) **before** asking for camera setup and paid tiers. Monitoring is a **retention and peace-of-mind** feature, not the first hook.

---

## 3. Should pet monitoring come before finishing PWA?

### Recommendation: **Finish PWA preview deploy first (1 week), then build Monitor MVP in parallel with launch prep**

| Order | Why |
|-------|-----|
| **1. PWA preview deploy (Week 1)** | Already ~95% done on your phone. HTTPS + install icon + preview mode = how members actually use the app away from your Mac. **~3–5 days** with hosting setup. |
| **2. Monitor MVP (Weeks 2–8)** | Larger engineering (video streaming, privacy, device pairing). Can ship **view-only, one camera, one room** without blocking launch. |
| **3. Public launch (Week 12–15)** | LLC/TM clearance, pricing live, social campaign. |

**Do not delay PWA** — it is your **distribution channel**. Monitor is a **module inside** the installed app, not a substitute for deploy.

---

## 4. Pet room monitor module — concept & MVP

### Member promise (simple)

> “Point an inexpensive Wi‑Fi camera at your pet’s room. Open Freedom Paws → **Monitor** → see live video when you’re away.”

### Off-the-shelf camera strategy (US)

Support **one standard path first**, document clearly, expand later.

| Tier | Camera examples | How app connects | MVP? |
|------|-----------------|------------------|------|
| **A — Recommended MVP** | Wyze Cam v3/v4 (RTSP firmware), cheap ONVIF IP cameras | Home **bridge app** or **Freedom Paws relay** converts RTSP → HLS/WebRTC in browser | ✅ Phase 1 |
| **B — Easier UX (later)** | Cameras with **public MJPEG/snapshot URL** (some brands) | Direct `<img>` or short polling | Optional fallback |
| **C — Partner API (later)** | Ring/Nest/Arlo | Closed ecosystems — **avoid for MVP** | ❌ Not v1 |

### Technical MVP (12–15 week scope)

**Phase Monitor-1 (launchable):**

- [ ] Setup wizard: “Choose camera type” → Wyze RTSP / generic ONVIF
- [ ] Member enters **local stream URL** or **Freedom Paws pairing code** (if you host a tiny relay)
- [ ] **Live view only** (no recording in cloud initially — reduces legal/storage cost)
- [ ] **Privacy:** “Cameras are yours; we don’t sell video” + optional end-to-end disclaimer
- [ ] **One pet / one room / one camera**
- [ ] Works in **PWA on iPhone** via HLS (Safari-friendly)

**Phase Monitor-2 (post-launch):**

- Motion alerts, “check-in” snapshot, multi-pet rooms, shelter/veteran donated camera kits

### Architecture note (for your developer)

Browsers **cannot** play raw RTSP. You need one of:

1. **Member-run home relay** (advanced users) — document only for v1  
2. **Freedom Paws lightweight stream gateway** (recommended for mass market) — server component you control  
3. **Partner with a video SaaS** (Mux, LiveKit) — faster, monthly cost

**MVP recommendation:** Start with **documented Wyze RTSP + optional hosted relay** for founding members who opt in.

### Legal / trust (monitoring)

- Terms: member owns camera; no nanny-cam in non-owned spaces
- No cloud recording until privacy policy and storage budget exist
- Children’s rooms / roommates — clear “authorized use only” copy

---

## 5. Hybrid pricing recommendation

### Principles

1. **Low friction to start** — free tier builds grassroots social proof  
2. **Pay for depth** — individual protocols for specific needs  
3. **Reward commitment** — bundles cheaper than à la carte  
4. **Mission-aligned** — 10% give-back visible at checkout  

### Recommended tiers (US launch)

| Tier | Price (suggested) | Includes |
|------|-------------------|----------|
| **Free — Community** | $0 | 1 pet profile, symptom checker (limited), 1 protocol preview, Photo Booth, monitor **setup guide** (no relay) |
| **Member — Core** | **$9.99/mo** or **$79/yr** | All protocol **guides** (read), ViT runs (fair cap/month), Photo Booth, monitor live view (1 camera) |
| **Protocol Pass — Single** | **$14.99** one-time or **$4.99/mo** | One named protocol full unlock: meal plans, affiliate links, progress tracking |
| **Protocol Pack — 3** | **$34.99** (save ~22%) | Any 3 protocols |
| **Complete Wellness** | **$89/yr** or **$129** lifetime (founding 500) | All 10 protocols + Core features |
| **Shelter / Veteran** | **Subsidized or sponsored** | Grant-funded seats; you track separately from consumer revenue |

### Why hybrid beats “subscription only” or “buy only”

| Model | Problem | Hybrid fix |
|-------|---------|------------|
| Subscription only | High churn if they only wanted one issue (e.g. mobility) | Single-protocol purchase |
| Buy only | Low recurring revenue; hard to fund monitoring servers | Core membership |
| Bundles only | Overwhelms new users | Free + single + pack ladder |

### Affiliate revenue (whole-food / supplements)

- Do **not** take affiliate cut on **give-back transactions** without clear disclosure  
- Place affiliate links **inside unlocked protocols** only (trust)  
- Target **15–25% commission** on partner SKUs; model as **Year 2+** revenue line in spreadsheet  

### XRPL / tokens

- Keep **off critical path** for 12–15 week launch  
- Phase 2: loyalty points for referrals, shelter donations on-chain — after legal review  

---

## 6. Mission: veterans, shelters, grants, affiliates

| Initiative | Implementation |
|------------|----------------|
| **10% give-back** | Define: **10% of net profit** (after payment fees & direct costs) OR **10% of membership** — attorney to fix language. Show badge on site. |
| **Veterans** | Partner with local VFW / service dog orgs; sponsored **Complete Wellness** seats |
| **No-kill shelters** | Foster network; Photo Booth for adoption posts; grant applications citing engagement metrics |
| **Grants** | Document outcomes: pets helped, symptom checks run, adoption shares — use for Petco Foundation–style grants (Year 2) |
| **Affiliates** | Curate 5–10 SKUs per protocol; prefer US whole-food brands with lab testing |

---

## 7. Grassroots & social media growth

### Content pillars (SuperBud-led)

1. **Before/after Photo Booth** — shareable, non-medical  
2. **Protocol tip of the week** — 30 sec Reels  
3. **Monitor peace-of-mind** — “Check on rescue pup at lunch” (with permission)  
4. **Mission stories** — veterans & shelters (10% narrative)  

### Channels (US first)

| Channel | Role |
|---------|------|
| **Facebook Groups** | Dog health, senior dogs, rescue — soft help, not spam |
| **Instagram / TikTok** | SuperBud visual brand |
| **YouTube Shorts** | Protocol explainers |
| **Local vets / groomers** | QR card to PWA install |

### Founding member campaign (Week 12–15)

- **500 Founding Members** — lifetime Complete Wellness at discount  
- Referral: give 1 month Core, get 1 month  
- UGC contest: best SuperBud Photo Booth wins year subscription  

---

## 8. Five-year business potential (analysis)

### Market context (US)

- **~65M US households** with dogs  
- Pet wellness & supplements: **multi-billion** and growing post-COVID  
- Apps that combine **guidance + community + monitoring** are fragmented — **no dominant “everything” brand** at grassroots price point  

### Competitive moat (if you execute)

1. **SuperBud™ character** — emotional brand, not generic pet app  
2. **Holistic protocol library** — proprietary content  
3. **ViT-style symptom lexicon** — improves with member feedback loop  
4. **Mission tie-in** — veterans & shelters — authentic story for press  
5. **PWA** — no App Store gate for iteration  

### Risks

| Risk | Mitigation |
|------|------------|
| Regulatory (wellness vs veterinary advice) | Disclaimers; “not a substitute for vet care”; lexicon admin review |
| Trademark conflict | File SuperBud / Freedom Paws; preview mode until cleared |
| Monitor privacy incident | No cloud record v1; strong terms |
| CAC too high | Grassroots first; no paid ads until unit economics work |
| Churn | Hybrid pricing; Photo Booth habit; monitor stickiness |

### 5-year scenarios (summary — detail in CSV)

| Metric | Year 1 | Year 3 | Year 5 |
|--------|--------|--------|--------|
| **Paying members (base case)** | 300–800 | 4,000–8,000 | 15,000–30,000 |
| **Revenue (base case)** | $25K–$60K | $350K–$700K | $1.2M–$2.5M |
| **Net margin (mature)** | Negative/small | 15–25% | 20–30% |

**Upside:** Shelter B2B contracts, affiliate scale, grant funding.  
**Downside:** Slow social growth — extend runway, keep preview costs low.

*Figures are planning estimates, not guarantees. Adjust yellow cells in CSV.*

---

## 9. Financial model — how to use the spreadsheet

**File:** `docs/Freedom-Paws-5-Year-Financial-Model.csv`

1. Open in **Excel** or **Google Sheets** (File → Import).  
2. **Print** or zoom to **125–150%** for easier reading.  
3. Yellow columns = **assumptions you can edit** (conversion %, price, churn).  
4. Sheets/sections in one CSV: quarterly milestones Years 1–5.  

**Columns:**

- Quarter  
- Total members (free + paid)  
- Paying members  
- Membership revenue  
- Protocol à la carte revenue  
- Affiliate revenue  
- Total revenue  
- Expenses (hosting, legal, marketing, COGS, give-back 10%)  
- Net profit  

---

## 10. Recommendations to make this real

### Do now

1. **LLC + trademark** — parallel track with attorney  
2. **Preview deploy** — `NEXT_PUBLIC_SITE_MODE=preview`, Vercel or host  
3. **Founding member waitlist** — simple email form (even before paywall)  
4. **Monitor spec lock** — Wyze RTSP path for MVP  
5. **Terms + privacy** — lawyer-drafted before public launch  

### Do not do yet

1. Mass paid Facebook ads  
2. Cloud video recording at scale  
3. Crypto wallet in production checkout  
4. Public domain until TM counsel clears  

### Team / roles (minimal)

| Role | Who | Weeks 1–15 |
|------|-----|------------|
| Product & vision | You | Ongoing |
| App build | You + Cursor/dev | Ongoing |
| Legal | Attorney | Weeks 1–8 |
| Creative | SuperBud assets | Ongoing |
| Community | You + 1 volunteer | Weeks 10–15 |

---

## 11. 12–15 week launch roadmap (detailed tasks)

### WEEK 1 — PWA preview deploy & legal kickoff

- [ ] Confirm LLC filing timeline with attorney  
- [ ] Trademark search + application plan for SuperBud™, Freedom Paws™  
- [ ] Deploy to Vercel/host: `NEXT_PUBLIC_SITE_MODE=preview`  
- [ ] Password-protect production URL  
- [ ] Test PWA install from HTTPS URL on iPhone  
- [ ] Create founding member waitlist (Google Form or app page)  

### WEEK 2 — Pricing & policy skeleton

- [ ] Finalize hybrid tier names and prices (Section 5)  
- [ ] Draft Terms of Service outline (not vet advice, IP, refunds)  
- [ ] Draft Privacy Policy (photos, uploads, monitor streams)  
- [ ] Footer © + ™ already in app — verify with counsel  
- [ ] Stripe account setup (test mode)  

### WEEK 3 — Monitor module: specification

- [ ] Choose MVP camera path (Wyze RTSP recommended)  
- [ ] Write member-facing setup guide (PDF + in-app)  
- [ ] Decide: self-hosted relay vs third-party video API  
- [ ] Wireframe Monitor UI (live view, connection status, help)  
- [ ] Security review checklist  

### WEEK 4 — Monitor module: development start

- [ ] Replace `/monitor` “Coming Soon” with setup wizard  
- [ ] Implement stream player (HLS for Safari PWA)  
- [ ] Error states: wrong URL, offline camera, Wi‑Fi issues  
- [ ] “Monitor” link already in nav — test flow  

### WEEK 5 — Monitor MVP alpha

- [ ] Internal test with one Wyze camera  
- [ ] Document latency and iPhone PWA behavior  
- [ ] No server-side recording v1  
- [ ] Beta flag: `MONITOR_BETA=true`  

### WEEK 6 — Payments integration (test)

- [ ] Stripe Checkout for Core membership + 1 protocol  
- [ ] Webhook: unlock protocol in session/account  
- [ ] Founding member coupon codes  

### WEEK 7 — Content & affiliate prep

- [ ] Select 3 affiliate partners for 1 protocol pilot  
- [ ] Disclosure text on affiliate links  
- [ ] Protocol pages: “Member unlock” gates  

### WEEK 8 — Monitor beta (5–10 users)

- [ ] Recruit beta from waitlist  
- [ ] Fix stream issues on real home Wi‑Fi  
- [ ] Collect testimonials (video/text)  

### WEEK 9 — Photo Booth & ViT polish for launch

- [ ] Photo Booth Phase 2 background removal (if ready) or defer  
- [ ] ViT copy review for compliance  
- [ ] Admin symptom lexicon review  

### WEEK 10 — Give-back & mission pages

- [ ] “10% promise” page with clear formula  
- [ ] Veterans & shelter partner outreach (3 orgs)  
- [ ] Grant narrative one-pager for foundations  

### WEEK 11 — Soft launch prep

- [ ] Switch Stripe to live mode  
- [ ] Load test hosting  
- [ ] Bump `PWA_VERSION`  
- [ ] Prepare 30 days social content calendar  

### WEEK 12 — SOFT LAUNCH (preview URL, invite-only)

- [ ] Email waitlist: founding member offer  
- [ ] Monitor MVP live for Core members  
- [ ] Support channel (email or simple help desk)  
- [ ] Track: signups, conversion, churn, stream success rate  

### WEEK 13 — Grassroots growth

- [ ] Post 3x/week SuperBud Photo Booth UGC  
- [ ] Join 2 Facebook groups (value-first)  
- [ ] Local vet/groomer QR cards  

### WEEK 14 — Iterate from data

- [ ] Fix top 3 user-reported bugs  
- [ ] Adjust pricing if conversion < 2%  
- [ ] Shelter pilot conversation  

### WEEK 15 — PUBLIC LAUNCH decision

- [ ] Attorney clears `NEXT_PUBLIC_SITE_MODE=public`  
- [ ] Connect domain DNS  
- [ ] Press release / local media  
- [ ] Remove password protection  
- [ ] Announce 10% give-back partners  

---

## 12. Brand & IP protection (SuperBud, protocols)

| Asset | Action |
|-------|--------|
| SuperBud character art | © notice; trademark application |
| Protocol text & names | Trade secret + ©; consider protocol name TMs |
| App code | Private repo; license if contractors help |
| Public web | Preview mode until TM/LLC ready |
| Member uploads | Terms: license to display for service only |

Your instinct to **wait on public marketing** was correct. **Private preview deploy + TM filing** is the right combination.

---

## 13. Quick reference checklist

**Before public launch:**

- [ ] LLC active  
- [ ] Trademark filed or counsel clearance  
- [ ] Terms + Privacy live  
- [ ] Stripe live + refund policy  
- [ ] `NEXT_PUBLIC_SITE_MODE=public`  
- [ ] Domain on HTTPS  
- [ ] 10% give-back formula documented  
- [ ] Monitor privacy terms  
- [ ] Not-veterinary-advice disclaimers on ViT  

**Files in this project:**

| File | Purpose |
|------|---------|
| `docs/Freedom-Paws-Master-Business-Plan-and-Roadmap.md` | This document |
| `docs/Freedom-Paws-5-Year-Financial-Model.csv` | Spreadsheet model |
| `docs/Deploy-and-Brand-Protection.md` | Preview deploy steps |
| `docs/PWA-Setup.md` | PWA testing |

---

*Freedom Paws Wellness — Honor Buddy’s Legacy*  
*Document generated for planning purposes; not legal or financial advice.*
