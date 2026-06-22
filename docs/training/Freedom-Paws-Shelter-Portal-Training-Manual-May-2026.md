# Freedom Paws — Shelter Portal Training Manual

**Version:** 1.0  
**Date:** May 2026  
**Audience:** Tennessee pilot shelter staff and shelter administrators  
**Portal URL:** https://shelter.freedompawsinc.com/partner  

---

## Table of contents

1. [Welcome & what this portal does](#1-welcome--what-this-portal-does)
2. [Before you start — requirements](#2-before-you-start--requirements)
3. [Signing in — click by click](#3-signing-in--click-by-click)
4. [Partner dashboard overview](#4-partner-dashboard-overview)
5. [Task: Found dog intake](#5-task-found-dog-intake)
6. [Task: Match review queue (admins only)](#6-task-match-review-queue-admins-only)
7. [Task: View adoption listings](#7-task-view-adoption-listings)
8. [Task: Create a new adoption listing](#8-task-create-a-new-adoption-listing)
9. [Task: Edit an existing listing](#9-task-edit-an-existing-listing)
10. [Task: Publish a dog to the public directory](#10-task-publish-a-dog-to-the-public-directory)
11. [Task: Mark a dog as pending or adopted](#11-task-mark-a-dog-as-pending-or-adopted)
12. [Roles: staff vs admin](#12-roles-staff-vs-admin)
13. [Public pages your listings appear on](#13-public-pages-your-listings-appear-on)
14. [Privacy & safety rules](#14-privacy--safety-rules)
15. [Troubleshooting](#15-troubleshooting)
16. [Appendix A — URL quick reference](#appendix-a--url-quick-reference)
17. [Appendix B — Listing status definitions](#appendix-b--listing-status-definitions)
18. [Appendix C — Role permissions matrix](#appendix-c--role-permissions-matrix)
19. [Appendix D — Glossary](#appendix-d--glossary)
20. [Appendix E — Getting help](#appendix-e--getting-help)

---

## 1. Welcome & what this portal does

The **Freedom Paws Partner Portal** is your shelter's workspace for the Tennessee adoption pilot. From one dashboard you can:

| Tool | What it does |
|------|--------------|
| **Found dog intake** | Submit a photo or short video of a found dog; the system searches enrolled pets for possible matches |
| **Match review queue** | *(Admins)* Approve or reject match candidates before any pet owner is contacted |
| **Adoption listings** | Create and manage adoptable dog profiles shown on the public TN directory |

The portal uses the **same database** as the Freedom Paws member app, so ID matching works across all enrolled pets in the network.

---

## 2. Before you start — requirements

- [ ] Your shelter email has been **invited** by Freedom Paws (you receive a welcome email)
- [ ] You use a **smartphone or computer** with a modern browser (Safari, Chrome, Edge)
- [ ] For found intake: ability to take a **clear photo** or **short video** (8 seconds or less) of the dog
- [ ] For listings: at least **one good photo** of each adoptable dog

**Supported browsers:** Safari (iPhone recommended for camera), Chrome, Firefox, Edge.

---

## 3. Signing in — click by click

### First-time sign-in

1. Open **https://shelter.freedompawsinc.com/partner** on your phone or computer.
2. You see the **Partner dashboard** with a green **Sign in →** button.
3. Tap **Sign in →**.
4. You are taken to the login page (`/login?next=/partner`).
5. Type your **work email address** (the one Freedom Paws registered).
6. Tap **Send magic link**.
7. Check your email inbox (and spam folder).
8. **Option A — Magic link:** Tap the link in the email **once**. Use Safari on iPhone if the link does not open correctly inside Gmail.
9. **Option B — 6-digit code:** Return to the login page and enter the **6-digit code** from the same email. Tap **Verify code**.
10. After success, you land on the **Partner dashboard** with your email and role shown.

### Returning sign-in

1. Go to **https://shelter.freedompawsinc.com/partner**
2. If your session expired, tap **Sign in →** and repeat steps 5–10 above.

### Sign-out

- Close the browser tab, or clear site data. There is no separate sign-out button on the partner dashboard in V0.

---

## 4. Partner dashboard overview

After sign-in, the dashboard shows:

| Section | What you see |
|---------|--------------|
| **Header** | "Freedom Paws Adoption Network" · Partner dashboard |
| **Account card** | Your email · Role (`shelter_staff` or `shelter_admin`) · Organization name |
| **Stats grid** *(admins/reviewers only)* | Found reports · Pending reviews · Matched · Pilot partners |
| **Action cards** | Found dog intake · Match review queue · Adoption listings |
| **TN pilot partners list** | All participating shelters in the pilot |

### Main action cards

| Card | Link | Who can use |
|------|------|-------------|
| **Found dog intake →** | `/id/found` | All signed-in staff |
| **Match review queue →** | `/id/match` | Shelter admin + Freedom Paws ops only |
| **Adoption listings →** | `/partner/listings` | All signed-in staff |

---

## 5. Task: Found dog intake

**Purpose:** When your shelter takes in a found dog, submit media so the system can search for enrolled Freedom Paws ID pets.

**Who:** Any signed-in shelter staff or admin.

### Click-by-click instructions

1. From the **Partner dashboard**, tap **Found dog intake →** (amber card).
   - Or go directly to **https://shelter.freedompawsinc.com/id/found**
2. Wait for the page to load pilot shelters (usually pre-selected to your org).
3. **Select shelter** from the dropdown if more than one appears.
4. *(Optional)* Type **notes** — location found, collar color, temperament, etc.
5. **Add media** — choose one method:
   - **Photo from library:** Tap **Choose photo** → pick from camera roll.
   - **Take photo:** Tap **Use camera** → take a clear side or front view of the dog's face.
   - **Video:** Tap **Upload video** → select MP4/MOV/WebM under **25 MB** and **8 seconds or less**.
6. Confirm a **preview** appears on screen.
7. Tap **Submit for matching** (or equivalent submit button).
8. Wait for processing (may take 10–30 seconds).
9. **Review results:**
   - **Candidate count** — how many possible matches were found
   - **Top matches** — pet name, Freedom Paws ID, similarity score
10. If candidates exist, they go to the **Match review queue** for admin approval before any owner contact.

### Photo tips for best matches

- Good lighting, dog facing camera
- Minimal blur; one dog in frame
- Include distinctive markings if visible

### Video tips

- Short clip (3–8 seconds), dog moving or turning head
- Stable camera, good light
- File under 25 MB

### After submission

- You do **not** contact owners directly from this screen.
- An **admin** must approve matches in the review queue.
- Freedom Paws sends owner email only **after approval**.

---

## 6. Task: Match review queue (admins only)

**Purpose:** Human review is required before any pet owner is notified. This protects privacy and prevents false reunions.

**Who:** `shelter_admin` or Freedom Paws operations staff only.  
**Staff without admin role** see a message: *"Match review requires shelter admin or FP ops."*

### Click-by-click instructions

1. From the **Partner dashboard**, tap **Match review queue →** (green card).
   - Or go to **https://shelter.freedompawsinc.com/id/match**
2. The page shows **Review candidates** with a list of found-dog **reports** on the left (or top on mobile).
3. Each report shows: shelter name, date, candidate count, pending count.
4. **Tap a report** to select it.
5. The **candidates panel** loads with:
   - Similarity score (threshold **0.72** for surfacing)
   - Freedom Paws ID
   - Pet name and breed
   - Review status (pending, approved, rejected)
6. Compare the found dog media (if shown) with candidate details.
7. *(Optional)* Type **review notes** in the notes field (internal record).
8. For each candidate, choose one action:
   - Tap **Approve** — if you believe this is a valid match
   - Tap **Reject** — if not a match
   - Tap **Needs more info** — if uncertain (no owner email sent)
9. On **Approve**, watch for confirmation toast:
   - *"Match approved — owner notified by email."* — success
   - *"Match approved — owner email not sent..."* — contact Freedom Paws support
10. Repeat for other pending candidates on the same report.
11. Select the next report in the queue and repeat steps 4–10.

### Important rules

- **Never** call or email an owner yourself using Freedom Paws data unless directed by your admin policy.
- One approved match per found report is typical; reject clearly wrong candidates.
- All decisions are logged for audit.

---

## 7. Task: View adoption listings

**Purpose:** See all dogs your shelter has entered in the adoption system.

### Click-by-click instructions

1. From the **Partner dashboard**, tap **Adoption listings →** (green card).
   - Or go to **https://shelter.freedompawsinc.com/partner/listings**
2. The page header shows **Adoption listings** with a **New listing →** button.
3. Scroll through your listings. Each card shows:
   - Primary photo (or "No photo")
   - Display name
   - Status badge (Draft, Available, Pending, Adopted, Archived)
   - Breed and shelter name
4. On each card:
   - Tap **Edit** — open the edit form
   - Tap **Public page ↗** — *(only if status is Available or Pending)* opens the public adopt page in a new tab

### Empty state

If you see *"No listings yet"*, tap **New listing →** (see Section 8).

---

## 8. Task: Create a new adoption listing

**Purpose:** Add an adoptable dog profile. Draft listings are **private** until an admin publishes them.

**Who:** Any signed-in staff can create drafts. Only **shelter_admin** can set status to Available.

### Click-by-click instructions

1. Go to **Partner → Adoption listings** (Section 7).
2. Tap **New listing →** (green button, top of page).
   - URL: `/partner/listings/new`
3. Fill in the form fields:

   | Field | Instructions |
   |-------|----------------|
   | **Display name** | Dog's public name, e.g. "Buddy" |
   | **Primary breed** | Select from dropdown |
   | **Secondary breed** | Appears only if primary is "Mixed" |
   | **Sex** | Male / Female / Unknown |
   | **Age band** | Puppy / Young / Adult / Senior |
   | **Size** | Small / Medium / Large / Extra large |
   | **Bio** | Short adoption description (personality, needs, good with kids, etc.) |

4. **Add photos:**
   - Tap **Add photo** or **Upload**
   - Select from library or take new photo
   - Wait for upload to complete (compressed automatically)
   - Add multiple photos if desired
   - Tap a photo to set it as **primary** (main image on public page)
5. **Status** *(admin only)*: Leave as **Draft** until ready to publish (Section 10).
6. Tap **Save listing** (bottom of form).
7. You return to the **All listings** page; your new dog appears with **Draft** badge.

### If photo upload fails

- Ensure you are signed in
- Try a smaller image or different browser
- Contact Freedom Paws if error persists

---

## 9. Task: Edit an existing listing

### Click-by-click instructions

1. Go to **Partner → Adoption listings**.
2. Find the dog card and tap **Edit**.
3. Update any fields (name, bio, breeds, photos).
4. To **remove a photo:** tap remove/delete on that thumbnail.
5. To **change primary photo:** tap **Set as primary** on the desired image.
6. Tap **Save listing**.
7. Confirm changes on the listings list.

---

## 10. Task: Publish a dog to the public directory

**Purpose:** Make a dog visible on **https://app.freedompawsinc.com/adopt/tn**

**Who:** **Shelter admin only.** Staff can draft; admin publishes.

### Click-by-click instructions

1. Open the listing via **Edit** (Section 9).
2. Scroll to **Status** dropdown.
3. Change status from **Draft** to **Available**.
4. Ensure at least **one photo** is uploaded and a **primary photo** is set.
5. Tap **Save listing**.
6. Return to listings list — badge should show **Available** (green).
7. Tap **Public page ↗** to verify the dog appears on your shelter's public page.
8. Share the public URL with your marketing team or post to social media.

### What the public sees

- Dogs with status **Available** or **Pending** appear on the TN directory.
- **Draft**, **Adopted**, and **Archived** dogs are **not** shown publicly.

---

## 11. Task: Mark a dog as pending or adopted

### Mark pending (application in progress)

1. **Edit** the listing.
2. Set **Status** to **Pending**.
3. **Save listing**.
4. Dog remains visible on public directory with pending indication.

### Mark adopted (success!)

1. **Edit** the listing.
2. Set **Status** to **Adopted**.
3. **Save listing**.
4. Dog is **removed** from public available list.

### Archive (no longer active)

1. **Edit** the listing.
2. Set **Status** to **Archived**.
3. **Save listing**.

---

## 12. Roles: staff vs admin

| Task | shelter_staff | shelter_admin |
|------|:-------------:|:-------------:|
| Sign in to portal | ✅ | ✅ |
| Found dog intake | ✅ | ✅ |
| Match review / approve | ❌ | ✅ |
| Create draft listing | ✅ | ✅ |
| Upload photos | ✅ | ✅ |
| Publish (Available) | ❌ | ✅ |
| Mark Pending / Adopted | ❌ | ✅ |

If you need admin access, ask your shelter director to contact **Freedom Paws** to upgrade your account role.

---

## 13. Public pages your listings appear on

| Page | URL pattern |
|------|-------------|
| TN directory (all partners) | https://app.freedompawsinc.com/adopt/tn |
| Your shelter page | https://app.freedompawsinc.com/adopt/tn/{your-shelter-slug} |
| Individual dog | https://app.freedompawsinc.com/adopt/tn/{shelter-slug}/{dog-slug} |

Your shelter slug is assigned by Freedom Paws during onboarding (e.g. `memphis-animal-services`).

---

## 14. Privacy & safety rules

1. **No direct owner contact** from found-dog matches until admin approval and system email.
2. **Do not share** Freedom Paws IDs or owner information outside authorized staff.
3. **Photos** of adoptable dogs should not include people's faces without consent.
4. **Accurate bios** — disclose bite history, medical needs, and behavior honestly.
5. Report suspected system errors or inappropriate matches to Freedom Paws immediately.

---

## 15. Troubleshooting

| Problem | What to do |
|---------|------------|
| "Sign in" button keeps appearing | Request new magic link; try 6-digit OTP |
| Magic link won't open | Copy link → paste in Safari |
| Can't see Match review queue | You need shelter_admin role |
| Can't change listing to Available | You need shelter_admin role |
| Photo won't upload | Check connection; try smaller image |
| Video rejected | Must be ≤8 sec, ≤25 MB, MP4/MOV/WebM |
| Dog not on public site | Status must be Available or Pending; wait 1–2 min and refresh |
| Wrong shelter on intake | Select correct shelter from dropdown before submit |

---

## Appendix A — URL quick reference

| Page | URL |
|------|-----|
| Partner dashboard | https://shelter.freedompawsinc.com/partner |
| Login | https://shelter.freedompawsinc.com/login?next=/partner |
| Found intake | https://shelter.freedompawsinc.com/id/found |
| Match queue | https://shelter.freedompawsinc.com/id/match |
| All listings | https://shelter.freedompawsinc.com/partner/listings |
| New listing | https://shelter.freedompawsinc.com/partner/listings/new |
| Public TN adopt | https://app.freedompawsinc.com/adopt/tn |

---

## Appendix B — Listing status definitions

| Status | Meaning | Public visible? |
|--------|---------|:---------------:|
| **Draft** | Work in progress, partner eyes only | No |
| **Available** | Ready for adoption | Yes |
| **Pending** | Application/adoption in progress | Yes |
| **Adopted** | Successfully placed | No |
| **Archived** | Removed from active pipeline | No |

---

## Appendix C — Role permissions matrix

See Section 12 for the full matrix. Summary:

- **Staff** = intake + drafts
- **Admin** = intake + match approval + publish + status changes

---

## Appendix D — Glossary

| Term | Definition |
|------|------------|
| **Freedom Paws ID** | Biometric pet enrollment in the member app |
| **Found report** | A submitted found-dog intake record |
| **Candidate** | A possible ID match above similarity threshold |
| **Match queue** | Admin workflow to approve/reject candidates |
| **Listing** | An adoptable dog profile |
| **TN pilot** | Tennessee shelter adoption network phase |
| **Similarity score** | 0–1 match confidence; 0.72+ surfaces for review |

---

## Appendix E — Getting help

| Need | Contact |
|------|---------|
| Account / role changes | Freedom Paws founder (see welcome email) |
| Technical issues | Same + include screenshot and URL |
| False match / safety concern | Flag immediately in match notes + email support |

**Portal footer reminder:** *Partner portal · shelter.freedompawsinc.com · Same database as member ID matching*

---

*Freedom Paws Wellness © 2026 · Shelter partner training manual · Tennessee pilot*
