# Freedom Paws Wellness
# Website (Framer) — Post-Launch Completion Report

**Date:** May 29, 2026  
**Document purpose:** Single detailed report of everything needed to **complete the marketing website** (`freedompawsinc.com`) for Freedom Paws Wellness after launch. Includes status from all session work, hired-contractor handoff, and post-launch maintenance.  
**App (separate surface):** `https://app.freedompawsinc.com` — PWA **v73** — engineering completion tracked in `Freedom-Paws-Launch-Master-Checklist-June-2026.md`.

**Related docs (read in this order):**
- `Framer-CTA-Link-Map.md` — every button URL (Section 14 = ID page)
- `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md` — layout fix + **§6 Agent lexicon**
- `Today-Session-Founder-Checklists-June-2026.md` — T5 Framer pass
- `Framer-and-DNS-Manual-Setup-Guide.md` — DNS + click-by-click
- `Protocol-Price-Source-of-Truth.md` — prices must match app
- `Freedom-Paws-Launch-Master-Checklist-June-2026.md` — full launch gates (app + website)

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Two surfaces — website vs app](#2-two-surfaces--website-vs-app)
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
14. [DNS, publish, and iPhone test gates](#14-dns-publish-and-iphone-test-gates)
15. [Post-launch website maintenance](#15-post-launch-website-maintenance)
16. [What the website must never do](#16-what-the-website-must-never-do)
17. [Handoff package for hired Framer help](#17-handoff-package-for-hired-framer-help)
18. [Definition of “website complete”](#18-definition-of-website-complete)
19. [After website — return to app build (summary)](#19-after-website--return-to-app-build-summary)

---

## 1. Executive summary

| Area | Status | Owner |
|------|--------|-------|
| **Domains & DNS** | ✅ Live — `freedompawsinc.com` (Framer) + `app.freedompawsinc.com` (Vercel) | Done |
| **Canonical shop decision** | ✅ App `/token-shop` only — Framer never processes payment | Done |
| **Homepage CTAs (T5 Part 1)** | ✅ Reported complete — ViT, Enroll ID, nav, middle tools | Founder |
| **Protocol Overview + 10 detail pages** | 🟡 Verify buy/view links per Section 4 table | Founder / contractor |
| **ID & Tool Box page copy** | 🟡 Option A compliance copy largely applied | Founder |
| **ID & Tool Box page layout (Phone)** | 🔴 **Blocked** — overlap, clip, black gaps | **Hired Framer help** |
| **ID page iPhone 6-tap test** | 🔴 Cannot pass until layout fixed | After layout |
| **Framer Publish (final)** | 🔴 Pending layout + final link audit | After layout |
| **Monthly sync (prices/slugs)** | 🟡 Ongoing | Founder + engineering |

**Bottom line:** The marketing website is **~75% complete**. Copy and routing strategy are documented. The **remaining launch blocker for the website** is the **Phone layout** on `/freedom-paws-id-toolbox` plus a final **publish + iPhone test pass** across all pages. The **app** is a separate codebase and is further along (v73); see Section 19.

---

## 2. Two surfaces — website vs app

| Surface | URL | Role | Who fixes layout bugs |
|---------|-----|------|------------------------|
| **Website (Framer)** | `https://freedompawsinc.com` | SEO, grants, mission, protocol stories, ID marketing page | Framer editor or contractor |
| **App (Next.js PWA)** | `https://app.freedompawsinc.com` | ViT, Photo Booth, My Pets, shop, Xaman pay, ID enroll | Cursor / engineering |

**Permanent rule:** All **buy** and **wallet** actions happen in the **app**. Framer **learn** pages link to Framer detail (`/protocol-N`); **buy** buttons link to `{APP}/token-shop?protocol={slug}&buy=1#{slug}`.

`{APP}` = `https://app.freedompawsinc.com`  
`{FRAMER}` = `https://freedompawsinc.com`

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
| W7 | **Publish** | Framer Publish after W1–W5 | 🔴 |
| W8 | **iPhone tests** | Section 10 + Section 14D checklists in `Framer-CTA-Link-Map.md` | 🔴 |
| W9 | **Monthly sync** | 10 slugs + $18 / 25 XRP teaser matches app | 🟡 Ongoing |

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
| `/about-buddys-story` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/community-impact` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/how-recovery-works` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/contact` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/faq` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/grants` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/mission` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/veterans` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/shelters` | ☐ | ☐ | ☐ | ☐ | ☐ |

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
| QR / shelter portal | **QR & shelter portal** (roadmap). |
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

**New tab: OFF** for all `{APP}` URLs.

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

### Nav

| Nav item | Link |
|----------|------|
| About / Buddy's Story | Framer page |
| Protocols Overview | `/protocol-overview` |
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

### Homepage iPhone test (Section 10 of CTA map)

| # | Test |
|---|------|
| 1 | Protocol Overview card #1 bone → Max Movement Framer detail |
| 2 | Card #3 bone → Liver & Kidney (not Max Movement) |
| 3 | Detail page buy → app Token Shop correct card |
| 4 | Pay with Xaman button visible / pulsed |
| 5 | Framer Token Shop card buy → same |
| 6 | Homepage ViT → `{APP}/diagnostics` |

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
| `/shelters` | Shelter pilot story | Optional → `{APP}/id/shelter` when live |

**Footer (site-wide on ID page and others):**

| Link | Destination |
|------|-------------|
| Our Story | `/about-buddys-story` |
| Patriotic Mission / Veterans | `/community-impact` |
| Plans / Supplements | `/protocol-overview` |
| Resources | `/how-recovery-works` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Success Stories | `/community-impact` |
| Instagram / Facebook | Real profile URLs |

---

## 14. DNS, publish, and iPhone test gates

### DNS (likely complete — verify)

| Record | Points to |
|--------|-----------|
| `freedompawsinc.com` | Framer |
| `app.freedompawsinc.com` | Vercel (CNAME) |

Vercel env: `NEXT_PUBLIC_APP_URL=https://app.freedompawsinc.com`

### Publish sequence (final launch day)

1. Complete W1–W5 checklists above.
2. Framer → **Publish** (wait for completion).
3. iPhone Safari: run Section 10 + Section 14D tests in `Framer-CTA-Link-Map.md`.
4. PWA home screen: open app → confirm Token Shop still works (no Framer in buy path).
5. Optional: coordinate announcement with `NEXT_PUBLIC_SITE_MODE=public` on app (legal gate — see master checklist).

---

## 15. Post-launch website maintenance

### Monthly (first Monday of month)

- [ ] 10 slugs match `app/token-shop/shop-items.ts`
- [ ] Framer `/protocol-{N}` titles match CTA map Section 4
- [ ] All Buy Link URLs use `https://app.freedompawsinc.com`
- [ ] Price teaser: $18 USD / 25 XRP matches `SHOP_PRICE`
- [ ] Test 3 buy deep links on iPhone
- [ ] No Framer page hosts checkout or wallet connect

### When app ships new features (update Framer copy + links)

| App feature ships | Website update |
|-------------------|----------------|
| ID enroll live | Soften “planned” → live copy; demo link → `{APP}/id/enroll` |
| IPFS vault | Tool Box deep links; remove “coming soon” where true |
| Chip scanner Track 2 | Add `{APP}/id/scan` only after live — never before |
| New protocol #11 | Add Framer `/protocol-11` + slug row in CTA map + app catalog |

### When prices change

1. Update app code first (`lib/shop/protocol-catalog.ts`).
2. Update Framer teaser text.
3. Update `Protocol-Price-Source-of-Truth.md`.
4. Publish Framer + redeploy app.

---

## 16. What the website must never do

- Process Xaman / XRP / RLUSD payment
- Host canonical Token Shop checkout
- Hardcode same Bone Button link on component master for all protocols
- Link “Click Here To View” directly to `&buy=1` URLs
- Use `protocol-1` style paths on the **app** domain (app uses **slugs** only)
- Claim live ID match, IPFS vault, or chip scan before app features ship

---

## 17. Handoff package for hired Framer help

Give your contractor these files (all in `freedompaws-app/docs/`):

| File | Why |
|------|-----|
| **This report** | Master punch list |
| `Framer-CTA-Link-Map.md` | Every URL |
| `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md` | Layout fix + §6 lexicon |
| `Protocol-Price-Source-of-Truth.md` | Prices |

**Contractor task list (minimum):**

1. Fix Phone layout on `/freedom-paws-id-toolbox` (Section 9).
2. Verify all links in Section 8.
3. Run 6-tap iPhone test.
4. Spot-check Protocol Overview card #3 ≠ card #1 link bug.
5. Publish.

**Acceptance criteria:** Phone Preview scrolls ID page top to footer with no overlap; all 6 taps open correct destinations.

---

## 18. Definition of “website complete”

The **Framer marketing website** is complete when **all** are true:

| # | Criterion |
|---|-----------|
| 1 | Homepage + nav CTAs open correct app routes |
| 2 | Protocol Overview — 10 cards with correct View + Buy links |
| 3 | All 10 protocol detail pages — buy → correct app slug |
| 4 | Framer Token Shop teaser — buy → app only |
| 5 | ID & Tool Box — Option A copy + all links + **Phone layout passes scroll test** |
| 6 | Footer / mission pages load; social links real |
| 7 | Framer **Published** after final audit |
| 8 | iPhone tests Section 10 + 14D pass |
| 9 | Monthly sync doc acknowledged for ongoing ops |

**Not required for website v1:** Rebuilding entire site in Next.js; custom Framer checkout; live chip-scanner marketing claims.

---

## 19. After website — return to app build (summary)

Website completion is **Framer-only**. The **app** (`freedompaws-app`, PWA **v73**) has separate engineering tracks. When the contractor finishes the ID page layout, **return here (Cursor)** for app completion.

### App launch gates (from master checklist)

| Track | Status | Next engineering focus |
|-------|--------|--------------------------|
| **A — ViT** | 🟡 | Prod iPhone verify; weekly admin symptom queue |
| **B — Photo Booth** | 🟡 | Phase 4 JPG assets; iPhone sign-off (props v73 shipped) |
| **C — My Pets + vault** | 🟢 | Optional per-pet protocol tracking |
| **D — Monitor relay** | 🔴 | Cloud relay — launch blocker for members |
| **E — Framer integration** | 🟡 | Deep-link smoke test after website publish |
| **F — ID Track 2** | 🟡 | HID scanner MVP `/id/scan` after hardware |
| **G — Legal + payments** | 🔴 | Terms counsel; Stripe webhook; `SITE_MODE=public` |
| **H — Marketing go-live** | 🔴 | After gates 1–7 |

### Recommended next Cursor session (app)

1. Production build verify (`npm run build`).
2. ViT prod test + symptom feedback on Vercel.
3. Photo Booth iPhone QA (T3 checklist).
4. Deploy any pending assets (Phase 4 backgrounds when founder drops JPGs).
5. Framer deep-link smoke test doc after contractor publishes website.
6. ID Track 2 `/id/scan` spike when HID scanner arrives.

**Primary engineering doc:** `Freedom-Paws-Launch-Master-Checklist-June-2026.md`  
**Founder test checklists:** `Today-Session-Founder-Checklists-June-2026.md` (T1–T5)

---

## Quick reference — URLs

| Purpose | URL |
|---------|-----|
| Marketing site | `https://freedompawsinc.com` |
| App (PWA) | `https://app.freedompawsinc.com` |
| ViT | `{APP}/diagnostics` |
| Photo Booth | `{APP}/photobooth` |
| My Pets | `{APP}/mypets` |
| Token Shop | `{APP}/token-shop` |
| ID enroll | `{APP}/id/enroll` |
| ID hub | `{APP}/id` |
| Framer protocols | `/protocol-overview` |
| ID marketing page | `/freedom-paws-id-toolbox` |

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Website post-launch completion report — May 29, 2026*
