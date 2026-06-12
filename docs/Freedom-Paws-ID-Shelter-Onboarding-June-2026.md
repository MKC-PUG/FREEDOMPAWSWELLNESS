# Freedom Paws ID — Shelter Onboarding Guide (CA / TN Pilot)

**Version:** 1.0 · June 2026  
**Audience:** Shelter directors, intake staff, FP ops  
**Pilot target:** Oct 1, 2026 · California & Tennessee

---

## 1. What Freedom Paws ID does (biometric first)

Freedom Paws ID helps reunite **unchipped or unregistered** dogs using phone-camera vision — eyes, face, body, posture, and gait — not implanted microchips.

| Step | Who | Action |
|------|-----|--------|
| Enroll | Owner | 9-step wizard at `{APP}/id/enroll` with explicit biometric consent |
| Found | Shelter staff | Photo/video intake at `{APP}/id/found` |
| Match | Shelter admin / FP ops | Human review at `{APP}/id/match` before owner contact |
| Alert | Owner | Email when a match is **approved** (can disable in `{APP}/id/settings`) |

**Not a government pet license.** Not veterinary advice. Owner PII never appears on public QR cards.

---

## 2. Pilot prerequisites

### Shelter account setup

1. Shelter contact requests pilot access from Freedom Paws (founder / FP ops).
2. FP ops creates shelter row in Supabase `shelters` table (name, state `CA` or `TN`, contact email).
3. Staff emails added to `FP_OPS_EMAILS` env **or** `user_profiles.role` set to `shelter_admin` for match review.
4. Each staff member signs in via magic link: `{APP}/login?next=/id/shelter`.

### Technical

- Run Supabase migrations `001` → `004` before pilot.
- `OPENAI_API_KEY` on Vercel (vision + embeddings).
- Optional: `RESEND_API_KEY` for owner match emails.

---

## 3. Daily workflow

### A. Found dog intake

1. Open **Shelter portal** → `{APP}/id/shelter` → **Found dog intake**.
2. Upload clear photo **or** short gait video (side view, 5–15 seconds).
3. System runs similarity search against enrolled pets (threshold default **0.72** — founder decision pending).
4. Candidates appear in the **Match review queue** — status `pending`.

**Tips for better matches**

- Bright, even lighting; minimize motion blur.
- Capture face + body when possible; gait video helps distinguish look-alikes.
- Note intake location and date in the form.

### B. Match review (shelter_admin or fp_ops only)

1. Open `{APP}/id/match`.
2. For each candidate, compare similarity score, region quality, and intake photo.
3. **Approve** only when staff is confident — triggers owner email (if alerts enabled).
4. **Reject** when uncertain — no owner contact; audit log records decision.

**Policy:** Never contact owners directly from intake photos without approved match in the system.

### C. Owner reunion handoff

- Approved match email includes Freedom Paws ID reference and shelter name — **not** full owner phone on public pages.
- Shelter coordinates pickup per your existing lost/found policy.
- Document outcome in your shelter CMS; FP audit log retains review trail.

---

## 4. Roles

| Role | Access |
|------|--------|
| `owner` | Enroll, settings, public QR card |
| `shelter_staff` | Found intake, shelter dashboard |
| `shelter_admin` | Found intake + match review |
| `fp_ops` | Full match review + audit log read (future UI) |

Set `FP_OPS_EMAILS=dir@your-shelter.org,ops@freedompawsinc.com` in Vercel for auto-promotion on first login.

---

## 5. Privacy & data handling

- Biometric embeddings stored in Supabase + pgvector; enrollment media in `enrollment_media`.
- Owners may **revoke** biometric data at `{APP}/id/settings` — removes embeddings from search.
- Public pet card `{APP}/id/p/{slug}` shows pet name + reunion status only — no owner address.
- Shelter DPA template: see `Freedom-Paws-ID-Biometric-Consent-Template-June-2026.md` (legal review required).

---

## 6. Pilot success metrics (Oct–Dec 2026)

| Metric | Target |
|--------|--------|
| Shelters live | 3 CA + 3 TN minimum |
| Enrollments | 50+ owner enrollments |
| Found reports | 20+ intake tests |
| Approved matches | 3+ verified reunions or high-confidence near-misses documented |
| False positive rate | &lt; 5% of approvals (staff-tracked) |

---

## 7. Support & escalation

| Issue | Contact |
|-------|---------|
| Login / magic link | Check spam; verify Supabase Auth email provider |
| No match candidates | Lower-quality intake — retake; verify enrollments exist in region |
| Owner email not sent | Check `RESEND_*` env; owner may have disabled alerts |
| Role / access | FP ops updates `user_profiles` |

---

## 8. Track 2 preview (after biometric pilot)

- `{APP}/id/scan` — Bluetooth LF RFID scanner
- `{APP}/id/lookup` — AAHA / AVID registry routing
- `{APP}/id/kit` — Scanner kit (~$129 recommended)

Phones **cannot** read implanted chips — hardware required for Track 2.

---

*Freedom Paws ID — Honor Buddy's Legacy*
