# Marketing automation — activation gate (read first)

**Policy:** Everything in `docs/marketing/` and `scripts/marketing/` is **prepare-only**.  
Nothing sends email, updates live CRM rows for outbound, or runs on a schedule until the founder **explicitly activates** each piece.

---

## What is safe today (no outbound)

| Artifact | Behavior |
|----------|----------|
| `npm run marketing:crm-export` | Writes a **local CSV** only. No API calls. |
| `npm run marketing:tn-outreach` | Writes **markdown drafts** to `outbox/`. No email API. |
| Email templates | Static copy for human review. |
| Master contact CSV | Reference data. Not connected to a live sender. |
| Git commit / Vercel deploy | Deploys the app. **Does not** start marketing workflows. |

The live app’s Resend usage is **unchanged**: waitlist signups and ID match alerts only (user/shelter actions).

---

## What must stay OFF until you activate

| System | Default state | Activates when |
|--------|---------------|----------------|
| n8n workflows (A–I) | **Not imported** or imported **Inactive** | You toggle **Active** in n8n after checklist below |
| Workflow D (send sequence) | **Never auto-arm** | `Approved=YES` in CRM **and** workflow Active **and** Resend creds connected |
| Workflow B (fit scoring) | Off | You enable cron after reviewing prompts |
| Workflow E (reply triage) | Off | You publish inbound webhook URL to Resend |
| **Ops Command Center** | `/ops` (fp_ops) | Marketing gates, KPIs, department modules — **no email send** |

| Buffer / social factory | Off | You connect Buffer and activate Workflow F |

---

## CRM column rules (prevent accidental send)

When importing `Freedom-Paws-CRM-Import-Ready-June-2026.csv`:

| Column | Prepare-only value | Do not set until activation |
|--------|-------------------|----------------------------|
| `Approved` | **empty** | `YES` |
| `Status` | `New` | `Sent`, `Live` |
| `Sequence_Stage` | `0` | advance only after you send Email 1 |
| `Primary_Inbox` | pre-filled for planning | — |

**Workflow D only fires when `Approved=YES`.** Leave that column blank until you intentionally send.

---

## Founder activation checklist (one-time, in order)

Only complete when you are ready to send real email:

1. [ ] Review all drafts in `docs/marketing/outbox/tn-pilot/`
2. [ ] Import CRM to Google Sheets (optional — for tracking only)
3. [ ] Resend domain verified; shelter@ / partners@ forward to you
4. [ ] n8n installed; import workflow JSON from `docs/automation/n8n/`
5. [ ] **Leave every workflow Inactive** while wiring credentials
6. [ ] Test Workflow D with **one internal row** (your own email) — workflow still Inactive until test passes
7. [ ] Set `Approved=YES` on **one** partner row only
8. [ ] Activate Workflow D **manually** for first send; watch Resend dashboard
9. [ ] Scale to remaining partners after confirming deliverability

To **pause everything:** deactivate all n8n workflows; clear `Approved` column; no cron = no sends.

---

## Repo scripts will never send

`scripts/marketing/*` are **write-only** (CSV + markdown). They will not call Resend, n8n, Google Sheets API, or Anthropic. Outbound automation lives only in n8n (or manual send) and requires separate activation.

See also: `DAY-1-14-Execution-Checklist-June-2026.md` (Phase 0 vs Phase 1).
