# Freedom Paws Wellness Partner Policies — June 2026

Official acceptance standards and recommended financial structures for **insurance affiliate** and **holistic telehealth** partners. Published in-app for affiliate review:

| Page | URL |
|------|-----|
| Partner program hub | `/wellness/partners` |
| Insurance standards | `/wellness/partners/insurance` |
| Telehealth standards | `/wellness/partners/telehealth` |
| JSON API | `/api/wellness/partner-policies` |

**Apply:** partners@freedompawsinc.com

---

## Shared principles (both modules)

1. **Wellness-first** — Freedom Paws educates on prevention, non-toxic nutrition, lifestyle, and protocols. We are not a veterinary clinic and do not prescribe pharmaceutical drugs.
2. **Member value required** — Every partner must offer tangible member savings (discount, credit, or bundled benefit) vs. direct signup.
3. **Transparent disclosure** — FTC-compliant commission disclosure on all affiliate surfaces.
4. **Optional, never blocking** — Partner CTAs never gate core app features (ViT, ID, protocols).
5. **Emergency escalation** — ViT urgent flags (≥80% severe-indicator congruency) always recommend in-person licensed care when indicated.
6. **Right to decline** — Freedom Paws may reject or remove partners misaligned with natural wellness positioning.

---

## Insurance affiliate — financial best practices

### Preferred structures

| Tier | Structure | Minimum |
|------|-----------|---------|
| **Preferred — Rev share** | 15–25% first-year premium OR 8–12% recurring renewal | 12-month attribution; 30-day cookie |
| **Standard — CPA** | $40–$120 per bound policy | Chargeback ≤ 60 days |
| **Member value (required)** | ≥ 5% premium discount OR $25+ equivalent | Via Freedom Paws tracked link |
| **Lost-dog / ID bundle** | Bonus $15–$35 per rider OR +2% rev share | Trackable lost-dog URL |

### Payment terms

- Net-30 with dashboard reporting
- No clawback beyond 60 days without fraud evidence
- Tier upgrades at 500+ enrollments/year

### Acceptance highlights

- Licensed in target states; recognized carrier backing
- Deep links for quote, lost-dog, and urgent-care funnels
- Lost-pet benefit or 90-day roadmap
- No pharma-first co-marketing requirements

---

## Holistic telehealth — financial best practices

### Preferred structures

| Tier | Structure | Minimum |
|------|-----------|---------|
| **Preferred — Per consult** | $15–$35 per completed initial consult | 30-day tracked booking URL |
| **Preferred — Subscription** | 20–30% first 3 months OR 10–15% ongoing | Wellness plans only; disclose renewal |
| **Member value (required)** | ≥ 10% off first consult OR $10–$25 credit | vs. direct booking |
| **Protocol alignment** | Co-branded wellness content (optional) | Featured placement eligibility |

### Payment terms

- Net-30; no pay-per-prescription as primary model
- Partner holds malpractice coverage; Freedom Paws not liable for clinical advice

### Acceptance highlights

- DVM/VMD licensed; CA & TN minimum for pilot
- Integrative / holistic philosophy — not urgent-care-only or pharma-first
- Emergency escalation policy documented
- HIPAA-compliant data handling

---

## Exclusions (both categories)

- Pharmaceutical-first treatment pathways in co-marketing
- Opaque lead-gen without disclosed carrier/provider relationships
- Unverifiable licensing
- Excessive commission clawbacks (> 90 days)
- Messaging that Freedom Paws provides veterinary medical care

---

## Onboarding flow

1. Email partners@freedompawsinc.com with program overview and proposed structure
2. Intro call — mission alignment
3. Legal review — affiliate agreement + disclosures
4. Technical — tracked URLs for Vercel env configuration
5. QA — test ViT, ID enroll, and /wellness funnels
6. Founder approval → live in app

---

## Source of truth in codebase

- `lib/wellness/partner-policies.ts` — structured policy data (powers UI pages)
- `app/components/wellness/PartnerPolicyView.tsx` — affiliate-facing renderer
- `docs/Freedom-Paws-Wellness-Partners-Module-June-2026.md` — technical module docs

---

*Subject to founder approval. Not a binding offer — terms finalized in executed affiliate agreement.*
