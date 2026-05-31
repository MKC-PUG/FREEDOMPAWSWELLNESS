# Freedom Paws PWA — Phase 1 Setup & Checklist

**Last updated:** May 31, 2026  
**Current version:** `v31` (edit `lib/pwa-version.ts` — build syncs `public/sw.js` automatically)  
**Phase 1 status:** ✅ **Complete** — preview PWA live on Vercel HTTPS, installed on iPhone

---

## Phase 1 — signed off

| Area | Status |
|------|--------|
| Manifest + icons (192, 512, maskable, Apple touch) | ✅ Done |
| Service worker (production only; dev unregisters SW) | ✅ Done |
| Network-only: Photo Booth, API, diagnostics, admin | ✅ Done |
| CSS network-first (fixes unstyled nav after updates) | ✅ Done |
| Offline banner + `/offline.html` fallback | ✅ Done |
| Install banner (Android + iOS Safari hint) | ✅ Done |
| Update banner (“Refresh now” when new version) | ✅ Done |
| Preview mode (`NEXT_PUBLIC_SITE_MODE=preview`) | ✅ Done |
| robots.txt blocks crawlers in preview | ✅ Done |
| LAN iPhone testing (`npm run start:mobile`) | ✅ Signed off |
| HTTPS preview deploy (Vercel) | ✅ Signed off |
| iPhone home-screen install from HTTPS URL | ✅ Signed off |
| Photo Booth + Me & My Pup on installed PWA | ✅ Signed off |
| **Public launch** (`SITE_MODE=public` + domain) | ⏳ Phase 2 — after LLC/trademark |

---

## HTTPS smoke test — signed off

Run again after major changes or a new phone install.

| # | Test | Signed off |
|---|------|------------|
| 1 | Install + standalone — opens from icon, no Safari bar | ✅ |
| 2 | Photo Booth — upload, themes, Me & My Pup, share/save | ✅ |
| 3 | ViT Diagnostics — upload works | ✅ |
| 4 | Offline banner — airplane on while app open → gold banner | ✅ |
| 5 | Back online — airplane off → banner gone | ✅ |
| 6 | Nav + Token Shop — menu works; pages load | ✅ |
| 7 | Update banner — after redeploy + revisit, “Refresh now” appears | ✅ |
| 8 | Preview protection — footer ©, SuperBud™, private preview banner | ✅ |

**iOS note:** System *“Turn off Airplane Mode…”* on cold start is normal. Tap OK; test offline with the in-app gold banner while the app is already open.

---

## What Phase 1 means

**Goal (achieved):** Install Freedom Paws on your iPhone from a **real HTTPS URL** in **preview mode** — not indexed by Google, not public marketing — while LLC and SuperBud™ trademarks proceed.

**Not Phase 1:** App Store submission, public domain marketing, crypto checkout live.

---

## Ongoing — bump version on every deploy

Edit **only** `lib/pwa-version.ts`:

```ts
export const PWA_VERSION = 'v31'; // increment each release
```

Run `npm run build` — `scripts/sync-pwa-version.mjs` updates `CACHE_NAME` in `public/sw.js`.

Push to `main` → Vercel auto-deploys → users see **“Refresh now”** or reinstall to pick up the new build.

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

## Local testing (optional)

```bash
npm run start:mobile
```

Safari → `http://<lan-ip>:3000` → Share → **Add to Home Screen**

Service worker is **disabled in development** — use a production build or the Vercel HTTPS URL to test SW, install banner, and update flow.

---

## Phase 2 — public launch (when LLC/trademark ready)

See **`Deploy-and-Brand-Protection.md`** for full detail.

1. Attorney confirms you can use SuperBud™ / Freedom Paws™ publicly  
2. Set `NEXT_PUBLIC_SITE_MODE` = **`public`** in Vercel env  
3. Redeploy and bump `PWA_VERSION`  
4. Connect your domain DNS to Vercel  
5. Remove Vercel password protection if used  
6. Announce when you choose  

**Optional before launch:** verify real social URLs in `lib/social-links.ts` (or `NEXT_PUBLIC_SOCIAL_*` env vars).

---

## If something feels stale on phone

1. Force-quit the installed app  
2. Look for gold **“Update ready — Refresh now”** banner and tap it  
3. Or: remove from Home Screen → Safari → Add to Home Screen again  
4. Or: bump `PWA_VERSION` and redeploy  

Confirm the build: Photo Booth **?** help page or install/update banner should reflect the latest version after deploy.

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
