# Freedom Paws Wellness
# Remaining Work — Master Checklist (Build → Launch → Running Business)

**Version:** July 3, 2026  
**Purpose:** Single printable list of **everything left** to complete the project (all builds), launch publicly, scale post-launch, and **operate the business** on a recurring schedule.

**Companion (what’s done):** `Freedom-Paws-Completed-Items-Master-Record-Through-July-2026.md`  
**Repo copy:** `freedompaws-app/docs/Freedom-Paws-Remaining-Work-Master-Checklist-July-2026.md`  
**Production:** https://app.freedompawsinc.com · **PWA v96**

**Rule:** Work phases in order where dependencies exist. **L5 (attorney)** blocks public mode and scaled partner outreach.

---

## Document map

| Phase | What | Est. |
|-------|------|------|
| **0** | Critical path NOW (legal, AAHA, first partner) | 2–6 wks |
| **1** | Track 1 biometric — remaining pilot ops | ~1 hr + counsel |
| **2** | Track 2 chip — pilot → retail kit Jan 2027 | 12–20 hr spread |
| **3** | Launch gates (ViT, Photo Booth, Monitor, Framer, payments) | 4–12 wks eng |
| **4** | ViT Pro / VitProScan DVM buildout | 40–80 hr + counsel |
| **5** | Entity, payments, membership, public mode | Counsel + eng |
| **6** | Grants & growth capital | 90-day calendar |
| **7** | Post-launch marketing & TN pilot expansion | Oct 2026–Jan 2027 |
| **8** | Long-term product (optional / scale) | 2027+ |
| **9** | **Running the business** — daily / weekly / monthly / quarterly | Ongoing |

---

# PHASE 0 — Critical path NOW (print & check)

*Source: `Freedom-Paws-Critical-Path-Action-Packets-June-2026.md`*

### Packet A — L5 + B5 Legal (**blocks everything public**)

| ☐ | # | Task | Owner | Pass criteria |
|---|-----|------|-------|---------------|
| ☐ | A1 | Pick counsel | Founder | Retainer or flat-fee scope agreed |
| ☐ | A2 | Send attorney packet (Terms, Privacy, consent, binders, screenshots) | Founder | Email + PDFs sent |
| ☐ | A3 | Terms sign-off | Counsel | Written approval |
| ☐ | A4 | Privacy sign-off | Counsel | Written approval |
| ☐ | A5 | Biometric consent v2026-06-10 sign-off | Counsel | B5 complete |
| ☐ | A6 | ViT / CDS / chip disclaimer copy | Counsel | `/diagnostics`, `/id/scan`, `/id/lookup` |
| ☐ | A7 | 10% give-back claim review | Counsel | Framer + app |
| ☐ | A8 | Deploy approved legal text | Eng | `lib/legal/content.ts` updated |
| ☐ | A9 | Verify `/terms` + `/privacy` on iPhone | Founder | |
| ☐ | A10 | Save counsel PDF → Legal folder | Founder | **L5 GATE CLEARED** |

### Packet B — AAHA (parallel with A)

| ☐ | # | Task | Pass criteria |
|---|-----|------|---------------|
| ☐ | B1 | Email **petmicrochiplookup@aaha.org** | Sent from info@ |
| ☐ | B2 | Log date in session log | |
| ☐ | B3 | Follow-up +14 days if no reply | |
| ☐ | B4 | Counsel reviews any AAHA terms | Before API embed |

### Packet C — First partner (after A10)

| ☐ | # | Task | Pass criteria |
|---|-----|------|---------------|
| ☐ | C1 | Memphis in `/ops/adoption` | TN pilot card ready |
| ☐ | C2 | Email 1 from **shelter@** | Manual send |
| ☐ | C3 | 20-min onboarding call | shelter_admin created |
| ☐ | C4 | First **Available** listing live | Public `/adopt/tn/...` |
| ☐ | C5 | Pilot LOI (counsel-approved) | Signed PDF |
| ☐ | C6 | Optional found-dog test with partner | B6 |

### Packet D — Public launch (after L5)

