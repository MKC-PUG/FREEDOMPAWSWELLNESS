# Freedom Paws ID & Chip — Final Sign-Off Checklist

**Document purpose:** Founder sign-off after **v93 deploy** (Track 2 chip UX); remaining ID/chip tasks; full **microchip scanner** and **ViT Pro / VitProScan (DVM)** buildout to completion.

**Created:** June 28, 2026  
**Production app:** https://app.freedompawsinc.com  
**Deploy:** `main` @ **f5cb0b5** · PWA **v93**  
**Founder account:** info@freedompawsinc.com  
**Companion docs:** `docs/Freedom-Paws-Founder-Session-Log-June-2026.md` · `docs/ops/TRACK-2-SCAN-BUILD-SPEC-CLICK-BY-CLICK.md` · `docs/ops/ViT-PRO-BUSINESS-PLAN-AND-ROADMAP-June-2026.md`

**Saved copy:** `~/Documents/Freedom Paws Wellness/Freedom-Paws-ID-Chip-Final-Sign-Off-Checklist-June-2026.md`

---

## Time summary (founder effort)

| Block | Tasks | Est. time |
|-------|--------|-----------|
| **A — v93 post-deploy sign-off** | 12 checks | **~25 min** |
| **B — Track 1 biometric (remaining)** | 4 checks | **~20 min** |
| **C — Track 2 chip scanner (remaining → Jan 2027)** | 18 checks | **~12–20 hrs** (spread over months) |
| **D — ViT Pro / VitProScan DVM (→ Q1 2027+)** | 22 checks | **~40–80 hrs** (advisor-dependent) |
| **E — Launch gates (legal / public)** | 5 checks | **Counsel timeline** |

---

## A. v93 post-deploy sign-off (do today)

**Goal:** Confirm **v93** is live on iPhone PWA. Refresh app until banner shows **v93** or hard-reload Safari.

| ☐ | # | Task | Route / action | Time | Pass criteria | Done |
|---|-----|------|----------------|------|---------------|:----:|
| ☐ | A1 | PWA version | Home or any page footer | 1 min | Shows **v93** | ☐ |
| ☐ | A2 | Chip on ID settings | `/id/settings` | 2 min | Buddy test shows microchip **985141007711681** + link date | ☐ |
| ☐ | A3 | Chip on My Pets | `/mypets` | 2 min | Buddy card: microchip line + **Chip linked ✓** | ☐ |
| ☐ | A4 | Re-scan internal match | `/id/scan` → paste `985141007711681` | 3 min | **Freedom Paws match** · FP-A6FFE6CD · settings + AAHA links | ☐ |
| ☐ | A5 | AAHA lookup flow | `/id/lookup` | 3 min | Validate → **Open AAHA Microchip Lookup** opens new tab | ☐ |
| ☐ | A6 | Found intake hint | `/id/found` | 2 min | Yellow “Optional first step: scan microchip” banner | ☐ |
| ☐ | A7 | ID hub cards | `/id` | 2 min | **Microchip Scan** + **Registry Lookup** both **Live** | ☐ |
| ☐ | A8 | JAX-TEST no false chip | `/mypets` → JAX-TEST | 1 min | No chip line (unless you linked one) · **Scan chip →** shown | ☐ |
| ☐ | A9 | QR pet card | Match panel → QR link | 2 min | `/id/p/[slug]` loads for Buddy | ☐ |
| ☐ | A10 | Track 1 regression | `/id/enroll` hub loads | 2 min | No 500 errors; hub cards render | ☐ |
| ☐ | A11 | Found intake (quick) | `/id/found` → photo + submit | 5 min | Candidates return (FP-A6FFE6CD in top matches) | ☐ |
| ☐ | A12 | Log sign-off | Session log or this doc | 2 min | Date + initials on Section A | ☐ |

**Section A total:** ~**25 min**

**Sign-off:** ☐ Section A complete — Date: __________ Founder: __________

---

## B. Track 1 — Biometric ID (unchipped reunion)

**Status:** Core E2E **PASS** June 27–28, 2026. Remaining = pilot ops + legal.

| ☐ | # | Task | Time | Pass criteria | Done |
|---|-----|------|------|---------------|:----:|
| ☑ | B1 | 9-step enroll wizard | — | FP-A6FFE6CD issued | ✅ |
| ☑ | B2 | Found → match → owner email | — | E2E PASS New Leash on Life | ✅ |
| ☑ | B3 | ViT identity bridge (v89–90) | — | `/diagnostics?mode=identity` + enroll bridge | ✅ |
| ☐ | B4 | Revoke duplicate Buddy enrollment (optional) | 5 min | FP-2D1F1AF0 revoked in `/id/settings` if desired | ☐ |
| ☐ | B5 | Biometric consent attorney sign-off | Counsel | Template approved before public marketing | ☐ |
| ☐ | B6 | TN shelter pilot: 1 live listing + found test | 30 min | Partner org publishes listing; found intake logged | ☐ |
| ☐ | B7 | Shelter outreach Email 1 (post L5) | 20 min | One org after attorney gate | ☐ |

