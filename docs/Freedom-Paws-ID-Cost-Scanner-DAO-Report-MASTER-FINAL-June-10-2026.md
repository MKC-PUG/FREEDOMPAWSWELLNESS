# Freedom Paws ID — Development, Technology, Scanner & Mission Economics

**MASTER / FINAL** — June 10, 2026  
**Prepared for:** Founder review & approval  
**Status:** Authoritative — supersedes all prior drafts of this report  
**Supersedes:** `Freedom-Paws-ID-Cost-Scanner-DAO-Report-June-2026.md` · `Freedom-Paws-ID-Cost-Scanner-DAO-Report-June-2026-NEW-UPDATED.md`  
**Related:** [Complete Master Roadmap](./Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md) · [Founder Review](./Freedom-Paws-ID-Founder-Review-June-2026.md) · [Launch Todo](./Freedom-Paws-Launch-Todo-Prioritized-June-2026.md)

---

## Founder funding clarification (locked for this report)

**There is no separate external “DAO treasury” or third-party crypto pool for Freedom Paws mission spend.**

All mission and program funding flows **only** from:

| Revenue source | What it funds |
|----------------|---------------|
| **Freedom Paws Token Shop** (`{APP}/token-shop`) | Protocol purchases, membership (when live), scanner kit retail, project operations |
| **Affiliate income** | Whole-food / supplement links inside unlocked protocols |

From that combined revenue, Freedom Paws:

1. **Operates the project** — hosting, APIs, legal, marketing, hardware COGS, shelter onboarding  
2. **Reserves 10% for give-back donations** — split **50% / 50%**:
   - **5%** → veteran dog organizations  
   - **5%** → no-kill shelters and shelter partners  
3. **Allocates remaining net** to ID program mission spend — scanner donations to shelters, enroll sponsorship, pilot onboarding (not treated as a separate profit center)

**Terminology in this report:** “Mission pool” or “give-back reserve” replaces prior “DAO treasury” language. Scanner units donated to shelters are **mission infrastructure** funded from Token Shop + affiliate net — after fees, direct costs, and the 10% give-back reserve.

*Attorney to fix whether 10% is calculated on gross revenue, net profit after fees, or net after direct COGS — see [Master Business Plan](./Freedom-Paws-Master-Business-Plan-and-Roadmap.md) Section 6.*

---

## Executive summary

Freedom Paws ID is a **two-track program**: biometric reunion (Track 1, Oct 2026 pilot) and universal microchip scanning (Track 2, Week 18+). Path: **self-build**, **Supabase + pgvector**, **Jan 1, 2027 promotion**.

**Founder intent:** Most scanner units will be **donated to qualifying shelters**; onboarding and hardware are **mission spend** funded by **Token Shop + affiliate revenue**, not scanner retail margin alone.

**Bottom line:**

| Phase | Cash outlay (est.) | Primary funding source |
|-------|-------------------|------------------------|
| Track 1 biometric pilot (through Oct 2026) | **$15,000–$25,000** | Founder build + Token Shop / affiliate net |
| Full program through Jan 2027 | **$45,000–$55,000** | Self-build + selective contracts |
| Scanner hardware + shipping (232 units) | **$22,840** | Mission allocation from shop + affiliate |
| **Mission program envelope (Year 1)** | **$48,000–$58,000** | Token Shop + affiliate (after 10% give-back reserve) |
| Ongoing ops (Jan 2027) | **~$3,320/mo** | Token Shop + affiliate + protocol cross-sell |

**Scanner at $129 retail / $85 COGS:** **34% gross margin** on **sold** units only. With **~80% donation mix**, hardware is **mission CAC** — ROI measured in enrollments, reunions, and shelter lock-in, not scanner gross profit.

**Give-back (10%):** At **$100,000** eligible net revenue in a period → **$10,000** total donations → **$5,000** veteran dog orgs + **$5,000** shelters.

---

## 1. Development cost breakdown

