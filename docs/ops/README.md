# Freedom Paws Ops Command Center

**URL:** `https://app.freedompawsinc.com/ops`  
**Access:** Supabase sign-in + `fp_ops` role (`FP_OPS_EMAILS` in `.env.local`)

## Modules

| Route | Purpose |
|-------|---------|
| `/ops` | Home — KPIs, department cards, quick links, audit tail |
| `/ops/adoption` | TN pilot partners, listing pipeline, outreach approvals |
| `/ops/marketing` | Emergency stop, workflow toggles, n8n reference (no email send) |
| `/ops/shelter-id` | Match queue, found intake, ID email readiness |
| `/ops/wellness` | Insurance & telehealth affiliate config |
| `/ops/product` | PWA version, feature flags, symptom admin links |
| `/ops/system` | Env health, migrations note, external consoles |

## Database

Run in Supabase SQL Editor:

```
supabase/migrations/012_ops_settings.sql
```

Stores marketing gates and feature flags in `ops_settings`. Defaults: **emergency stop ON**, all workflows OFF.

## Marketing safety

This console **does not send email**. Toggles record intent for n8n when you connect it later. See `docs/marketing/ACTIVATION-GATE.md`.
