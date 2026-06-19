# n8n workflow exports (Freedom Paws marketing automation)

**Status: DORMANT — templates only. Import with workflows set to Inactive.**

Read `docs/marketing/ACTIVATION-GATE.md` before activating any workflow.

## Policy

1. **Import** workflow JSON into n8n when you are ready to wire credentials.
2. **Do not** toggle **Active** until the founder activation checklist is complete.
3. **Workflow D** (send) requires `Approved=YES` in CRM — keep that column empty during setup.
4. **No workflow JSON in this repo sets `active: true` by default** (when files are added).

## Workflows (add when built — all Inactive on import)

| Workflow | File | Sends email? | Default |
|----------|------|:------------:|---------|
| A — CRM sync nightly | `workflow-a-crm-sync.json` | No | Inactive |
| B — Fit scoring | `workflow-b-fit-score.json` | No | Inactive |
| D — Approved send sequence | `workflow-d-send-sequence.json` | **Yes** | Inactive |
| E — Reply triage | `workflow-e-reply-triage.json` | No (drafts to Slack) | Inactive |
| F — Social factory | `workflow-f-social-factory.json` | No (Buffer) | Inactive |
| G — Post-adoption drip | `workflow-g-post-adopt-drip.json` | **Yes** | Inactive |
| H — KPI weekly | `workflow-h-kpi-report.json` | No | Inactive |
| I — Listing spotlight | `workflow-i-listing-spotlight.json` | Optional | Inactive |

## Setup order (credentials only — still Inactive)

1. Google Sheets OAuth → CRM spreadsheet (read/write test row)
2. Resend API key → send **one test** to your own inbox (manual node run, workflow Inactive)
3. Anthropic API → fit-score one row (manual run)
4. Slack webhook → `#fp-approvals` test message
5. Only then: founder signs activation checklist → enable workflows one at a time

**Quick start:** https://n8n.io — Resend + Google Sheets + Anthropic nodes.
