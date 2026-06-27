# Freedom Paws ID — Development, Technology, Scanner & DAO Economics

> **⚠️ SUPERSEDED** — Use **[MASTER/FINAL June 10, 2026](./Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md)** for all decisions.  
> Rev. 2 retained for history only. Funding model corrected in MASTER/FINAL: **Token Shop + affiliate only**; **10% give-back 50/50 vets/shelters**; no external DAO treasury.

**NEW-UPDATED** — superseded by MASTER/FINAL  
**Date:** June 10, 2026 (rev. 2)  
**Related:** [MASTER/FINAL](./Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md) · [Original draft](./Freedom-Paws-ID-Cost-Scanner-DAO-Report-June-2026.md)

---

## What changed in NEW-UPDATED (vs original draft)

| Topic | Original draft | **NEW-UPDATED** |
|-------|----------------|-----------------|
| Scanner donation mix | 60% donated / 40% retail | **~80% DAO-donated** to shelters & vets |
| Pilot subsidy | 50% off for 30 units | **100% DAO donation** for qualifying partners |
| DAO Year 1 envelope | $35k–$45k | **$48k–$58k** (heavier hardware + onboarding) |
| Oct 2026 pilot | Implied scanners early | **Biometric only** — scanners Week 22+ |
| Onboarding funding | Partial | **Fully DAO-funded** per shelter package |
| Engineering status | Planned Supabase | **Supabase auth + pets + enroll steps 1–5 live in codebase** |

---

## Executive summary

Freedom Paws ID is a **two-track program**: biometric reunion (Track 1, Oct 2026 pilot) and universal microchip scanning (Track 2, Week 18+). Your path: **self-build**, **Supabase + pgvector**, **Jan 1, 2027 promotion**.

**Founder intent (locked for this report):** Most scanner units will be **donated to shelters**; **onboarding costs borne by Freedom Paws DAO** — not treated as a profit-first hardware line.

**Bottom line:**

| Phase | Cash outlay (est.) | Primary funding source |
|-------|-------------------|------------------------|
| Track 1 biometric pilot (through Oct 2026) | **$15,000–$25,000** | Founder build + **DAO ops** |
| Full program through Jan 2027 | **$45,000–$55,000** | Self-build + selective contracts |
| Scanner hardware + shipping (232 units) | **$22,840** | **Freedom Paws DAO** (donations) + retail replenishment |
| **DAO shelter program (Year 1)** | **$48,000–$58,000** | **DAO treasury** — separate line |
| Ongoing ops (Jan 2027) | **~$3,320/mo** | DAO + protocol cross-sell |

**Scanner at $129 retail / $85 COGS:** **34% gross margin** on sold units only. With **~80% donation mix**, hardware is **mission infrastructure (CAC)** — ROI measured in enrollments, reunions, and shelter contracts, not scanner gross profit.

---

## 1. Development cost breakdown

### 1.1 Engineering (contract reference vs self-build)

| Workstream | Contract hrs | Contract $ | Track | Self-build status |
|------------|-------------|------------|-------|-------------------|
| ViT multi-region + gait | 140 | $21,000 | 1 | Identity mode **live** |
| Backend + auth + My Pets server | 120 | $18,000 | 1 | **Supabase auth + `/api/pets` live** |
| Biometric enroll + embeddings | 120 | $18,000 | 1 | **Enroll steps 1–5 live**; embeddings next |
| Found dog + match queue | 80 | $12,000 | 1 | Pending |
| Shelter portal | 80 | $12,000 | 1 | Pending |
| Security + load test | 40 | $6,000 | 1 | Before Jan launch |
| **Track 1 subtotal** | **580** | **$87,000** | | |
| Chip BLE + scan UX | 60 | $9,000 | 2 | Week 18+ |
| AAHA / registry UX | 60 | $9,000 | 2 | Week 21+ |
| Vet portal | 40 | $6,000 | 2 | Week 26 |
| Scanner kit commerce | 20 | $3,000 | 2 | Week 25 |
| **Track 2 subtotal** | **180** | **$27,000** | | |

**Self-build cash:** $0–$15,000 contract spikes (security, legal-tech), not full $87k.

### 1.2 Legal, marketing, ops

| Category | Range |
|----------|-------|
| Legal (biometric consent, DPA, terms) | $10,000–$18,000 |
| Marketing (through Q2 2027) | $20,000 |
| Ops Jul 2026–Mar 2027 | $11,000–$14,000 |
| **Lean product cash (no DAO)** | **$45,000–$55,000** |

---

## 2. Technology incorporated

