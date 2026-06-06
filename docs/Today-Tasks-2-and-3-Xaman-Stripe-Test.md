# Today: Tasks #2 & #3 — Vercel Env + Xaman Test Payment

**Date:** June 5, 2026  
**You do:** #1 Framer/DNS on your own  
**Today focus:** Configure Vercel → test one real Xaman payment on iPhone  

**Time:** ~45–60 minutes  

---

## Before you start

- iPhone with **Xaman** app installed and a wallet funded (small XRP balance for fees + test payment)
- Laptop logged into **vercel.com** and **apps.xumm.dev**
- Freedom Paws PWA open on iPhone (production URL)
- Optional: Stripe account for card rail (can skip Stripe today and only test Xaman)

---

## Task #2 — Vercel environment variables

### Step 1 — Open Vercel env screen

1. Go to **https://vercel.com**
2. Click project **freedompaws-app** (FREEDOMPAWSWELLNESS)
3. **Settings** → **Environment Variables**

### Step 2 — Confirm existing key

You should already see:

- `NEXT_PUBLIC_XUMM_API_KEY` — **Production** + **Preview** ✓

If missing, add it from [apps.xumm.dev](https://apps.xumm.dev) → your app → **API Keys** → **API Key** (not Secret).

### Step 3 — Add XUMM API Secret (required)

1. **apps.xumm.dev** → sign in → **Applications** → your Freedom Paws app  
   (Create app if needed: name `Freedom Paws Wellness`, redirect URL = your Vercel URL)
2. Copy **API Secret** (never put this in Framer or client code)
3. Vercel → **Add New**:
   - **Key:** `XUMM_API_SECRET`
   - **Value:** paste secret
   - **Environments:** Production + Preview
4. **Save**

### Step 4 — Add treasury address (where payments arrive)

1. Open **Xaman** on iPhone → your receiving wallet
2. Tap **Receive** → copy your **r-address** (starts with `r`)
3. Vercel → **Add New**:
   - **Key:** `XRPL_TREASURY_ADDRESS`
   - **Value:** your `r...` address
   - **Environments:** Production + Preview
4. **Save**

> Use a dedicated business wallet if possible, not your personal savings wallet.

### Step 5 — Add RLUSD issuer (enables RLUSD button)

1. Vercel → **Add New**:
   - **Key:** `XRPL_RLUSD_ISSUER`
   - **Value:** `rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De`  
     (Ripple USD official XRPL mainnet issuer — [Ripple docs](https://docs.ripple.com/products/stablecoin/developer-resources/rlusd-on-the-xrpl))
   - **Environments:** Production + Preview
2. **Save**

**Note:** Your Xaman wallet needs an **RLUSD trust line** to pay in RLUSD. XRP payment works without RLUSD trust line.

### Step 6 — Set app URL (Xaman return link)

Until `app.freedompawsinc.com` is live, use your Vercel URL:

1. Vercel → **Deployments** → **Visit** → copy URL  
   Example: `https://freedompaws-app.vercel.app`
2. **Add or Edit:**
   - **Key:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://freedompaws-app.vercel.app` (no trailing slash)
   - **Environments:** Production + Preview
3. **Save**

### Step 7 — Stripe (optional today)

Skip if you only test Xaman today. When ready:

1. **dashboard.stripe.com** → **Product catalog** → **Add product**
   - Name: `Freedom Paws Protocol — Lifetime Access`
   - Price: **$18.00** one-time USD
2. Copy **Price ID** (`price_...`)
3. Vercel → add:
   - `STRIPE_SECRET_KEY` = `sk_test_...` (Test mode first)
   - `STRIPE_PROTOCOL_PRICE_ID` = `price_...`

### Step 8 — Redeploy (critical)

Env vars do **not** apply until redeploy:

1. Vercel → **Deployments**
2. ⋯ on latest → **Redeploy**
3. **Redeploy** (do not change code)
4. Wait until status **Ready** (~1–2 min)

### Step 9 — Verify config (no secrets shown)

On your Mac browser, open:

```
https://YOUR-VERCEL-URL.vercel.app/api/shop/config-status
```

You want:

```json
"readyForXamanTest": true,
"missingForXaman": []
```

If `missingForXaman` lists items, add those env vars and **redeploy** again.

---

## Task #3 — Test one Xaman payment on iPhone

### Recommended protocol

**Buddy's Gut Balance** (`gut-balance`) — you already validated ViT with similar symptoms.

### Step 1 — Refresh app

1. Open Freedom Paws PWA on iPhone
2. Tap **Refresh now** if banner shows (v44+)

### Step 2 — Open Token Shop

1. **TOKEN SHOP** in nav (or home card)
2. Scroll to **Buddy's Gut Balance & Cleanse**
3. Confirm price block shows:
   - **18 RLUSD**
   - **≈ $18 USD**
   - **≈ X.XX XRP (live)**

### Step 3 — Test XRP path first (simplest)

1. Tap **Pay with Xaman — X.XX XRP (live)**
2. iPhone should switch to **Xaman** app
3. Review payment:
   - **Destination:** your treasury `r...` (first/last chars)
   - **Amount:** live XRP amount
4. **Sign** / **Confirm** in Xaman
5. After success, Xaman returns to Freedom Paws (or open PWA manually)

### Step 4 — Confirm unlock

Back on Token Shop card you should see:

**✓ Unlocked on this device**

### Step 5 — Optional RLUSD test

Only if your Xaman wallet has **RLUSD trust line** and RLUSD balance:

1. Tap **Pay with Xaman — 18 RLUSD**
2. Sign in Xaman
3. Confirm unlock

If RLUSD fails with trust line error, that's normal — XRP path is sufficient for today's test.

### Step 6 — Optional Stripe test

1. Tap **Pay with card (Stripe) — $18 USD**
2. Use Stripe test card `4242 4242 4242 4242` (test mode only)
3. Return to app → unlock banner

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Xaman checkout is not configured" | Add `XUMM_API_SECRET` + redeploy |
| "Set XRPL_TREASURY_ADDRESS" | Add treasury `r...` + redeploy |
| Config status still missing items | Redeploy after every env change |
| Xaman opens but payment fails | Need more XRP in wallet for amount + fee |
| RLUSD fails | Add RLUSD trust line in Xaman, or use XRP button |
| No unlock after pay | Wait 10s; reopen Token Shop; check `/api/xumm/status` polling |
| Return URL wrong | Set `NEXT_PUBLIC_APP_URL` to exact Vercel HTTPS URL |

---

## After today — report back

Reply with:

1. Result of `/api/shop/config-status` (`readyForXamanTest` true/false)
2. Which button you tested (XRP or RLUSD)
3. **✓ Unlocked** yes/no
4. Any error message text

Then we move to **Photo Booth P1** or **Stripe webhook** for server-side unlock.

---

*Freedom Paws Wellness — June 5, 2026*
