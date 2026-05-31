# Freedom Paws PWA — Phase 1 Setup & Checklist

**Last updated:** May 31, 2026  
**Current version:** `v13` (edit `lib/pwa-version.ts` — build syncs `public/sw.js` automatically)

---

## Phase 1 status — where we left off

| Area | Status |
|------|--------|
| Manifest + icons (192, 512, maskable, Apple touch) | ✅ Done |
| Service worker (production only; dev unregisters SW) | ✅ Done |
| Network-only: Photo Booth, API, diagnostics, admin | ✅ Done |
| CSS network-first (fixes unstyled nav after updates) | ✅ Done |
| Offline banner + `/offline.html` fallback | ✅ Done |
| Install banner (Android + iOS Safari hint) | ✅ Done |
| **Update banner** (“Refresh now” when new version) | ✅ Done |
| Preview mode (`NEXT_PUBLIC_SITE_MODE=preview`) | ✅ Done |
| robots.txt blocks crawlers in preview | ✅ Done |
| LAN iPhone testing (`npm run start:mobile`) | ✅ You confirmed working |
| **HTTPS preview deploy** (Vercel / host) | ⏳ **Next step** |
| Public launch (`SITE_MODE=public` + domain) | ⏳ After LLC/trademark |

---

## What Phase 1 means

**Goal:** Install Freedom Paws on your iPhone from a **real HTTPS URL** in **preview mode** — not indexed by Google, not public marketing — while LLC and SuperBud™ trademarks proceed.

**Not Phase 1:** App Store submission, public domain marketing, crypto checkout live.

---

## One version bump on every deploy

Edit **only** `lib/pwa-version.ts`:

```ts
export const PWA_VERSION = 'v13'; // increment each release
```

Run `npm run build` — `scripts/sync-pwa-version.mjs` updates `CACHE_NAME` in `public/sw.js`.

---

## App shortcuts (long-press home screen icon)

| Shortcut | Opens |
|----------|--------|
| SuperBud Photo Booth | `/photobooth` |
| ViT Diagnostics | `/diagnostics` |
| Protocol Overview | `/protocols` |
| Token Shop | `/token-shop` |

---

## Safe caching rules

**Never cached:** Photo Booth, uploads, API, diagnostics, admin, `/images/photobooth/*`

**Network-first:** HTML pages, `/_next/static/css/*`

**May cache:** Other `/_next/static/*`, general `/images/*`, manifest, icons, offline page

---

## Test on iPhone — LAN (you already did this)

```bash
npm run start:mobile
```

Safari → `http://<lan-ip>:3000` → Share → **Add to Home Screen**

### Pass criteria

| # | Test | Pass |
|---|------|------|
| 1 | Install + standalone | Opens from icon, no Safari bar |
| 2 | Photo Booth | Upload, themes, frames, share |
| 3 | ViT Diagnostics | Upload works |
| 4 | Offline banner | Airplane on while app open → gold banner |
| 5 | Back online | Airplane off → banner gone |
| 6 | Nav + Token Shop | Menu works; Token Shop header image loads |
| 7 | Update banner | After redeploy + revisit, “Refresh now” appears (optional) |

**iOS note:** System *“Turn off Airplane Mode…”* on cold start is normal on LAN. Tap OK; test offline with the in-app gold banner.

---

## Phase 1 next step — HTTPS preview deploy

See **`Deploy-and-Brand-Protection.md`** for full detail. Summary:

### 1. Push to GitHub (private repo recommended)

### 2. Vercel (easiest)

1. [vercel.com](https://vercel.com) → Import project  
2. Environment variables (from `.env.example`):
   - `NEXT_PUBLIC_SITE_MODE` = **`preview`**
   - `ADMIN_PASSWORD` = strong password  
3. Deploy → you get `https://your-project.vercel.app`  
4. Optional: **Deployment Protection → Password protect**

### 3. After deploy

1. Bump `PWA_VERSION` to `v14` (or next) and redeploy  
2. iPhone Safari → **HTTPS preview URL** → Share → Add to Home Screen  
3. Re-run tests 1–6 above on HTTPS  
4. Confirm footer © + SuperBud™ + private preview banner  
5. Google `site:your-preview-url.vercel.app` → should show **nothing**

### 4. When LLC/trademark ready (Phase 2 launch)

1. Set `NEXT_PUBLIC_SITE_MODE=public`  
2. Connect your domain  
3. Remove password protection  
4. Announce when you choose  

---

## If something feels stale on phone

1. Force-quit the installed app  
2. Look for gold **“Update ready — Refresh now”** banner and tap it  
3. Or: remove from Home Screen → Safari → Add to Home Screen again  
4. Or: bump `PWA_VERSION` and redeploy  

---

## Files reference

| File | Purpose |
|------|---------|
| `lib/pwa-version.ts` | Version bump (single source of truth) |
| `public/sw.js` | Service worker (auto-synced on build) |
| `public/manifest.json` | PWA manifest + shortcuts |
| `app/components/ServiceWorkerRegister.tsx` | Registers SW in production |
| `app/components/PwaUpdateBanner.tsx` | “Refresh now” after deploy |
| `app/components/PwaInstallBanner.tsx` | Install hint (Safari / Android) |
| `app/components/OfflineBanner.tsx` | In-app offline message |
| `lib/site-mode.ts` | preview vs public |
| `.env.example` | Deploy env template |

---

*Freedom Paws Wellness — Honor Buddy’s Legacy*
