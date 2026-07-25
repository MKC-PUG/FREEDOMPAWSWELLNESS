# Freedom Paws Wellness
# Vendor Outreach Plan, Onboarding Playbook & 5-Year Revenue Projections

**Document purpose:** Founder action plan for affiliate/print partner outreach before **October 2026 public launch**; timeline, how-to steps, and conservative / expected / optimistic revenue by income category (6-month periods, Years 1–5).

**Created:** June 27, 2026  
**Launch target:** October 2026 (public — `SITE_MODE=public`, LLC + trademark filed, attorney Terms/Privacy)  
**Primary funnel entry:** SuperBud Photo Booth → ViT → Protocols → Token Shop → ID / Wellness  
**Contact for partners:** partners@freedompawsinc.com  
**CRM source:** `docs/marketing/Freedom-Paws-CRM-Import-Ready-June-2026.csv` + in-app affiliate catalogs  

**Companion file (printable):** `~/Documents/Freedom Paws Wellness/Freedom-Paws-Vendor-Outreach-and-Revenue-Projections-Oct-2026-Launch.md` (copy of this doc)

**July 2026 — nutrition / Safe Picks philosophy:** Evidence-based selection, Wave 1 charity-aligned brands, Founding/Verified/Community tiers, and soft-vs-L5 timing are defined in [Verified Dog Health Partners Outreach Plan](./Freedom-Paws-Verified-Dog-Health-Partners-Outreach-Plan-July-2026.md). Print/Photo Booth and insurance/telehealth sections below remain the revenue timeline for non-nutrition vendors.

---

## Table of contents

