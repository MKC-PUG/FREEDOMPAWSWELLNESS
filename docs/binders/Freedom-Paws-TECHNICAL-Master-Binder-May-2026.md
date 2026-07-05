# Freedom Paws Wellness LLC — TECHNICAL MASTER DOCUMENT BINDER

**Version:** 2.0 (Comprehensive Update)  
**Date:** May 2026  
**Audience:** Attorneys · Grant reviewers · Accelerators · Technical partners · Strategic acquirers  
**Classification:** Confidential — distribute under NDA when marked  
**Companion document:** *General Master Binder* (public/community/marketing only)

---

## How to print as PDF

1. Copy into Google Docs or Word · 1-inch margins · 11–12 pt Arial/Calibri.  
2. Page breaks at each `[PAGE BREAK]`.  
3. Appendices may be rotated landscape for tables.  
4. Redact §Security and §Environment before public release.

---

## TABLE OF CONTENTS

| § | Section |
|---|---------|
| 1 | Cover |
| 2 | Executive Summary |
| 3 | Entity, Legal & Compliance Status |
| 4 | Platform Architecture Overview |
| 5 | Technology Stack & Infrastructure |
| 6 | Module Technical Specifications (Live) |
| 7 | ViT Diagnostics — Public Tier |
| 8 | ViT Pro™ — Veterinary CDS (Phase V0) |
| 9 | Freedom Paws ID — Track 1 & Track 2 |
| 10 | Adoption Network & Partner Portal |
| 11 | Token Shop — XRPL / Xaman / Stripe |
| 12 | XRPL Token Standards — MPT & Dynamic NFT |
| 13 | Ops Command Center |
| 14 | Data, Privacy & Security |
| 15 | Intellectual Property & Patent Strategy |
| 16 | Competitive Landscape |
| 17 | Build Value & Replacement Cost |
| 18 | Financial Projections (2026–2030) |
| 19 | ViT Pro Financial Addendum (2026–2030) |
| 20 | Valuation Summary |
| 21 | Roadmap — Dissected by Quarter |
| 22 | Grant & Capital Use Framework |
| 23 | Technical Appendix — Protocol JSON Metadata |
| 24 | Technical Appendix — API Surface |
| 25 | Risk Register |
| 26 | Contact & Document Control |

---

[PAGE BREAK — §1: COVER]

# Freedom Paws Wellness LLC

## Technical Master Binder

**For Attorneys, Grant Reviewers, Accelerators, and Technical Partners**

May 2026 · Version 2.0

| Field | Value |
|-------|-------|
| **Entity** | Freedom Paws Wellness LLC *(Wyoming — in formation / legal review)* |
| **Product** | Everything-app PWA for dog wellness, ID, adoption |
| **Primary app** | https://app.freedompawsinc.com |
| **Build value (Jun 2026 est.)** | ~$266K replacement cost · ~$1.0–1.5M planning valuation |
| **Classification** | Utility tokens · Educational CDS · Not investment contracts |

---

[PAGE BREAK — §2: EXECUTIVE SUMMARY]

# Executive Summary

Freedom Paws Wellness LLC is building the **first phone-first “everything app for dogs”** combining:

1. **ViT AI diagnostics** (wellness tier live; vet CDS tier in validation)  
2. **Ten holistic educational protocols** (XRPL tokenized access)  
3. **Freedom Paws ID** — biometric reunion for unchipped dogs  
4. **Shelter adoption network** — TN pilot → national  
5. **SuperBud Photo Booth** — community acquisition  
6. **Partner rails** — insurance + holistic telehealth affiliates  

### Technical differentiation

| Capability | Freedom Paws | Typical competitor |
|------------|--------------|------------------|
| AI photo/video → protocol mapping | ✅ Native | Partial (Yipara, etc.) |
| Biometric ID without chip | ✅ Pilot | None at scale |
| Shelter match + human review | ✅ Built | Registries only (chip) |
| Vet-grade CDS + owner wellness dual tier | ✅ Phase V0 | None integrated |
| XRPL-native protocol commerce | ✅ Live Xaman | None |
| Full PWA (no app store gate) | ✅ | Most use native apps |

### Traction (May 2026)

