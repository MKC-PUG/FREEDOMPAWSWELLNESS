# Launch steps 1–2–3 — click-by-click

**You are here:** Deploy is live (v77). Finish DB migration → sign into `/ops` → kick off Memphis.

---

## STEP 1 — Run database migration (≈3 min)

**Why:** Powers `/ops` toggles + shows 6 TN partners on public `/adopt/tn`.

### Option A — Supabase SQL Editor (recommended)

1. Open [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **Freedom Paws** project
3. Left sidebar → **SQL Editor**
4. Click **+ New query**
5. On your Mac, open `supabase/RUN_MIGRATIONS_011_012.sql` in this repo
6. **Select all** (⌘A) → **Copy** (⌘C)
7. Paste into the SQL Editor
8. Click **Run** (or ⌘↵)
9. Expect: green **Success** (no errors)

### Option B — Terminal (if `SUPABASE_DB_URL` in `.env.local`)

```bash
npm run ops:migrate
```

### Verify Step 1

```bash
npm run ops:verify
```

**Pass:** `TN partners in public API: 6`  
**Fail (still 0):** re-run SQL; confirm `listings_enabled = true` on pilot shelters.

---

## STEP 2 — Confirm Command Center (≈5 min)

1. Open [app.freedompawsinc.com/ops](https://app.freedompawsinc.com/ops)
2. You should redirect to **Sign in** → enter **info@freedompawsinc.com** (or your `FP_OPS_EMAILS` address)
3. Check email → click magic link
4. Land on **Command Center** home

### What you should see

| Check | Expected |
|-------|----------|
| Top banner | **Emergency stop is ON** (safe default) |
| KPI: TN pilot partners | **6** |
| Marketing badge | **Blocked** or **Dormant** |
| Department cards | Adoption, Marketing, Shelter & ID, Wellness, Product, System |

### If redirected to `/mypets`

```bash
npm run partner:bootstrap
```

Sign out → sign in again at `/ops`.

### Click through modules (30 sec each)

- **ADOPTION** → 6 partner cards
- **MARKETING** → Emergency stop ON, workflows OFF
- **SYSTEM** → Supabase OK, migration note

---

## STEP 3 — Adoption kickoff: Memphis first (today / this week)

Full detail: `docs/ops/ADOPTION-KICKOFF-CLICK-BY-CLICK.md`

### 3A — Before email (5 min)

1. `/ops/adoption` → find **Memphis Animal Services**
2. Confirm **0 listings** + draft path shown
3. Open [public Memphis page](https://app.freedompawsinc.com/adopt/tn/memphis-animal-services) — loads (may be empty)
4. Leave **Approved for outreach** OFF until after you send

### 3B — Send Email 1 manually (15 min)

1. Open mail as **shelter@freedompawsinc.com**
2. Open `docs/marketing/outbox/tn-pilot/01-memphis-animal-services-email-1.md`
3. **To:** Memphis adoption lead (901-636-1416 org — use partnership inbox if no direct email)
4. **Subject:** `Pilot inquiry — public adoption directory + optional ID tools for Memphis Animal Services`
5. Replace `[Founder name]` and Cal.com link
6. **Send** (human only — no n8n)

### 3C — After send (5 min)

1. `/ops/adoption` → toggle **Approved for outreach** ON for Memphis
2. Schedule 20-min onboarding call (Cal.com)
3. On call: walk through [partner listings](https://shelter.freedompawsinc.com/partner/listings)

### 3D — Partner publishes first dog (their side)

Share checklist from kickoff doc:

- Sign in → **New listing** → photo + bio → status **Available**
- Confirm on [Memphis directory](https://app.freedompawsinc.com/adopt/tn/memphis-animal-services)
- You verify in `/ops/adoption` — KPI **Available** increments

### 3E — Repeat for partners 2–6

Same pattern using `02-` … `06-` drafts in `docs/marketing/outbox/tn-pilot/`.

---

## Status tracker

| Step | Action | Done? |
|:----:|--------|:-----:|
| 1 | Run `RUN_MIGRATIONS_011_012.sql` | ☐ |
| 1 | `npm run ops:verify` shows 6 partners | ☐ |
| 2 | Sign in to `/ops` as fp_ops | ☐ |
| 2 | Emergency stop ON confirmed | ☐ |
| 3 | Memphis Email 1 sent from shelter@ | ☐ |
| 3 | Memphis approved in `/ops/adoption` | ☐ |
| 3 | First live listing on directory | ☐ |

---

## Commands reference

```bash
npm run ops:verify          # Live deploy + partner count
npm run ops:migrate         # DB (needs SUPABASE_DB_URL)
npm run partner:bootstrap   # fp_ops role for your email
npm run marketing:tn-outreach  # Regenerate email drafts
```

**No automated sends** unless you later activate n8n + turn off emergency stop.
