# Freedom Paws Wellness — Product Lines Master Document

**Products covered:** (1) Shelter Scanner Kit · (2) DVM VitProScan (scanner + ID + CDS) · (3) Member ID & ViT Diagnostics  
**Document purpose:** BOM, unit economics, 6-month revenue/margin projections (Y0.5–Y5), distribution, inventory, and promotion guidance.  
**Created:** June 28, 2026  
**Launch anchor:** Public biometric pilot **October 2026** · Scanner kit promotion **January 2027** · ViT Pro B2B pilot **Q1 2027**  
**Scenario:** **Base (expected)** in detail below · **Conservative** and **Aggressive** in [§ Scenario comparison](#scenario-comparison--conservative--base--aggressive)  
**Investor one-pager:** `Freedom-Paws-Products-Investor-One-Pager-June-2026.md` (same folders)

**Saved copy:** `~/Documents/Freedom Paws Wellness/`  
**Spreadsheet:** `Freedom-Paws-Product-Lines-6mo-Projections-Y0.5-Y5.csv` (+ scenario columns)

**Related:** `docs/ops/TRACK-2-RETAIL-SCANNER-KIT-PLAN-June-20-2026.md` · `docs/ops/ViT-PRO-BUSINESS-PLAN-AND-ROADMAP-June-2026.md` · `docs/Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md`

---

## Investor one-page executive summary

*Printable standalone copy: `Freedom-Paws-Products-Investor-One-Pager-June-2026.md`*

### The opportunity

**Freedom Paws Wellness** is a phone-first pet wellness and reunion platform: **ViT Diagnostics** for pet parents, **Freedom Paws ID** (biometric + optional chip link), and **VitProScan** — B2B clinical decision support for veterinarians — in one PWA. Mission hardware (Universal Scan Kits) locks in shelters and drives found-pet intake.

**Live:** [app.freedompawsinc.com](https://app.freedompawsinc.com) (PWA v94) · **Pilot:** Tennessee shelters + advisor DVMs · **Public launch:** October 2026

### Three revenue lines

| Line | Buyer | Model | Y5 base run rate (6 mo) |
|------|-------|-------|-------------------------:|
| **Shelter Scanner Kit** | Shelters / retail | $129 retail · ~$85 COGS · 80% donated (mission) | **~$7.5K** rev · mission CAC |
| **VitProScan (DVM)** | Vet clinics | $199–299/mo + $0.75/scan · optional $149 scanner | **~$310K** · **320** practices |
| **Member ID & ViT** | Pet parents | Free ViT funnel → ~$18 protocols · $9.99/mo membership | **~$195K** · **1,300** paying |

### Y5 endpoint — three scenarios (Apr–Sep 2031, 6-month period)

| Metric | Conservative | **Base** | Aggressive |
|--------|-------------:|---------:|-----------:|
| **Total revenue (6 mo)** | $344K | **$513K** | $825K |
| **Gross profit (6 mo)** | $268K | **$416K** | $678K |
| VitProScan practices (EOY) | 220 | **320** | 550 |
| Paying members (EOY) | 910 | **1,300** | 1,820 |
| Scanner kits shipped (6 mo) | 26 | **32** | 40 |
| **5-year cumulative revenue** | ~$1.54M | **~$2.22M** | ~$3.39M |
| **5-year cumulative gross profit** | ~$1.19M | **~$1.78M** | ~$2.78M |
| Illustrative valuation range* | $12M–$18M | **$20M–$35M** | $45M–$70M |

*Illustrative SaaS + strategic pet-health multiples on Y5 ARR run rate — not a 409A appraisal. See ViT Pro business plan §13.*

### Why now

- **No incumbent** owns phone-first holistic wellness + shelter reunion + vet CDS in one stack.
- **Hardware wedge:** donated scan kits create shelter lock-in and chip/biometric intake data flywheel.
- **Regulatory clarity:** CDS positioning (not diagnosis) with advisor DVM validation path.

### Use of capital (if raising)

| Priority | Amount (illustrative) | Outcome |
|----------|----------------------:|---------|
| Scanner inventory + shelter pilot | $25K–$40K | 200 kits · TN network live |
| VitProScan sales + advisor validation | $80K–$120K | 30→120 clinics Y1–Y2 |
| Legal / TM / CDS terms | $15K–$25K | Launch-safe consumer + B2B |
| Grassroots marketing (Photo Booth, Framer) | $20K–$50K | Member funnel scale |

*Bootstrap path viable: base case reaches ~$67K revenue in first full year post-launch without paid scale.*

### Key risks

Slow shelter adoption · AAHA registry not embedded · API cost spikes on free ViT · CDS claim scrutiny · donation COGS before Token Shop LTV.

### Contact

**Freedom Paws Wellness LLC** (Wyoming) · [freedompawsinc.com](https://freedompawsinc.com) · `partners@freedompawsinc.com`

*Planning estimates only — not an offer, guarantee, or veterinary/medical advice.*

---

## Product portfolio summary

| Product line | Primary buyer | Price (retail) | COGS / unit | Gross margin (sold) | Role |
|--------------|---------------|----------------|-------------|---------------------|------|
| **A. Shelter Scanner Kit** | Shelters / rescues (80% donated) | **$129** retail · **$0** donation · **~$65** 50% subsidy | **~$85** @ volume | **34%** retail only | Mission CAC + chip intake |
| **B. DVM VitProScan** | Vet clinics | **$299/mo** Pro + optional **$149** clinic scanner | **~$0.15–0.25/scan** API + **$85** hardware if bundled | **75–88%** SaaS · **43%** on hardware bundle | B2B CDS + chip + ID workflow |
| **C. Member ID & Diagnostics** | Pet parents | **Free ViT** · **~$18** protocol · **$9.99/mo** membership (future) | **~$0.02–0.10/scan** API | **85%+** on digital | Funnel + LTV |

**Mission funding:** Scanner donations and shelter subsidies are funded from **Token Shop + affiliate net** (after 10% give-back reserve), not scanner retail alone.

---

## Product A — Freedom Paws Universal Scan Kit (Shelter / retail)

### A1. What’s in the box (SKU: `FP-SCAN-KIT-001`)

| # | Item | Unit cost (launch vol.) | Notes |
|---|------|-------------------------|--------|
| 1 | Universal LF RFID scanner (125 / 128 / 134.2 kHz, AVID decrypt) | **$62** | OEM — not $400 WorldScan dev unit |
| 2 | USB charging cable | $3 | |
| 3 | Rechargeable battery or 9V (one standard per SKU) | $4 | |
| 4 | Protective pouch | $5 | |
| 5 | Printed quick-start guide | $2 | Power → scan → app |
| 6 | Branded box + sleeve | $6 | |
| 7 | QR card → `app.freedompawsinc.com/id/scan` | $2 | |
| 8 | Registry reference card (AAHA + AVID) | $1 | |
| 9 | Warranty / RMA card | $0 | `partners@freedompawsinc.com` · 90-day |
| 10 | Freight (allocated per unit) | $6 | Domestic |
| 11 | RMA reserve (5%) | $5 | |
| **Total COGS** | | **~$85** | Pilot batch ~**$120** |

**Software included (no extra COGS per unit):** `/id/scan`, `/id/lookup`, `/id/found`, shelter portal — **Freedom Paws app**, not third-party affiliate.

### A2. Pricing & margin (per unit sold)

| Channel | Price | COGS | Gross profit | Margin |
|---------|-------|------|--------------|--------|
| **Donation** (qualifying shelter) | $0 | $85 | −$85 | Mission spend |
| **50% subsidy** (pilot partner) | **$65** | $85 | −$20 | Mission + partial recovery |
| **Retail** (Token Shop / owner) | **$129** | $85 | **$44** | **34%** |
| **Vet bundle** (see Product B) | **$149** | $85 | **$64** | **43%** |
| Promo launch | $99 | $85 | $14 | 14% |

**Shipping to customer:** add **$8–12/kit** (pass-through at retail; mission budget on donations).

### A3. Distribution plan

| Phase | Channel | Mix (Y1) | Method |
|-------|---------|----------|--------|
| **Pilot** (Oct–Dec 2026) | TN Adoption Network partners | ~14 units | Founder hand-deliver + train on `/id/scan` |
| **Donation** (Nov 2026+) | Municipal + rescue (DPA signed) | **~80%** of units | 2 free kits / qualifying partner; CRM log |
| **Subsidy** | Private rescues, small shelters | **~15%** | Invoice 50% · `shelter@freedompawsinc.com` |
| **Retail** | Token Shop `FP-SCAN-KIT-001` | **~5%** | Ship from founder/OEM 3PL when volume >200/yr |
| **Vet attach** | Sold with VitProScan clinic onboarding | Y2+ | Bundle SKU |

**Geography:** Tennessee + California pilot → Southeast + West Year 2 → national Year 3+.

**Fulfillment:** **We buy OEM, brand, ship** — not Amazon affiliate links. Inventory staged: **30 pilot → 200 launch → reorder 50/qtr**.

### A4. Inventory to keep on hand

| Tranche | When | Units on hand | Cash tied up (~$85/u) |
|---------|------|---------------|------------------------|
| Dev/QA | Jun 2026 ✓ | 2 (WorldScan + PetScanner — lab only) | ~$500 |
| Pilot stock | Oct 2026 | **30** | ~$3,600 (or ~$3,600 @ $120 pilot COGS) |
| Launch stock | Dec 2026 | **200** | ~$17,000 |
| Reorder buffer | Mar 2027+ | **50** minimum | ~$4,250 |
| **Y1 peak on-hand** | Jan 2027 | **~230** before donate/ship | ~$19,550 |

**Rule:** Reorder when **(on-hand + on-order) < 60 days of forecast shipments**.

### A5. Business practices & promotion (Product A)

**Business practices**

- Treat donated kits as **mission CAC**, not profit — ROI = enrollments + reunions + shelter lock-in.
- Require **signed DPA**, staff trained on `/id/scan` + `/id/found`, before free kits ship.
- Never repackage **$400 WorldScan dev units** as $129 retail — OEM volume SKU only.
- Log every kit serial in CRM; 90-day RMA via `partners@freedompawsinc.com`.
- Cap **120 free donations Y1**, then subsidy-only (avoid runaway COGS).

**Best promotion statement (use in outreach)**

> *“Freedom Paws donates Universal Scan Kits to qualifying Tennessee shelter partners — hardware plus our free app — so staff can scan microchips and run biometric photo intake for unchipped strays in one workflow. We are not replacing AAHA registry lookup; we add Freedom Paws ID match and human-reviewed reunion.”*

**Promotion channels:** Shelter outreach kit · TN Adoption Network pilot · “Unchipped isn’t unseen” (Jan 2027) · grant narratives · vet referral to shelters.

---

## Product B — VitProScan (DVM: scanner + ID + clinical diagnostics)

**Brand:** **VitProScan** (marketing) · **ViT Pro** (product at `/vit-pro`) · **vitproscan.com** → `/vit-pro`

### B1. What’s included

| Component | Included | Separate cost |
|-----------|----------|---------------|
| **ViT Pro CDS** (Tier B) | Structured vet report, citations, PDF, eye/skin/oral MVP | Subscription |
| **Chip scan software** | `/id/scan` + `/id/lookup` (same as shelters) | Included in platform |
| **Freedom Paws ID** (optional) | Biometric enroll for clinic patients — consent required | Included; no per-pet hardware |
| **Clinic scanner hardware** (optional) | Same OEM kit as Product A | **$149** one-time or bundled |
| **Owner handoff (Tier A)** | Plain-language summary from same capture | Integrated funnel |
| **NOT included** | Microchip implant, lab work, EMR integration (Y2+) | Clinic responsibility |

### B2. Pricing & unit economics

| SKU | Price | COGS (typical) | Gross margin |
|-----|-------|----------------|--------------|
| **VitProScan Starter** | **$199/mo** · 5 seats · 200 scans/mo | ~$30–50/mo API + $15 infra | **~75%** |
| **VitProScan Pro** | **$299/mo** · 10 seats · 500 scans/mo | ~$50–90/mo API + $20 infra | **~80%** |
| **Scan overage** | **$0.75/scan** | ~$0.15–0.25/scan | **~70%** |
| **Clinic scanner (one-time)** | **$149** | **$85** hardware + $8 ship | **~43%** |
| **Pilot clinic** (Y1) | $99/mo or 90-day free | Same API | Acquisition |

**Blended ARPU (planning):** **~$220–249/mo** per practice + occasional hardware.

### B3. Distribution plan

| Phase | When | Target | Motion |
|-------|------|--------|--------|
| **V0** | Now | Advisor DVMs only | `/vit-pro` allowlist · benchmark 50 cases |
| **Pilot** | Q1 2027 | 3–10 clinics (TN/CA) | Direct founder + advisor intro |
| **Expand** | Y2 2028 | 80–120 practices | Vet association · conference one-pager |
| **Scale** | Y3–Y5 | 200–550+ practices | Inside sales 1 FTE · vitproscan.com |
| **White-label** | Y3+ | Telehealth / corporate groups | API revenue share |

**Channel split (Y5 conservative):** 60% advisor referral · 25% inbound (vitproscan.com) · 15% conference/partners.

**Do not** market VitProScan on consumer Framer homepage — B2B only until counsel clears CDS claims.

### B4. Inventory (Product B hardware)

Clinics **optional** buy scanner hardware — same SKU as Product A.

| Item | Y1 clinics w/ hardware (~30%) | Units | Inventory note |
|------|-------------------------------|-------|----------------|
| Clinic scanner kits | 9 of 30 practices | Share shelter OEM pool | **No separate SKU stock** until >50 clinic orders/qtr |
| **Dedicated clinic buffer** | Y2+ | **25 units** | ~$2,125 @ $85 |

Software = **zero inventory**.

### B5. Business practices & promotion (Product B)

**Business practices**

- **CDS only** — never “diagnosis”; attending DVM responsible (Terms addendum).
- Verify **license** before practice account; audit log every report (`report version ID`).
- Keep **Tier A (owner)** and **Tier B (vet)** language strictly separated.
- File **provisional/trademark** on VitProScan / ViT Pro before national vet marketing.
- BAA / privacy uplift before storing clinic patient media at scale.

**Best promotion statement**

> *“VitProScan gives your practice phone-first clinical decision support — cited differentials from eye, skin, and oral imaging — plus optional microchip scan and Freedom Paws ID match in the same PWA. It extends your exam; it does not replace it.”*

**Promotion channels:** Vet advisor referrals · state VMA events · integrative/holistic vet networks · “Owner referred from Freedom Paws” handoff · VitProScan one-pager (not consumer ads).

---

## Product C — Member ID & ViT Diagnostics (consumer)

### C1. What’s included

| Component | Included | Monetization |
|-----------|----------|--------------|
| **ViT Diagnostics** (Tier A) | Photo/video + symptoms → protocols + urgency | Free (capped) / membership |
| **Biometric ID enroll** | 9-step wizard · eyes, face, body, gait · FP ID + QR card | Free pilot; future bundle |
| **Found-dog match** | Shelter intake → similarity → **human review** → owner alert | Mission / membership |
| **My Pets vault** | Profiles, ViT history, optional chip link | Membership |
| **Token Shop protocols** | 10 holistic protocols · ~**$18** lifetime (XRPL) | Primary LTV |
| **AI Magic Look** (Photo Booth) | Metered credits | **$3–7** ARPU |
| **Microchip link** | Paste/scan in `/id/scan` — **no kit required** | Free (uses vet/shelter scanner or manual entry) |
| **NOT included** | Implanted chip, LF scanner for home | Product A if they want hardware |

**Digital COGS per engaged member (monthly avg):** **$0.15–0.50** (ViT API) · scales with video/gait usage.

### C2. Pricing & margin

| SKU | Price | COGS | Gross margin |
|-----|-------|------|--------------|
| ViT Diagnostics session | **$0** (pilot) | $0.02–0.10 | N/A (funnel) |
| Protocol unlock (Token Shop) | **~$18** | ~$0.50 payment + API | **~85%** |
| Membership (future) | **$9.99/mo** / **$79/yr** | ~$1–2/mo infra + API | **~80%** |
| AI credit pack | **$2.99–14.99** | ~$0.04/look + Stripe | **~70%** |
| Biometric enroll | **$0** (pilot) | ~$0.08–0.20 one-time embedding | Mission |

### C3. Distribution plan

| Funnel | Entry | Conversion |
|--------|-------|------------|
| **Photo Booth** | Free share | → ViT / protocols / Token Shop |
| **Framer marketing** | Story → app install | → ViT Diagnostics |
| **ViT results** | Protocol recommendations | → Token Shop ~$18 |
| **ID enroll** | Post-ViT or `/id/enroll` | → QR card · shelter match eligible |
| **Shelter reunion** | Found intake | → Owner returns → Token Shop / membership |

**Geography:** US PWA · TN shelter pilot first · expand after Oct 2026 validation.

### C4. Inventory

**None** — 100% digital. Optional **printed QR cards** for enroll (~$0.50/card if mailed — defer).

### C5. Business practices & promotion (Product C)

**Business practices**

- Always show **“not veterinary advice”** and **human review** on ID match.
- Do not promise **registry owner lookup** until AAHA partnership — link out only.
- Biometric consent **explicit** before enroll; revoke in `/id/settings`.
- Cap ViT free tier if API costs spike; membership for heavy users (Y2).
- 10% give-back on eligible net — document methodology with counsel.

**Best promotion statement**

> *“Freedom Paws ViT Diagnostics helps you understand what your dog’s photo may suggest — and connects you to holistic protocols and Freedom Paws ID if your pet ever goes missing. It’s wellness guidance and reunion support, not a replacement for your veterinarian.”*

**Promotion channels:** Photo Booth social share · Framer · founding member waitlist · TN shelter co-marketing · veteran/shelter give-back story.

---

## Scenario comparison — Conservative · Base · Aggressive

**Period key:** Launch **Oct 2026** = **Y0.5**. Ten 6-month periods through **Y5.0** (Apr 2031 – Sep 2031).  
**Budget with Conservative · plan with Base · upside with Aggressive.**

### Scenario drivers

| Driver | Conservative | **Base** | Aggressive |
|--------|--------------|----------|------------|
| Geographic reach Y1–Y2 | TN + slow organic | TN + CA + Framer/social | TN + influencer burst + PR |
| Photo Booth → ViT funnel | Weak | Moderate | Viral + reunion press |
| VitProScan clinic adds (6 mo, Y3+) | 20–25 | 35–60 | 80–120 |
| VitProScan practices (EOY Y5) | **220** | **320** | **550** |
| Paying members (EOY Y5) | **910** (70% of base) | **1,300** | **1,820** (140%) |
| Scanner kits / 6 mo (Y5) | 26 | 32 | 40 |
| Donation vs retail mix (Y5) | 85% donated | 80% donated | 70% donated + more vet bundles |
| Token Shop conversion | 1.2% | 2.5% | 4.5% |

*Conservative aligns with `Freedom-Paws-5-Year-Financial-Model.csv` (70% base) on consumer; Aggressive aligns with ViT Pro “breakout” vet ramp and 140% member model.*

### Combined revenue — all three products (6-month periods)

| Period | Calendar | **Conservative** | **Base** | **Aggressive** |
|--------|----------|----------------:|---------:|---------------:|
| **Y0.5** | Oct 26 – Mar 27 | $18,700 | **$27,800** | $45,000 |
| **Y1.0** | Apr 27 – Sep 27 | $44,900 | **$66,800** | $107,800 |
| **Y1.5** | Oct 27 – Mar 28 | $65,000 | **$96,500** | $154,900 |
| **Y2.0** | Apr 28 – Sep 28 | $103,600 | **$154,200** | $248,500 |
| **Y2.5** | Oct 28 – Mar 29 | $130,900 | **$194,800** | $313,300 |
| **Y3.0** | Apr 29 – Sep 29 | $171,700 | **$255,500** | $411,100 |
| **Y3.5** | Oct 29 – Mar 30 | $205,600 | **$306,000** | $492,300 |
| **Y4.0** | Apr 30 – Sep 30 | $249,500 | **$371,500** | $597,900 |
| **Y4.5** | Oct 30 – Mar 31 | $290,100 | **$432,000** | $694,800 |
| **Y5.0** | Apr 31 – Sep 31 | $344,000 | **$512,500** | $824,900 |
| **5-yr total** | | **~$1,540,000** | **~$2,217,000** | **~$3,390,000** |

### Combined gross profit — all three products (6-month periods)

| Period | **Conservative** | **Base** | **Aggressive** |
|--------|----------------:|---------:|---------------:|
| Y0.5 | $12,600 | **$19,000** | $31,500 |
| Y1.0 | $36,800 | **$52,700** | $86,200 |
| Y1.5 | $53,700 | **$76,750** | $124,400 |
| Y2.0 | $85,900 | **$123,650** | $201,500 |
| Y2.5 | $108,500 | **$156,700** | $255,800 |
| Y3.0 | $142,400 | **$206,150** | $335,500 |
| Y3.5 | $170,600 | **$247,350** | $402,600 |
| Y4.0 | $207,000 | **$300,800** | $488,500 |
| Y4.5 | $240,700 | **$350,250** | $568,200 |
| Y5.0 | $268,000 | **$415,950** | $678,000 |
| **5-yr total** | **~$1,186,000** | **~$1,789,000** | **~$2,772,000** |

*Conservative multipliers: Product A ~80% units · Product B ~65% revenue · Product C ~70% revenue. Aggressive: A ~125% · B ~175% · C ~140%. Product A gross profit stays mission-negative longer in Conservative (more donation mix).*

### Y5 snapshot by product line (Y5.0 period)

| Product | Conservative rev / GP | **Base rev / GP** | Aggressive rev / GP |
|---------|------------------------:|------------------:|--------------------:|
| **A Scanner** | $6.0K / $1.5K | **$7.5K / $2.2K** | $9.4K / $3.8K |
| **B VitProScan** | $201.5K / $161K | **$310K / $248K** | $542.5K / $434K |
| **C Member ID/ViT** | $136.5K / $105K | **$195K / $166K** | $273K / $240K |

### Inventory implications by scenario

| Scenario | Y1 peak on-hand (kits) | Y5 reorder cadence | Cash tied up (peak) |
|----------|------------------------|--------------------|---------------------:|
| Conservative | **180** | Quarterly · 40-unit MOQ | ~$15,300 |
| **Base** | **230** | Quarterly · 50-unit MOQ | ~$19,550 |
| Aggressive | **280** | Monthly · 75-unit MOQ | ~$23,800 |

**Rule:** Do not stock Aggressive inventory until Base scenario actuals exceed plan by **>20%** for two consecutive quarters.

### When to use each scenario

| Use case | Scenario |
|----------|----------|
| Bank balance / donation budget | **Conservative** |
| Hiring, inventory PO, founder targets | **Base** |
| Investor upside / grant narratives | **Aggressive** (with triggers listed below) |

**Aggressive triggers:** documented national reunion story · Chewy-class affiliate · 50+ advisor DVM referrals · grant capital for shelter kits · Photo Booth >10K sessions/quarter.

**Conservative risks:** Framer CTA lag · no insurance partner · VitProScan pilot slips past Q1 2027 · API costs force ViT cap.

---

## 6-month projections — Base scenario detail (Y0.5 → Y5)

**Period key:** Launch **Oct 2026** = start of **Y0.5**. Ten 6-month periods through **Y5.0** (Apr 2031 – Sep 2031).  
**Dollar amounts USD · Base (expected) scenario.**

### Summary table (total revenue & gross profit by product line)

| Period | Calendar | **A Scanner revenue** | **A gross profit** | **B VitProScan revenue** | **B gross profit** | **C Member ID/ViT revenue** | **C gross profit** | **Total revenue** | **Total gross profit** |
|--------|----------|----------------------:|-------------------:|-------------------------:|-------------------:|------------------------------:|-------------------:|------------------:|-----------------------:|
| **Y0.5** | Oct 26 – Mar 27 | $1,300 | −$800 | $18,000 | $12,600 | $8,500 | $7,200 | **$27,800** | **$19,000** |
| **Y1.0** | Apr 27 – Sep 27 | $2,800 | $400 | $42,000 | $33,600 | $22,000 | $18,700 | **$66,800** | **$52,700** |
| **Y1.5** | Oct 27 – Mar 28 | $3,500 | $600 | $58,000 | $46,400 | $35,000 | $29,750 | **$96,500** | **$76,750** |
| **Y2.0** | Apr 28 – Sep 28 | $4,200 | $900 | $95,000 | $76,000 | $55,000 | $46,750 | **$154,200** | **$123,650** |
| **Y2.5** | Oct 28 – Mar 29 | $4,800 | $1,100 | $118,000 | $94,400 | $72,000 | $61,200 | **$194,800** | **$156,700** |
| **Y3.0** | Apr 29 – Sep 29 | $5,500 | $1,400 | $155,000 | $124,000 | $95,000 | $80,750 | **$255,500** | **$206,150** |
| **Y3.5** | Oct 29 – Mar 30 | $6,000 | $1,600 | $185,000 | $148,000 | $115,000 | $97,750 | **$306,000** | **$247,350** |
| **Y4.0** | Apr 30 – Sep 30 | $6,500 | $1,800 | $225,000 | $180,000 | $140,000 | $119,000 | **$371,500** | **$300,800** |
| **Y4.5** | Oct 30 – Mar 31 | $7,000 | $2,000 | $260,000 | $208,000 | $165,000 | $140,250 | **$432,000** | **$350,250** |
| **Y5.0** | Apr 31 – Sep 31 | $7,500 | $2,200 | $310,000 | $248,000 | $195,000 | $165,750 | **$512,500** | **$415,950** |

*Product A gross profit negative in Y0.5–Y1.0 due to donation-heavy mix — intentional mission spend.*

### Product A — units & economics by period

| Period | Donation | Subsidy | Retail | **Total units** | Revenue | COGS | Gross profit |
|--------|----------|---------|--------|----------------:|--------:|-----:|-------------:|
| Y0.5 | 10 | 2 | 2 | 14 | $1,300 | $2,100 | −$800 |
| Y1.0 | 24 | 4 | 4 | 32 | $2,800 | $2,400 | $400 |
| Y1.5 | 20 | 6 | 5 | 31 | $3,500 | $2,900 | $600 |
| Y2.0 | 18 | 8 | 6 | 32 | $4,200 | $3,300 | $900 |
| Y2.5 | 16 | 8 | 7 | 31 | $4,800 | $3,700 | $1,100 |
| Y3.0 | 14 | 10 | 8 | 32 | $5,500 | $4,100 | $1,400 |
| Y3.5 | 12 | 10 | 9 | 31 | $6,000 | $4,400 | $1,600 |
| Y4.0 | 12 | 10 | 10 | 32 | $6,500 | $4,700 | $1,800 |
| Y4.5 | 10 | 10 | 11 | 31 | $7,000 | $5,000 | $2,000 |
| Y5.0 | 10 | 10 | 12 | 32 | $7,500 | $5,300 | $2,200 |
| **5-yr total** | **146** | **76** | **74** | **296** | **$49,100** | **$36,100** | **$13,000** |

### Product B — VitProScan practices & economics by period

| Period | EOY practices | New practices (6 mo) | Subscription + overage rev | Hardware rev | Total rev | COGS (~20%) | Gross profit |
|--------|--------------:|---------------------:|---------------------------:|-------------:|----------:|------------:|---------------:|
| Y0.5 | 15 | 15 | $16,000 | $2,000 | $18,000 | $5,400 | $12,600 |
| Y1.0 | 30 | 15 | $38,000 | $4,000 | $42,000 | $8,400 | $33,600 |
| Y1.5 | 45 | 15 | $52,000 | $6,000 | $58,000 | $11,600 | $46,400 |
| Y2.0 | 70 | 25 | $85,000 | $10,000 | $95,000 | $19,000 | $76,000 |
| Y2.5 | 95 | 25 | $105,000 | $13,000 | $118,000 | $23,600 | $94,400 |
| Y3.0 | 130 | 35 | $138,000 | $17,000 | $155,000 | $31,000 | $124,000 |
| Y3.5 | 165 | 35 | $165,000 | $20,000 | $185,000 | $37,000 | $148,000 |
| Y4.0 | 210 | 45 | $200,000 | $25,000 | $225,000 | $45,000 | $180,000 |
| Y4.5 | 260 | 50 | $232,000 | $28,000 | $260,000 | $52,000 | $208,000 |
| Y5.0 | 320 | 60 | $278,000 | $32,000 | $310,000 | $62,000 | $248,000 |

### Product C — member / digital economics by period

| Period | Paying members (EOY) | Protocol + shop | Membership + AI | Total rev | COGS (~15%) | Gross profit |
|--------|------------------------:|----------------:|----------------:|----------:|------------:|-------------:|
| Y0.5 | 45 | $6,500 | $2,000 | $8,500 | $1,300 | $7,200 |
| Y1.0 | 130 | $16,000 | $6,000 | $22,000 | $3,300 | $18,700 |
| Y1.5 | 220 | $25,000 | $10,000 | $35,000 | $5,250 | $29,750 |
| Y2.0 | 350 | $38,000 | $17,000 | $55,000 | $8,250 | $46,750 |
| Y2.5 | 480 | $50,000 | $22,000 | $72,000 | $10,800 | $61,200 |
| Y3.0 | 650 | $65,000 | $30,000 | $95,000 | $14,250 | $80,750 |
| Y3.5 | 820 | $78,000 | $37,000 | $115,000 | $17,250 | $97,750 |
| Y4.0 | 1,000 | $95,000 | $45,000 | $140,000 | $21,000 | $119,000 |
| Y4.5 | 1,150 | $110,000 | $55,000 | $165,000 | $24,750 | $140,250 |
| Y5.0 | 1,300 | $130,000 | $65,000 | $195,000 | $29,250 | $165,750 |

*Aligns with `Freedom-Paws-5-Year-Financial-Model.csv` base case; Product C includes Token Shop, AI packs, future membership.*

---

## Combined inventory plan (all physical SKUs)

| Period end | Scanner kits on hand (target) | On-hand value (~$85) | Reorder trigger |
|------------|------------------------------:|---------------------:|-----------------|
| Y0.5 (Mar 27) | 180 | $15,300 | After 14 shipped in pilot |
| Y1.0 (Sep 27) | 120 | $10,200 | <45 units |
| Y1.5 (Mar 28) | 100 | $8,500 | Quarterly |
| Y2.0+ | 80–100 | $6,800–8,500 | 60-day forward cover |

**Clinic-dedicated buffer (Product B):** start **25 units** at Y2.0 when clinic hardware attach >20/qtr.

---

## Cross-product promotion matrix

| Audience | Lead product | Upsell | Message |
|----------|--------------|--------|---------|
| Shelter | **A** free kit | C enroll via found intake | Scan + photo = full intake |
| Pet parent | **C** ViT free | Protocol $18 · Photo Booth AI | Wellness first |
| Clinic DVM | **B** VitProScan trial | A scanner $149 | CDS + chip in one app |
| Vet → owner | B Tier B report | C Tier A handout | Same capture, two views |

---

## Founder checklist — document use

- [ ] Review assumptions with CPA (give-back 10%, mission COGS classification)
- [ ] Update CSV when actual unit sales differ >20% from plan — switch inventory scenario if two quarters above Base
- [ ] Tie inventory reorder to `/ops` KPI review (monthly from Y1.0)
- [ ] Re-read promotion statements with attorney before public campaigns
- [ ] Share investor one-pager only after L5 Terms/Privacy sign-off

---

*Freedom Paws Wellness — planning document only. Not financial, legal, or veterinary advice. Update quarterly from actuals.*