| Metric | Status |
|--------|--------|
| Production PWA | Live (preview mode pre-LLC) |
| iPhone-validated Xaman checkout | ✅ Mainnet |
| Supabase ID migrations | 001–004 deployed |
| Shelter partner DNS + magic-link auth | ✅ |
| Wellness partner URLs | ✅ Configured |
| ViT Pro portal | ✅ Phase V0 foundation |
| TN adoption infrastructure | ✅ Ready for listings |

### Capital thesis

- **~$266K** fair-market dev already built (self-build savings vs agency)  
- **Whitespace** in holistic wellness + unchipped ID + integrated ViT  
- **Multiple revenue lanes:** protocol shop, membership, affiliates, shelter B2B, ViT Pro SaaS  
- **Mission-aligned grants:** veteran dogs, shelter technology, XRPL ecosystem  

---

[PAGE BREAK — §3: ENTITY, LEGAL & COMPLIANCE]

# Entity, Legal & Compliance Status

| Item | Status | Notes |
|------|--------|-------|
| **Wyoming LLC** | In progress | Launch gated on trademark/LLC counsel |
| **Operating Agreement** | In progress | Custom OA with utility-token framing |
| **Trademarks** | Planned | Freedom Paws Wellness™, SuperBud™, ViT Pro™ |
| **Utility token classification** | Counsel review | MPT = educational access only; not investment |
| **ViT public tier** | Educational disclaimer live | Not diagnosis |
| **ViT Pro tier** | CDS for licensed vets | Not SaMD at launch; avoid diagnosis claims |
| **Biometric consent** | Template ready | `Freedom-Paws-ID-Biometric-Consent-Template` |
| **Terms / Privacy** | Pre-launch | Counsel review before public index |
| **Give-back policy** | Defined | 10% net → 50% veteran orgs / 50% shelters |

### Uniform disclaimer (all surfaces)

> Educational tool only. Not veterinary medical advice, diagnosis, or treatment. MPTs grant educational access only — not investment products.

### Regulatory pathways (future)

| Product | US framing | Trigger for escalation |
|---------|------------|------------------------|
| Tier A ViT | Wellness / education | Current |
| ViT Pro CDS | Clinical decision support (vet-only) | Current target |
| ViT Pro as SaMD | FDA device | Only if diagnostic claims + funded validation |

**Legal budget (Year 1 est.):** $15K–$40K veterinary regulatory + general counsel.

---

[PAGE BREAK — §4: PLATFORM ARCHITECTURE]

# Platform Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER SURFACES                             │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│ Consumer PWA │ Partner PWA  │ Ops Console  │ ViT Pro Portal     │
│ app.fp.com   │ shelter.*    │ /ops         │ /vit-pro           │
└──────┬───────┴──────┬───────┴──────┬───────┴─────────┬──────────┘
       │              │              │                 │
       ▼              ▼              ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js 16 App Router (TypeScript)                  │
│  app/ routes · lib/ domain logic · API routes · middleware     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│  Supabase   │        │   OpenAI    │        │    XRPL     │
│  Auth + PG  │        │  GPT-4o-mini│        │   Xaman     │
│  pgvector   │        │   Vision    │        │  XUMM API   │
└─────────────┘        └─────────────┘        └─────────────┘
       │                       │
       ▼                       ▼
