# Freedom Paws ID — Founder Review Package (June 2026)

**Purpose:** Short review checklist before build decisions.  
**Complete master roadmap (all detail):** [`Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md`](./Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md)  
**Executive summary:** [`Freedom-Paws-ID-Lost-Dog-Infrastructure-Roadmap.md`](./Freedom-Paws-ID-Lost-Dog-Infrastructure-Roadmap.md) v2.0  
**Last updated:** June 10, 2026

---

## 1. What changed (v2.0)

| Topic | v1.0 | **v2.0 (current)** |
|-------|------|---------------------|
| **Build order** | Chip + biometric in parallel | **Biometric (unchipped) first** → chipped second |
| **ViT role** | Reuse later | **Expand first:** eyes, face, body, posture, **gait (video)** |
| **Shelter pilot** | Sep 2026 (mixed) | **Oct 1, 2026** — unchipped found-dog E2E |
| **Chip / scanner** | Weeks 4–9 | **Weeks 18–27** (after biometric live) |
| **Promotion mode** | Dec 1, 2026 | **Jan 1, 2027** (founder decision — moved up from Feb 1) |
| **Hardware spend** | Up front ~$22k | **$0 until Week 18** (~$21k in Q4 2026–Q1 2027) |

---

## 2. Build order (locked unless you change it)

### Track 1 — Build first (unchipped)

1. ViT identity capture: **eyes, face, body, posture, gait (video)**
2. `/id/enroll` — biometric wizard + consent
3. Embeddings + vector DB (pgvector)
4. `/id/found` + `/id/match` — similarity search + **human review**
5. `/id/shelter` — partner dashboard

### Track 2 — Build second (chipped)

6. Bluetooth universal scanner (125 / 128 / 134.2 kHz — **not phone-native**)
7. AAHA registry lookup + AVID branch
8. Chip linked onto existing biometric profile
9. Scanner kit retail (`/id/kit`)

---

## 3. Milestone calendar

| Date | Milestone |
|------|-----------|
| **Jun 10, 2026** | Build starts; Framer ID page finish |
| **Aug 15, 2026** | ViT multi-region + gait beta |
| **Oct 1, 2026** | **Biometric shelter pilot** (3 partners, unchipped E2E) |
| **Dec 15, 2026** | Chipped module complete (compressed — promotion moved up) |
| **Jan 1, 2027** | **Full launch → promotion mode** |

---

## 4. Cost summary (revised)

| Scenario | Track 1 only (biometric pilot) | Full (biometric + chip) |
|----------|----------------------------------|-------------------------|
| **Lean** (you build) | **$15k–$25k** | **$45k–$55k** |
| **Recommended** (contract help) | **$55k–$65k** | **$125k–$135k** |
| **Marketing** (through Q2 2027) | — | **~$20k** total |

**Monthly ops at biometric launch (Oct 2026):** ~$470–$3,050/mo (OpenAI + DB + storage).

---

## 5. Adoption projections

| Metric | Oct 2026 (pilot) | Jan 2027 (full) |
|--------|------------------|-----------------|
| Biometric enrollments | 500 | 3,000 |
| Active shelter pilots | 3 | 20 |
| Found-dog reports | 25 | 200+ |
| Documented reunions | 1+ | 5+ |
| Vet waitlist → active | 30 → 20 | 150 |
| Scanner kits | 0 | 200 |

**Shelter pitch (Track 1):** “40–60% of intakes are unchipped or unreadable — photograph found dogs and search enrolled members.”

---

## 6. Social / marketing (high level)

| Phase | Theme |
|-------|--------|
| Weeks 1–6 | “What ViT sees” — eyes, face, gait |
| Weeks 7–10 | Enroll biometric ID (beta) |
| Weeks 11–16 | Shelter pilot diaries |
| Weeks 17–22 | Reunion stories |
| Weeks 23–29 | Chip scanner launch |

**Primary hook:** *“Unchipped isn’t unseen.”*

---

## 7. Technical files to build (Track 1)

