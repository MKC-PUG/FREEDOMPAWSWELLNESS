# Today Session — Founder Checklists (T1–T5)

**Date:** June 14, 2026  
**Production app:** https://app.freedompawsinc.com  
**Master list:** `Freedom-Paws-Launch-Master-Checklist-June-2026.md`

Check off each box as you complete it. Engineering items (deploy v66, help page, admin SOP) ship in the same repo push.

---

## T1 — ViT production test (iPhone)

**URL:** https://app.freedompawsinc.com/diagnostics  
**Time:** ~10 minutes · **Same Wi‑Fi or cellular OK**

### Steps

- [ ] Open installed **Freedom Paws** PWA (or Safari → app URL)
- [ ] Tap **Refresh now** if update banner shows (target **v66** after deploy)
- [ ] Tap **Choose photo** → pick a clear dog photo
- [ ] Enter symptoms, e.g. `stiff joints, slow to stand, senior`
- [ ] Tap **Get AI Recommendation**
- [ ] Wait for results — confirm **top 2 protocols** + **visual observations** appear
- [ ] Confirm **confidence bars** and protocol links show
- [ ] Scroll to **“Was this helpful?”** → tap **Yes**
- [ ] Confirm message: *Thanks — your feedback helps improve ViT Diagnostics*
- [ ] Optional second run: tap **No — queue for review** → pick a protocol → confirm no error toast

### Pass criteria

| Check | Pass? |
|-------|-------|
| Analysis completes (no “Analysis failed”) | ☐ |
| Visual observations present | ☐ |
| Feedback Yes/No works | ☐ |
| PWA version label visible on page | ☐ |

**If fail:** Note exact error text → send to Cursor session (check Vercel `OPENAI_API_KEY`).

---

## T2 — Admin symptom queue

**Login:** https://app.freedompawsinc.com/admin/login  
**Queue:** https://app.freedompawsinc.com/admin/symptoms  

**Password:** Your `ADMIN_PASSWORD` (Vercel env — same as local `.env.local`)

### Steps

- [ ] Sign in at `/admin/login`
- [ ] Open `/admin/symptoms`
- [ ] Review **Pending phrases** (if any)
- [ ] For each real symptom: pick protocol from dropdown → **Approve**
- [ ] For typos/noise: **Reject**
- [ ] If yellow banner shows approved aliases ready: note count for weekly merge

### Weekly SOP (ongoing)

| When | Action |
|------|--------|
| **Weekly (e.g. Monday)** | Sign in → review pending → approve/reject |
| **After 5+ approvals** | Ask engineering to run `npm run symptom:merge` + deploy |
| **Before public launch** | Confirm `ADMIN_PASSWORD` set on Vercel Production |

Full guide: `Freedom-Paws-Symptom-Lexicon-Admin-Guide.md` · Section 12 (weekly SOP).

---

## T3 — Photo Booth iPhone sign-off

**URL:** https://app.freedompawsinc.com/photobooth  
**Time:** ~20 minutes · **First cutout needs Wi‑Fi**

### Checklist

- [ ] Upload pet photo
- [ ] Tap **✨ Remove background (beta)** — wait for first model download
- [ ] Confirm cutout looks tight (not tall empty box)
- [ ] Pick **Lake Legend** — pet on scene
- [ ] Tap **↩ Change background** — pick another theme
- [ ] Tap **Restore original** — full photo returns
- [ ] Tap **✨ AI Magic Look** → pick one costume → wait ~20 sec → costume applies
- [ ] Confirm credits show (e.g. “4 left this month” after one run)
- [ ] Tap **✨ Add accessory** → add hat or bandana → drag to fit
- [ ] Tap **Picture frame** → type print headline → share preview looks OK
- [ ] **Share** → send to Messages (or cancel after preview)
- [ ] **Save** → check Photos app
- [ ] **Me & My Pup** → add your selfie → pick frame → share test
- [ ] Open **Help** from booth → confirm steps match what you used

### Pass criteria