┌─────────────┐        ┌─────────────┐
│   Vercel    │        │  ViT Pro    │
│   Edge/CDN  │        │  RAG corpus │
└─────────────┘        └─────────────┘
```

### Surface routing

| Path prefix | Surface header | Shell |
|-------------|----------------|-------|
| `/ops` | `ops` | OpsNavbar |
| `/vit-pro` | `vitpro` | VitProNavbar |
| `/partner` | `partner` | PartnerNavbar |
| `shelter.*` host | `partner` | PartnerNavbar |
| Default | `consumer` | Navbar |

### Codebase scale (Jun 2026)

| Metric | Value |
|--------|-------|
| TypeScript/TSX (app + lib) | ~20,600+ lines |
| App routes | 23+ |
| Supabase migrations | 001–004 (ID + partner + ops) |
| Public assets | 185+ |
| Internal docs | 90+ markdown files |

---

[PAGE BREAK — §5: TECHNOLOGY STACK]

# Technology Stack & Infrastructure

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, Tailwind 4 | PWA UI |
| **Hosting** | Vercel | HTTPS, edge, preview deploys |
| **Database** | Supabase (Postgres) | Auth, profiles, listings, embeddings |
| **Vector search** | pgvector | ID similarity matching |
| **AI vision** | OpenAI GPT-4o-mini | ViT structured JSON |
| **AI RAG (ViT Pro)** | Keyword retrieval V0 → embeddings V1 | Literature citations |
| **Payments** | XUMM/Xaman (XRP, RLUSD) | Primary protocol checkout |
| **Payments (alt)** | Stripe | Card checkout *(rolling out)* |
| **PWA** | Service worker v78 | Offline shell, cache versioning |
| **Marketing** | Framer | freedompawsinc.com |
| **Email** | Resend | Transactional *(partner auth)* |
| **Monitor** | go2rtc | WebRTC camera relay POC |

### Environment & domains

| Domain | Role |
|--------|------|
| app.freedompawsinc.com | Canonical PWA |
| freedompawsinc.com | Framer marketing |
| shelter.freedompawsinc.com | Partner portal |
| freedompawsinc.org | **Recommended** grants/community |

### Infrastructure phases (complete)

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Framer `/adopt` wired to app | ✅ Saved (pre-publish) |
| 2 | Shelter DNS + partner auth | ✅ Production verified |
| 3 | Wellness partner env URLs | ✅ `config-status: ready` |

---

[PAGE BREAK — §6: MODULE SPECIFICATIONS]

# Module Technical Specifications (Live)

| Module | Key paths | Completion |
|--------|-----------|------------|
| **PWA platform** | `public/sw.js`, `lib/pwa-version.ts`, manifests | 95% |
| **ViT Diagnostics** | `app/diagnostics/`, `lib/ai/*` | 90% |
| **Protocols** | `app/protocols/`, `lib/ai/protocol-registry.ts` | 90% |
| **Token Shop** | `app/token-shop/`, `lib/shop/*` | 90% |
| **Photo Booth** | `app/photobooth/`, imgly bg removal | 85% |
| **Freedom Paws ID T1** | `app/id/*`, migrations 001–004 | 95% |
| **Partner portal** | `app/partner/*` | 90% |
| **Adoption public** | `app/adopt/*` | 85% |
| **Ops console** | `app/ops/*` | 90% |
| **ViT Pro V0** | `lib/vit-pro/*`, `app/vit-pro/*` | Foundation |
| **Monitor** | `app/monitor/*`, go2rtc | 50% |
| **My Pets vault** | `app/mypets/*` | 40% |

---

[PAGE BREAK — §7: VIT PUBLIC TIER]

# ViT Diagnostics — Public Tier (Technical)

### Pipeline

```
Photo/video upload
  → Quality gate (lib/vit/media-quality-gate.ts)
  → Video: 3–5 frames (lib/vit/extract-video-frames.ts)
  → OpenAI vision (lib/ai/vision-analyze.ts)
  → Symptom lexicon normalize (lib/ai/normalize-symptoms.ts)
  → Protocol rank top-2 (lib/ai/rank-protocols.ts)
  → Urgent assessment (lib/ai/urgent-assessment.ts) — ≥80% congruency
  → API response (app/api/analyze/route.ts mode=wellness)
```

### API

| Field | Value |
|-------|-------|
| Endpoint | `POST /api/analyze` |
| Mode | `wellness` (default) |
| Input | multipart: `image`, `symptoms`, optional `frame_*`, `mediaType` |
| Output | `AnalyzeApiResponse` — protocols, urgency, visual findings |

### Safety gates

- Confidence capped ≤92%  
- `vetUrgent` server-side from severe-conditions DB  
- Mild/moderate vs urgent separation  
- Educational disclaimer on every response  

### Cost per scan (est.)

| Tier | API cost |
|------|----------|
| Photo | $0.02–0.05 |
| Video (5 frames) | $0.05–0.10 |

---

[PAGE BREAK — §8: VIT PRO CDS]

# ViT Pro™ — Veterinary CDS (Phase V0)

**Portal:** `/vit-pro` · **API mode:** `vit_pro` · **Status:** Foundation — advisor validation over 3–4 months pre-production.

### Dual-output architecture

```
Same media + history
  → Region detect (eye | skin | oral)
  → Rubric-aware vision pass
  → RAG corpus retrieve (12+ open/licensed refs)
  → VitProFullReport (internal)
  → Tier B: vet JSON + citations + emrPlainText
  → Tier A: simplified public JSON (no citations)
```

### Key files

| Path | Purpose |
|------|---------|
| `lib/vit-pro/types.ts` | Dual-output schemas |
| `lib/vit-pro/rubrics/*.json` | Eye, skin, oral rubrics |
| `lib/vit-pro/corpus/manifest.json` | RAG sources |
| `lib/vit-pro/vit-pro-analyze.ts` | Orchestrator |
| `app/vit-pro/(protected)/*` | Advisor portal |

### Access control

- Roles: `fp_ops`, `vet_staff`, or `VIT_PRO_ADVISOR_EMAILS` env allowlist  
- Env kill switch: `VIT_PRO_ENABLED=false`  

### Validation plan

| Level | Scope | Cost |
|-------|-------|------|
| L1 | 50-photo internal benchmark | $0–2K |
| L2 | 3-clinic pilot, 100 cases | $25–40K |
| L3 | Formal study + university | $60–75K+ |

### Build estimate (full module)

| Item | Hours | Cash (self-build Y1) |
|------|-------|------------------------|
| Engineering | 680–1,000 | Founder + Cursor |
| Non-engineering | — | $35–108K |
| **All-in to pilot** | — | **$50–190K** |

### Y5 ViT Pro revenue (conservative, integrated)

| Year | ViT-attributed revenue |
|------|------------------------|
| Y1 | ~$92K |
| Y3 | ~$1.12M |
| Y5 | ~$2.56M |

*Full model: `ViT-PRO-BUSINESS-PLAN-AND-ROADMAP-June-2026.md`*

---

[PAGE BREAK — §9: FREEDOM PAWS ID]

# Freedom Paws ID — Track 1 & Track 2

### Track 1 — Biometric (live)

| Component | Implementation |
|-----------|----------------|
| Enroll UI | `/id/enroll` |
| Found intake | `/id/found` |
| Match review | `/id/match` (human approval) |
| Embeddings | pgvector in Supabase |
| Vision regions | eyes, face, body, posture, gait |
| Default threshold | 0.72 (tunable) |
| Analyze mode | `identity` on `/api/analyze` |

### Track 2 — Microchip scanner *(in development)*

| Item | Detail |
|------|--------|
| Hardware | HomeAgain WorldScan Plus, PetScanner BLE *(ordered)* |
| App routes | `/id/scan`, lookup, kit — MVP pending hardware QA |
| Registry | AAHA lookup UX beta |
| Retail kit plan | `TRACK-2-RETAIL-SCANNER-KIT-PLAN-June-20-2026.md` |

### Pilot timeline

| Date | Milestone |
|------|-----------|
| Oct 1, 2026 | Tennessee biometric pilot live |
| Jan 1, 2027 | National promotion mode |
| Dec 31, 2026 | 15 shelter partners target |

---

[PAGE BREAK — §10: ADOPTION & PARTNER]

# Adoption Network & Partner Portal

### Public adoption

- Route: `/adopt/tn`, `/adopt/tn/[partner-slug]`  
- Data: Supabase partner listings  
- Framer: `freedompawsinc.com/adopt` → app CTAs  

### Partner portal

- URL: `shelter.freedompawsinc.com/partner`  
- Auth: Supabase magic link + OTP fallback  
- Features: Listings CRUD, dashboard  
- Roles: `shelter_admin`, `shelter_staff`  

### TN pilot partners (6)

Memphis Animal Services · Metro Animal Care & Control · Young-Williams · New Leash on Life · Humane Society Sumner County · Safe Place for Animals

---

[PAGE BREAK — §11: TOKEN SHOP]

# Token Shop — XRPL / Xaman / Stripe

| Field | Value |
|-------|-------|
| Canonical price | **18 RLUSD ≈ $18 USD** |
| XRP | Live CoinGecko conversion (~2 min refresh) |
| Fallback XRP | 25 XRP if rate API down |
| Wallet | Xaman (XUMM SDK) |
| Unlock storage | `localStorage` device unlock + server webhook *(planned)* |
| Code authority | `lib/shop/protocol-catalog.ts`, `app/token-shop/shop-items.ts` |

### Checkout flow

```
Select protocol → XUMM payload (/api/xumm/*) → User signs in Xaman
  → Payment to treasury → Device unlock → Protocol content accessible
```

### Stripe (secondary rail)

- Task C on roadmap — membership gates + card checkout  
- Reduces friction for non-crypto users at launch  

---

[PAGE BREAK — §12: XRPL TOKEN STANDARDS]

# XRPL Token Standards — MPT & Dynamic NFT

*For counsel and XRPL grant reviewers.*

### Multi-Purpose Token (MPT) — XLS-89

| Property | Planned implementation |
|----------|------------------------|
| Standard | XRPL XLS-89 MPT |
| Utility | Protocol educational access |
| Royalties | 5–10% to impact treasury |
| Transfer | Holder-to-holder per XRPL rules |
| Classification | Utility — not investment contract |

### Dynamic NFT — NFToken

| Property | Planned implementation |
|----------|------------------------|
| Flag | `tfMutable` (0x00000010) |
| Use | Updatable pet wellness record |
| Metadata | JSON on IPFS / URIL generator |
| Status | Roadmap post-core launch |

### Patriotic DAO governance

| Element | Plan |
|---------|------|
| Tool | Snapshot |
| Weight | MPT holdings + community rules |
| Scope | Impact fund allocation votes |
| Status | Post-LLC · post-first sales volume |

**Note:** Live checkout today uses XUMM payment payloads for protocol unlock; full on-ledger MPT minting is **roadmap** aligned with XRPL Grants milestones.

---

[PAGE BREAK — §13: OPS COMMAND CENTER]

# Ops Command Center

**URL:** `/ops` · **Access:** `fp_ops` role + `FP_OPS_EMAILS` env

| Module | Path | Function |
|--------|------|----------|
| Home | `/ops` | KPIs, department links |
| Adoption | `/ops/adoption` | TN pilot stats |
| Marketing | `/ops/marketing` | Automation controls (dormant) |
| Shelter & ID | `/ops/shelter-id` | Match queue |
| Wellness | `/ops/wellness` | Partner URL config |
| Product | `/ops/product` | PWA version, features |
| System | `/ops/system` | Supabase, env health |
| ViT Pro | `/vit-pro` | CDS foundation portal |

---

[PAGE BREAK — §14: DATA, PRIVACY & SECURITY]

# Data, Privacy & Security

| Data class | Storage | Access |
|------------|---------|--------|
| User auth | Supabase Auth | RLS policies |
| User profiles | `user_profiles` | Role-based |
| ViT analysis | Symptom feedback store | Admin review queue |
| ID embeddings | pgvector | Shelter review only for matches |
| Partner listings | Supabase | Partner RLS |
| Pet photos (ViT) | Transient analyze | Not long-term medical record without consent |
| ViT Pro reports | API response | Advisor portal; audit log V1 |

### Security practices

- Service role keys server-only (never client)  
- Partner/ops routes auth-gated  
- Preview mode robots blocking pre-launch  
- BAA templates for ViT Pro clinic data *(V1)*  
- Security audit budget: $6–9K (ViT Pro Y1)  

### HIPAA note

Freedom Paws is **not a covered entity**. ViT Pro clinic workflows may require BAA-adjacent handling if PHI stored — legal review before national vet rollout.

---

[PAGE BREAK — §15: INTELLECTUAL PROPERTY]

# Intellectual Property & Patent Strategy

*Not legal advice — counsel must confirm.*

### IP stack

| Type | Asset | Status |
|------|-------|--------|
| **Trademark** | Freedom Paws Wellness™, SuperBud™, ViT Pro™ | Filing planned |
| **Copyright** | Code, protocol text, images | Automatic |
| **Trade secret** | Symptom lexicon, rubrics, RAG curation, congruency thresholds | Active |
| **Provisional patent** | Integrated capture → ID + dual-tier ViT + protocol fusion | Recommended pre-B2B marketing |

### Potentially patentable (narrow)

- Unified media session → biometric ID + Tier A + Tier B + protocol map  
- Congruency-gated urgency fusion (`urgent-assessment.ts`)  
- Owner→vet tier handoff with audit version ID  
- Gait capture protocol *(if novel vs prior art)*  

### Weak / crowded prior art

- Generic AI pet triage  
- RAG + PDF medical reports  
- Photo symptom checkers (Yipara, VetPati, PetMD)  

### Prior art search terms

`veterinary symptom checker AI` · `pet vision mobile` · `clinical decision support veterinary` · `dog lameness smartphone video`

**Patent budget:** Provisional $2–5K · Utility $10–25K over 2–4 years

---

[PAGE BREAK — §16: COMPETITIVE LANDSCAPE]

# Competitive Landscape

| Company | Strength | Gap vs Freedom Paws |
|---------|----------|---------------------|
| **Chewy** | Logistics, scale | No holistic protocols; no biometric ID |
| **Pawp / Vetster** | Telehealth | No ViT→protocol; no ID/adoption |
| **Whistle / Fi** | GPS hardware | No wellness AI; no protocols |
| **Yipara / VetPati** | Photo triage | No ID, adoption, XRPL, vet CDS tier |
| **Zoetis Imagyst** | Lab AI | Not phone-first consumer |
| **Microchip registries** | Chip lookup | No unchipped biometric wedge |

**Whitespace:** AI triage → holistic protocol → identity → reunion → affiliate protection in **one PWA**.

**Dominance rating:** 7.5/10 niche · 5.5/10 vs Chewy head-on *(internal assessment)*.

---

[PAGE BREAK — §17: BUILD VALUE]

# Build Value & Replacement Cost

**As of June 10, 2026** — module-based agency estimate at $150/hr blended.

| Module | Contract value built |
|--------|---------------------|
| PWA platform | $14,250 |
| ViT Diagnostics | $37,800 |
| Photo Booth | $40,800 |
| Protocols | $13,500 |
| Token Shop | $25,200 |
| Monitor | $10,500 |
| My Pets | $4,800 |
| Freedom Paws ID T1 | $85,500 |
| Admin / symptoms | $8,100 |
| Docs / DevOps | $8,500 |
| Framer + brand | $16,900 |
| **Total** | **~$266,000** |

**Remaining to launch (est.):** $80–120K contract equivalent (Monitor relay, legal, Stripe, Track 2 MVP, QA).

**ViT Pro add-on (full module):** $102–150K contract · $50–190K all-in with validation.

---

[PAGE BREAK — §18: FINANCIAL PROJECTIONS 2026–2030]

# Financial Projections — Platform (Base Case)

*From 10-Year Vision & 5-Year Competitive Model — estimates not guarantees.*

### Revenue assumptions

| Assumption | Value |
|------------|-------|
| Core membership | $9.99/mo |
| Protocol price | ~$18 |
| Payment processing | 3% |
| Give-back reserve | 10% net |
| Free:paid ratio | ~2:1 narrowing over time |

### Annual summary

| Year | Paying members | Annual revenue | Valuation range |
|------|----------------|----------------|-----------------|
| **2026** | 280 | $21K | $1–2M |
| **2027** | 1,450 | $158K | $2–5M |
| **2028** | 3,600 | $463K | $4–10M |
| **2029** | 7,000 | $975K | $8–20M |
| **2030** | 12,800 | $1.83M | $15–35M |

### Revenue mix (mature)

| Lane | Share |
|------|-------|
| Protocol shop + membership | 40% |
| Affiliates (insurance, telehealth, whole-food) | 35% |
| Shelter B2B + ID | 15% |
| ViT Pro B2B | 10% (growing) |

---

[PAGE BREAK — §19: VIT PRO FINANCIAL ADDENDUM]

# ViT Pro Financial Addendum

### Pricing (planned)

| Plan | Price | Includes |
|------|-------|----------|
| Practice Starter | $199/mo | 5 seats, 200 scans |
| Practice Pro | $299/mo | 10 seats, 500 scans |
| Overage | $0.75/scan | Above quota |

### ViT-attributed revenue (conservative)

| Year | Total ViT-attributed |
|------|---------------------|
| Y1 | $92K |
| Y2 | $408K |
| Y3 | $1.12M |
| Y5 | $2.56M |

### Standalone ViT Pro Y5

~$1.91M revenue · $15–23M SaaS valuation at 8–12× ARR

### Strategic acquisition premium

Zoetis / IDEXX / Mars-Kinship: +30–50% over SaaS multiple for validated CDS + data flywheel.

---

[PAGE BREAK — §20: VALUATION SUMMARY]

# Valuation Summary

### Today (May–Jun 2026)

| Method | Range |
|--------|-------|
| Replacement cost | $400–700K |
| Berkus pre-revenue | $750K–1.5M |
| Strategic option | $1–2M |
| **Planning valuation** | **$1.0–1.5M** |

### With ViT Pro optionality

Post-V0 advisor validation: +$0.5–2M option value  
At scale (Y3 integrated): +$5–15M  

### Y10 stretch (2035)

| Case | Revenue | Valuation |
|------|---------|-----------|
| Base | $5.35M | $45–110M |
| Stretch | $8–12M | $80–150M |

*Not a 409A appraisal.*

---

[PAGE BREAK — §21: ROADMAP]

# Roadmap — Dissected

### Q3 2026 (now)

- [x] Infrastructure phases 1–3  
- [x] ViT Pro Phase V0 foundation + portal  
- [ ] LLC/trademark clearance  
- [ ] Framer `/adopt` publish  
- [ ] First TN demo listing  
- [ ] ViT Pro advisor recruited  
- [ ] Shelter pilot outreach (dormant until launch gate)  

### Q4 2026

- [ ] Public launch post-legal  
- [ ] Founding member campaign  
- [ ] ID biometric pilot Oct 1  
- [ ] ViT Pro 50-photo benchmark complete  
- [ ] Track 2 hardware QA  

### 2027 H1

- [ ] ViT Pro V1 — PDF, billing, 3-clinic pilot  
- [ ] Track 2 scanner MVP  
- [ ] Stripe membership live  
- [ ] First give-back distribution  

### 2027 H2 – 2030

- [ ] 15+ shelter partners  
- [ ] ViT Pro gait module  
- [ ] MPT on-ledger minting + DAO Snapshot  
- [ ] Monitor production relay  
- [ ] National ID promotion Jan 2027  

---

[PAGE BREAK — §22: GRANT & CAPITAL USE]

# Grant & Capital Use Framework

### XRPL Grants alignment

| Milestone | Deliverable |
|-----------|-------------|
| M1 | Xaman checkout live ✅ |
| M2 | Protocol catalog + treasury ✅ |
| M3 | MPT issuance + royalty routing |
| M4 | Dynamic NFT wellness record |
| M5 | DAO Snapshot governance |

### Out of current grant scope

**Agentic settlement on XRPL (future option; not in current grant scope)**

Freedom Paws Wellness, LLC (Wyoming) plans to prioritize human-facing on-ledger utility in the near term: RLUSD checkout for protocol purchases, MPT-based protocol issuance, and transparent give-back to shelter and veteran-support partners as approved by counsel. After those milestones and a successful Memphis-area pilot—with measurable enrollments, scan validation, and ViT usage—the Company may explore **agentic settlement** on the XRP Ledger for **metered, non-consumer** workflows (for example, capped machine payments for ViT inference, treasury automation, and auditable operational spend aligned with our give-back model). Any such work would follow ecosystem standards such as **x402-style machine payments** and may involve third-party trust and audit layers (e.g., t54.ai). **This agentic track is not a dependency for the current grant milestone, is not budgeted in this application, and would proceed only after legal review, pilot metrics, and production RLUSD readiness.** Consumer checkout will remain human-initiated (Xaman, card/Stripe, and RLUSD as applicable).

### Use of funds (illustrative $250K seed/grant)

| Category | % | Amount |
|----------|---|--------|
| ViT Pro validation + legal | 25% | $62K |
| Track 2 scanner pilot kits | 20% | $50K |
| Shelter onboarding (TN→national) | 20% | $50K |
| Marketing launch (grassroots) | 15% | $38K |
| Monitor production relay | 10% | $25K |
| Reserve | 10% | $25K |

### Grant narrative hooks

- **Veteran service dog wellness** — Patriot Immune + give-back  
- **Shelter technology** — unchipped reunion  
- **XRPL utility** — real commerce not speculation  
- **Rural/veteran access** — PWA, no app store, phone-first  

**Contact:** grants@freedompawsinc.com

---

[PAGE BREAK — §23: PROTOCOL JSON METADATA]

# Technical Appendix — Protocol JSON Metadata (Sample)

*Representative on-ledger / IPFS metadata schema for one protocol. Repeat pattern for all 10 slugs.*

```json
{
  "schema_version": "1.0.0",
  "protocol_slug": "max-movement",
  "branded_title": "Max Movement Pro – Joint Support",
  "spec_category": "Joint & Mobility Protocol",
  "utility_type": "educational_access",
  "token_standard": "MPT_XLS89",
  "xrpl": {
    "network": "mainnet",
    "currency_display": "FPMAX",
    "royalty_bps": 500,
    "impact_treasury": "TBD_POST_LLC"
  },
  "pricing": {
    "rlusd": 18,
    "usd_display": 18,
    "xrp_fallback": 25
  },
  "vit_mapping": {
    "primary_signals": ["lameness", "stiffness", "gait asymmetry", "hip dysplasia signs"],
    "vision_regions": ["gait", "posture", "body"],
    "urgent_redirect": true
  },
  "content": {
    "detail_route": "/protocols/max-movement",
    "shop_deep_link": "/token-shop?protocol=max-movement#max-movement",
    "hero_image": "/images/protocols/max-movement.png"
  },
  "legal": {
    "disclaimer": "Educational only. Not veterinary advice.",
    "classification": "utility_token"
  },
  "metadata_uri": "ipfs://freedom-paws/protocols/max-movement/v1.json"
}
```

**All 10 slugs:** `max-movement`, `freedom-calm`, `liver-kidney-detox`, `gut-balance`, `infrared-spine`, `allergy-shield`, `fresh-smile-dental`, `heart-strong`, `patriot-immune`, `clear-vision`

---

[PAGE BREAK — §24: API SURFACE]

# Technical Appendix — API Surface (Selected)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analyze` | POST | ViT wellness, identity, vit_pro |
| `/api/vit-pro/status` | GET | Module status (auth) |
| `/api/wellness/config-status` | GET | Partner URL readiness |
| `/api/xumm/*` | POST | XRPL checkout payloads |
| `/api/pricing/live` | GET | XRP/USD live rate |
| `/api/symptom-feedback` | POST | ViT feedback queue |
| Partner auth | Supabase | Magic link + OTP |

### Analyze modes

| Mode | Audience | Output |
|------|----------|--------|
| `wellness` | Members | Protocol recommendations |
| `identity` | ID enroll/found | Region descriptors |
| `vit_pro` | Advisors/vets | CDS report + optional public tier |

---

[PAGE BREAK — §25: RISK REGISTER]

# Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| LLC/trademark delay | Medium | Preview mode; NDA for partners |
| ViT hallucination | High | Disclaimers, urgency gates, ViT Pro RAG citations |
| FDA SaMD reclassification | High | CDS framing; vet-only strong claims |
| XRPL liquidity / UX | Medium | Stripe secondary rail |
| Shelter adoption friction | Medium | Free pilot; human match review |
| Competitor copy features | Medium | Integrated moat (ID + adoption + protocols) |
| API cost at scale | Medium | Metering, ViT Pro subscription pricing |
| False ID match | High | Human approval; threshold tuning |

---

[PAGE BREAK — §26: CONTACT & CONTROL]

# Contact & Document Control

| Purpose | Contact |
|---------|---------|
| General / technical | info@freedompawsinc.com |
| Grants / capital | grants@freedompawsinc.com |
| Legal | *(counsel TBD post-LLC)* |
| Partners | partners@freedompawsinc.com |

| Field | Value |
|-------|-------|
| **Document** | Technical Master Binder v2.0 |
| **Date** | May 2026 |
| **Repo** | `docs/binders/Freedom-Paws-TECHNICAL-Master-Binder-May-2026.md` |
| **Documents folder** | `~/Documents/Freedom Paws Wellness/` |
| **Redact before public** | §14 Security detail, §18–20 financials, §22 capital table, API keys |

---

[PAGE BREAK — §27: DATA ROOM PDF PACKAGE]

# Data Room — PDF Package (Technical)

| PDF file | Audience |
|----------|----------|
| **Freedom-Paws-TECHNICAL-Master-Binder-May-2026.pdf** | Attorneys · accelerators · **XRPL Grants** |
| **Appendix-B-ViT-Pro-Advisor-Sheet.pdf** | Veterinary advisor · regulatory counsel |
| **Appendix-C-Protocol-JSON-Metadata-All-10.pdf** | XRPL Grants · on-ledger metadata |
| **protocol-metadata-all-10.json** | Machine-readable grant submission |

**General binder (separate):** `Freedom-Paws-GENERAL-Master-Binder-May-2026.pdf` + **Appendix A** Token Shop one-pager — public only.

All PDFs: `~/Documents/Freedom Paws Wellness/`

---

*Freedom Paws Wellness LLC — Technical Master Binder v2.0 — Honor Buddy's Legacy.*

*Estimates and forward-looking statements are not guarantees. Licensed veterinarians remain responsible for diagnosis and treatment. Consult qualified counsel before token issuance or medical product claims.*