| Item | Path / area |
|------|-------------|
| ID types | `lib/id/types.ts` |
| Embeddings | `lib/id/embeddings.ts` |
| Identity vision | `lib/ai/vision-analyze.ts`, `prompt-templates.ts` |
| API mode | `POST /api/analyze` → `wellness` \| `identity` |
| Enroll UI | `app/id/enroll/` |
| Found + match | `app/id/found/`, `app/id/match/` |
| Shelter portal | `app/id/shelter/` |
| ViT bridge | “Save to ID profile” on `/diagnostics` |

---

## 8. Related docs (all updated)

| Document | What it contains |
|----------|------------------|
| **[Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md](./Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md)** | **Complete master** — everything; week-by-week; APIs; Framer; social; costs |
| [Freedom-Paws-ID-Lost-Dog-Infrastructure-Roadmap.md](./Freedom-Paws-ID-Lost-Dog-Infrastructure-Roadmap.md) | Executive summary v2.0 |
| [Freedom-Paws-Launch-Todo-Prioritized-June-2026.md](./Freedom-Paws-Launch-Todo-Prioritized-June-2026.md) | Track 1 / Track 2 checklists |
| [ViT-Diagnostics-Vision-and-Roadmap.md](./ViT-Diagnostics-Vision-and-Roadmap.md) | Phase ID — vision regions + gait |
| [Framer-CTA-Link-Map.md](./Framer-CTA-Link-Map.md) | Section 14 + 14E launch placeholders |
| **[Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md](./Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md)** | **MASTER/FINAL** — Token Shop + affiliate funding; 10% give-back 50/50 |
| [Freedom-Paws-Project-Build-Value-Estimate-June-2026.md](./Freedom-Paws-Project-Build-Value-Estimate-June-2026.md) | Self-build vs contracted savings (~$266k built) |
| **[Freedom-Paws-10-Year-Vision-Valuation-and-Growth-Plan-June-2026.md](./Freedom-Paws-10-Year-Vision-Valuation-and-Growth-Plan-June-2026.md)** | **10-year vision, valuation, 40 quarters + landmarks** |

---

## 9. Founder decisions — locked (June 10, 2026)

| # | Decision | Founder choice |
|---|----------|----------------|
| **A** | Build order (biometric → chip) | **Approved** |
| **B** | Biometric pilot date | **Oct 1, 2026** |
| **C** | Full promotion date | **Jan 1, 2027** (moved up from Feb 1) |
| **D** | Auth + DB stack | **Supabase** (if best for success — founder agrees) |
| **E** | Vector search | **pgvector** (if best for success — founder agrees) |
| **F** | Shelter pilot regions | **Tennessee** |
| **G** | Engineering budget | **Self-build**; contract when necessary |
| **H** | Framer copy | Do for **pre-launch timeframe**; keep “planned” until live |
| **I** | Scanner retail price | *Pending* |
| **J** | Match threshold 0.72 | *Pending* |

---

## 10. Immediate next steps

| # | Action | Status |
|---|--------|--------|
| 1 | Founder decisions (Section 9) | **Done** |
| 2 | Scaffold `app/id/page.tsx` + `lib/id/types.ts` | **Done** (June 10) |
| 3 | `IDENTITY_SYSTEM_PROMPT` in `prompt-templates.ts` | **Done** (June 10) |
| 4 | Extend ViT API with `identity` mode + region schema | **Done** |
| 5 | Supabase auth + server pets + enroll steps 1–5 | **Done** |
| 6 | Enroll steps 6–9 (posture, gait, embedding, QR) | **Done** |
| 7 | Found-dog intake + match queue (`/id/found`, `/id/match`) | **Done** |
| 8 | Owner email on match approve (Resend) | **Done** (June 10) |
| — | Cost / scanner / mission economics | **MASTER/FINAL** — [Report](./Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md) |
| 5 | Legal: biometric consent template | Pending |
| 6 | Shelter one-pager: “Unchipped isn’t unseen” | Pending |
| 7 | Framer copy (Decision H) | Pre-launch timeframe |
| 8 | **Defer** scanner purchase to Week 18 | Locked |

---

*Engineering started June 10, 2026. Hub: `/id` on app.*
