# Freedom Paws — AI Marketing Automation Master Plan (95–99% Automated)

**Companion to:**  
`Freedom-Paws-Master-Marketing-Network-Plan-June-2026.md` ·  
`Freedom-Paws-Master-Marketing-Contact-Directory-June-2026.csv` (~370 contacts) ·  
`Freedom-Paws-AI-Agent-Outreach-Automation-Playbook-June-13-2026.md`

**Date:** June 17, 2026  
**Goal:** Run the full marketing network with **95–99% automation** — founder approves in **&lt;30 min/day**  
**Human-only floor (~1–5%):** Contract signatures, negotiation calls, affiliate KYC submit, grant sign-off, crisis comms

**Outreach inboxes:** partners@freedompawsinc.com · shelter@freedompawsinc.com · info@freedompawsinc.com

---

## Table of contents

1. [Automation architecture overview](#1-automation-architecture-overview)
2. [What stays human (the 1–5%)](#2-what-stays-human-the-15)
3. [The 14 AI agents — roles & automation %](#3-the-14-ai-agents--roles--automation-)
4. [Master contact list — how to use it](#4-master-contact-list--how-to-use-it)
5. [Tech stack (Tier 1 → Tier 3)](#5-tech-stack-tier-1--tier-3)
6. [n8n workflow blueprints (copy-build)](#6-n8n-workflow-blueprints-copy-build)
7. [Compartment automation playbooks](#7-compartment-automation-playbooks)
8. [Affiliate pre-launch — 99% automated pipeline](#8-affiliate-pre-launch--99-automated-pipeline)
9. [Adoption hub automation — fill every leg](#9-adoption-hub-automation--fill-every-leg)
10. [Approval dashboard — founder 30 min/day](#10-approval-dashboard--founder-30-minday)
11. [14-day implementation (click-by-click)](#11-14-day-implementation-click-by-click)
12. [Cost, outcomes & ROI vs manual](#12-cost-outcomes--roi-vs-manual)
13. [Compliance guardrails](#13-compliance-guardrails)
14. [Prompt library & agent instructions](#14-prompt-library--agent-instructions)

---

## 1. Automation architecture overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MASTER CONTACT CSV (~370 rows)                        │
│         Freedom-Paws-Master-Marketing-Contact-Directory-June-2026.csv    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ nightly sync
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              GOOGLE SHEETS CRM (source of truth + status)                │
│   Tabs: All · TN_Pilot · Insurance · Shelters · Veterans · Affiliates   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
 │ Agent 1     │        │ Agent 2     │        │ Agent 3     │
 │ CRM Sync    │        │ Fit Score   │        │ Draft Email │
 │ 99% auto    │        │ 95% auto    │        │ 95% auto    │
 └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │  FOUNDER APPROVAL     │  ◄── 1–5% human
                    │  Slack #fp-approvals  │      (~15 min/day)
                    └───────────┬───────────┘
                                │ Approved=YES
                                ▼
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
 │ Agent 4     │        │ Agent 6     │        │ Agent 9     │
 │ Send Seq    │        │ Social      │        │ Post-Adopt  │
 │ Resend 98%  │        │ Buffer 95%  │        │ Drip 99%    │
 └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
        │                       │                       │
        ▼                       ▼                       ▼
 ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
 │ Agent 7     │        │ Agent 10    │        │ Agent 12    │
 │ Reply       │        │ KPI Sheet   │        │ Listing     │
 │ Triage 90%  │        │ 99% auto    │        │ Spotlight   │
 └─────────────┘        └─────────────┘        └─────────────┘
```

**Spine:** **n8n** (self-host free or cloud $24/mo) connects Sheets ↔ Claude API ↔ Resend ↔ Slack ↔ Buffer.

---

## 2. What stays human (the 1–5%)

| Task | Why human | Est. time/week |
|------|-----------|----------------|
| Approve first-touch B2B/shelter emails | CAN-SPAM + relationship quality | 30–60 min |
| Partner negotiation calls | Trust, terms | 1–2 hrs |
| Sign MOU / affiliate agreements | Legal | 30 min |
| Submit affiliate KYC (Impact, etc.) | Identity verification | 20 min |
| Grant application signature | Fiduciary | 30 min |
| Municipal relationship (MAS, MACC) | Government sensitivity | 1 hr |
| Crisis / negative reply | Brand risk | As needed |
| Press relationship (Tier 1) | Optional human for GMA/Dodo | 1 hr |

**Everything else in this plan is automated or auto-drafted.**

---

## 3. The 14 AI agents — roles & automation %

| # | Agent name | Job | Auto % | Tool |
|---|------------|-----|:------:|------|
| 1 | **CRM Sync** | Import CSV → Sheets; dedupe; assign compartment | 99% | n8n + Sheets |
| 2 | **Fit Scorer** | Mission fit 1–5; flag pharma-first risk | 95% | Claude API |
| 3 | **Draft Writer** | 3-touch email sequences per contact | 95% | Claude Project |
| 4 | **Sequence Sender** | Day 0/7/21 Resend after approval | 98% | n8n + Resend |
| 5 | **Affiliate Prep** | Pre-fill Impact/application answers | 85% | Claude |
| 6 | **Social Factory** | 7 posts/week + listing spotlights | 95% | ChatGPT + Buffer |
| 7 | **Reply Triage** | Classify inbound; draft responses | 90% | n8n + Claude |
| 8 | **Partner Go-Live** | Env vars + deploy + config-status | 85% | Cursor agent |
| 9 | **Post-Adoption Drip** | Day 0/3/7/14 emails to new adopters | 99% | n8n + Resend |
| 10 | **KPI Reporter** | Weekly metrics → Sheet + Slack summary | 99% | n8n + API pulls |
| 11 | **Grant Drafter** | Grant narrative drafts from metrics | 90% | Claude |
| 12 | **Listing Spotlight** | New listing → social post + optional email | 99% | n8n webhook* |
| 13 | **Influencer DM Prep** | Personalized IG/FB DM drafts (not auto-send) | 95% | Claude |
| 14 | **Compliance Checker** | FTC disclosure + policy scan before send | 98% | Claude prompt |

\*Listing webhook: n8n polls `adoption_listings` daily until Supabase webhook added.

**Blended automation across marketing operations: 95–97%.**

---

## 4. Master contact list — how to use it

### File

`docs/Freedom-Paws-Master-Marketing-Contact-Directory-June-2026.csv`

### Contents (~370 organizations)

| Category block | Count | Priority use |
|----------------|------:|--------------|
| Pet Insurance | 50 | Agent 4 + 5 — Q3 2026 |
| Holistic Telehealth | 50 | Agent 4 — Q4 2026 |
| Whole Food Nutrition | 50 | Agent 5 + 8 |
| Non-Toxic Chews/Toys | 50 | Agent 8 |
| Shelters & Rescues | 50 | Agent 4 — shelter@ inbox |
| Veteran Service Dog Orgs | 50 | Agent 4 — partners@ |
| **Adoption Network TN Pilot** | 25 | **Week 1 priority** |
| Media & PR | 10 | Agent 6 + 11 |
| Grants & Foundations | 10 | Agent 11 |
| Public Influencers | 12 | Agent 6 + 13 |
| Holistic Retail Local TN | 10 | Agent 13 P2B |
| Freedom Paws ID refs | 5 | Internal |
| XRPL Community | 3 | Optional |
| Internal Operations | 10 | Stack setup |

### CRM columns to add in Google Sheets

| Column | Purpose | Filled by |
|--------|---------|-----------|
| `Fit_Score` | 1–5 mission fit | Agent 2 |
| `Status` | New / Research / Drafted / Approved / Sent / Replied / Live / Dead | Manual + agents |
| `Approved` | YES/NO gate for send | **Founder** |
| `Sequence_Stage` | 0 / 7 / 21 / Done | Agent 4 |
| `Last_Contact` | Date | Agent 4 |
| `Next_Action` | Auto-suggested | Agent 7 |
| `Compartment` | Maps to marketing plan §5 | Agent 1 |
| `Primary_Inbox` | partners@ / shelter@ / info@ | Agent 1 |
| `UTM_Campaign` | Tracking slug | Agent 1 |
| `AI_Draft_Link` | Google Doc URL | Agent 3 |

### Import steps (one time — 20 min)

1. Google Sheets → **Import** → upload master CSV.
2. **Data → Split to tabs** by `Category` (filter views).
3. Pin tab **TN_Pilot** — work top-down ★★★ first.
4. Add CRM columns above (row 1 headers).
5. Share sheet with service account email (n8n) if using API.

---

## 5. Tech stack (Tier 1 → Tier 3)

### Tier 1 — Start this week ($20–45/mo) → **95% automation**

| Tool | Cost | Role |
|------|-----:|------|
| Google Sheets | $0 | CRM |
| Claude Pro | $20 | Draft + score + triage |
| Resend | $0–20 | Email send + inbound |
| n8n self-host (Docker) or cloud | $0–24 | Workflow spine |
| Slack free | $0 | Approval notifications |
| Buffer free | $0 | Social schedule |
| Cal.com | $0 | Partner booking links |
| HubSpot Free CRM | $0 | Optional mirror |

### Tier 2 — Month 2 ($80–150/mo) → **97% automation**

| Add | Cost | Role |
|-----|-----:|------|
| n8n cloud Pro | $24 | Reliability |
| Buffer Essentials | $6 | More channels |
| Canva Pro | $13 | Auto-sized templates |
| Anthropic API (pay-go) | $20–50 | Bulk scoring without UI |
| Zapier/Make (optional) | $0–16 | Backup if n8n hard |

### Tier 3 — Scale ($200–400/mo) → **99% automation**

| Add | Cost | Role |
|-----|-----:|------|
| Clay.com | $149 | Enrichment + personalization |
| Instantly.ai (low volume) | $30 | Multi-inbox sequences |
| LinkedIn Sales Nav (1 mo) | $80 | BD targeting burst |
| Meta ads API + n8n | Variable | Auto-pause on CAC threshold |

**Recommended start:** Tier 1 only until 20+ live adoption listings.

---

## 6. n8n workflow blueprints (copy-build)

### Workflow A — Nightly CRM hygiene (99% auto)

**Trigger:** Cron 2:00 AM daily  
**Steps:**
1. Read master CSV from Google Drive (or git export weekly).
2. Merge into Sheets — upsert by `Category+Organization`.
3. Set `Primary_Inbox` rule: Shelters/Adoption → shelter@; Insurance/Affiliate → partners@; else info@.
4. Set `UTM_Campaign` = lowercase slug of category.
5. Slack summary: `+N new rows, M ready for scoring`.

### Workflow B — Fit scoring batch (95% auto)

**Trigger:** New rows OR weekly Sunday 6 AM  
**Steps:**
1. Filter `Fit_Score` empty AND `Priority` contains ★★★.
2. For each row (batch 10): HTTP → Claude API with Partner Policies excerpt + org row.
3. Write `Fit_Score` + 1-line `Outreach_Notes` append.
4. If score ≥4 → set `Status=Research`.

### Workflow C — Draft generation (95% auto)

**Trigger:** `Status` changed to `Research`  
**Steps:**
1. Claude API: generate Email 1/2/3 per compartment template (§14).
2. Create Google Doc in folder `FP Outreach Drafts/{Category}/{Org}`.
3. Write `AI_Draft_Link` + set `Status=Drafted`.
4. Slack: "Review draft: [link]" with ✅ Approve / ✏️ Edit buttons (manual).

### Workflow D — Approved send sequence (98% auto)

**Trigger:** `Approved=YES` AND `Sequence_Stage=0`  
**Steps:**
1. Send Email 1 via Resend from correct inbox.
2. Set `Sequence_Stage=0`, `Last_Contact=today`, `Status=Sent`.
3. Schedule wait 7 days → if no reply → Email 2.
4. Schedule wait 14 more days → Email 3.
5. If reply → Workflow E.

### Workflow E — Reply triage (90% auto)

**Trigger:** Resend inbound webhook  
**Steps:**
1. Claude classify: `interested` | `not_now` | `wrong_contact` | `unsubscribe` | `legal`.
2. Update CRM `Status` + `Next_Action`.
3. Draft suggested reply → Slack for founder (auto-send only for `not_now` template thank-you).
4. `interested` → Cal.com link auto-inserted in draft.

### Workflow F — Weekly social factory (95% auto)

**Trigger:** Sunday 8 AM  
**Steps:**
1. Pull: top 3 live listings from `GET /api/partner/orgs` + listing count.
2. Claude: 7 captions (2 adopt, 2 ViT, 1 veteran, 1 Photo Booth, 1 give-back).
3. Push to Buffer queue Mon–Sun 10 AM.
4. Slack: approve calendar link.

### Workflow G — Post-adoption drip (99% auto)

**Trigger:** Webhook or manual Sheet row when shelter marks `adopted`  
**Steps:**
1. Day 0: Welcome + Photo Booth (Resend template).
2. Day 3: Gut Balance protocol.
3. Day 7: ID enroll + insurance CTA.
4. Day 14: Share story #FreedomPawsAdopt.
5. Log opens/clicks to KPI sheet.

### Workflow H — KPI weekly report (99% auto)

**Trigger:** Monday 7 AM  
**Steps:**
1. Pull: Vercel analytics (or Plausible), `/api/partner/orgs`, Supabase listing counts.
2. Write KPI tab in Sheets.
3. Claude: 5-bullet executive summary → Slack #fp-metrics.

### Workflow I — Listing spotlight (99% auto)

**Trigger:** Daily poll Supabase `adoption_listings` where `created_at` > yesterday  
**Steps:**
1. For each new `available` listing: generate Instagram caption + image text overlay suggestion.
2. Queue Buffer post.
3. Optional: email waitlist segment "New dog: {name} in {city}".

---

## 7. Compartment automation playbooks

### Priority order (matches Marketing Network Plan)

| Week | Compartment | Agent focus | Contacts from CSV |
|:----:|-------------|-------------|-------------------|
| 1–2 | Adoption Network TN | F + I + 6 | Rows: Adoption Network TN Pilot 1–25 |
| 2–3 | Shelters (6 live + expand) | D + 3 + 7 | Shelters ★★★ TN + pilot rows |
| 3–4 | Insurance | D + 5 + 8 | Pet Insurance 1–15 |
| 4–5 | Nutrition affiliates | D + 5 | Whole Food 1–20 |
| 5–6 | Veterans | D + 6 | Veteran ★★★ 1–20 |
| 6–8 | Telehealth + vets | D + 13 | Holistic Telehealth 1–15 |
| 8+ | Grants + media | 11 + 6 | Grants + Media tabs |

### Per-compartment message routing

| Compartment | Inbox | Template set | Sequence days |
|-------------|-------|--------------|:-------------:|
| Adoption Network / Shelter | shelter@ | `SHELTER_*` | 0, 5, 14 |
| Municipal | shelter@ | `MUNICIPAL_*` | 0, 7, 21 |
| Insurance | partners@ | `INSURANCE_*` | 0, 7, 21 |
| Nutrition affiliate | partners@ | `AFFILIATE_*` | 0, 7, 14 |
| Veteran org | partners@ | `VETERAN_*` | 0, 10, 24 |
| Telehealth | partners@ | `TELEHEALTH_*` | 0, 7, 21 |
| Grants | info@ | `GRANT_*` | Manual submit |
| Public influencer | N/A | `DM_*` | Manual send |
| Media | info@ | `PRESS_*` | 0, 14 |

---

## 8. Affiliate pre-launch — 99% automated pipeline

### Pipeline stages (CRM `Status` values)

```
Prospect → Research → Drafted → Approved → Application_Submitted →
Negotiating → MOU_Signed → Env_Configured → QA_Pass → LIVE
```

### Automated at each stage

| Stage | Automation |
|-------|------------|
| Prospect | Agent 1 import from CSV |
| Research | Agent 2 fit score ≥4 |
| Drafted | Agent 3 three emails + Agent 5 application answers doc |
| Approved | **Founder** sets Approved=YES (only human gate before send) |
| Application_Submitted | **Founder** clicks Impact submit (5 min) |
| Negotiating | Agent 7 triage + Claude counter-draft |
| MOU_Signed | **Founder** sign |
| Env_Configured | Agent 8 Cursor script |
| QA_Pass | Agent 14 compliance + manual 5-min click test |
| LIVE | Agent 6 announcement post auto-queued |

### Founding Partner incentive auto-insert

Agent 3 appends this block to all `AFFILIATE_*` and `INSURANCE_*` drafts when `Fit_Score≥4`:

> **Founding Partner offer (pre-launch):** Featured placement on `/wellness` for 90 days, co-branded adoption Reel, and first access to post-adoption email funnel traffic from TN Adoption Network — in exchange for ≥10% member discount and tracked deep links.

---

## 9. Adoption hub automation — fill every leg

**Core automation loop** (runs without founder once approved):

```
New listing published (available)
  → Agent 12: Buffer post + waitlist email
  → Agent 6: Weekly adopt Reel includes this dog
Public clicks /adopt/tn
  → Analytics → Agent 10 KPI
Adoption marked adopted
  → Agent 9: post-adoption drip
  → ID enroll CTA (day 7)
  → Insurance CTA (day 7)
  → Protocol affiliate (day 3)
Shelter shares listing link
  → UTM attributes traffic → Agent 10 reports partner ROI back to shelter (monthly auto-email)
```

### Auto-email to shelter partners (monthly — 99%)

**Trigger:** 1st of month  
**Content (Claude merge):** Your listings had X views, Y inquiries (if tracked), Z adoptions marked. Top dog: {name}. Tip: publish pending badge updates within 24h.

---

## 10. Approval dashboard — founder 30 min/day

### Slack channel: `#fp-approvals`

| Morning notification | Action |
|---------------------|--------|
| 3–10 draft emails ready | Click Doc links → YES in Sheet `Approved` column |
| 7 social posts in Buffer | Approve queue (or auto-publish if pre-authorized) |
| Reply triage: 2 interested | Book Cal.com or approve Claude draft reply |
| KPI summary | Read 5 bullets — no action unless red flag |

### Google Sheet filter views (bookmark these)

1. **Approve Today** — `Status=Drafted` AND `Priority` contains ★★★  
2. **TN Pilot** — Category = Adoption Network TN Pilot  
3. **Hot Replies** — `Status=Replied` AND Agent 7 tag = interested  
4. **Go Live** — `Status=MOU_Signed` → trigger Agent 8  

### Authorization tiers (reduce approval load over time)

| Phase | Auto-send without approval |
|-------|---------------------------|
| Month 1 | Nothing — approve all first touches |
| Month 2 | Follow-up Email 2/3 if no reply |
| Month 3 | Post-adoption drip; listing spotlights; KPI reports |
| Month 4+ | `not_now` thank-you replies; social if template score &gt;4 |

---

## 11. 14-day implementation (click-by-click)

### Days 1–2 — Foundation

| Step | Action | Time |
|:----:|--------|:----:|
| 1 | Import master CSV to Google Sheets | 20m |
| 2 | Add CRM columns (§4) | 15m |
| 3 | Create Slack `#fp-approvals` + `#fp-metrics` | 10m |
| 4 | ✅ Namecheap Private Email: info@, shelter@, partners@ live (iPhone + Mac IMAP) — July 12, 2026; Resend for app mail | Done |
| 5 | Claude Project: upload Partner Policies + Marketing Network Plan | 20m |
| 6 | n8n: install (Docker or cloud.n8n.io) | 45m |

### Days 3–5 — Core workflows

| Step | Action | Time |
|:----:|--------|:----:|
| 7 | Build Workflow A (CRM sync) | 1h |
| 8 | Build Workflow B (fit score) — Anthropic API key | 1h |
| 9 | Build Workflow D (send) — Resend API in n8n | 1h |
| 10 | Build Workflow E (reply webhook) | 45m |
| 11 | Test: 1 row Embrace → score → draft → approve → send | 30m |

### Days 6–8 — Adoption + social

| Step | Action | Time |
|:----:|--------|:----:|
| 12 | Workflow F (social factory) + Buffer connect | 1h |
| 13 | Workflow I (listing spotlight) — daily poll | 1h |
| 14 | Workflow G (post-adoption drip) templates in Resend | 1h |
| 15 | Score + draft **all 6 TN pilot partners** (rows 1–6) | 30m |
| 16 | Founder approve + send shelter onboarding sequence | 30m |

### Days 9–11 — Affiliate pipeline

| Step | Action | Time |
|:----:|--------|:----:|
| 17 | Impact.com publisher account | 20m |
| 18 | Agent 5: generate application docs for Embrace, Pets Best, Spot | 30m |
| 19 | **Founder submit** 3 applications | 45m |
| 20 | Score + draft Honest Kitchen + Open Farm | 30m |
| 21 | Workflow H (KPI) — manual metrics week 1 | 45m |

### Days 12–14 — Scale + document

| Step | Action | Time |
|:----:|--------|:----:|
| 22 | Batch score all ★★★ Insurance (15 rows) | Auto overnight |
| 23 | Batch draft top 10 fit ≥4 | Auto overnight |
| 24 | Founder approve 5/day | 15m/day |
| 25 | Workflow authorization: enable follow-up auto-send | 15m |
| 26 | Review §12 ROI — adjust Buffer + email volume | 30m |

**After day 14:** System runs at 95%+ with **~30 min/day** founder approval.

---

## 12. Cost, outcomes & ROI vs manual

### Monthly operating cost

| Tier | Tools | Founder hours | Outbound emails/mo | Partner meetings |
|------|------:|:-------------:|:------------------:|:----------------:|
| Manual (no AI) | $20 | 40–60 hrs | 40–60 | 2–4 |
| **Tier 1 AI (95%)** | **$45** | **8–12 hrs** | **200–400** | **6–10** |
| Tier 2 AI (97%) | $150 | 5–8 hrs | 400–800 | 10–15 |
| Tier 3 AI (99%) | $350 | 2–4 hrs | 800+ | 15+ |

### Adoption outcomes (6 months) — manual vs Tier 1 AI vs Tier 2 AI

| Metric | Manual | Tier 1 AI 95% | Tier 2 AI 97% |
|--------|--------|---------------|---------------|
| `/adopt/tn` sessions | 8,000 | 12,700 | 37,400 |
| Marked adoptions | 60 | 94 | 221 |
| ID enrolls (adoption path) | 40 | 148 | 283 |
| Affiliates live | 2 | 4 | 8 |
| Shelter partners active | 3 | 4 | 6 |
| Insurance quotes | 30 | 120 | 600 |
| Founder marketing hours | 240 | 60 | 35 |
| **Marketing spend** | **$750** | **$750** | **$10,500** |

**Key insight:** Tier 1 AI at **same $750 spend** delivers **~57% more adoptions** than manual because outreach volume 5×'s without 5×'ing founder time.

### ROI formula

```
Value of one marked adoption (network) =
  Future ID enroll + insurance lead + affiliate LTV + PR story
  Conservative: $50–200 per adoption to network (not shelter fee)

Tier 1 AI incremental adoptions vs manual: ~34 / 6 mo
Incremental value: $1,700–$6,800 on $750 spend + $270 tool cost
```

---

## 13. Compliance guardrails

| Rule | Implementation |
|------|----------------|
| CAN-SPAM | Physical address in footer; unsubscribe link; honor opt-out in 48h |
| No purchased email lists | CSV = public emails only |
| FTC affiliate disclosure | Agent 14 scans every email + app CTA |
| TCPA (SMS) | **No SMS automation** until explicit opt-in tool built |
| Instagram/FB DMs | Agent 13 drafts only — **human click send** |
| Shelter/municipal | No auto-send above Email 1 without founder YES |
| Biometric / ID claims | Agent 14 blocks "guaranteed reunion" language |
| Government email | Municipal sequences use formal template; founder approves all |

---

## 14. Prompt library & agent instructions

### Claude Project system prompt (all agents)

```
You are the Freedom Paws Wellness marketing automation assistant.

BRAND: Holistic, prevention-first dog wellness. Honor Buddy's Legacy.
MISSION: 10% net give-back — 50% veteran dog orgs / 50% shelters.
NEVER: pharmaceutical-first messaging; guaranteed medical outcomes; 
       auto-contact pet owners without shelter approval; claim we are a vet or insurer.

PRODUCTS: ViT Diagnostics, 10 protocols, Photo Booth, Freedom Paws ID (biometric 
lost-dog matching, human review required), TN Adoption Network at app.freedompawsinc.com/adopt/tn.

TONE: Warm, professional, mission-driven. Under 180 words per email.
ALWAYS INCLUDE: relevant tracked URL + FTC disclosure line when affiliate mentioned.
STANDARDS: app.freedompawsinc.com/wellness/partners
```

### Agent 2 — Fit score prompt

```
Score this organization 1-5 for Freedom Paws mission fit.
Input: {CSV row JSON}
Policies excerpt: {partner policies}
Output JSON only: {"fit_score":N,"risk_flags":[],"hook":"one personalization sentence","recommended_inbox":"shelter@|partners@|info@"}
```

### Agent 3 — Shelter email template

```
Write 3 emails for {Organization} ({org_type} in {city}, TN).
Goal: onboard them to publish adoption listings on Freedom Paws Adoption Network.
Email 1: intro + 6 pilot partners live + 15-min demo link {Cal.com}.
Email 2: case for free listing vs Petfinder alone + ID reunion optional.
Email 3: final + link to shelter@freedompawsinc.com.
Municipal tone for org_type=municipal; warm local tone for private.
```

### Agent 3 — Insurance email template

```
Write 3 emails for {Organization}. Position: high-intent funnel at ViT urgent + 
ID enrollment + post-adoption day 7. Cite 3-4% US pet insurance penetration.
Request: quote URL, lost-dog URL, urgent URL, ≥5% member discount.
Attach standards: app.freedompawsinc.com/wellness/partners/insurance
Offer Founding Partner: 90-day featured placement + adoption traffic stats monthly.
```

### Agent 6 — Weekly social prompt

```
Generate 7 Instagram captions for Freedom Paws (Mon-Sun).
Include: 2 TN adoption listings ({listing_names}), 2 ViT tips, 1 veteran/give-back,
1 Photo Booth, 1 hub CTA to app.freedompawsinc.com/adopt/tn.
Max 5 hashtags each. No medical guarantees.
```

### Agent 14 — Compliance scan

```
Review this email for: FTC disclosure, medical guarantees, pharmaceutical-first,
missing unsubscribe, wrong shelter/owner PII promises. Output: PASS or FAIL with fixes.
```

---

## Document control

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | June 17, 2026 | Master contact CSV + 14-agent 95–99% automation plan |

**Files to keep synced:**
- `Freedom-Paws-Master-Marketing-Contact-Directory-June-2026.csv`
- Google Sheet CRM (live)
- n8n workflow exports in `docs/automation/n8n/` (export when built)

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Automate the network. Approve the mission.*