**Section B remaining founder time:** ~**55 min** (+ counsel)

---

## C. Track 2 — Microchip scanner (owner / shelter → completion)

**Target:** Pilot Q3–Q4 2026 · Retail kit **Jan 1, 2027** · Full promotion **Feb 1, 2027**

### C1. Completed (sign-off record)

| ☑ | # | Milestone | Date | Ref |
|---|-----|-----------|------|-----|
| ☑ | C1.1 | WorldScan Plus hardware Day 1 | Jun 28, 2026 | Session log §4 |
| ☑ | C1.2 | Migration `014_microchip_track2.sql` | Jun 28, 2026 | Supabase |
| ☑ | C1.3 | `/id/scan` MVP (validate, link, lookup) | v91–v92 | |
| ☑ | C1.4 | Production validate + link + FP match | Jun 28, 2026 | Buddy · FP-A6FFE6CD |
| ☑ | C1.5 | Phase 2a UX (settings, My Pets, lookup) | v93 | f5cb0b5 |

### C2. Remaining — founder QA (optional / short)

| ☐ | # | Task | Time | Pass criteria | Done |
|---|-----|------|------|---------------|:----:|
| ☐ | C2.1 | HID wedge on Windows (WorldScan) | 10 min | Scan types into `/id/scan` field (not paste) | ☐ |
| ☐ | C2.2 | Web Serial @ 9600 (Chrome Windows) | 15 min | Connect USB serial → scan populates field | ☐ |
| ☑ | C2.3 | PetScanner BLE arrives → paste path | 10 min | Copy from vendor app → validate in Freedom Paws | ✅ |

**C2 subtotal:** ~**35 min** (when hardware available)

### C3. Remaining — business / registry

| ☐ | # | Task | Time | Pass criteria | Done |
|---|-----|------|------|---------------|:----:|
| ☐ | C3.1 | Email AAHA partnership inquiry | 20 min | Sent to petmicrochiplookup@aaha.org | ☐ |
| ☐ | C3.2 | AAHA response logged + counsel review | 1–4 wks wait | Terms for embed/API documented | ☐ |
| ☐ | C3.3 | Attorney: chip + registry disclaimer copy | Counsel | `/id/lookup` + `/id/scan` footers approved | ☐ |
| ☐ | C3.4 | Register **vitproscan.com** redirect (DVM marketing) | 15 min | 301 → `/vit-pro` (post-launch DNS) | ☐ |

### C4. Remaining — engineering (shelter / product)

| ☐ | # | Task | Est. eng | Pass criteria | Done |
|---|-----|------|----------|---------------|:----:|
| ☐ | C4.1 | Integrated “scan chip first” step in `/id/found` | 2–4 hr | Scan → match/no-match → then photo intake | ☐ |
| ☐ | C4.2 | Chip field on enroll wizard (optional step) | 2–3 hr | Post-review: link chip without leaving enroll | ☐ |
| ☐ | C4.3 | Shelter role: scan log on partner portal | 4–8 hr | `chip_scan_events` visible to shelter staff | ☐ |
| ☐ | C4.4 | AAHA API embed (if partnership approved) | 1–2 wk | In-app registry result (no owner PII) | ☐ |
| ☐ | C4.5 | BLE native reader (PetScanner path) | 1–2 wk | If HID insufficient for pilot partners | ☐ |
| ☐ | C4.6 | `/id/kit` Token Shop SKU + waitlist | 1 wk | Retail scanner kit ~$129 pre-order | ☐ |
| ☐ | C4.7 | 3+ pilot shelters trained on scan + found | Founder GTM | Documented in CRM | ☐ |

### C5. Retail scanner kit completion (Jan 2027)

| ☐ | # | Task | Time / eng | Pass criteria | Done |
|---|-----|------|------------|---------------|:----:|
| ☐ | C5.1 | Finalize OEM reader @ ~$85 COGS | 2–4 wk sourcing | BOM locked per retail kit plan | ☐ |
| ☐ | C5.2 | Branded box + quick-start + QR card | 1–2 wk design | QR → `/id/scan` | ☐ |
| ☐ | C5.3 | 2 free scanners / qualifying shelter | Ongoing | DPA + staff trained | ☐ |
| ☐ | C5.4 | Token Shop checkout for kit | Eng 1 wk | Purchase → ship workflow | ☐ |
| ☐ | C5.5 | Jan 2027 promotion launch | — | “Unchipped isn’t unseen” campaign live | ☐ |

