# ViT Pro — Comprehensive Business Plan, Build Roadmap & 5-Year Financial Model

**Product:** ViT Pro Veterinary Clinical Decision Support (CDS) Module  
**Parent company:** Freedom Paws Wellness, Inc. (planned LLC)  
**Document date:** June 20, 2026  
**Prepared for:** Founder — strategy, fundraising, vet partnerships, IP counsel  
**Status:** Strategic planning — not medical, legal, tax, or investment advice  

**Save copy to:**  
`~/Documents/Freedom Paws Wellness/ViT-Pro-Business-Plan-and-Roadmap-June-2026.md`

**Related documents:**
- `docs/ops/ViT-PRO-VET-MODULE-RESEARCH-REPORT-June-20-2026.md`
- `docs/Freedom-Paws-Patent-IP-Follow-Up-June-2026.md`
- `docs/Freedom-Paws-10-Year-Vision-Valuation-and-Growth-Plan-June-2026.md`
- `docs/Freedom-Paws-Competitive-Market-Dominance-and-5-Year-Model-June-13-2026.md`

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Strategic recommendation](#2-strategic-recommendation)
3. [Product definition — dual tier model](#3-product-definition--dual-tier-model)
4. [Technical architecture & current state](#4-technical-architecture--current-state)
5. [Competitive landscape & market gap](#5-competitive-landscape--market-gap)
6. [Scientific evidence & body-system feasibility](#6-scientific-evidence--body-system-feasibility)
7. [Regulatory, validation & vet advisory](#7-regulatory-validation--vet-advisory)
8. [Intellectual property & patent strategy](#8-intellectual-property--patent-strategy)
9. [Time-based build roadmap (itemized)](#9-time-based-build-roadmap-itemized)
10. [Build & operating cost summary](#10-build--operating-cost-summary)
11. [5-year P&L — integrated Freedom Paws model](#11-5-year-pl--integrated-freedom-paws-model)
12. [5-year P&L — standalone ViT Pro product](#12-5-year-pl--standalone-vit-pro-product)
13. [Valuation potential](#13-valuation-potential)
14. [Standalone vs. integrated — should it be offered separately?](#14-standalone-vs-integrated--should-it-be-offered-separately)
15. [Risks & mitigations](#15-risks--mitigations)
16. [Founder decisions & next 90 days](#16-founder-decisions--next-90-days)
17. [Document control](#17-document-control)

---

## 1. Executive summary

**ViT Pro** is a veterinary **clinical decision support (CDS)** module built on Freedom Paws’ existing Vision Transformer (ViT) diagnostics pipeline. It transforms owner and clinic photo/video uploads into **literature-cited, structured clinical reports** for licensed veterinarians — while preserving a separate **public wellness tier** for pet owners.

| Dimension | Summary |
|-----------|---------|
| **Market gap** | No phone-first PWA combines owner wellness triage, vet-grade CDS reports, biometric ID, adoption network, and holistic protocol commerce in one platform. |
| **Regulatory posture** | CDS for licensed professionals — not autonomous diagnosis. Avoid SaMD claims until funded for FDA pathway. |
| **Build (engineering)** | **680–1,000 hours** full module; **400–520 hours** for shippable Vet Pro MVP (V0 + V1). |
| **All-in Year 1 investment** | **$50k–$190k** (self-build + validation depth). |
| **Y5 revenue (integrated, conservative)** | **~$2.0M–$2.8M** platform revenue with ViT Pro as growth engine. |
| **Y5 revenue (standalone ViT Pro only)** | **~$1.5M–$2.5M ARR** at 600–900 practices. |
| **Y5 valuation uplift (ViT Pro contribution)** | **+$8M–$25M** strategic option value on top of base Freedom Paws valuation. |
| **Patentability** | **Moderate** for integrated system/method claims; **weak** for generic AI triage. Provisional recommended before national B2B marketing. |
| **Standalone recommendation** | **Yes — as a branded B2B SKU** (`ViT Pro` / `Atlas CDS`) sold to any clinic, with Freedom Paws ecosystem as upsell — not locked to Freedom Paws members only. |

---

## 2. Strategic recommendation

### Incorporate the approach — sequenced, not all-at-once

| Phase | When | Action |
|-------|------|--------|
| **Now (pre-LLC)** | Q3 2026 | Recruit 1 vet advisor; Phase V0 (RAG corpus, rubrics, 50-photo benchmark). ~$5k–8k cash. |
| **Post-LLC/trademark** | Q4 2026 – Q1 2027 | Phase V1 MVP: `/vet/vit-pro`, PDF reports, 3-clinic pilot. ~$25k–35k validation. |
| **Parallel** | Ongoing | Track 2 chip reader, adoption network, public Tier A ViT — different buyers, same platform. |
| **After pilot traction** | 2027 H2 | Phase V2 gait module if clinics request mobility screening. |
| **Defer** | 2028+ | Seizure module (V4) until advisory board + formal validation study. |

### Why this sequencing wins

1. **Reuses 70% of existing code** — `app/api/analyze`, partner auth, ops shell, vision pipeline.
2. **Lowest-risk revenue** — B2B SaaS ($199–299/mo) with 70–85% gross margin after API costs.
3. **Validates the public app** — vet endorsement increases owner trust in Tier A.
4. **Creates acquirer optionality** — Zoetis, IDEXX, Mars/Kinship, or Pawp-class strategics may buy CDS + data moat without buying full “everything app.”

---

## 3. Product definition — dual tier model

### Tier A — Public (Freedom Paws Wellness) — *live today*

| Element | Detail |
|---------|--------|
| **Audience** | Pet owners |
| **Input** | Photo + 10–15s video + optional symptom text |
| **Output** | Wellness **indications**, top-2 **holistic protocols**, urgency banner |
| **Language** | “Signs consistent with…”, “Consider Clear Vision protocol” |
| **Price** | Free / member credits / protocol unlocks |
| **Legal** | Educational tool only; confidence capped ≤92%; `vetUrgent` server-gated |

### Tier B — ViT Pro Vet (new)

| Element | Detail |
|---------|--------|
| **Audience** | Licensed DVMs & RVTs (practice account, license verified) |
| **Input** | Same media + signalment + history fields |
| **Output** | Structured report: findings, **differential considerations**, recommended diagnostics, **literature citations**, PDF + EMR paste |
| **Regions (MVP)** | Eye, skin, oral |
| **Regions (V2+)** | Gait video, optional neuro event flag |
| **Language** | CDS — “Findings suggest consideration of…” |
| **Price** | **$199/mo** Starter (5 seats, 200 scans) · **$299/mo** Pro (10 seats, 500 scans) · **$0.75/scan** overage |

### Cross-tier data flow

```
Owner scan (Tier A) ──share link──► Vet opens Tier B report (media + timeline + citations)
Vet scan in clinic (Tier B) ──► Optional Tier A client handout (plain language)
Freedom Paws ID enroll ──► Same capture session feeds biometric descriptors (integrated only)
```

---

## 4. Technical architecture & current state

### Live pipeline (repo — June 2026)

| Layer | File(s) | Capability |
|-------|---------|------------|
| Member UI | `app/diagnostics/ViTDiagnosticsClient.tsx` | Photo + video upload |
| Video | `lib/vit/extract-video-frames.ts` | 3–5 frames → vision API |
| API | `app/api/analyze/route.ts` | `mode=wellness` \| `identity` \| `both` |
| Vision | `lib/ai/vision-analyze.ts` | OpenAI GPT-4o-mini structured JSON |
| Lexicon | `lib/ai/symptom-lexicon.ts` | ~200 phrases → 10 protocols |
| Fusion | `lib/ai/diagnostics.ts` | Text + vision → top-2 supplements |
| Urgency | `lib/ai/urgent-assessment.ts` | Severe DB + ≥80% congruency → vet urgent |
| Identity | `lib/ai/identity-analyze.ts` | Eyes, face, body, posture, gait descriptors |
| Prompts | `lib/ai/prompt-templates.ts` | Dr. Atlas — wellness educator |

### ViT Pro additions (planned)

```
Photo/video upload
    → Region detector + quality gate (existing)
    → Region-specific vision pass (enhanced prompts / specialist schemas)
    → RAG retrieve top-k literature chunks (new)
    → Structured report generator — JSON schema (new)
    → Tier A summary OR Tier B full report (new mode flag)
    → Audit log + report version ID (new — medico-legal)
    → PDF generator + EMR plain-text export (new)
```

### Region coverage — current vs. ViT Pro target

| Region | Tier A today | ViT Pro target | Build phase |
|--------|--------------|----------------|-------------|
| **Eyes** | General vision → Clear Vision | Capture guide, discharge taxonomy, cited differentials | V1 |
| **Skin** | Hot spots, rash → Allergy Shield | Body map, lesion scoring, differential list | V1 |
| **Mouth/dental** | Tartar, gums → Fresh Smile | Tartar grade 0–3, scheduling recommendation | V1 |
| **Gait/ortho** | Sampled frames, generic prompt | Pose keypoints, symmetry score, rads referral | V2 |
| **Seizure/neuro** | Not implemented | Conservative “possible event” flag only | V4 |

### Technical gaps (priority order)

1. **RAG corpus + citation injection** — P0  
2. **Region JSON schemas + rubrics** — P0  
3. **Vet portal + practice auth + license verify** — P0  
4. **PDF / EMR export** — P0  
5. **Gait kinematics model** — P1  
6. **Seizure classifier** — P2 (defer)

### Stack (unchanged)

Next.js PWA · Vercel · Supabase · OpenAI GPT-4o-mini · Stripe (vet billing) · existing partner/ops auth patterns

---

## 5. Competitive landscape & market gap

### Consumer photo AI (partial overlap)

| Product | Vet report | Protocols/ID | Phone PWA |
|---------|------------|--------------|-----------|
| Yipara | No | No | Yes |
| VetPati | Consumer PDF | No | Yes |
| Pet Snap Health | Timeline summary | No | Yes |
| **Freedom Paws (today)** | No clinical PDF | **Yes** | **Yes** |
| **ViT Pro (planned)** | **Cited CDS PDF** | **Yes** | **Yes** |

### Veterinary B2B AI

| Product | Phone-first | Owner funnel | Holistic protocols |
|---------|-------------|--------------|-------------------|
| Zoetis Imagyst | No (lab slide) | No | No |
| SignalPET (radiology) | No | No | No |
| Pawp / Vetster | App, telehealth | Limited | No |
| **ViT Pro** | **Yes** | **Owner → vet handoff** | **Yes (unique)** |

### Addressable market (US, illustrative)

| Segment | Count | ViT Pro wedge |
|---------|-------|---------------|
| Small-animal vet practices | ~28,000 | Primary B2B target |
| Emergency / specialty | ~4,000 | Phase 2 (referral reports) |
| Mobile / house-call vets | ~3,000 | High phone-first fit |
| **Realistic Y5 penetration** | **600–1,000 practices (2–3.5%)** | Conservative base case |

---

## 6. Scientific evidence & body-system feasibility

| Body system | Public tier feasibility | Vet CDS feasibility | Gold standard |
|-------------|------------------------|----------------------|---------------|
| **Eyes** | High (indications) | Medium (rubrics + citations) | Fluorescein, Schirmer |
| **Skin** | High (triage) | Medium (differential list) | Cytology, scrape |
| **Oral** | High (wellness dental) | Medium (photo index) | Anesthesia + probe |
| **Gait** | Medium (screening) | Medium (symmetry score) | Orthopedic exam, rads |
| **Seizure** | Low (urgent flag only) | Low until validated | EEG, exam |

**Scientific approach:** RAG over AAHA/ACVO/Merck (licensed) + PubMed OA + internal lexicon — not fine-tune-first.

---

## 7. Regulatory, validation & vet advisory

### Regulatory framing

| Tier | US classification | Requirements |
|------|-------------------|--------------|
| Tier A Public | Wellness / education | Disclaimers (live today) |
| Tier B Vet CDS | Clinical decision support | Vet-only login, validation docs, PLI, BAA if PHI |
| Tier B as SaMD | Medical device | **Avoid** until FDA strategy funded |

### Veterinary advisory — Year 1 structure

| Role | Count | Compensation | Responsibilities |
|------|-------|--------------|------------------|
| **Lead advisor (DVM)** | 1 | $5k–12k/yr stipend | Rubrics, benchmark review, pilot intro, report template sign-off |
| **Reviewer (DVM/RVT)** | 0–1 | $1.5k–3k/yr | Quarterly case audit |
| **Specialist (optional)** | 0–1 | Project-based | Gait or derm depth when V2 ships |

**Time:** 2–4 hrs/mo (V0) → 4–8 hrs/mo (V1 pilot).

### Validation — three levels

| Level | Scope | Cost | When |
|-------|-------|------|------|
| **L1 Internal benchmark** | 50 photos vs. advisor gold standard | $0–2k | Before V1 UI ships |
| **L2 Pilot study** | 100 cases, 3 clinics, usability + safety | $25k–40k | During V1 (required) |
| **L3 Rigorous study** | 200+ cases, endpoints, optional university IRB | $60k–75k+ | Year 2+ if scaling or fundraising |

**L1 pass criteria:** Zero missed critical urgents; ≥70% advisor agreement on differential *considerations*; 100% citation presence on Vet Pro reports.

---

## 8. Intellectual property & patent strategy

*Not legal advice. Consult a patent attorney before filing or public disclosure.*

### What is unlikely patentable

- Generic “AI pet symptom checker” or photo triage  
- RAG + PDF reports (prior art in human medical AI)  
- Business method: “charge vets monthly for AI”  
- Obvious combination: vision model + symptom text + recommendation list  

### What may be patentable (narrow claims)

| Claim theme | Example | Strength |
|-------------|---------|----------|
| **Integrated multi-purpose capture** | Single media session → biometric ID + Tier A + Tier B + protocol map + adoption match | **Moderate–Strong** |
| **Congruency-gated urgency fusion** | Severe-condition DB + vision/text congruency ≥80% → urgent flag + protocol rank | **Moderate** |
| **Owner→vet tier handoff** | Tier A share link → Tier B cited report with audit version ID | **Moderate** |
| **Holistic protocol mapping graph** | Lexicon → 10 named protocols fused with vision confidence boost | **Moderate** (also trade secret) |
| **Gait capture + symmetry method** | Specific phone protocol + pose algorithm (if novel vs. literature) | **Depends on implementation** |

### Recommended IP stack

| Type | Action | Priority | Est. cost |
|------|--------|----------|-----------|
| **Provisional patent** | Integrated system/method before national B2B marketing | High | $2k–5k + $70–300 USPTO |
| **Trademark** | ViT Pro™, Dr. Atlas™, Freedom Paws Wellness® | High | $350–750/class |
| **Trade secrets** | Lexicon, rubrics, RAG corpus curation, congruency thresholds | High | $0 (process) |
| **Copyright** | Report templates, code, protocol text | Automatic | $0 |
| **Utility patent (full)** | Only if prior-art search positive | Medium | $10k–25k over 2–4 yrs |

### Prior art search terms (before filing)

`veterinary symptom checker AI` · `pet vision diagnosis mobile` · `clinical decision support veterinary` · `dog lameness video gait smartphone`

---

## 9. Time-based build roadmap (itemized)

### Overview timeline

| Phase | Calendar | Eng hours | Milestone |
|-------|----------|-----------|-----------|
| **V0** | Weeks 1–6 (Q3 2026) | 80–120 | RAG + rubrics + benchmark |
| **V1** | Weeks 7–18 (Q4 2026 – Q1 2027) | 280–380 | Vet Pro MVP + pilot |
| **V2** | Weeks 19–28 (2027 H1) | 120–200 | Gait module |
| **V3** | Parallel w/ V1–V2 | 60–80 | Public Tier A upgrade + share link |
| **V4** | 2028+ | 80–120 | Seizure screening (if validated) |

**Total:** 680–1,000 engineering hours over ~18–24 months (part-time self-build) or ~9–12 months (full-time + contractor for ML).

---

### Phase V0 — Scientific foundation (Weeks 1–6)

| Week | Task | Hours | Owner | Deliverable |
|------|------|-------|-------|-------------|
| 1 | Recruit lead vet advisor; kickoff call | 4 | Founder | Advisor MOU |
| 1–2 | Curate RAG corpus (100 docs, public + licensed) | 24 | Founder + advisor | Corpus index CSV |
| 2–3 | Define eye/skin/oral JSON rubrics | 20 | Eng + advisor | `lib/vit-pro/rubrics/*.json` |
| 3–4 | RAG infra: embed + retrieve + cite | 40 | Eng | `lib/vit-pro/rag/` |
| 4–5 | 50-photo benchmark collection | 12 | Founder | Labeled dataset |
| 5–6 | Benchmark run + advisor review | 16 | Advisor + eng | Benchmark report PDF |
| 6 | `mode=vit_pro` API schema (no UI) | 24 | Eng | OpenAPI / types |

**V0 exit gate:** Advisor sign-off on rubrics; zero critical urgent misses on benchmark; RAG citations on 100% of test reports.

---

### Phase V1 — Vet Pro MVP (Weeks 7–18)

| Week | Task | Hours | Deliverable |
|------|------|-------|-------------|
| 7–8 | Practice auth + license verification | 32 | `/vet/vit-pro` login |
| 8–9 | Region modules: eye, skin, oral enhanced passes | 48 | Region analyzers |
| 9–10 | Report generator (JSON → structured CDS) | 40 | Report schema v1 |
| 10–11 | PDF generator + EMR plain-text export | 32 | PDF template |
| 11–12 | Case list + audit log + version ID | 24 | Supabase tables |
| 12–13 | Validation case-review UI (pilot) | 32 | `/vet/vit-pro/review` |
| 13–14 | Stripe practice billing (Starter/Pro) | 40 | Checkout + webhooks |
| 14–15 | Security pass + BAA template + terms | 24 | Legal docs |
| 15–16 | Onboard 3 pilot clinics (TN/CA) | 16 | Pilot MOUs |
| 16–18 | 100-case pilot + weekly advisor review | 40 | Pilot summary report |

**V1 exit gate:** 3 clinics complete pilot; NPS ≥40; ≥60% “would pay after free month”; no critical safety incidents.

---

### Phase V2 — Video gait module (Weeks 19–28)

| Week | Task | Hours | Deliverable |
|------|------|-------|-------------|
| 19–20 | Capture protocol UX (walk toward/away) | 16 | Gait capture guide |
| 20–22 | Pose estimation integration | 48 | Keypoint pipeline |
| 22–24 | Symmetry / stride scoring | 40 | Mobility score 0–100 |
| 24–25 | Gait section in Vet Pro PDF | 24 | Gait report block |
| 25–26 | Max Movement + Infrared Spine protocol link | 16 | Protocol fusion |
| 27–28 | Advisor validation (20 gait videos) | 24 | Gait accuracy memo |

---

### Phase V3 — Public Tier A upgrade (parallel)

| Week | Task | Hours | Deliverable |
|------|------|-------|-------------|
| V1+ | Same engine, simplified Tier A output | 32 | Updated `/diagnostics` |
| V1+ | “Share with your vet” magic link | 28 | Owner → vet handoff |
| V2+ | Optional Pro report unlock (vet pays or owner credit) | 20 | Monetization rules |

---

### Phase V4 — Seizure screening (2028+, conditional)

| Gate | Requirement |
|------|-------------|
| Advisory board ≥3 DVMs | Signed |
| L3 validation budget approved | $60k+ |
| Legal sign-off on neuro language | No “ruled out” claims |

| Task | Hours |
|------|-------|
| Event video upload + conservative flag | 40 |
| Vet-labeled training set (partner clinic) | 80+ (ops) |
| Classifier MVP + urgent banner | 80 |
| Clinical validation study | Non-eng $60k–75k |

---

### Quarterly master calendar (2026–2030)

| Quarter | Engineering focus | Business focus | Spend (cum.) |
|---------|-------------------|----------------|--------------|
| **2026 Q3** | V0: RAG, rubrics, benchmark | Advisor recruit | $5k–8k |
| **2026 Q4** | V1 start: portal, API, PDF | LLC/TM clearance; pilot LOIs | $15k–25k |
| **2027 Q1** | V1 complete; 3-clinic pilot | First paid practices (10–30) | $35k–55k |
| **2027 Q2** | V3 share link; Tier A upgrade | Sales: 30→75 practices | $45k–65k |
| **2027 Q3** | V2 gait MVP | 75→120 practices | $55k–80k |
| **2027 Q4** | Gait validation; billing scale | Break-even on ViT Pro ops | — |
| **2028** | V2 polish; EMR integrations | 120→300 practices | — |
| **2029** | Enterprise features; API partners | 300→500 practices | — |
| **2030** | V4 eval; white-label SKU | 500→750 practices | — |

---

## 10. Build & operating cost summary

### Engineering (680–1,000 hrs @ $150/hr contract equivalent)

| Workstream | Hours | Priority |
|------------|-------|----------|
| RAG corpus + infra | 80–120 | P0 |
| Region modules (eye, skin, oral) | 100–140 | P0 |
| Vet Pro portal | 120–160 | P0 |
| PDF + EMR export | 40–60 | P0 |
| Validation tooling | 60–80 | P1 |
| Stripe + seat management | 40–60 | P1 |
| Security / HIPAA-adjacent | 40–60 | P1 |
| Video gait kinematics | 120–200 | P1 |
| Seizure screening | 80–120 | P2 |
| **Total** | **680–1,000** | |

**Self-build cash (API, legal, corpus, GPU):** $15k–40k  
**Contract equivalent:** $102k–150k

### Non-engineering Year 1 (itemized)

| Line item | Low | Mid | High |
|-----------|-----|-----|------|
| Lead advisor stipend | $3k | $7k | $12k |
| Second reviewer | $0 | $1.5k | $3k |
| Pilot travel / debriefs | $500 | $1k | $2k |
| **Vet advisory subtotal** | **$5k** | **$10k** | **$15k** |
| Case labeling (100 cases) | $5k | $10k | $20k |
| Coordinator / part-time RA | $3k | $8k | $15k |
| De-ID / consent tooling | $1k | $3k | $8k |
| BAA-compliant storage uplift | $1k | $3k | $6k |
| Biostat / white paper | $2k | $10k | $20k |
| Pilot clinic incentives | $5k | $8k | $12k |
| Contingency (10%) | $2.5k | $4.5k | $7.5k |
| **Pilot validation subtotal** | **$25k** | **$45k** | **$75k** |
| Corpus licensing | $0 | $2k | $5k |
| RAG platform / embeddings | $500 | $2k | $3k |
| Permissions legal | $500 | $1.5k | $3k |
| **Corpus subtotal** | **$2k** | **$5k** | **$10k** |
| E&O insurance uplift | $1.5k | $3k | $5k |
| Cyber liability | $1k | $2k | $2.5k |
| **Insurance subtotal** | **$3k** | **$5k** | **$8k** |
| **Non-engineering total** | **$35k** | **$65k** | **$108k** |

### Legal / regulatory (additional)

| Item | Low | High |
|------|-----|------|
| Vet CDS terms, BAA, privacy | $8k | $25k |
| Regulatory counsel (CDS framing) | $5k | $15k |
| **Legal total** | **$15k** | **$40k** |

### **All-in Year 1 to pilot: $50k–$190k**

### Operating cost per scan

| Tier | Cost/scan |
|------|-----------|
| Tier A (today) | $0.02–0.05 |
| Tier A + video | $0.05–0.10 |
| Tier B Vet Pro | $0.10–0.25 |
| Tier B + gait | $0.15–0.35 |

**Gross margin on Vet Pro subscription:** 70–85% after API (at plan quotas).

---

## 11. 5-year P&L — integrated Freedom Paws model

*ViT Pro as growth engine inside Freedom Paws ecosystem. Includes vet subscription, scan overage, and ecosystem attribution (protocol/affiliate/ID driven by ViT funnel).*

### Assumptions

| Assumption | Value |
|------------|-------|
| Avg vet practice ARPU | $220/mo blended (Starter/Pro mix) |
| Overage | $0.75/scan; 15% of practices exceed quota by Y3 |
| Ecosystem attribution to ViT | 25–35% of protocol/affiliate revenue |
| API + infra | 12–18% of ViT-attributed revenue |
| ViT Pro dedicated opex (sales, advisor, support) | Ramps $80k Y1 → $400k Y5 |
| Give-back (10% net on consumer lines) | Applies to ecosystem lines only |

### Scenario A — Conservative (integrated)

| Line item | Y1 (2027) | Y2 (2028) | Y3 (2029) | Y4 (2030) | Y5 (2031) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| **Vet practices (EOY)** | 30 | 120 | 300 | 500 | 700 |
| **Vet subscription revenue** | $72k | $290k | $720k | $1.20M | $1.68M |
| **Scan overage revenue** | $4k | $18k | $54k | $90k | $126k |
| **Ecosystem attribution (protocol/affiliate/ID)** | $16k | $100k | $350k | $550k | $750k |
| **Total ViT-attributed revenue** | **$92k** | **$408k** | **$1.12M** | **$1.84M** | **$2.56M** |
| API + infra COGS | $8k | $45k | $130k | $220k | $310k |
| **Gross profit** | **$84k** | **$363k** | **$990k** | **$1.62M** | **$2.25M** |
| ViT Pro opex (sales, advisor, support) | $80k | $120k | $180k | $260k | $340k |
| **ViT Pro contribution (EBITDA-style)** | **$4k** | **$243k** | **$810k** | **$1.36M** | **$1.91M** |
| **Gross margin %** | 91% | 89% | 88% | 88% | 88% |
| **Contribution margin %** | 4% | 60% | 72% | 74% | 75% |

*Y1 near breakeven on ViT Pro line after opex — expected for pilot year.*

### Scenario B — Breakout (integrated)

| Line item | Y1 | Y2 | Y3 | Y4 | Y5 |
|-----------|-----|-----|-----|-----|-----|
| **Vet practices (EOY)** | 75 | 400 | 1,000 | 1,600 | 2,200 |
| **Vet subscription revenue** | $180k | $960k | $2.40M | $3.84M | $5.28M |
| **Scan overage** | $12k | $80k | $240k | $400k | $550k |
| **Ecosystem attribution** | $48k | $270k | $960k | $1.50M | $2.10M |
| **Total ViT-attributed revenue** | **$240k** | **$1.31M** | **$3.60M** | **$5.74M** | **$7.93M** |
| **Gross profit (88%)** | $211k | $1.15M | $3.17M | $5.05M | $6.98M |
| ViT Pro opex | $100k | $250k | $450k | $650k | $850k |
| **ViT Pro contribution** | **$111k** | **$900k** | **$2.72M** | **$4.40M** | **$6.13M** |

---

## 12. 5-year P&L — standalone ViT Pro product

*Sold as **ViT Pro™** (or white-label **Atlas CDS™**) to any veterinary practice — no requirement to use Freedom Paws consumer app, ID, or Token Shop.*

### Standalone differences

| Factor | Integrated | Standalone |
|--------|------------|------------|
| Owner → vet funnel | Built-in | Requires EMR integration or clinic marketing |
| Protocol cross-sell | High | None (unless upsold) |
| CAC | Lower (ecosystem) | Higher (direct B2B sales) |
| Pricing power | $199–299/mo | $249–349/mo possible (clinical SKU) |
| Gross margin | 70–85% | 75–88% (no consumer give-back) |

### Scenario A — Conservative (standalone)

| Line item | Y1 | Y2 | Y3 | Y4 | Y5 |
|-----------|-----|-----|-----|-----|-----|
| **Vet practices (EOY)** | 20 | 80 | 200 | 350 | 550 |
| **ARPU** | $249/mo | $249/mo | $259/mo | $269/mo | $279/mo |
| **Subscription revenue** | $50k | $220k | $550k | $990k | $1.62M |
| **Overage revenue** | $3k | $15k | $45k | $90k | $135k |
| **White-label / API (Y3+)** | $0 | $0 | $25k | $75k | $150k |
| **Total revenue** | **$53k** | **$235k** | **$620k** | **$1.16M** | **$1.91M** |
| COGS (API, infra, support tools) | $6k | $28k | $75k | $140k | $230k |
| **Gross profit** | **$47k** | **$207k** | **$545k** | **$1.02M** | **$1.68M** |
| Sales & marketing | $40k | $80k | $120k | $160k | $200k |
| Advisor + validation (amortized) | $25k | $15k | $10k | $10k | $10k |
| G&A (legal, insurance) | $20k | $25k | $30k | $35k | $40k |
| **Operating profit** | **($38k)** | **$87k** | **$385k** | **$815k** | **$1.43M** |
| **Net margin %** | −72% | 37% | 62% | 70% | 75% |

### Scenario B — Breakout (standalone)

| Line item | Y1 | Y2 | Y3 | Y4 | Y5 |
|-----------|-----|-----|-----|-----|-----|
| **Vet practices (EOY)** | 50 | 250 | 650 | 1,100 | 1,600 |
| **Total revenue** | $140k | $720k | $1.95M | $3.35M | $4.90M |
| **Operating profit** | $20k | $290k | $1.05M | $2.01M | $3.19M |

---

## 13. Valuation potential

*Illustrative ranges — not a 409A appraisal. Multiples reflect B2B health SaaS with validation docs and strategic pet-market interest.*

### ViT Pro standalone entity value (SaaS-only)

| Stage | ARR | Typical multiple | Valuation range |
|-------|-----|------------------|-----------------|
| **Post-pilot (Y1)** | $50k–140k | 8–15× (option value) | **$0.4M–$2.1M** |
| **Product-market fit (Y2)** | $220k–720k | 6–10× | **$1.3M–$7.2M** |
| **Scale (Y3)** | $620k–1.95M | 8–12× | **$5M–$23M** |
| **Leader (Y5 conservative)** | $1.91M | 8–12× | **$15M–$23M** |
| **Leader (Y5 breakout)** | $4.90M | 10–15× | **$49M–$74M** |

### Strategic acquisition premium

| Acquirer type | Why ViT Pro matters | Premium over SaaS multiple |
|---------------|---------------------|----------------------------|
| **Zoetis / IDEXX / Mars-Kinship** | Phone-first CDS + data flywheel | +30–50% |
| **Chewy / Pawp** | Telehealth pre-visit intake | +20–40% |
| **Pet insurance (Lemonade, Fetch)** | Triage + routing | +15–30% |

**Example strategic Y5 range (conservative standalone, $1.91M ARR):** **$20M–$35M** if validated + 550 clinics + clean IP.

### ViT Pro contribution to Freedom Paws integrated valuation

| Freedom Paws base (June 2026) | $1.0M–$1.5M |
|-------------------------------|-------------|
| + ViT Pro option (post V1 pilot) | +$0.5M–$2M |
| + ViT Pro at scale (Y3, integrated) | +$5M–$15M |
| + Full ecosystem Y5 (from 10-year plan) | $15M–$35M total company |

**ViT Pro accelerates valuation** by adding a **defensible B2B revenue line** that pure consumer pet wellness apps lack.

---

## 14. Standalone vs. integrated — should it be offered separately?

### Recommendation: **Yes — dual go-to-market**

| Channel | Brand | Buyer | Role |
|---------|-------|-------|------|
| **Integrated** | Freedom Paws ViT → ViT Pro | Owner + their vet | Funnel, mission, protocol cross-sell |
| **Standalone B2B** | **ViT Pro™** or **Atlas CDS™ for Veterinary Practices** | Practice manager / medical director | Direct sales, no consumer app required |
| **White-label (Y3+)** | Partner-branded CDS | Corporate groups, telehealth platforms | API + revenue share |

### Why standalone makes sense

1. **Larger TAM** — 28,000 US practices vs. Freedom Paws member base alone.  
2. **Faster B2B sales cycle** — vet buys CDS for workflow; doesn’t need to adopt full super-app.  
3. **Acquisition optionality** — strategics may want CDS without crypto shop, XRPL, or shelter ops.  
4. **Higher ARPU** — standalone can price $249–349/mo without subsidizing consumer tier.  
5. **Regulatory clarity** — B2B CDS terms simpler when decoupled from consumer wellness claims.

### Why keep integrated (don’t split the company yet)

1. **Owner → vet handoff** is the unique moat — hard to replicate standalone.  
2. **Protocol + ID cross-sell** adds 25–35% attributed revenue integrated vs. standalone.  
3. **One codebase** — `mode=vit_pro` flag, not a separate product to maintain.  
4. **Mission narrative** — shelters and veterans trust Freedom Paws; ViT Pro inherits brand equity.

### Suggested structure (Year 1–3)

```
Freedom Paws Wellness, Inc.
├── Consumer PWA (Tier A ViT, ID, adoption, protocols) — free/member
├── ViT Pro™ (Tier B CDS) — sold standalone OR bundled
│   ├── vitpro.freedompawsinc.com (or subdomain)
│   ├── Practice login (license verified)
│   └── Optional: white-label API (Y3)
└── IP held at parent — license to any future spin-out
```

**Do not spin out until:** ARR >$1M standalone **and** a strategic offer or dedicated B2B sales hire justifies separate entity costs (~$30k–50k/yr admin + legal).

### Standalone packaging (launch SKUs)

| SKU | Price | Includes |
|-----|-------|----------|
| **ViT Pro Starter** | $249/mo | 5 seats, 200 scans, eye/skin/oral, PDF |
| **ViT Pro Clinical** | $349/mo | 10 seats, 500 scans, gait (V2), priority support |
| **Enterprise** | Custom | SSO, API, white-label, multi-location |
| **Pilot** | Free 60 days | 100 scans, case study commitment |

---

## 15. Risks & mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hallucinated diagnosis | High | RAG citations required; vet-only strong language; confidence bands |
| FDA SaMD reclassification | High | CDS framing; professional-only; legal review before claims |
| False negative (urgent) | Critical | Conservative urgent banners; L1/L2 validation; never “ruled out” |
| Slow vet adoption | Medium | EMR paste, 2-min workflow, free pilot, advisor champions |
| API cost at scale | Medium | Metering, overage pricing, plan quotas |
| Competitor copies point features | Medium | Integrated moat (ID + adoption + protocols) harder to clone |
| Patent rejection | Low | Provisional + trade secrets; don’t depend on patent for moat |
| LLC/trademark delay | Medium | V0 needs no public marketing; pilot under NDA |

---

## 16. Founder decisions & next 90 days

### Decisions required

| # | Decision | Recommendation |
|---|----------|----------------|
| 1 | Price point | $249 standalone / $199 bundled (Founding pilot) |
| 2 | Launch before or after Track 2 | **Parallel** |
| 3 | Gait: build vs. partner | Build MVP in V2; partner if validation slow |
| 4 | Seizure timing | **Defer** to 2028+ |
| 5 | Validation budget Y1 | **$25k–40k** (L2 pilot, not L3) |
| 6 | Standalone SKU | **Yes** — same codebase, separate marketing site |
| 7 | Provisional patent | **File before national B2B PR** |

### Next 90 days (click-by-click)

| Week | Action |
|------|--------|
| 1 | Email 5 TN/CA small-animal DVMs — advisor + pilot interest |
| 2 | Advisor kickoff; begin RAG corpus (100 public docs) |
| 3–4 | Eye/skin/oral rubrics v1; 50-photo benchmark |
| 5–6 | `mode=vit_pro` API schema internal test |
| 7–8 | LLC/trademark clearance (if not done) |
| 9–12 | V1 portal MVP; first pilot clinic onboard |

### Advisor outreach email (draft)

**Subject:** Freedom Paws ViT Pro — 60-day CDS pilot (TN/CA practices)

> Dr. [Name],  
>  
> I'm building **ViT Pro**, a phone-based clinical decision support tool for small-animal practices — structured photo/video intake reports with literature citations, designed for pre-exam workflow (not autonomous diagnosis).  
>  
> We're recruiting 3 pilot clinics and 1 veterinary advisor for a 60-day study (~100 cases). Pilot is free; we'd value 30 minutes of your feedback on report usefulness.  
>  
> Freedom Paws is a mission-driven wellness platform (veteran + shelter give-back). Happy to share sample reports and our validation protocol.  
>  
> Would you have 30 minutes for a Zoom this month?  
>  
> [Founder name]

---

## 17. Document control

| Field | Value |
|-------|-------|
| **Repo path** | `freedompaws-app/docs/ops/ViT-PRO-BUSINESS-PLAN-AND-ROADMAP-June-2026.md` |
| **Documents path** | `~/Documents/Freedom Paws Wellness/ViT-Pro-Business-Plan-and-Roadmap-June-2026.md` |
| **Companion research** | `docs/ops/ViT-PRO-VET-MODULE-RESEARCH-REPORT-June-20-2026.md` |
| **IP guide** | `docs/Freedom-Paws-Patent-IP-Follow-Up-June-2026.md` |
| **Version** | 1.0 — June 20, 2026 |

---

*Freedom Paws Wellness — Honor Buddy's Legacy.*

*This document is strategic planning only. Licensed veterinarians remain responsible for diagnosis and treatment. Consult regulatory counsel before marketing ViT Pro nationally. Consult a patent attorney before filing. Financial projections are estimates, not guarantees.*
