# Freedom Paws Wellness
# Website (Framer) — Post-Launch Completion Report

**Date:** May 29, 2026  
**Last updated:** June 20, 2026  
**Document purpose:** Single detailed report of everything needed to **complete the marketing website** (`freedompawsinc.com`) for Freedom Paws Wellness after launch — plus a **full inventory of app surfaces and modules** shipped since this report was first written. Includes status from all session work, hired-contractor handoff, post-launch maintenance, and Framer wiring for new product areas.  
**App (separate surface):** `https://app.freedompawsinc.com` — PWA **v78** — engineering completion tracked in `Freedom-Paws-Launch-Master-Checklist-June-2026.md`.

**Related docs (read in this order):**
- `Framer-CTA-Link-Map.md` — every button URL (Section 14 = ID page)
- `Framer-Adopt-Page-Wiring-Guide-June-2026.md` — **NEW** `/adopt` marketing page
- `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md` — layout fix + **§6 Agent lexicon**
- `ops/INFRASTRUCTURE-BUILDOUT-FRAMER-DNS-WELLNESS.md` — Phases 1–3 build order
- `Today-Session-Founder-Checklists-June-2026.md` — T5 Framer pass
- `Framer-and-DNS-Manual-Setup-Guide.md` — DNS + click-by-click
- `Protocol-Price-Source-of-Truth.md` — prices must match app
- `Freedom-Paws-Launch-Master-Checklist-June-2026.md` — full launch gates (app + website)

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Two surfaces — website vs app (expanded)](#2-two-surfaces--website-vs-app-expanded)
3. [Website completion gates](#3-website-completion-gates)
4. [What is already done on the website](#4-what-is-already-done-on-the-website)
5. [Critical blocker — ID & Tool Box page layout](#5-critical-blocker--id--tool-box-page-layout)
6. [Page-by-page completion checklist](#6-page-by-page-completion-checklist)
7. [ID page — copy (Option A, Tennessee pilot)](#7-id-page--copy-option-a-tennessee-pilot)
8. [ID page — link map (every clickable)](#8-id-page--link-map-every-clickable)
9. [ID page — layout fix (contractor brief)](#9-id-page--layout-fix-contractor-brief)
10. [Homepage & global nav](#10-homepage--global-nav)
11. [Protocol pages (all 10)](#11-protocol-pages-all-10)
12. [Protocol Overview + Framer Token Shop page](#12-protocol-overview--framer-token-shop-page)
13. [Supporting Framer pages](#13-supporting-framer-pages)
14. [NEW — Framer `/adopt` page (Adoption Network)](#14-new--framer-adopt-page-adoption-network)
15. [DNS, publish, and iPhone test gates](#15-dns-publish-and-iphone-test-gates)
16. [Post-launch website maintenance](#16-post-launch-website-maintenance)
17. [What the website must never do](#17-what-the-website-must-never-do)
18. [Handoff package for hired Framer help](#18-handoff-package-for-hired-framer-help)
19. [Definition of “website complete”](#19-definition-of-website-complete)
20. [App & backend — modules added since May 29, 2026](#20-app--backend--modules-added-since-may-29-2026)
21. [Framer updates required for new app modules](#21-framer-updates-required-for-new-app-modules)
22. [After website — return to app build (summary)](#22-after-website--return-to-app-build-summary)
23. [Documentation & training package (new)](#23-documentation--training-package-new)

---

## 1. Executive summary

| Area | Status | Owner |
|------|--------|-------|
| **Domains & DNS** | ✅ Live — `freedompawsinc.com` (Framer) + `app.freedompawsinc.com` (Vercel) + `shelter.freedompawsinc.com` (Vercel) | Done |
| **Canonical shop decision** | ✅ App `/token-shop` only — Framer never processes payment | Done |
| **Homepage CTAs (T5 Part 1)** | ✅ Reported complete — ViT, Enroll ID, nav, middle tools | Founder |
| **Protocol Overview + 10 detail pages** | 🟡 Verify buy/view links per Section 4 table | Founder / contractor |
| **ID & Tool Box page copy** | 🟡 Option A compliance copy largely applied | Founder |
| **ID & Tool Box page layout (Phone)** | 🔴 **Blocked** — overlap, clip, black gaps | **Hired Framer help** |
| **Framer `/adopt` page** | 🔴 **Not built** — app directory live at `/adopt/tn` | Founder |
| **Shelters page → partner portal link** | 🟡 Update copy + link to `shelter.freedompawsinc.com/partner` | Founder |
| **Wellness partners (Framer teasers)** | 🟡 Optional links when insurance/telehealth URLs live | Founder |
| **ID page iPhone 6-tap test** | 🔴 Cannot pass until layout fixed | After layout |
| **Framer Publish (final)** | 🔴 Pending layout + `/adopt` + final link audit | After layout |
| **Monthly sync (prices/slugs)** | 🟡 Ongoing | Founder + engineering |

**Bottom line (May 29 baseline):** The marketing website was **~75% complete**. Copy and routing strategy were documented. The **remaining launch blocker for the website** was the **Phone layout** on `/freedom-paws-id-toolbox` plus a final **publish + iPhone test pass**.

**Bottom line (June 20 update):** The **app** has advanced significantly (PWA **v73 → v78**). New surfaces — **Ops Command Center**, **Shelter Partner Portal**, **ViT Pro**, **TN Adoption Directory**, **Wellness module**, **ID found/match workflows** — are **live in engineering** but require **new Framer marketing pages and link updates** (Sections 14, 21). Website completion is now **~70%** when counting new Framer work; original pages unchanged except `/adopt` and shelter cross-links.

---

## 2. Two surfaces — website vs app (expanded)

### Original two-surface model (May 29)

| Surface | URL | Role | Who fixes layout bugs |
|---------|-----|------|------------------------|
| **Website (Framer)** | `https://freedompawsinc.com` | SEO, grants, mission, protocol stories, ID marketing page | Framer editor or contractor |
| **App (Next.js PWA)** | `https://app.freedompawsinc.com` | ViT, Photo Booth, My Pets, shop, Xaman pay, ID enroll | Cursor / engineering |

### Current multi-surface model (June 20)

| Surface | URL | Role | Framer links here? |
|---------|-----|------|:------------------:|
| **Marketing (Framer)** | `https://freedompawsinc.com` | SEO, grants, mission, protocol stories, adoption story | — |
| **Member app (PWA)** | `https://app.freedompawsinc.com` | ViT, Photo Booth, My Pets, shop, protocols, wellness, adopt directory | ✅ Yes |
| **Partner / shelter portal** | `https://shelter.freedompawsinc.com/partner` | Found intake, match review, adoption listings | ✅ From `/adopt`, `/shelters` |
| **Ops Command Center** | `https://app.freedompawsinc.com/ops` | Founder KPIs, marketing gates, adoption stats | ❌ Internal only |
| **ViT Pro (vet CDS)** | `https://app.freedompawsinc.com/vit-pro` | Clinical decision support for advisors | ❌ Internal / advisor onboarding |
| **Community (planned)** | `https://freedompawsinc.org` | Grants, donations | 🟡 Future |

**Permanent rule:** All **buy** and **wallet** actions happen in the **app**. Framer **learn** pages link to Framer detail (`/protocol-N`); **buy** buttons link to `{APP}/token-shop?protocol={slug}&buy=1#{slug}`. **Live adoptable dogs** always link to `{APP}/adopt/tn` — never duplicate inventory in Framer.

`{APP}` = `https://app.freedompawsinc.com`  
`{FRAMER}` = `https://freedompawsinc.com`  
`{PARTNER}` = `https://shelter.freedompawsinc.com`

---

## 3. Website completion gates

| # | Gate | Pass criteria | Status |
|---|------|---------------|--------|
| W1 | **Homepage** | Hero CTAs + nav + protocol grid buy/view links → app or Framer correctly | 🟡 Verify |
| W2 | **Protocol Overview** | 10 cards — each View Link ≠ `/protocol-1` for all | 🟡 Verify |
| W3 | **10 protocol detail pages** | Buy button → app with correct slug | 🟡 Verify |
| W4 | **Framer Token Shop page** | Teaser only; buy → app | 🟡 Verify |
| W5 | **ID & Tool Box page** | Option A copy + all links + **Phone layout scrolls to footer** | 🔴 Layout |
| W6 | **Footer / mission pages** | Grants, veterans, shelters, contact load | 🟢 Likely OK |
| W7 | **Framer `/adopt` page** | Story + CTA → `{APP}/adopt/tn`; partner sign-in → `{PARTNER}/partner` | 🔴 **NEW** |
| W8 | **`/shelters` page update** | TN pilot story + partner portal link + adopt CTA | 🟡 **NEW** |
| W9 | **Publish** | Framer Publish after W1–W8 | 🔴 |
| W10 | **iPhone tests** | Section 10 + Section 15D checklists in `Framer-CTA-Link-Map.md` + `/adopt` 4-tap test | 🔴 |
| W11 | **Monthly sync** | 10 slugs + $18 / 25 XRP teaser matches app | 🟡 Ongoing |

---

## 4. What is already done on the website

### Strategic / architectural (do not redo)

- [x] Two-domain split: marketing on Framer, product on app subdomain
- [x] Canonical Token Shop = app only (`Framer-vs-App-Shop-XRPL-Strategy-and-Session-Thread-June-2026.md`)
- [x] `Framer-CTA-Link-Map.md` — permanent routing guide
- [x] App footer links back to Framer grants/mission/veterans/shelters
- [x] Protocol slug map (10 protocols) aligned with `lib/shop/protocol-catalog.ts`

### T5 Part 1 — Homepage (founder reported DONE)

- [x] Hero: **Try ViT AI** → `{APP}/diagnostics`
- [x] Hero: **Enroll Freedom Paws ID** → `{APP}/id/enroll`
- [x] Nav wired (Protocols, Token Shop → app, ID & Tool Box → Framer page)
- [x] Middle section tool cards → Photo Booth, My Pets (app URLs)
- [x] Protocol cards → Framer detail → buy in app (unchanged flow)

### T5 Part 2 — ID page copy (largely done; layout not)

- [x] Hero rename toward **Add your pet in the app**
- [x] Softened auto-enroll, IPFS, alerts language (Option A)
- [x] Live demo → ViT (not lost-dog match)
- [x] Stats toward **10 / 24/7 / Tennessee Pilot** (verify exact text on canvas)
- [x] Privacy + disclaimer lines added or drafted
- [ ] **Phone layout** — see Section 5 (blocker)
- [ ] Final **Publish** + 6-tap iPhone test

### NOT done on Framer (app is ready — Framer pending)

- [ ] **`/adopt` marketing page** — see Section 14
- [ ] **Nav item “Adopt”** → `{FRAMER}/adopt` or direct `{APP}/adopt/tn`
- [ ] **`/shelters` refresh** — partner portal + live directory CTAs
- [ ] **Wellness partner teasers** — optional insurance/telehealth links when env live

---

## 5. Critical blocker — ID & Tool Box page layout

**Page:** `{FRAMER}/freedom-paws-id-toolbox`  
**Symptom (Phone breakpoint):** Stack overlap; canvas too short; Privacy / stats / footer clipped or drawn on top of each other; huge black gap between headline and buttons.

**Root cause (diagnosed):**

| Rank | Cause |
|------|--------|
| 1 | Section stacks **Position: Absolute** or identical **Top** Y values |
| 2 | `Bottom CTAs` component — `CTA Token Shop` + `CTA Protocols` overlap inside nested **Tap** wrappers |
| 3 | `Stack - Privacy` was Absolute (e.g. Top ~5690) — not in document flow |
| 4 | Parent fixed height + **Overflow Hidden** clipping tail sections |
| 5 | Phone breakpoint overrides missing for Gap / Height / Direction |

**Content is not missing** — Layers panel shows Privacy, stats, footer; they are **overlapped or clipped**.

**Recommended fix (nuclear — fastest for contractor):**

1. **Phone breakpoint only.**
2. **Delete `Bottom CTAs`** component block.
3. Add **2 plain buttons** in **Header** (not components): Shop → `{APP}/token-shop`; Protocols → `/protocol-overview`.
4. **Stack - Privacy:** Position **Relative**, Padding-top **48+**, Height **Fit**.
5. **Stack - Stats:** Position **Relative**, Direction **Vertical** (or single line for launch).
6. Parent **Stack:** Gap **56**, Vertical, Fit, Relative, Overflow **Visible**.
7. **Preview** full scroll → **Publish**.
8. Run **6-tap test** (Section 8).

**Full inspection procedure:** `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md`  
**Agent vocabulary for future sessions:** same doc **§6 Lexicon**

### Canonical layer order (target)

```
Stack (Parent — Gap 56, Vertical, Fit, Relative)
  Community Impact: "Every Freedom Pa..."
  Image
  Stack (Header wrapper)
    Header
      "Protect Your Dog Today"
      [Plain Button: Shop] → {APP}/token-shop
      [Plain Button: Explore Protocols] → /protocol-overview
  Stack - Privacy
  Stack - Stats
    (10 Protocols / 24/7 App Access / Tennessee Pilot)
Footer (page root — NOT inside clipped parent)
```

---

## 6. Page-by-page completion checklist

Use this as the master website punch list. Check each box after **Publish** + iPhone verify.

| Page (Framer) | Copy | Links | Phone layout | Publish | iPhone test |
|---------------|------|-------|--------------|---------|-------------|
| `/` (Home) | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/protocol-overview` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/protocol-1` … `/protocol-10` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/token-shop` (Framer teaser) | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/freedom-paws-id-toolbox` | ☐ | ☐ | **🔴** | ☐ | ☐ |
| **`/adopt`** *(NEW)* | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/about-buddys-story` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/community-impact` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/how-recovery-works` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/contact` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/faq` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/grants` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/mission` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/veterans` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/shelters` | ☐ | ☐ **update** | ☐ | ☐ | ☐ |

---

## 7. ID page — copy (Option A, Tennessee pilot)

Apply on `/freedom-paws-id-toolbox`. Source: `Framer-CTA-Link-Map.md` Section 14A + session decisions.

| Section | Launch-safe copy |
|---------|------------------|
| Hero button | **Add your pet in the app** (not “Upload”) |
| Hero subline | *ViT Diagnostics & My Pets available now. Full ID matching rolling out soon.* |
| Auto-enroll | **Planned:** protocol members will enroll in the Freedom Paws ID database. |
| IPFS | **Designed for** private decentralized storage (IPFS) — coming soon. |
| Alerts | **Owner alerts** on match (coming soon). |
| QR / shelter portal | **QR & shelter portal** — staff tools at `{PARTNER}/partner` *(update from “roadmap” when live)* |
| Tool Box intro | **Your pet’s digital health hub** — ViT & My Pets in the app today; full vault on IPFS (planned). |
| Live demo headline | **Try ViT AI Now** — same vision tech as future ID matching |
| Live demo sub | Upload a photo in the app to test **ViT Diagnostics** (not lost-dog ID match yet). |
| Step 1 product name | **Any Freedom Paws protocol** (not “Recovery Plus” unless SKU exists) |
| Stats row | **10 Protocols** · **24/7 App Access** · **Tennessee Pilot** (no unverified 1K+ / 88%) |
| Privacy | Add: *Biometric ID enrollment will require explicit consent (planned).* |
| Bottom disclaimer | *Freedom Paws ID is not a government pet license. Not veterinary advice.* |
| Tennessee framing | Community Impact section may reference TN pilot where appropriate |

---

## 8. ID page — link map (every clickable)

**New tab: OFF** for all `{APP}` and `{PARTNER}` URLs.

### Hero

| Element | URL |
|---------|-----|
| **Add your pet in the app** | `{APP}/mypets` |
| **Enroll Freedom Paws ID** | `{APP}/id/enroll` |
| Optional **Try ViT AI** | `{APP}/diagnostics` |
| Optional **ID hub** | `{APP}/id` |

### Tool Box grid

| Button | URL |
|--------|-----|
| Medical Records | `{APP}/mypets` |
| ViT Scans | `{APP}/diagnostics` |
| Vaccinations | `{APP}/mypets` |
| Daily Notes | `{APP}/mypets` |

Caption under grid: *Full encrypted vault & IPFS sync — coming soon.*

### Live demo

| Element | URL |
|---------|-----|
| **Try Live AI Demo** | `{APP}/diagnostics` |
| Upload / sample thumbnails (if clickable) | `{APP}/diagnostics` |

### Protect Your Dog Today (bottom CTAs)

| Element | URL |
|---------|-----|
| **Get lifetime access** (rename from Recovery Plus if needed) | `{APP}/token-shop` |
| **Explore All Protocols** | `/protocol-overview` |

### Nav

| Item | URL |
|------|-----|
| **ID & Tool Box** | Stays on `/freedom-paws-id-toolbox` |
| **Token Shop** | `{APP}/token-shop` |
| **Adopt** *(NEW — add to nav)* | `{FRAMER}/adopt` or `{APP}/adopt/tn` |

### iPhone 6-tap test (must pass before website gate W5 closes)

| # | Tap | Must open |
|---|-----|-----------|
| 1 | Add your pet in the app | `{APP}/mypets` |
| 2 | Try Live AI Demo | `{APP}/diagnostics` |
| 3 | Medical Records | `{APP}/mypets` |
| 4 | Explore All Protocols | `/protocol-overview` |
| 5 | Shop / lifetime access | `{APP}/token-shop` |
| 6 | Nav ID & Tool Box | Stays on Framer ID page |

---

## 9. ID page — layout fix (contractor brief)

**Scope:** Phone breakpoint on `/freedom-paws-id-toolbox` only. Desktop may already look fine — still verify after Phone fix.

### Phase 1 — Unclip page

1. Select outermost content **Stack** (PageBody equivalent).
2. Height → **Fit contents**
3. Overflow → **Visible**
4. Clip Content → **Off**

### Phase 2 — Document flow

5. For Community Impact → Stats sections: **Position Relative**; clear **Pin**; remove manual **Y**.
6. Confirm each section pushes the next down on canvas.

### Phase 3 — Reorder / extract

7. Privacy and Stats must be **siblings** below Header — not nested inside Community Impact with clip.
8. Order: Community Impact → Image → Header (Protect + buttons) → Privacy → Stats → Footer.

### Phase 4 — Replace broken CTA components

9. Delete `Bottom CTAs` (and nested `Tap - Token Shop CTA`, `CTA Token Shop`, `CTA Protocols`).
10. Insert two plain Framer buttons with URLs from Section 8.

### Phase 5 — Verify + publish

11. Phone **Preview** — scroll Hero → Footer without overlap.
12. **Publish** Framer site.
13. Real iPhone Safari test — Section 8 table.

**Time estimate for experienced Framer contractor:** 1–2 hours if nuclear reset path is used.

---

## 10. Homepage & global nav

Source: `Framer-CTA-Link-Map.md` Section 9.

### Hero CTAs

| Priority | Label | URL |
|----------|-------|-----|
| Primary | **Try ViT AI free** | `{APP}/diagnostics` |
| Secondary | **Enroll Freedom Paws ID** | `{APP}/id/enroll` |

### Nav *(June 20 — add Adopt)*

| Nav item | Link |
|----------|------|
| About / Buddy's Story | Framer page |
| Protocols Overview | `/protocol-overview` |
| **Adopt** *(NEW)* | `{FRAMER}/adopt` |
| Community Impact | Framer page |
| **Token Shop** | `{APP}/token-shop` |
| **ID & Tool Box** | `/freedom-paws-id-toolbox` |
| Grants FAQ | Framer page |
| **Connect Wallet** | `{APP}/token-shop` |

### Mid-page sections

| Section | Wire to |
|---------|---------|
| 10 protocol cards — Learn More | `/protocol-1` … `/protocol-10` |
| 10 protocol cards — Buy (if present) | `{APP}/token-shop?protocol={slug}&buy=1#{slug}` |
| Token Shop block | `{APP}/token-shop` |
| Freedom Paws ID block | `{APP}/id` + optional Enroll → `{APP}/id/enroll` |
| **Adoption Network block** *(NEW)* | `{APP}/adopt/tn` |

### Homepage iPhone test (Section 10 of CTA map)

| # | Test |
|---|------|
| 1 | Protocol Overview card #1 bone → Max Movement Framer detail |
| 2 | Card #3 bone → Liver & Kidney (not Max Movement) |
| 3 | Detail page buy → app Token Shop correct card |
| 4 | Pay with Xaman button visible / pulsed |
| 5 | Framer Token Shop card buy → same |
| 6 | Homepage ViT → `{APP}/diagnostics` |
| 7 | **Adopt CTA → `{APP}/adopt/tn`** *(NEW)* |

---

## 11. Protocol pages (all 10)

For **each** `/protocol-1` through `/protocol-10`:

| Step | Action |
|------|--------|
| 1 | Confirm hero title matches Section 4 table in `Framer-CTA-Link-Map.md` |
| 2 | Main buy button → URL from Section 4 **Buy link** column |
| 3 | Label: **Get lifetime access in the app** or **Pay with Xaman in the app** |
| 4 | New tab: **OFF** |
| 5 | Optional: **Browse all protocols in app** → `{APP}/protocols` |
| 6 | Price teaser text only: *Lifetime access · $18 USD · pay in XRP via Xaman in the app* |

### Slug reference (must match app)

| # | Framer page | App slug |
|---|-------------|----------|
| 1 | `/protocol-1` | `max-movement` |
| 2 | `/protocol-2` | `freedom-calm` |
| 3 | `/protocol-3` | `liver-kidney-detox` |
| 4 | `/protocol-4` | `gut-balance` |
| 5 | `/protocol-5` | `fresh-smile-dental` |
| 6 | `/protocol-6` | `heart-strong` |
| 7 | `/protocol-7` | `infrared-spine` |
| 8 | `/protocol-8` | `allergy-shield` |
| 9 | `/protocol-9` | `patriot-immune` |
| 10 | `/protocol-10` | `clear-vision` |

---

## 12. Protocol Overview + Framer Token Shop page

### Protocol Overview (`/protocol-overview`)

**One-time component setup** (Section 5 of CTA map):

- Protocol Card component must have **`View Link`** and **`Buy Link`** properties.
- Bone Button → bound to **`View Link`** — never hardcoded `/protocol-1` on component master.

**Per card (10 instances):**

| Card | View Link | Buy Link |
|------|-----------|----------|
| 1 | `/protocol-1` | `{APP}/token-shop?protocol=max-movement&buy=1#max-movement` |
| … | … | … |
| 10 | `/protocol-10` | `{APP}/token-shop?protocol=clear-vision&buy=1#clear-vision` |

### Framer Token Shop page (`/token-shop`)

- Same card pattern as Protocol Overview.
- Page copy (“25 XRP or 18 RLUSD”) = **text only** — not a payment link.
- Optional bottom button: **Open full Token Shop in app** → `{APP}/token-shop`

---

## 13. Supporting Framer pages

These pages support SEO, grants, and trust. No app checkout on these pages.

| Page | Purpose | App links (if any) |
|------|---------|-------------------|
| `/about-buddys-story` | Origin story | Optional CTA → `{APP}/` |
| `/community-impact` | Veterans, give-back | Optional → `{APP}/token-shop` |
| `/how-recovery-works` | Education | Link to `/protocol-overview` |
| `/contact` | Contact form / email | None required |
| `/faq` | FAQs | Link to app help routes if mentioned |
| `/grants` | 10% give-back story | Footer standard |
| `/mission` | Mission statement | Footer standard |
| `/veterans` | Patriotic mission | Footer standard |
| `/shelters` | Shelter pilot story | **Update:** `{PARTNER}/partner` + `{APP}/adopt/tn` |

**Footer (site-wide on ID page and others):**

| Link | Destination |
|------|-------------|
| Our Story | `/about-buddys-story` |
| Patriotic Mission / Veterans | `/community-impact` |
| Plans / Supplements | `/protocol-overview` |
| **Adopt in Tennessee** *(NEW)* | `{FRAMER}/adopt` |
| Resources | `/how-recovery-works` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Success Stories | `/community-impact` |
| Instagram / Facebook | Real profile URLs |

---

## 14. NEW — Framer `/adopt` page (Adoption Network)

**Status:** App directory **live** — Framer marketing page **not built**  
**Full guide:** `Framer-Adopt-Page-Wiring-Guide-June-2026.md`

### Routing rule (do not change)

| Job | Where | URL |
|-----|--------|-----|
| Live adoptable dogs | App only | `{APP}/adopt/tn` |
| Marketing story | Framer | `{FRAMER}/adopt` |
| Partner staff tools | Partner host | `{PARTNER}/partner` |

### Minimum Framer build checklist

| Step | Action |
|------|--------|
| 1 | Create page slug **`/adopt`** |
| 2 | Hero button → `{APP}/adopt/tn` (new tab **OFF**) |
| 3 | Optional: 6 TN partner text links → `{APP}/adopt/tn/{slug}` |
| 4 | Secondary: “Shelter partners” → `{FRAMER}/shelters` |
| 5 | Optional: “Partner sign-in” → `{PARTNER}/partner` |
| 6 | Add **Adopt** to site nav |
| 7 | Phone preview + Publish |
| 8 | iPhone 4-tap test (hero CTA, bottom CTA, partner link, nav Adopt) |

### Suggested hero copy

**Eyebrow:** Freedom Paws Adoption Network  
**Headline:** Find your next dog in Tennessee  
**Subhead:** Live adoptable dogs from municipal shelters and private rescues in our Tennessee pilot — updated when partners publish.  
**Button:** Browse adoptable dogs in Tennessee →

---

## 15. DNS, publish, and iPhone test gates

### DNS (verify all three hosts)

| Record | Points to |
|--------|-----------|
| `freedompawsinc.com` | Framer |
| `app.freedompawsinc.com` | Vercel (CNAME) |
| `shelter.freedompawsinc.com` | Vercel (CNAME) — **NEW since May 29** |

Vercel env: `NEXT_PUBLIC_APP_URL=https://app.freedompawsinc.com`  
Optional: `NEXT_PUBLIC_PARTNER_HOST=shelter.freedompawsinc.com`

Supabase auth redirect URLs must include **both** `app.` and `shelter.` subdomains.

### Publish sequence (final launch day)

1. Complete W1–W8 checklists above.
2. Framer → **Publish** (wait for completion).
3. iPhone Safari: run Section 10 + `/adopt` tests.
4. PWA home screen: open app → confirm Token Shop + `/adopt/tn` work.
5. Partner portal: `{PARTNER}/partner` loads with emerald partner UI.
6. Optional: coordinate announcement with `NEXT_PUBLIC_SITE_MODE=public` (legal gate).

---

## 16. Post-launch website maintenance

### Monthly (first Monday of month)

- [ ] 10 slugs match `app/token-shop/shop-items.ts`
- [ ] Framer `/protocol-{N}` titles match CTA map Section 4
- [ ] All Buy Link URLs use `https://app.freedompawsinc.com`
- [ ] Price teaser: $18 USD / 25 XRP matches `SHOP_PRICE`
- [ ] Test 3 buy deep links on iPhone
- [ ] Test `{APP}/adopt/tn` loads current listings
- [ ] `{PARTNER}/partner` sign-in works for test shelter account
- [ ] No Framer page hosts checkout or wallet connect

### When app ships new features (update Framer copy + links)

| App feature ships | Website update |
|-------------------|----------------|
| ID enroll live | Soften “planned” → live copy; demo link → `{APP}/id/enroll` |
| IPFS vault | Tool Box deep links; remove “coming soon” where true |
| Chip scanner Track 2 | Add `{APP}/id/scan` only after live — never before |
| New protocol #11 | Add Framer `/protocol-11` + slug row in CTA map + app catalog |
| **Adoption listings live** | **`/adopt` page + `/shelters` update** — **DONE in app; Framer pending** |
| **Wellness insurance live** | Optional Framer wellness teaser → `{APP}/wellness` |
| **ViT Pro advisor program** | No public Framer page — advisor onboarding only |

---

## 17. What the website must never do

- Process Xaman / XRP / RLUSD payment
- Host canonical Token Shop checkout
- **Host live adoption listings** (inventory is app SSR only)
- Hardcode same Bone Button link on component master for all protocols
- Link “Click Here To View” directly to `&buy=1` URLs
- Use `protocol-1` style paths on the **app** domain (app uses **slugs** only)
- Claim live ID match, IPFS vault, or chip scan before app features ship
- Expose Ops Command Center or ViT Pro on public marketing pages

---

## 18. Handoff package for hired Framer help

Give your contractor these files (all in `freedompaws-app/docs/`):

| File | Why |
|------|-----|
| **This report** | Master punch list |
| `Framer-CTA-Link-Map.md` | Every URL |
| `Framer-Adopt-Page-Wiring-Guide-June-2026.md` | **NEW** `/adopt` page |
| `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md` | Layout fix + §6 lexicon |
| `Protocol-Price-Source-of-Truth.md` | Prices |

**Contractor task list (minimum):**

1. Fix Phone layout on `/freedom-paws-id-toolbox` (Section 9).
2. Build `/adopt` page (Section 14).
3. Update `/shelters` + nav with adopt + partner portal links.
4. Verify all links in Section 8.
5. Run 6-tap iPhone test (ID page) + 4-tap test (`/adopt`).
6. Spot-check Protocol Overview card #3 ≠ card #1 link bug.
7. Publish.

**Acceptance criteria:** Phone Preview scrolls ID page top to footer with no overlap; all taps open correct destinations; `/adopt` primary CTA opens live TN directory.

---

## 19. Definition of “website complete”

The **Framer marketing website** is complete when **all** are true:

| # | Criterion |
|---|-----------|
| 1 | Homepage + nav CTAs open correct app routes |
| 2 | Protocol Overview — 10 cards with correct View + Buy links |
| 3 | All 10 protocol detail pages — buy → correct app slug |
| 4 | Framer Token Shop teaser — buy → app only |
| 5 | ID & Tool Box — Option A copy + all links + **Phone layout passes scroll test** |
| 6 | **`/adopt` page live — CTA → `{APP}/adopt/tn`** |
| 7 | **`/shelters` updated — partner portal + adopt CTAs** |
| 8 | Footer / mission pages load; social links real |
| 9 | Framer **Published** after final audit |
| 10 | iPhone tests Section 10 + `/adopt` pass |
| 11 | Monthly sync doc acknowledged for ongoing ops |

**Not required for website v1:** Rebuilding entire site in Next.js; custom Framer checkout; live chip-scanner marketing claims; public ViT Pro pages.

---

## 20. App & backend — modules added since May 29, 2026

> **Note:** These ship in the **Next.js app**, not Framer. Listed here so the founder knows what exists, what Framer must link to, and what stays internal.

### Platform & auth

| Module | Route / URL | Status | Notes |
|--------|-------------|--------|-------|
| PWA version bump | — | ✅ **v78** | Was v73 at report creation |
| Magic link + **OTP fallback login** | `/login` | ✅ | 6-digit code on same page |
| Multi-surface routing | middleware | ✅ | consumer · partner · ops · vitpro |
| Service worker | `public/sw.js` | ✅ | Network-only for `/ops`, `/vit-pro`, `/partner` |

### Ops Command Center *(founder only)*

| Module | Route | Status |
|--------|-------|--------|
| Command home | `/ops` | ✅ KPIs, audit log, quick links |
| Adoption Network | `/ops/adoption` | ✅ TN partners, listing pipeline, outreach toggles |
| Marketing automation | `/ops/marketing` | ✅ Emergency stop, workflow toggles (dormant) |
| Shelter & ID | `/ops/shelter-id` | ✅ Found/match stats, shortcuts |
| Wellness config | `/ops/wellness` | ✅ Insurance + telehealth readiness |
| Product | `/ops/product` | ✅ Feature flags, PWA version, symptom admin link |
| System | `/ops/system` | ✅ Supabase, Resend, env health |

**Access:** `fp_ops` role + `FP_OPS_EMAILS` env.

### Adoption Network — TN Pilot

| Module | Route / URL | Status |
|--------|-------------|--------|
| Public TN directory | `{APP}/adopt/tn` | ✅ SSR from Supabase |
| Shelter page | `{APP}/adopt/tn/{shelterSlug}` | ✅ |
| Dog detail | `{APP}/adopt/tn/{shelterSlug}/{listingSlug}` | ✅ |
| Partner dashboard | `{PARTNER}/partner` | ✅ |
| Listings CRUD | `{PARTNER}/partner/listings` | ✅ draft · available · pending · adopted |
| New / edit listing | `{PARTNER}/partner/listings/new`, `…/edit` | ✅ photo upload |
| 6 TN pilot orgs | Supabase migration `009` | ✅ municipal + private |

### Freedom Paws ID — shelter workflows

| Module | Route | Status |
|--------|-------|--------|
| ID hub | `/id` | ✅ |
| Owner enroll | `/id/enroll` | ✅ |
| Found dog intake | `/id/found` | ✅ photo + video |
| Match review queue | `/id/match` | ✅ human approve before owner email |
| Shelter dashboard | `/id/shelter` | ✅ |
| Chip scan (Track 2) | `/id/scan` | 🟡 MVP route — hardware pending |
| Lookup / public pet page | `/id/lookup`, `/id/p/[slug]` | ✅ |
| Match owner email | Resend API | ✅ when env configured |

### ViT Pro — veterinary CDS *(V0)*

| Module | Route | Status |
|--------|-------|--------|
| ViT Pro home | `/vit-pro` | ✅ |
| CDS analyze | `/vit-pro/analyze` | ✅ eye · skin · oral |
| Benchmark | `/vit-pro/benchmark` | ✅ advisor validation |
| Corpus browser | `/vit-pro/corpus` | ✅ RAG reference |
| Dual output Tier A/B | API `mode=vit_pro` | ✅ owner vs vet layers |
| Access control | `VIT_PRO_ADVISOR_EMAILS` | ✅ |

**Not on Framer** — advisor onboarding via training manual only.

### Wellness module

| Module | Route | Status |
|--------|-------|--------|
| Wellness hub | `/wellness` | ✅ |
| Insurance partner | `/wellness/partners/insurance` | 🟡 env-gated |
| Telehealth partner | `/wellness/partners/telehealth` | 🟡 env-gated |
| Safe products | `/wellness/safe-products` | ✅ |
| Config status API | `/api/wellness/config-status` | ✅ |

### Consumer app (existing + enhanced)

| Module | Route | Status |
|--------|-------|--------|
| ViT Diagnostics | `/diagnostics` | ✅ photo + video |
| SuperBud Photo Booth | `/photobooth` | ✅ |
| My Pets + vault | `/mypets`, `/mypets/[id]/vault` | ✅ |
| Protocols (10) | `/protocols`, `/protocols/[slug]` | ✅ |
| Token Shop (Xaman) | `/token-shop` | ✅ |
| Monitor beta | `/monitor` | 🟡 relay pending |
| Symptom admin | `/admin/symptoms` | ✅ |
| Waitlist | `/waitlist` | ✅ |
| Terms / Privacy | `/terms`, `/privacy` | ✅ |

### Marketing automation (backend — dormant)

| Component | Location | Status |
|-----------|----------|--------|
| CRM export script | `npm run marketing:crm-export` | ✅ no send |
| TN outreach drafts | `npm run marketing:tn-outreach` | ✅ |
| Draft emails | `docs/marketing/outbox/tn-pilot/` | ✅ 6 partners |
| n8n templates | `docs/automation/n8n/` | ✅ |
| Ops marketing toggles | `/ops/marketing` | ✅ emergency stop ON |

### Documentation & training *(new since May 29)*

| Deliverable | Location |
|-------------|----------|
| General Master Binder (MD + PDF) | `docs/binders/` + Documents folder |
| Technical Master Binder (MD + PDF) | `docs/binders/` |
| Appendices A–C (PDF) | Token Shop, ViT Pro advisor, protocol JSON |
| Founder / CEO / Developer manual | `docs/training/` + PDF |
| Shelter portal training manual | `docs/training/` + PDF |
| ViT Pro vet portal training manual | `docs/training/` + PDF |
| PDF generator | `npm run binders:pdf` |
| ViT Pro business plan + benchmark guide | `docs/ops/` |
| Adoption kickoff runbooks | `docs/ops/` |
| Infrastructure Phases 1–3 guide | `docs/ops/INFRASTRUCTURE-BUILDOUT-FRAMER-DNS-WELLNESS.md` |

### Supabase migrations (cumulative)

| Migration area | Purpose |
|----------------|---------|
| ID + enrollments + pgvector | Biometric matching |
| Partner orgs TN pilot | 6 shelters |
| Adoption listings | Public directory |
| Ops settings | Marketing toggles, feature flags, audit log |
| Auth profiles + roles | shelter_staff, shelter_admin, fp_ops, vet_staff |

Run: `supabase/RUN_ALL_MIGRATIONS_001_004.sql` or individual files in `supabase/migrations/`.

---

## 21. Framer updates required for new app modules

Priority order for founder / contractor after ID layout fix:

| Priority | Framer change | App target | Guide |
|:--------:|---------------|------------|-------|
| **P0** | Fix ID page Phone layout | — | Section 9 |
| **P1** | Create **`/adopt`** page | `{APP}/adopt/tn` | `Framer-Adopt-Page-Wiring-Guide-June-2026.md` |
| **P1** | Add **Adopt** to site nav | `{FRAMER}/adopt` | Section 14 |
| **P2** | Update **`/shelters`** | `{PARTNER}/partner` + `{APP}/adopt/tn` | Section 13 |
| **P2** | ID page: shelter portal copy | `{PARTNER}/partner` | Section 7 |
| **P3** | Homepage adoption block | `{APP}/adopt/tn` | Section 10 |
| **P3** | Footer “Adopt in Tennessee” | `{FRAMER}/adopt` | Section 13 |
| **P4** | Wellness teaser (when URLs live) | `{APP}/wellness` | `/ops/wellness` config |
| **—** | ViT Pro | **No Framer page** | Internal only |
| **—** | Ops Command Center | **No Framer page** | Internal only |

---

## 22. After website — return to app build (summary)

Website completion is **Framer-only**. The **app** (`freedompaws-app`, PWA **v78**) has separate engineering tracks.

### App launch gates (June 20 status)

| Track | Status | Next engineering focus |
|-------|--------|--------------------------|
| **A — ViT** | 🟢 | Prod iPhone verify; weekly symptom admin queue |
| **B — Photo Booth** | 🟡 | Phase 4 JPG assets; iPhone sign-off |
| **C — My Pets + vault** | 🟢 | Optional per-pet protocol tracking |
| **D — Monitor relay** | 🔴 | Cloud relay — launch blocker for members |
| **E — Framer integration** | 🟡 | `/adopt` + deep-link smoke test after Framer publish |
| **F — ID Track 2** | 🟡 | HID scanner MVP `/id/scan` after hardware |
| **G — Adoption Network** | 🟢 | **Shipped** — listings + partner portal; Framer `/adopt` pending |
| **H — Ops Command Center** | 🟢 | **Shipped** — founder training manual available |
| **I — ViT Pro V0** | 🟢 | **Shipped** — advisor benchmark + corpus; not public |
| **J — Legal + payments** | 🔴 | Terms counsel; Stripe webhook; `SITE_MODE=public` |
| **K — Marketing go-live** | 🔴 | After gates + LLC; n8n dormant until activation gate |

### Recommended next Cursor session (app)

1. Production build verify (`npm run build`).
2. Framer `/adopt` + `/shelters` publish (founder / contractor).
3. Deep-link smoke test: Framer → `{APP}/adopt/tn`, `{PARTNER}/partner`.
4. First real TN listing published by pilot partner.
5. ViT Pro advisor benchmark review (`npm run vit-pro:benchmark`).
6. Monitor relay spike when hardware ready.

**Primary engineering doc:** `Freedom-Paws-Launch-Master-Checklist-June-2026.md`  
**Founder ops manual:** `docs/training/Freedom-Paws-Founder-CEO-Developer-Manual-May-2026.md`

---

## 23. Documentation & training package (new)

Regenerate all PDFs: `npm run binders:pdf`  
Output: `~/Documents/Freedom Paws Wellness/`

| PDF | Audience |
|-----|----------|
| Freedom-Paws-GENERAL-Master-Binder-May-2026.pdf | Public, grants, marketing |
| Freedom-Paws-TECHNICAL-Master-Binder-May-2026.pdf | Grants, attorneys, XRPL |
| Freedom-Paws-Founder-CEO-Developer-Manual-May-2026.pdf | Founder / ops |
| Freedom-Paws-Shelter-Portal-Training-Manual-May-2026.pdf | Shelter onboarding |
| Freedom-Paws-Vet-Portal-Training-Manual-May-2026.pdf | ViT Pro advisors |

Index: `docs/binders/PDF-PACKAGE-INDEX.md`

---

## Quick reference — URLs

| Purpose | URL |
|---------|-----|
| Marketing site | `https://freedompawsinc.com` |
| App (PWA) | `https://app.freedompawsinc.com` |
| Partner portal | `https://shelter.freedompawsinc.com/partner` |
| ViT | `{APP}/diagnostics` |
| Photo Booth | `{APP}/photobooth` |
| My Pets | `{APP}/mypets` |
| Token Shop | `{APP}/token-shop` |
| ID enroll | `{APP}/id/enroll` |
| ID hub | `{APP}/id` |
| **Adopt TN (live)** | `{APP}/adopt/tn` |
| **Framer adopt story** | `{FRAMER}/adopt` *(build pending)* |
| Ops Command Center | `{APP}/ops` *(internal)* |
| ViT Pro | `{APP}/vit-pro` *(advisors)* |
| Wellness | `{APP}/wellness` |
| Framer protocols | `/protocol-overview` |
| ID marketing page | `/freedom-paws-id-toolbox` |

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Website post-launch completion report — May 29, 2026 · Updated June 20, 2026*