| ☐ | # | Task | Pass criteria |
|---|-----|------|---------------|
| ☐ | D1 | `NEXT_PUBLIC_SITE_MODE=public` on Vercel | Indexing allowed |
| ☐ | D2 | Framer publish + indexing | |
| ☐ | D3 | Staggered TN pilot Email 1 (5 remaining orgs) | CRM logged |
| ☐ | D4 | Waitlist / social launch post #1 | |

**Phase 0 gate:** ☐ A10 + C4 + D1 complete · Date: __________

---

# PHASE 1 — Track 1 biometric (unchipped reunion)

*Build: ~95% done. Remaining = ops + legal.*

| ☐ | # | Task | Est. | Notes |
|---|-----|------|------|-------|
| ☑ | B1 | 9-step enroll wizard | — | FP-A6FFE6CD, FP-B9B377D6 |
| ☑ | B2 | Found → match → owner email E2E | — | Jun 27 |
| ☑ | B3 | ViT identity bridge v89–96 | — | Smoke Tests 1–4 PASS Jul 1 |
| ☐ | B4 | Revoke duplicate FP-2D1F1AF0 (optional) | 5 min | `/id/settings` |
| ☐ | B5 | Biometric consent attorney sign-off | Counsel | = Packet A5 |
| ☐ | B6 | TN shelter: live listing + found test | 30 min | With partner after C4 |
| ☐ | B7 | Shelter outreach Email 1 at scale | 20 min/org | After L5; n8n stays off |

**Phase 1 gate:** ☐ B5 + B6 + one municipal partner listing · Date: __________

---

# PHASE 2 — Track 2 microchip scanner

*Pilot MVP live. Retail kit target Jan 1, 2027.*

### C2 — Founder hardware QA

| ☐ | # | Task | Done |
|---|-----|------|:----:|
| ☑ | C2.1 | HID wedge WorldScan → `/id/scan` field | ✅ Jul 4 |
| ☑ | C2.2 | Web Serial @ 9600 Chrome Windows | ✅ Jul 4 |
| ☑ | C2.3 | PetScanner BLE → paste path | ✅ Jul 3 |

### C3 — Business / registry

| ☐ | # | Task |
|---|-----|------|
| ☐ | C3.1 | AAHA partnership email (= Packet B) |
| ☐ | C3.2 | AAHA response + counsel review |
| ☐ | C3.3 | Attorney: chip + registry disclaimers |
| ☐ | C3.4 | **vitproscan.com** → `/vit-pro` redirect (DNS) |

### C4 — Engineering (shelter / product)

| ☐ | # | Task | Est. eng |
|---|-----|------|----------|
| ☐ | C4.1 | “Scan chip first” integrated in `/id/found` | 2–4 hr |
| ☐ | C4.2 | Optional chip step on enroll wizard | 2–3 hr |
| ☐ | C4.3 | Shelter scan log on partner portal | 4–8 hr |
| ☐ | C4.4 | AAHA API embed (if partnership approved) | 1–2 wk |
| ☐ | C4.5 | BLE native PetScanner (if paste insufficient) | 1–2 wk |
| ☐ | C4.6 | `/id/kit` Token Shop SKU + waitlist | 1 wk |
| ☐ | C4.7 | Train 3+ pilot shelters on scan + found | Founder GTM |

### C5 — Retail scanner kit (Jan 2027)

| ☐ | # | Task |
|---|-----|------|
| ☐ | C5.1 | OEM reader @ ~$85 COGS locked |
| ☐ | C5.2 | Branded box + quick-start + QR → `/id/scan` |
| ☐ | C5.3 | 2 free scanners / qualifying shelter (DPA) |
| ☐ | C5.4 | Token Shop checkout + ship workflow |
| ☐ | C5.5 | Jan 2027 “Unchipped isn’t unseen” campaign |

**Phase 2 gate:** ☐ C3 + C4.7 + C5.5 · Date: __________

---

# PHASE 3 — Launch gates (member-ready product)

*Definition of public launch — all 9 must be true (Launch Master Checklist §14).*