### 1.1 Engineering (contract reference vs self-build)

| Workstream | Contract hrs | Contract $ | Track | Self-build status (Jun 2026) |
|------------|-------------|------------|-------|------------------------------|
| ViT multi-region + gait | 140 | $21,000 | 1 | **Live** — identity mode + wellness |
| Backend + auth + My Pets server | 120 | $18,000 | 1 | **Live** — Supabase, `/api/pets` |
| Biometric enroll + embeddings | 120 | $18,000 | 1 | **Live** — full 9-step wizard + pgvector |
| Found dog + match queue | 80 | $12,000 | 1 | **Live** — `/id/found`, `/id/match` |
| Shelter portal + settings | 100 | $15,000 | 1 | **Live** — stats, alerts, revoke, audit |
| Security + load test | 40 | $6,000 | 1 | Before Jan 2027 promotion |
| **Track 1 subtotal** | **600** | **$90,000** | | **~95% complete** |
| Chip BLE + scan UX | 60 | $9,000 | 2 | Week 18+ |
| AAHA / registry UX | 60 | $9,000 | 2 | Week 21+ |
| Vet portal | 40 | $6,000 | 2 | Week 26 |
| Scanner kit commerce | 20 | $3,000 | 2 | Placeholder `/id/kit` live |
| **Track 2 subtotal** | **180** | **$27,000** | | Stubs only |
| **Engineering total (if fully contracted)** | **780** | **$117,000** | | |

**Self-build cash:** $0–$15,000 contract spikes (security, legal-tech), not full $90k Track 1.

### 1.2 Legal & compliance

| Item | Low | High | When |
|------|-----|------|------|
| Privacy policy update (biometric) | $2,000 | $4,000 | Jul 2026 |
| Biometric consent + shelter DPA | $5,000 | $10,000 | Aug 2026 |
| ID module terms + disclaimers | $3,000 | $4,000 | Sep 2026 |
| **Legal total** | **$10,000** | **$18,000** | |

*Required before Oct 1 shelter pilot.*

### 1.3 Marketing (through Q2 2027)

| Phase | Budget | Focus |
|-------|--------|-------|
| Pre-pilot (Jul–Sep 2026) | $2,000 | “What ViT sees” — eyes, face, gait |
| Biometric pilot PR (Oct–Dec 2026) | $5,000 | CA/TN shelter diaries |
| Chip launch (Dec 2026–Jan 2027) | $4,000 | Scanner waitlist → kit |
| 90-day promotion (Jan–Mar 2027) | $9,000 | “Unchipped isn’t unseen” national |
| **Marketing total** | **$20,000** | |

### 1.4 Monthly technology operations

| Service | Oct 2026 (pilot) | Jan 2027 (full launch) |
|---------|------------------|------------------------|
| Vercel Pro | $20 | $150 |
| Supabase (Postgres + auth + storage) | $25 | $100 |
| pgvector (included in Postgres) | $0 | $0 |
| Blob/R2 media | $25 | $120 |
| OpenAI API (vision + embeddings) | $350 | $2,500 |
| Resend email | $20 | $80 |
| Twilio SMS (owner alerts, v2) | $0 | $200 |
| **Monthly total** | **~$440** | **~$3,050–$3,320** |

**6-month ops (Jul–Dec 2026):** ~$2,500–$4,000  
**Q1 2027 ops (Jan–Mar):** ~$9,000–$10,000  

### 1.5 Grand total scenarios

| Scenario | Through Oct 2026 pilot | Through Jan 2027 full launch |
|----------|------------------------|------------------------------|
| **Lean (self-build)** | **$15,000–$25,000** | **$45,000–$55,000** |
| Recommended (contract eng + legal + hardware) | $55,000–$65,000 | $125,000–$140,000 |
| Aggressive (+ heavy paid ads) | $80,000 | $160,000+ |

**Lean total composition (Jan 2027):**

