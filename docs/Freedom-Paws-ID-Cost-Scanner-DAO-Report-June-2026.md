# Freedom Paws ID — Development, Technology, Scanner & DAO Economics

> **⚠️ SUPERSEDED** — Use **[MASTER/FINAL June 10, 2026](./Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md)**.

**Prepared for:** Founder review  
**Date:** June 10, 2026 (original draft)  
**Related:** [MASTER/FINAL](./Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md)

---

## Executive summary

Freedom Paws ID is a **two-track program**: biometric reunion (Track 1, Oct 2026 pilot) and universal microchip scanning (Track 2, starts Week 18). Your chosen path is **self-build with contract help when necessary**, **Supabase + pgvector**, and **Jan 1, 2027 promotion** (moved up from Feb 1).

**Bottom line (your scenario — lean self-build + DAO shelter support):**

| Phase | Cash outlay (est.) | Primary funding source |
|-------|-------------------|------------------------|
| Track 1 biometric pilot (through Oct 2026) | **$15,000–$25,000** | Founder time + DAO ops budget |
| Full program through Jan 2027 launch | **$45,000–$55,000** | Self-build + selective contracts |
| Scanner hardware + shipping | **$22,840** | DAO donations + retail replenishment |
| Ongoing ops (Jan 2027) | **~$3,320/mo** | DAO + protocol revenue cross-sell |

**Scanner retail economics at $129/unit:** ~**34% gross margin** at volume COGS ($85). Many units will be **DAO-donated to shelters** — treat donations as **customer acquisition + mission cost**, not profit center. Retail and vet channel recover hardware COGS over time.

---

## 1. Development cost breakdown

### 1.1 Engineering (contract reference vs your self-build path)

| Workstream | Contract hrs | Contract $ | Track | Self-build note |
|------------|-------------|------------|-------|-----------------|
| ViT multi-region + gait | 140 | $21,000 | 1 | Reuses existing `/diagnostics` + new identity mode |
| Backend + auth + My Pets server | 120 | $18,000 | 1 | Supabase — you build; contract for security review only |
| Biometric enroll + embeddings | 120 | $18,000 | 1 | Highest complexity; pgvector |
| Found dog + match queue | 80 | $12,000 | 1 | Human review queue essential |
| Shelter portal | 80 | $12,000 | 1 | CA/TN pilot UX |
| Security + load test | 40 | $6,000 | 1 | Contract recommended before Jan launch |
| **Track 1 subtotal** | **580** | **$87,000** | | |
| Chip BLE + scan UX | 60 | $9,000 | 2 | HID keyboard MVP first (no BLE required Day 1) |
| AAHA / registry UX | 60 | $9,000 | 2 | Partnership email + embed fallback |
| Vet portal | 40 | $6,000 | 2 | Lite at launch |
| Scanner kit commerce | 20 | $3,000 | 2 | `/id/kit` + shop SKU |
| **Track 2 subtotal** | **180** | **$27,000** | | |
| **Engineering total (if fully contracted)** | **760** | **$114,000** | | |

**Your path (Decision G — self-build):** Founder + existing codebase absorbs most Track 1 hours. Budget **$0–$15,000** in contract spikes (security review, embedding pipeline review, legal-tech integration) rather than full $87k Track 1.

### 1.2 Legal & compliance

| Item | Low | High | When |
|------|-----|------|------|
| Privacy policy update (biometric) | $2,000 | $4,000 | Jul 2026 |
| Biometric consent + shelter DPA | $5,000 | $10,000 | Aug 2026 |
| ID module terms + disclaimers | $3,000 | $4,000 | Sep 2026 |
| **Legal total** | **$10,000** | **$18,000** | |