**Track 2 completion gate:** ☐ All C2–C5 checked · Date: __________

---

## D. ViT Pro / VitProScan — DVM buildout to completion

**Brand:** **VitProScan** (marketing) · **ViT Pro** (product at `/vit-pro`)  
**Domain:** vitproscan.com → `app.freedompawsinc.com/vit-pro` (redirect when DNS wired)  
**Audience:** Licensed veterinarians & advisors — **not** public Framer marketing  
**Status:** **V0 foundation shipped** (~85% per founder schedule)

### D1. V0 foundation — maintain (complete / verify)

| ☐ | # | Task | Time | Pass criteria | Done |
|---|-----|------|------|---------------|:----:|
| ☐ | D1.1 | `VIT_PRO_ENABLED=true` on production | 5 min | `/vit-pro` loads for advisor email | ☐ |
| ☐ | D1.2 | Advisor email in `VIT_PRO_ADVISOR_EMAILS` | 5 min | info@freedompawsinc.com or DVM test account | ☐ |
| ☐ | D1.3 | CDS Analyze run | 15 min | `/vit-pro/analyze` → Tier B vet report generates | ☐ |
| ☐ | D1.4 | Corpus browser | 10 min | `/vit-pro/corpus` — RAG chunks visible | ☐ |
| ☐ | D1.5 | Benchmark page loads | 5 min | `/vit-pro/benchmark` — cases template accessible | ☐ |
| ☐ | D1.6 | Run `npm run vit-pro:benchmark` | 30 min | Results saved for advisor review | ☐ |
| ☐ | D1.7 | Read business plan | 45 min | `docs/ops/ViT-PRO-BUSINESS-PLAN-AND-ROADMAP-June-2026.md` | ☐ |

**D1 subtotal:** ~**2 hr**

### D2. Advisor bench (Phase 1 — no SaMD claims)

| ☐ | # | Task | Time | Pass criteria | Done |
|---|-----|------|------|---------------|:----:|
| ☐ | D2.1 | Identify 2–3 licensed advisor DVMs | 2–4 hr | Names + NDAs signed | ☐ |
| ☐ | D2.2 | Send training manual PDF | 30 min | Advisor has onboarding pack | ☐ |
| ☐ | D2.3 | First advisor demo (screen share) | 1 hr | Walk through analyze + benchmark | ☐ |
| ☐ | D2.4 | Document 10 structured benchmark cases | 4–8 hr | With advisor; photos + expected rubric | ☐ |
| ☐ | D2.5 | Expand to 50-photo benchmark target | 2–4 wk | 50/50 cases with images per KPI | ☐ |
| ☐ | D2.6 | Advisor feedback → Tier A/B tuning | Ongoing | Changelog in benchmark notes | ☐ |
| ☐ | D2.7 | **No** public Framer page for ViT Pro | — | Manual onboarding only until packaging | ☐ |

**D2 subtotal:** ~**15–25 hr** (spread 4–8 weeks)

### D3. VitProScan packaging (Phase 2 — 3–6 months)

| ☐ | # | Task | Time | Pass criteria | Done |
|---|-----|------|------|---------------|:----:|
| ☐ | D3.1 | Trademark consult: **VIT PRO** / **VITPROSCAN** | Counsel | Class 42/44 filing decision | ☐ |
| ☐ | D3.2 | Wire vitproscan.com → `/vit-pro` | 15 min | 301 redirect live | ☐ |
| ☐ | D3.3 | DVM one-pager PDF (VitProScan) | 2–4 hr | CDS scope, not diagnosis disclaimer | ☐ |
| ☐ | D3.4 | B2B Terms addendum (vet use) | Counsel | Separate from consumer Terms | ☐ |
| ☐ | D3.5 | Standalone SKUs / pricing defined | 2 hr | Per business plan | ☐ |
| ☐ | D3.6 | VeNom / synonym expansion (eng) | 2–4 wk | Improved coded output | ☐ |
| ☐ | D3.7 | Vet association intro (when funded) | 2–4 hr | One conversation logged | ☐ |

**D3 subtotal:** ~**10–20 hr** + counsel

### D4. DVM + chip scanner integration (clinic workflow)

*Combines Track 2 hardware with ViT Pro at vet clinics.*

