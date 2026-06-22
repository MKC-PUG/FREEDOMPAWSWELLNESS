# Freedom Paws — ViT Pro Veterinary Portal Training Manual

**Version:** 1.0  
**Date:** May 2026  
**Audience:** Veterinary advisors, clinical reviewers, and authorized vet staff  
**Portal URL:** https://app.freedompawsinc.com/vit-pro  

---

## Table of contents

1. [Welcome & what ViT Pro is](#1-welcome--what-vit-pro-is)
2. [Before you start — access requirements](#2-before-you-start--access-requirements)
3. [Signing in — click by click](#3-signing-in--click-by-click)
4. [ViT Pro dashboard overview](#4-vit-pro-dashboard-overview)
5. [Task: Run a clinical CDS analysis](#5-task-run-a-clinical-cds-analysis)
6. [Task: Choose body region & signalment](#6-task-choose-body-region--signalment)
7. [Task: Capture or upload media](#7-task-capture-or-upload-media)
8. [Task: Read Tier A vs Tier B output](#8-task-read-tier-a-vs-tier-b-output)
9. [Task: Run benchmark cases (advisors)](#9-task-run-benchmark-cases-advisors)
10. [Task: Browse clinical corpus](#10-task-browse-clinical-corpu)
11. [Clinical workflow & documentation standards](#11-clinical-workflow--documentation-standards)
12. [Privacy, liability & scope limits](#12-privacy-liability--scope-limits)
13. [Troubleshooting](#13-troubleshooting)
14. [Appendix A — URL quick reference](#appendix-a--url-quick-reference)
15. [Appendix B — Body regions & rubrics](#appendix-b--body-regions--rubrics)
16. [Appendix C — Output tier comparison](#appendix-c--output-tier-comparison)
17. [Appendix D — Glossary](#appendix-d--glossary)
18. [Appendix E — Advisor onboarding checklist](#appendix-e--advisor-onboarding-checklist)

---

## 1. Welcome & what ViT Pro is

**ViT Pro** (Veterinary Intelligence Technology — Professional) is Freedom Paws' **clinical decision support (CDS)** module for licensed veterinary professionals and designated advisors.

| Aspect | Description |
|--------|-------------|
| **Purpose** | Structured vision-AI analysis of eye, skin, and oral findings with rubric-scored output |
| **Not a substitute for** | Physical exam, diagnostics, or veterinary judgment |
| **Dual output** | **Tier A** (owner-safe summary) · **Tier B** (full clinical detail for vets) |
| **Evidence layer** | Keyword RAG retrieval from an curated clinical corpus (V0) |

This portal is separate from the **consumer ViT Diagnostics** module (`/diagnostics`) used by pet owners.

---

## 2. Before you start — access requirements

You need **one** of the following:

| Access method | How it is granted |
|---------------|-------------------|
| **Advisor email** | Your email added to `VIT_PRO_ADVISOR_EMAILS` by Freedom Paws |
| **Vet staff role** | `vet_staff` assigned in Supabase `user_profiles` |
| **FP ops** | Founder/ops accounts (`fp_ops`) — full access |

Additional requirements:

- [ ] `VIT_PRO_ENABLED=true` in production environment
- [ ] Valid Freedom Paws account (same login as member app)
- [ ] Device with camera **or** ability to upload clinical photos / short video

**If you see "Access restricted"** — contact Freedom Paws to add your email before retrying.

---

## 3. Signing in — click by click

### First-time sign-in

1. Open **https://app.freedompawsinc.com/vit-pro**
2. If not signed in, you are redirected to login with return path `/vit-pro`.
3. Enter your **authorized email address**.
4. Tap **Send magic link**.
5. Check email for magic link **or** 6-digit OTP code.
6. **Option A:** Tap magic link once (Safari recommended on iPhone).
7. **Option B:** Enter 6-digit code on login page → **Verify code**.
8. You land on the **ViT Pro** home dashboard with navigation: **Overview · Analyze · Benchmark · Corpus**.

### Bookmark for daily use

Save: **https://app.freedompawsinc.com/vit-pro/analyze**

---

## 4. ViT Pro dashboard overview

After sign-in, the **ViT Pro navbar** shows:

| Nav item | Path | Purpose |
|----------|------|---------|
| **Overview** | `/vit-pro` | Module status, version, access confirmation |
| **Analyze** | `/vit-pro/analyze` | Run CDS on photo or video |
| **Benchmark** | `/vit-pro/benchmark` | Advisor validation against case library |
| **Corpus** | `/vit-pro/corpus` | Browse indexed clinical reference material |

The overview page may show API status from `/api/vit-pro/status` (case counts, corpus manifest version).

---

## 5. Task: Run a clinical CDS analysis

**Purpose:** Submit clinical media and receive structured Tier A / Tier B reports.

**Primary URL:** https://app.freedompawsinc.com/vit-pro/analyze

### Click-by-click instructions

1. Sign in (Section 3).
2. Tap **Analyze** in the top navigation (or go to `/vit-pro/analyze`).
3. Complete **Section 6** (region + signalment) before uploading media.
4. Complete **Section 7** (media upload).
5. Tap **Run ViT Pro analysis** (or **Analyze**).
6. Wait for processing — typically **15–45 seconds** depending on media and load.
7. Results appear in two panels (Section 8):
   - **Tier A — Owner / client summary**
   - **Tier B — Clinical detail**
8. Review findings, rubric scores, and retrieved corpus citations.
9. Document your clinical decision in your PIMS — **do not rely on screen copy alone** for medical records without vet review.
10. *(Optional)* Screenshot or export per your clinic policy.

### Re-run with different region

1. Change **Body region** dropdown.
2. Upload new or same media if appropriate.
3. Tap **Analyze** again.

---

## 6. Task: Choose body region & signalment

Before analyzing, set clinical context:

### Body region (required)

| Region | Typical use |
|--------|-------------|
| **Eye** | Conjunctiva, cornea, discharge, erythema |
| **Skin** | Lesions, alopecia, masses, inflammation |
| **Oral** | Gingiva, teeth, mucosa |

**Click-by-click:**

1. On the Analyze page, find **Body region** dropdown.
2. Select **Eye**, **Skin**, or **Oral** matching your media.
3. Wrong region reduces rubric accuracy — always match media to region.

### Signalment notes (recommended)

Free-text field for species-relevant context:

- Species (canine/feline), breed, age, sex
- Duration of signs
- Prior treatments
- Relevant history (allergies, medications)

**Click-by-click:**

1. Tap **Signalment notes** text area.
2. Type concise clinical context (e.g. "7yo MN Golden Retriever, 2wk bilateral ocular discharge, no prior dx").
3. Notes are sent with the API request to improve CDS narrative quality.

---

## 7. Task: Capture or upload media

### Photo — click by click

1. On Analyze page, ensure **Photo** mode is selected (if toggle exists).
2. Tap **Choose photo** or **Use camera**.
3. Frame the affected area clearly:
   - **Eye:** close enough to see conjunctiva/cornea; both eyes if comparing
   - **Skin:** include lesion margins; coin/ruler for scale if possible
   - **Oral:** lift lip or open mouth; good lighting; avoid blur
4. Confirm preview thumbnail appears.
5. Proceed to **Run analysis**.

### Video — click by click

1. Select **Video** upload option if available.
2. Choose file: **MP4, MOV, or WebM**
3. Limits: **≤ 25 MB**, **≤ 8 seconds**
4. Stable clip showing the affected area (blink, lesion movement, etc.).
5. System extracts up to **5 frames** for analysis.
6. Confirm poster preview appears.
7. Proceed to **Run analysis**.

### Media quality checklist

- [ ] In focus, well lit
- [ ] Region fills most of frame
- [ ] No heavy filters or extreme color correction
- [ ] Single patient per submission

---

## 8. Task: Read Tier A vs Tier B output

After analysis completes, review both tiers:

### Tier A — Owner / client summary

**Audience:** Pet owners, front desk, client communications.

Typical contents:

- Plain-language summary of visible findings
- General urgency guidance (e.g. monitor vs seek care soon)
- **No** raw differential diagnosis list or internal rubric scores

**Use when:** Drafting client handouts, explaining why recheck is recommended.

### Tier B — Clinical detail

**Audience:** Licensed veterinarians and advisors.

Typical contents:

- Structured findings mapped to **clinical rubric** (eye / skin / oral JSON rubrics)
- Scored categories with severity hints
- **Retrieved corpus excerpts** — reference snippets from knowledge base
- Differential considerations (CDS support, not definitive dx)
- Suggested follow-up diagnostics (where rubric applies)

**Use when:** Clinical review, case discussion, benchmark scoring, advisor feedback to Freedom Paws.

### Side-by-side review workflow

1. Read **Tier B** first for clinical accuracy.
2. Compare rubric scores to your visual assessment of the media.
3. Read **Tier A** — verify it is appropriately conservative for client use.
4. If Tier A is too alarming or too dismissive, note for advisor feedback (Appendix E).

---

## 9. Task: Run benchmark cases (advisors)

**Purpose:** Validate ViT Pro against a fixed library of ~50 annotated cases for accuracy studies and V1 readiness.

**URL:** https://app.freedompawsinc.com/vit-pro/benchmark

### Click-by-click — portal review

1. Navigate to **Benchmark** in ViT Pro nav.
2. Page lists benchmark case summaries (region, expected findings category).
3. Select a case to view expected vs system output *(UI may show case ID and status)*.
4. Record discrepancies per advisor protocol.

### Click-by-click — CLI batch run (technical advisors)

Freedom Paws ops may run locally:

```bash
cd freedompaws-app
npm run vit-pro:benchmark
```

Results save to `data/vit-pro/benchmark/results/` as CSV + JSON.

### Scoring guidance

| Result | Action |
|--------|--------|
| Rubric aligns with expert label | Mark pass |
| Minor wording difference | Note; may still pass |
| Wrong region or missed critical finding | Mark fail + case ID |
| Unsafe Tier A language | Flag critical — email Freedom Paws immediately |

See repo doc: `docs/ops/ViT-PRO-V0-BENCHMARK-GUIDE.md`

---

## 10. Task: Browse clinical corpus

**Purpose:** Inspect reference material indexed for RAG retrieval (V0 keyword matching).

**URL:** https://app.freedompawsinc.com/vit-pro/corpus

### Click-by-click instructions

1. Tap **Corpus** in navigation.
2. Browse manifest entries — titles, regions, source tags.
3. Select an entry to read excerpt *(if detail view enabled)*.
4. Cross-reference with citations shown in Tier B output after an analysis.
5. Report outdated or incorrect references to Freedom Paws for corpus update.

**Note:** V1 may upgrade to vector RAG; V0 uses keyword retrieval from `corpus/manifest.json`.

---

## 11. Clinical workflow & documentation standards

### Recommended clinic workflow

```
Client presents with concern
        ↓
Vet captures standardized photo/video
        ↓
ViT Pro Analyze (correct region + signalment)
        ↓
Vet reviews Tier B → forms dx plan
        ↓
Tier A adapted for client communication (optional)
        ↓
Record in PIMS: "CDS adjunct used; vet confirmed findings"
```

### Documentation standards

- Always record **date, vet name, region analyzed, and media type**
- State that output is **CDS adjunct**, not standalone diagnosis
- Retain original media in PIMS per clinic policy
- Do not enter client PHI into signalment notes beyond what is necessary

---

## 12. Privacy, liability & scope limits

| Rule | Detail |
|------|--------|
| **Licensed use** | Tier B intended for veterinary professionals |
| **No emergency triage** | Critical cases require immediate standard of care |
| **Data handling** | Media sent to OpenAI API per Freedom Paws privacy policy |
| **Advisory role** | Advisors provide feedback; Freedom Paws owns product decisions |
| **Kill switch** | Module can be disabled via `VIT_PRO_ENABLED=false` |

ViT Pro **does not** replace:

- Physical examination
- Cytology, culture, imaging, or lab work
- Regulatory reporting obligations

---

## 13. Troubleshooting

| Problem | What to do |
|---------|------------|
| Access restricted | Confirm email in `VIT_PRO_ADVISOR_EMAILS`; re-login |
| Analyze button disabled | Select region + upload media first |
| Analysis timeout | Retry; check network; shorten video |
| Empty Tier B | Report to Freedom Paws with case ID/time |
| Wrong rubric applied | Verify body region matches media |
| Video rejected | ≤8 sec, ≤25 MB, MP4/MOV/WebM |
| Benchmark case missing | Confirm `data/vit-pro/benchmark/cases.json` deployed |

---

## Appendix A — URL quick reference

| Page | URL |
|------|-----|
| ViT Pro home | https://app.freedompawsinc.com/vit-pro |
| Analyze | https://app.freedompawsinc.com/vit-pro/analyze |
| Benchmark | https://app.freedompawsinc.com/vit-pro/benchmark |
| Corpus | https://app.freedompawsinc.com/vit-pro/corpus |
| Login | https://app.freedompawsinc.com/login?next=/vit-pro |
| Status API | https://app.freedompawsinc.com/api/vit-pro/status |
| Consumer ViT (not Pro) | https://app.freedompawsinc.com/diagnostics |

---

## Appendix B — Body regions & rubrics

| Region | Rubric file | Example findings |
|--------|-------------|------------------|
| Eye | `lib/vit-pro/rubrics/eye.json` | Discharge, erythema, corneal opacity |
| Skin | `lib/vit-pro/rubrics/skin.json` | Erythema, alopecia, papules, masses |
| Oral | `lib/vit-pro/rubrics/oral.json` | Gingivitis, calculus, ulceration |

Each rubric defines scored categories used in Tier B output.

---

## Appendix C — Output tier comparison

| Feature | Tier A (Public) | Tier B (Vet) |
|---------|:---------------:|:------------:|
| Plain summary | ✅ | ✅ |
| Rubric scores | ❌ | ✅ |
| Corpus citations | Limited | ✅ Full |
| Differential list | ❌ | ✅ |
| Diagnostic suggestions | General | Detailed |
| Safe for client email | ✅ | ❌ |

API parameter: `outputTier=both` (default for authorized users).

---

## Appendix D — Glossary

| Term | Definition |
|------|------------|
| **CDS** | Clinical Decision Support |
| **ViT** | Vision Intelligence Technology |
| **RAG** | Retrieval-Augmented Generation — corpus lookup + LLM |
| **Rubric** | Structured scoring template per body region |
| **Signalment** | Species, age, sex, breed, history |
| **Tier A** | Owner-safe output layer |
| **Tier B** | Full veterinary output layer |
| **Benchmark** | Fixed case library for accuracy validation |

---

## Appendix E — Advisor onboarding checklist

Freedom Paws completes:

- [ ] Add advisor email to `VIT_PRO_ADVISOR_EMAILS` in Vercel
- [ ] Confirm `VIT_PRO_ENABLED=true`
- [ ] Send this manual + NDA/advisor agreement (if applicable)
- [ ] Schedule 30-min walkthrough on `/vit-pro/analyze`

Advisor completes:

- [ ] Successful login to `/vit-pro`
- [ ] Run 3 test analyses (eye, skin, oral)
- [ ] Review Tier A vs Tier B on each
- [ ] Score 5 benchmark cases
- [ ] Submit feedback template to Freedom Paws
- [ ] Confirm understanding of scope limits (Section 12)

**Feedback contact:** Freedom Paws founder (see advisor welcome email)

---

*Freedom Paws Wellness © 2026 · ViT Pro veterinary training manual · V0 · Honor Buddy's Legacy*