| Category | Est. |
|----------|------|
| Legal | $10,000–$18,000 |
| Marketing | $20,000 |
| Hardware (scanners + ship) | $22,840 |
| Ops (6 mo pilot + 3 mo launch) | $11,000–$14,000 |
| Contract engineering spikes | $0–$15,000 |
| Founder labor | Sweat equity (not in cash line) |
| **Cash range** | **$45,000–$55,000** |

*Mission hardware/onboarding ($48k–$58k) is funded from Token Shop + affiliate revenue as sales scale — not a separate treasury.*

---

## 2. Technology incorporated

### 2.1 Stack (Decisions D & E — locked)

| Layer | Choice | Role in ID program | Status |
|-------|--------|-------------------|--------|
| **Frontend** | Next.js PWA | `/id`, `/diagnostics?mode=identity`, shelter portal | Live |
| **Auth** | Supabase Auth | Owner, shelter_staff, fp_ops roles | Live |
| **Database** | Postgres (Supabase) | Pets, enrollments, match queue, audit log | Live |
| **Vector search** | pgvector | Pet embeddings; threshold 0.72 (rec.) | Live |
| **Media** | Enrollment storage | Region captures | Live |
| **Vision AI** | OpenAI gpt-4o-mini | `IDENTITY_SYSTEM_PROMPT` | Live |
| **Embeddings** | OpenAI embeddings | Fuse descriptors → vector | Live |
| **Email** | Resend | Owner match alerts | Live |
| **SMS** | Twilio (Q2 2027) | Urgent reunion notifications | Planned |
| **Payments** | XRPL / XUMM Token Shop | Protocol + kit revenue → mission pool | Live |
| **Affiliates** | In-protocol links | Supplement revenue → mission pool | Planned |
| **Marketing site** | Framer | `/freedom-paws-id-toolbox` | Founder — Decision H |
| **Scanner hardware** | OEM universal LF reader | BLE/HID → `/id/scan` | Week 18+ |

### 2.2 What phones cannot do (drives hardware line)

| Method | Reads implanted chip? |
|--------|----------------------|
| iPhone / Android NFC | **No** (13.56 MHz — wrong band) |
| Phone camera | **No** (collar QR only) |
| Freedom Paws Universal Scan Kit | **Yes** |

### 2.3 Reuse from live app today

| Existing asset | ID reuse |
|----------------|----------|
| `/diagnostics` + `/api/analyze` | Identity mode + region schema |
| Video frame extraction | Gait region |
| Quality gates | Enrollment quality minimums |
| `/mypets` + `/api/pets` | Server pets → enroll wizard |
| **Token Shop / XUMM** | **Primary mission revenue** → give-back + ID spend |
| Affiliate protocol links | **Secondary mission revenue** |

---

## 3. Scanner development timeline

**Hardware spend deferred until Week 18** — Oct 2026 pilot is **biometric only** (photo/video match).

### 3.1 Phase calendar

| Week | Dates | Milestone | Deliverable |
|------|-------|-----------|-------------|
| **18** | Oct 9–15, 2026 | **Track 2 kickoff** | Order 2 dev scanners; spec lock |
| **19** | Oct 16–22 | HID MVP | `/id/scan` keyboard-wedge input |
| **20** | Oct 23–29 | Chip parser | 9 / 10 / 15-digit validation |
| **21** | Oct 30–Nov 5 | Registry prep | AAHA partnership email |
| **22** | Nov 6–12 | Pilot hardware | First shelter kit donations ship |
| **23** | Nov 13–19 | AAHA UX | Registry routing UI |
| **24** | Nov 20–26 | AVID branch | Non-AAHA chip path |
| **25** | Nov 27–Dec 3 | Commerce | `/id/kit` + Token Shop SKU |
| **26** | Dec 4–10 | Vet lite | `/id/vet` scan history |
| **27** | Dec 11–17 | **Chip module complete** | 200-unit launch inventory |
| **28** | Dec 18–24 | Hardening | Load test; case study |
| **29** | Jan 1, 2027 | **Promotion mode** | National push |