| ☐ | # | Task | Time / eng | Pass criteria | Done |
|---|-----|------|------------|---------------|:----:|
| ☐ | D4.1 | Clinic SOP: scan chip → VitProScan CDS if needed | 1 hr doc | One-page workflow for DVMs | ☐ |
| ☐ | D4.2 | `/vit-pro` link from scan match (staff view) | Eng 2–4 hr | After FP internal match, optional CDS handoff | ☐ |
| ☐ | D4.3 | WorldScan at clinic: HID into `/id/scan` | 15 min QA | Same as C2.1 at vet desktop | ☐ |
| ☐ | D4.4 | AAHA lookup from clinic ( `/id/lookup` ) | 5 min | Staff trained on external registry step | ☐ |
| ☐ | D4.5 | Audit log review for clinic scans | 30 min | `chip_scan_events` query documented | ☐ |

**D4 subtotal:** ~**3–5 hr** founder + eng

### D5. Funded scale (Phase 3 — post–Sep 2026 capital)

| ☐ | # | Task | Pass criteria | Done |
|---|-----|------|---------------|:----:|
| ☐ | D5.1 | Paid pilot with 1 clinic or telehealth partner | Contract + 90-day usage | ☐ |
| ☐ | D5.2 | Practice seats / API metering | Billing model live | ☐ |
| ☐ | D5.3 | Clinical validation roadmap (not SaMD short-cut) | Document with counsel | ☐ |
| ☐ | D5.4 | ViT Pro production launch alongside Freedom Paws public brand | Coordinated comms | ☐ |
| ☐ | D5.5 | VitProScan conference / CE outreach | 1 event or webinar | ☐ |

### D6. ViT Pro / VitProScan completion gate

**Definition of “DVM buildout complete” for pilot:**

- [ ] 2+ advisor DVMs active on benchmark  
- [ ] 50/50 benchmark cases with images  
- [ ] B2B Terms addendum signed off  
- [ ] vitproscan.com live → `/vit-pro`  
- [ ] 1 paid or pilot clinic using scan + CDS workflow  
- [ ] No consumer marketing claims beyond CDS scope  

**Sign-off:** ☐ Section D pilot complete — Date: __________

**Full commercial scale:** Section D5 + revenue targets (Q2 2027+)

---

## E. Launch gates still open (blocks public mode)

| ☐ | Gate | Owner | Status |
|---|------|-------|--------|
| ☑ | L1 ViT iPhone prod | Founder | Done |
| ☑ | L2 Photo Booth sign-off | Founder | Done |
| ☑ | L3–L4 Framer | Founder | Done |
| ☑ | L6 Copyright filed | Founder | Done (Jun 24, 2026) |
| ☑ | L7 Adoption E2E | Founder | Done |
| ☑ | L8 Build/deploy | Eng | Done (v93) |
| ☐ | **L5 Terms + Privacy (attorney)** | Counsel | **Open — critical path** |
| ☐ | `SITE_MODE=public` | Founder | After L5 |
| ☐ | Partner outreach at scale | Founder | After L5 |

---

## F. Quick reference URLs

| Purpose | URL |
|---------|-----|
| ID hub | https://app.freedompawsinc.com/id |
| Microchip scan | https://app.freedompawsinc.com/id/scan |
| AAHA / AVID lookup | https://app.freedompawsinc.com/id/lookup |
| Found intake | https://app.freedompawsinc.com/id/found |
| ID settings | https://app.freedompawsinc.com/id/settings |
| ViT Pro (DVM) | https://app.freedompawsinc.com/vit-pro |
| VitProScan redirect (future) | https://vitproscan.com → `/vit-pro` |
| AAHA external | https://www.petmicrochiplookup.org/ |
| Test chip ID | `985141007711681` |
| Demo enrollment | **FP-A6FFE6CD** (Buddy test) |

---

## G. Master sign-off (final)

| Section | Complete | Date |
|---------|:--------:|------|
| A — v93 post-deploy | ☐ | |
| B — Track 1 remaining | ☐ | |
| C — Track 2 scanner to Jan 2027 | ☐ | |
| D — ViT Pro / VitProScan DVM | ☐ | |
| E — Launch gates (L5 public) | ☐ | |

**Overall ID / chip program sign-off for October 2026 biometric pilot:**

☐ **Approved for TN shelter pilot** (Track 1 + Track 2 internal chip link)  
☐ **Not yet approved for retail scanner kit or DVM commercial launch**

Founder signature: _________________________ Date: __________

---

*Freedom Paws ID is not a government pet license. Not veterinary advice. Match and registry flows require human review. Phones do not read implanted microchips without hardware scanner (Track 2). ViT Pro is clinical decision support for licensed professionals — not a diagnosis.*
