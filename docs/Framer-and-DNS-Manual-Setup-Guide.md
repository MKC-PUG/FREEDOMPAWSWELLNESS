# Framer CTAs + App DNS — Step-by-Step Manual Guide

**Date:** June 5, 2026  
**For:** Freedom Paws founder (click-by-click)  
**Goal:** Finish remaining **manual P0** steps — wire Framer marketing to the app, then point `app.freedompawsinc.com` at Vercel.

**Before you start:** Have open:
- Framer project for `freedompawsinc.com`
- [vercel.com](https://vercel.com) → `freedompaws-app` project
- This doc: `docs/Framer-CTA-Link-Map.md`
- Your iPhone with Freedom Paws PWA installed

---

## Part A — Find your app URL (5 minutes)

### A1. Get Vercel production URL

1. Open **vercel.com** and sign in.
2. Click project **freedompaws-app** (or FREEDOMPAWSWELLNESS).
3. On the **Deployments** tab, click the top deployment with green **Ready**.
4. Click **Visit** — copy the URL from the browser bar.  
   Example: `https://freedompaws-app.vercel.app`  
5. Save this as **`{APP}`** for Part B.

### A2. (Optional now) Set env var on Vercel

1. Vercel project → **Settings** → **Environment Variables**.
2. Click **Add New**.
3. Name: `NEXT_PUBLIC_APP_URL`  
   Value: your `{APP}` URL (no trailing slash).  
   Environments: **Production** + **Preview** → **Save**.
4. **Deployments** → ⋯ on latest → **Redeploy** → **Redeploy**.

---

## Part B — Framer homepage CTAs (20 minutes)

### B1. Open Framer

1. Go to **framer.com** → sign in.
2. Open site **Freedom Paws** / `freedompawsinc.com`.
3. Click **Pages** in the left sidebar.
4. Open your **Home** page.

### B2. ViT Diagnostics button

1. Click the **ViT** / **LAUNCH** / **Diagnostics** button on the canvas.
2. Right panel → **Link** (or **On Tap** → **Link**).
3. Choose **URL**.
4. Paste: `{APP}/diagnostics`  
   Example: `https://freedompaws-app.vercel.app/diagnostics`
5. Toggle **Open in new tab** → **OFF** (same tab is fine on mobile).

### B3. SuperBud Photo Booth button

1. Click the Photo Booth button.
2. **Link** → **URL** → `{APP}/photobooth`

### B4. Token Shop button (if on Framer homepage)

1. Click Shop / Token Shop button.
2. **Link** → **URL** → `{APP}/token-shop`  
   **Do not** link to a Framer checkout page.

### B5. Optional tool links

| Button | URL |
|--------|-----|
| My Pets | `{APP}/mypets` |
| Monitor | `{APP}/monitor` |
| Open App / Install | `{APP}/` |

### B6. Publish Framer

1. Top right → **Publish** (or **Update**).
2. Wait for publish to complete.
3. On iPhone Safari, open `freedompawsinc.com` → tap ViT button → confirm it opens the **app** diagnostics page.

---

## Part C — Framer protocol teaser pages (30 minutes)

For each protocol marketing page on Framer (or one shared “Protocols” section):

### C1. Open protocol page in Framer

1. **Pages** → open e.g. **Patriot Immune** (or your protocol story page).

### C2. Add or edit “Get lifetime access” button

1. Select the buy / get protocol button.
2. **Link** → **URL**.
3. Use the **Buy URL** from `docs/Framer-CTA-Link-Map.md`.  
   Example Patriot Immune:  
   `{APP}/token-shop?protocol=patriot-immune&buy=1#patriot-immune`
4. Button label suggestion: **Get lifetime access in the app**

### C3. Price teaser text (no separate checkout)

1. Select text near the button.
2. Set copy to: **From 18 RLUSD (≈ $18 USD) — live XRP at checkout in the app**
3. **Do not** show a different dollar price on Framer.

### C4. Repeat for all 10 slugs

Use `docs/Framer-CTA-Link-Map.md` table — one buy URL per protocol.

### C5. Publish again

**Publish** → test one link on iPhone.

---

## Part D — DNS: `app.freedompawsinc.com` on Vercel (20–45 minutes)

DNS can take up to 48 hours; often works in 15–30 minutes.

### D1. Add domain in Vercel

1. **vercel.com** → project **freedompaws-app**.
2. **Settings** → **Domains**.
3. Click **Add**.
4. Type: `app.freedompawsinc.com` → **Add**.
5. Vercel shows DNS instructions — keep this tab open.

### D2. Add DNS record at your registrar

Where you bought `freedompawsinc.com` (GoDaddy, Namecheap, Cloudflare, etc.):

1. Log in → **DNS** / **DNS Management** for `freedompawsinc.com`.
2. **Add record**:
   - **Type:** `CNAME`
   - **Name / Host:** `app` (some registrars want `app.freedompawsinc.com` — follow their hint)
   - **Value / Target:** `cname.vercel-dns.com` (or the exact target Vercel shows)
   - **TTL:** Auto or 3600
3. **Save**.

### D3. Wait for Vercel verification

1. Back in Vercel **Domains** — refresh.
2. Status should change to **Valid** / green check (may take 5–30 min).
3. Click **Visit** on `app.freedompawsinc.com` — app should load over HTTPS.

### D4. Update Vercel environment variable

1. **Settings** → **Environment Variables**.
2. Edit `NEXT_PUBLIC_APP_URL`:
   - Value: `https://app.freedompawsinc.com`
3. **Save** → **Redeploy** latest deployment.

### D5. Update every Framer `{APP}` link

1. Framer → replace old Vercel URL with `https://app.freedompawsinc.com` in **all** buttons from Part B and C.
2. **Publish** Framer again.

### D6. iPhone PWA

1. Open `https://app.freedompawsinc.com` in Safari.
2. **Share** → **Add to Home Screen** (fresh install on new subdomain).
3. Open app → confirm **Refresh now** shows **v44** or later.

---

## Part E — Xaman + Stripe env on Vercel (for live checkout)

### E1. Xaman (primary)

1. Vercel → **Settings** → **Environment Variables** → **Add**:

| Name | Value | Notes |
|------|-------|-------|
| `XUMM_API_SECRET` | From [apps.xumm.dev](https://apps.xumm.dev) | Server only — never public |
| `XRPL_TREASURY_ADDRESS` | Your `r...` receive address | Where protocol payments go |
| `XRPL_RLUSD_ISSUER` | RLUSD issuer `r...` | Enables RLUSD button |

2. Confirm `NEXT_PUBLIC_XUMM_API_KEY` already exists.
3. **Redeploy**.

### E2. Stripe (alternative #2)

1. [dashboard.stripe.com](https://dashboard.stripe.com) → **Products** → create product **Freedom Paws Protocol** at **$18**.
2. Copy **Price ID** (`price_...`).
3. Vercel env:
   - `STRIPE_SECRET_KEY` = `sk_test_...` or `sk_live_...`
   - `STRIPE_PROTOCOL_PRICE_ID` = `price_...`
4. **Redeploy**.

### E3. Test on iPhone

1. **Token Shop** → pick a protocol.
2. Confirm card shows: **18 RLUSD** → **≈ X.XX XRP (live)**.
3. Tap **Pay with Xaman — 18 RLUSD** (primary crypto).
4. Tap **Pay with card (Stripe)** (secondary) — opens Stripe Checkout when configured.

---

## Part F — Checklist (print this)

- [ ] `{APP}` URL copied from Vercel  
- [ ] Framer Home → ViT → `{APP}/diagnostics`  
- [ ] Framer Home → Photo Booth → `{APP}/photobooth`  
- [ ] Framer Home → Token Shop → `{APP}/token-shop`  
- [ ] 10 protocol pages → app buy URLs from CTA map  
- [ ] Framer published  
- [ ] `app.freedompawsinc.com` added in Vercel Domains  
- [ ] CNAME `app` → Vercel at registrar  
- [ ] Vercel domain shows Valid  
- [ ] `NEXT_PUBLIC_APP_URL=https://app.freedompawsinc.com`  
- [ ] Framer links updated to `app.` subdomain  
- [ ] iPhone PWA reinstalled from `app.` URL  
- [ ] `XUMM_API_SECRET` + `XRPL_TREASURY_ADDRESS` set  
- [ ] Stripe keys set (when ready for card tests)  

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Framer button goes to wrong site | Re-check URL; must start with `https://` |
| `app.` shows Vercel 404 | Wait for DNS; confirm CNAME target matches Vercel |
| Xaman says not configured | Add `XUMM_API_SECRET`; redeploy |
| Stripe says not configured | Add `STRIPE_SECRET_KEY` + `STRIPE_PROTOCOL_PRICE_ID` |
| Live XRP shows “estimate” | CoinGecko rate failed — retry; XRP button still works with estimate |
| Old PWA cache | Tap **Refresh now** or reinstall from Home Screen |

---

*Freedom Paws Wellness — June 5, 2026*
