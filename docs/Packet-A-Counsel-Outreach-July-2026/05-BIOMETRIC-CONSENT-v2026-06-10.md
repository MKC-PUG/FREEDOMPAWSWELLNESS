# Freedom Paws ID — Biometric Consent Package (v2026-06-10)

**In-app version string:** `BIOMETRIC_CONSENT_VERSION = '2026-06-10'`  
**Source:** `lib/id/consent.ts`  
**Template doc:** `docs/Freedom-Paws-ID-Biometric-Consent-Template-June-2026.md`  
**Live enroll:** https://app.freedompawsinc.com/id/enroll  
**Revoke:** https://app.freedompawsinc.com/id/settings  
**Status:** Draft for attorney review (Packet A5 / B5)  
**Not legal advice.**

---

## A. Exact in-app consent text (shipped)

Verbatim from `lib/id/consent.ts`:

```
Freedom Paws Biometric ID Consent (v2026-06-10)

I understand that:
• Freedom Paws will analyze photos/video of my dog to create identity descriptors for lost-dog matching.
• This is not a government pet license and not veterinary advice.
• Match results require human review before any owner contact.
• I may revoke consent and request deletion of biometric data in ID settings.
• My data is stored securely and used only for reunion and account features I enable.
```

---

## B. Expanded owner-facing template (for counsel redline)

*From Biometric Consent Template June 2026 — longer form for DPA appendix / counsel expansion. In-app currently ships the short form in Section A.*

### Freedom Paws Biometric ID Consent (v2026-06-10)

I understand that:

1. **Purpose.** Freedom Paws will analyze photos and/or video of my dog to create identity descriptors and mathematical embeddings for **lost-dog matching** with participating shelters.

2. **Not a license.** Freedom Paws ID is **not** a government pet license, official identification, or proof of ownership in court.

3. **Not veterinary advice.** Vision analysis is for identity and wellness features only — not diagnosis or treatment.

4. **Human review.** Match results require **shelter staff review** before any contact attempt. I will not receive owner-contact details of other pets.

5. **Data use.** My pet's biometric data is used for reunion matching, my account features, and audit/security logs I enable. It is **not** sold to third-party advertisers.

6. **Storage.** Data is stored on secure servers (Supabase / US region). Embeddings use pgvector; media retained per enrollment record.

7. **Revocation.** I may revoke consent and request deletion of biometric embeddings and capture media at **ID Settings** (`/id/settings`). Revocation removes my pet from active match search.

8. **Accuracy limits.** False matches and false non-matches are possible. I agree to verify identity in person before releasing a dog to any claimant.

9. **Alerts.** I may enable or disable email alerts when an approved potential match is found.

10. **Age & authority.** I confirm I am 18+ and am the pet's owner or authorized agent with permission to submit these images.

**By checking this box and continuing enrollment, I agree to this Biometric ID Consent.**

*(Checkbox must be unchecked by default; enrollment cannot proceed without affirmative consent.)*

---

## C. Short-form disclosure (Framer / marketing)

> **Biometric enrollment requires your explicit consent.** Freedom Paws analyzes pet photos/video to help shelters reunite lost dogs. This is not a government pet license. Match results are reviewed by humans before owner contact. You can revoke biometric data anytime in the app.

---

## D. Shelter Data Processing Addendum — outline only (A8)

*Attorney to expand into full DPA. Not executed in Packet A.*

| Topic | Freedom Paws commitment |
|-------|-------------------------|
| Role | Freedom Paws = processor for shelter intake media; shelter = controller for intake operations |
| Subprocessors | Supabase, OpenAI (vision/embeddings), Resend (email), Vercel (hosting) |
| Retention | Found-dog intake media retained per pilot policy (recommend 12 months unless case open) |
| Deletion | Owner revocation removes enrollment embeddings; shelter may request intake deletion via FP ops |
| Security | TLS in transit; RLS on Supabase tables; no public owner PII on QR cards |
| Breach | Notify shelter within 72 hours of confirmed breach affecting pilot data |
| Pilot scope | Tennessee shelters only through Dec 31, 2026 unless extended in writing |

---

## Counsel questions (from Packet A)

1. Is in-app consent (v2026-06-10 short form) sufficient for TN pilot, or must the expanded template ship before `shelter_admin` intake?
2. Is a separate shelter DPA required before first municipal partner go-live, or is the outline + consent enough for Phase A?
3. Any additional disclosure needed beyond Privacy “AI & vision processing” for OpenAI?

*Freedom Paws ID — Packet A biometric consent export · July 2026*
