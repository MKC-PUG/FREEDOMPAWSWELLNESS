# Appendix B — ViT Pro Advisor Sheet

**Freedom Paws Wellness · Confidential — advisor & counsel only · May 2026**  
**Binder:** Technical Master Binder · Referenced in General FAQ (one line only)

---

[PAGE BREAK]

# ViT Pro™ — Veterinary Advisor Briefing Sheet

## Purpose

Freedom Paws is validating **ViT Pro** — phone-based **clinical decision support (CDS)** for licensed veterinarians — over **3–4 months** before production launch. We seek **one lead veterinary advisor** (small-animal, TN or CA preferred) plus optional reviewers.

---

## What ViT Pro is

| | |
|---|---|
| **Input** | Photo or 10–15s video + history/signalment |
| **Output** | Structured CDS report: visual findings, **differential considerations**, suggested diagnostics, **literature citations**, EMR plain-text |
| **Regions (V0)** | Eye · skin · oral |
| **What it is NOT** | Autonomous diagnosis · replacement for physical exam |

---

## Dual-tier architecture

| Tier | Audience | Output |
|------|----------|--------|
| **Tier A (public)** | Pet owners | Wellness indications → holistic protocols (live today at `/diagnostics`) |
| **Tier B (ViT Pro)** | DVM / RVT practices | Full CDS report + citations + PDF *(V1)* |

**Owner → vet handoff:** Owner scan share link → vet opens Tier B report with same media.

---

## Advisor role

| Task | Time |
|------|------|
| Review region rubrics (eye, skin, oral) | 2–4 hrs/mo (V0) |
| Review 50-photo benchmark results | One session + async |
| Sign off report language & disclaimers | Once |
| Introduce 1–2 pilot clinics *(optional)* | V1 |
| Monthly call during pilot | 4–8 hrs/mo (V1) |

**Compensation:** $500–1,500/mo stipend or $5–12K Year 1 · equity optional for clinical lead.

---

## Validation — pass criteria

| Metric | Pass bar |
|--------|----------|
| Missed **critical** urgents | **Zero** |
| Agreement on differential *considerations* | **≥70%** |
| Citation presence on vet reports | **100%** |

### Benchmark workflow

1. Founder adds de-identified photos → `data/vit-pro/benchmark/cases.json`  
2. Batch run: `npm run vit-pro:benchmark`  
3. Advisor reviews JSON reports — agree / partial / disagree  
4. Rubrics & corpus updated for systematic misses  

---

## Portal access

| URL | Purpose |
|-----|---------|
| https://app.freedompawsinc.com/vit-pro | Overview |
| `/vit-pro/analyze` | Run CDS + toggle Tier A/B preview |
| `/vit-pro/benchmark` | Case tracker |
| `/vit-pro/corpus` | RAG sources & rubrics |

**Access:** Email added to `VIT_PRO_ADVISOR_EMAILS` → magic link login.

---

## Regulatory framing (target)

- **CDS for licensed professionals** — vet-only login, license verification *(V1)*  
- **Avoid SaMD** diagnosis claims until FDA strategy funded  
- **Language:** “Findings suggest consideration of…” not “Diagnosed with…”  

**Legal budget Y1:** $15–40K regulatory counsel.

---

## Timeline

| Phase | When | Deliverable |
|-------|------|-------------|
| **V0** | Now – 3 mo | RAG, rubrics, 50-photo benchmark, portal |
| **V1** | Post-LLC | PDF, billing, 3-clinic pilot |
| **Production** | After advisor sign-off | B2B sales at $199–299/mo/practice |

---

## Contact

**Founder:** info@freedompawsinc.com · **Grants / pilot MOU:** grants@freedompawsinc.com

**Sample advisor email subject:** *Freedom Paws ViT Pro — 60-day CDS pilot interest*

> *ViT Pro is clinical decision support only. The attending veterinarian is responsible for all clinical decisions.*

---

*Freedom Paws Wellness © 2026 · Technical Master Binder Appendix B*