| # | Criterion | Status Jul 3 | Remaining tasks |
|---|-----------|--------------|-----------------|
| 1 | **ViT** prod + weekly admin queue | 🟢 | Weekly `/admin/symptoms` SOP; L5 copy |
| 2 | **Photo Booth** sign-off + Phase 4 assets | 🟡 | Canva JPGs; deploy Phase 4 if not done |
| 3 | **My Pets** profiles + vault | 🟢 | Server protocol unlocks (Phase 5) |
| 4 | **Monitor** cloud relay for members | 🔴 | VPS/relay architecture; member wizard |
| 5 | **Framer + app** CTAs tested | 🟡 | Framer pass; deep links; ID toolbox page |
| 6 | **Track 2** scan MVP + chip on profile | 🟢 | C4.x enhancements optional for v1 |
| 7 | **Legal** counsel Terms/Privacy/consent | 🔴 | Phase 0 Packet A |
| 8 | **Payments** durable unlocks + membership | 🔴 | Stripe webhook; server unlocks |
| 9 | **Public** `SITE_MODE=public` | 🔴 | After #7 |

### Track A — ViT (remaining eng)

| ☐ | Task |
|---|------|
| ☐ | ViT Phase 3: persistent upload storage |
| ☐ | Admin dashboard: vision vs lexicon disagreement |
| ☐ | ViT analyze metering / credits (optional) |
| ☐ | VeNom / clinical synonym expansion |

### Track B — Photo Booth (remaining)

| ☐ | Task |
|---|------|
| ☐ | Phase 4 holiday + landmark JPG assets in `public/images/photobooth/` |
| ☐ | iPhone sign-off checklist (themes, cutout, credits, share) |
| ☐ | Auto-suggest magic cutout; live camera pipeline (optional) |

### Track C — My Pets (remaining)

| ☐ | Task |
|---|------|
| ☐ | Server-side protocol unlocks (cross-device) |
| ☐ | Protocol tracking per pet |
| ☐ | NFT gallery / XRPL display (optional launch) |
| ☐ | Cloud vault IPFS (post-launch) |

### Track D — Monitor cloud relay (**launch blocker**)

| ☐ | # | Task |
|---|-----|------|
| ☐ | D1 | Pick relay host (VPS or LiveKit/Mux) |
| ☐ | D2 | Relay service + TLS |
| ☐ | D3 | Ingest API (encrypted RTSP URLs) |
| ☐ | D4 | Playback API (signed WebRTC/HLS tokens) |
| ☐ | D5 | Member setup wizard (no Mac/tunnel) |
| ☐ | D6 | Member docs replace founder tunnel steps |
| ☐ | D7 | Membership gate for live view |
| ☐ | D8 | Privacy/Terms stream policy |
| ☐ | D9 | Load test ~10 concurrent streams |

### Track E — Framer + app integration

| ☐ | Task |
|---|------|
| ☐ | All tool CTAs → app deep links |
| ☐ | ID & Tool Box page (Section 14) — soften claims per counsel |
| ☐ | Monthly protocol name/price sync Framer ↔ app |
| ☐ | Defensive redirects: freedompawz.com, vitproscan.com |

### Track F — Already accelerated (Track 2 in Phase 2)

*See Phase 2 above.*

**Phase 3 gate:** ☐ All 9 launch criteria green · Date: __________

---

# PHASE 4 — ViT Pro / VitProScan (DVM line)

*Brand: **VitProScan** · Product: `/vit-pro` · Not consumer marketing until packaged.*

### D1 — V0 foundation (verify)

| ☐ | # | Task |
|---|-----|------|
| ☐ | D1.1 | `VIT_PRO_ENABLED=true` production |
| ☐ | D1.2 | Advisor emails in `VIT_PRO_ADVISOR_EMAILS` |
| ☐ | D1.3 | `/vit-pro/analyze` Tier B report |
| ☐ | D1.4 | `/vit-pro/corpus` RAG browser |
| ☐ | D1.5 | `/vit-pro/benchmark` loads |
| ☐ | D1.6 | Run `npm run vit-pro:benchmark` |
| ☐ | D1.7 | Read `ViT-PRO-BUSINESS-PLAN-AND-ROADMAP-June-2026.md` |

### D2 — Advisor bench (Phase 1)

