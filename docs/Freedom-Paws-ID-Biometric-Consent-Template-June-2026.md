# Freedom Paws ID — Biometric Consent Template

**Version:** `2026-06-10` (matches `lib/id/consent.ts`)  
**Status:** Draft for attorney review — do not publish as final legal text without counsel  
**Used in:** `{APP}/id/enroll` step 2 · Framer privacy block · shelter DPA appendix

---

## A. Owner-facing consent (in-app)

Display verbatim or with counsel-approved edits. Checkbox must be unchecked by default; enrollment cannot proceed without affirmative consent.

---

### Freedom Paws Biometric ID Consent (v2026-06-10)

I understand that:

1. **Purpose.** Freedom Paws will analyze photos and/or video of my dog to create identity descriptors and mathematical embeddings for **lost-dog matching** with participating shelters.

2. **Not a license.** Freedom Paws ID is **not** a government pet license, official identification, or proof of ownership in court.

3. **Not veterinary advice.** Vision analysis is for identity and wellness features only — not diagnosis or treatment.

4. **Human review.** Match results require **shelter staff review** before any contact attempt. I will not receive owner-contact details of other pets.

5. **Data use.** My pet's biometric data is used for reunion matching, my account features, and audit/security logs I enable. It is **not** sold to third-party advertisers.

6. **Storage.** Data is stored on secure servers (Supabase / US region). Embeddings use pgvector; media retained per enrollment record.

7. **Revocation.** I may revoke consent and request deletion of biometric embeddings and capture media at **ID Settings** (`{APP}/id/settings`). Revocation removes my pet from active match search.

8. **Accuracy limits.** False matches and false non-matches are possible. I agree to verify identity in person before releasing a dog to any claimant.

9. **Alerts.** I may enable or disable email alerts when an approved potential match is found.

10. **Age & authority.** I confirm I am 18+ and am the pet's owner or authorized agent with permission to submit these images.

**By checking this box and continuing enrollment, I agree to this Biometric ID Consent.**

---

## B. Short-form disclosure (Framer / marketing)

Use on `/freedom-paws-id-toolbox` and app footers:

> **Biometric enrollment requires your explicit consent.** Freedom Paws analyzes pet photos/video to help shelters reunite lost dogs. This is not a government pet license. Match results are reviewed by humans before owner contact. You can revoke biometric data anytime in the app.

---

## C. Shelter Data Processing Addendum (outline)

*Attorney to expand into full DPA.*

| Topic | Freedom Paws commitment |
|-------|-------------------------|
| Role | Freedom Paws = processor for shelter intake media; shelter = controller for intake operations |
| Subprocessors | Supabase, OpenAI (vision/embeddings), Resend (email), Vercel (hosting) |
| Retention | Found-dog intake media retained per pilot policy (recommend 12 months unless case open) |
| Deletion | Owner revocation removes enrollment embeddings; shelter may request intake deletion via FP ops |
| Security | TLS in transit; RLS on Supabase tables; no public owner PII on QR cards |
| Breach | Notify shelter within 72 hours of confirmed breach affecting pilot data |
| Pilot scope | CA/TN shelters only through Dec 31, 2026 unless extended in writing |

---

## D. Implementation checklist

- [ ] Attorney review of sections A–C  
- [ ] Version string synced: `BIOMETRIC_CONSENT_VERSION` in `lib/id/consent.ts`  
- [ ] Framer privacy block updated (Decision H)  
- [ ] Shelter pilot packet includes signed DPA + this consent reference  
- [ ] Re-consent flow if version bumps post-pilot  

---

*Freedom Paws ID — draft template June 2026*
