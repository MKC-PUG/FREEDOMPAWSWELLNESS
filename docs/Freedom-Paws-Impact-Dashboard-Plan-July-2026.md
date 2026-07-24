# Freedom Paws — Impact Dashboard Plan (July 2026)

**Audience:** Founder / partners / grants  
**Status:** Recommendation — **phased yes** (plan now; do **not** ship a public live KPI dashboard yet)  
**Aligned with:** L5 Packet A (A7 give-back), Oct 2026 TN pilot, Jan 2027 promotion  
**Related:** Legal Counsel Playbook §16; Give-back One-Pager (A7); DAO Cost Report §5.6; Framer `/community-impact` + `/grants`; internal `/ops` Command Center  

---

## Verdict

| Decision | Recommendation |
|----------|----------------|
| **Build a public Impact dashboard now?** | **No** — premature; most outcome metrics are zero or uninstrumented |
| **Plan + host narrative impact pages?** | **Yes** — Framer `/community-impact` + `/grants` after **A7 counsel wording** |
| **Auto monthly partner shareables?** | **Yes, but later** — start as **manual PDF/email** at first reunion / Q4 2026 checkpoint; automate after Jan 2027 proof |
| **App-hosted live counters (`app.freedompawsinc.com/impact`)?** | **Post–first documented reunion** (earliest); prefer **Jan 2027** for promotion-grade public dashboard |

**One-line:** Impact storytelling yes; live vanity counters no until L5 + pilot proof.

---

## Context from existing docs & product

### Already in product (internal / ops — not public impact)

| Surface | What it shows | Gap vs public Impact |
|---------|---------------|----------------------|
| `/ops` Command Center | TN partners, listings, match queue, waitlist | Ops-only; not partner-shareable |
| `/id/shelter` | Enrollments, reports, pending reviews, matched reports | Shelter staff; `matched` ≠ verified reunion |
| Supabase | `biometric_enrollments`, `found_dog_reports`, `match_candidates`, `pet_vit_runs`, `shelters` (org_type municipal/private), `pets.microchip_*`, `chip_scan_events`, `adoption_listings` | No donations ledger, no vet referral events, no adoption-event table, no “reunited confirmed” flag |
| Framer plans | `/community-impact`, `/grants` (mission / give-back story) | Narrative pages — not wired to live KPIs |
| Token Shop copy | 10% give-back badge | **A7 counsel gate** — do not harden public $ donated until approved wording + eligible-net formula |

### Timeline gates (do not skip)

| Gate | Why it blocks public Impact KPIs |
|------|----------------------------------|
| **L5 / Packet A** (Terms, Privacy, biometric, **A7 give-back**) | Public give-back / $ donated claims need counsel-approved wording |
| **Oct 2026 pilot** | Reunions, screen volume, partner activation are pilot outcomes — not pre-launch claims |
| **First documented reunion *or* validated near-miss** | Safe to show small honest outcome numbers |
| **Jan 2027 promotion** | DAO targets: 5+ reunion stories, ~15–20 shelters — natural window for auto-updating public dashboard |

Counsel already prefers **quarterly transparency** and **milestone-based pilot success** — not reunion-count marketing guarantees.

---

## Metric-by-metric feasibility

| Metric | Feasibility now | Data source today | When public-safe | Notes / risk |
|--------|-----------------|-------------------|------------------|--------------|
| **Dogs reunited using AI** | Needs instrumentation | `found_dog_reports.status = matched` + approved `match_candidates` — **email explicitly says not confirmed reunion until in-person verify** | After first **staff/owner-confirmed** reunion logged | **Dangerous early:** claiming “matched” as “reunited” overclaims |
| **Dogs screened with AI** | Partial | `pet_vit_runs` (wellness) + identity analyze / enrollment_media / found intake | Post-L5 soft; post-pilot stronger | Define “screened” (ViT wellness vs ID intake vs both). Count unique dogs, not API calls |
| **Shelter partners** | Available (seeded) | `shelters` where `pilot_tier = tn_pilot` (6 seeded) | After **MOU/LOI live**, not seed-only | **Dangerous early:** “6 partners” if none have executed outreach/MOU |
| **Municipal shelters** | Available (seeded) | `shelters.org_type = municipal` (3 of 6) | Same as above | Subset of partners; fine once partners are real |
| **Veteran organizations supported** | Not instrumented | No `veteran_orgs` / give-back distribution table | After first documented give-back or sponsored-seat MOU | Do not invent count from CRM wishlist |
| **Dollars donated** | Not instrumented + counsel-gated | No ledger; Token Shop / affiliate net not auto-split to charity | **After A7 PASS** + first actual distribution (or accrued reserve with counsel-approved disclosure) | Highest legal/marketing risk; illustrative tables ≠ dollars donated |
| **Veterinary referrals generated** | Needs instrumentation | Telehealth/insurance deep-links planned; no referral-event table | After tracking (`utm` / click → booked) ships | Click ≠ referral completed |
| **Microchips registered after AI identification** | Partial / Track 2 lag | `pets.microchip_*`, `chip_scan_events`; “after AI ID” causality not stored | Post–Track 2 / Jan 2027 kit push | Need flag: linked post–biometric enrollment or post–match |
| **Adoption events supported** | Needs new model | `adoption_listings` only — no events calendar | When first co-branded event logged | Easy to overclaim “supported” from listings alone |

### Summary buckets

