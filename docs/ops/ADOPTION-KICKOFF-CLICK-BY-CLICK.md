# Adoption kickoff — Memphis (manual Email 1)

**Goal:** Send the first TN pilot outreach manually from `shelter@`, onboard Memphis Animal Services, and confirm their first live listing.

**Draft source:** `docs/marketing/outbox/tn-pilot/01-memphis-animal-services-email-1.md`  
**Manifest:** `docs/marketing/outbox/tn-pilot/manifest.json`

---

## 1. Before you send — verify in `/ops/adoption`

1. Sign in at [app.freedompawsinc.com/ops](https://app.freedompawsinc.com/ops) (`fp_ops` role).
2. Open **Adoption Network** → `/ops/adoption`.
3. Confirm **Memphis Animal Services** appears under **TN pilot partners** with:
   - Org type badge (municipal)
   - **Warning** badge if `0 listings` (expected pre-kickoff)
   - Draft path shown: `01-memphis-animal-services-email-1.md`
4. Note KPIs at top (Pilot partners, Available, Pending, Adopted) — baseline before outreach.
5. Leave **Approved for outreach** **OFF** until you are ready to track intent (manual send does not require n8n; toggle is for future automation gates).
6. Optional: open **Public page** link on the Memphis card → [Memphis directory](https://app.freedompawsinc.com/adopt/tn/memphis-animal-services) — should load (may show zero dogs).

---

## 2. Founder — send Email 1 manually from `shelter@`

1. Open your mail client signed in as **shelter@freedompawsinc.com** (or send-as with that address verified in Resend).
2. Open `docs/marketing/outbox/tn-pilot/01-memphis-animal-services-email-1.md`.
3. **New message**
   - **To:** Memphis adoption / shelter services lead (use CRM contact if known; otherwise main org inbox).
   - **From:** `shelter@freedompawsinc.com`
   - **Subject:** `Pilot inquiry — public adoption directory + optional ID tools for Memphis Animal Services`
4. Paste the body from the draft. Replace placeholders:
   - `[Founder name]` → your name
   - `https://cal.com/[your-link]` → your live Cal.com booking link
5. Proofread — no `[brackets]` left.
6. **Send** (human send only; n8n Workflow D stays inactive per `docs/marketing/ACTIVATION-GATE.md`).
7. Log the send in your CRM/sheet: org = Memphis Animal Services, stage = Email 1 sent, date = today.

---

## 3. After send — verify in `/ops/adoption`

1. Refresh `/ops/adoption`.
2. Toggle **Approved for outreach** **ON** for Memphis (records intent; syncs to marketing gates footer count).
3. After the onboarding call, confirm you created their **`shelter_admin`** account in Supabase.
4. When they publish, re-check the Memphis card:
   - Badge flips from **Warning** → **Ready**
   - `{availableCount} available / {listingCount} listings` increments
   - Top KPI **Available** increases
5. Open **Listing pipeline** — **draft** → **available** flow reflects their first dog.
6. Click **Public page** → confirm the dog appears on [Memphis directory](https://app.freedompawsinc.com/adopt/tn/memphis-animal-services).

---

## 4. Partner checklist — publish first listing

Share these steps with Memphis after the onboarding call:

- [ ] Sign in at the **Partner portal:** [shelter.freedompawsinc.com/partner/listings](https://shelter.freedompawsinc.com/partner/listings)
- [ ] Confirm org context shows **Memphis Animal Services**
- [ ] **Create listing** — name, photo, breed/size/age, short bio
- [ ] Set status to **Available** (not Draft)
- [ ] Save and open the **public directory:** [app.freedompawsinc.com/adopt/tn/memphis-animal-services](https://app.freedompawsinc.com/adopt/tn/memphis-animal-services)
- [ ] Verify the dog appears within a few minutes
- [ ] Reply to `shelter@freedompawsinc.com` with the live URL or a screenshot (founder confirms in `/ops/adoption`)

---

## Quick links (Memphis)

| Resource | URL |
|----------|-----|
| Ops adoption dashboard | [app.freedompawsinc.com/ops/adoption](https://app.freedompawsinc.com/ops/adoption) |
| Public TN directory (all) | [app.freedompawsinc.com/adopt/tn](https://app.freedompawsinc.com/adopt/tn) |
| Memphis public page | [app.freedompawsinc.com/adopt/tn/memphis-animal-services](https://app.freedompawsinc.com/adopt/tn/memphis-animal-services) |
| Partner portal (listings) | [shelter.freedompawsinc.com/partner/listings](https://shelter.freedompawsinc.com/partner/listings) |
| Email draft | `docs/marketing/outbox/tn-pilot/01-memphis-animal-services-email-1.md` |
| Day 5 follow-up draft | `docs/marketing/outbox/tn-pilot/01-memphis-animal-services-email-2-day5.md` |