### 3.2 Engineering hours (Track 2 only)

| Workstream | Hours | Cash (if contracted @ $150/hr) |
|------------|-------|----------------------------------|
| Chip BLE + scan UX | 60 | $9,000 |
| AAHA / registry UX | 60 | $9,000 |
| Vet portal | 40 | $6,000 |
| Scanner kit commerce | 20 | $3,000 |
| **Total** | **180** | **$27,000** |

### 3.3 Hardware procurement schedule

| Item | Qty | Unit cost | Total | When |
|------|-----|-----------|-------|------|
| Dev scanners | 2 | $120 | $240 | Week 18 |
| Pilot shelter kits | 30 | $120 | $3,600 | Week 22 |
| Launch inventory | 200 | $85 | $17,000 | Week 27 |
| Shipping & handling | — | — | $2,000 | Ongoing |
| **Hardware total** | **232** | | **$22,840** | |

*Funded from Token Shop + affiliate mission allocation when revenue supports purchase — not external grants required.*

---

## 4. Scanner unit economics — cost, price & margins

### 4.1 Cost structure (per unit)

| Cost component | Pilot batch ($120 COGS) | Launch volume ($85 COGS) |
|----------------|-------------------------|--------------------------|
| OEM universal LF reader | $95 | $62 |
| Packaging + quick-start card | $8 | $6 |
| Freedom Paws branding sleeve | $5 | $4 |
| QR onboarding URL card | $2 | $2 |
| Inbound freight (allocated) | $10 | $6 |
| Warranty / RMA reserve (5%) | — | $5 |
| **Total COGS** | **~$120** | **~$85** |

### 4.2 Retail price scenarios

| Retail price | COGS ($85) | Gross profit | Gross margin | Notes |
|--------------|------------|--------------|--------------|-------|
| **$99** | $85 | $14 | **14%** | Avoid except promo |
| **$129** (recommended) | $85 | $44 | **34%** | vs Animal ID ~$120 |
| **$149** | $85 | $64 | **43%** | Premium + vet bundle |

**Decision I (pending):** Recommend **$129** retail.

### 4.3 Channel policy (mission-first)

| Channel | Share of units (Y1 target) | Price | Who pays COGS |
|---------|---------------------------|-------|---------------|
| **Mission donation** — qualifying shelter/vet | **~80%** | $0 to partner | **Token Shop + affiliate mission pool** |
| **50% subsidy** — 3rd scanner or non-pilot | **~15%** | $64.50 | Mission pool + partner split |
| **Full retail** — Token Shop | **~5%** | $129 | Customer; margin replenishes pool |

**Qualifying shelter (mission donation):**
- Signed shelter DPA + biometric consent workflow  
- CA/TN pilot priority, then national waitlist  
- **2 free scanners** per partner (Track 2)  
- **50 sponsored owner enrollments** per adoption event  
- **6 hrs onboarding** (mission-funded if contracted)  

### 4.4 Year 1 scanner P&L — mission-heavy model

**Assumptions:** 232 total units; **80% donated (186)**; **15% subsidized (35)**; **5% retail (11)** @ $129.

| Line | Units | Revenue | COGS (blended ~$88) | Net |
|------|-------|---------|---------------------|-----|
| Mission donation | 186 | $0 | $16,368 | **−$16,368** |
| 50% subsidy | 35 | $2,258 | $3,080 | **−$822** |
| Token Shop retail | 11 | $1,419 | $935 | **+$484** |
| **Total** | **232** | **$3,677** | **$20,383** | **−$16,706** |

**Interpretation:** Scanner hardware is a **−$16.7k strategic mission cost** in Year 1 — appropriate when funded from **Token Shop + affiliate net**, not operating profit alone. Retail replenishes inventory; **primary revenue engine remains protocol sales and affiliates.**

### 4.5 Break-even retail (secondary path)

