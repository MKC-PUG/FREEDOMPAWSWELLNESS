# Protocol & Price — Source of Truth

**Date:** June 5, 2026  
**Canonical shop:** Next.js app `/token-shop`  
**Primary payments:** Xaman + XRP / RLUSD  
**Code authority:** `lib/shop/protocol-catalog.ts`, `app/token-shop/shop-items.ts`, `lib/ai/protocol-registry.ts`

When prices or names change, update **code first**, then this doc and `Protocol-Price-Source-of-Truth.csv`, then Framer teaser copy.

---

## Global pricing

| Field | Value |
|-------|-------|
| **Canonical price (RLUSD)** | **18 RLUSD** |
| **Fiat equivalent (display)** | **≈ $18 USD** |
| **XRP at checkout** | **Live conversion** from USD via CoinGecko (refreshes ~2 min) |
| **XRP fallback** | **25 XRP** if live rate API unavailable |
| Payment rail #1 | Xaman — **RLUSD** or **live XRP** |
| Payment rail #2 | **Stripe** card — $18 USD (alternative) |

---

## App URL base

| Environment | `NEXT_PUBLIC_APP_URL` |
|-------------|------------------------|
| **Target (launch)** | `https://app.freedompawsinc.com` |
| **Until DNS live** | Your Vercel URL, e.g. `https://freedompaws-app.vercel.app` |

Framer CTAs must use the same base as this table.

---

## All 10 protocols

| Slug | Card title (shop) | Spec category | XRP | RLUSD | App shop deep link |
|------|-------------------|---------------|-----|-------|-------------------|
| `max-movement` | Max Movement Pro – Joint Support | Joint & Mobility Protocol | 25 | 18 | `/token-shop?protocol=max-movement#max-movement` |
| `freedom-calm` | Freedom Calm – Anxiety Relief | Cognitive & Senior Support Protocol | 25 | 18 | `/token-shop?protocol=freedom-calm#freedom-calm` |
| `liver-kidney-detox` | Foundation Liver & Kidney Detox | Heart & Vital Organs Protocol | 25 | 18 | `/token-shop?protocol=liver-kidney-detox#liver-kidney-detox` |
| `gut-balance` | Buddy's Gut Balance & Cleanse | Digestive Harmony Protocol | 25 | 18 | `/token-shop?protocol=gut-balance#gut-balance` |
| `fresh-smile-dental` | Fresh Smile Dental & Oral Health | Holistic Wellness Baseline Protocol | 25 | 18 | `/token-shop?protocol=fresh-smile-dental#fresh-smile-dental` |
| `heart-strong` | Heart Strong Cardio-Support | Heart & Vital Organs Protocol | 25 | 18 | `/token-shop?protocol=heart-strong#heart-strong` |
| `infrared-spine` | Red Light Spine & Joint Support | Musculoskeletal Recovery Protocol | 25 | 18 | `/token-shop?protocol=infrared-spine#infrared-spine` |
| `allergy-shield` | Allergy Shield – Skin & Coat Glow | Allergy & Respiratory Relief Protocol | 25 | 18 | `/token-shop?protocol=allergy-shield#allergy-shield` |
| `patriot-immune` | Patriot Immune Defender – Immunity & Vitality | Immune Vitality Protocol | 25 | 18 | `/token-shop?protocol=patriot-immune#patriot-immune` |
| `clear-vision` | Clear Vision Defender – Eye Health Protocol | Eye & Vision Health Protocol | 25 | 18 | `/token-shop?protocol=clear-vision#clear-vision` |

**Buy intent link (app):** append `&buy=1` before the hash, e.g.  
`/token-shop?protocol=patriot-immune&buy=1#patriot-immune`

---

## Framer rule

Framer shows **education only**. Every “Buy” or “Get protocol” button → app buy link above. Do not publish a different price on Framer.

---

## Monthly sync checklist

- [ ] 10 slugs match `protocol-registry.ts`  
- [ ] Prices match `SHOP_PRICE` in `shop-items.ts`  
- [ ] Framer CTAs use current `NEXT_PUBLIC_APP_URL`  
- [ ] Test 3 deep links on iPhone PWA  

---

*Freedom Paws Wellness — June 5, 2026*
