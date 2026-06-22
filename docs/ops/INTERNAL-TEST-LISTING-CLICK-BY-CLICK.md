# Internal test listing — click-by-click (no partner onboarding)

**Policy:** No shelter emails or onboarding until Freedom Paws Wellness infrastructure is fully built.  
This exercise validates the adoption pipeline **internally only**.

---

## What this proves

- Partner portal → create listing → photo upload → **Available** → public `/adopt/tn` → `/ops/adoption` KPIs  
- No Memphis (or any partner) contact required

---

## Before you start

- [ ] Signed in as **fp_ops** (`info@freedompawsinc.com`)
- [ ] Use **Chrome/Safari** on phone or desktop (photo upload works best)
- [ ] Have **one dog photo** on your device (any image — this is a test)

---

## Step 1 — Open listings

1. Go to **[shelter.freedompawsinc.com/partner/listings](https://shelter.freedompawsinc.com/partner/listings)**  
   - Or on app host: **[app.freedompawsinc.com/partner/listings](https://app.freedompawsinc.com/partner/listings)**
2. If prompted, sign in with **info@freedompawsinc.com** → magic link
3. You should see **Adoption listings** and a green **New listing →** button

---

## Step 2 — Create test listing

1. Tap **New listing →**
2. **Shelter** (fp_ops only): choose **Memphis Animal Services** (or any pilot — Memphis is fine for internal test)
3. Fill in:

| Field | Test value |
|-------|------------|
| Display name | `FP Test Dog – Demo` |
| Breed (primary) | e.g. `Mixed Breed` |
| Sex | Any |
| Age band | e.g. `Adult` |
| Bio | `Internal infrastructure test listing — not a real adoption. Freedom Paws ops validation only.` |

4. **Photo:** tap **Add photo** → choose one image → wait for preview (select shelter first if dropdown shown)
5. Tap **Save draft** (creates as Draft — not public yet)
6. On the listings page, tap **Edit** on the new listing
7. **Status:** change to **Available**
8. Tap **Save changes**

---

## Step 3 — Confirm public directory

1. Open **[app.freedompawsinc.com/adopt/tn](https://app.freedompawsinc.com/adopt/tn)**  
   - Test dog should appear in listings (may take a refresh)
2. Open shelter page:  
   **[app.freedompawsinc.com/adopt/tn/memphis-animal-services](https://app.freedompawsinc.com/adopt/tn/memphis-animal-services)**  
   - Or whichever shelter you selected
3. Tap the listing → detail page loads with photo + bio

---

## Step 4 — Confirm Command Center

1. Open **[app.freedompawsinc.com/ops/adoption](https://app.freedompawsinc.com/ops/adoption)**
2. Check:
   - Top KPI **Available** → **1**
   - Memphis card (or chosen shelter): **1 available / 1 listings**
   - Badge may change from **Needs attention** → **Ready**
3. **Do not** check **Approved for outreach** — no partner onboarding yet

---

## Step 5 — Clean up (after validation)

1. Back to **Partner listings** → **Edit** the test listing
2. Set status to **Archived** (or **Draft** if you prefer to hide from public)
3. Save → confirm **Available** returns to **0** on `/ops/adoption`

---

## If something fails

| Issue | Fix |
|-------|-----|
| No **New listing** button | Re-run `npm run partner:bootstrap`; confirm `fp_ops` role |
| Photo upload fails | Check Supabase storage bucket from migration 010; try smaller image |
| Not on public `/adopt/tn` | Status must be **Available** or **Pending**; hard refresh |
| Shelter dropdown empty | Migrations 009/010; `npm run ops:verify` should show 6 partners |

---

## After test listing passes — infrastructure buildout (no onboarding)

Continue internal buildout only:

1. Framer `freedompawsinc.com/adopt` → CTA to app directory  
2. `shelter.freedompawsinc.com` DNS on Vercel (if not done)  
3. Remaining product legs per your master plan (wellness affiliates, ID polish, etc.)  
4. Partner Email 1 **only when you declare infrastructure complete**

---

**Tracker**

| Task | Done? |
|------|:-----:|
| Test listing created | ☐ |
| Visible on `/adopt/tn` | ☐ |
| `/ops/adoption` shows Available = 1 | ☐ |
| Test listing archived | ☐ |
| Partner outreach | **Deferred** |