To recover **186 donated units** at $44 margin: **~372 retail units** — confirms donations are **not** recovered by scanner retail alone. **Protocol + affiliate revenue** funds the mission.

---

## 5. Mission funding model — Token Shop, affiliate & 10% give-back

### 5.1 Revenue waterfall (how every dollar flows)

```
Token Shop sales  +  Affiliate income
        ↓
  Payment processing (~3%)
        ↓
  Direct COGS (scanner units sold, digital delivery)
        ↓
  Operating expenses (hosting, APIs, support)
        ↓
  = Net eligible for give-back (formula TBD with counsel)
        ↓
  10% GIVE-BACK RESERVE
    ├── 5% → Veteran dog organizations
    └── 5% → Shelters / no-kill partners
        ↓
  Remaining net → Mission program (ID pilot, scanner donations, enroll sponsorship, onboarding)
```

**No external DAO treasury.** If mission spend exceeds remaining net in early quarters, founder bridges with sweat equity (Decision G) until Token Shop + affiliate scale — same as lean self-build path.

### 5.2 Two-phase mission spend

| Phase | When | Funded from shop + affiliate | Scanner hardware? |
|-------|------|------------------------------|-------------------|
| **Phase A — Biometric pilot** | Oct–Dec 2026 | Enroll API, training, PR, legal share | **No** — photo match only |
| **Phase B — Chip + scale** | Nov 2026–Mar 2027 | Scanner donations, shipping, onboarding | **Yes** |

### 5.3 Mission budget lines (Year 1 envelope)

| Mission line item | Est. cost | Funding source |
|-------------------|-----------|----------------|
| **Phase A — Biometric pilot ops** | $1,200 | Shop + affiliate net |
| **Phase A — Shelter onboarding (3 CA/TN)** | $2,250 | Shop + affiliate net |
| **Phase A — Enroll sponsorship** | $3,000 | Shop + affiliate net |
| **Phase A — Pilot PR & materials** | $5,000 | Shop + affiliate net |
| **Phase A — Legal share (DPA/consent)** | $6,000 | Shop + affiliate net |
| **Phase B — Scanner donations (186 @ $88)** | $16,368 | Shop + affiliate net |
| **Phase B — Subsidy co-pay (mission half)** | $1,540 | Shop + affiliate net |
| **Phase B — Shipping & RMA** | $3,500 | Shop + affiliate net |
| **Phase B — Scale onboarding (17 shelters)** | $12,750 | Shop + affiliate net |
| **Phase B — Vet partner kits (10 donated)** | $850 | Shop + affiliate net |
| **Contingency (10%)** | $5,200 | Shop + affiliate net |
| **Mission program total** | **$57,658** | Round to **$48k–$58k envelope** |
| **Give-back (10% of revenue)** | *Variable* | **Separate mandatory reserve** — 50% vets / 50% shelters |

*Founder engineering excluded — Decision G self-build.*

### 5.4 Illustrative give-back at revenue milestones

| Token Shop + affiliate net (eligible) | 10% give-back | Veterans (5%) | Shelters (5%) |
|---------------------------------------|---------------|---------------|---------------|
| $50,000 | $5,000 | $2,500 | $2,500 |
| $100,000 | $10,000 | $5,000 | $5,000 |
| $200,000 | $20,000 | $10,000 | $10,000 |

*Display badge at Token Shop checkout and Framer grant pages once formula is counsel-approved.*

### 5.5 Per-shelter mission package (fully loaded)

| Item | Mission cost (cash) | Retail value to shelter |
|------|---------------------|-------------------------|
| 2× Universal Scan Kit (donated) | $170–$240 COGS | $258 |
| Biometric + found-dog training | $250–$500 | $500+ |
| Account setup + test enroll | $150 | — |
| 50 sponsored owner enrollments | $300 API | $150+ goodwill |
| Adoption packet QR (500 cards) | $50 print | — |
| 30-day success check-in | $75 | — |
| **Per shelter total** | **~$750–$1,275** | **$700+ hardware value** |

