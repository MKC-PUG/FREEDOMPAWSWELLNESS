# Framer ↔ App CTA Link Map — Permanent Routing Guide

**Date:** June 9, 2026 (updated)  
**Purpose:** One place for **every** Framer button URL. Follow this doc tap-by-tap when wiring cards.  
**Canonical checkout:** Always the **app** (`app.freedompawsinc.com`). Framer never processes payment.

**Code authority:** `lib/site-urls.ts`, `lib/shop/protocol-catalog.ts`, `app/token-shop/shop-items.ts`

---

## Table of contents

1. [Permanent routing decision (read first)](#1-permanent-routing-decision-read-first)
2. [URL formats (copy-paste templates)](#2-url-formats-copy-paste-templates)
3. [Consumer journey (why this is easy for members)](#3-consumer-journey-why-this-is-easy-for-members)
4. [Framer page ↔ app slug map (all 10 protocols)](#4-framer-page--app-slug-map-all-10-protocols)
5. [Component setup — do once (Protocol Card + Token card)](#5-component-setup--do-once-protocol-card--token-card)
6. [Step-by-step: Protocol Overview page](#6-step-by-step-protocol-overview-page)
7. [Step-by-step: Token Shop page (Framer)](#7-step-by-step-token-shop-page-framer)
8. [Step-by-step: each Framer detail page (`/protocol-1` …)](#8-step-by-step-each-framer-detail-page-protocol-1-)
9. [Step-by-step: Framer homepage + nav](#9-step-by-step-framer-homepage--nav)
10. [Publish + iPhone test checklist](#10-publish--iphone-test-checklist)
11. [DNS + `{APP}` base URL](#11-dns--app-base-url)
12. [Monthly sync checklist](#12-monthly-sync-checklist)
13. [What Framer must never do](#13-what-framer-must-never-do)
14. [Member Tools page — full build (`/member-tools`)](#14-member-tools-page--see-full-build-guide) · **Full guide:** `Framer-Member-Tools-Page-Click-by-Click-June-2026.md`

---

## 1. Permanent routing decision (read first)

### Two domains, two jobs

| Domain | Role | Detail (learn) | Buy (pay) |
|--------|------|----------------|-----------|
| **freedompawsinc.com** (Framer) | Marketing, SEO, grants, long story | **Framer** `/protocol-1` … `/protocol-10` | **Never** — link out to app |
| **app.freedompawsinc.com** (PWA) | ViT, Photo Booth, shop, Xaman pay | `/protocols/{slug}` | `/token-shop?protocol={slug}&buy=1#{slug}` |

### The three link types (use forever)

| Link type | Button label (suggested) | Where it lives | Permanent format |
|-----------|--------------------------|----------------|------------------|
| **A — View** | `Click Here To View` (bone) | Framer cards & teasers | Framer page: `https://freedompawsinc.com/protocol-{N}` |
| **B — App detail** | `View in app` (optional) | Framer detail footer | `https://app.freedompawsinc.com/protocols/{slug}` |
| **C — Buy** | `Get lifetime access in the app` or `Pay with Xaman` | Framer detail + Token Shop cards | `https://app.freedompawsinc.com/token-shop?protocol={slug}&buy=1#{slug}` |

**Why not link “View” straight to the app?**  
Framer detail pages rank on Google, tell your grants/mission story, and load fast for curious visitors. Buy always happens in the app where Xaman + unlock already work.

**Why slug in app URLs (`max-movement`) not numbers (`protocol-1`)?**  
Slugs match ViT results, Token Shop cards, and code. When you add protocol #11, you add one slug in code — not renumber every Framer page.

### Scalability rule

```
Framer page number (protocol-3)  →  fixed in this doc’s table  →  app slug (liver-kidney-detox)
```

When prices or copy change: update **app code first**, then Framer teaser text (“from 25 XRP”), then this doc.

---

## 2. URL formats (copy-paste templates)

Set **`{APP}`** = `https://app.freedompawsinc.com` (after DNS) or your Vercel URL until then.

Set **`{FRAMER}`** = `https://freedompawsinc.com`

| Purpose | Template | Example (Max Movement) |
|---------|----------|-------------------------|
| App home | `{APP}/` | `https://app.freedompawsinc.com/` |
| ViT | `{APP}/diagnostics` | …/diagnostics |
| Photo Booth | `{APP}/photobooth` | …/photobooth |
| My Pets | `{APP}/mypets` | …/mypets |
| **Freedom Paws ID hub** | `{APP}/id` | …/id |
| **ID enroll** | `{APP}/id/enroll` | …/id/enroll |
| Monitor | `{APP}/monitor` | …/monitor |
| App protocol overview | `{APP}/protocols` | …/protocols |
| **App detail** | `{APP}/protocols/{slug}` | …/protocols/max-movement |
| Shop (browse) | `{APP}/token-shop?protocol={slug}#{slug}` | …/token-shop?protocol=max-movement#max-movement |
| **Shop (buy intent)** | `{APP}/token-shop?protocol={slug}&buy=1#{slug}` | …/token-shop?protocol=max-movement&buy=1#max-movement |
| Framer detail | `{FRAMER}/protocol-{N}` | `https://freedompawsinc.com/protocol-1` |

**`&buy=1`** scrolls to the card and pulses **Pay with Xaman** — use on every purchase CTA.

**Open in new tab:** **OFF** for all app links (same-tab keeps iPhone PWA flow smooth).

---

## 3. Consumer journey (why this is easy for members)

```
Framer homepage
    → tap protocol card “Click Here To View”
    → Framer detail page (learn, grants, ViT story)
    → tap “Get lifetime access in the app”
    → app Token Shop (right protocol highlighted)
    → tap “Pay $18 with Xaman”
    → Xaman app → pay → return → protocol unlocked
```

**Already in the PWA?** ViT results link straight to `{APP}/token-shop?protocol={slug}&buy=1#{slug}` — no Framer hop.

---

## 4. Framer page ↔ app slug map (all 10 protocols)

**Verify once:** Open each Framer page in **Pages** and confirm the hero title matches **Card title** below. If `/protocol-3` is not Liver & Kidney, fix the page content or swap the row — do not guess.

| # | Framer detail page | Card title | App `{slug}` | View link (bone) | Buy link (paste full URL) |
|---|-------------------|------------|--------------|------------------|---------------------------|
| 1 | `/protocol-1` | Max Movement Pro – Joint Support | `max-movement` | `{FRAMER}/protocol-1` | `{APP}/token-shop?protocol=max-movement&buy=1#max-movement` |
| 2 | `/protocol-2` | Freedom Calm – Anxiety Relief | `freedom-calm` | `{FRAMER}/protocol-2` | `{APP}/token-shop?protocol=freedom-calm&buy=1#freedom-calm` |
| 3 | `/protocol-3` | Foundation Liver & Kidney Detox | `liver-kidney-detox` | `{FRAMER}/protocol-3` | `{APP}/token-shop?protocol=liver-kidney-detox&buy=1#liver-kidney-detox` |
| 4 | `/protocol-4` | Buddy's Gut Balance & Cleanse | `gut-balance` | `{FRAMER}/protocol-4` | `{APP}/token-shop?protocol=gut-balance&buy=1#gut-balance` |
| 5 | `/protocol-5` | Fresh Smile Dental & Oral Health | `fresh-smile-dental` | `{FRAMER}/protocol-5` | `{APP}/token-shop?protocol=fresh-smile-dental&buy=1#fresh-smile-dental` |
| 6 | `/protocol-6` | Heart Strong Cardio-Support | `heart-strong` | `{FRAMER}/protocol-6` | `{APP}/token-shop?protocol=heart-strong&buy=1#heart-strong` |
| 7 | `/protocol-7` | Red Light Spine & Joint Support | `infrared-spine` | `{FRAMER}/protocol-7` | `{APP}/token-shop?protocol=infrared-spine&buy=1#infrared-spine` |
| 8 | `/protocol-8` | Allergy Shield – Skin & Coat Glow | `allergy-shield` | `{FRAMER}/protocol-8` | `{APP}/token-shop?protocol=allergy-shield&buy=1#allergy-shield` |
| 9 | `/protocol-9` | Patriot Immune Defender – Immunity & Vitality | `patriot-immune` | `{FRAMER}/protocol-9` | `{APP}/token-shop?protocol=patriot-immune&buy=1#patriot-immune` |
| 10 | `/protocol-10` | Clear Vision Defender – Eye Health Protocol | `clear-vision` | `{FRAMER}/protocol-10` | `{APP}/token-shop?protocol=clear-vision&buy=1#clear-vision` |

**App-only detail (optional second button on Framer detail pages):**  
`{APP}/protocols/{slug}` — same content as in the PWA protocol detail route.

**Price teaser on Framer (text only, not a link):**  
`Lifetime access · $18 USD · pay in XRP via Xaman in the app`

---

## 5. Component setup — do once (Protocol Card + Token card)

Do this **before** wiring 10 instances. Fixes “all cards link to Max Movement.”

### 5A — Protocol Card component

1. Open Framer → site **Freedom Paws**.
2. **Pages** → open **`/protocol-overview`**.
3. Click **any** Protocol Card in the grid.
4. Right panel → **Edit Component**.
5. Breadcrumb must show: `Protocol Overview` → `Protocol Card` (not `Bone Button`).

**Add or confirm two variables (Component properties):**

| Property name | Type | Used for |
|---------------|------|----------|
| `View Link` | Link / Page | Bone → Framer detail |
| `Buy Link` | URL | Optional buy button → app |

(If you already have one property called `Link`, use it as **View Link** and add **Buy Link**.)

**Wire the Bone Button (critical):**

1. Inside Protocol Card, click the **Bone Button** (or “Click Here To View” text).
2. Right panel → **Link** → **Link To**.
3. **Clear** any hardcoded page (e.g. `/protocol-1`).
4. Click the **variable / plug icon** next to Link To.
5. Select **`View Link`** (or your `Link` property).
6. **Do not** set Link inside the Bone Button **component** master (breadcrumb `… > Bone Button`) — that changes every card globally.

**Optional buy button inside card:**

1. Add a text button: `Get lifetime access in the app`.
2. **Link** → **URL** → bind to **`Buy Link`** variable (plug icon).

7. Click breadcrumb **Protocol Overview** to exit component edit mode.

### 5B — Token card component (Token Shop page)

Repeat the same pattern on **`/token-shop`**:

| Property | Purpose |
|----------|---------|
| `View Link` | Bone → Framer `/protocol-{N}` |
| `Buy Link` | Buy CTA → app `token-shop?protocol=…&buy=1` |

Wire Bone Button → **`View Link`** variable only (never hardcoded `/protocol-1`).

---

## 6. Step-by-step: Protocol Overview page

**Goal:** 10 cards, each with correct view + buy.

1. **Pages** (left) → click **`/protocol-overview`**.
2. Click the **first** Protocol Card (Max Movement).
3. Right panel → **Component** section:
   - **View Link** → pick page **`/protocol-1`** (or URL `{FRAMER}/protocol-1`).
   - **Buy Link** → paste:  
     `https://app.freedompawsinc.com/token-shop?protocol=max-movement&buy=1#max-movement`
4. Click the **second** card (Freedom Calm):
   - **View Link** → `/protocol-2`
   - **Buy Link** → `…/token-shop?protocol=freedom-calm&buy=1#freedom-calm`
5. Repeat for cards 3–10 using **Section 4 table** (row by row).
6. **Do not** open **Edit Component** and change Bone’s link to a fixed page.
7. Top right → **Publish** (after full page is done — or at end of all steps).

**Quick check:** Select card #3 → View Link must show `/protocol-3`, not `/protocol-1`.

---

## 7. Step-by-step: Token Shop page (Framer)

**Goal:** Same as Protocol Overview — view = story, buy = app.

1. **Pages** → **`/token-shop`**.
2. For **each** of the 10 Token cards:

| Tap | Action |
|-----|--------|
| 1 | Click the card instance |
| 2 | **View Link** → matching `/protocol-{N}` from Section 4 |
| 3 | **Buy Link** → matching app buy URL from Section 4 |
| 4 | Confirm card **title** text matches that row’s **Card title** |

3. Page body copy (“25 XRP or 18 RLUSD”) = **text only** — not a link.
4. Optional page-level button at bottom: **Open full Token Shop in app** → `{APP}/token-shop`
5. **Publish**.

**Member expectation:** Bone = learn more. Buy button = pay in app.

---

## 8. Step-by-step: each Framer detail page (`/protocol-1` …)

**Goal:** Every detail page can close the sale.

For **each** page `/protocol-1` through `/protocol-10`:

1. **Pages** → open e.g. **`/protocol-3`**.
2. Confirm hero title = **Foundation Liver & Kidney Detox** (match Section 4).
3. Select the main **Buy / Get protocol** button (add one if missing).
4. **Link** → **URL** (not Framer page).
5. Paste buy URL from Section 4 row (e.g. liver-kidney-detox buy link).
6. Button label: **`Get lifetime access in the app`** or **`Pay with Xaman in the app`**.
7. **New tab:** OFF.
8. Optional secondary link: **Browse all protocols in app** → `{APP}/protocols`
9. Repeat for all 10 detail pages.
10. **Publish**.

---

## 9. Step-by-step: Framer homepage + nav

**Your live homepage** (`freedompawsinc.com`) uses nav + hero + protocol grid — not separate ViT/My Pets tool cards. Wire what exists below.

`{APP}` = `https://app.freedompawsinc.com`

### Hero CTAs (recommended — add below welcome subline)

| Priority | Button label | URL | Why |
|----------|--------------|-----|-----|
| **Primary** | **Try ViT AI free** | `{APP}/diagnostics` | Lowest friction; proves AI value instantly |
| **Secondary** | **Enroll Freedom Paws ID** | `{APP}/id/enroll` | Pilot conversion; smaller button or text link |

**Framer:** Duplicate **Connect Wallet** styling — primary = full yellow button; secondary = outline/text link beside or below. **New tab: OFF** for both.

Skip generic **Open the App** unless you want a small footer link to `{APP}/`.

### Nav (your site)

| Nav item | Link |
|----------|------|
| About / Buddy's Story | Framer page (keep) |
| Protocols Overview | Framer `/protocol-overview` |
| Community Impact | Framer page (keep) |
| **Token Shop** | `{APP}/token-shop` |
| **Member Tools** | Framer `/member-tools` (was `/freedom-paws-id-toolbox`) |
| Grants FAQ | Framer page (keep) |
| **Connect Wallet** (top right) | `{APP}/token-shop` |

### Mid-page sections (your homepage)

| Section | Wire to |
|---------|---------|
| 10 protocol cards — **Learn More** | Framer `/protocol-1` … `/protocol-10` (not app) |
| 10 protocol cards — **Buy** (if present) | `{APP}/token-shop?protocol={slug}&buy=1#{slug}` |
| **Token Shop** block CTA | `{APP}/token-shop` |
| **Freedom Paws ID** block (bottom) | `{APP}/id` (+ optional **Enroll** → `{APP}/id/enroll`) |

### Homepage tool cards (PWA-style home only — skip on Framer if absent)

| Button on site | Link → URL |
|----------------|------------|
| ViT Diagnostics / LAUNCH | `{APP}/diagnostics` |
| SuperBud Photo Booth | `{APP}/photobooth` |
| My Pets | `{APP}/mypets` |
| **Freedom Paws ID** | `{APP}/id` |
| Monitor My Dog | `{APP}/monitor` |
| Token Shop / SHOP | `{APP}/token-shop` |
| Install / Open App | `{APP}/` |

**Per button:** Select button → **Link** → **URL** → paste → **New tab: OFF** → repeat.

### Nav (if on Framer)

Same URLs for matching menu items. Protocol marketing can point to **`/protocol-overview`** (Framer) or `{APP}/protocols` (app overview).

---

## 10. Publish + iPhone test checklist

### Publish

1. Framer top right → **Publish** (or **Update**).
2. Wait until publish completes.

### Test on iPhone (Safari)

| # | Test | Pass? |
|---|------|-------|
| 1 | `freedompawsinc.com` → Protocol Overview → card #1 bone → opens **Max Movement** Framer detail | ☐ |
| 2 | Card #3 bone → **Liver & Kidney** detail (not Max Movement) | ☐ |
| 3 | Framer detail page → **Get lifetime access** → opens **app** Token Shop on **correct** card (gold ring) | ☐ |
| 4 | **Pay with Xaman** button pulses / is focused | ☐ |
| 5 | Framer Token Shop card → buy link → same as step 3 | ☐ |
| 6 | Homepage ViT button → `{APP}/diagnostics` | ☐ |

### Test PWA (home screen icon)

1. Open app from home screen.
2. Token Shop → buy flow still works (no Framer involved).

---

## 11. DNS + `{APP}` base URL

| Phase | `{APP}` value |
|-------|----------------|
| **Launch (target)** | `https://app.freedompawsinc.com` |
| **Until DNS live** | `https://YOUR-PROJECT.vercel.app` |

**When DNS goes live:**

1. Vercel → Project → **Domains** → add `app.freedompawsinc.com`
2. DNS → CNAME `app` → Vercel
3. Vercel env: `NEXT_PUBLIC_APP_URL=https://app.freedompawsinc.com`
4. Redeploy `main`
5. Find-replace in Framer: old Vercel URL → `https://app.freedompawsinc.com` on every **Buy Link**
6. iPhone: refresh PWA (**Update ready** banner)

### Defensive domains (post-launch — not in Framer CTAs)

Registered separately; **wire redirects after public launch**, not before.

| Domain | Redirect to | Use |
|--------|-------------|-----|
| `freedompawz.com` | `https://freedompawsinc.com` | Typo defense — redirect only |
| `vitproscan.com` | `https://app.freedompawsinc.com/vit-pro` | DVM VitProScan — vet outreach later |

**Until wired:** optional registrar-level forward is enough — no `NEXT_PUBLIC_*` env vars, no Framer links.

Canonical URLs stay `freedompawsinc.com` + `app.freedompawsinc.com` only.

---

## 12. Monthly sync checklist

- [ ] 10 slugs match `app/token-shop/shop-items.ts`
- [ ] Framer `/protocol-{N}` titles still match Section 4 table
- [ ] All **Buy Link** URLs use current `{APP}` host
- [ ] Price teaser text matches `SHOP_PRICE` ($18 USD / 25 XRP fallback)
- [ ] Test 3 buy deep links on iPhone
- [ ] No Framer page has its own checkout or wallet connect

---

## 13. What Framer must never do

- Process Xaman / XRP / RLUSD payment
- Host the canonical Token Shop checkout
- Use the same hardcoded link on Bone Button master for all protocols
- Link “Click Here To View” directly to `&buy=1` (confusing — view ≠ pay)
- Use `protocol-1` style paths on the **app** domain (app uses **slugs** only)

---

## 14. Member Tools page — see full build guide

**Canonical build doc (copy, wireframe, click-by-click):**  
`docs/Framer-Member-Tools-Page-Click-by-Click-June-2026.md`

**Page:** Framer `/member-tools`  
**Nav:** **Member Tools** → this Framer page (not the app)  
**Legacy URL:** `/freedom-paws-id-toolbox` → redirect or stub to `/member-tools`  
**Launch rule:** Tell the **vision**; link only what is **live** in the app; mark ID vault/IPFS/match/alerts as **planned**.

`{APP}` = `https://app.freedompawsinc.com`

---

### A. Copy changes (compliance — edit text on page)

Do these **before** or **while** wiring links.

| Section | Change from (risk) | Change to (launch-safe) |
|---------|-------------------|-------------------------|
| Hero **Upload** | Implies full ID enroll works | Button label: **Add your pet in the app** |
| Hero subline | — | Add: *ViT Diagnostics & My Pets available now. Full ID matching rolling out soon.* |
| Body — auto-enroll | “Subscribers are **automatically added**…” | “**Planned:** protocol members will enroll in the Freedom Paws ID database.” |
| Body — IPFS | “**IPFS storage** of your dog’s profile” | “**Designed for** private decentralized storage (IPFS) — coming soon.” |
| Body — alerts | “**Real-time alerts**” | “**Owner alerts** on match (coming soon).” |
| Body — QR / shelter portal | States as live | “**QR & shelter portal** (roadmap).” |
| Tool Box intro | “lifelong digital health vault… on IPFS” | “**Your pet’s digital health hub** — ViT & My Pets in the app today; full vault on IPFS (planned).” |
| Live demo headline | “Try Freedom Paws ID Right Now – **Live Demo**” | “**Try ViT AI Now** — same vision tech as future ID matching” |
| Live demo sub | Implies lost-dog ID search works | “Upload a photo in the app to test **ViT Diagnostics** (not lost-dog ID match yet).” |
| Step 1 — Recovery Plus | Named product may not exist | “**Any Freedom Paws protocol**” (remove Recovery Plus unless you add SKU) |
| Stats row | 1K+ / 88% if not verified | Use **Founding community** / **24/7 app access** / **10 protocols** OR remove until real |
| Privacy block | Good — keep | Add one line: *Biometric ID enrollment will require explicit consent (planned).* |
| Bottom disclaimer | — | Add: *Freedom Paws ID is not a government pet license. Not veterinary advice.* |

---

### B. Every clickable — link map

**New tab: OFF** for all `{APP}` URLs.

#### Hero (top of page)

| Element | Link To | Type |
|---------|---------|------|
| Red **Upload** → rename **Add your pet in the app** | `{APP}/mypets` | URL |
| **Enroll Freedom Paws ID** (add if missing) | `{APP}/id/enroll` | URL |
| (Optional) **ID hub / Learn more** | `{APP}/id` | URL |
| (Optional) Secondary **Try ViT AI** | `{APP}/diagnostics` | URL |

#### Freedom Paws Tool Box — four icon buttons

| Button | Launch link | Why |
|--------|-------------|-----|
| **Medical Records** | `{APP}/mypets` | Vault MVP lives in My Pets (records UI planned) |
| **ViT Scans** | `{APP}/diagnostics` | Live today |
| **Vaccinations** | `{APP}/mypets` | Track in pet profile (expand later) |
| **Daily Notes** | `{APP}/mypets` | Same interim home |

Add small caption under grid: *Full encrypted vault & IPFS sync — coming soon.*

#### Live demo block

| Element | Link To | Notes |
|---------|---------|-------|
| Green **Try Live AI Demo** | `{APP}/diagnostics` | ViT is the honest “live demo” |
| **Upload A Dog Photo To Test the AI** (if clickable) | `{APP}/diagnostics` | Same |
| Sample dog thumbnails (if clickable) | `{APP}/diagnostics` | Do **not** imply ID database match |

#### Protect Your Dog Today (bottom CTAs)

| Element | Link To |
|---------|---------|
| **Get Recovery Plus (Click Here)** | `{APP}/token-shop` **OR** rename to **Get lifetime access (Click Here)** → `{APP}/token-shop` |
| **Explore All Protocols (Click Here)** | `/protocol-overview` (Framer page) |

Use **Recovery Plus** label only if that product exists in shop; otherwise rename to avoid confusion.

#### Footer (same as site-wide — Section 9 + footer table)

| Link | Destination |
|------|-------------|
| Our Story | `/about-buddys-story` |
| Patriotic Mission / Veterans | `/community-impact` |
| Plans / Supplements | `/protocol-overview` |
| Resources | `/how-recovery-works` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Success Stories | `/community-impact` |
| freedompawsinc.com | `/home` |
| Instagram / Facebook | Your real profile URLs |

---

### C. Tap-by-tap (Framer editor)

1. **Pages** → `/freedom-paws-id-toolbox`.
2. Work **top → bottom** (table B). For each button: select → **Link** → **URL** or **Page** → paste → **New tab: No**.
3. Apply **copy changes** (table A) in same pass.
4. **Publish**.
5. iPhone test (table D).

---

### D. iPhone test — ID & Tool Box page

| # | Tap | Must open |
|---|-----|-----------|
| 1 | **Add your pet in the app** | `{APP}/mypets` |
| 2 | **ViT Scans** / **Try Live AI Demo** | `{APP}/diagnostics` |
| 3 | **Medical Records** | `{APP}/mypets` |
| 4 | **Explore All Protocols** | Framer `/protocol-overview` |
| 5 | **Get lifetime access** / shop CTA | `{APP}/token-shop` |
| 6 | Nav **ID & Tool Box** | Stays on this Framer page |

---

### E. When ID product ships (future — replace launch placeholders)

**Build order (v2.0 roadmap):** **Track 1 biometric first** (ViT eyes/face/body/posture/gait → `/id/enroll` → found-dog match, **~Oct 2026**). **Track 2 chipped second** (scanner + AAHA, **~Feb 2027**). See `Freedom-Paws-ID-Lost-Dog-Infrastructure-Roadmap.md`.

| Launch placeholder | Future replacement | Track |
|--------------------|-------------------|-------|
| `{APP}/mypets` enroll CTA | `{APP}/id/enroll` or My Pets **enroll** link | 1 |
| “coming soon” biometric copy | Live enroll at `{APP}/id/enroll` + found-dog match | 1 |
| Live demo → diagnostics | `{APP}/diagnostics?mode=identity` or `{APP}/id` | 1 |
| Tool Box buttons | Deep-link to vault sections in app | 1–2 |
| Chip / scanner claims | `{APP}/id/scan` + kit SKU — **only after Track 2** | 2 |
| Recovery Plus | Real SKU URL with `?protocol=…&buy=1` | — |

---

## App → Framer (footer — already in PWA)

| App footer label | Default URL |
|------------------|-------------|
| Grants & Give-Back | `https://freedompawsinc.com/grants` |
| Our Mission | `https://freedompawsinc.com/mission` |
| Veterans | `https://freedompawsinc.com/veterans` |
| Shelters | `https://freedompawsinc.com/shelters` |

Override via `NEXT_PUBLIC_FRAMER_*_URL` env vars if paths differ.

---

## 15. Adoption Network — Framer ↔ app (PWA v76+)

### Routing decision (permanent)

| Job | Domain | URL |
|-----|--------|-----|
| **Live adoptable dogs** | **App** | `https://app.freedompawsinc.com/adopt/tn` |
| Marketing story + CTA | Framer | `https://freedompawsinc.com/adopt` |
| Partner listings intake | App (partner host) | `https://shelter.freedompawsinc.com/partner/listings` |

**Never** build per-dog pages in Framer — listings change hourly (status, photos, pending badge). Same rule as Token Shop: Framer teases, app is source of truth.

### Framer `/adopt` page (create once)

1. Hero: “Freedom Paws Adoption Network — Tennessee pilot”
2. Short copy: municipal + private partners, ID reunion optional at adoption
3. Primary button **Browse adoptable dogs** → `https://app.freedompawsinc.com/adopt/tn`
4. Secondary **Shelter partners** → `https://freedompawsinc.com/shelters` or `https://shelter.freedompawsinc.com/partner`
5. **New tab: OFF** on app directory button (member convention)

### Also wire

| Location | Label | URL |
|----------|-------|-----|
| Framer `/shelters` | Browse TN adoptable dogs | `https://app.freedompawsinc.com/adopt/tn` |
| App partner footer | Public adoption directory | `/adopt/tn` (same-origin on app) |

**Code:** `adoptTnCanonicalUrl()` in `lib/site-urls.ts`  
**Full click-by-click guide:** `docs/Framer-Adopt-Page-Wiring-Guide-June-2026.md`

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Permanent Framer ↔ app routing — June 9, 2026*