| ☐ | # | Task |
|---|-----|------|
| ☐ | D2.1 | Identify 2–3 licensed advisor DVMs + NDAs |
| ☐ | D2.2 | Send vet portal training manual PDF |
| ☐ | D2.3 | First advisor demo (analyze + benchmark) |
| ☐ | D2.4 | 10 structured benchmark cases |
| ☐ | D2.5 | Expand to 50-photo benchmark |
| ☐ | D2.6 | Advisor feedback → Tier A/B tuning |
| ☐ | D2.7 | **No** public Framer page until D3 |

### D3 — VitProScan packaging (Phase 2)

| ☐ | # | Task |
|---|-----|------|
| ☐ | D3.1 | Trademark: VIT PRO / VITPROSCAN (counsel) |
| ☐ | D3.2 | vitproscan.com → `/vit-pro` live |
| ☐ | D3.3 | DVM one-pager PDF (CDS scope, not diagnosis) |
| ☐ | D3.4 | B2B Terms addendum (vet use) |
| ☐ | D3.5 | Standalone SKUs / pricing |
| ☐ | D3.6 | VeNom / synonym expansion (eng) |
| ☐ | D3.7 | Vet association intro (when funded) |

### D4 — DVM + chip scanner clinic workflow

| ☐ | # | Task |
|---|-----|------|
| ☐ | D4.1 | Clinic SOP: scan → VitProScan CDS if needed |
| ☐ | D4.2 | `/vit-pro` link from scan match (staff view) |
| ☐ | D4.3 | WorldScan HID at clinic desktop |
| ☐ | D4.4 | Staff trained on `/id/lookup` AAHA step |
| ☐ | D4.5 | `chip_scan_events` audit query documented |

### D5 — Funded scale (Phase 3 — post Sep 2026 capital)

| ☐ | # | Task |
|---|-----|------|
| ☐ | D5.1 | Paid pilot with 1 clinic or telehealth partner |
| ☐ | D5.2 | Practice seats / API metering + billing |
| ☐ | D5.3 | Clinical validation roadmap (counsel; not SaMD shortcut) |
| ☐ | D5.4 | ViT Pro launch coordinated with public brand |
| ☐ | D5.5 | VitProScan CE / conference outreach |

**DVM pilot complete when:** 2+ advisor DVMs · 50/50 benchmark · B2B Terms · vitproscan.com live · 1 clinic using scan + CDS · no consumer diagnosis claims.

**Phase 4 gate:** ☐ D6 pilot sign-off · Date: __________

---

# PHASE 5 — Entity, payments, membership

| ☐ | # | Task |
|---|-----|------|
| ☐ | P1 | LLC good standing confirmed (Wyoming) |
| ☐ | P2 | Trademark filings (Freedom Paws, SuperBud, ViT Pro) |
| ☐ | P3 | Stripe webhook → server protocol unlock |
| ☐ | P4 | AI credit Stripe packs → `ai_credits_grant()` |
| ☐ | P5 | Guest → user credit merge on login |
| ☐ | P6 | RLUSD button (`XRPL_RLUSD_ISSUER`) |
| ☐ | P7 | Core membership tier (Monitor relay + premium) |
| ☐ | P8 | Founding member / waitlist coupon codes |
| ☐ | P9 | 10% give-back at checkout (counsel-cleared) |
| ☐ | P10 | Insurance / affiliate outreach kits (post-L5) |

---

# PHASE 6 — Grants & growth capital

*Full detail: `Freedom-Paws-Grants-Growth-Capital-Master-June-2026.md`*

| ☐ | # | Funder / program | When |
|---|-----|------------------|------|
| ☐ | G1 | XRPL Grants ($25K watch) | When 2026 cycle opens |
| ☐ | G2 | Petco Love | Post-L7 + L5 |
| ☐ | G3 | Maddie's Fund | Post-L7 + L5 |
| ☐ | G4 | ASPCA grants scan | Q3 2026 |
| ☐ | G5 | Supabase startup credits | Jul 2026 |
| ☐ | G6 | OpenAI startup credits | Jul 2026 |
| ☐ | G7 | Google for Startups | Aug 2026 |
| ☐ | G8 | Veteran org partnership (in-kind) | Post-L5 |
| ☐ | G9 | Pre-seed angel conversation | Sep 2026 target |

