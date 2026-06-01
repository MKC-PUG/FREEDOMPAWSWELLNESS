# Freedom Paws — Conversation Review & Handoff

**Document purpose:** Summary of ViT Diagnostics work, deploys, testing, roadmap, and Framer + Next.js harmony strategy from the May–June 2026 build session.

**Last updated:** June 1, 2026  
**Project:** `freedompaws-app` (Next.js PWA on Vercel)  
**GitHub:** `MKC-PUG/FREEDOMPAWSWELLNESS`  
**Current production release (as of this doc):** **PWA v38**

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Deploy history (v33–v38)](#2-deploy-history-v33v38)
3. [ViT Diagnostics — what was built](#3-vit-diagnostics--what-was-built)
4. [Symptom lexicon (all 10 categories)](#4-symptom-lexicon-all-10-categories)
5. [iPhone testing — validated](#5-iphone-testing--validated)
6. [Key files reference](#6-key-files-reference)
7. [What’s next (without camera hardware)](#7-whats-next-without-camera-hardware)
8. [Framer website + Next.js app — working in harmony](#8-framer-website--nextjs-app--working-in-harmony)
9. [Decisions still to make](#9-decisions-still-to-make)
10. [Local commands](#10-local-commands)

---

## 1. Executive summary

ViT Diagnostics went from **“Analysis failed” on iPhone** to a **full member-facing flow**:

- Symptom lexicon across **10 spec categories** with **top-2 supplement** recommendations  
- **Photo + short video** (10–15 sec, 5 frames) with OpenAI vision fusion  
- **Premium results UI** (confidence bars, Token Shop CTAs)  
- **Image quality gate** before analyze  
- **“How ViT works”** explainer on the diagnostics page  

**Phase 0, Phase 1 (Premium UX), and Phase 2b (video)** are complete on production through **v38**.

The user also has a **full Framer marketing site** (token shop, grants, protocols, etc.) that mirrors many Next.js pages. This doc includes a **harmony strategy** so both sites stay aligned without duplicate “sources of truth.”

---

## 2. Deploy history (v33–v38)

| Version | Commit (approx.) | What shipped |
|---------|------------------|--------------|
| **v33** | `899eb4f` | Senior/cognitive overlap fix (Immune #1 + Calm #2); show matched lexicon terms in UI |
| **v34** | `d1b7ec7` | Fix Vercel “Analysis failed” (symptom feedback store → `/tmp` on serverless); show **App release v34** on screen |
| **v35** | `12cbf8a` | Full lexicon expansion for all 10 spec categories; `npm run symptom:test:all` |
| **v36** | `063dd3c` | Premium results panel; short video upload + multi-frame vision |
| **v37** | `2a7213b` | Image quality gate (resolution, lighting); blocks analyze when quality fails |
| **v38** | `c158d7f` | **“How ViT Diagnostics works”** collapsible explainer |

**How to verify version on iPhone:** ViT Diagnostics → yellow line **App release vXX** under the title.

---

## 3. ViT Diagnostics — what was built

### Core flow

1. Upload **photo** or **short video** (10–15 sec)  
2. **Quality gate** scores media (pass / warn / fail)  
3. Enter **symptoms** in plain language  
4. Tap **Get AI Recommendation**  
5. Receive **#1 and #2 protocol** cards with confidence, protocol links, Token Shop links  
6. Optional feedback (helpful / wrong) for lexicon review  

### Architecture layers

| Layer | Role |
|-------|------|
| **Symptom lexicon** | Always runs — maps owner text → protocols |
| **OpenAI vision** | When `OPENAI_API_KEY` set — photo or 3–5 video frames |
| **Fusion + ranking** | `rankTopTwoProtocols()` — overlap pairs (e.g. senior → Immune + Calm) |
| **Quality gate** | Client-side before analyze |

### Overlap example (locked product decision)

**Input:** `senior dog pacing at night, confused`  
**Output:**

- **#1** Patriot Defender – Immunity & Vitality (Immune Vitality)  
- **#2** Freedom Calm – Anxiety Relief (Cognitive & Senior Support)  

### v34 fix (critical)

On Vercel, the symptom feedback store tried to write to the project filesystem (read-only). That crashed `/api/analyze` with generic **“Analysis failed.”** Fix: persist under `/tmp` on serverless; don’t fail the whole request if logging fails.

---

## 4. Symptom lexicon (all 10 categories)

Expanded in **v35** via `lib/ai/symptom-lexicon-spec-expansions.ts` — natural owner phrases per spec category, not just test phrases.

**Overlap pairs added (examples):**

- Senior cognitive → Patriot Defender #1 + Freedom Calm #2  
- Back + hip / weak hind end → Max Movement #1 + Red Light Spine #2  
- Post-surgery rehab → Red Light Spine #1 + Max Movement #2  
- Heart + kidney decline → Heart Strong #1 + Liver/Kidney Detox #2  

**Test locally:**

```bash
npm run symptom:test -- "your symptom text here"
npm run symptom:test:all
```

(15/15 category tests passed at time of v35 deploy.)

---

## 5. iPhone testing — validated

User confirmed on production:

| Test input | Result |
|------------|--------|
| Senior dog pacing at night, confused | Patriot Defender #1 + Freedom Calm #2 ✓ |
| Sneezing, won't jump on bed | Allergy Shield #1 + Max Movement #2 ✓ |
| Diarrhea, won't run anymore | Gut Balance #1 + Max Movement #2 ✓ |
| Rash on belly, limping on walks | Allergy Shield #1 + Max Movement #2 ✓ |
| **Video upload** (gait clip) | Works great ✓ |
| **Quality gate** | Photo + video show “Good for AI analysis” when appropriate ✓ |

---

## 6. Key files reference

| File | Purpose |
|------|---------|
| `app/diagnostics/ViTDiagnosticsClient.tsx` | Main member UI |
| `app/diagnostics/ViTResultsPanel.tsx` | Premium results + confidence bars + Token Shop CTAs |
| `app/diagnostics/ViTMediaUpload.tsx` | Photo / short video toggle |
| `app/diagnostics/ViTQualityGate.tsx` | Quality score UI |
| `app/diagnostics/ViTHowItWorks.tsx` | “How ViT works” explainer |
| `app/api/analyze/route.ts` | Analyze API |
| `lib/ai/diagnostics.ts` | Lexicon + vision fusion |
| `lib/ai/symptom-lexicon.ts` | Core lexicon |
| `lib/ai/symptom-lexicon-spec-expansions.ts` | Category expansions |
| `lib/ai/vision-analyze.ts` | Multi-frame OpenAI vision |
| `lib/vit/extract-video-frames.ts` | Client video → JPEG frames |
| `lib/vit/media-quality-gate.ts` | Quality checks |
| `lib/symptom-feedback-store.ts` | Admin queue (uses `/tmp` on Vercel) |
| `docs/ViT-Diagnostics-Vision-and-Roadmap.md` | Full ViT roadmap |

---

## 7. What’s next (without camera hardware)

### ViT — polish & ops

- [ ] Confirm **`OPENAI_API_KEY`** on Vercel (only unchecked Phase 2a item — enables visual findings in results)  
- [ ] Review **symptom admin queue** (`/admin/symptoms`) — merge approved phrases via `npm run symptom:merge`  
- [ ] **Compliance copy pass** on results + explainer before public marketing launch  

### ViT Phase 3 (larger, later)

- [ ] Persistent storage (replace 1h upload TTL)  
- [ ] Member accounts + analysis history  
- [ ] Admin dashboard (vision vs lexicon disagreement)  
- [ ] VeNom / clinical synonym expansion  

### SuperBud Photo Booth (no camera needed)

- [ ] “Surprise Me” random theme  
- [ ] Sparkle animation on theme apply  
- [ ] Smarter sticker head-zone placement  
- [ ] “Your pet” copy for cats + dogs  

### Launch & business (no camera)

- [ ] Pricing pages + Stripe test mode  
- [ ] Terms + Privacy (photos, uploads, future monitor)  
- [ ] Founding member waitlist  
- [ ] Give-back / grants page alignment with Framer  
- [ ] Affiliate disclosures on shop links  

### Monitor (blocked on camera — prep only)

- [ ] Wyze RTSP setup guide review  
- [ ] `/monitor` UI polish + offline states  
- [ ] Relay approach (self-hosted vs SaaS)  
- [ ] Privacy copy (“your camera, we don’t store video”)  

Live stream testing waits until camera hardware arrives.

---

## 8. Framer website + Next.js app — working in harmony

**Problem:** Two sites (Framer + Next.js PWA) with similar pages — token shop, protocols, grants, etc. Risk of duplicate content, divergent prices, and confused member journeys.

### Recommended split

| Layer | Best home | Why |
|-------|-----------|-----|
| Story, grants, mission, SEO marketing | **Framer** | Easy content edits, brochure pages |
| ViT, Photo Booth, Monitor, PWA install | **Next.js (Vercel)** | APIs, AI, uploads, service worker |
| Token shop / wallet / checkout | **Pick ONE canonical** | Avoid two prices, two buy flows |

### Suggested domain layout

```
freedompawsinc.com          → Framer (marketing, grants, about)
app.freedompawsinc.com      → Next.js PWA (ViT, Photo Booth, Monitor, tools)
```

- Framer CTAs → `https://app.freedompawsinc.com/diagnostics` (etc.)  
- App links for grants/mission → Framer URLs  

### One source of truth

Maintain a **single spreadsheet or doc** both sites copy from:

- Protocol **slugs** (`max-movement`, `patriot-immune`, …)  
- Display names (must match `protocol-registry.ts` / `shop-items.ts`)  
- Token shop **prices**  
- **Buy / wallet URL** (protocol details already mention freedompawsinc.com for Xaman/XRPL)  
- Deep links: `/diagnostics`, `/photobooth`, `/token-shop#patriot-immune`  

### Functional split

**Next.js only (do not duplicate on Framer):**

- ViT analyze API  
- Photo Booth + background removal  
- Monitor (when live)  
- Admin symptom queue  
- PWA + version label  

**Framer only (fine):**

- Grants, long mission pages, press, team  
- Marketing homepage (optional)  

**Choose one canonical home:**

- Full token shop + checkout **OR**  
- Full protocol catalog with buy  

If **Framer = shop:** Next.js Token Shop links become external (`NEXT_PUBLIC_SHOP_URL`).  
If **Next = shop:** Framer shop pages become teasers + CTA to app.

### SEO

- Marketing pages canonical on Framer root domain  
- App on subdomain; preview mode limits indexing  
- Same nav labels and visual language (navy `#0A1428`, gold `#F5C242`)  

### Example member journey

1. **Framer** — learn grants + protocols  
2. **App** — ViT or Photo Booth (install PWA)  
3. **Results** — one Token Shop destination  
4. **Wallet** — always same URL (freedompawsinc.com or Xaman deep link)  

### Monthly sync checklist

- [ ] 10 protocol names + slugs match  
- [ ] Prices match  
- [ ] Grant / 10% give-back numbers match  
- [ ] Buy / wallet steps point to same place  
- [ ] Framer CTAs use current app URL  
- [ ] Footer © / ™ / privacy links consistent  

---

## 9. Decisions still to make

1. **Canonical token shop:** Framer or Next.js? (Wallet copy points to freedompawsinc.com → Framer for shop + app for tools is a natural split.)  
2. **Subdomain:** Point `app.` at Vercel when ready for production domain.  
3. **Wire CTAs:** Framer → app for tools; app → Framer for grants/buy (if shop lives on Framer).  
4. **Optional env var:** `NEXT_PUBLIC_SHOP_URL` for ViT results Token Shop links if shop is external.  

---

## 10. Local commands

```bash
npm run dev              # local dev
npm run start:mobile     # iPhone on LAN (production build)
npm run symptom:test -- "senior dog pacing at night, confused"
npm run symptom:test:all
npm run build
```

**Bump deploy:** edit `lib/pwa-version.ts` → `node scripts/sync-pwa-version.mjs` → commit → push to `main` (Vercel auto-deploy).

---

## Related docs in repo

- `docs/ViT-Diagnostics-Vision-and-Roadmap.md`  
- `docs/Freedom-Paws-Master-Business-Plan-and-Roadmap.md`  
- `docs/Pet-Monitor-MVP-Roadmap.md`  
- `docs/Deploy-and-Brand-Protection.md`  
- `docs/Freedom-Paws-Symptom-Lexicon-Admin-Guide.md`  
- `docs/Photo-Booth-Phase-2-Roadmap.md`  

---

*Freedom Paws Wellness — Honor Buddy’s Legacy*

*This document was generated from the ViT build conversation for owner review. Update as decisions (Framer vs app shop, domain DNS) are finalized.*
