# Freedom Paws Wellness
# Canonical Shop Decision — Framer vs App (XRPL-First) + Session Thread

**Document purpose:** Re-evaluate Framer vs Next.js app as canonical Token Shop given **XRPL/Xaman primary payments** (XRP + RLUSD), Stripe as **secondary** alternative; record full conversation thread through June 5, 2026 session.

**Date:** June 5, 2026  
**Project:** `freedompaws-app` (Next.js PWA, Vercel)  
**Current PWA release:** v42  
**Related:** `Freedom-Paws-Launch-Todo-Prioritized-June-2026.md`, `Conversation-Review-ViT-Framer-and-Roadmap-May-2026.md`

---

## Table of contents

1. [Founder payment decision](#1-founder-payment-decision)
2. [Re-evaluation: Framer vs App (XRPL-first)](#2-re-evaluation-framer-vs-app-xrpl-first)
3. [Recommended architecture at scale](#3-recommended-architecture-at-scale)
4. [Checkout UX (primary + secondary rails)](#4-checkout-ux-primary--secondary-rails)
5. [What Framer still owns](#5-what-framer-still-owns)
6. [Implementation roadmap (shop + payments)](#6-implementation-roadmap-shop--payments)
7. [P0 status after this decision](#7-p0-status-after-this-decision)
8. [Full session thread (June 5, 2026)](#8-full-session-thread-june-5-2026)

---

## 1. Founder payment decision

**Primary payment rail (launch and scale):**

- **XRPL** via **Xaman** (formerly XUMM) wallet  
- Currencies: **XRP** and **RLUSD**  
- Product: protocol **MPT / Dynamic NFT** educational access (per protocol detail copy)

**Secondary payment rail (later, optional for members without crypto):**

- **Stripe** (card / fiat) — offered as **alternative #2**, not primary  
- Strategic view: banking may adopt digital assets (RLUSD, etc.) post–Clarity Act (2026–2030); Stripe’s XRPL alignment is a future bridge, not today’s main path

**Implication for canonical shop:** Payment rails need wallet connect, XUMM payloads, transaction verification, and post-payment unlock — all favor a **code-first app**, not a Framer brochure checkout.

---

## 2. Re-evaluation: Framer vs App (XRPL-first)

### Framer as canonical shop — with XRPL primary

| Advantage | Notes under XRPL-first |
|-----------|------------------------|
| Marketing edits without deploy | Still true for **teaser** pages |
| SEO on `freedompawsinc.com` | Protocol **story** pages; buy CTA → app |
| Grants/mission next to “learn more” | Framer strength — not full checkout |
| Simple Xaman deep link / QR on a page | Possible for one-off invoices |

| Disadvantage | Why it blocks scale with XRPL-first |
|--------------|-------------------------------------|
| No durable backend | Cannot verify XRPL tx hash, listen for settlement, or run XUMM webhooks reliably |
| Wallet session state | “Connected wallet” + “protocol unlocked” must persist in app / DB |
| ViT → buy funnel | User leaves PWA mid-flow to pay on Framer — hurts conversion on iPhone |
| MPT / Dynamic NFT logic | Mint, transfer, or gate content — requires server + XRPL integration |
| Dual price sources | `SHOP_PRICE` (25 XRP / 18 RLUSD) in app vs Framer manual edits → drift |
| Stripe as #2 | Second rail in same checkout component is natural in app; awkward as two sites |
| `NEXT_PUBLIC_XUMM_API_KEY` | Already on **Vercel** — belongs in app, not Framer embed |

**Verdict (XRPL-first):** Framer is a poor **canonical checkout** home. It can host **marketing + education**, not the wallet/commerce engine.

---

### App (`/token-shop`) as canonical shop — with XRPL primary

| Advantage | Notes under XRPL-first |
|-----------|------------------------|
| **Aligns with brand** | “Tokenized Holistic Wellness on XRPL” — shop lives where tokens are sold |
| **Xaman native flow** | Mobile: ViT result → Token Shop → **WALLET** → Xaman app → sign XRP/RLUSD payment → return to PWA |
| **Prices already in code** | `shop-items.ts`: `SHOP_PRICE = { xrp: 25, rlusd: 18 }` |
| **Deep links wired** | ViT results → `/token-shop#slug`; `tokenShopBuyHref()` ready for `?buy=1` |
| **Post-payment unlock** | Verify XRPL payment → unlock protocol in session / My Pets / Monitor tier |
| **Stripe as secondary** | Same page: “Pay with Xaman (recommended)” + “Pay with card (Stripe)” below |
| **Future RLUSD/Stripe bridge** | One codebase adds rail when Stripe ↔ XRPL matures — no Framer migration |
| **Single member journey** | Install PWA → diagnose → buy → vault — no domain hopping |

| Disadvantage | Mitigation |
|--------------|------------|
| Deploy to change prices | Source-of-truth spreadsheet; rare deploys |
| Shop SEO on subdomain | Framer teasers + canonical links to `app.../token-shop#slug` |

**Verdict (XRPL-first):** **App is the clear canonical shop** — stronger than before, not weaker.

---

### Comparison matrix (XRPL-first + Stripe secondary)

| Criterion | Framer shop | **App shop (recommended)** |
|-----------|-------------|----------------------------|
| Xaman / XUMM integration | Embed/deeplink only; weak state | **Full SDK + API key on Vercel** |
| XRP + RLUSD checkout | Manual QR / external | **Structured per-protocol payloads** |
| Payment verification | External / manual | **Server-side tx verify → unlock** |
| ViT → purchase conversion | Leave PWA | **In-app funnel** |
| MPT / Dynamic NFT gating | Not scalable | **Tied to wallet + unlock table** |
| Stripe as #2 option | Second site or duplicate | **Second button, same cart** |
| 2030 digital-asset banking | Disconnected | **Extend same checkout module** |
| Founder mission (XRPL, grants) | Story only | **Story (Framer) + commerce (App)** |

---

## 3. Recommended architecture at scale

```
freedompawsinc.com          → Framer (marketing ONLY)
  • Grants, veterans, shelters, mission, SEO protocol stories
  • CTA: "Open in Freedom Paws App" → purchase with Xaman
  • NO canonical checkout — optional "from 25 XRP" teaser text synced from sheet

app.freedompawsinc.com      → Next.js PWA (CANONICAL commerce + tools)
  • ViT, Photo Booth, Monitor, My Pets vault
  • Token Shop — PRIMARY: Xaman + XRP/RLUSD
  • Token Shop — SECONDARY: Stripe (when enabled)
  • WALLET navbar → connect / pay / view holdings
```

**Domain note:** Until `app.` DNS is live, use Vercel production URL in Framer CTAs; swap when subdomain is configured.

---

## 4. Checkout UX (primary + secondary rails)

### Primary — Xaman (recommended label in UI)

1. Member on `/token-shop#patriot-immune` (or from ViT results).  
2. Tap **Pay with Xaman** (or **WALLET** in nav).  
3. App creates XUMM payload: amount in **XRP or RLUSD**, memo/protocol id.  
4. Xaman app opens → member signs.  
5. App backend verifies tx on XRPL → marks protocol unlocked.  
6. My Pets / protocol content gates open.

### Secondary — Stripe (when added)

- Same protocol card: smaller or tertiary CTA — **“Pay with card (alternative)”**  
- Stripe Checkout → webhook → same unlock table (fiat path for non-crypto members)  
- Copy: crypto/XRPL is preferred; card is convenience until wallet adoption grows  
- Future: if Stripe settles RLUSD on XRPL, swap backend rail without changing shop URL

### Copy alignment needed

- Protocol `details.ts` still says “Connect wallet on freedompawsinc.com” — **update to app Token Shop + Xaman** when checkout ships.  
- Framer pages: never imply a different price or wallet URL than the app.

---

## 5. What Framer still owns

| Framer | App |
|--------|-----|
| Homepage story, grants, press | PWA install, tools, shop, wallet |
| Protocol **education** long-form | Protocol **detail** pages in app (already live) |
| SEO for mission keywords | ViT, Photo Booth, Monitor APIs |
| “Learn about Patriot Immune” teasers | “Buy Patriot Immune — 25 XRP” checkout |
| Social proof, veteran/shelter narrative | Transaction history, unlock state |

**Rule:** One **buy URL** — always `app.../token-shop#slug` (or `?buy=1` for direct purchase intent).

---

## 6. Implementation roadmap (shop + payments)

| Phase | Task | Priority |
|-------|------|----------|
| **A** | Lock decision: **App = canonical shop** | P0 — done (this doc) |
| **B** | Protocol & price source-of-truth sheet ↔ `shop-items.ts` | P0 |
| **C** | Framer CTAs → app `/diagnostics`, `/photobooth`, `/token-shop#slug` | P0 |
| **D** | XUMM payload + XRPL payment verify API route | P1 |
| **E** | Wire Navbar **WALLET** → Xaman connect + pay | P1 |
| **F** | Post-payment unlock (session → later My Pets account) | P1–P2 |
| **G** | Stripe Checkout as secondary button + webhook | P5 (after XRPL path works) |
| **H** | Update protocol details wallet copy → app shop | P1 |

---

## 7. P0 status after this decision

| P0 item | Status |
|---------|--------|
| ViT production + OpenAI on Vercel | ✅ Complete (user validated iPhone) |
| Vision UI promoted (v41) | ✅ Shipped |
| Homepage SuperBud hero (v42) | ✅ Shipped |
| **Canonical shop decision** | ✅ **App + XRPL/Xaman primary** |
| Domains `freedompawsinc.com` + `app.` | ⏳ Confirm DNS when ready |
| Source-of-truth price sheet | ⏳ Next implementation step |
| Framer CTAs + app footer → Framer grants | ⏳ Next implementation step |
| Update Conversation-Review §8 | ⏳ After wiring |

**Remaining P0:** Implementation of Framer ↔ app links and source-of-truth sheet — not the strategic decision.

---

## 8. Full session thread (June 5, 2026)

Chronological record of this Cursor session arc (post–Monitor park, launch planning focus).

---

### 1. Park Monitor; launch TO-DO docs

**User:** Park Monitor; focus ViT, Photo Booth, Toolbox/My Pets vault; full cloud relay at launch; create prioritized TO-DO + completed-items docs in `docs/`; continue most important first.

**Done:**

- `docs/Freedom-Paws-Launch-Todo-Prioritized-June-2026.md`  
- `docs/Freedom-Paws-Completed-Items-June-2026.md`  
- Monitor beta parked for members; cloud relay remains P3 launch requirement.

---

### 2. P0 — ViT production verify

**User:** Vercel env screenshot — `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `HUGGINGFACE_TOKEN`, `NEXT_PUBLIC_XUMM_API_KEY` configured.

**Advised:** Run production ViT on iPhone; confirm “Photo + AI vision” and visual findings.

**User:** “DO NOT SEE VISUAL OBSERVATIONS”

**Finding:** Vision was working; section was **below** protocol cards with low-contrast grey styling — easy to miss on scroll.

**User:** “YES VISUAL OBSERVATION IS THERE” — P0 ViT verify complete.

---

### 3. Promote vision UI + push v41

**User:** “promote vision UI, THEN NEXT STEP”

**Shipped (v41, commit `17e2267`):**

- Moved **👁️ What AI saw from your photo** above protocol cards  
- Amber border, stronger typography  
- `PWA_VERSION` v41, `sw.js` cache bump  

**Next advised:** Framer P0 #2 (canonical shop + domains).

---

### 4. Homepage hero + push v42

**User:** Replace homepage SuperBud headline with new mountain valley patriotic cape image.

**Shipped (v42, commit `f7a0f43`):**

- `public/images/welcome-hero.png` (1024×587)  
- `app/page.tsx` updated  
- PWA v42  

**User confirmed:** v41 vision UI visible on iPhone.

---

### 5. P0 completion check

**User:** “Are we completed with all P0 tasks?”

**Answer:** **Not fully.** ViT + deploy ~done; **Framer + app split** and website quick wins **not started**. Technical P0 complete; business/integration P0 open.

---

### 6. Should we do P0 now?

**User:** P0 blocks production / next build — should we do it now?

**Answer:**

- **Yes** to close P0 before P1 shop/protocol work.  
- **No** if coding Photo Booth or My Pets today (those don’t need Framer).  
- Framer = ~30 min decisions, then one Cursor session to wire links.

---

### 7. Framer vs App — first evaluation

**User:** Advantages of Framer vs App as canonical shop; best choice for scaling.

**First recommendation:** **App = canonical shop**; Framer = marketing teasers only.

**Reasons:** ViT → buy funnel, Stripe webhooks, wallet, single `shop-items.ts`, membership unlocks, “everything app” model.

---

### 8. Payment strategy + re-evaluation (this message)

**User decisions:**

1. **All payments flow through XRPL** using **Xaman/XUMM**, **RLUSD & XRP**.  
2. **Stripe** = alternative **second** option, not primary.  
3. Strategic view: digital currencies via banking after Clarity Act (2026–2030); Stripe may integrate XRPL later.  
4. Re-evaluate Framer vs App with this payment model.  
5. Save **entire thread** to documents file.

**Re-evaluation conclusion:** XRPL-first **strengthens App as canonical shop**. Framer remains marketing/education; commerce, wallet, verification, and dual-rail checkout (Xaman primary, Stripe secondary) belong in the **Next.js PWA**.

**Locked decisions:**

| Decision | Choice |
|----------|--------|
| Canonical shop | **Next.js app `/token-shop`** |
| Primary payments | **Xaman + XRP + RLUSD** |
| Secondary payments | **Stripe** (later, same shop page) |
| Framer role | Marketing, grants, SEO teasers → CTA to app |
| Domains (target) | `freedompawsinc.com` + `app.freedompawsinc.com` |

---

### 9. Next steps (after this doc)

1. Confirm **domains** yes/no and current Vercel URL for Framer CTAs.  
2. Create **Protocol & Price Source of Truth** from `shop-items.ts` + `protocol-registry.ts`.  
3. Wire Framer CTAs + app footer links to Framer grants.  
4. Begin **XUMM checkout** in app (P1) — primary rail before Stripe.  
5. Continue P1: Photo Booth Phase 2 or My Pets MVP in parallel if desired.

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Shop strategy + session thread — June 5, 2026*
