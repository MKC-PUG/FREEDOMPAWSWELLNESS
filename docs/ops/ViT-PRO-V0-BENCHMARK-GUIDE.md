# ViT Pro Phase V0 — Internal 50-Photo Benchmark Guide

**Status:** Phase V0 — no vet portal; API + advisor review only  
**Exit gate:** Advisor sign-off before V1 UI ships

---

## Purpose

Validate ViT Pro CDS output against a veterinary advisor’s gold standard **before** building `/vet/vit-pro`.

| Metric | Pass bar |
|--------|----------|
| Missed **critical** urgents | **Zero** |
| Advisor agreement on differential *considerations* | **≥70%** |
| Citation presence on vet reports | **100%** |

---

## Setup

1. **Recruit lead advisor** — TN or CA small-animal DVM (30-min kickoff).
2. Copy benchmark template:
   ```bash
   cp data/vit-pro/benchmark/cases.template.json data/vit-pro/benchmark/cases.json
   mkdir -p data/vit-pro/benchmark/images
   ```
3. Add up to **50 cases** — mix of:
   - Buddy / founder test photos (with consent)
   - De-identified stock canine clinical education images
   - Advisor-contributed anonymized cases (with permission)

4. Ensure `OPENAI_API_KEY` is set in root `.env.local`.

---

## Case JSON format

```json
{
  "id": "bench-004",
  "region": "eye",
  "imagePath": "data/vit-pro/benchmark/images/bench-004.jpg",
  "symptoms": "Owner-reported history matching photo",
  "signalmentNotes": "Breed, age optional",
  "advisorReview": {
    "urgentExpected": false,
    "topDifferentials": ["A", "B", "C"],
    "notes": "Filled by advisor after review"
  }
}
```

---

## Run benchmark

```bash
npm run vit-pro:benchmark
```

Outputs:
- `data/vit-pro/benchmark/results/benchmark-<timestamp>.csv` — summary row per case
- `data/vit-pro/benchmark/results/benchmark-<timestamp>.json` — full vet + public dual output per case

---

## Advisor review workflow

1. Send advisor the JSON file (or PDF exports from V1 later).
2. For each case, advisor marks:
   - **Agree / partial / disagree** on differential list
   - **Urgent call correct?** yes/no
   - **Would use in practice?** 1–5
3. Record agreement % in spreadsheet.
4. Founder fixes rubrics / corpus / prompts for systematic misses.

---

## API test (single case)

```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "mode=vit_pro" \
  -F "symptoms=Red eye with discharge, squinting" \
  -F "vitRegion=eye" \
  -F "outputTier=both" \
  -F "image=@/path/to/photo.jpg"
```

Response includes:
- `vitPro` — Tier B full CDS + citations + `emrPlainText`
- `vitProPublic` — Tier A simplified (when `outputTier=both`)

---

## Portal (live)

| URL | Purpose |
|-----|---------|
| `/vit-pro` | Overview, KPIs, timeline |
| `/vit-pro/analyze` | CDS upload + Tier A/B dual output |
| `/vit-pro/benchmark` | 50-case setup & batch run |
| `/vit-pro/corpus` | RAG chunks + rubrics |

**Access:** `fp_ops`, `vet_staff`, or email in `VIT_PRO_ADVISOR_EMAILS` (comma-separated in Vercel / `.env.local`).

---

| Path | Purpose |
|------|---------|
| `lib/vit-pro/types.ts` | Dual-output schemas |
| `lib/vit-pro/rubrics/*.json` | Eye, skin, oral rubrics |
| `lib/vit-pro/corpus/manifest.json` | Open-source RAG corpus |
| `lib/vit-pro/rag/retrieve.ts` | Keyword RAG (V0) |
| `lib/vit-pro/vit-pro-analyze.ts` | Main pipeline |
| `lib/vit-pro/dual-output.ts` | Public vs vet mappers |
| `app/api/analyze/route.ts` | `mode=vit_pro` |

---

## Next step after pass

Phase V1: `/vet/vit-pro` portal, PDF export, 3-clinic pilot — see `docs/ops/ViT-PRO-BUSINESS-PLAN-AND-ROADMAP-June-2026.md`.
