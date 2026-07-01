# Freedom Paws Wellness
# Launch Master Checklist — Updated Priorities (June 2026)

**Document purpose:** Single **current** checklist from today through public launch. Supersedes priority ordering in `Freedom-Paws-Launch-Todo-Prioritized-June-2026.md` (June 5 draft).

**Last updated:** June 14, 2026  
**Project:** `freedompaws-app` (Next.js PWA on Vercel)  
**Production:** `https://app.freedompawsinc.com` (preview mode)  
**GitHub:** `MKC-PUG/FREEDOMPAWSWELLNESS`  
**Current PWA release:** **v65**  
**Founder decision (June 14):** **Today’s focus** = ViT prod + admin queue, Photo Booth sign-off + Phase 4 assets, Framer CTAs. **Accelerate ID Track 2** (chip scanner) ahead of original Feb 2027 plan.

**Related docs:**
- `Freedom-Paws-Adoption-Network-TN-Pilot-Spec-May-2026.md` — **TN pilot partners (approved)**
- `Freedom-Paws-Website-Post-Launch-Completion-Report-May-2026.md` — **website (Framer) completion punch list**
- `Freedom-Paws-Completed-Items-June-2026.md` (historical — pre v53–v65)
- `Photo-Booth-Phase-4-Real-Assets-June-2026.md`
- `Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md`
- `Framer-CTA-Link-Map.md` (Section 14 = ID page)

---

## Table of contents

