# Freedom Paws ID — Found → Match → Owner Email E2E Runbook

**Date:** June 13, 2026  
**Purpose:** Step-by-step proof of **Part C** pilot credibility — unchipped found-dog flow with human review and owner alert  
**Target date:** Before **Oct 1, 2026** shelter pilot  
**Production:** `https://app.freedompawsinc.com`

---

## Prerequisites (verify first)

```bash
curl -s https://app.freedompawsinc.com/api/id/config-status | jq .
```

Required flags:

| Flag | Meaning |
|------|---------|
| `readyForEnroll: true` | Owner can complete biometric wizard |
| `readyForMatchEmail: true` | Resend + service role configured |
| `resendReady: true` | Match approval can email owner |

If any fail, follow [`Freedom-Paws-ID-Supabase-Setup-Checklist.md`](./Freedom-Paws-ID-Supabase-Setup-Checklist.md).

**Login email for testing:** `info@freedompawsinc.com` (or your enrolled owner account)

**Ops reviewer:** Email in `FP_OPS_EMAILS` gets `fp_ops` role for `/id/match`

---

## Roles in this test

| Role | Account | Actions |
|------|---------|---------|
| **Owner** | Magic link login | Enroll pet biometric ID |
| **Shelter intake** | Same or shelter test account | Submit found-dog report |
| **Reviewer** | `FP_OPS_EMAILS` user | Approve match on `/id/match` |
| **Owner inbox** | Owner email | Receives reunion alert |

---

## Part A — Enroll owner pet (if not already done)

- [ ] Sign in: `/login?next=/id/enroll`
- [ ] Complete 9-step wizard for test dog (e.g. **Buddy**)
- [ ] Note **Freedom Paws ID** (e.g. `FP-2D1F1AF0`) and QR slug
- [ ] Open QR card: `/id/p/{slug}` — confirm public card loads
- [ ] Verify enrollment in `/id/settings`

**Pass:** Enrollment status `complete` with embedding stored in Supabase.

---

## Part B — Found-dog intake

- [ ] Open `/id/found` (logged in as shelter/intake user)
- [ ] Upload photo or short video of **same dog** (or similar enrolled pet)
- [ ] Submit intake form with location/notes
- [ ] Confirm success message and report ID returned

**Pass:** Row created in `found_dog_reports`; similarity search runs.

---

## Part C — Match review (human in the loop)

- [ ] Sign in as **FP_OPS** reviewer (`FP_OPS_EMAILS` account)
- [ ] Open `/id/match` (or shelter dashboard → review queue)
- [ ] Confirm candidate appears with similarity score
- [ ] Review descriptors; confirm **not** auto-contacting owner
- [ ] Click **Approve** on correct candidate
- [ ] UI shows approval success

**Pass:** `match_candidates` status = approved; audit log entry written.

---

## Part D — Owner email alert

- [ ] Check owner email inbox (and spam) within 2 minutes
- [ ] Email from `notifications@freedompawsinc.com` (or configured `RESEND_FROM_EMAIL`)
- [ ] Subject/body references Freedom Paws ID match — **no owner PII leaked to reporter**
- [ ] Optional: owner has `alert_email_enabled: false` in settings → email should **not** send

**Pass:** Resend delivery; audit event `match.owner_email.sent`.

---

## Part E — Document for pilot PR

- [ ] Screenshot: found intake
- [ ] Screenshot: match queue with score
- [ ] Screenshot: approval confirmation
- [ ] Screenshot: owner email (redact if sharing publicly)
- [ ] Save date + pet ID in founder log for **first documented E2E**

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| No candidates in queue | Embeddings missing or photo mismatch | Re-enroll; use clearer face/body photo |
| Approve succeeds, no email | `SUPABASE_SERVICE_ROLE_KEY` missing on Vercel | `npm run vercel:env:push` + redeploy |
| Resend error | Domain not verified | Resend dashboard → `freedompawsinc.com` |
| `/id/match` 403 | User not in `FP_OPS_EMAILS` | Add email; re-login |
| Owner email wrong address | Auth email ≠ expected | Check Supabase Auth user email |

---

## After first successful E2E

1. Announce internally — pilot ready for **3 Tennessee shelter LOIs**
2. Use screenshots in shelter one-pager outreach
3. Optional: Reel/post “How Freedom Paws ID match review works” (human approval emphasis)
4. Mark complete in [`Freedom-Paws-Partner-Acquisition-Marketing-Plan-June-13-2026.md`](./Freedom-Paws-Partner-Acquisition-Marketing-Plan-June-13-2026.md) Week 11–12 calendar

---

*Freedom Paws ID — Honor Buddy's Legacy*
