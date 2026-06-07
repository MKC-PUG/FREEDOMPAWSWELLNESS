# Framer ↔ App CTA Link Map — Permanent Routing Guide

**Date:** June 7, 2026 (updated)  
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

### Homepage tool cards

| Button on site | Link → URL |
|----------------|------------|
| ViT Diagnostics / LAUNCH | `{APP}/diagnostics` |
| SuperBud Photo Booth | `{APP}/photobooth` |
| My Pets | `{APP}/mypets` |
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

## App → Framer (footer — already in PWA)

| App footer label | Default URL |
|------------------|-------------|
| Grants & Give-Back | `https://freedompawsinc.com/grants` |
| Our Mission | `https://freedompawsinc.com/mission` |
| Veterans | `https://freedompawsinc.com/veterans` |
| Shelters | `https://freedompawsinc.com/shelters` |

Override via `NEXT_PUBLIC_FRAMER_*_URL` env vars if paths differ.

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Permanent Framer ↔ app routing — June 7, 2026*