| Layer | Choice | Status |
|-------|--------|--------|
| Next.js PWA | Existing | Live |
| **Supabase Auth** | Magic link email | **Scaffold live** — `/login`, `/auth/callback` |
| **Postgres** | Supabase | Migration in `supabase/migrations/001_freedom_paws_id.sql` |
| **Server pets** | `pets` table + RLS | **`/api/pets` live**; My Pets cloud sync when signed in |
| **Enroll wizard** | Steps 1–5 | **`/id/enroll` live** — pet, consent, eyes, face, body |
| pgvector | Embeddings (step 8) | Planned |
| OpenAI vision | Identity regions | **Live** via `/api/analyze` + `/api/id/enroll/region` |
| Scanner OEM | 125/128/134.2 kHz | Week 18+ |

---

## 3. Scanner development timeline

Unchanged from master roadmap — **hardware spend deferred** until Week 18; **DAO does not fund scanners for Oct 2026 biometric-only pilot**.

| Week | Dates | Deliverable |
|------|-------|-------------|
| 18 | Oct 9–15, 2026 | Track 2 kickoff; order dev scanners |
| 22 | Nov 6–12, 2026 | **First DAO shelter donations ship** (Tennessee) |
| 27 | Dec 11–17, 2026 | Chip module complete; volume order |
| 29 | Jan 1, 2027 | Promotion mode |

**Hardware procurement (232 units total):** $22,840 — see Section 4.

---

## 4. Scanner unit economics

### 4.1 COGS & retail

| | Pilot batch | Volume |
|--|-------------|--------|
| **COGS / unit** | ~$120 | ~$85 |
| **Retail (recommended)** | — | **$129** (34% margin on sold units) |

### 4.2 Channel policy (NEW-UPDATED — DAO-first)

| Channel | Share of units (Y1 target) | Price | Who pays COGS |
|---------|---------------------------|-------|---------------|
| **DAO full donation** — qualifying shelter/vet | **~80%** | $0 | **Freedom Paws DAO** |
| **DAO 50% subsidy** — 3rd scanner or non-pilot partner | **~15%** | $64.50 | DAO + partner split |
| **Full retail** — public / vet overflow | **~5%** | $129 | Customer |

**Qualifying shelter (DAO donation):**
- Signed shelter DPA + biometric consent workflow
- Tennessee pilot priority, then national waitlist
- **2 free scanners** per partner (Track 2)
- **50 free owner enrollments** per adoption event (API cost from DAO)
- **6 hrs onboarding** (DAO-funded if contracted)

### 4.3 Year 1 scanner P&L — DAO-heavy model (NEW-UPDATED)

**Assumptions:** 200-unit launch batch + 32 dev/pilot units = **232 total**; **80% donated (186 units)**; **15% subsidized (35 units)**; **5% retail (11 units)** @ $129.

| Line | Units | Revenue | COGS (blended ~$88) | Net |
|------|-------|---------|---------------------|-----|
| DAO full donation | 186 | $0 | $16,368 | **−$16,368** |
| DAO 50% subsidy | 35 | $2,258 | $3,080 | **−$822** |
| Retail | 11 | $1,419 | $935 | **+$484** |
| **Total** | **232** | **$3,677** | **$20,383** | **−$16,706** |

**Interpretation:** Under founder’s donation-first model, scanner hardware is a **−$16.7k strategic cost** in Year 1 — entirely appropriate if funded by **DAO**, not operating profit. Retail exists to **replenish inventory** and serve non-shelter buyers, not to subsidize the mission.

### 4.4 Break-even retail (irrelevant at 80% donation)

To recover **186 donated units** at $44 margin: **~372 retail units** — confirms retail is **not** the primary recovery path. DAO treasury + protocol cross-sell + grants are.

---

## 5. Freedom Paws DAO funding model (NEW-UPDATED)

### 5.1 Two-phase DAO spend

| Phase | When | DAO pays for | Scanner hardware? |
|-------|------|--------------|-------------------|
| **Phase A — Biometric pilot** | Oct–Dec 2026 | Enroll API, Supabase, training, PR, legal share | **No** — photo match only |
| **Phase B — Chip + scale** | Nov 2026–Mar 2027 | Scanner donations, shipping, expanded onboarding | **Yes** |

### 5.2 DAO budget lines (NEW-UPDATED totals)

| DAO line item | Est. cost | Notes |
|---------------|-----------|-------|
| **Phase A — Biometric pilot ops** | $1,200 | OpenAI + Supabase + Resend (500 enroll / 25 found) |
| **Phase A — Shelter onboarding (6 TN)** | $2,250 | 3 × $750 fully loaded (contract training optional) |
| **Phase A — Enroll sponsorship** | $3,000 | 500 free enrolls × ~$6 API |
| **Phase A — Pilot PR & materials** | $5,000 | Reunion stories, adoption QR cards |
| **Phase A — Legal share (DPA/consent)** | $6,000 | Biometric infrastructure |
| **Phase B — Scanner donations (186 units @ $88)** | $16,368 | **80% of inventory — shelter/vet mission** |
| **Phase B — Subsidy co-pay (DAO half)** | $1,540 | 35 units × $44 DAO share of 50% subsidy |
| **Phase B — Shipping & RMA** | $3,500 | Shelter kits, returns |
| **Phase B — Scale onboarding (17 more shelters)** | $12,750 | 17 × $750 |
| **Phase B — Vet partner kits (10 units donated)** | $850 | Outreach clinics |
| **DAO contingency (10%)** | $5,200 | Price spikes, extra shelter requests |
| **DAO Year 1 total** | **$57,658** | Round to **$48k–$58k envelope** |