| Check | Pass? |
|-------|-------|
| Cutout + restore | ☐ |
| AI Magic Look completes | ☐ |
| Share + Save work | ☐ |
| Me & My Pup duo card | ☐ |

---

## T4 — Phase 4 assets (Canva Pro)

**Guide:** `Photo-Booth-Phase-4-Real-Assets-June-2026.md`  
**Image sourcing rules:** Same doc → **Image sourcing checklist** section

### Minimum first batch (save to Mac, then send to engineering)

Export **JPG 1200×900** from Canva Pro. Name **exactly**:

- [ ] `bg-holiday-christmas.jpg` — house with Christmas lights
- [ ] `bg-holiday-halloween.jpg` — spooky decorated yard
- [ ] `bg-ocean-boat.jpg` — boat deck / open water
- [ ] `bg-landmark-liberty.jpg` — harbor / Statue of Liberty view
- [ ] Optional: `bg-holiday-thanksgiving.jpg`, `bg-landmark-golden-gate.jpg`

**Optional props (PNG transparent):**

- [ ] `prop-santa-hat.png`
- [ ] `prop-bandana-usa.png`

### Drop folder (engineering)

`public/images/photobooth/backgrounds/`  
`public/images/photobooth/stickers/`

### Asset log (copy one row per file)

| Filename | Source (Canva search) | Date |
|----------|----------------------|------|
| bg-holiday-christmas.jpg | | |
| bg-holiday-halloween.jpg | | |

---

## T5 — Framer CTAs + ID page

**Full map:** `Framer-CTA-Link-Map.md` Section 14  
**Framer site:** https://freedompawsinc.com  
**App base:** `https://app.freedompawsinc.com` — **New tab: OFF** for all app links

### Homepage (quick pass)

- [ ] ViT / Diagnostics CTA → `https://app.freedompawsinc.com/diagnostics`
- [ ] Photo Booth CTA → `https://app.freedompawsinc.com/photobooth`
- [ ] My Pets CTA → `https://app.freedompawsinc.com/mypets`
- [ ] Token Shop CTA → `https://app.freedompawsinc.com/token-shop`
- [ ] **Publish** Framer site

### ID & Tool Box page (`/freedom-paws-id-toolbox`)

**Copy (Section 14 table A)**

- [ ] Rename hero **Upload** → **Add your pet in the app**
- [ ] Soften auto-enroll, IPFS, real-time alerts → “planned” / “coming soon”
- [ ] Live demo → **Try ViT AI Now** (not lost-dog match)
- [ ] Add biometric consent line + not a government license

**Links (Section 14 table B)**

- [ ] **Add your pet in the app** → `{APP}/mypets`
- [ ] **Enroll Freedom Paws ID** → `{APP}/id/enroll`
- [ ] Medical Records / Vaccinations / Daily Notes → `{APP}/mypets`
- [ ] ViT Scans / Try Live AI Demo → `{APP}/diagnostics`
- [ ] Shop CTA → `{APP}/token-shop`
- [ ] Explore Protocols → `/protocol-overview` (Framer)
- [ ] **Publish**

### iPhone test (6 taps)

| # | Tap | Must open |
|---|-----|-----------|
| 1 | Add your pet in the app | app/mypets |
| 2 | Try Live AI Demo | app/diagnostics |
| 3 | Medical Records | app/mypets |
| 4 | Explore All Protocols | Framer protocol overview |
| 5 | Shop / lifetime access | app/token-shop |
| 6 | Nav ID & Tool Box | stays on Framer ID page |

---

## When all five are done

| Track | Status |
|-------|--------|
| T1 ViT prod | ☐ Complete |
| T2 Admin queue | ☐ Complete |
| T3 Photo Booth QA | ☐ Complete |
| T4 Canva assets | ☐ Complete (or in progress — send files when ready) |
| T5 Framer CTAs | ☐ Complete |

**Next engineering focus:** ID Track 2 `/id/scan` after hardware order (`Freedom-Paws-ID-Track-2-Supplies-Shopping-Guide-June-2026.md`).

---

*Freedom Paws Wellness — Honor Buddy's Legacy*
