# Framer → App CTA Link Map

**Date:** June 5, 2026  
**Purpose:** Paste these URLs into Framer buttons. **Canonical checkout is always the app.**

Replace `{APP}` with your `NEXT_PUBLIC_APP_URL` value:

| Phase | `{APP}` value |
|-------|----------------|
| **Now (preview)** | `https://YOUR-PROJECT.vercel.app` |
| **After DNS** | `https://app.freedompawsinc.com` |

Set `NEXT_PUBLIC_APP_URL` in Vercel to match. Re-copy Framer links when you switch.

---

## Primary tool CTAs (homepage + nav)

| Button label | URL |
|--------------|-----|
| ViT Diagnostics / LAUNCH | `{APP}/diagnostics` |
| SuperBud Photo Booth / OPEN | `{APP}/photobooth` |
| Monitor My Dog | `{APP}/monitor` |
| My Pets | `{APP}/mypets` |
| Token Shop / SHOP | `{APP}/token-shop` |
| Install / Open App | `{APP}/` |

---

## Protocol shop deep links (Framer teasers → app buy)

Use on Framer protocol story pages. Label: **“Get lifetime access in the app”**.

| Protocol | Shop URL | Buy URL |
|----------|----------|---------|
| Max Movement | `{APP}/token-shop?protocol=max-movement#max-movement` | `{APP}/token-shop?protocol=max-movement&buy=1#max-movement` |
| Freedom Calm | `{APP}/token-shop?protocol=freedom-calm#freedom-calm` | `{APP}/token-shop?protocol=freedom-calm&buy=1#freedom-calm` |
| Liver & Kidney Detox | `{APP}/token-shop?protocol=liver-kidney-detox#liver-kidney-detox` | `{APP}/token-shop?protocol=liver-kidney-detox&buy=1#liver-kidney-detox` |
| Gut Balance | `{APP}/token-shop?protocol=gut-balance#gut-balance` | `{APP}/token-shop?protocol=gut-balance&buy=1#gut-balance` |
| Fresh Smile Dental | `{APP}/token-shop?protocol=fresh-smile-dental#fresh-smile-dental` | `{APP}/token-shop?protocol=fresh-smile-dental&buy=1#fresh-smile-dental` |
| Heart Strong | `{APP}/token-shop?protocol=heart-strong#heart-strong` | `{APP}/token-shop?protocol=heart-strong&buy=1#heart-strong` |
| Red Light Spine | `{APP}/token-shop?protocol=infrared-spine#infrared-spine` | `{APP}/token-shop?protocol=infrared-spine&buy=1#infrared-spine` |
| Allergy Shield | `{APP}/token-shop?protocol=allergy-shield#allergy-shield` | `{APP}/token-shop?protocol=allergy-shield&buy=1#allergy-shield` |
| Patriot Immune | `{APP}/token-shop?protocol=patriot-immune#patriot-immune` | `{APP}/token-shop?protocol=patriot-immune&buy=1#patriot-immune` |
| Clear Vision | `{APP}/token-shop?protocol=clear-vision#clear-vision` | `{APP}/token-shop?protocol=clear-vision&buy=1#clear-vision` |

---

## App → Framer (footer links — already in app)

Configured via env (defaults shown):

| App footer label | Default Framer URL |
|------------------|-------------------|
| Grants & Give-Back | `https://freedompawsinc.com/grants` |
| Our Mission | `https://freedompawsinc.com/mission` |
| Veterans | `https://freedompawsinc.com/veterans` |
| Shelters | `https://freedompawsinc.com/shelters` |

Override with `NEXT_PUBLIC_FRAMER_GRANTS_URL`, etc., if your Framer paths differ.

---

## DNS checklist — `app.freedompawsinc.com`

1. Vercel → Project → **Domains** → Add `app.freedompawsinc.com`  
2. DNS at registrar → CNAME `app` → `cname.vercel-dns.com` (or Vercel instructions)  
3. Vercel env: `NEXT_PUBLIC_APP_URL=https://app.freedompawsinc.com`  
4. Redeploy `main`  
5. Update all Framer `{APP}` links  
6. iPhone: reinstall or refresh PWA from new URL  

---

## Framer pages that should NOT checkout

Remove duplicate buy flows from Framer. Keep:

- Story, grants, SEO copy  
- “From 25 XRP” teaser text (synced from source-of-truth doc)  
- Single CTA → app buy URL  

---

*Freedom Paws Wellness — June 5, 2026*
