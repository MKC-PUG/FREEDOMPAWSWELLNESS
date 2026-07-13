# Freedom Paws — 14-Day Automation Checklist

**Companion:** `Freedom-Paws-AI-Marketing-Automation-Master-Plan-June-2026.md`  
**Policy:** `ACTIVATION-GATE.md` — **Phase 0 only until you explicitly start Phase 1**

---

## Phase 0 — Prepare only (no sends, workflows inactive)

*Safe to do now. Nothing contacts partners or runs on a schedule.*

### Repo tools (write local files only)

| Command | What it does | Sends? |
|---------|----------------|:------:|
| `npm run marketing:crm-export` | CRM-ready CSV | No |
| `npm run marketing:tn-outreach` | Draft markdown in `outbox/tn-pilot/` | No |

**Optional env in `.env.local`:** `FOUNDER_NAME`, `CAL_LINK` (for draft personalization only)

### Day 1–2 — Foundation (prepare)

- [ ] Read `ACTIVATION-GATE.md`
- [ ] Run `npm run marketing:crm-export`
- [ ] Run `npm run marketing:tn-outreach`
- [ ] Review drafts in `docs/marketing/outbox/tn-pilot/` — **do not send**
- [ ] (Optional) Import CRM CSV to Google Sheets for planning — leave **`Approved` empty**
- [ ] Pin filter views: **TN_Pilot**, **Approve Today** (for later)
- [ ] Slack: create `#fp-approvals` and `#fp-metrics` (no bots required yet)
- [x] Namecheap Private Email: info@, shelter@, partners@ live on iPhone + Mac Mail (IMAP) — July 12, 2026
- [ ] Cal.com: create booking link (for drafts)
- [ ] n8n: install account/instance — **do not activate workflows**
- [ ] Supabase: run `011_shelters_public_pilot_read.sql` if needed (public directory only)

### Day 3–5 — Wire credentials (workflows still inactive)

- [ ] Import n8n workflow JSON from `docs/automation/n8n/` when available
- [ ] Connect Google Sheets, Resend, Anthropic, Slack — **workflows remain Inactive**
- [ ] Manual test: run **one node** send to **your own email** (not partners)
- [ ] Manual test: score **one** CRM row (Embrace) — no bulk overnight jobs

### Day 6–8 — Content ready (still no partner outreach)

- [ ] Framer: wire `freedompawsinc.com/adopt` → CTA to app directory
- [ ] Post-adoption drip templates in Resend as **drafts** (not triggered)
- [ ] Buffer account created — **no scheduled posts**

---

## Phase 1 — Activate (founder only, when ready)

*Do not start until Phase 0 is done and you want real outbound.*

### Activation gate (required before any partner email)

- [ ] Founder signed off on `ACTIVATION-GATE.md` checklist
- [ ] First send: **one** partner row, `Approved=YES`, Workflow D **Activated**
- [ ] Confirm deliverability in Resend dashboard
- [ ] Then: remaining 5 TN pilots, one batch or staggered

### Day 6–8 — Adoption outreach (after gate)

- [ ] Set `Approved=YES` per partner in CRM
- [ ] Send Email 1 from **shelter@freedompawsinc.com** (manual or Workflow D)
- [ ] Activate Workflow I (listing spotlight) — optional
- [ ] Activate Workflow G (post-adoption drip) — only when listings mark adopted

### Day 9–14 — Scale (after first sends succeed)

- [ ] Impact.com publisher account; submit affiliate apps
- [ ] Activate Workflow B overnight scoring (optional)
- [ ] Activate Workflow F (social) + H (KPI)
- [ ] Enable Workflow D auto follow-up (Day 5 email) — **only after** Email 1 proven

---

## TN pilot partners (for when you activate)

| Rank | Organization | FP slug |
|:----:|--------------|---------|
| 1 | Memphis Animal Services | memphis-animal-services |
| 2 | Metro Animal Care and Control | metro-animal-care-control |
| 3 | Young-Williams Animal Center | young-williams-animal-center |
| 4 | New Leash on Life | new-leash-on-life |
| 5 | Humane Society of Sumner County | humane-society-sumner-county |
| 6 | Safe Place for Animals | safe-place-for-animals |

**Live directory:** https://app.freedompawsinc.com/adopt/tn  
**Partner portal:** https://shelter.freedompawsinc.com/partner/listings

---

## Emergency pause

1. Deactivate **all** n8n workflows  
2. Clear **`Approved`** column in CRM  
3. No cron + no `Approved=YES` = **zero automated outbound**
