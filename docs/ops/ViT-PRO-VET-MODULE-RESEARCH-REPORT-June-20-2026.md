# Freedom Paws ViT Pro — Scientific Vet Module Research Report

**Document date:** June 20, 2026  
**Prepared for:** Founder — product strategy, build cost, financial upside  
**Status:** Research & feasibility — not medical or legal advice  

**Save copy to:** `~/Documents/Freedom Paws Wellness/ViT-Pro-Vet-Module-Research-Report-June-20-2026.md`

---

## Executive summary

| Question | Finding |
|----------|---------|
| **Can we use scientific sources in ViT?** | **Yes** — via RAG (retrieval-augmented generation) over curated veterinary literature + structured scoring rubrics. Must separate **citations for vets** from **plain-language indications for public**. |
| **Does this product exist today as one integrated tool?** | **No.** Consumer apps (Yipara, VetPati, Pet Snap) do photo triage. Lab AI (Zoetis Imagyst) is B2B but not phone-first. **None** combine: holistic protocols + biometric ID + adoption network + multi-region photo/video + vet-grade export in one PWA. |
| **Can we build a vet module with reports?** | **Yes, as clinical decision support (CDS)** — not autonomous diagnosis without validation and regulatory strategy. |
| **Biggest technical gap today** | Dedicated **video gait/orthopedic** and **seizure video** pipelines — current app uses generic vision on sampled frames. |
| **Recommended model** | **Dual tier:** Public = wellness indications (current). Vet Pro = structured report + literature citations + PDF + practice account. |

---

## Table of contents