**90-day calendar:** See Grants Master Compartment F (Jul–Sep 2026).

---

# PHASE 7 — Post-launch marketing & expansion

**Target milestones:** Oct 2026 TN biometric pilot · Jan 2027 full promotion

| ☐ | # | Task |
|---|-----|------|
| ☐ | M1 | Email drip (ConvertKit / Mailchimp) wired to waitlist |
| ☐ | M2 | 5–10 beta testers per module documented |
| ☐ | M3 | Coordinated Framer + app launch day |
| ☐ | M4 | TN pilot: 6 orgs → Email 1 staggered (manual) |
| ☐ | M5 | 3+ shelters with live listings + LOI |
| ☐ | M6 | First reunion PR story (with partner consent) |
| ☐ | M7 | Veteran give-back transparency post (Framer `/grants`) |
| ☐ | M8 | Partner acquisition: holistic vets, indie retail QR | 
| ☐ | M9 | `npm run marketing:crm-export` weekly during pilot |
| ☐ | M10 | Regenerate binder PDFs quarterly for grants |

*Detail: `Freedom-Paws-Master-Marketing-Network-Plan-June-2026.md`*

---

# PHASE 8 — Long-term product (2027+)

*Not launch blockers — schedule after revenue / grants.*

| ☐ | Area | Task |
|---|------|------|
| ☐ | ViT | Custom model / clinical validation path |
| ☐ | ID | Premium ID protection subscription ($2.99/mo) |
| ☐ | ID | IPFS cloud vault for pet records |
| ☐ | Photo Booth | Phase 3.5 live camera → AI; share card + QR |
| ☐ | Monitor | Multi-camera; cloud DVR (optional) |
| ☐ | Shop | Full Stripe + RLUSD parity; server unlocks all devices |
| ☐ | Ops | n8n Workflow D outreach (only after public mode + counsel) |
| ☐ | IP | Patent strategy execution (see Patent Master Guide) |
| ☐ | CA expansion | Adoption network beyond TN pilot |

---

# PHASE 9 — Running the business (after build complete)

*Use this section once Phases 0–3 gates are met and you are in **public pilot / operating mode**.*

---

## 9A — Daily duties (~15–20 min)

| ☐ | Task | Where / how |
|---|------|-------------|
| ☐ | Check **match queue** — pending found reports | `/id/match` or `/ops` |
| ☐ | Check **adoption listings** — new drafts vs Available | `/ops/adoption` |
| ☐ | Vercel dashboard — last deploy green | vercel.com |
| ☐ | Resend / email — bounces or shelter replies | info@ · shelter@ |
| ☐ | Monitor API spend spike (OpenAI) | Vercel + OpenAI dashboard |
| ☐ | PWA update banner — refresh if critical fix shipped | iPhone test |

**Daily gate:** ☐ No unreviewed **urgent** match >24 hr · Date: __________

---

## 9B — Weekly duties (~1–2 hr)

| ☐ | Task | When | Detail |
|---|------|------|--------|
| ☐ | **Symptom lexicon admin queue** | Mon or Fri | `/admin/symptoms` → approve → `npm run symptom:merge` → deploy if changed |
| ☐ | **Partner follow-up** | Wed | `/ops/adoption` — orgs with 0 listings → email/call |
| ☐ | **CRM / outreach log** | Fri | Update TN pilot sheet; Email 1/2/3 status |
| ☐ | **ViT Pro benchmark** | If advisor active | `npm run vit-pro:benchmark`; note in advisor log |
| ☐ | **Grant / investor metrics** | Fri | Update 1-page KPI: enrollments, listings, matches |
| ☐ | **Security spot-check** | Rotating | Supabase auth logs; no orphan fp_ops accounts |
| ☐ | **Backup session log** | Fri | Append wins/blockers to Founder Session Log |

---

## 9C — Monthly duties (~half day)

