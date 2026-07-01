# Framer **Member Tools** Page — Full Wireframe + Click-by-Click Build Guide

**Date:** June 28, 2026 (updated June 30, 2026 — visual polish + post-build QA)  
**For:** Freedom Paws founder — complete in **one sitting (~60–90 min)**  
**Goal:** Central marketing hub for all live app tools. Framer = **showroom**; app = **workshop** (no embedded tools).  
**Replaces:** Nav label **ID & Tool Box** → **Member Tools** · page slug **`/member-tools`** (redirect old `/freedom-paws-id-toolbox`)

**Related:** `Framer-CTA-Link-Map.md` · `Framer-Adopt-Page-Wiring-Guide-June-2026.md` · `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md`

---

## Table of contents

1. [Routing decision](#1-routing-decision-do-not-change)
2. [URLs — copy-paste block](#2-urls--copy-paste-block)
3. [Before you start](#3-before-you-start)
4. [Part A — Create `/member-tools` page](#part-a--create-member-tools-page)
5. [Part B — Page wireframe (sections top → bottom)](#part-b--page-wireframe-sections-top--bottom)
6. [Part C — Full copy (paste into Framer)](#part-c--full-copy-paste-into-framer)
7. [Part D — Wire every button (click-by-click)](#part-d--wire-every-button-click-by-click)
8. [Part E — Rename nav site-wide](#part-e--rename-nav-site-wide)
9. [Part F — Redirect old URL](#part-f--redirect-old-url)
10. [Part G — Homepage + cross-links](#part-g--homepage--cross-links)
11. [Part H — Phone breakpoint](#part-h--phone-breakpoint)
12. [Part I — Publish + iPhone test](#part-i--publish--iphone-test)
13. [Part J — Monthly sync](#part-j--monthly-sync)
14. [What Framer must never do](#14-what-framer-must-never-do-on-this-page)
15. [Part K — Visual polish: buttons, pills, protocols card](#part-k--visual-polish-buttons-pills-protocols-card)
16. [Part L — Post-build QA sign-off (screenshot-keyed)](#part-l--post-build-qa-sign-off-screenshot-keyed)

---

## 1. Routing decision (do not change)

| Job | Where | URL |
|-----|--------|-----|
| **Use tools** (ViT, Photo Booth, My Pets, ID, shop) | **App only** | `https://app.freedompawsinc.com/...` |
| **Explain tools + trust + mission** | **Framer** | `https://freedompawsinc.com/member-tools` |
| **Protocol stories** | Framer | `/protocol-overview`, `/protocol-1` … |
| **Shelter staff portal** | App partner host | `https://shelter.freedompawsinc.com/partner` |
| **Vet CDS (B2B)** | App | `https://app.freedompawsinc.com/vit-pro` (not on this page) |

**New tab on every app link:** **OFF**.

**Do not embed** the app in iframes or “live windows” on Framer.

---

## 2. URLs — copy-paste block

```
{APP}   = https://app.freedompawsinc.com
{FRAMER} = https://freedompawsinc.com
```

| Tool | Button goes to |
|------|----------------|
| App home | `https://app.freedompawsinc.com/` |
| ViT Diagnostics | `https://app.freedompawsinc.com/diagnostics` |
| Photo Booth | `https://app.freedompawsinc.com/photobooth` |
| My Pets | `https://app.freedompawsinc.com/mypets` |
| Freedom Paws ID hub | `https://app.freedompawsinc.com/id` |
| ID enroll | `https://app.freedompawsinc.com/id/enroll` |
| ID scan (chip) | `https://app.freedompawsinc.com/id/scan` |
| Token Shop | `https://app.freedompawsinc.com/token-shop` |
| Monitor (optional card) | `https://app.freedompawsinc.com/monitor` |
| Protocol overview (Framer) | `https://freedompawsinc.com/protocol-overview` |
| Adopt TN (app directory) | `https://app.freedompawsinc.com/adopt/tn` |
| Shelter partners (footer only) | `https://shelter.freedompawsinc.com/partner` |

---

## 3. Before you start

**Open these tabs:**

1. [framer.com](https://framer.com) → project **Freedom Paws**
2. iPhone Safari (for final test)
3. `https://app.freedompawsinc.com/` (confirm app loads)
4. This doc

**Time budget:** 60–90 minutes first build · 15 min if you **convert** existing `/freedom-paws-id-toolbox` instead of starting blank

**Style reference:** Duplicate card layout from **`/protocol-overview`** (same bone button + title + short blurb).

---

## Part A — Create `/member-tools` page

### A1. Choose build path

| Path | When to use |
|------|-------------|
| **Path 1 — Convert existing page** | You already have `/freedom-paws-id-toolbox` with nav/footer — **fastest** |
| **Path 2 — New page from scratch** | Old page is messy or you want a clean layout |

---

### A2. Path 1 — Convert existing page (recommended)

1. Framer left sidebar → **Pages**.
2. Click **`/freedom-paws-id-toolbox`** (or **ID & Tool Box**).
3. Click page name → **Page settings** (gear) or right panel **General**.
4. **Name:** `Member Tools`
5. **Slug / URL:** change to **`/member-tools`**
6. Confirm preview URL: `https://freedompawsinc.com/member-tools`
7. **Save** — skip to **Part B** and replace section content.

---

### A3. Path 2 — New page from scratch

1. **Pages** → **+** (Add page).
2. **Name:** `Member Tools`
3. **Slug:** `/member-tools`
4. Full URL: `https://freedompawsinc.com/member-tools`
5. Open **Home** page → select **Site Nav** component → **Copy** (⌘C).
6. On **Member Tools** page → **Paste** (⌘V) at top.
7. Copy **Site Footer** from Home → paste at bottom.
8. Between nav and footer, insert **Stack**:
   - Click **+** → **Stack**
   - Name layer: `PageBody`
   - **Direction:** Vertical
   - **Width:** Fill (100%)
   - **Height:** Fit content
   - **Gap:** 48px (Desktop) · 32px (Phone later)
   - **Padding:** 48px horizontal · 32px vertical (Desktop)

---

## Part B — Page wireframe (sections top → bottom)

Build **inside `PageBody`** in this order:

```
Page: /member-tools
├── [Component] Site Nav          ← rename link in Part E
├── Stack: PageBody
│   ├── Section 1 — Hero
│   ├── Section 2 — How it works (3 steps)
│   ├── Section 3 — Member Tools grid (5 cards)
│   ├── Section 4 — Try ViT now (demo band)
│   ├── Section 5 — Freedom Paws ID (honest pilot copy)
│   ├── Section 6 — Token Shop + Protocols cross-sell
│   ├── Section 7 — Desktop & mobile note
│   ├── Section 8 — Privacy + disclaimer
│   └── Section 9 — Bottom dual CTA
└── [Component] Site Footer
```

---

### B1. Section 1 — Hero

**Framer steps:**

1. Inside `PageBody` → **+** → **Stack** → name `Section-Hero`
2. **Align:** Center · **Gap:** 16px · **Max width:** 720px · **Center on page:** Yes
3. Add **Text** layers + **2 buttons** (duplicate styling from Home hero yellow button)

**Layers (top → bottom):**

| Layer type | Layer name |
|------------|------------|
| Text (small caps) | `Hero-Eyebrow` |
| Text (H1) | `Hero-Headline` |
| Text (body) | `Hero-Subhead` |
| Stack horizontal | `Hero-Buttons` |
| → Button | `Btn-Primary-ViT` |
| → Button | `Btn-Secondary-PhotoBooth` |

---

### B2. Section 2 — How it works

1. **+** → **Stack** → `Section-HowItWorks`
2. Add H2: `How Member Tools work`
3. **+** → **Stack** → Direction **Horizontal** on Desktop · **Vertical** on Phone
4. Add **3 columns** (duplicate protocol step cards or simple stacks):

| Column | Icon (emoji in text) | Title | Body |
|--------|----------------------|-------|------|
| 1 | 📖 | Learn here | Read what each tool does on this marketing site. |
| 2 | 🔗 | Open in the app | Tap a button — you go to the Freedom Paws app. No account on this site. |
| 3 | 🐾 | Work on any device | Phone, tablet, or home computer — same app in your browser. |

---

### B3. Section 3 — Member Tools grid (main section)

**Match `/protocol-overview` card grid.**

1. **+** → **Stack** → `Section-ToolsGrid`
2. H2: `Member Tools — open in the app`
3. Subline (text): see Part C
4. **Grid** or **Stack** with wrap:
   - Desktop: **2 columns** (or 3 if cards are narrow)
   - Phone: **1 column**
5. Create **5 card components** (duplicate one master card 5×):

| Card # | Card title | Primary button label |
|--------|------------|----------------------|
| 1 | ViT Diagnostics | Open ViT Diagnostics → |
| 2 | SuperBud Photo Booth | Open Photo Booth → |
| 3 | My Pets | Open My Pets → |
| 4 | Freedom Paws ID | Open ID Hub → |
| 5 | Token Shop | Open Token Shop → |

**Optional card 6:** Monitor My Dog → `Open Monitor →`

**Per card structure (duplicate Protocol card):**

```
Card-Tool-ViT (Frame or Stack)
├── Image or emoji placeholder (📸)
├── Title (H3)
├── Body (2 lines max)
└── Button (yellow / bone style)
```

---

### B4. Section 4 — Try ViT now (demo band)

1. **+** → **Stack** → `Section-LiveDemo`
2. Background: subtle green tint (match site) or bordered frame
3. H2 + subline + one green/primary button

---

### B5. Section 5 — Freedom Paws ID block

1. **+** → **Stack** → `Section-IDPilot`
2. Two-column on Desktop (copy left · buttons right) or stacked on Phone
3. Two buttons: **Open ID Hub** · **Enroll in the app**

---

### B6. Section 6 — Protocols cross-sell

1. **+** → **Stack** → `Section-Protocols`
2. Short paragraph + button to Framer `/protocol-overview`

---

### B7. Section 7 — Desktop note

1. Single **Text** block — reassures desktop users (copy in Part C)

---

### B8. Section 8 — Privacy + disclaimer

1. Small text block — compliance (copy in Part C)

---

### B9. Section 9 — Bottom dual CTA

1. **Stack horizontal** (vertical on Phone):
   - **Open the Freedom Paws app** → `{APP}/`
   - **Browse all protocols** → `{FRAMER}/protocol-overview`

---

## Part C — Full copy (paste into Framer)

### Section 1 — Hero

**Eyebrow (`Hero-Eyebrow`):**
```
FREEDOM PAWS MEMBER TOOLS
```

**Headline (`Hero-Headline`):**
```
Your pet wellness workshop — in the Freedom Paws app
```

**Subhead (`Hero-Subhead`):**
```
ViT Diagnostics, Photo Booth, My Pets, and Freedom Paws ID all run in our secure app — on your phone or home computer. This page shows you what’s available; tap any button to open the real tool. No wallets or pet photos are stored on this marketing site.
```

**Primary button (`Btn-Primary-ViT`):**
```
Try ViT AI free →
```

**Secondary button (`Btn-Secondary-PhotoBooth`):**
```
Open Photo Booth →
```

---

### Section 2 — How it works

**H2:**
```
How Member Tools work
```

*(Use column copy from table in B2.)*

---

### Section 3 — Tools grid

**H2:**
```
Member Tools — open in the app
```

**Subline:**
```
Everything below opens app.freedompawsinc.com in the same tab. Install the app to your home screen for the fastest experience on iPhone and Android.
```

---

#### Card 1 — ViT Diagnostics

**Title:**
```
ViT Diagnostics
```

**Body:**
```
Upload a photo and symptoms for holistic wellness guidance and protocol recommendations. Free to try during our founding pilot.
```

**Button:**
```
Open ViT Diagnostics →
```

---

#### Card 2 — SuperBud Photo Booth

**Title:**
```
SuperBud Photo Booth
```

**Body:**
```
Dress up your pet with themes and optional AI styling — then save, share, or send to print partners for mugs, pillows, and gifts. Honor Buddy’s legacy with every share.
```

**Button:**
```
Open Photo Booth →
```

---

#### Card 3 — My Pets

**Title:**
```
My Pets
```

**Body:**
```
Your pet profiles, wellness notes, ViT history, and unlocked protocols in one place. Add pets here before ID enroll or shelter reunion workflows.
```

**Button:**
```
Open My Pets →
```

---

#### Card 4 — Freedom Paws ID

**Title:**
```
Freedom Paws ID
```

**Body:**
```
Biometric pet identity for our Tennessee pilot — enroll eyes, face, and gait; link a microchip when scanned. Found-dog matching uses human review. Full national rollout is phased.
```

**Button:**
```
Open ID Hub →
```

**Secondary text link (optional under button):**
```
Enroll a pet →
```
*(links to `{APP}/id/enroll`)*

---

#### Card 5 — Token Shop

**Title:**
```
Token Shop
```

**Body:**
```
Lifetime access to holistic wellness protocols on XRPL — supports our 10% give-back to shelters and veteran dog programs.
```

**Button:**
```
Open Token Shop →
```

---

#### Optional Card 6 — Monitor

**Title:**
```
Monitor My Dog
```

**Body:**
```
Room camera live view while you’re away — Wyze and off-the-shelf setup. Preview feature; availability may vary by launch phase.
```

**Button:**
```
Open Monitor →
```

---

### Section 4 — Live demo band

**H2:**
```
Try ViT AI now — live in the app
```

**Subline:**
```
This is our honest “live demo.” Upload a dog photo in ViT Diagnostics to see how vision AI supports wellness guidance. This is not lost-dog ID matching yet.
```

**Button:**
```
Upload a photo in ViT →
```

---

### Section 5 — ID pilot block

**H2:**
```
Freedom Paws ID — Tennessee pilot
```

**Body:**
```
We’re rolling out biometric enroll and shelter found intake in phases. Chip scan and registry lookup link to industry tools (AAHA); Freedom Paws adds match and reunion support with explicit owner consent.

Planned: encrypted vault sync and owner alerts on confirmed match. Available today: enroll wizard, chip link, and shelter intake in participating pilot partners.
```

**Button 1:**
```
Open ID Hub →
```

**Button 2 (outline):**
```
Enroll in the app →
```

---

### Section 6 — Protocols

**H2:**
```
Holistic protocols — learn here, unlock in the app
```

**Body:**
```
Browse all 10 Freedom Paws protocols on our Protocol Overview page. Story and education stay on this website; payment and lifetime access happen in the Token Shop app.
```

**Button:**
```
View Protocol Overview →
```
*(Framer page `/protocol-overview`)*

---

### Section 7 — Desktop note

**Text:**
```
💻 On a home computer? Open any button above in Chrome, Safari, or Edge — the same Freedom Paws app works in your browser. No separate desktop download required. For the best mobile experience, add the app to your home screen from app.freedompawsinc.com.
```

---

### Section 8 — Privacy + disclaimer

**Text (small):**
```
Freedom Paws Member Tools are wellness guidance and reunion support — not veterinary advice, not a government pet license, and not emergency services. Biometric ID enrollment requires explicit consent in the app. Accounts, payments (Xaman / XRPL), and pet media are processed only on app.freedompawsinc.com. Shelter staff: use shelter.freedompawsinc.com/partner — not this page.
```

---

### Section 9 — Bottom CTAs

**Button 1:**
```
Open the Freedom Paws app →
```

**Button 2:**
```
Browse all protocols →
```

---

## Part D — Wire every button (click-by-click)

**For EVERY button below:**  
Select button → right panel **Link** → **URL** → paste URL → **Open in new tab: OFF** (unchecked).

### D1. Hero

| Select this button | Paste this URL |
|--------------------|----------------|
| Try ViT AI free → | `https://app.freedompawsinc.com/diagnostics` |
| Open Photo Booth → | `https://app.freedompawsinc.com/photobooth` |

### D2. Tools grid — five cards

| Button label | URL |
|--------------|-----|
| Open ViT Diagnostics → | `https://app.freedompawsinc.com/diagnostics` |
| Open Photo Booth → | `https://app.freedompawsinc.com/photobooth` |
| Open My Pets → | `https://app.freedompawsinc.com/mypets` |
| Open ID Hub → | `https://app.freedompawsinc.com/id` |
| Open Token Shop → | `https://app.freedompawsinc.com/token-shop` |
| Open Monitor → *(if used)* | `https://app.freedompawsinc.com/monitor` |

**Optional text link “Enroll a pet →”** on ID card:  
`https://app.freedompawsinc.com/id/enroll`

### D3. Live demo band

| Button | URL |
|--------|-----|
| Upload a photo in ViT → | `https://app.freedompawsinc.com/diagnostics` |

### D4. ID pilot block

| Button | URL |
|--------|-----|
| Open ID Hub → | `https://app.freedompawsinc.com/id` |
| Enroll in the app → | `https://app.freedompawsinc.com/id/enroll` |

### D5. Protocols section

| Button | Link type | Destination |
|--------|-----------|-------------|
| View Protocol Overview → | **Page** (Framer) | `/protocol-overview` |

### D6. Bottom CTAs

| Button | URL |
|--------|-----|
| Open the Freedom Paws app → | `https://app.freedompawsinc.com/` |
| Browse all protocols → | **Page** `/protocol-overview` |

### D7. Footer (site-wide — verify while here)

Use same footer as other pages. Partner link **only in footer**, not in hero:

| Footer link label | URL |
|-------------------|-----|
| Shelter partner sign-in | `https://shelter.freedompawsinc.com/partner` |

---

## Part E — Rename nav site-wide

**Do this on the shared Site Nav component** (updates all pages at once).

1. **Assets** or **Pages** → open **Site Nav** component (or select nav on Home).
2. Find nav item **ID & Tool Box** (or similar).
3. Double-click label text → change to:
   ```
   Member Tools
   ```
4. Select the nav row/link → **Link** → **Page** → **`/member-tools`**  
   - **Not** the app URL — this page stays on Framer.
5. **Save component** / apply to all instances.

### E2. Update other nav items (verify — do not skip)

| Nav label | Link type | Destination |
|-----------|-----------|-------------|
| About / Buddy's Story | Framer page | your story page |
| Protocols Overview | Framer page | `/protocol-overview` |
| Community Impact | Framer page | your impact page |
| **Member Tools** | Framer page | **`/member-tools`** |
| Token Shop | URL | `https://app.freedompawsinc.com/token-shop` |
| Connect Wallet (top right) | URL | `https://app.freedompawsinc.com/token-shop` |

### E3. Optional — add Member Tools to Home hero

On **Home** page, below existing hero CTAs:

1. Duplicate secondary button.
2. Label: `Explore Member Tools →`
3. Link → **Page** → `/member-tools`

---

## Part F — Redirect old URL

If `/freedom-paws-id-toolbox` was bookmarked or linked externally:

### Option 1 — Framer redirect (preferred)

1. Keep old page OR create minimal page at `/freedom-paws-id-toolbox`.
2. Delete body content — leave only nav + footer OR a single line:
   ```
   This page moved to Member Tools.
   ```
3. Add button **Go to Member Tools →** → Link **Page** `/member-tools`
4. **Page settings** → **Redirects** (if your Framer plan supports) → redirect `/freedom-paws-id-toolbox` → `/member-tools`

### Option 2 — Stub page only

Leave old slug as duplicate with canonical note in page SEO settings pointing to `/member-tools` if available.

---

## Part G — Homepage + cross-links

Add **one line + link** on these Framer pages (optional, 5 min each):

| Page | Add |
|------|-----|
| `/protocol-overview` | Text link: `New to the app? See all Member Tools →` → `/member-tools` |
| `/adopt` | After primary CTA: `Member Tools in the app →` → `/member-tools` |
| `/shelters` | `Pet parents: Member Tools →` → `/member-tools` |

**Homepage hero (recommended):**

| Button | URL |
|--------|-----|
| Try ViT AI free | `https://app.freedompawsinc.com/diagnostics` |
| Explore Member Tools | Framer `/member-tools` |

---

## Part H — Phone breakpoint

1. Framer top bar → breakpoint **Phone** (or width &lt; 810px).
2. Select `PageBody` → **Gap** 32px · **Padding** 20px horizontal.
3. `Section-ToolsGrid` → **1 column** stack.
4. `Hero-Buttons` → **Vertical** stack, buttons **Fill** width.
5. `Section-HowItWorks` columns → **Vertical**.
6. No fixed heights on stacks — **Fit content** only.
7. Test scroll: no overlapping nav (see `Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md`).

---

## Part I — Publish + iPhone test

### I1. Publish

1. Framer top right → **Publish** (or **Update**).
2. Wait until complete.

### I2. iPhone test checklist

| # | Action | Must result | Pass |
|---|--------|-------------|:----:|
| 1 | `freedompawsinc.com` → nav **Member Tools** | Opens `/member-tools` on Framer | ☐ |
| 2 | Tap **Try ViT AI free** | `app…/diagnostics` same tab | ☐ |
| 3 | Tap **Open Photo Booth** (hero or card) | `app…/photobooth` | ☐ |
| 4 | Tap **Open My Pets** | `app…/mypets` | ☐ |
| 5 | Tap **Open ID Hub** | `app…/id` | ☐ |
| 6 | Tap **Enroll in the app** | `app…/id/enroll` | ☐ |
| 7 | Tap **Open Token Shop** | `app…/token-shop` | ☐ |
| 8 | Tap **View Protocol Overview** | Stays on Framer `/protocol-overview` | ☐ |
| 9 | Tap **Open the Freedom Paws app** | `app…/` | ☐ |
| 10 | Old URL `/freedom-paws-id-toolbox` | Redirects or stub → Member Tools | ☐ |

---

## Part J — Monthly sync

- [ ] All `{APP}` links still use `https://app.freedompawsinc.com` (not old Vercel URL)
- [ ] New live tools (e.g. scanner kit retail) → add card or update copy — **link to app only**
- [ ] ID pilot copy matches what’s actually live (enroll, chip, found intake)
- [ ] Do not claim “real-time reunion” or “IPFS vault live” until shipped
- [ ] Re-run iPhone test rows 2–7 after any Framer publish

---

## 14. What Framer must never do on this page

- Embed `app.freedompawsinc.com` in an iframe
- Process Xaman / wallet payment on Framer
- Store pet photos or account login on Framer
- Promise AAHA embedded registry (link out in app only)
- Put VitProScan vet CDS on this consumer page (use `vitproscan.com` later)
- Use “diagnosis” language — wellness guidance only

---

## Part K — Visual polish: buttons, pills, protocols card

*Apply after first build pass — ~20–30 min. Matches live `/member-tools` layout (June 30, 2026).*

### K1. Unified button colors — why and how

**Problem on first build:** Yellow (hero + grid), green (ViT demo + ID band), and red (protocols + footer) all compete as “primary.” Users cannot tell which action is most important; the page feels like three different brands stacked.

**Rule — two button tiers only:**

| Tier | When to use | Framer styling | Examples on this page |
|------|-------------|----------------|------------------------|
| **Primary — App** | Any link that opens `app.freedompawsinc.com` | **Yellow fill** `#F5C242` (match Connect Wallet) · black text · rounded · arrow `→` | Hero ViT + Photo Booth · all 6 grid buttons · ViT demo · ID Hub + Enroll · footer **Open the Freedom Paws app** |
| **Secondary — Framer** | Stays on marketing site | **Outline** white border · transparent fill · white text **OR** subtle dark fill | Hero could use outline for Photo Booth if ViT stays sole yellow · footer **Browse all protocols** |
| **Tertiary — Story** | Optional accent for one Framer CTA only | **Red/coral** `#E11D48` — use **once** on the page | **View Protocol Overview →** in protocols band only |

**Retire green demo buttons** unless you use green site-wide (you do not). Change:

- ViT band: green **Try Live AI Demo** → yellow **Upload a photo in ViT →**
- ID band: both green **Try Live AI Demo** → yellow **Open ID Hub →** + outline **Enroll in the app →**

**Framer click-by-click (each off-brand button):**

1. Select button layer.
2. **Style** → duplicate from an existing yellow grid button (fastest) or set Fill `#F5C242`, Text `#0A1625`, Radius match hero.
3. Update **label** and **Link → URL** (Part D).
4. For outline secondary: Fill **transparent**, Border **1px white** 60% opacity.

**Do not** use red for app links — red reads “warning” or “sale only”; yellow = Freedom Paws action.

---

### K2. Status pills — why and how

**Problem:** All six grid cards look equally “finished.” ID and Monitor are pilot/preview; Token Shop is commerce. Pills set expectations before the user taps.

**Placement:** Top-right of each card image (or top-left of card title row), small pill above or overlapping image corner.

**Framer steps (create once, reuse):**

1. **+** → **Frame** → name `Pill-Live` · Auto layout horizontal · Padding 6px 10px · Radius 999px.
2. Fill colors below · Text 10–11px bold uppercase or small caps.
3. **Duplicate** → rename `Pill-Pilot`, `Pill-Shop`, `Pill-Preview`.
4. Drop one instance on each grid card.

| Card | Pill label | Background | Text |
|------|------------|------------|------|
| ViT Diagnostics | **LIVE** | `#2D6A4F` (green) | white |
| SuperBud Photo Booth | **LIVE** | `#2D6A4F` | white |
| My Pets | **LIVE** | `#2D6A4F` | white |
| Freedom Paws ID | **PILOT** | `#B8860B` (gold) | `#0A1625` |
| Token Shop | **SHOP** | `#F5C242` | `#0A1625` |
| Monitor My Dog | **PREVIEW** | `#4B5563` (gray) | white |

**Copy rule:** PILOT and PREVIEW pills must match body copy (Tennessee pilot · availability may vary).

**Optional:** Remove emoji icons under card images once pills are live — pills + unique art are enough.

---

### K3. Protocols band styling — why and how

**Problem:** Full-width **white** card breaks the dark navy/black page rhythm; it looks like a different site dropped in mid-scroll.

**Recommended — Option A (match page, preferred):**

Convert protocols section to a **dark card** consistent with “How it works” tiles:

| Property | Value |
|----------|--------|
| Background | `#1A2233` or same navy as tool cards |
| Border | 1px `#F5C242` at 40% opacity (gold rim = “marketing story”) |
| Radius | 16–24px |
| Layout | Desktop: text left 55% · image right 45% · Phone: stack image under headline |
| Headline | White |
| Body | `#B0B8C4` |
| Button | **Red/coral tertiary** **View Protocol Overview →** → Framer `/protocol-overview` |
| Image | Keep SuperBud cape pug — strong; add 8px radius |

**Framer steps:**

1. Select white section wrapper → **Fill** → dark navy.
2. Select all text → headline white, body gray.
3. **Border** → 1px gold at low opacity.
4. Button → keep red **only here** (Framer destination, not app).
5. Phone breakpoint → stack vertical, image full width.

**Option B (keep white):** If you prefer contrast, add **gold border 2px** + **dark page padding** so the white block feels intentional (editorial callout), not accidental. Add small eyebrow above H2: `LEARN ON THIS SITE`.

**Do not** put **Open Token Shop** on this band — story here, pay in app via grid card or nav.

---

### K4. Bottom CTA band — copy fix

Replace subhead **“Protect Your Dog Today”** (protocol leftover) with:

```
Everything opens in the Freedom Paws app — same tab, no download required.
```

Both buttons: yellow **Open the Freedom Paws app →** · outline **Browse all protocols →**.

---

## Part L — Post-build QA sign-off (screenshot-keyed)

**Status:** ✅ **SIGNED OFF — LAUNCH READY**  
**Page:** `https://freedompawsinc.com/member-tools`  
**Sign-off date:** **June 30, 2026**  
**Tester:** Founder QA (Framer `main` published · branch `debug-button-text` merged)  
**Device:** iPhone Safari + Desktop Chrome  
**Reference:** June 30, 2026 Framer build (hero → grid → mid-page → footer)

**How to use:** Work top → bottom. Each block maps to a section on your published page. Check **Pass** only when visual + link + copy all match.

*All blocks A–K passed June 30, 2026 — pills (LIVE/PILOT/SHOP/PREVIEW), ViT spelling, unified yellow app CTAs, ID band fix, dark protocols card.*

---

### Block A — Site nav (top of page)

*Maps to: nav bar in full-page screenshot — Member Tools highlighted*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| A1 | **Member Tools** nav item visible | Label reads **Member Tools** (not ID & Tool Box) | ✅ |
| A2 | Member Tools nav link | Stays on Framer `/member-tools` | ✅ |
| A3 | Token Shop nav | `https://app.freedompawsinc.com/token-shop` · new tab OFF | ✅ |
| A4 | Connect Wallet | `https://app.freedompawsinc.com/token-shop` · new tab OFF | ✅ |
| A5 | Adopt nav (if present) | Framer `/adopt` or app directory per your site map | ✅ |

---

### Block B — Hero (`FREEDOM PAWS MEMBER TOOLS`)

*Maps to: hero headline + two buttons below nav*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| B1 | Eyebrow | `FREEDOM PAWS MEMBER TOOLS` | ✅ |
| B2 | Headline | Mentions app / workshop (not “store”) | ✅ |
| B3 | Body copy | States tools run in app; no wallets/photos on marketing site | ✅ |
| B4 | Spelling | **ViT** not VIT anywhere in hero | ✅ |
| B5 | Primary button label | **Try ViT AI free →** | ✅ |
| B6 | Primary button URL | `https://app.freedompawsinc.com/diagnostics` | ✅ |
| B7 | Secondary button label | **Open Photo Booth →** | ✅ |
| B8 | Secondary button URL | `https://app.freedompawsinc.com/photobooth` | ✅ |
| B9 | Button colors | Yellow primary (or yellow + outline secondary) — no green | ✅ |

---

### Block C — How Member Tools work (3 tiles)

*Maps to: three dark cards — Learn here · Open in the app · Work on any device*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| C1 | Three columns desktop / stack phone | No overlap at Phone breakpoint | ✅ |
| C2 | Middle tile copy | Explains tap → opens **app** (not embedded on Framer) | ✅ |
| C3 | No buttons required | Informational only — OK if no links | ✅ |

---

### Block D — Tools grid (`Member Tools — open in the app`)

*Maps to: 3×2 grid — ViT, Photo Booth, My Pets, ID, Token Shop, Monitor*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| D1 | Subline under H2 | Says **same tab** (not new tab) | ✅ |
| D2 | **ViT Diagnostics** title spelling | ViT not VIT | ✅ |
| D3 | ViT image | Unique (diagnostic overlay pug) — not duplicated on all cards | ✅ |
| D4 | Photo Booth image | Unique (e.g. halo / theme art) | ✅ |
| D5 | My Pets image | Unique (e.g. SuperBud cape group) | ✅ |
| D6 | ID image | Unique (e.g. Found / reunion art) | ✅ |
| D7 | Token Shop image | Unique (e.g. desk / shop art) | ✅ |
| D8 | Monitor image | Unique (e.g. phone feed art) | ✅ |
| D9 | Status pills (if added) | LIVE · LIVE · LIVE · PILOT · SHOP · PREVIEW | ✅ |
| D10 | ViT button | **Open ViT Diagnostics →** → `/diagnostics` | ✅ |
| D11 | Photo Booth button | **Open Photo Booth →** → `/photobooth` | ✅ |
| D12 | My Pets button | **Open My Pets →** → `/mypets` | ✅ |
| D13 | ID button | **Open ID Hub →** → `/id` | ✅ |
| D14 | Token Shop button | **Open Token Shop →** → `/token-shop` | ✅ |
| D15 | Monitor button | **Open Monitor →** → `/monitor` | ✅ |
| D16 | Grid buttons | Yellow fill · **not** “Get lifetime access” except N/A on grid | ✅ |
| D17 | No bone icon on grid | Bone / “Click Here To View” removed from tool cards | ✅ |
| D18 | Phone layout | 1 column · full-width buttons | ✅ |

---

### Block E — Try ViT AI now band

*Maps to: mid-page section — green button in first draft; should be yellow after polish*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| E1 | H2 | **Try ViT AI now — live in the app** | ✅ |
| E2 | Subline | Honest demo · **not** lost-dog ID match yet | ✅ |
| E3 | Button label | **Upload a photo in ViT →** (not duplicate “Try Live AI Demo” unless only here) | ✅ |
| E4 | Button URL | `https://app.freedompawsinc.com/diagnostics` | ✅ |
| E5 | Button color | **Yellow** (unified with grid) | ✅ |

---

### Block F — Freedom Paws ID — Tennessee pilot

*Maps to: ID section — **critical fix:** was two green “Try Live AI Demo” buttons*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| F1 | H2 | **Freedom Paws ID — Tennessee pilot** | ✅ |
| F2 | Body | Phased rollout · human review · no “real-time reunion live” overclaim | ✅ |
| F3 | Button 1 label | **Open ID Hub →** (NOT Try Live AI Demo) | ✅ |
| F4 | Button 1 URL | `https://app.freedompawsinc.com/id` | ✅ |
| F5 | Button 2 label | **Enroll in the app →** | ✅ |
| F6 | Button 2 URL | `https://app.freedompawsinc.com/id/enroll` | ✅ |
| F7 | Button colors | Yellow primary + outline secondary | ✅ |

---

### Block G — Holistic protocols band

*Maps to: white or dark card — SuperBud image + View Protocol Overview*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| G1 | H2 | **Holistic protocols — learn here, unlock in the app** | ✅ |
| G2 | Body | Learn on Framer · pay in Token Shop app | ✅ |
| G3 | Button label | **View Protocol Overview →** | ✅ |
| G4 | Button link type | **Framer page** `/protocol-overview` (not app) | ✅ |
| G5 | Card styling | Dark navy + gold border **OR** intentional white callout with border (Part K3) | ✅ |
| G6 | Button color | Red/coral OK **only here** (Framer-only CTA) | ✅ |

---

### Block H — Desktop note + Privacy disclaimer

*Maps to: laptop line + small legal text*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| H1 | Desktop copy | app works in browser · no separate download | ✅ |
| H2 | URL shown | `app.freedompawsinc.com` spelled correctly | ✅ |
| H3 | Disclaimer | Not vet advice · not license · consent in app | ✅ |
| H4 | Shelter line | Points staff to `shelter.freedompawsinc.com/partner` | ✅ |

---

### Block I — Bottom CTAs (`Ready to open the real tools?`)

*Maps to: two red buttons in draft — should be yellow + outline after polish*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| I1 | Headline | **Ready to open the real tools?** | ✅ |
| I2 | Subhead | **Not** “Protect Your Dog Today” — use same-tab app line (Part K4) | ✅ |
| I3 | Button 1 | **Open the Freedom Paws app →** → `https://app.freedompawsinc.com/` | ✅ |
| I4 | Button 2 | **Browse all protocols →** → Framer `/protocol-overview` | ✅ |
| I5 | Button colors | Yellow app + outline Framer (or yellow + red if red only on G6) | ✅ |

---

### Block J — Site footer

*Maps to: About · Wellness · Support · Connect columns*

| # | Check | Expected | Pass |
|---|-------|----------|:----:|
| J1 | Adopt (Tennessee) link | App `{APP}/adopt/tn` or Framer `/adopt` per site map | ✅ |
| J2 | freedompawsinc.com link | Framer home | ✅ |
| J3 | Social links | Real Instagram / Facebook URLs | ✅ |
| J4 | No app checkout in footer | Wallet/shop via app only | ✅ |

---

### Block K — iPhone end-to-end (after Publish)

*Run once after all blocks A–J pass on desktop preview*

| # | Tap target | Opens | Pass |
|---|------------|-------|:----:|
| K1 | Nav Member Tools | `/member-tools` | ✅ |
| K2 | Hero Try ViT AI free | app `/diagnostics` same tab | ✅ |
| K3 | Grid Open Photo Booth | app `/photobooth` | ✅ |
| K4 | ID band Open ID Hub | app `/id` | ✅ |
| K5 | ID band Enroll | app `/id/enroll` | ✅ |
| K6 | Protocol Overview | Framer `/protocol-overview` | ✅ |
| K7 | Footer Open app | app `/` | ✅ |

---

### Sign-off summary

| Block | Section | Status |
|-------|---------|--------|
| A | Nav | ✅ **Pass** |
| B | Hero | ✅ **Pass** |
| C | How it works | ✅ **Pass** |
| D | Tools grid | ✅ **Pass** |
| E | ViT demo band | ✅ **Pass** |
| F | ID pilot band | ✅ **Pass** |
| G | Protocols band | ✅ **Pass** |
| H | Desktop + disclaimer | ✅ **Pass** |
| I | Bottom CTAs | ✅ **Pass** |
| J | Footer | ✅ **Pass** |
| K | iPhone e2e | ✅ **Pass** |

**Launch gate:** Blocks **D**, **F**, **E**, and **K** — **cleared June 30, 2026.** Safe to link Member Tools from homepage and outreach.

**Founder signature:** Freedom Paws Founder QA **Date:** **June 30, 2026**

---

## Quick reference — all app buttons on this page

```
https://app.freedompawsinc.com/
https://app.freedompawsinc.com/diagnostics
https://app.freedompawsinc.com/photobooth
https://app.freedompawsinc.com/mypets
https://app.freedompawsinc.com/id
https://app.freedompawsinc.com/id/enroll
https://app.freedompawsinc.com/token-shop
https://app.freedompawsinc.com/monitor
```

---

*Freedom Paws Wellness — Honor Buddy's Legacy · Marketing estimates only · June 2026*