1. [Launch gates — status at a glance](#1-launch-gates--status-at-a-glance)
2. [TODAY — priority order (June 14 session)](#2-today--priority-order-june-14-session)
3. [What is already done (v65)](#3-what-is-already-done-v65)
4. [Priority legend](#4-priority-legend)
5. [Track A — ViT Diagnostics](#5-track-a--vit-diagnostics)
6. [Track B — SuperBud Photo Booth](#6-track-b--superbud-photo-booth)
7. [Track C — My Pets & vault](#7-track-c--my-pets--vault)
8. [Track D — Monitor cloud relay](#8-track-d--monitor-cloud-relay)
9. [Track E — Framer + app integration](#9-track-e--framer--app-integration)
10. [Track F — Freedom Paws ID Track 2 (accelerated)](#10-track-f--freedom-paws-id-track-2-accelerated)
11. [Track G — Payments, membership & legal](#11-track-g--payments-membership--legal)
12. [Track H — Launch marketing & go-live](#12-track-h--launch-marketing--go-live)
13. [Cursor session order (engineering)](#13-cursor-session-order-engineering)
14. [Definition of launch complete](#14-definition-of-launch-complete)

---

## 1. Launch gates — status at a glance

| # | Launch gate | Status | Today / next action |
|---|-------------|--------|---------------------|
| 1 | **ViT** — prod verified + admin queue process | 🟡 In progress | Run prod iPhone test; weekly `/admin/symptoms` merge |
| 2 | **Photo Booth** — iPhone sign-off + Phase 4 assets | 🟡 In progress | Canva backgrounds; deploy Phase 4 code; QA checklist |
| 3 | **My Pets** — profiles, ViT history, vault | 🟢 Largely met | Optional: protocol tracking per pet (server unlocks) |
| 4 | **Monitor** — production cloud relay | 🔴 Not started | Architecture spike after Tracks A–B founder tasks |
| 5 | **Framer + app** — canonical shop + CTAs | 🟡 Partial | Founder Framer pass (Section 14 + homepage CTAs) |
| 6 | **Freedom Paws ID Track 2** — chip scanner | 🟡 Accelerated | Start after Framer pass; HID scanner MVP target Q3 2026 |
| 7 | **Legal + payments + public mode** | 🔴 Pre-launch | Counsel on Terms; Stripe webhook; then `SITE_MODE=public` |

**Legend:** 🟢 Met · 🟡 Active · 🔴 Not started / blocker

---

## 2. TODAY — priority order (June 14 session)

Work in this order unless blocked.

### Founder (you — no Terminal required for most)

| Order | Task | Doc / where |
|-------|------|-------------|
| **T1** | **ViT prod test** on iPhone | **`Today-Session-Founder-Checklists-June-2026.md` → T1** |
| **T2** | **Admin symptom queue** | **Same doc → T2** · `Freedom-Paws-Symptom-Lexicon-Admin-Guide.md` §12 |
| **T3** | **Photo Booth iPhone QA** | **Same doc → T3** |
| **T4** | **Phase 4 assets** — Canva Pro backgrounds | **Same doc → T4** · `Photo-Booth-Phase-4-Real-Assets-June-2026.md` |
| **T5** | **Framer CTAs** — homepage + ID page | **Same doc → T5** · `Framer-CTA-Link-Map.md` §14 |
| **T6** | **Order ID Track 2 hardware** | **`Freedom-Paws-ID-Track-2-Supplies-Shopping-Guide-June-2026.md`** |

### Engineering (v66 — ready to deploy)

| Order | Task | Status |
|-------|------|--------|
| **E1** | Phase 4 theme wiring + accessory drawer + help page update | ✅ In repo (v66) |
| **E2** | Admin queue weekly SOP | ✅ `Symptom-Lexicon-Admin-Guide.md` §12 |
| **E3** | Founder checklists T1–T5 | ✅ `Today-Session-Founder-Checklists-June-2026.md` |
| **E4** | ID Track 2 supplies list | ✅ `Freedom-Paws-ID-Track-2-Supplies-Shopping-Guide-June-2026.md` |
| **E5** | Drop founder JPGs when ready → redeploy | ⏳ Waiting on T4 |
| **E6** | Push `main` → Vercel deploy v66 | ⏳ Founder request deploy |

**Defer until after today:** Monitor cloud relay build, Stripe webhooks, ID Track 2 hardware integration.

---

## 3. What is already done (v65)

Do **not** rebuild these.

| Module | Shipped |
|--------|---------|
| **PWA** | Manifest, service worker, install/update banners, Navbar, preview mode |
| **ViT** | Photo + video, lexicon, quality gate, premium results, vet urgency banner, `/admin/symptoms` route |
| **Photo Booth** | Unified editor, cutout, 11 AI costumes, AI credits (migration 008), holidays, Me & My Pup, Surprise Me, print headline |
| **My Pets** | Add/edit/delete, server sync (Supabase), ViT run history per pet |
| **Pet vault** | Migration 007, `/mypets/[id]/vault` (vet records, vax, daily notes) |
| **Freedom Paws ID Track 1** | `/id/enroll`, `/id/found`, `/id/match`, `/id/shelter`, `/id/settings`, audit log |
| **Token Shop** | Canonical `/token-shop`, Xaman XRP Mainnet checkout, device unlock |
| **Auth + waitlist** | Magic link login, `/waitlist` + API |
| **Legal drafts** | `/terms`, `/privacy` (need attorney review before public) |
| **Monitor (founder beta only)** | go2rtc + Wyze v3 + home/away tunnel — **not member-ready** |

**Uncommitted / not deployed:** Phase 4 theme slots (landmarks + holiday JPG paths), accessory drawer “Photo props” section, Phase 4 doc.

---

## 4. Priority legend

| Code | Meaning |
|------|---------|
| **TODAY** | June 14 founder + eng focus |
| **P0** | Blocks launch quality or next ship |
| **P1** | Core member experience before public marketing |
| **P2** | Revenue, retention, ID Track 2 (accelerated) |
| **P3** | Monitor cloud relay (launch blocker — after TODAY tracks) |
| **P4** | Legal, membership, public `SITE_MODE` |
| **P5** | Post-launch ops & growth |

---

## 5. Track A — ViT Diagnostics

**Gate:** Prod verified + admin queue process  
**Status:** 🟡 TODAY priority #1

### Engineering

- [x] `/diagnostics` member UI — photo, video, symptoms, results
- [x] OpenAI vision integration (`OPENAI_API_KEY` on Vercel — confirm still set)
- [x] Symptom lexicon — all 10 categories; `npm run symptom:test:all`
- [x] Admin route `/admin/symptoms`
- [ ] **TODAY:** Production iPhone test — photo + multi-symptom → top-2 protocols + visual observations
- [ ] **TODAY:** Confirm symptom **feedback** POST succeeds on Vercel (no “Analysis failed”)
- [ ] Run `npm run symptom:test:all` before each ViT deploy
- [ ] **Admin queue SOP** — weekly: review pending → approve → `npm run symptom:merge` → deploy if lexicon changed
- [ ] Attorney review of vet urgency / “not a diagnosis” copy (before public launch)

### Post-TODAY (P1)

- [ ] ViT Phase 3: persistent upload storage (replace short TTL)
- [ ] ViT analyze metering / credits (optional — separate from Photo Booth)
- [ ] Admin dashboard: vision vs lexicon disagreement
- [ ] VeNom / clinical synonym expansion

---

## 6. Track B — SuperBud Photo Booth

**Gate:** iPhone sign-off + Phase 4 real assets  
**Status:** 🟡 TODAY priority #2

### Phase 4 assets (founder — Canva Pro)

Use `Photo-Booth-Phase-4-Real-Assets-June-2026.md` + **Image sourcing checklist** section.

**Minimum first batch (TODAY goal: 3–5 files):**

- [ ] `bg-holiday-christmas.jpg` — house with lights
- [ ] `bg-holiday-halloween.jpg` — spooky yard
- [ ] `bg-ocean-boat.jpg` — boat on ocean
- [ ] `bg-landmark-liberty.jpg` — Statue of Liberty harbor (or generic harbor if trademark concern)
- [ ] Optional: `bg-holiday-thanksgiving.jpg`, `bg-landmark-golden-gate.jpg`

**Props (optional this week):** `prop-santa-hat.png`, `prop-bandana-usa.png` (transparent PNG)

### Engineering

- [ ] Deploy uncommitted Phase 4 code (`themes.ts`, `AccessoryDrawer.tsx`) — PWA **v66**
- [ ] Add founder JPGs to `public/images/photobooth/backgrounds/` → redeploy
- [ ] **iPhone sign-off checklist:**
  - [ ] Upload pet photo
  - [ ] Magic cutout (first run on Wi‑Fi)
  - [ ] Pick Christmas / Halloween / landmark theme — real photo shows (after assets added)
  - [ ] AI Magic Look — 1 costume; credits decrement (5 → 4)
  - [ ] Add accessory; drag/resize; remove
  - [ ] Share + Save to Photos
  - [ ] Me & My Pup — duo frame + share
  - [ ] Restore original / change background flow
- [ ] Verify `/photobooth/help` matches unified editor copy
- [ ] Upgrade remaining scenic PNGs to real JPGs (snow, beach, patriot — optional)

### Post-TODAY (P1)

- [ ] Auto-suggest magic cutout after upload
- [ ] Phase 4B: hide cartoon stickers when all `prop-*` PNGs exist
- [ ] Phase 3.5: live camera → AI pipeline
- [ ] Share card + QR

---

## 7. Track C — My Pets & vault

**Gate:** Largely met  
**Status:** 🟢 Maintain; minor gaps only

### Done

- [x] Pet profiles — add / edit / delete
- [x] Server sync when signed in (`/api/pets`)
- [x] ViT run history per pet (signed-in)
- [x] Wellness vault — vet records, vaccinations, daily notes (`007_pet_vault.sql`)

### Remaining (P2 — not TODAY)

- [ ] Protocol unlock tracking **per pet** (today: device `localStorage` only)
- [ ] Server-side protocol unlocks after Stripe/Xaman (cross-device)
- [ ] NFT gallery / dynamic NFT display (XRPL — display-only at launch OK)
- [ ] Cloud vault (IPFS) — future release; copy already set expectations
- [ ] Optional “Which pet?” on diagnostics for guests (signed-in path works)

---

## 8. Track D — Monitor cloud relay

**Gate:** Production relay for all members  
**Status:** 🔴 Not started — **after TODAY priorities**

Founder beta (go2rtc + Mac + tunnel) stays for **your** dog until cloud relay ships.

### Engineering checklist (P3)

| # | Task | Detail |
|---|------|--------|
| 1 | [ ] Pick relay host | VPS (Hetzner/DO) or video SaaS (LiveKit, Mux) |
| 2 | [ ] Relay service | mediamtx or go2rtc on VPS; TLS (Caddy/nginx) |
| 3 | [ ] Ingest API | Per-member RTSP URL — encrypted at rest |
| 4 | [ ] Playback API | HTTPS WebRTC/HLS with signed tokens |
| 5 | [ ] Monitor app wizard | Member setup — no Mac, no Terminal |
| 6 | [ ] Member docs | Replace tunnel steps with “Freedom Paws Relay” |
| 7 | [ ] Membership gate | Core tier for live view |
| 8 | [ ] Privacy + Terms | Stream storage policy (no DVR v1) |
| 9 | [ ] Load test | ~10 concurrent founding-member streams |

**Not required for launch v1:** in-app pan/tilt, multi-camera, cloud DVR.

---

## 9. Track E — Framer + app integration

**Gate:** Canonical shop done; CTAs need Framer pass  
**Status:** 🟡 TODAY priority #5

### Done

- [x] Canonical shop = Next.js `/token-shop` (Xaman XRP)
- [x] Domains: `freedompawsinc.com` (Framer) + `app.freedompawsinc.com` (PWA)
- [x] Protocol & price source of truth — `Protocol-Price-Source-of-Truth.md`
- [x] App footer → Framer grants, mission, veterans, shelters
- [x] `Framer-CTA-Link-Map.md` + Section 14 (ID page)

### Founder — Framer editor (TODAY)

**Homepage & global**

- [ ] All tool CTAs → `https://app.freedompawsinc.com/...` (ViT, Photo Booth, My Pets, Token Shop, Monitor)
- [ ] Shop CTA → `{APP}/token-shop`

**ID & Tool Box page (`/freedom-paws-id-toolbox`) — Section 14**

- [ ] Nav **ID & Tool Box** → Framer page
- [ ] Hero: **Add your pet in the app** → `{APP}/mypets`
- [ ] Soften copy: auto-enroll, IPFS, alerts, QR portal (compliance table A)
- [ ] Tool Box grid: Records / Vax / Notes → `{APP}/mypets`; ViT → `{APP}/diagnostics`
- [ ] Live demo → `{APP}/diagnostics` (not ID match)
- [ ] Bottom CTAs: Protocols → `/protocol-overview`; Shop → `{APP}/token-shop`
- [ ] Privacy block: biometric consent + not a government license
- [ ] **Publish** + iPhone test (6 taps from Section 14)

### Engineering (P1)

- [ ] Monthly sync: 10 protocol names + prices Framer ↔ app
- [ ] Test 3 deep links from Framer on installed PWA
- [ ] `manifest.json` / metadata — confirm production app URL everywhere

---

## 10. Track F — Freedom Paws ID Track 2 (accelerated)

**Previous plan:** Track 2 full launch Jan 2027  
**New plan (June 14 founder decision):** Start **after Framer pass**; ship **HID keyboard scanner MVP** in **Q3 2026**; full Bluetooth + AAHA routing **Q4 2026**

> Phones cannot read implanted chips natively. Fastest MVP = **USB/HID scanner** that types chip ID into the PWA (see ID Master Roadmap §6).

### Phase F1 — Scanner MVP (target: Aug–Sep 2026)

| Task | Owner | Detail |
|------|-------|--------|
| [ ] Buy 1× HID keyboard-mode LF scanner | Founder | Test with laptop + PWA first |
| [ ] `/id/scan` — capture chip ID input | Eng | Replace placeholder; validate format |
| [ ] Store chip ID on member pet profile | Eng | Link to existing biometric enroll |
| [ ] Copy + consent | Founder | “Registry lookup requires separate step” |
| [ ] `/id/kit` — waitlist → email capture | Eng | Already placeholder; wire to Supabase |

### Phase F2 — Registry routing (target: Oct–Nov 2026)

| Task | Owner | Detail |
|------|-------|--------|
| [ ] AAHA lookup flow | Eng | Manual/API path per AAHA response |
| [ ] AVID branch UX | Eng | Display registry phone + deep link |
| [ ] `/id/lookup` — show registry result | Eng | Human-readable; no false “found owner” |
| [ ] Bluetooth universal scanner | Eng | BLE LF reader (post-HID validation) |
| [ ] Shelter pilot: 2 scanners @ 50% subsidy | Founder | GTM |

### Track 1 (unchanged — mostly done)

- [x] Biometric enroll, found, match, shelter portal
- [ ] Attorney sign-off on biometric consent template
- [ ] Shelter E2E pilot — Oct 1, 2026 target

---

## 11. Track G — Payments, membership & legal

**Status:** 🔴 Before public marketing — not TODAY

| Task | Status |
|------|--------|
| LLC / trademark path | Founder + counsel |
| Terms + Privacy attorney review | Draft live; need sign-off |
| Stripe webhook → server protocol unlock | Not built |
| AI credit Stripe packs → `ai_credits_grant()` | DB ready (008); UI TBD |
| Guest → user AI credit merge on login | Not built |
| RLUSD button (`XRPL_RLUSD_ISSUER`) | Env optional |
| Core membership tier (Monitor relay + premium) | Not built |
| Founding member / waitlist coupon codes | Not built |
| 10% give-back at checkout | Not built |
| `NEXT_PUBLIC_SITE_MODE=public` | After legal clear |

---

## 12. Track H — Launch marketing & go-live

**Status:** P5 — after gates 1–7

- [x] `/waitlist` page + API
- [ ] Email provider drip (ConvertKit / Mailchimp)
- [ ] 5–10 beta testers per module (ViT, Photo Booth, relay)
- [ ] Coordinated Framer + app launch day
- [ ] Post-launch: weekly ViT admin queue, relay cost monitoring, FAQ
- [ ] **Post-launch (P5 — not launch blocker):** Wire defensive domain redirects — see `Freedom-Paws-Founder-Master-Schedule-Checklist-June-2026.md` → Department 4 → Defensive domains
  - [ ] `freedompawz.com` → `https://freedompawsinc.com`
  - [ ] `vitproscan.com` → `https://app.freedompawsinc.com/vit-pro` (VitProScan / DVM line)
  - [ ] Optional: `scan.freedompawsinc.com` → `/diagnostics` (free CNAME on `freedompawsinc.com`)

---

## 13. Cursor session order (engineering)

**After TODAY founder tasks (T1–T5):**

| Order | Session | Why |
|-------|---------|-----|
| 1 | Deploy Phase 4 + founder JPGs (v66) | Visible win; gate #2 |
| 2 | ViT prod feedback fix + admin SOP doc | Gate #1 |
| 3 | Framer deep-link smoke test doc | Gate #5 |
| 4 | ID Track 2 — `/id/scan` HID MVP spike | Accelerated Track F1 |
| 5 | Stripe webhook + server unlocks | Cross-device shop |
| 6 | AI credit packs + guest merge | Photo Booth revenue |
| 7 | Monitor relay — VPS architecture POC | Gate #4 launch blocker |

---

## 14. Definition of launch complete

Public launch when **all** are true:

| # | Criterion | Status |
|---|-----------|--------|
| 1 | **ViT** — prod verified; admin queue weekly process documented | 🟡 |
| 2 | **Photo Booth** — iPhone signed off; Phase 4 holiday + landmark photos live | 🟡 |
| 3 | **My Pets** — profiles + ViT history + vault working signed-in | 🟢 |
| 4 | **Monitor** — Freedom Paws cloud relay; no Mac/tunnel in member docs | 🔴 |
| 5 | **Framer + app** — CTAs tested; one canonical shop | 🟡 |
| 6 | **ID Track 2** — chip scan MVP + chip on profile (HID minimum) | 🟡 Accelerated |
| 7 | **Legal** — counsel on Terms/Privacy/biometric consent | 🔴 |
| 8 | **Payments** — durable unlocks + membership path (test or live) | 🔴 |
| 9 | **Public** — `SITE_MODE=public`, indexing allowed | 🔴 |

**Explicitly not required for launch v1:** custom ViT model, native AR, multi-camera Monitor, in-app pan/tilt, cloud DVR, full AAHA API (manual lookup OK for pilot), IPFS cloud vault.

---

## Quick reference — key routes

| Route | Purpose |
|-------|---------|
| `/diagnostics` | ViT — TODAY test |
| `/admin/symptoms` | Symptom queue — TODAY review |
| `/photobooth` | Photo Booth — TODAY QA |
| `/mypets` | My Pets — ✅ largely done |
| `/monitor` | Monitor — relay not ready for members |
| `/token-shop` | Canonical shop — ✅ |
| `/id/scan` | Track 2 — accelerated |
| `/waitlist` | Founding community — ✅ |

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Launch master checklist — updated June 14, 2026 (PWA v65)*
