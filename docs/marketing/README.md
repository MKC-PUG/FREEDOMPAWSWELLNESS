# Freedom Paws marketing automation (prepare-only)

**Status: DORMANT — ready for setup, not activated.**

Read **`ACTIVATION-GATE.md`** before importing CRM data or touching n8n.

| File / folder | Purpose |
|---------------|---------|
| `ACTIVATION-GATE.md` | Policy: nothing sends until founder activates |
| `DAY-1-14-Execution-Checklist-June-2026.md` | Phase 0 (prepare) vs Phase 1 (activate) |
| `Freedom-Paws-CRM-Import-Ready-June-2026.csv` | Sheets import — `Approved` column empty |
| `templates/` | Email copy templates |
| `outbox/tn-pilot/` | Generated drafts (review only) |
| `kpi-weekly-template.csv` | Manual KPI tab |

**Commands (local files only, no sends):**

```bash
npm run marketing:crm-export
npm run marketing:tn-outreach
```

Master plans: `docs/Freedom-Paws-AI-Marketing-Automation-Master-Plan-June-2026.md`