1. [Executive summary — founder read first](#1-executive-summary--founder-read-first)
2. [Income categories (what we model)](#2-income-categories-what-we-model)
3. [Vendor inventory — full outreach list](#3-vendor-inventory--full-outreach-list)
4. [When to onboard — timing rules](#4-when-to-onboard--timing-rules)
5. [Outreach timeline (June → October 2026)](#5-outreach-timeline-june--october-2026)
6. [How to approach each vendor type](#6-how-to-approach-each-vendor-type)
7. [Step-by-step onboarding playbook](#7-step-by-step-onboarding-playbook)
8. [Founder to-do checklist (add to master schedule)](#8-founder-to-do-checklist-add-to-master-schedule)
9. [Financial projections — assumptions](#9-financial-projections--assumptions)
10. [Revenue tables — 6-month periods Years 1–5](#10-revenue-tables--6-month-periods-years-15)
11. [Photo Booth funnel economics](#11-photo-booth-funnel-economics)
12. [Risks & mitigations](#12-risks--mitigations)

---

## 1. Executive summary — founder read first

### Strategic view

Photo Booth is correctly positioned as the **top-of-funnel hook**: free cutout, backgrounds, and share — with **metered AI Magic Look** and **print/gift affiliates** as early monetization that does not require XRPL checkout. Token Shop remains the **core lifetime-value engine** ($18/protocol). Insurance and telehealth affiliates pay later in the journey (ViT concern/urgent contexts) with higher CPA but longer sales cycles.

**October launch is achievable for product** (app is far along). **October launch for full affiliate revenue** requires you to **start outreach in June–July 2026**, not September. The gap is not engineering — it is **signed links + attorney-approved disclosures**.

### Best time to onboard vendors

| Vendor type | Best window vs launch | Why |
|-------------|----------------------|-----|
| **Print-on-demand** (mug, pillow, blanket, cards) | **T−8 to T−4 weeks** (Aug–Sep for Oct launch) | Often self-serve affiliate; 1–3 week approval |
| **Custom framing B2B** | **T−12 to T−6 weeks** (Jul–Aug) | Custom co-marketing; 4–10 week negotiation |
| **Safe Picks / protocol brands** | **T−12 to T−4 weeks** | Impact/ShareASale apps; 2–4 weeks |
| **Pet insurance** | **T−16 to T−8 weeks** (Jun–Aug) | Compliance review; 4–8 weeks |
| **Holistic telehealth** | **T−12 to T−6 weeks** | Integration + disclosure review |
| **Token Shop / XRPL** | **Before launch** (already built) | Xaman verify live at launch |

**Rule of thumb:** Contact **12 weeks before launch** for anything needing a contract; **6 weeks before** for self-serve affiliate programs; **2 weeks before** for final URL paste + QA only.

### How long before launch to contact / sign

| Milestone | Weeks before Oct 1 launch | Action |
|-----------|---------------------------|--------|
| First outreach email | **16–14 weeks** (mid–late June) | Insurance, framing, top 5 Safe Picks |
| Self-serve affiliate apply | **12–10 weeks** (July) | Print POD, West Paw, Native Pet, Honest Kitchen |
| Tracking URLs in staging | **6 weeks** (mid-August) | `.env` on Vercel preview |
| Attorney disclosure sign-off | **4 weeks** (early September) | FTC affiliate language on all surfaces |
| Production URLs live | **2 weeks** (mid-September) | Flip “Launching soon” → “Order →” |
| Launch week QA | **0 weeks** | Click every affiliate link on iPhone PWA |

---

## 2. Income categories (what we model)

| Code | Category | Monetization | In app today |
|------|----------|--------------|--------------|
| **TS** | Token Shop (10 protocols) | ~$18 USD / 25 XRP per lifetime protocol | ✅ Live (XRPL) |
| **AI** | Photo Booth AI Magic Look packs | $2.99–$14.99 packs (Stripe TBD) | 🟡 Credits live; Stripe pending |
| **PB** | Photo Booth print affiliates | 8–15% commission on mug/pillow/blanket/card/frame orders | 🟡 Catalog live; URLs pending |
| **SP** | Safe Picks / protocol affiliates | 5–15% e-commerce commission | 🟡 Catalog live; URLs pending |
| **IN** | Pet insurance affiliate | $40–$80 CPA per enrolled policy | 🔴 Env URLs pending |
| **TH** | Holistic telehealth referral | $15–$35 per paid consult | 🔴 Env URLs pending |
| **MB** | Membership bundle (future) | ~$18/mo (AI + vault) | 🔴 Not shipped |
| **ID** | Freedom Paws ID premium (future) | Pilot pricing TBD | 🟡 TN pilot |

*Give-back reserve:* Model **10% of Token Shop + affiliate net** to veterans/shelters (50/50) — excluded from “founder net” below unless noted.

---

## 3. Vendor inventory — full outreach list

### A. Photo Booth print & gift (priority — funnel monetization)

| ID | Product | In-app label | Outreach targets | Env variable |
|----|---------|--------------|------------------|------------|
| `custom-framing` | Framed print | Framed & ready to display | Framebridge, Simply Framed, American Frame | `NEXT_PUBLIC_FP_PHOTO_AFF_CUSTOM_FRAMING_URL` |
| `coffee-mug` | Drinkware | Photo coffee mug | Shutterfly, VistaPrint, Zazzle | `NEXT_PUBLIC_FP_PHOTO_AFF_COFFEE_MUG_URL` |
| `photo-pillow` | Home décor | Photo pillow | Shutterfly, VistaPrint, Snapfish | `NEXT_PUBLIC_FP_PHOTO_AFF_PHOTO_PILLOW_URL` |
| `photo-blanket` | Pet textiles | Photo blanket (non-toxic) | Printful, Shutterfly, VistaPrint, Zazzle | `NEXT_PUBLIC_FP_PHOTO_AFF_PHOTO_BLANKET_URL` |
| `greeting-cards` | Cards | Christmas & greeting cards | Minted, Shutterfly, Tiny Prints | `NEXT_PUBLIC_FP_PHOTO_AFF_GREETING_CARDS_URL` |

**Standards page:** `/photobooth/partners`  
**Non-toxic blanket requirement:** Pet-safe inks; no harmful dyes or chemical finishes — document in affiliate agreement.

### B. Safe Picks (whole-food & non-toxic products)

**Tier 1 / Wave 1 (charity-aligned + educational fit — see Verified Partners Plan):** The Honest Kitchen, Open Farm, Farm Hounds, Raised Right, Four Leaf Rover, Adored Beast, Nordic Naturals, Green Juju, JustFoodForDogs, Standard Process Veterinary.

Also keep toy/chew Safe Picks catalog brands (West Paw, Whimzees, etc.) for `/wellness/safe-products`.

Env pattern: `NEXT_PUBLIC_FP_SAFE_{PRODUCT_ID}_URL` (e.g. `WEST_PAW`, `HONEST_KITCHEN`). Soft interest pre-L5; production URLs after attorney disclosure sign-off.

### C. Protocol page affiliates (10 protocols × 2 picks each)

See `lib/protocols/affiliates.ts` — env pattern:  
`NEXT_PUBLIC_FP_PROTOCOL_{SLUG}_AFF_{1|2|3}_URL`

### D. Insurance affiliates

CRM rows 1–15+ in `Freedom-Paws-CRM-Import-Ready-June-2026.csv` — start with Pets Best, Spot, Figo, ASPCA Pet Health.

Env: `NEXT_PUBLIC_FP_INSURANCE_QUOTE_URL`, `_LOST_DOG_URL`, `_URGENT_URL`

### E. Holistic telehealth

Start with Vetster (+ integrative vet filter). Env: `NEXT_PUBLIC_FP_TELEHEALTH_BOOK_URL`

---

## 4. When to onboard — timing rules

**Do not wait until launch month** to email partners. Sequencing:

1. **June–July 2026** — Self-serve affiliate applications (print + Safe Picks tier 1). Zero legal blocker for “Launching soon” UI.
2. **July–August 2026** — Insurance + telehealth + framing B2B conversations.
3. **August 2026** — Paste approved tracking URLs into Vercel **preview**; iPhone QA.
4. **September 2026** — Attorney reviews affiliate disclosures; production env flip.
5. **October 2026** — Public launch with Photo Booth → print revenue day one.

**Photo Booth can earn before Token Shop converts:** A member who never buys a protocol can still generate **print affiliate commission** and **AI pack revenue**.

---

## 5. Outreach timeline (June → October 2026)

| Week (approx.) | Dates | Founder actions | Engineering |
|----------------|-------|-----------------|-------------|
| **W1–W2** | Jun 16–29 | Export CRM; send 5 print POD applications; email Framebridge/Simply Framed intro | ✅ Print affiliate catalog shipped |
| **W3–W4** | Jun 30–Jul 13 | Apply: West Paw, Native Pet, Honest Kitchen, Open Farm affiliates | Paste first URLs if approved |
| **W5–W6** | Jul 14–27 | Insurance: Pets Best + Spot applications; telehealth: Vetster | Insurance/telehealth env when URLs arrive |
| **W7–W8** | Jul 28–Aug 10 | Follow up pending apps; negotiate blanket **non-toxic** SKU with Printful/Shutterfly | QA all affiliate links on iPhone |
| **W9–W10** | Aug 11–24 | Attorney: review `/photobooth/partners`, Safe Picks, insurance disclosures | Staging env complete |
| **W11–W12** | Aug 25–Sep 7 | LLC + trademark filed (launch gate); Framer DNS when ready | Stripe AI packs if counsel approves |
| **W13–W14** | Sep 8–21 | Production affiliate URLs; disable “Launching soon” per partner | PWA deploy; `SITE_MODE` prep |
| **W15–W16** | Sep 22–Oct 5 | Launch QA checklist; influencer seed Photo Booth | Public launch 🚀 |

---

## 6. How to approach each vendor type

### Print-on-demand & gifts (fastest revenue)

**Method:** Affiliate program signup (ShareASale, Impact, CJ, or brand direct).  
**Pitch angle:** “Freedom Paws Photo Booth — members upload pet portraits; we drive high-intent gift buyers; pet-safe/non-toxic positioning for blankets.”  
**Ask for:** Deep link, sub-ID tracking, commission rate, sample order discount for founder QA, written confirmation on blanket ink/material safety.

### Custom framing (longer cycle)

**Method:** B2B email to partnerships@ — attach 1-page appendix (Photo Booth screenshot + `/photobooth/partners` standards).  
**Pitch angle:** Ready-to-hang gifts; veteran & shelter give-back story.  
**Ask for:** Affiliate or rev-share, 30-day cookie, co-branded landing page optional.

### Safe Picks / nutrition brands

**Method:** Use Verified Partners positioning + each brand’s affiliate/BD page; charity-aligned Wave 1 first.  
**Pitch angle:** Evidence-based canine health — sourcing, contaminant testing, manufacturing, scientific integrity; educational reviews/webinars, not links only. Template: Verified Partners Plan §8.  
**Ask for:** Tracking link (post-L5), educational collab, optional Give Back Alliance commission %.

### Insurance

**Method:** Formal affiliate application + compliance questionnaire.  
**Pitch angle:** ViT diagnostics → prevention + urgent-care funnel; lost-pet ID integration roadmap.  
**Ask for:** Quote, lost-dog, and urgent-care deep links; CPA rate card; state licensing confirmation.

### Telehealth

**Method:** Affiliate or provider network application (Vetster model).  
**Pitch angle:** Holistic / integrative vets only; wellness-first, not pharma-first.  
**Ask for:** Book consult URL, referral fee schedule, integrative vet filter.

---

## 7. Step-by-step onboarding playbook

### For each print/gift partner (repeat × 5)

1. [ ] Select primary vendor from outreach targets column in `lib/photobooth/affiliates.ts`
2. [ ] Create affiliate account on their network (save login in password manager)
3. [ ] Complete tax W-9 / payment profile on network
4. [ ] Apply to brand program; use website URL `https://app.freedompawsinc.com/photobooth`
5. [ ] In application notes: “Pet photo gift funnel; non-toxic positioning for blankets”
6. [ ] Receive approval email (typically 3–14 days)
7. [ ] Generate tracked link → product category landing (mug, blanket, cards, etc.)
8. [ ] Test link on iPhone: upload sample PNG from Photo Booth export
9. [ ] Add URL to Vercel: `NEXT_PUBLIC_FP_PHOTO_AFF_{ID}_URL`
10. [ ] Redeploy app; confirm “Order →” replaces “Launching soon”
11. [ ] Log in CRM spreadsheet: status = Live, date, commission rate
12. [ ] Screenshot disclosure on partner checkout for records

### For each Safe Picks / protocol affiliate

1. [ ] Apply via brand affiliate page (see CRM CSV column “Apply URL”)
2. [ ] Map product to protocol slug(s) in catalog
3. [ ] Set env URL per naming convention in `lib/protocols/affiliates.ts` or `lib/wellness/safe-products.ts`
4. [ ] Verify “Shop partner →” on protocol detail page + Safe Picks page
5. [ ] Log commission rate and cookie window

### For insurance + telehealth

1. [ ] Read `/wellness/partners/insurance` and `/wellness/partners/telehealth` standards
2. [ ] Send intro email from partners@freedompawsinc.com (template in Section 8)
3. [ ] Complete partner compliance forms
4. [ ] Legal review of co-marketing language
5. [ ] Set `NEXT_PUBLIC_FP_INSURANCE_*` and `NEXT_PUBLIC_FP_TELEHEALTH_*` env vars
6. [ ] Test from ViT results → Wellness Partner Panel CTAs

### Universal legal / FTC (once per launch)

1. [ ] Counsel reviews: Token Shop Terms, Privacy, affiliate disclosures on Photo Booth, protocols, wellness
2. [ ] Confirm “sponsored” / commission language on all outbound affiliate links
3. [ ] Document give-back 10% calculation methodology

---

## 8. Founder to-do checklist (add to master schedule)

### June 2026 (now)

- [ ] Copy this doc to founder binder; block 2 hrs/week for “Partner Outreach”
- [ ] Run `npm run marketing:crm-export` (if script exists) or use CRM CSV
- [ ] Apply to **2 print POD networks** (Shutterfly + Printful or VistaPrint)
- [ ] Send **framing B2B intro** (Framebridge + Simply Framed)
- [ ] Apply **West Paw + Native Pet + Honest Kitchen** affiliates

### July 2026

- [ ] Apply **Pets Best + Spot** insurance affiliates
- [ ] Apply **Vetster** telehealth affiliate
- [ ] First **5 affiliate URLs** in Vercel preview
- [ ] Order sample mug + **non-toxic blanket** for QA (founder expense)

### August 2026

- [ ] Chase pending applications (weekly follow-up)
- [ ] Attorney disclosure review scheduled
- [ ] Minted / greeting card affiliate for Christmas season
- [ ] Framer marketing site CTAs → Photo Booth live

### September 2026

- [ ] All launch-tier affiliate URLs in **production** env
- [ ] LLC + trademark filed (launch gate)
- [ ] Stripe AI credit packs (optional at launch)
- [ ] Full iPhone PWA affiliate click-through test

### October 2026 — launch

- [ ] `SITE_MODE=public` + DNS live
- [ ] Monitor: affiliate clicks, Photo Booth sessions, Token Shop conversions weekly
- [ ] First month: **do not** add new vendor categories — stabilize ops

### Email template (copy/paste)

**Subject:** Freedom Paws Wellness — Photo Booth pet portrait affiliate partnership

Hello [Partner] partnerships team,

Freedom Paws Wellness (https://app.freedompawsinc.com) is a holistic pet wellness PWA launching publicly in **October 2026**. Our **SuperBud Photo Booth** lets members create pet portraits; we refer high-intent customers to print partners for framed prints, mugs, pillows, **non-toxic photo blankets**, and holiday cards.

We request: affiliate or rev-share tracking links, commission schedule, and confirmation of pet-safe materials (blankets/infant-safe inks where applicable). Standards: https://app.freedompawsinc.com/photobooth/partners

10% of our net supports veteran dog organizations and shelters.

Best,  
[Name]  
partners@freedompawsinc.com

---

## 9. Financial projections — assumptions

### Shared drivers (6-month periods)

| Assumption | Conservative | Expected | Optimistic |
|------------|--------------|----------|------------|
| Launch month | Oct 2026 | Oct 2026 | Oct 2026 |
| Y1 geographic focus | TN + organic US | TN + social + Framer | TN + influencer burst |
| Photo Booth sessions / 6 mo (Y1 H2) | 800 | 3,500 | 12,000 |
| Photo Booth session growth Y2→Y5 | +40% / half | +70% / half | +120% / half |
| Token Shop conversion (from engaged users) | 1.2% | 2.5% | 4.5% |
| Protocol price (avg) | $18 | $18 | $18 |
| AI pack buyers / 6 mo (Y1 H2) | 40 | 180 | 650 |
| AI pack avg revenue | $5 | $6 | $7 |
| Print affiliate orders / 6 mo (Y1 H2) | 25 | 120 | 450 |
| Print avg commission | $5 | $6 | $8 |
| Safe Picks orders / 6 mo (Y1 H2) | 15 | 70 | 220 |
| Safe Picks avg commission | $8 | $10 | $12 |
| Insurance enrollments / 6 mo (Y1 H2) | 3 | 12 | 35 |
| Insurance CPA | $45 | $60 | $75 |
| Telehealth bookings / 6 mo (Y1 H2) | 5 | 25 | 80 |
| Telehealth avg referral | $18 | $22 | $28 |
| Membership paying users (end Y2+) | slow | moderate | fast |

*All figures USD, **gross to Freedom Paws** before 10% give-back, COGS (AI API ~$0.04/look), and operating expenses.*

### Year labels

| Period | Calendar (launch Oct 2026) |
|--------|----------------------------|
| Y1 H1 | Oct 2026 – Mar 2027 (ramp) |
| Y1 H2 | Apr 2027 – Sep 2027 |
| Y2 H1 | Oct 2027 – Mar 2028 |
| … | … |
| Y5 H2 | Apr 2031 – Sep 2031 |

---

## 10. Revenue tables — 6-month periods Years 1–5

### 10.1 Conservative scenario (USD per 6-month period)

| Period | TS | AI | PB | SP | IN | TH | MB | **Total** |
|--------|-----|-----|-----|-----|-----|-----|-----|-----------|
| Y1 H1 | 900 | 120 | 75 | 60 | 0 | 45 | 0 | **1,200** |
| Y1 H2 | 2,700 | 200 | 125 | 120 | 135 | 90 | 0 | **3,370** |
| Y2 H1 | 4,500 | 350 | 200 | 200 | 225 | 150 | 600 | **6,225** |
| Y2 H2 | 6,300 | 480 | 280 | 280 | 315 | 210 | 1,800 | **9,665** |
| Y3 H1 | 8,400 | 650 | 390 | 390 | 420 | 280 | 3,600 | **14,130** |
| Y3 H2 | 10,500 | 850 | 500 | 500 | 525 | 350 | 5,400 | **18,625** |
| Y4 H1 | 12,600 | 1,050 | 620 | 620 | 630 | 420 | 8,100 | **24,040** |
| Y4 H2 | 14,700 | 1,250 | 750 | 750 | 735 | 490 | 10,800 | **29,475** |
| Y5 H1 | 16,800 | 1,450 | 880 | 880 | 840 | 560 | 13,500 | **34,910** |
| Y5 H2 | 18,900 | 1,650 | 1,010 | 1,010 | 945 | 630 | 16,200 | **40,345** |

**Y5 H2 annualized run rate ≈ $80k/year** (conservative).

### 10.2 Expected scenario (USD per 6-month period)

| Period | TS | AI | PB | SP | IN | TH | MB | **Total** |
|--------|-----|-----|-----|-----|-----|-----|-----|-----------|
| Y1 H1 | 2,700 | 360 | 240 | 180 | 0 | 120 | 0 | **3,600** |
| Y1 H2 | 8,100 | 1,080 | 720 | 700 | 720 | 550 | 0 | **11,870** |
| Y2 H1 | 14,400 | 1,900 | 1,200 | 1,200 | 1,440 | 1,100 | 2,160 | **23,400** |
| Y2 H2 | 22,500 | 3,000 | 1,900 | 1,900 | 2,160 | 1,650 | 4,320 | **38,330** |
| Y3 H1 | 33,000 | 4,400 | 2,800 | 2,800 | 3,240 | 2,475 | 7,560 | **56,275** |
| Y3 H2 | 45,000 | 6,000 | 3,800 | 3,800 | 4,320 | 3,300 | 12,960 | **79,180** |
| Y4 H1 | 58,500 | 7,800 | 4,900 | 4,900 | 5,760 | 4,400 | 19,440 | **105,700** |
| Y4 H2 | 72,000 | 9,600 | 6,100 | 6,100 | 7,200 | 5,500 | 27,000 | **133,500** |
| Y5 H1 | 85,500 | 11,400 | 7,200 | 7,200 | 8,640 | 6,600 | 36,000 | **162,540** |
| Y5 H2 | 99,000 | 13,200 | 8,300 | 8,300 | 10,080 | 7,700 | 45,000 | **191,580** |

**Y5 H2 annualized run rate ≈ $383k/year** (expected).

### 10.3 Optimistic scenario (USD per 6-month period)

| Period | TS | AI | PB | SP | IN | TH | MB | **Total** |
|--------|-----|-----|-----|-----|-----|-----|-----|-----------|
| Y1 H1 | 7,200 | 1,400 | 900 | 600 | 0 | 400 | 0 | **10,500** |
| Y1 H2 | 21,600 | 4,550 | 3,600 | 2,640 | 2,625 | 2,240 | 0 | **37,655** |
| Y2 H1 | 43,200 | 9,100 | 7,200 | 5,280 | 5,625 | 4,480 | 7,200 | **82,085** |
| Y2 H2 | 72,000 | 15,600 | 12,000 | 8,800 | 9,450 | 7,840 | 14,400 | **140,090** |
| Y3 H1 | 108,000 | 23,400 | 18,000 | 13,200 | 14,400 | 11,760 | 28,800 | **217,560** |
| Y3 H2 | 144,000 | 31,200 | 24,000 | 17,600 | 19,200 | 15,680 | 43,200 | **294,680** |
| Y4 H1 | 180,000 | 39,000 | 30,000 | 22,000 | 24,000 | 19,600 | 64,800 | **379,400** |
| Y4 H2 | 216,000 | 46,800 | 36,000 | 26,400 | 28,800 | 23,520 | 86,400 | **463,920** |
| Y5 H1 | 252,000 | 54,600 | 42,000 | 30,800 | 33,600 | 27,440 | 108,000 | **548,440** |
| Y5 H2 | 288,000 | 62,400 | 48,000 | 35,200 | 38,400 | 31,360 | 129,600 | **632,960** |

**Y5 H2 annualized run rate ≈ $1.27M/year** (optimistic — requires national scale + membership).

### 10.4 Category share (expected, Y3 H2)

| Category | $ | Share |
|----------|---|-------|
| Token Shop | 45,000 | 57% |
| Membership | 12,960 | 16% |
| Insurance | 4,320 | 5% |
| Safe Picks | 3,800 | 5% |
| Photo Booth print | 3,800 | 5% |
| AI packs | 6,000 | 8% |
| Telehealth | 3,300 | 4% |

Photo Booth **direct** revenue (AI + print) ≈ **13%** in expected Y3 H2; **funnel value** to Token Shop is additional.

---

## 11. Photo Booth funnel economics

```
Framer / social → Photo Booth (free) → Share / Save
                              ↓
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
        Print affiliate   AI Magic Look    ViT / Protocols
        ($5–8 comm.)      ($3–7 ARPU)      → Token Shop ($18)
                              ↓
                        Wellness / ID / Insurance (later)
```

**Founder insight:** Print affiliates monetize **non-crypto buyers** immediately. Do not treat Photo Booth as “free only” — treat **print + AI** as Year 1 cashflow while Token Shop builds trust.

**Target launch mix (Oct 2026 – Mar 2027):** 60% effort on 2 live print partners (mug + blanket or cards); 30% on 1 insurance; 10% on Safe Picks tier 1.

---

## 12. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| October launch slips (LLC/TM/legal) | Photo Booth + print affiliates can soft-launch in preview with DNS to app subdomain |
| Affiliate approval denied | Apply to 2 vendors per category; use Impact/CJ network links |
| Blanket material not non-toxic | Require written spec + order founder sample before promoting |
| Low print conversion | A/B CTA in Export drawer; seasonal push (Christmas cards Sep–Dec) |
| AI cost overrun | Keep credits metered; Replicate billing cap |
| Over-promising revenue | Use **conservative** row for budgeting; expected for planning |

---

*Freedom Paws Wellness — internal founder planning document. Not financial advice. Update assumptions quarterly from actual analytics.*