*Not optional for shelter pilots — biometric consent must be live before Oct 1.*

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
| **Lean (your path — self-build)** | **$15,000–$25,000** | **$45,000–$55,000** |
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
| **Cash range** | **$45,000–$55,000** (+ hardware if DAO doesn't pre-fund) |

---

## 2. Technology incorporated

### 2.1 Stack (Decisions D & E — locked)

| Layer | Choice | Role in ID program |
|-------|--------|-------------------|
| **Frontend** | Next.js PWA (existing) | `/id`, `/diagnostics?mode=identity`, shelter portal |
| **Auth** | Supabase Auth | Owner, shelter_staff, vet_staff roles |
| **Database** | Postgres (Supabase) | Pets, enrollments, match queue, audit log |
| **Vector search** | pgvector | Pet embeddings; similarity ≥ threshold (rec. 0.72) |
| **Media** | Vercel Blob or R2 | Region captures (eyes, face, body, posture, gait) |
| **Vision AI** | OpenAI gpt-4o-mini (existing) | `IDENTITY_SYSTEM_PROMPT` — region descriptors |
| **Embeddings** | OpenAI text-embedding-3-small (planned) | Fuse region descriptors → vector |
| **Email** | Resend | Owner match alerts (human-approved) |
| **SMS** | Twilio (Q2 2027) | Urgent reunion notifications |
| **Payments** | XRPL / XUMM (existing shop) | Scanner kit SKU; protocol cross-sell |
| **Marketing site** | Framer | `/freedom-paws-id-toolbox` — pre-launch “planned” copy |
| **Scanner hardware** | OEM universal LF reader (125/128/134.2 kHz) | BLE or HID keyboard → `/id/scan` |

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
| Quality gates (`lib/vit/media-quality-gate`) | Enrollment quality minimums |
| `/mypets` localStorage | Bridge → server pets (Week 3–5) |
| Token Shop / XUMM | Scanner kit + post-reunion protocol upsell |

---

## 3. Scanner development timeline

Track 2 **starts Week 18** (Oct 9, 2026) — gated on biometric pilot progress OR calendar. Promotion **Jan 1, 2027** compresses chip delivery vs original Feb 1 plan.

### 3.1 Phase calendar

| Week | Dates | Milestone | Deliverable |
|------|-------|-----------|-------------|
| **18** | Oct 9–15, 2026 | **Track 2 kickoff** | Order 2 dev scanners; spec lock |
| **19** | Oct 16–22 | HID MVP | `/id/scan` receives keyboard-wedge input |
| **20** | Oct 23–29 | Chip parser | 9 / 10 / 15-digit validation; link to biometric profile |
| **21** | Oct 30–Nov 5 | Registry prep | AAHA partnership email; embed research |
| **22** | Nov 6–12 | Pilot hardware | 30 shelter kits shipped (2 × 15 shelters) |
| **23** | Nov 13–19 | AAHA UX | Registry routing UI |
| **24** | Nov 20–26 | AVID branch | Non-AAHA chip path |
| **25** | Nov 27–Dec 3 | Commerce | `/id/kit` product page |
| **26** | Dec 4–10 | Vet lite | `/id/vet` scan history |
| **27** | Dec 11–17 | **Chip module complete** | 200-unit launch inventory ordered |
| **28** | Dec 18–24 | Hardening | Load test; case study |
| **29** | Jan 1, 2027 | **Promotion mode** | Framer copy live; national push |

### 3.2 Engineering hours (Track 2 only)

| Workstream | Hours | Cash (if contracted @ $150/hr) |
|------------|-------|----------------------------------|
| Chip BLE + scan UX | 60 | $9,000 |
| AAHA / registry UX | 60 | $9,000 |
| Vet portal | 40 | $6,000 |
| Scanner kit commerce | 20 | $3,000 |
| **Total** | **180** | **$27,000** |

**Self-build estimate:** 180 hrs over 11 weeks ≈ **16 hrs/week** Oct–Dec 2026 — feasible alongside Track 1 shelter hardening if pilot is stable.

### 3.3 Hardware procurement schedule

| Item | Qty | Unit cost | Total | When |
|------|-----|-----------|-------|------|
| Dev scanners | 2 | $120 | $240 | Week 18 |
| Pilot shelter kits | 30 | $120 | $3,600 | Week 22 |
| Launch inventory | 200 | $85 | $17,000 | Week 27 |
| Shipping & handling | — | — | $2,000 | Ongoing |
| **Hardware total** | **232** | | **$22,840** | |

*Volume COGS ($85) assumes 200+ unit OEM order. Pilot units at $120 reflect small-batch pricing.*

---

## 4. Scanner unit economics — cost, price & margins

### 4.1 Cost structure (per unit)

| Cost component | Pilot batch ($120 COGS) | Launch volume ($85 COGS) |
|----------------|-------------------------|--------------------------|
| OEM universal LF reader | $95 | $62 |
| Packaging + quick-start card | $8 | $6 |
| Freedom Paws branding sleeve | $5 | $4 |
| QR onboarding (shelter setup URL) | $2 | $2 |
| Inbound freight (allocated) | $10 | $6 |
| Warranty / RMA reserve (5%) | $— | $5 |
| **Total COGS** | **~$120** | **~$85** |

### 4.2 Retail price scenarios

| Retail price | COGS ($85) | Gross profit | Gross margin | Notes |
|--------------|------------|--------------|--------------|-------|
| **$99** | $85 | $14 | **14%** | Too thin — avoid unless promo loss-leader |
| **$129** (recommended) | $85 | $44 | **34%** | Competitive vs Animal ID ~$120 |
| **$149** | $85 | $64 | **43%** | Premium positioning + vet bundle |

**Decision I (pending):** Recommend **$129** retail.

### 4.3 Channel economics

| Channel | Price | COGS | Net before ops | Use case |
|---------|-------|------|----------------|----------|
| Retail (app shop) | $129 | $85 | $44 | Owners, vets, public |
| Shelter pilot subsidy (50% off) | $64.50 | $85 | **−$20.50** | First 2 scanners/shelter — acquisition cost |
| **DAO full donation** | $0 revenue | $85–$120 | **−$85 to −$120** | CA/TN onboarding — mission spend |
| Vet bundle (scanner + 10 enroll credits) | $199 | $85 + $5 digital | ~$109 | Higher margin, stickier |

### 4.4 Year 1 scanner P&L (illustrative)

Assumptions: 200 launch units; **60% DAO-donated to shelters (120 units)**; **40% sold retail (80 units)** @ $129.

| Line | Units | Revenue | COGS | Gross |
|------|-------|---------|------|-------|
| DAO donations | 120 | $0 | $10,200 | **−$10,200** |
| Pilot subsidy (15 shelters × 2 @ 50%) | 30 | $1,935 | $2,550 | **−$615** |
| Retail | 80 | $10,320 | $6,800 | **+$3,520** |
| **Net scanner hardware** | **230** | **$12,255** | **$19,550** | **−$7,295** |

**Interpretation:** Scanner line is **strategically loss-making in Year 1** if heavy donation mix — fund via **Freedom Paws DAO** as shelter onboarding + infrastructure, not as standalone profit. Retail + vet bundles recover **~48% of donated COGS** in this mix. Cross-sell to protocols post-reunion remains primary revenue engine.

### 4.5 Break-even retail units (to cover 120 donations)

| Donated units COGS | Retail margin @ $129 | Units to break even |
|--------------------|----------------------|---------------------|
| $10,200 | $44/unit | **232 retail units** |

→ Donations are **marketing + shelter lock-in**; plan DAO budget accordingly.

---

## 5. DAO funding model — shelter donations & onboarding

### 5.1 What DAO pays for (recommended budget lines)

| DAO line item | Est. cost | Purpose |
|---------------|-----------|---------|
| Pilot shelter scanner donations (30 units) | $3,600 | CA/TN — 2 scanners per pilot shelter |
| Expanded shelter donations (90 units) | $7,650 | Scale to 20 shelters by Jan 2027 |
| Shelter onboarding labor | $5,000 | Training, setup calls, PDF guides |
| Biometric enroll sponsorship | $3,000 | Free enroll events — 500 × ~$6 API cost |
| Legal / DPA (shared) | $5,000–$10,000 | Biometric consent infrastructure |
| Marketing — shelter pilot PR | $5,000 | Reunion stories, local press |
| **DAO subtotal (hardware + onboarding)** | **$29,250–$34,250** | Excludes founder engineering sweat equity |

### 5.2 Per-shelter onboarding cost (fully loaded)

| Activity | Hours | Cost @ $0 (founder) / $75 (contract) |
|----------|-------|----------------------------------------|
| Discovery call + DPA sign | 1 | $0–$75 |
| Staff training (30 min × 3 staff) | 1.5 | $0–$112 |
| Account setup + test enroll | 2 | $0–$150 |
| Scanner install + test scan (Track 2) | 1 | $0–$75 |
| 30-day check-in | 0.5 | $0–$38 |
| **Per shelter (cash)** | **6 hrs** | **$0–$450** + **2 donated scanners ($170–$240 COGS)** |

**3 pilot shelters (CA/TN):** ~$510–$2,070 onboarding + $6,360 hardware (if 2 scanners each at $120)  
**20 shelters by Jan 2027:** scale linearly — **DAO should reserve $35k–$45k** for hardware + onboarding in Year 1.

### 5.3 What shelters receive (DAO package)

| Item | Value to shelter | Freedom Paws benefit |
|------|------------------|----------------------|
| 2× Universal Scan Kit (Track 2) | $258 retail value | Front-desk chip reads all 3 frequencies |
| Biometric found-dog intake training | $500+ consulting equiv. | Found dogs searchable against enrolled members |
| Co-branded adoption packet QR | ~$0.10/card | Enrollment funnel |
| Priority match review queue | Operational | Reunion case studies for grants/press |

### 5.4 Non-hardware DAO costs (Track 1 — biometric only)

Shelters can pilot **without scanners** Oct 2026 — photo-based found-dog match only.

| Item | Est. |
|------|------|
| OpenAI API (500 enroll + 25 found reports) | $400–$800 |
| Supabase Pro (pilot tier) | $150–$300 |
| Email alerts (Resend) | $50 |
| **Oct–Dec 2026 biometric pilot ops** | **~$600–$1,150** |

---

## 6. Revenue beyond hardware

| Stream | Start | Unit | Y1 projection |
|--------|-------|------|---------------|
| Scanner kit retail | Jan 2027 | $129 | $10k–$15k (80–120 units) |
| Shelter sponsored enrollments | Q4 2026 | B2B grant | $5k–$20k |
| Premium ID protection (optional) | Q2 2027 | $2.99/mo | $10k+ |
| Protocol cross-sell post-reunion | Ongoing | Lifetime SKU | Core — existing Token Shop |

---

## 7. Timeline summary (founder-locked)

| Date | Milestone |
|------|-----------|
| Jun 10, 2026 | Engineering start — `/id` scaffold + identity prompts |
| Aug 15, 2026 | ViT multi-region + gait beta |
| **Oct 1, 2026** | **Biometric shelter pilot** (CA/TN) |
| Oct 9, 2026 | Track 2 scanner dev begins (Week 18) |
| Dec 15, 2026 | Chip module complete |
| **Jan 1, 2027** | **Full promotion mode** |
| Q2 2027 | SMS alerts; scale shelters to 75 |

---

## 8. Decisions still open

| # | Item | Recommendation |
|---|------|----------------|
| **I** | Scanner retail price | **$129** |
| **J** | Match threshold | **0.72** (tune in CA/TN pilot) |
| **New** | DAO scanner donation cap Year 1 | Suggest **120 units max** then 50% subsidy |
| **New** | Shelter onboarding SLA | 6 hrs/shelter founder labor or $450 contract cap |

---

## 9. Recommendations for founder approval

1. **Approve DAO budget envelope** of **$35k–$45k** for Year 1 shelter hardware + onboarding (donations + subsidy), separate from **$45k–$55k** product build cash.
2. **Lock scanner retail at $129** — viable margin at volume; avoids $99 race-to-bottom.
3. **Treat donated scanners as CAC** (customer acquisition cost), not P&L profit — report reunions + enrollments as ROI.
4. **Pilot biometric without hardware** Oct 2026 — defer $3,600 scanner spend to Week 22 if cash-constrained.
5. **Contract only for:** legal, security review, and AAHA partnership liaison — keep build in-house per Decision G.

---

*Freedom Paws ID is not a government pet license. Not veterinary advice. Biometric enrollment requires explicit consent. Match results require human review before owner contact. Phones do not read implanted microchips without Freedom Paws Universal Scan Kit (Track 2).*