| Bucket | Metrics |
|--------|---------|
| **Available soon (honest, after activation)** | Shelter partners (MOU-backed), municipal count |
| **After pilot instrumentation** | Dogs screened (defined), microchips linked (with definition), adoption events (if logged) |
| **After first proof** | Dogs reunited (confirmed only) |
| **Needs new systems + A7** | $ donated, veteran orgs supported |
| **Dangerous to claim early** | Reunited, $ donated, partners (seeded), referrals |

---

## Phased roadmap

### Phase 0 — Now (pre-L5 / Jul–Sep 2026) — **recommended**

**Do:**
- Keep this plan as the source of truth
- Framer: refresh `/community-impact` + `/grants` as **commitment + methodology** pages (no live outcome counters)
- Internal: continue using `/ops` + shelter dashboard
- Define KPI dictionary (what counts as reunion, screened, partner, donated)

**Do not:**
- Ship `app…/impact` with zeros or seed partner counts as “impact”
- Automate monthly partner PDFs with empty metrics
- Publish dollar-donated or reunion claims before A7 + proof

**Founder shareable now:** one-pager PDF “How we will measure impact” (targets from DAO §5.6) — not a live dashboard.

### Phase 1 — Post-L5, pre–first reunion (through Oct pilot start)

**Do:**
- Counsel-approved give-back language on Framer + Token Shop
- Add **reunion confirmation** field (e.g. `reunion_confirmed_at` / case note) separate from `matched`
- Partner portal: “Pilot status” (trained staff, enrollments, intakes) — operational, not vanity
- Manual **monthly ops snapshot** for founder (email to self / sheet) — not public

### Phase 2 — Post–first reunion / 90-day checkpoint (≈ late 2026)

**Do:**
- Public Framer or app page showing **only proven metrics** (e.g. 1 reunion story + enrollments + live partners)
- First **partner shareable**: 1–2 page PDF or Notion link (“Q4 Pilot Transparency”) — human-updated
- Case study rights per shelter MOU before naming orgs

### Phase 3 — Jan 2027 promotion — **build live dashboard here**

**Do:**
- `app.freedompawsinc.com/impact` (or embed) with auto-aggregated **safe** counters
- Monthly auto email/PDF to partners (Resend + template) pulling from impact snapshot table
- Framer `/community-impact` embeds or links to app for live numbers; Framer keeps story/SEO
- Target alignment: 5+ reunion stories, ~15–20 shelters, Track 2 chip narrative if real

---

## MVP design (when Phase 2+ starts — not now)

### Show (honest)

- Documented reunions (confirmed count + anonymized story with consent)
- Complete biometric enrollments (network total)
- Active pilot partners (MOU/live only) + municipal subset
- Optional: AI screenings this quarter (with definition footnote)

### Hide until proof / systems

- Dollars donated (until A7 + ledger + first distribution or accrued disclosure)
- Veteran orgs supported (until named partners + support event)
- Vet referrals (until completed-referral tracking)
- “Microchips registered after AI ID” (until causal flag)
- Adoption events (until event log exists)

### Empty-state rule

If a metric is 0, either **omit the tile** or show **“Pilot underway — first update [month]”** — never a flashy zero dashboard.

### Hosting

| Job | Host |
|-----|------|
| Mission story, SEO, grants narrative | **Framer** (`/community-impact`, `/grants`) |
| Live counters, monthly snapshot API | **App** (`app.freedompawsinc.com/impact`) |
| Partner shareable | **Public page link** primary; **PDF export** secondary for email/print |

### Auto-update approach (Phase 3)

1. Nightly or weekly job: aggregate approved metrics → `impact_snapshots` (month, metric, value, source_query)
2. Public page reads latest snapshot only (no raw PII)
3. Resend: first of month → partners@ list with link + optional PDF attachment
4. Human gate: founder/ops “Publish month” toggle so bad data never auto-posts

---

## Risks

| Risk | Mitigation |
|------|------------|
| **Overclaiming** (matched ≠ reunited; seed ≠ partner) | Separate confirmation fields; publish rules in KPI dictionary |
| **Privacy** (owner/pet identifiable stories) | Aggregate counts default; stories only with written consent + shelter approval |
| **Zero / empty dashboard** looks like failure | Omit zeros; narrative Framer first; launch live tiles only after ≥1 proof metric |
| **Give-back legal** | Wait for A7; no “$X donated” until accounting trail |
| **Distraction from L5 / Memphis Email 1** | Phase 0 = docs + Framer copy only; no eng sprint on impact UI |

---

## Implementation outline (defer — Phase 2/3 only)

*Do not implement in app until Phase 2 criteria met.*

1. Migration: `reunion_confirmations`, optional `impact_snapshots`, optional `referral_events` / `adoption_events` / `giveback_distributions`
2. KPI dictionary in `docs/` or `lib/impact/definitions.ts`
3. Read-only `/impact` page + JSON snapshot API (public, no PII)
4. Ops “Publish impact month” control
5. Resend monthly template
6. Framer CTA → app impact; keep `/grants` methodology static

---

## Immediate founder actions (this week)

1. **Accept phased verdict** — no public live KPI build before first proof  
2. **Finish Packet A / A7** before any $ or give-back dashboard language  
3. Optional: update Framer `/community-impact` + `/grants` with **methodology + Oct 2026 pilot targets** (not outcomes)  
4. Optional: add “How we measure success” one-pager for partner Email 1 packets  
5. Revisit build decision at **first confirmed reunion** or **Jan 2027 promotion prep**, whichever comes first with real data  

---

*Not legal advice. Freedom Paws ID is not a government pet license. Match candidates require human review; reunions require in-person verification. Give-back claims subject to counsel-approved eligible-net wording (A7).*
