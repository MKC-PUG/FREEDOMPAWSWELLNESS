# Framer `/adopt` Page — Click-by-Click Wiring Guide

**Date:** June 17, 2026  
**For:** Freedom Paws founder  
**Status:** Live app directory confirmed — partners visible at `https://app.freedompawsinc.com/adopt/tn`  
**Goal:** Create Framer marketing page `https://freedompawsinc.com/adopt` that tells the Adoption Network story and sends visitors to the **live app directory** (not duplicate listings in Framer).

**Related docs:** `Framer-CTA-Link-Map.md` §15 · `Freedom-Paws-Adoption-Network-TN-Pilot-Spec-May-2026.md` · `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md` §6

---

## Table of contents

1. [Routing decision (do not change)](#1-routing-decision-do-not-change)
2. [URLs to copy-paste](#2-urls-to-copy-paste)
3. [Before you start](#3-before-you-start)
4. [Part A — Create the `/adopt` page](#4-part-a--create-the-adopt-page)
5. [Part B — Page layout (recommended sections)](#5-part-b--page-layout-recommended-sections)
6. [Part C — Copy you can paste](#6-part-c--copy-you-can-paste)
7. [Part D — Wire every button (tap-by-tap)](#7-part-d--wire-every-button-tap-by-tap)
8. [Part E — Nav + cross-links](#8-part-e--nav--cross-links)
9. [Part F — Phone breakpoint checklist](#9-part-f--phone-breakpoint-checklist)
10. [Part G — Publish + iPhone test](#10-part-g--publish--iphone-test)
11. [What Framer must never do on this page](#11-what-framer-must-never-do-on-this-page)

---

## 1. Routing decision (do not change)

| Job | Where | URL |
|-----|--------|-----|
| **Live adoptable dogs** (photos, status, pending badge) | **App only** | `https://app.freedompawsinc.com/adopt/tn` |
| **Marketing story + trust** | Framer | `https://freedompawsinc.com/adopt` |
| **Partner staff tools** | App partner host | `https://shelter.freedompawsinc.com/partner` |

**Why:** Listings change when shelters publish, mark pending, or adopt out. Framer is static — same rule as Token Shop (Framer story → app checkout). One database, one truth.

**New tab on app links:** **OFF** (same convention as ViT, Photo Booth, Token Shop).

---

## 2. URLs to copy-paste

Set **`{APP}`** = `https://app.freedompawsinc.com`  
Set **`{FRAMER}`** = `https://freedompawsinc.com`

| Purpose | URL |
|---------|-----|
| **Primary CTA — Browse adoptable dogs (TN)** | `{APP}/adopt/tn` |
| Partner portal (staff sign-in) | `https://shelter.freedompawsinc.com/partner` |
| Framer shelters / mission page | `{FRAMER}/shelters` |
| Freedom Paws ID hub | `{APP}/id` |
| Member app home | `{APP}/` |

**Per-shelter deep links (optional text links on Framer — inventory still loads from app):**

| Partner | App URL |
|---------|---------|
| Memphis Animal Services | `{APP}/adopt/tn/memphis-animal-services` |
| Metro Animal Care and Control | `{APP}/adopt/tn/metro-animal-care-control` |
| Young-Williams Animal Center | `{APP}/adopt/tn/young-williams-animal-center` |
| New Leash on Life | `{APP}/adopt/tn/new-leash-on-life` |
| Humane Society of Sumner County | `{APP}/adopt/tn/humane-society-sumner-county` |
| Safe Place for Animals | `{APP}/adopt/tn/safe-place-for-animals` |

---

## 3. Before you start

Have open:

1. **framer.com** → site **Freedom Paws** / `freedompawsinc.com`
2. **iPhone Safari** (for post-publish test)
3. Live directory tab: `https://app.freedompawsinc.com/adopt/tn` (confirm partners show)

**Time:** ~25–40 minutes first build · ~5 minutes for nav cross-links only

---

## 4. Part A — Create the `/adopt` page

### A1. Add the page

1. Framer → **Pages** (left sidebar).
2. Click **+** (Add page).
3. Name: **`Adopt`** (display name can be “Adopt · Tennessee”).
4. Set slug/path: **`/adopt`**  
   - Page settings → **General** → **URL** or **Slug** → `/adopt`
5. Confirm full URL will be: `https://freedompawsinc.com/adopt`

### A2. Reuse site chrome

1. Copy **Site Nav** component from Home or `/shelters` onto the new page (top).
2. Copy **Site Footer** component onto the new page (bottom).
3. Select outer **PageBody** wrapper (between nav and footer):
   - **Stack Direction** → Vertical
   - **Height** → Fit contents
   - **Position** → Relative
   - **Overflow** → Visible

*(If stacks overlap on Phone later, see `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md`.)*

---

## 5. Part B — Page layout (recommended sections)

Build top → bottom on **Desktop**, then fix **Phone** breakpoint.

```
Page: /adopt
├── [Component] Site Nav
├── Stack: PageBody (Vertical, Fit contents)
│   ├── Section-Hero
│   ├── Section-WhatIsAdoptionNetwork
│   ├── Section-HowItWorks (3 steps)
│   ├── Section-PilotPartners (6 cards — static names, link to app)
│   ├── Section-PrimaryCTA (big button)
│   ├── Section-IDOptional (Freedom Paws ID — soft mention)
│   └── Section-PartnerCTA (for shelters)
└── [Component] Site Footer
```

**Design notes:**

- Match Freedom Paws dark navy + emerald accent (partner portal uses emerald; consumer uses gold — either is fine on marketing).
- Use **one primary green/emerald button** above the fold and **repeat** near bottom.
- Partner cards: **name + city + type badge** (Municipal / Private) — no per-dog photos on Framer.

---

## 6. Part C — Copy you can paste

### Hero (H1 + subhead)

**Eyebrow (small caps):**  
`Freedom Paws Adoption Network`

**Headline:**  
`Find your next dog in Tennessee`

**Subhead:**  
`Live adoptable dogs from municipal shelters and private rescues in our Tennessee pilot — Memphis, Nashville, Knoxville, and the Lebanon corridor. Updated when partners publish.`

### What is the Adoption Network? (short paragraph)

`Freedom Paws Adoption Network connects Tennessee shelters and rescues to one trusted directory. Families browse adoptable dogs on our app; partners manage listings and optional Freedom Paws ID reunion tools from a dedicated partner portal. We list dogs — adoptions happen directly with each shelter.`

### How it works (3 steps)

| Step | Title | Body |
|------|-------|------|
| 1 | Browse | `See adoptable dogs on our live Tennessee directory — photos, bio, and shelter contact.` |
| 2 | Connect | `Contact the shelter on each dog’s profile to start adoption.` |
| 3 | Optional ID | `After adoption, new owners can enroll in Freedom Paws ID for biometric lost-dog matching (optional).` |

### Pilot partners (section intro)

`Tennessee pilot partners — municipal and private`

### Primary CTA button label

`Browse adoptable dogs in Tennessee →`

### Secondary CTA (shelters)

`Shelter & rescue partners →`  
*(links to `/shelters` or partner portal — see Part D)*

### Footer disclaimer (small text)

`Freedom Paws lists adoptable dogs on behalf of pilot partners. We do not process adoptions or fees. “Pending adoption” means a family is in process with the shelter.`

---

## 7. Part D — Wire every button (tap-by-tap)

### D1. Hero primary button — **most important**

1. Click the hero button on canvas.
2. Right panel → **Link** (or **On Tap** → **Link**).
3. Type: **URL**
4. Paste: `https://app.freedompawsinc.com/adopt/tn`
5. **Open in new tab** → **OFF**

### D2. Bottom primary button (duplicate)

1. Select the lower **Browse adoptable dogs** button.
2. Same URL: `https://app.freedompawsinc.com/adopt/tn`
3. **New tab: OFF**

### D3. Each pilot partner card (optional but recommended)

For each of the 6 partner cards, wire the **card** or **“View dogs →”** text:

| Card label | Link URL |
|------------|----------|
| Memphis Animal Services | `https://app.freedompawsinc.com/adopt/tn/memphis-animal-services` |
| Metro Animal Care and Control | `https://app.freedompawsinc.com/adopt/tn/metro-animal-care-control` |
| Young-Williams Animal Center | `https://app.freedompawsinc.com/adopt/tn/young-williams-animal-center` |
| New Leash on Life | `https://app.freedompawsinc.com/adopt/tn/new-leash-on-life` |
| Humane Society of Sumner County | `https://app.freedompawsinc.com/adopt/tn/humane-society-sumner-county` |
| Safe Place for Animals | `https://app.freedompawsinc.com/adopt/tn/safe-place-for-animals` |

**New tab: OFF** for all.

### D4. “Shelter & rescue partners” secondary button

**Option A (marketing first):**  
`https://freedompawsinc.com/shelters`

**Option B (staff sign-in):**  
`https://shelter.freedompawsinc.com/partner`

Use A for public families; add a small text link “Partner sign-in” → Option B if you want both.

### D5. Freedom Paws ID mention (optional link)

1. Select “Learn about Freedom Paws ID” text or button.
2. URL: `https://app.freedompawsinc.com/id`
3. **New tab: OFF**

---

## 8. Part E — Nav + cross-links

Wire these **on other Framer pages** so traffic finds `/adopt`:

### E1. Site nav (global component)

1. Open **Site Nav** component (edit component, not single page).
2. Add menu item: **`Adopt`**
3. Link → **Page** → `/adopt`  
   *(Internal Framer page — stays on marketing site for story; hero CTA still goes to app.)*

### E2. Homepage

1. **Pages** → **Home**.
2. If you have a “Shelters” or “Community” section, add button:
   - Label: `Adopt in Tennessee`
   - Link: **Page** → `/adopt` *(marketing page)*  
   OR direct to app: `https://app.freedompawsinc.com/adopt/tn` *(skip story — faster)*

**Recommended:** Home button → Framer `/adopt` (story) · Hero on `/adopt` → app directory.

### E3. `/shelters` page

1. Open **Shelters** page.
2. Add prominent button:
   - Label: `Browse TN adoptable dogs`
   - URL: `https://app.freedompawsinc.com/adopt/tn`
   - **New tab: OFF**

### E4. Site footer (global)

Add link:

| Label | URL |
|-------|-----|
| Adopt (Tennessee) | `https://freedompawsinc.com/adopt` |

---

## 9. Part F — Phone breakpoint checklist

1. Top bar → **Phone** icon active.
2. **PageBody:** Vertical · Fit contents · Overflow Visible.
3. Hero headline: no truncation — reduce font size on Phone if needed.
4. Primary button: min tap height **48px** (Apple HIG).
5. Partner cards: **one column** on Phone (stack vertically).
6. Scroll test: Privacy/disclaimer at bottom fully visible — not clipped.

---

## 10. Part G — Publish + iPhone test

### G1. Publish Framer

1. Top right → **Publish** (or **Update**).
2. Wait until publish completes.

### G2. iPhone test script (5 taps)

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Safari → `freedompawsinc.com/adopt` | Marketing page loads |
| 2 | Tap **Browse adoptable dogs in Tennessee** | Opens `app.freedompawsinc.com/adopt/tn` — **6 partners** visible |
| 3 | Back → tap one **partner card** (if wired) | Opens that shelter’s app page |
| 4 | From app directory, tap a dog (when listings exist) | Dog detail + shelter contact |
| 5 | Nav → **Adopt** from homepage | Lands on Framer `/adopt` |

### G3. Pass criteria

- [ ] No Framer page tries to show live dog inventory
- [ ] All app links use `app.freedompawsinc.com` (not vercel.app)
- [ ] New tab **OFF** on app CTAs
- [ ] Phone: no overlapping sections; CTA reachable without horizontal scroll

---

## 11. What Framer must never do on this page

| Do not | Do instead |
|--------|------------|
| Build CMS collections for each adoptable dog | Link to `{APP}/adopt/tn` |
| Embed iframe of app directory | Direct URL link (better SEO + auth cookies) |
| Host adoption checkout or fees | Shelter handles adoption |
| Use `freedompawsinc.com/adopt/tn` as Framer slug for inventory | TN inventory is **app-only** at `{APP}/adopt/tn` |
| Open app in new tab by default | Same-tab handoff (member convention) |

---

## Quick reference card (print / pin)

```
Framer story:     https://freedompawsinc.com/adopt
Live directory:   https://app.freedompawsinc.com/adopt/tn
Partner portal:   https://shelter.freedompawsinc.com/partner
Primary CTA:      Browse adoptable dogs → {APP}/adopt/tn
New tab:          OFF
```

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Adoption Network Framer wiring — June 17, 2026*
