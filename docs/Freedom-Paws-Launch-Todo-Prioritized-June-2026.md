# Freedom Paws Wellness
# Launch To-Do — Prioritized Master List (Now → Public Launch)

**Document purpose:** Single prioritized checklist from today through **public launch**, including ViT, Photo Booth, My Pets vault, Monitor **production cloud relay**, Framer + Next.js integration, legal, and payments.

**Date:** June 5, 2026  
**Project:** `freedompaws-app` (Next.js PWA on Vercel)  
**GitHub:** `MKC-PUG/FREEDOMPAWSWELLNESS`  
**Current PWA release:** v43  
**Launch target:** 12–15 weeks from preview (per Master Business Plan)  
**User decision (June 5):** Park Monitor beta for daily use; **full cloud relay required at public launch**

**Related docs:** `Freedom-Paws-Completed-Items-June-2026.md`, `Freedom-Paws-Master-Business-Plan-and-Roadmap.md`, `Conversation-Review-ViT-Framer-and-Roadmap-May-2026.md`

---

## Table of contents

1. [How to use this list](#1-how-to-use-this-list)
2. [Priority legend](#2-priority-legend)
3. [P0 — Do first (this week)](#3-p0--do-first-this-week)
4. [P1 — Core product finish (weeks 2–6)](#4-p1--core-product-finish-weeks-2-6)
5. [P2 — My Pets vault & member layer (weeks 4–8)](#5-p2--my-pets-vault--member-layer-weeks-4-8)
6. [P3 — Monitor production cloud relay (weeks 5–10)](#6-p3--monitor-production-cloud-relay-weeks-5-10)
7. [P4 — Website integration: Framer + Next.js (ongoing)](#7-p4--website-integration-framer--nextjs-ongoing)
8. [P5 — Payments, membership & legal (weeks 6–12)](#8-p5--payments-membership--legal-weeks-6-12)
9. [P6 — Launch marketing & go-live (weeks 10–15)](#9-p6--launch-marketing--go-live-weeks-10-15)
10. [Recommended session order (what we build next in Cursor)](#10-recommended-session-order-what-we-build-next-in-cursor)
11. [Definition of “launch complete”](#11-definition-of-launch-complete)

---

## 1. How to use this list

- Work **top to bottom** within each priority band unless blocked.
- **Parked:** Monitor home beta (go2rtc + tunnel) — you use it; members get **cloud relay at launch**.
- Check off items in git commits or update this doc monthly.
- **Next Cursor session:** start with **P0 #1** unless you say otherwise.

---

## 2. Priority legend

| Code | Meaning |
|------|---------|
| **P0** | Blocks production quality or next build session — do immediately |
| **P1** | Core app modules members expect at launch |
| **P2** | My Pets / vault / accounts — retention & protocol tracking |
| **P3** | Monitor **production** (no Mac/tunnel for members) |
| **P4** | Framer ↔ app harmony — one source of truth |
| **P5** | Legal, payments, policies — required before **public** marketing |
| **P6** | Growth, waitlist, founding members, `SITE_MODE=public` |

---

## 3. P0 — Do first (this week)

### ViT production verify

- [x] **Confirm `OPENAI_API_KEY` on Vercel** (Production + Preview)  
- [x] **iPhone test on production ViT** with photo + symptoms → vision + visual observations  
- [ ] **Confirm symptom feedback** writes to `/tmp` on Vercel (no “Analysis failed”)  
- [ ] Run `npm run symptom:test:all` locally before each ViT deploy  

### Deploy hygiene

- [x] After each ship: bump `lib/pwa-version.ts` → `node scripts/sync-pwa-version.mjs` → push `main`  
- [x] iPhone: tap **Refresh now** when update banner appears  

### Framer + app — lock canonical split (decision, 1 meeting with yourself)

- [x] **Decide canonical shop:** **Next.js app** `/token-shop` (XRPL/Xaman primary)  
- [x] **Decide domains:** `freedompawsinc.com` (Framer) + `app.freedompawsinc.com` (PWA)  
- [x] Create **Protocol & Price Source of Truth** — `docs/Protocol-Price-Source-of-Truth.md` + `.csv` + `lib/shop/protocol-catalog.ts`  

### Website integration — quick wins (same week)

- [x] Framer CTA map — `docs/Framer-CTA-Link-Map.md` (paste into Framer)  
- [ ] Framer homepage CTAs applied in Framer editor (your step)  
- [ ] Framer protocol teasers applied in Framer editor (your step)  
- [x] App footer — links to Framer grants, mission, veterans, shelters  
- [x] Strategy doc — `docs/Framer-vs-App-Shop-XRPL-Strategy-and-Session-Thread-June-2026.md`  
- [ ] `NEXT_PUBLIC_APP_URL` on Vercel when `app.freedompawsinc.com` DNS is live  

---

## 4. P1 — Core product finish (weeks 2–6)

### ViT Diagnostics

| Task | Detail |
|------|--------|
| [ ] Vision on prod validated | Photo + video frames; quality gate pass path |
| [ ] Admin symptom queue review | `/admin/symptoms` — merge approved phrases (`npm run symptom:merge`) |
| [ ] Vet urgency copy counsel review | Lawyer pass on “not a diagnosis” + urgent banner |
| [ ] Optional Phase 3 prep | Spec only: accounts + analysis history (post-launch if time tight) |

### SuperBud Photo Booth

| Task | Detail |
|------|--------|
| [ ] iPhone pass: background removal | First model download on Wi‑Fi; cutout on 3 themes |
| [ ] Phase 2 polish | Surprise Me, sparkle reveal, cats+dogs copy (per `Photo-Booth-Phase-2-Roadmap.md`) |
| [ ] Me & My Pup | Final QA on all frame variants + share/save |
| [ ] Help page | `/photobooth/help` — verify matches current unified editor |
| [ ] Performance | Lighthouse / iPhone test after bg-removal model cached |

### Protocols & Token Shop

| Task | Detail |
|------|--------|
| [ ] All 10 protocol **detail pages** complete & iPhone tested | `/protocols/[slug]` |
| [ ] Token Shop prices match source-of-truth sheet | |
| [ ] Buy / wallet URLs consistent (Xaman / freedompawsinc.com) | |
| [ ] ViT results CTAs → correct shop anchors | |

### PWA & platform

| Task | Detail |
|------|--------|
| [ ] `NEXT_PUBLIC_SITE_MODE=preview` until LLC/TM clear | |
| [ ] PWA install flow tested from production HTTPS URL | |
| [ ] `robots.ts` / preview banner — no public indexing until launch | |

---

## 5. P2 — My Pets vault & member layer (weeks 4–8)

**Current state:** `/mypets` is placeholder (“No Pets Added Yet”).

### My Pets MVP (launch scope)

| Task | Detail |
|------|--------|
| [ ] **Data model** | Pet profile: name, breed, age, photo, notes (localStorage MVP → DB later) |
| [ ] **Add / edit / delete pet** | Replace static button with working form |
| [ ] **Link ViT runs to pet** | Optional “Which pet?” on diagnostics; save last result per pet |
| [ ] **Protocol tracking** | Which protocols unlocked / recommended per pet |
| [ ] **Wellness vault** | Upload vet records, photos (client-side or secure storage — privacy review) |
| [ ] **NFT gallery placeholder** | “Dynamic NFT” section with wallet link (XRPL — display only at launch if wallet not live) |
| [ ] **Nav label** | Align “MY PETS” with home card “Manage your dogs…” |

### Toolbox (if separate from My Pets)

- [ ] **Define Toolbox scope** — supplements calendar, symptom log, grant links, or sub-pages under My Pets?  
- [ ] If separate route: `/toolbox` hub linking ViT history, Photo Booth saves, Monitor shortcut  
- [ ] **Recommendation:** fold “vault” into **My Pets** for launch (one member home for their dog)

### Accounts (minimum for launch)

| Task | Detail |
|------|--------|
| [ ] **Decision:** launch with email magic link **or** defer accounts (local-only My Pets) | |
| [ ] If accounts: Supabase / Clerk / NextAuth — pick one | |
| [ ] Sync pets + protocol unlocks across devices | |

---

## 6. P3 — Monitor production cloud relay (weeks 5–10)

**Beta done (you):** Wyze v3, go2rtc, `stream.html`, tunnel — **not member-ready**.

### Architecture (launch requirement)

```
Wyze RTSP → Member home relay OR Wyze cloud path
         → Freedom Paws Cloud Relay (HTTPS, token auth)
         → PWA /monitor (installed app, any network)
```

### Engineering tasks

| # | Task | Detail |
|---|------|--------|
| 1 | [ ] **Pick relay host** | Small VPS (Hetzner/DO) or video SaaS (LiveKit, Mux) — cost model in CSV |
| 2 | [ ] **Relay service** | mediamtx or go2rtc on VPS; TLS (Caddy/nginx) |
| 3 | [ ] **Ingest API** | Per-member RTSP URL or Wyze bridge credentials — **encrypted at rest** |
| 4 | [ ] **Playback API** | HTTPS `stream.html` or HLS with **signed tokens** (expire / revoke) |
| 5 | [ ] **Monitor app changes** | Setup wizard: paste RTSP or OAuth Wyze; store relay token not raw password |
| 6 | [ ] **Remove Mac/tunnel from member docs** | Replace with “Freedom Paws Relay” at launch |
| 7 | [ ] **Membership gate** | Core tier for live view; free = setup guide only |
| 8 | [ ] **Privacy** | Terms: member owns camera; we don’t sell video; no DVR v1 |
| 9 | [ ] **Ops** | Idle disconnect, bandwidth caps, abuse alerts |
| 10 | [ ] **Load test** | 10 concurrent founding-member streams |

### Hardware guide (members)

- [ ] Update shopping guide: **Wyze Cam v3 only** until Wyze ships v4 RTSP  
- [ ] Optional: sell “Freedom Paws Relay Kit” (Pi + guide) as alternative to cloud  

### Your personal beta

- [ ] Keep `start-home.sh` + tunnel cheat sheet for **your** dog until cloud relay is live for your account  

---

## 7. P4 — Website integration: Framer + Next.js (ongoing)

### One source of truth

| Field | Canonical file |
|-------|----------------|
| Protocol slugs | `lib/ai/protocol-registry.ts` |
| Shop items / prices | `app/token-shop` data + spreadsheet |
| Display names | Must match Framer + app |
| Buy URL | Single wallet / Xaman deep link |

### Framer responsibilities

- [ ] Marketing homepage, grants, mission, veteran/shelter story  
- [ ] SEO blog / press (optional)  
- [ ] CTAs → app subdomain only for tools (ViT, Photo Booth, Monitor)  
- [ ] If canonical shop on Framer: remove duplicate checkout from app or link out via `NEXT_PUBLIC_SHOP_URL`  

### Next.js app responsibilities

- [ ] ViT, Photo Booth, Monitor (relay), My Pets, admin  
- [ ] PWA, service worker, version banner  
- [ ] APIs (`/api/analyze`, uploads, webhooks)  

### Monthly sync checklist

- [ ] Compare 10 protocol names Framer ↔ app  
- [ ] Compare prices  
- [ ] Test 3 deep links from Framer on iPhone PWA  
- [ ] Visual: navy `#0A1428` / gold `#F5C242` aligned  

### DNS & domains (before public launch)

- [ ] `app.` subdomain → Vercel  
- [ ] Root → Framer  
- [ ] SSL on both  
- [ ] Update `manifest.json` / `metadata` with production app URL  

---

## 8. P5 — Payments, membership & legal (weeks 6–12)

### Legal & brand

- [ ] LLC filed / active  
- [ ] SuperBud™ / Freedom Paws™ trademark filed or cleared  
- [ ] **Terms of Service** (not vet advice, monitor privacy, IP)  
- [ ] **Privacy Policy** (photos, ViT uploads, video streams, cookies)  
- [ ] Affiliate disclosures on protocol / shop pages  
- [ ] Attorney review before `NEXT_PUBLIC_SITE_MODE=public`  

### Payments (hybrid model)

- [ ] Stripe account (test → live)  
- [ ] **Core membership** tier — unlocks Monitor relay + premium tools  
- [ ] **À la carte protocol** unlock SKUs  
- [ ] Founding member coupon / waitlist codes  
- [ ] Webhook → unlock protocol in app session or account  
- [ ] Refund policy documented  

### Give-back tracking

- [ ] 10% shelter/veteran policy — how it’s calculated and displayed  
- [ ] Grant page on Framer matches app footer claims  

---

## 9. P6 — Launch marketing & go-live (weeks 10–15)

### Pre-launch

- [ ] Founding member **waitlist** (form or `/waitlist` page)  
- [ ] Email provider (ConvertKit / Mailchimp)  
- [ ] 5–10 beta testers per module (ViT, Photo Booth, Monitor relay)  
- [ ] Testimonial capture (screenshots / quotes)  

### Go-live

- [ ] `NEXT_PUBLIC_SITE_MODE=public`  
- [ ] `robots.ts` allow indexing  
- [ ] Framer + app announce coordinated (same day)  
- [ ] Social: 3 grassroots posts/week (not paid ads day 1)  
- [ ] Monitor launch message: **cloud relay** — no Terminal for members  

### Post-launch (30 days)

- [ ] ViT admin queue weekly review  
- [ ] Relay cost monitoring  
- [ ] Support FAQ from Monitor help + ViT explainer  
- [ ] PWA version bump cadence documented  

---

## 10. Recommended session order (what we build next in Cursor)

**Start here — most important first:**

| Order | Session focus | Why |
|-------|---------------|-----|
| **1** | P0: Vercel `OPENAI_API_KEY` + production ViT photo test | Unlocks full ViT value on real iPhone |
| **2** | P0: Framer/app canonical decision + source-of-truth spreadsheet | Stops duplicate shop/prices before more content |
| **3** | P1: Photo Booth Phase 2 polish + iPhone QA | High engagement; mostly client-side |
| **4** | P1: Protocol shop alignment + Framer deep links | Revenue path clarity |
| **5** | P2: My Pets MVP (add pet + link last ViT result) | “Vault” foundation |
| **6** | P3: Monitor cloud relay — architecture spike + VPS POC | Launch blocker per your requirement |
| **7** | P5: Terms/Privacy drafts + Stripe test mode | Gates public launch |
| **8** | P6: Waitlist + founding member page | Pipeline while building relay |

---

## 11. Definition of “launch complete”

Launch is **complete** when all are true:

1. **ViT** — photo + video + lexicon on production with OpenAI vision; quality gate; admin queue process  
2. **Photo Booth** — Phase 2 signed off on iPhone; share/save reliable  
3. **My Pets** — at least one pet profile + protocol / ViT history per pet  
4. **Monitor** — **Freedom Paws cloud relay**; member uses **installed PWA only**; no Mac/tunnel in member docs  
5. **Framer + app** — one canonical shop; domains split; CTAs tested  
6. **Legal** — LLC/TM path clear; Terms + Privacy live  
7. **Payments** — Core membership + protocol purchase in test or live  
8. **Public** — `SITE_MODE=public`, waitlist → founding members invited  

**Not required for launch v1:** custom ViT model, multi-camera Monitor, in-app pan/tilt, XRPL wallet in-app checkout, cloud DVR.

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Prioritized launch list — June 5, 2026*