**3 pilot shelters (CA/TN):** ~$2,250–$3,825 onboarding + **$0 scanner in Phase A**  
**20 shelters by Jan 2027:** ~$15k–$25k onboarding + scanner COGS from Phase B

### 5.6 ROI metrics (mission pool — not scanner margin)

| Metric | Oct 2026 target | Jan 2027 target |
|--------|-----------------|-----------------|
| Biometric enrollments | 500 | 3,000 |
| Active shelter partners | 3 (CA/TN) | 20 |
| Documented reunions | 1+ | 5+ |
| Cost per enrollment (mission) | ~$6–$12 | ~$4–$8 (scale) |
| Cost per shelter onboarded | ~$750–$1,275 | ~$750 |
| Token Shop revenue (cumulative Y1) | $5k–$15k | $30k–$80k |

---

## 6. Revenue beyond hardware

| Stream | Start | Role in funding model |
|--------|-------|----------------------|
| **Token Shop — protocol SKUs** | Live | **Primary** — funds ops, 10% give-back, mission pool |
| **Token Shop — scanner kit** | Jan 2027 | Replenishes inventory; 5% of unit mix |
| **Affiliate — protocol supplements** | Q4 2026+ | **Secondary** — same waterfall as shop |
| **Core membership** | Post-launch | Recurring ops + give-back base |
| Protocol cross-sell post-reunion | Ongoing | Highest LTV after shelter match |
| Premium ID ($2.99/mo) | Q2 2027 | Optional |

**Not in funding model:** External crypto DAO treasury, unsolicited crypto donations, or grant dependency for core pilot (grants = upside only).

---

## 7. Timeline summary (founder-locked)

| Date | Milestone |
|------|-----------|
| Jun 10, 2026 | Track 1 **shipped** — enroll, found, match, shelter, settings |
| Aug 15, 2026 | ViT gait polish; pilot QA |
| **Oct 1, 2026** | **Biometric shelter pilot** (CA/TN) — Phase A |
| Nov 2026 | **Phase B** — first scanner donations |
| **Jan 1, 2027** | **Full promotion mode** |
| Q2 2027 | SMS alerts; scale shelters |

---

## 8. Decisions for founder

| # | Item | Recommendation |
|---|------|----------------|
| **I** | Scanner retail (Token Shop) | **$129** |
| **J** | Match threshold | **0.72** |
| **K** | Mission envelope **$48k–$58k** Y1 | Funded from **Token Shop + affiliate** (not external DAO) |
| **L** | Donation cap: **2 free scanners / qualifying shelter** | 3rd+ at 50% subsidy |
| **M** | Oct pilot = biometric only | Scanners from Week 22 |
| **N (NEW)** | **10% give-back** | **50% veteran dog orgs / 50% shelters** — counsel fixes base |
| **O (NEW)** | **No separate DAO treasury** | All mission spend from shop + affiliate waterfall |

---

## 9. Recommendations

1. **Approve mission envelope $48k–$58k** — sourced from Token Shop + affiliate as sales scale; separate from $45k–$55k lean product cash (legal, ops, contract spikes).
2. **Document 10% give-back** at checkout and Framer — 5% / 5% split; attorney fixes eligible revenue base.
3. **Plan 80/15/5 scanner distribution** — mission donation / subsidy / retail.
4. **Measure mission ROI** on enrollments and reunions, not scanner gross margin.
5. **Phase A first** — CA/TN biometric pilot without scanner spend; grow Token Shop revenue before Phase B hardware order.
6. **Lock retail at $129** on Token Shop for public scanner channel.

---

*Freedom Paws ID is not a government pet license. Not veterinary advice. Biometric enrollment requires explicit consent. Match results require human review before owner contact. Phones do not read implanted microchips without Freedom Paws Universal Scan Kit (Track 2). Mission funding comes from Freedom Paws Token Shop sales and affiliate income; 10% is donated 50/50 to veteran dog organizations and shelters.*