| ☐ | Task | Detail |
|---|------|--------|
| ☐ | **Financial reconcile** | Token Shop treasury · Vercel · Supabase · OpenAI burn |
| ☐ | **Legal/compliance** | Any counsel follow-ups; Terms/Privacy still current |
| ☐ | **Framer ↔ app sync** | 10 protocol names + prices; test 3 deep links |
| ☐ | **Binder PDF refresh** | `npm run binders:pdf` for grants/partners |
| ☐ | **Partner pipeline review** | Memphis + 5 TN orgs; grant exhibit screenshots |
| ☐ | **ViT admin analytics** | Top symptoms; misfires; queue depth trend |
| ☐ | **Monitor relay costs** | When live — VPS invoice vs member count |
| ☐ | **Trademark / IP monitor** | USPTO TSDR if filings active |
| ☐ | **Give-back accrual** | Log eligible net (even if payout later) |

---

## 9D — Quarterly duties (~1 day)

| ☐ | Task | Detail |
|---|------|--------|
| ☐ | **Pilot metrics report** | Enrollments, matches, listings, ViT runs — for grants/board |
| ☐ | **Roadmap reprioritize** | Update this checklist; archive completed to Master Record |
| ☐ | **Security review** | Rotate API keys if needed; review RLS policies |
| ☐ | **Shelter training refresh** | PDF manual; 20-min call with lowest-usage partner |
| ☐ | **ViT Pro advisor session** | Benchmark review; CDS copy tuning |
| ☐ | **Marketing content batch** | 3 Reels + 1 adoption story (per Marketing Plan) |
| ☐ | **Grant applications wave** | Petco / Maddie's / XRPL as windows open |
| ☐ | **LLC annual report** | Wyoming + any state foreign qualification |

---

## 9E — Annual duties

| ☐ | Task | Detail |
|---|------|--------|
| ☐ | **Full legal review** | Terms, Privacy, biometric, B2B addendum, give-back |
| ☐ | **Insurance review** | General liability; cyber; affiliate E&O if applicable |
| ☐ | **Tax / accounting** | LLC return; sales tax nexus review |
| ☐ | **Domain renewals** | freedompawsinc.com, vitproscan.com, defensive names |
| ☐ | **Copyright / binder update** | New features since last registration |
| ☐ | **Jan promotion cycle** | Retail scanner kit campaign (from 2027) |
| ☐ | **Strategic plan refresh** | 5-year outlook doc; product line inventory |

---

## 9F — Role-based recurring (when team grows)

| Role | Recurring responsibility |
|------|-------------------------|
| **Founder / CEO** | L5 relationships, grants, partner deals, counsel |
| **fp_ops** | Match approve/reject; ops adoption CRM; deploy sign-off |
| **shelter_admin** | Listings accurate; found intake; scan SOP |
| **Advisor DVM** | ViT Pro benchmark cases; CDS scope guardrails |
| **Contract eng** | Monitor relay, AAHA embed, BLE native — sprint-based |

*Today: founder wears all hats.*

---

# MASTER COMPLETION GATES (sign here)

| Gate | Description | Date | Initials |
|------|-------------|------|----------|
| **G0** | L5 legal + first partner listing | | |
| **G1** | Track 1 + Track 2 pilot approved | | |
| **G2** | Public launch (9 criteria) | | |
| **G3** | Oct 2026 TN biometric pilot live | | |
| **G4** | ViT Pro DVM pilot complete | | |
| **G5** | Jan 2027 retail scanner promotion | | |
| **G6** | Operating business — Phase 9 routines stable 90 days | | |

---

# Quick reference URLs

| Purpose | URL |
|---------|-----|
| App | https://app.freedompawsinc.com |
| Ops | https://app.freedompawsinc.com/ops |
| ID scan | https://app.freedompawsinc.com/id/scan |
| ViT Pro (DVM) | https://app.freedompawsinc.com/vit-pro |
| Partner portal | https://shelter.freedompawsinc.com/partner |
| Adopt TN | https://app.freedompawsinc.com/adopt/tn |
| Symptom admin | https://app.freedompawsinc.com/admin/symptoms |
| Test chip | `985141007711681` |

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Remaining work master checklist — July 3, 2026*  
*Print double-sided · check boxes in ink · file with Critical Path + Completed Items records*
