# Freedom Paws Wellness — ViT Diagnostics Vision & Roadmap

**Version 1.1 | May 31, 2026**  
**Status:** Phase 0 + Phase 2a (photo vision) **in progress** — lexicon + top-2 supplements live; OpenAI vision when `OPENAI_API_KEY` set

---

## 1. Executive summary

Freedom Paws ViT Diagnostics lets pet owners upload **photos** (video in Phase 2b) and describe **symptoms** via the mobile PWA. The system analyzes visual + text signals, maps them to our **10 tokenized holistic wellness protocols**, returns **confidence scores**, **prioritised top-2 supplement recommendations**, educational insights, and **veterinary disclaimers**.

**Goal:** Trustworthy, premium first impression — real member value with safe, educational framing.

---

## 2. Locked product decisions (May 2026)

| Decision | Choice |
|----------|--------|
| **Naming in results** | **Both** — spec category + branded supplement name |
| **Spec gaps (Cognitive, Baseline, etc.)** | **Combine** into existing branded protocols |
| **Overlap / dual supplements** | Always recommend **prioritised top 2** when overlap applies |
| **Example: Cognitive & Senior** | **#1 Immune Vitality** (Patriot Defender) · **#2 Freedom Calm** |
| **Vision provider** | **OpenAI GPT-4o-mini** (vision) — fused with symptom lexicon |
| **Video** | **Phase 2b** — after photo path is stable |

---

## 3. The 10 spec categories → branded protocols