*Founder engineering excluded — Decision G self-build.*

### 5.3 Per-shelter DAO package (fully loaded)

| Item | DAO cost (cash) | Retail value to shelter |
|------|-----------------|-------------------------|
| 2× Universal Scan Kit (donated) | $170–$240 COGS | $258 |
| Biometric + found-dog training | $250–$500 | $500+ |
| Account setup + test enroll | $150 | — |
| 50 sponsored owner enrollments | $300 API | $150+ goodwill |
| Adoption packet QR (500 cards) | $50 print | — |
| 30-day success check-in | $75 | — |
| **Per shelter DAO total** | **~$750–$1,275** | **$700+ hardware value** |

**3 pilot shelters (Tennessee):** ~$2,250–$3,825 onboarding + **$0 scanner cost in Phase A**  
**20 shelters by Jan 2027:** ~$15k–$25k onboarding + **~$3,400–$4,800** scanner COGS (40 units @ volume)

### 5.4 DAO vs product build — separate treasuries

| Treasury | Purpose | Y1 envelope |
|----------|---------|-------------|
| **Product build** (lean) | Eng sweat equity, legal, marketing, ops | $45k–$55k cash |
| **Freedom Paws DAO** | Shelter donations, onboarding, enroll sponsorship, scanner COGS | **$48k–$58k** |
| **Combined mission cash** | | **~$93k–$113k** |

DAO may also receive **XRPL protocol revenue allocations** — document as in-kind support, not scanner P&L.

### 5.5 ROI metrics for DAO (not scanner margin)

| Metric | Oct 2026 target | Jan 2027 target |
|--------|-----------------|-----------------|
| Biometric enrollments | 500 | 3,000 |
| Active shelter partners | 3 (Tennessee) | 20 |
| Documented reunions | 1+ | 5+ |
| Cost per enrollment (DAO) | ~$6–$12 | ~$4–$8 (scale) |
| Cost per shelter onboarded | ~$750–$1,275 | ~$750 |

---

## 6. Revenue beyond hardware

| Stream | Start | Y1 note |
|--------|-------|---------|
| Scanner retail (5% of units) | Jan 2027 | ~$1.4k — inventory replenishment only |
| Shelter sponsored enrollments | Q4 2026 | DAO-funded; optional external grants $5k–$20k |
| Protocol cross-sell post-reunion | Ongoing | **Primary revenue** — Token Shop |
| Premium ID ($2.99/mo) | Q2 2027 | Optional |

---

## 7. Timeline summary

| Date | Milestone |
|------|-----------|
| Jun 10, 2026 | Supabase + enroll steps 1–5 + identity API **shipped** |
| Aug 15, 2026 | ViT gait beta; enroll steps 6–9 |
| **Oct 1, 2026** | Biometric pilot (Tennessee) — **DAO Phase A** |
| Nov 2026 | **DAO Phase B** — first scanner donations |
| **Jan 1, 2027** | Full promotion |

---

## 8. Decisions for founder

| # | Item | Recommendation |
|---|------|----------------|
| **I** | Scanner retail | **$129** |
| **J** | Match threshold | **0.72** |
| **K (NEW)** | Approve **DAO $48k–$58k** Year 1 envelope | Separate from product build |
| **L (NEW)** | Donation cap: **2 free scanners / qualifying shelter** | 3rd+ at 50% DAO subsidy |
| **M (NEW)** | Oct pilot = biometric only; scanners from Week 22 | Defer $16k+ hardware until Track 2 |

---

## 9. Recommendations

1. **Approve DAO treasury allocation of $48k–$58k** for shelter donations + onboarding — distinct from $45k–$55k product build.
2. **Plan 80/15/5 distribution** — donation / subsidy / retail — matching founder intent.
3. **Measure DAO ROI** on enrollments and reunions, not scanner gross margin.
4. **Lock retail at $129** for the 5% public channel — replenishment only.
5. **Phase A first** — Tennessee pilot runs without scanner spend; DAO focuses on training + enroll sponsorship.

---

*Freedom Paws ID is not a government pet license. Not veterinary advice. Biometric enrollment requires explicit consent. Match results require human review before owner contact. Phones do not read implanted microchips without Freedom Paws Universal Scan Kit (Track 2).*