1. [What Freedom Paws has today](#1-what-freedom-paws-has-today)
2. [Competitive landscape — what exists vs gap](#2-competitive-landscape)
3. [Scientific evidence by body system](#3-scientific-evidence-by-body-system)
4. [Proposed product: ViT Pro dual tier](#4-proposed-product-vit-pro-dual-tier)
5. [Architecture with scientific sources (RAG)](#5-architecture-with-scientific-sources-rag)
6. [Regulatory & liability framing](#6-regulatory--liability-framing)
7. [Build cost estimate](#7-build-cost-estimate)
8. [Operating cost (API & infra)](#8-operating-cost-api--infra)
9. [Financial scenarios (Year 1–3)](#9-financial-scenarios-year-1–3)
10. [Phased roadmap](#10-phased-roadmap)
11. [Why this could win if executed well](#11-why-this-could-win)
12. [Risks & mitigations](#12-risks--mitigations)
13. [Founder decisions required](#13-founder-decisions-required)
14. [Next steps (click by click)](#14-next-steps-click-by-click)

---

## 1. What Freedom Paws has today

### Live pipeline (repo)

| Layer | File(s) | Capability |
|-------|---------|------------|
| Member UI | `app/diagnostics/ViTDiagnosticsClient.tsx` | Photo + 10–15s video upload |
| Video | `lib/vit/extract-video-frames.ts` | 3–5 frames → same vision API |
| API | `app/api/analyze/route.ts` | `mode=wellness` \| `identity` \| `both` |
| Vision | `lib/ai/vision-analyze.ts` | OpenAI GPT-4o-mini structured JSON |
| Lexicon | `lib/ai/symptom-lexicon.ts` | ~200 phrases → 10 protocols |
| Fusion | `lib/ai/diagnostics.ts` | Text + vision → top-2 supplements |
| Urgency | `lib/ai/urgent-assessment.ts` | Severe DB + ≥80% congruency → vet urgent |
| Identity | `lib/ai/identity-analyze.ts` | Eyes, face, body, posture, gait descriptors |
| Prompts | `lib/ai/prompt-templates.ts` | Dr. Atlas — **wellness educator**, not diagnostician |

### Region coverage in prompts (wellness mode)

| Region | Current | Limitation |
|--------|---------|------------|
| **Eyes** | Cloudiness, discharge, squint → Clear Vision | Single general vision pass; no ophthalmology scoring scale |
| **Skin** | Hot spots, rash, coat → Allergy Shield | No lesion taxonomy (e.g. pyoderma vs demodicosis) |
| **Mouth/dental** | Tartar, red gums → Fresh Smile Dental | No standardized dental index (0–4 tartar grade) |
| **Gait/hip/spine (video)** | Multi-frame prompt mentions gait | **No dedicated lameness kinematics model** |
| **Seizures** | Not implemented | **No video event classifier** |

### Legal posture today

> *Educational tool only. Not a diagnosis or substitute for licensed veterinary care.*

Confidence capped ≤92%. `vetUrgent` gated server-side. **Correct for public tier.**

---

## 2. Competitive landscape

### Consumer photo AI (B2C) — partial overlap

| Product | Regions | Output | Vet report | Integrated with protocols/ID |
|---------|---------|--------|------------|----------------------------|
| **Yipara** | Eye, skin, ear | Pattern triage + cost estimate | No | No |
| **VetPati** | Eye, ear, skin, teeth | Severity + “go now / 48h” | PDF export (consumer) | No |
| **Pet Snap Health** | Skin, dental | Progress tracking, vet-ready summary | Photo timeline | No |
| **Freedom Paws (today)** | General + protocols | Top-2 holistic supplements + urgency | No clinical PDF | **Yes** — ID, adoption, protocols |

### Veterinary B2B AI — different channel

| Product | Model | Phone? | Notes |
|---------|-------|--------|-------|
| **Zoetis Vetscan Imagyst** | In-clinic cytology/hematology AI | No — microscope slide | True lab diagnostic assist |
| **SignalPET / others (radiology AI)** | X-ray AI | No | Not consumer phone |
| **Gait analysis labs** | Force plates, specialized video | Sometimes | Expensive hardware |

### The gap Freedom Paws can own

**One phone PWA that connects:**

1. **Owner wellness indications** (public)  
2. **Vet-grade structured report** (B2B) with literature-backed reasoning  
3. **Video gait / mobility screening**  
4. **Biometric Freedom Paws ID** (reunion)  
5. **Shelter adoption + found-dog intake**  
6. **Holistic protocol + supplement funnel** (unique positioning)

**No competitor found (Jun 2026) spans all six in a single mission-aligned platform.**

---

## 3. Scientific evidence by body system

*Summary for feasibility — not a systematic review. Vet Pro tier should cite primary sources in RAG corpus.*

### 3.1 Eyes (ophthalmology)

| Evidence type | Status | Notes |
|---------------|--------|-------|
| Photo-based conjunctivitis/corneal opacity in dogs | **Research-stage** | CV papers on animal eye images exist; few FDA-cleared phone products |
| Clinical validation | Low for consumer apps | Vet exam + fluorescein stain remains gold standard |
| **Feasibility for Freedom Paws** | **High for indications** (“signs consistent with…”) | **Medium for vet CDS** with rubric + citations |

**RAG corpus examples:** ACVO consensus, peer-reviewed canine ophthalmology atlases, Merck Vet Manual eye chapter.

**ViT Pro enhancement:** Dedicated eye capture guide (no flash glare), side-by-side comparison over time, structured fields: discharge type, corneal clarity, blepharospasm.

---

### 3.2 Skin & coat (dermatology)

| Evidence type | Status | Notes |
|---------------|--------|-------|
| AI dermatology pattern matching | **Commercial (consumer)** | Yipara, Pet Snap — educational triage |
| Deep learning on canine skin lesions | **Research** | Dataset bias limits generalization |
| Cytology/histology AI | **B2B lab** (Imagyst) | Not replaceable by phone photo alone |

**Feasibility:** **High for triage + protocol mapping.** **Medium** for lesion-specific diagnosis (allergy vs mange vs ringworm) without dermoscopy/cytology.

**ViT Pro enhancement:** Body location map, lesion margin scoring, pruritus scale from owner text, **differential list** (not single diagnosis) with confidence bands.

**Scientific anchors:** AAHA skin guidelines, Muller & Kirk’s Small Animal Dermatology excerpts (licensed), peer-reviewed atlases.

---

### 3.3 Mouth & dental (oral)

| Evidence type | Status | Notes |
|---------------|--------|-------|
| Photo-based tartar/gingivitis scoring | **Emerging** | Research on dental indices from oral photos in dogs |
| In-clinic dental | Gold standard | Anesthesia + probe |

**Feasibility:** **High for wellness dental indication** (Fresh Smile protocol). **Medium for vet CDS** with standardized photo angles (lip lift, front/d lateral).

**ViT Pro enhancement:** Tartar grade 0–3 estimate, gum color index, halitosis from owner report, **when to schedule dental** recommendation.

---

### 3.4 Video — gait, hip, spine, orthopedic

| Evidence type | Status | Notes |
|---------------|--------|-------|
| Lameness detection from smartphone video | **Active research** | Pose estimation (DeepLabCut, OpenPose variants) on dogs |
| Hip dysplasia screening | **Clinical** | OFA/PennHIP radiographs — video cannot replace X-ray |
| Spine/neurologic gait | **Specialist exam** | Ataxia vs orthopedic lameness needs neuro exam |

**Feasibility:** **High for screening** (“ asymmetric weight bearing, shortened stride”). **Low for definitive hip/spine diagnosis** from phone video alone.

**Current Freedom Paws gap:** Phase 2b extracts frames but uses **same general LLM vision** — not kinematic analysis.

**ViT Pro build:** Dedicated gait module:
- 5–10s walk toward/away camera, flat surface  
- Pose keypoints → stride symmetry score  
- Output: **mobility concern level** + Max Movement / Infrared Spine protocol + **vet referral for rads**

**Scientific anchors:** Veterinary Comparative Orthopedics literature, peer-reviewed lameness CV papers (2020–2025).

---

### 3.5 Video — seizures & neurological events

| Evidence type | Status | Notes |
|---------------|--------|-------|
| Video-based seizure detection (dogs) | **Early research** | Most clinical work uses EEG + accelerometer collars |
| Consumer “seizure detect” apps | **Human-focused** | Rare validated canine phone products |

**Feasibility:** **Medium-low for MVP.** High medico-legal risk if false negatives occur.

**Recommended approach:**
- **Phase 1:** Owner symptom lexicon + “record event video” upload → vision flags **possible paroxysmal event** → urgent vet banner (not “seizure diagnosed”).  
- **Phase 2:** Validated classifier with vet-labeled dataset (partner university).

**Do not launch public “seizure diagnosis” without veterinary clinical advisory board + validation study.**

---

## 4. Proposed product: ViT Pro dual tier

### Tier A — Public (Freedom Paws Wellness) — *keep current framing*

| Element | Description |
|---------|-------------|
| **Audience** | Pet owners |
| **Output** | Wellness **indications**, top-2 **holistic protocols**, urgency banner |
| **Language** | “Signs consistent with…”, “Consider Clear Vision protocol” |
| **Science** | Light “Learn more” links — no dense differential |
| **Price** | Free / member / metered credits (existing strategy) |

### Tier B — ViT Pro Vet (new)

| Element | Description |
|---------|-------------|
| **Audience** | Licensed veterinarians & RVTs (practice account) |
| **Output** | **Structured clinical-style report** (PDF + EMR paste) |
| **Sections** | Signalment, history, visual findings, **differential considerations**, recommended diagnostics, citations |
| **Regions** | Eye, skin, oral, gait video, optional neuro video |
| **Language** | Decision support — “Findings suggest consideration of…” |
| **Price** | **$199–299/mo per practice** (5 seats) + per-scan overage optional |

### Data flow between tiers

```
Owner scan (Tier A) ──share link──► Vet opens Tier B report with raw media + timeline
Vet scan in clinic (Tier B) ──► Client summary (Tier A language) optional handout
```

---

## 5. Architecture with scientific sources (RAG)

### Why RAG (not fine-tune first)

| Approach | Pros | Cons |
|----------|------|------|
| **RAG over curated vet corpus** | Citable, updatable, lower regulatory surface | Needs corpus curation |
| **Fine-tuned ViT** | Potentially higher accuracy | Expensive labels, validation burden |
| **LLM only (today)** | Fast to ship | Hallucination risk, no citations |

### Proposed corpus (licensed / public)

| Bucket | Examples | Use |
|--------|----------|-----|
| **Guidelines** | AAHA, ACVIM client guides | Triage thresholds |
| **Textbooks (licensed)** | Merck Vet Manual, selected chapters | Differential lists |
| **Peer-reviewed** | PubMed open-access + purchased PDFs | Gait, derm, eye papers |
| **Internal** | Freedom Paws symptom lexicon + severe DB | Protocol fusion |

### Pipeline (ViT Pro)

```
Photo/video upload
    → Region detector + quality gate (existing)
    → Region-specific vision model pass (enhanced prompts or small specialist models)
    → RAG retrieve top-k literature chunks
    → Structured report generator (JSON schema)
    → Tier A summary OR Tier B full report
    → Audit log + version ID (for vet medico-legal)
```

### Citation format (vet report example)

> **Finding:** Bilateral epiphora, mucoid discharge (photo 1).  
> **Considerations:** Keratoconjunctivitis sicca, conjunctivitis, corneal ulcer (cannot rule out without fluorescein exam).  
> **Suggested diagnostics:** Schirmer tear test, fluorescein stain, intraocular pressure if indicated.  
> **References:** [1] ACVO Basic Diagnostics Guide; [2] Merck Vet Manual — Conjunctivitis (Canine).

---

## 6. Regulatory & liability framing

| Tier | US framing (typical) | Requirements |
|------|----------------------|--------------|
| **Tier A Public** | General wellness / education | Strong disclaimers (have today) |
| **Tier B Vet CDS** | Clinical decision support for licensed professionals | Vet-only login, “for professional use”, validation docs, PLI |
| **Tier B as SaMD** | If claims “diagnoses disease” | FDA pathway — **avoid until funded** |

**Recommendation:** Launch Vet Pro as **CDS for licensed vets** with:
- Professional verification (license #, state)  
- BAA if storing client data  
- Veterinary advisory board (2–3 DVMs)  
- Pilot validation study (100+ cases, vet-labeled outcomes)

**Budget legal/regulatory (Year 1):** **$15,000–$40,000** (vet regulatory counsel + terms).

---

## 7. Build cost estimate

### Engineering (self-build vs contract @ $150/hr)

| Workstream | Hours | Contract $ | Priority |
|------------|-------|------------|----------|
| Scientific corpus + RAG infra | 80–120 | $12k–18k | P0 |
| Region modules: eye, skin, oral (enhanced schemas + rubrics) | 100–140 | $15k–21k | P0 |
| Video gait kinematics MVP (pose + symmetry score) | 120–200 | $18k–30k | P1 |
| Seizure/event video screening (conservative) | 80–120 | $12k–18k | P2 |
| Vet Pro portal (`/vet/vit` or `/partner/vit-pro`) | 120–160 | $18k–24k | P0 |
| PDF report generator + EMR export | 40–60 | $6k–9k | P0 |
| Practice billing (Stripe) + seat management | 40–60 | $6k–9k | P1 |
| Validation tooling + case review UI | 60–80 | $9k–12k | P1 |
| Security audit + HIPAA-adjacent hardening | 40–60 | $6k–9k | P1 |
| **Total** | **680–1,000 hrs** | **$102k–$150k** | |

**Self-build (founder + Cursor):** Cash **$15k–40k** (legal, validation, corpus licenses, GPU if needed).

### Non-engineering (Year 1)

| Item | Cost |
|------|------|
| Veterinary advisory board (stipends) | $5k–15k |
| Pilot validation study (3 clinics, 100 cases) | $25k–75k |
| Corpus licensing (Merck, textbooks) | $2k–10k |
| Insurance (E&O / cyber) uplift | $3k–8k |
| **Total non-eng** | **$35k–108k** |

### **All-in Year 1 (ViT Pro to pilot):** **$50k–$190k** depending on validation depth and contract vs self-build.

---

## 8. Operating cost (API & infra)

### Per scan (estimated)

| Tier | Components | Cost/scan |
|------|------------|-----------|
| **Tier A (today)** | 1–3 images, gpt-4o-mini | **$0.02–0.05** |
| **Tier A + video** | 5 frames + mini | **$0.05–0.10** |
| **Tier B Vet Pro** | Multi-pass vision + RAG + PDF | **$0.10–0.25** |
| **Tier B + gait kinematics** | Pose model + LLM summary | **$0.15–0.35** |

### Monthly infra at scale

| Volume | Tier A only | + Vet Pro mix (20% vet scans) |
|--------|-------------|-------------------------------|
| 1,000 scans/mo | ~$50–100 API | ~$150–250 |
| 10,000 scans/mo | ~$500–1,000 | ~$1,500–3,000 |
| 100,000 scans/mo | ~$5k–10k | ~$15k–30k |

*Existing Vercel + Supabase stack scales; largest variable is OpenAI/research GPU.*

---

## 9. Financial scenarios (Year 1–3)

### Pricing assumptions (Vet Pro)

| Plan | Price | Includes |
|------|-------|----------|
| **Practice Starter** | $199/mo | 5 seats, 200 Pro scans/mo |
| **Practice Pro** | $299/mo | 10 seats, 500 scans/mo |
| **Overage** | $0.75/scan | Above quota |

Public tier drives funnel; vet tier drives margin.

### Scenario A — Conservative

| Year | Vet practices | MRR (vet only) | Public members | Protocol/affiliate (est.) | **Total revenue** |
|------|---------------|----------------|--------------|---------------------------|-------------------|
| Y1 | 30 | $6k | 500 | $20k | **~$92k** |
| Y2 | 120 | $24k | 2,500 | $120k | **~$408k** |
| Y3 | 300 | $60k | 8,000 | $400k | **~$1.12M** |

### Scenario B — Breakout (product “great”)

| Year | Vet practices | MRR (vet only) | Public members | Ecosystem revenue | **Total revenue** |
|------|---------------|----------------|----------------|-------------------|-------------------|
| Y1 | 75 | $15k | 2,000 | $60k | **~$240k** |
| Y2 | 400 | $80k | 10,000 | $350k | **~$1.31M** |
| Y3 | 1,000 | $200k | 35,000 | $1.2M | **~$3.6M** |

### Strategic value beyond subscription

| Lever | Value |
|-------|-------|
| **Vet channel validates owner app** | Trust + retention |
| **Protocol cross-sell** | Vet recommends → owner buys Token Shop |
| **Freedom Paws ID** | Vet clinic enroll at visit |
| **Shelter/adoption network** | Unique data flywheel |
| **Acquisition / partnership** | Strategic value to Zoetis-class players (long-term) |

**Gross margin on Vet Pro:** 70–85% after API (subscription-heavy).

---

## 10. Phased roadmap

### Phase V0 — Scientific foundation (4–6 weeks, no new UI)

- [ ] Curate RAG corpus (100–200 documents) with vet advisor  
- [ ] Region-specific rubrics (eye, skin, oral) as JSON schemas  
- [ ] Internal benchmark: 50 labeled photos vs vet gold standard  

### Phase V1 — Vet Pro MVP (8–12 weeks)

- [ ] `/vet/vit-pro` practice login (extend partner/ops auth)  
- [ ] Enhanced analyze API `mode=vit_pro`  
- [ ] PDF report + citation block  
- [ ] Pilot 3 TN/CA clinics  

### Phase V2 — Video gait module (6–10 weeks)

- [ ] Pose estimation pipeline  
- [ ] Symmetry / stride report  
- [ ] Integrate Max Movement + Infrared Spine protocols  

### Phase V3 — Public Tier A upgrade (parallel)

- [ ] Indication summaries powered by same engine, simplified output  
- [ ] “Share with your vet” link → Pro report unlock  

### Phase V4 — Seizure screening (only after V1 validation)

- [ ] Event video upload + conservative urgent flag  
- [ ] Clinical validation study  

---

## 11. Why this could win if executed well

1. **Holistic + clinical bridge** — only platform tying **wellness protocols** to **vet-grade export**  
2. **Full stack moat** — ViT → ID → adoption → supplements in one PWA  
3. **Mission trust** — veterans, shelters, give-back — vets prefer mission-aligned partners  
4. **Phone-first** — no new hardware for basic tiers (vs lab AI)  
5. **Scientific citations** — vet Pro reports become **defensible** in court of peer opinion  
6. **Data flywheel** — more scans → better rubrics → better reports (with consent)  

---

## 12. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Hallucinated diagnosis | RAG citations required; vet-only strong claims; confidence bands |
| FDA SaMD classification | CDS framing; professional-only tier; legal review |
| False negative on seizure/urgent | Conservative urgent banners; never “ruled out” language |
| Competitor copies | ID + adoption + protocol ecosystem harder to replicate |
| API cost at scale | Metering, vet overage pricing, member credits |
| Vet adoption friction | EMR paste, 2-min workflow, free pilot month |

---

## 13. Founder decisions required

| # | Decision | Options |
|---|----------|---------|
| 1 | Vet Pro price point | $199 vs $299/mo |
| 2 | Launch vet tier before or after Track 2 chip | Recommend **parallel** — different buyer |
| 3 | Gait module: build vs partner | Build MVP; partner if validation slow |
| 4 | Seizure module timing | **Defer** until advisory board + study |
| 5 | Validation budget Y1 | $25k minimal vs $75k rigorous |

---

## 14. Next steps (click by click)

### This week

1. Recruit **1 veterinary advisor** (TN or CA, small animal) — 30-min Zoom  
2. Email draft: “Freedom Paws ViT Pro — CDS pilot interest”  
3. Run **50-photo internal benchmark** — Buddy + stock test images vs advisor review  

### When ready to build

1. Open Cursor → new chat  
2. Paste: *“Build ViT Pro Phase V1 per docs/ops/ViT-PRO-VET-MODULE-RESEARCH-REPORT-June-20-2026.md”*  
3. Start with RAG corpus + `mode=vit_pro` API schema  

### Save this report to Documents

```bash
cp "/Users/valuedcustomer/freedompaws-app/docs/ops/ViT-PRO-VET-MODULE-RESEARCH-REPORT-June-20-2026.md" \
   "/Users/valuedcustomer/Documents/Freedom Paws Wellness/ViT-Pro-Vet-Module-Research-Report-June-20-2026.md"
```

---

## Document control

| Field | Value |
|-------|-------|
| Repo path | `freedompaws-app/docs/ops/ViT-PRO-VET-MODULE-RESEARCH-REPORT-June-20-2026.md` |
| Documents path | `~/Documents/Freedom Paws Wellness/ViT-Pro-Vet-Module-Research-Report-June-20-2026.md` |
| Related | `docs/ViT-Diagnostics-Vision-and-Roadmap.md` |

---

*Freedom Paws Wellness — Honor Buddy's Legacy. This document is product research, not veterinary medical advice. Licensed veterinarians remain responsible for diagnosis and treatment. Consult regulatory counsel before marketing Vet Pro tier nationally.*