| # | Spec category | Branded protocol | Slug |
|---|---------------|------------------|------|
| 1 | Immune Vitality Protocol | Patriot Defender – Immunity & Vitality | `patriot-immune` |
| 2 | Joint & Mobility Protocol | Max Movement Pro – Joint Support | `max-movement` |
| 3 | Skin & Coat Restoration* | Allergy Shield – Skin & Coat Glow | `allergy-shield` |
| 4 | Digestive Harmony Protocol | Buddy's Gut Balance & Cleanse | `gut-balance` |
| 5 | Heart & Vital Organs Protocol | Heart Strong Cardio-Support | `heart-strong` |
| 6 | Cognitive & Senior Support* | Patriot Defender (#1) + Freedom Calm (#2) | overlap pair |
| 7 | Eye & Vision Health Protocol | Clear Vision Defender | `clear-vision` |
| 8 | Allergy & Respiratory Relief* | Allergy Shield | `allergy-shield` |
| 9 | Musculoskeletal Recovery* | Max Movement (+ Red Light Spine for spine) | `max-movement` / `infrared-spine` |
| 10 | Holistic Wellness Baseline* | Patriot Defender (preventive framing) | `patriot-immune` |

\*Combined into nearest branded SKU — no new protocol products until launch strategy changes.

**Additional branded protocols (not in original spec table):**

| Branded | Slug | Spec mapping |
|---------|------|--------------|
| Freedom Calm – Anxiety Relief | `freedom-calm` | Cognitive & Calm / overlap #2 |
| Foundation Liver & Kidney Detox | `liver-kidney-detox` | Vital organs support |
| Red Light Spine & Joint Support | `infrared-spine` | Musculoskeletal recovery |
| Fresh Smile Dental & Oral Health | `fresh-smile-dental` | Wellness / dental |

---

## 4. Top-2 supplement recommendation logic

When symptoms span multiple protocol areas, members receive **two prioritised supplement recommendations**, not one vague “secondary consideration.”

### Overlap pairing (example)

**Input:** Senior dog pacing at night, disorientation, anxiety  
**Output:**

1. **Immune Vitality Protocol** → Patriot Defender – Immunity & Vitality (primary)  
2. **Cognitive & Senior Support Protocol** → Freedom Calm – Anxiety Relief (forced secondary via lexicon `forcedSecondary`)

### Implementation

| Layer | File | Role |
|-------|------|------|
| Lexicon | `lib/ai/symptom-lexicon.ts` | Symptom aliases → protocol; `forcedSecondary` on overlap entries |
| Ranking | `lib/ai/rank-protocols.ts` | `rankTopTwoProtocols()` — priority order + forced pairs |
| Registry | `lib/ai/protocol-registry.ts` | Spec category + branded title + slug |
| Fusion | `lib/ai/diagnostics.ts` | Lexicon + vision → dual recommendations |
| Vision | `lib/ai/vision-analyze.ts` | OpenAI photo analysis (optional if no API key) |

---

## 5. Architecture (Phase 2a — photos)

```
Member PWA (/diagnostics)
    │
    ├─ Photo upload + symptom text
    │
    ▼
POST /api/analyze
    │
    ├─► Symptom lexicon (Layer 1 — always)
    │
    ├─► OpenAI vision (Layer 2 — if OPENAI_API_KEY set)
    │
    ▼
Fusion + rankTopTwoProtocols()
    │
    ▼
JSON: primary + secondary (spec + branded + slug + confidence)
      visualFindings, vetUrgent, disclaimer
```

**Without API key:** Lexicon-only analysis still works (symptom text + top-2 ranking).

**With API key:** Photo contributes `visualFindings` and can boost/adjust protocol ranking.

---

## 6. Vision provider — why OpenAI GPT-4o-mini

| Factor | Rationale |
|--------|-----------|
| Accuracy for pet photos | Strong at describing skin, eyes, posture, coat — good for *educational* protocol alignment |
| Structured JSON | Native schema output → stable slugs and confidence |
| Already in stack | `openai` package in repo |
| Cost / latency | `gpt-4o-mini` ~$0.01–0.03/analysis at `detail: low` — suitable for PWA |
| Safety | Fused with lexicon + confidence caps (≤94%) + vet urgency rules — never raw diagnosis |

**Replicate / custom ViT:** Phase 4 — host fine-tuned models when labeled dataset exists.

---

## 7. Phased roadmap

### ✅ Phase 0 — Taxonomy & dual labels (started)

- [x] `protocol-registry.ts` — spec + branded metadata  
- [x] Top-2 ranking with `forcedSecondary` (cognitive/senior → Immune + Calm)  
- [x] Results UI — dual labels + protocol links  
- [x] Expand lexicon with all 10 spec example phrases  

### 🔄 Phase 2a — Photo vision (started)

- [x] `vision-analyze.ts` — OpenAI integration  
- [x] Fusion in `analyzeDogImage()`  
- [x] Vet urgency banner in UI  
- [ ] Set `OPENAI_API_KEY` on Vercel  
- [ ] Premium results polish (confidence bars, copy tuning)  

### Phase 1 — Premium UX (next)

- [ ] Image quality gate before analyze  
- [ ] Token shop CTA from results  
- [ ] Member-facing “how ViT works” on diagnostics page  

### Phase 2b — Video (after photos stable)

- [ ] Short video upload (10–15 sec)  
- [ ] Extract 3–5 frames → same vision pipeline  

### Phase 3 — Scale & rigor

- [ ] Persistent storage (replace 1h upload TTL)  
- [ ] Member accounts + analysis history  
- [ ] VeNom / clinical synonym expansion  
- [ ] Admin dashboard for vision vs lexicon disagreement  

### Phase 4 — Custom ViT (optional)

- [ ] Labeled pet imagery dataset  
- [ ] Fine-tuned model on Replicate or dedicated GPU  

---

## 8. Environment variables

```bash
# Required for photo vision (Phase 2a)
OPENAI_API_KEY=sk-...

# Optional — default gpt-4o-mini
OPENAI_VISION_MODEL=gpt-4o-mini
```

Add to Vercel → Project → Settings → Environment Variables (Preview + Production).

---

## 9. Testing checklist

| Test | Expected |
|------|----------|
| Symptoms: `senior dog pacing at night confused` | #1 Patriot Defender · #2 Freedom Calm · green "Symptom lexicon matched" box |
| Local check | `npm run symptom:test -- "your text"` |
| All 10 categories | `npm run symptom:test:all` |
| Symptoms: `cloudy eye squinting` | #1 Clear Vision Defender · #2 if overlap |
| Photo + symptoms with API key | `visualFindings` populated, `usedVision: true` |
| No API key | Lexicon-only, `usedVision: false` |
| Pale gums + cough (vision or text) | `vetUrgent: true` + heart protocol |
| Unknown phrase | Queued in admin symptom review |

---

## 10. Legal & trust

Every result includes:

> *Educational tool only. Not a diagnosis or substitute for licensed veterinary care. Always consult your veterinarian.*

High-risk visual/report combinations trigger **veterinary attention recommended** before protocol marketing.

---

## 11. Key files

| File | Purpose |
|------|---------|
| `app/diagnostics/ViTDiagnosticsClient.tsx` | Member UI |
| `app/api/analyze/route.ts` | Analyze API |
| `lib/ai/diagnostics.ts` | Fusion orchestration |
| `lib/ai/symptom-lexicon.ts` | Symptom → protocol map |
| `lib/ai/rank-protocols.ts` | Top-2 supplement ranking |
| `lib/ai/protocol-registry.ts` | Spec + branded metadata |
| `lib/ai/vision-analyze.ts` | OpenAI vision |
| `lib/ai/prompt-templates.ts` | Dr. Atlas system prompt |
| `docs/Freedom-Paws-Symptom-Lexicon-Admin-Guide.md` | Admin review workflow |

---

*Freedom Paws Wellness — Honor Buddy's Legacy*
