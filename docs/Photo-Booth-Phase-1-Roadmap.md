# Freedom Paws Wellness
## SuperBud Photo Booth — Phase 1 Roadmap & Asset Guide

**Document purpose:** Printable checklist and roadmap to build a share-worthy, “WOW” Photo Booth (Phase 1), including time estimates, feature scope, asset specifications, online sources, and folder setup.

**Last updated:** May 29, 2026  
**Project folder:** `freedompaws-app`  
**Status:** Phase 1 in progress — code built; SVG sticker placeholders in repo; final PNG art optional upgrade.

---

## Table of Contents

1. [Executive summary](#1-executive-summary)
2. [Current state vs. goal](#2-current-state-vs-goal)
3. [Phase 1 scope (what we are building)](#3-phase-1-scope-what-we-are-building)
4. [Time estimates](#4-time-estimates)
5. [Development task checklist](#5-development-task-checklist)
6. [Asset checklist — 20 files](#6-asset-checklist--20-files)
7. [PNG specifications](#7-png-specifications)
8. [Where to get assets online](#8-where-to-get-assets-online)
9. [Create vs. download vs. commission](#9-create-vs-download-vs-commission)
10. [Folder structure on your Mac](#10-folder-structure-on-your-mac)
11. [Asset quality checklist (before handoff to dev)](#11-asset-quality-checklist-before-handoff-to-dev)
12. [Phase 2 & 3 preview (later)](#12-phase-2--3-preview-later)
13. [Quick reference](#13-quick-reference)

---

## 1. Executive summary

The Photo Booth today is a **prototype** (emoji stickers + stock photo backgrounds). Phase 1 turns it into a **one-tap “WOW” experience**: upload pet photo → tap a theme → instant dressed-up image → share.

**Plan:** ~**1–2 focused days** of development (with Cursor/AI) once assets are ready, or **3–5 days** solo. Asset gathering: **2–4 hours** (download path) to **1 day** (DIY Canva) or **3–7 days** (commissioned art).

---

## 2. Current state vs. goal

### What exists today

| Area | Current | Problem |
|------|---------|---------|
| Backgrounds | Random Picsum stock URLs | Off-brand, generic, unreliable |
| Accessories | Emoji on canvas (🦸🎩😎) | Looks like a demo, not “dressed up” |
| Themes | None | User must assemble manually |
| Layout | Fixed 800×600, desktop-first | Awkward on iPhone |
| Share | Download only | Weak viral loop |
| Upload | Full ViT upload UI | Heavy for a “fun” module |

### Phase 1 goal

| Area | Target |
|------|--------|
| Experience | Photo → **one tap theme** → gasp → **share** in under 30 seconds |
| Assets | **6 branded backgrounds** + **14 transparent PNG stickers** |
| Platform | **Mobile-first** (most pet photos are on phones) |
| Viral | Web Share API + save + subtle “Made with Freedom Paws” watermark |

---

## 3. Phase 1 scope (what we are building)

### In scope

- [x] **6 one-tap theme presets** (each = background + 2–4 pre-placed stickers)
  - SuperBud Hero
  - Lake Legend
  - Patriot Pup
  - Hollywood Star
  - Wellness Warrior
  - Birthday Bash
- [x] **Sticker library** — 14 SVG placeholders in repo; drop PNGs with same filenames to upgrade
- [x] **Branded/local backgrounds** (no external random URLs; protocol images as interim fallbacks)
- [x] **Mobile-first layout** — photo on top, theme carousel, Share / Save
- [x] **Fast photo upload** (compressed, iPhone-friendly — same pattern as ViT)
- [x] **Responsive canvas** (full width on phone, not fixed 800px)
- [x] **Share button** (Web Share API) + download + light watermark
- [x] **“Customize”** drawer (add/move/remove stickers)

### Out of scope for Phase 1 — scheduled next

- [ ] **Phase 2:** Automatic background removal (pet cutout) — **starts after Phase 1 iPhone sign-off**
- [ ] AI costume (Replicate)
- [ ] “Surprise Me” randomizer
- [ ] Undo/redo, layers panel
- [ ] Gallery / hashtag contest

### Target user flow

```
1. Upload / take pet photo
2. Swipe theme carousel (← SuperBud Hero | Lake Legend | … →)
3. See instant result (preset applied)
4. Tap Share or Save
5. (Optional) Customize — add hat, glasses, move stickers
```

---

## 4. Time estimates

### Development time

| Scenario | Dev hours | Calendar time |
|----------|-----------|---------------|
| **With Cursor (you + AI), placeholder art** | 12–20 hours | **1–2 days** |
| **Solo developer, no AI** | 20–30 hours | **3–5 working days** |
| **+ Polished custom art** | Same dev + 3–7 days design | **~1–2 weeks** total |

**Most likely for Freedom Paws:** **1–2 focused days** of dev once assets are in `public/images/photobooth/`, using placeholders first and swapping final art later.

### Development breakdown (hours)

| Task | Hours |
|------|-------|
| Theme system + preset apply logic | 3–4 |
| Fabric canvas refactor (responsive, layers) | 4–6 |
| Mobile-first page UX (carousel, Share, Save) | 3–4 |
| Upload (compress + iPhone-friendly) | 2–3 |
| Share API + download + watermark | 2–3 |
| Wire 6 themes to your PNG files | 2–3 |
| iPhone testing + fixes | 2–4 |
| **Total** | **~16–24 hours** |

### Asset gathering time

| Path | Your time |
|------|-----------|
| Download + rename + compress (Path A) | **2–4 hours** |
| DIY in Canva (Path B) | **~1 day** |
| Commission on Fiverr/Upwork (Path C) | **3–7 days** (parallel with dev) |

### Recommended schedule

| Day | Focus |
|-----|--------|
| **Day 1 (you)** | Gather assets — at minimum 6 backgrounds + 10 stickers; use checklist Section 6 |
| **Day 1–2 (dev)** | Build Phase 1 code against assets (or placeholders) |
| **Day 2 (both)** | iPhone test, Share, polish |
| **Later** | Swap in final commissioned art without rebuilding app |

---

## 5. Development task checklist

*For when you or Cursor implement Phase 1. Check off as completed.*

### Code structure

- [x] Create `lib/photobooth/themes.ts` — preset definitions (bg + stickers + positions)
- [x] Create `app/photobooth/PhotoBoothCanvas.tsx` — Fabric canvas component
- [x] Refactor `app/photobooth/page.tsx` — mobile-first shell
- [x] Normalized sticker positions (0–1 coordinates so themes scale on any screen)

### Features

- [x] `applyTheme(themeId, petImageUrl)` — one function clears canvas, sets bg, pet, stickers
- [x] Theme carousel (swipe on mobile)
- [x] “Share” via `navigator.share({ files: [pngBlob] })` with download fallback
- [x] Watermark: “Made with Freedom Paws” (subtle corner)
- [x] Pet photo compression before canvas (reuse ViT compress pattern)
- [x] Simpler upload UX for photobooth (not full diagnostics UI)
- [x] `resolveStickerUrl()` — tries `.png` then `.svg` placeholder

### Quality

- [ ] Test on iPhone Chrome + Safari (production server: `npm run start:mobile`)
- [ ] Preload theme assets for fast theme switch (optional polish)
- [x] Remove Picsum URLs and emoji wardrobe from production path

### Handoff trigger

When ready for dev, confirm:

- [ ] “Assets are in `public/images/photobooth/`” **OR**
- [ ] “Start with placeholders — I’ll add art later”

---

## 6. Asset checklist — 20 files

### Two types

| Type | Transparency | Count |
|------|--------------|-------|
| **Backgrounds** | Not required (full rectangle) | 6 |
| **Stickers / accessories** | **Required** (PNG cut-out) | 14 |

---

### Backgrounds (6) — 1920 × 1080, JPG or PNG

| ☐ | File name | Theme | Description |
|---|-----------|--------|-------------|
| ☐ | `bg-lake-legend.jpg` | Lake Legend | TN lake / sunset (can adapt `tn-lake-bg.jpg`) |
| ☐ | `bg-superbud-hero.jpg` | SuperBud Hero | Hero sky, golden light, optional silhouette |
| ☐ | `bg-patriot-pup.jpg` | Patriot Pup | Red/white/blue, subtle stars/stripes |
| ☐ | `bg-hollywood-star.jpg` | Hollywood Star | Red carpet, lights, glamour (simple) |
| ☐ | `bg-wellness-warrior.jpg` | Wellness Warrior | Soft green/nature, calm wellness feel |
| ☐ | `bg-birthday-bash.jpg` | Birthday Bash | Balloons, confetti, party colors |

**Tip:** Keep center area relatively simple — the pet sits in the middle.

---

### Stickers (14) — transparent PNG, ~400–800 px wide

#### Hats (4)

| ☐ | File name | Description |
|---|-----------|-------------|
| ☐ | `sticker-hat-patriotic.png` | Patriotic / Uncle Sam style hat |
| ☐ | `sticker-hat-party.png` | Party cone hat |
| ☐ | `sticker-hat-cowboy.png` | Cowboy hat (optional fun) |
| ☐ | `sticker-hat-crown.png` | Gold crown |

#### Glasses (3)

| ☐ | File name | Description |
|---|-----------|-------------|
| ☐ | `sticker-glasses-cool.png` | Sunglasses |
| ☐ | `sticker-glasses-star.png` | Star / flashy glasses |
| ☐ | `sticker-glasses-heart.png` | Heart / fun glasses |

#### Capes (2)

| ☐ | File name | Description |
|---|-----------|-------------|
| ☐ | `sticker-cape-superbud.png` | Red/gold superhero cape |
| ☐ | `sticker-cape-patriotic.png` | Stars/stripes cape |

#### Neck / cute (3)

| ☐ | File name | Description |
|---|-----------|-------------|
| ☐ | `sticker-bandana-red.png` | Red bandana |
| ☐ | `sticker-bow-pink.png` | Bow tie or bow |
| ☐ | `sticker-scarf-wellness.png` | Soft scarf |

#### Extra (2)

| ☐ | File name | Description |
|---|-----------|-------------|
| ☐ | `sticker-medal-gold.png` | Gold medal / #1 badge |
| ☐ | `sticker-sparkle.png` | Sparkle overlay (optional) |

**Minimum to start dev:** 6 backgrounds + **8–10** stickers (expand to 14 later).

---

### Theme → asset mapping (for your planning)

| Theme | Background | Suggested stickers |
|-------|------------|-------------------|
| SuperBud Hero | `bg-superbud-hero.jpg` | cape-superbud, glasses-cool, medal-gold |
| Lake Legend | `bg-lake-legend.jpg` | bandana-red, bow-pink |
| Patriot Pup | `bg-patriot-pup.jpg` | hat-patriotic, cape-patriotic |
| Hollywood Star | `bg-hollywood-star.jpg` | glasses-star, hat-crown, sparkle |
| Wellness Warrior | `bg-wellness-warrior.jpg` | scarf-wellness, medal-gold |
| Birthday Bash | `bg-birthday-bash.jpg` | hat-party, glasses-heart, sparkle |

---

## 7. PNG specifications

| Spec | Backgrounds | Stickers |
|------|-------------|----------|
| **Dimensions** | 1920 × 1080 (min 1600 × 900) | 400–800 px wide |
| **Format** | JPG (smaller) or PNG | **PNG only** |
| **Transparency** | No | **Yes — required** |
| **Max file size** | ~500 KB (compress) | ~200 KB (compress) |
| **Style** | On-brand navy/gold where possible | Prefer **cartoon/flat** — consistent set |
| **Brand colors** | Navy `#0A1625`, gold `#F5C242`, amber accents | Match Freedom Paws palette |

### Sticker test

Open each sticker on a **dark background**. Only the accessory should be visible — **no white box** around it.

### Compression

Before adding to project: [https://tinypng.com](https://tinypng.com)

---

## 8. Where to get assets online

### Stickers (transparent PNG)

| Source | Cost | Search tips |
|--------|------|-------------|
| [Canva](https://www.canva.com) | Free / Pro | “PNG hat transparent”, export PNG |
| [Freepik](https://www.freepik.com) | Free + attribution / Premium | “dog hat png transparent” |
| [PNGTree](https://pngtree.com) | Free limited / paid | Cut-out hats, glasses |
| [Vecteezy](https://www.vecteezy.com) | Free / Pro | PNG stickers |
| [Wikimedia Commons](https://commons.wikimedia.org) | Free (check each license) | Clip art |

**License rule:** Use only assets allowed for **commercial use** in a public app. Save license notes if attribution required.

### Backgrounds

| Source | Notes |
|--------|--------|
| **Your photos** | `public/images/tn-lake-bg.jpg` — best for brand |
| [Unsplash](https://unsplash.com) | Free commercial use |
| [Pexels](https://www.pexels.com) | Free commercial use |
| **Canva** | Templates: “patriotic background”, “superhero sky” → export 1920×1080 |

### Cut out / edit tools

| Tool | Use |
|------|-----|
| [remove.bg](https://www.remove.bg) | Remove background from art |
| Canva Background Remover | Isolate cape from SuperBud art |
| [Photopea](https://www.photopea.com) | Free Photoshop-like crop |

**Hero asset tip:** Isolate cape from `superbud-hero.png` → save as `sticker-cape-superbud.png`.

---

## 9. Create vs. download vs. commission

### Path A — Mostly download (fastest: 2–4 hours)

- [ ] Download 14 transparent PNGs (Canva/Freepik)
- [ ] Download or reuse 6 backgrounds
- [ ] Rename per Section 6
- [ ] Compress at TinyPNG
- [ ] Copy into folder structure (Section 10)

### Path B — DIY in Canva (~1 day, best brand match)

- [ ] Create 1920×1080 backgrounds (navy + gold Freedom Paws style)
- [ ] Export sticker elements as PNG with transparent background
- [ ] Keep one consistent cartoon style across all 14 stickers

### Path C — Commission ($50–200, 3–7 days)

- [ ] Fiverr/Upwork: “20 PNG pet photo booth assets, transparent stickers + 6 backgrounds”
- [ ] Attach this document + `superbud-hero.png` as style reference
- [ ] Request exact filenames from Section 6

**Recommendation:** Path A for speed + **one custom SuperBud cape** (Path B or C) as the signature asset.

---

## 10. Folder structure on your Mac

Create these folders and place files:

```text
freedompaws-app/public/images/photobooth/
  backgrounds/
    bg-lake-legend.jpg
    bg-superbud-hero.jpg
    bg-patriot-pup.jpg
    bg-hollywood-star.jpg
    bg-wellness-warrior.jpg
    bg-birthday-bash.jpg
  stickers/
    sticker-hat-patriotic.png
    sticker-hat-party.png
    sticker-hat-cowboy.png
    sticker-hat-crown.png
    sticker-glasses-cool.png
    sticker-glasses-star.png
    sticker-glasses-heart.png
    sticker-cape-superbud.png
    sticker-cape-patriotic.png
    sticker-bandana-red.png
    sticker-bow-pink.png
    sticker-scarf-wellness.png
    sticker-medal-gold.png
    sticker-sparkle.png
```

### Terminal (optional — create empty folders)

```bash
cd ~/freedompaws-app
mkdir -p public/images/photobooth/backgrounds
mkdir -p public/images/photobooth/stickers
```

---

## 11. Asset quality checklist (before handoff to dev)

Print and check before saying “assets are ready”:

- [ ] **6** background files in `backgrounds/`
- [ ] **至少 8–14** sticker files in `stickers/` (14 ideal)
- [ ] All filenames match Section 6 (lowercase, hyphens)
- [ ] Every sticker opens on dark background with **no white box**
- [ ] Backgrounds are landscape, not blurry, center not too busy
- [ ] All files compressed (TinyPNG)
- [ ] Background JPGs under ~500 KB each
- [ ] Stickers under ~200 KB each
- [ ] Style is reasonably consistent (not 14 random art styles)
- [ ] Commercial use license confirmed for downloaded assets
- [ ] Optional: one **SuperBud cape** derived from existing hero art

**When complete, tell dev:** “Assets are in `public/images/photobooth/` — ready for Phase 1 build.”

---

## 12. Phase 2 & 3 preview (later)

### Phase 2 — “Feels magical” (2–3 weeks dev)

**Gate:** Complete Phase 1 iPhone testing first.

- [ ] **Background removal (pet cutout)** — priority #1 (`@imgly/background-removal` or API)
- [ ] Smarter sticker placement (head zone)
- [ ] Undo / delete selected sticker (partial: remove selected exists in Customize)
- [ ] “Surprise Me” random theme
- [ ] Cats + dogs copy (“your pet”)
- [ ] Short sparkle reveal animation

### Phase 3 — “Viral engine”

- [ ] AI costume (Replicate — already in project dependencies)
- [ ] Share card with QR to site
- [ ] Hashtag challenge / gallery
- [ ] Sound + haptic on share

---

## 13. Quick reference

### Priority order (implementation)

| Priority | Task | Impact |
|----------|------|--------|
| 1 | Theme presets (1-tap) | WOW |
| 2 | PNG stickers + branded backgrounds | Quality |
| 3 | Mobile layout + fast upload | Adoption |
| 4 | Share button | Viral |
| 5 | Optional customize drawer | Power users |

### Existing project assets you can reuse

| File | Use |
|------|-----|
| `public/images/tn-lake-bg.jpg` | Lake Legend background |
| `public/images/superbud-hero.png` | Style reference / cape cutout source |

### Test URLs (local network — replace IP)

| Page | URL |
|------|-----|
| Photo Booth | `http://192.168.1.50:3000/photobooth` |
| Start server | `npm run start:mobile` |

### Related docs in this project

| Document | Path |
|----------|------|
| Symptom lexicon admin guide | `docs/Freedom-Paws-Symptom-Lexicon-Admin-Guide.md` |
| This roadmap | `docs/Photo-Booth-Phase-1-Roadmap.md` |

---

## Master checklist — print this page

### Phase 1 — Your tasks (assets)

- [ ] Read Sections 6–11
- [ ] Choose Path A, B, or C (Section 9)
- [ ] Create folders (Section 10)
- [ ] Collect 6 backgrounds
- [ ] Collect 14 stickers (min 8–10 to start)
- [ ] Compress all files
- [ ] Complete Section 11 quality checklist
- [ ] Notify dev: assets ready

### Phase 1 — Development tasks

- [ ] Complete Section 5 development checklist
- [ ] Test on iPhone
- [ ] Share + download working
- [ ] Deploy when ready

### Timeline target

| Milestone | Target date | Status |
|-----------|-------------|--------|
| Phase 1 dev start | May 2026 | Done |
| Placeholder assets in repo | May 2026 | Done (6 bgs + 14 SVG stickers) |
| iPhone test pass | ______________ | **Next step** |
| Final PNG art swap (optional) | ______________ | When ready |
| **Phase 2: background removal** | After Phase 1 sign-off | On roadmap |
| Soft launch / share test | ______________ | After iPhone pass |

---

*Freedom Paws Wellness — SuperBud Photo Booth Phase 1 Roadmap*

*To import into Google Docs: File → Open → Upload this `.md` file, or copy/paste from Cursor.*
