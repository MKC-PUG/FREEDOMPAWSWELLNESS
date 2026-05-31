# Freedom Paws Wellness
## Symptom Vocabulary Admin Guide

**Document purpose:** Step-by-step instructions for managing the dog symptom vocabulary (lexicon) used by ViT Diagnostics, including password setup, reviewing unknown phrases, approving or rejecting terms, and exporting approved words to production.

**Last updated:** May 2026  
**App version:** Symptom lexicon Layer 1 + review queue

---

## Table of Contents

1. [Overview](#1-overview)
2. [Password setup (required before public launch)](#2-password-setup-required-before-public-launch)
3. [Signing in and signing out](#3-signing-in-and-signing-out)
4. [Checking the vocabulary review queue](#4-checking-the-vocabulary-review-queue)
5. [Approving a phrase](#5-approving-a-phrase)
6. [Rejecting / dismissing a phrase](#6-rejecting--dismissing-a-phrase)
7. [User feedback from diagnostics (“Was this right?”)](#7-user-feedback-from-diagnostics-was-this-right)
8. [Exporting approved words to production (git)](#8-exporting-approved-words-to-production-git)
9. [Testing on iPhone (local network)](#9-testing-on-iphone-local-network)
10. [Troubleshooting](#10-troubleshooting)
11. [Quick reference](#11-quick-reference)

---

## 1. Overview

When a pet owner describes symptoms on the **ViT Diagnostics** page, the app matches their words against a **symptom vocabulary list** (lexicon). Each word or phrase maps to one of your **10 wellness protocols** (e.g. Allergy Shield, Max Movement Pro).

**What happens automatically:**
- Known phrases → matched to the correct protocol
- Unknown phrases → added to a **review queue** for you to check
- Owners can tap **“No — queue for review”** if the AI recommendation seems wrong

**Your job as admin:**
1. Sign in to the review page (password protected)
2. Read each queued phrase
3. **Approve** (add to vocabulary with a protocol) or **Reject** (dismiss)
4. Periodically **export** approved phrases into the main lexicon file and commit to git for production deploys

---

## 2. Password setup (required before public launch)

The review queue must not be public. Set a password on the Mac that runs the app.

### Step 2.1 — Open Terminal on your Mac

Applications → Utilities → Terminal

### Step 2.2 — Go to the project folder

```bash
cd ~/freedompaws-app
```

(Or: `cd /Users/valuedcustomer/freedompaws-app`)

### Step 2.3 — Create your local environment file

If you do not already have `.env.local`:

```bash
cp .env.example .env.local
```

### Step 2.4 — Set the admin password

Open `.env.local` in any text editor (TextEdit, VS Code, Cursor) and add or edit this line:

```
ADMIN_PASSWORD=YourSecurePasswordHere
```

**Choose a strong password** — at least 12 characters, mix of letters, numbers, and symbols. Do not share this file or commit it to git (it is already ignored).

**Example (do not use this exact password):**

```
ADMIN_PASSWORD=FreedomPaws2026!Review
```

Save the file.

### Step 2.5 — Restart the server

Stop any running server (Ctrl+C in Terminal), then:

```bash
npm run start:mobile
```

Wait until you see **✓ Ready**.

### Step 2.6 — Verify password protection

1. On your phone or Mac browser, open:  
   `http://YOUR-MAC-IP:3000/admin/symptoms`  
   (Example: `http://192.168.1.50:3000/admin/symptoms`)
2. You should be redirected to the **Admin Login** page
3. Enter the password you set in `.env.local`
4. You should reach the **Symptom Lexicon Review** page

**Production deploy (Vercel, etc.):** Add the same variable in your host’s environment settings:
- Name: `ADMIN_PASSWORD`
- Value: your secure password

---

## 3. Signing in and signing out

### Sign in

| Item | Value |
|------|--------|
| **Login URL** | `http://YOUR-MAC-IP:3000/admin/login` |
| **Review queue URL** | `http://YOUR-MAC-IP:3000/admin/symptoms` |

Replace `YOUR-MAC-IP` with your Mac’s Wi‑Fi address (e.g. `192.168.1.50`). Find it in **System Settings → Network → Wi‑Fi → Details**.

Enter your `ADMIN_PASSWORD` and tap **Sign in**.

### Sign out

On the review page, tap **Sign out** (top right). This clears your session on that device/browser.

**Tip:** Bookmark the login URL on your phone for quick access while testing.

---

## 4. Checking the vocabulary review queue

After signing in, you see the **Symptom Lexicon Review** page.

### Pending phrases (top section)

Each card shows:

| Field | Meaning |
|-------|---------|
| **Quoted phrase** | The unknown word(s) detected from owner input |
| **Full input** | Everything the owner typed in the symptoms box |
| **AI matched** | Which protocol(s) the app suggested |
| **seen N×** | How many times this phrase has appeared |

If the list is empty: **“No pending phrases — all caught up.”**

### Approved aliases (bottom section)

Lists phrases you already approved, with status:

| Status | Meaning |
|--------|---------|
| **live only — merge pending** | Active on your server now; not yet saved to git for production |
| **in git lexicon** | Exported via `npm run symptom:merge` and ready for production deploy |

### Yellow banner

If you see: *“N approved alias(es) ready to export — run npm run symptom:merge”*  
→ Follow [Section 8](#8-exporting-approved-words-to-production-git) when ready to update production.

---

## 5. Approving a phrase

**When to approve:** The phrase is real owner language for a dog symptom and you know which protocol it belongs to.

### Steps

1. Sign in to `/admin/symptoms`
2. Find the phrase in the **pending** list
3. Use the **dropdown** to select the correct protocol, for example:
   - Itching, rash, scratching → **Allergy Shield**
   - Constipation, nausea, diarrhea → **Buddy's Gut Balance & Cleanse**
   - Stiff joints, limping → **Max Movement Pro**
   - Anxious, pacing → **Freedom Calm**
   - Cloudy eyes, squinting → **Clear Vision Defender**
   - Bad breath, red gums → **Fresh Smile Dental**
   - Tired, coughing, low stamina → **Heart Strong Cardio-Support**
   - Back/spine pain → **Red Light Spine & Joint Support**
   - Liver/kidney, excessive thirst → **Foundation Liver & Kidney Detox**
   - Low immunity, won't eat → **Patriot Defender**
4. Tap **Approve**

**Result:**
- Phrase works **immediately** on your running server for new analyses
- Phrase appears under **Approved aliases** as **“live only — merge pending”**
- Run export (Section 8) before public deploy so production includes it

---

## 6. Rejecting / dismissing a phrase

**When to reject:**
- Typo or nonsense (e.g. random letters)
- Not a symptom (e.g. owner talking about food brand)
- Duplicate of something already covered
- You do not want the app to learn this phrase

### Steps

1. Sign in to `/admin/symptoms`
2. Find the phrase
3. Tap **Reject**

**Result:** Phrase is removed from the pending queue and will not be added to the vocabulary.

---

## 7. User feedback from diagnostics (“Was this right?”)

On the **ViT Diagnostics** page, after **Get AI Recommendation**, owners may see:

- **Yes** — recommendation was helpful (logged silently)
- **No — queue for review** — sends the case back into the review workflow with their suggested protocol (if selected)

**Link for owners (optional):** Diagnostics page includes **“Review symptom queue”** — that link requires admin login; owners will hit the login screen unless they have the password.

---

## 8. Exporting approved words to production (git)

Approved phrases work on your **local/dev server** immediately. For **production** (deployed website), merge them into the main lexicon file and commit to git.

### How often?

- After approving a batch of phrases you want live in production
- Before each major deploy
- Suggested: weekly or after every 5–10 approvals

### Steps (on your Mac)

1. Open Terminal:

```bash
cd ~/freedompaws-app
```

2. Run the merge script:

```bash
npm run symptom:merge
```

3. Review what changed:

```bash
git diff lib/ai/symptom-lexicon.ts
```

4. Commit if it looks correct:

```bash
git add lib/ai/symptom-lexicon.ts
git commit -m "Expand symptom lexicon from review queue"
```

5. Push when ready (to your hosting provider):

```bash
git push
```

6. Redeploy your production site (if not automatic)

**After merge:** Approved items in the admin UI show **“in git lexicon”**.

---

## 9. Testing on iPhone (local network)

### Start the server (Mac)

```bash
cd ~/freedompaws-app
npm run start:mobile
```

Leave Terminal open. Wait for **✓ Ready**.

### URLs on iPhone (same Wi‑Fi as Mac)

| Page | URL |
|------|-----|
| Homepage | `http://192.168.1.50:3000/` |
| ViT Diagnostics | `http://192.168.1.50:3000/diagnostics` |
| Admin login | `http://192.168.1.50:3000/admin/login` |
| Review queue | `http://192.168.1.50:3000/admin/symptoms` |

Replace `192.168.1.50` with your Mac’s actual IP if different.

### Photo upload note

Use **production mode** (`npm run start:mobile`), not `npm run dev`, when testing on phone. Dev mode reloads the page and clears form data.

---

## 10. Troubleshooting

### “Admin not configured” on login page

**Cause:** `ADMIN_PASSWORD` not set or server not restarted.

**Fix:** Set `ADMIN_PASSWORD` in `.env.local`, save, run `npm run start:mobile` again.

### “Invalid password”

**Cause:** Wrong password or typo in `.env.local`.

**Fix:** Check `.env.local`, restart server.

### Review page redirects to login immediately

**Cause:** Session expired or cookies blocked.

**Fix:** Sign in again. Use same browser; avoid private mode if cookies are blocked.

### `EADDRINUSE: address already in use 0.0.0.0:3000`

**Cause:** Old server still running.

**Fix:**

```bash
npm run stop:mobile
npm run start:mobile
```

### Pending queue always empty but owners use odd phrases

**Cause:** Phrases might still match partially, or comma-separated segments matched elsewhere.

**Fix:** Have owner tap **“No — queue for review”** after a bad recommendation, or type unusual phrases alone (e.g. only `keeps shaking head`).

### Approved phrases missing after deploy

**Cause:** Not merged to git before deploy.

**Fix:** Run `npm run symptom:merge`, commit `lib/ai/symptom-lexicon.ts`, redeploy.

### Port / IP changed

Mac IP can change on Wi‑Fi. Check **System Settings → Network → Wi‑Fi** for current address.

---

## 11. Quick reference

### Admin URLs (replace IP)

```
Login:     http://192.168.1.50:3000/admin/login
Review:    http://192.168.1.50:3000/admin/symptoms
Diagnostics: http://192.168.1.50:3000/diagnostics
```

### Terminal commands

| Task | Command |
|------|---------|
| Start server (phone testing) | `npm run start:mobile` |
| Stop server on port 3000 | `npm run stop:mobile` |
| Export approved vocabulary | `npm run symptom:merge` |
| View lexicon file | `lib/ai/symptom-lexicon.ts` |
| Local feedback data (not in git) | `data/symptom-feedback/feedback.json` |

### Workflow summary

```
Owner types symptoms → Unknown phrase detected → Review queue
        ↓
You Approve (pick protocol) or Reject
        ↓
Approve = live on server immediately
        ↓
npm run symptom:merge → git commit → production deploy
```

### Protocol quick map

| Owner might say | Protocol |
|-----------------|----------|
| itch, rash, scratching, hot spot | Allergy Shield |
| constipation, diarrhea, nausea, vomit | Buddy's Gut Balance & Cleanse |
| stiff, limp, arthritis, joint pain | Max Movement Pro |
| anxious, pacing, thunder, scared | Freedom Calm |
| cloudy eyes, squinting, discharge | Clear Vision Defender |
| bad breath, red gums, tartar | Fresh Smile Dental |
| tired, coughing, low stamina | Heart Strong Cardio-Support |
| back pain, spine, IVDD | Red Light Spine & Joint Support |
| liver, kidney, excessive thirst | Foundation Liver & Kidney Detox |
| won't eat, weak immunity, fever | Patriot Defender |

---

## Support notes

- Vocabulary source file: `lib/ai/symptom-lexicon.ts`
- VeNom veterinary terminology (optional future import): https://venomcoding.org/ — free with registration when available
- Educational disclaimer: All recommendations are informational, not veterinary medical advice

---

*Freedom Paws Wellness — Symptom Lexicon Admin Guide*
