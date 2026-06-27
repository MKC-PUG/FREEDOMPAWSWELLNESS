/** Partner acceptance standards — insurance affiliate & holistic telehealth. */

export type PartnerPolicySection = {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
};

export type FinancialTier = {
  tier: string;
  structure: string;
  minimum: string;
  notes: string;
};

export type PartnerPolicyDoc = {
  slug: 'insurance' | 'telehealth';
  title: string;
  subtitle: string;
  lastUpdated: string;
  contactEmail: string;
  missionAlignment: PartnerPolicySection;
  acceptanceCriteria: PartnerPolicySection;
  financialStructure: {
    intro: string;
    preferred: FinancialTier[];
    requirements: string[];
  };
  brandAndDisclosure: PartnerPolicySection;
  memberExperience: PartnerPolicySection;
  exclusions: PartnerPolicySection;
  onboardingSteps: PartnerPolicySection;
};

const CONTACT = 'partners@freedompawsinc.com';
const UPDATED = 'June 2026';

export const INSURANCE_PARTNER_POLICY: PartnerPolicyDoc = {
  slug: 'insurance',
  title: 'Pet Insurance Affiliate Partner Standards',
  subtitle:
    'Financial structure, acceptance criteria, and best practices for Freedom Paws Wellness insurance affiliates.',
  lastUpdated: UPDATED,
  contactEmail: CONTACT,
  missionAlignment: {
    id: 'mission',
    title: 'Mission alignment',
    body:
      'Freedom Paws is a wellness-first platform — prevention, non-toxic nutrition, lifestyle protocols, and education. We are not a veterinary clinic and do not prescribe pharmaceutical drugs. Insurance partners help members close financial gaps during urgent care and lost-dog events while we continue to promote daily wellness and natural care.',
    bullets: [
      'Support prevention messaging — coverage complements, not replaces, holistic wellness.',
      'Offer transparent policy terms — no hidden exclusions that conflict with our member trust.',
      'Provide tracked affiliate URLs for quote, lost-dog, and urgent-care funnels.',
      'Allow clear FTC-compliant disclosure that Freedom Paws may earn a commission.',
    ],
  },
  acceptanceCriteria: {
    id: 'acceptance',
    title: 'Acceptance criteria',
    body: 'We evaluate pet insurance affiliates against the following minimum standards before listing in the app.',
    bullets: [
      'Licensed to sell pet insurance in target U.S. states (CA, TN pilot first; national expansion later).',
      'A.M. Best or equivalent carrier rating disclosed; policy underwritten by a recognized insurer.',
      'Member-facing quote flow with deep-link or sub-ID tracking for Freedom Paws attribution.',
      'Lost-pet / ID recovery benefit or rider available (or documented roadmap within 90 days).',
      'Emergency & urgent-care coverage clearly explained — not limited to “wellness-only” plans.',
      'No requirement to push pharmaceutical treatment pathways in marketing co-branded with Freedom Paws.',
      'Responsive affiliate support and monthly reporting (clicks, quotes, enrollments, commissions).',
      'Agreement to our brand guidelines and disclosure language on all co-branded surfaces.',
    ],
  },
  financialStructure: {
    intro:
      'Freedom Paws prioritizes structures that align member savings with sustainable platform revenue. Preferred models below — we negotiate case-by-case for pilot partners.',
    preferred: [
      {
        tier: 'Preferred — Rev share',
        structure: '15–25% of first-year premium OR 8–12% recurring on renewal premiums',
        minimum: '12-month attribution window; 30-day cookie minimum',
        notes: 'Best for long-term member alignment. Recurring share strongly preferred.',
      },
      {
        tier: 'Standard — CPA',
        structure: '$40–$120 per bound policy (tiered by plan level)',
        minimum: 'Valid lead + completed enrollment; chargeback window ≤ 60 days',
        notes: 'Acceptable for pilot launch; migrate to rev share when volume supports it.',
      },
      {
        tier: 'Member value — Required',
        structure: 'Exclusive member discount or first-month credit',
        minimum: '≥ 5% premium discount OR equivalent ($25+ value) via Freedom Paws link',
        notes: 'Non-negotiable — members must receive tangible savings vs. direct signup.',
      },
      {
        tier: 'Lost-dog / ID bundle',
        structure: 'Enhanced commission or bonus for lost-pet rider enrollments',
        minimum: 'Trackable lost-dog URL; pairs with Freedom Paws ID enrollment funnel',
        notes: 'Bonus $15–$35 per rider add-on or +2% rev share on bundled plans.',
      },
    ],
    requirements: [
      'Net-30 payment with dashboard access; no clawback beyond 60 days without fraud evidence.',
      'Annual rate review — top partners eligible for tier upgrades at 500+ enrollments/year.',
      'No exclusivity required at pilot stage; category exclusivity negotiable at scale.',
    ],
  },
  brandAndDisclosure: {
    id: 'brand',
    title: 'Brand & disclosure',
    body: 'All affiliate placements must meet FTC and Freedom Paws transparency standards.',
    bullets: [
      'Display: “Freedom Paws may earn a commission if you enroll through our partner link.”',
      'Coverage provided by the insurer — Freedom Paws is not the insurer or claims administrator.',
      'No implied endorsement of specific treatments, drugs, or veterinary clinics.',
      'Use Freedom Paws approved logos only; no alteration of wellness-first positioning.',
      'Outbound links use rel="sponsored noopener noreferrer".',
    ],
  },
  memberExperience: {
    id: 'experience',
    title: 'Member experience requirements',
    body: 'Insurance CTAs appear after ViT concern/urgent flows, ID enrollment, and the wellness hub — always optional, never blocking app features.',
    bullets: [
      'Quote flow mobile-optimized; completes in ≤ 5 minutes median.',
      'Clear comparison of deductibles, reimbursement %, and annual limits.',
      'Lost-dog and emergency coverage explained in plain language.',
      'Customer support phone/chat with ≤ 24h response SLA for member issues.',
    ],
  },
  exclusions: {
    id: 'exclusions',
    title: 'What we will not accept',
    body: 'Partnerships inconsistent with our wellness philosophy are declined.',
    bullets: [
      'Plans that require pharmaceutical treatment pathways in co-marketing.',
      'Opaque lead-generation sites with undisclosed carrier relationships.',
      'Programs without verifiable licensing or carrier backing.',
      'Commission structures with excessive clawbacks (> 90 days) or hidden fees.',
      'Partners that market Freedom Paws as “veterinary medical care.”',
    ],
  },
  onboardingSteps: {
    id: 'onboarding',
    title: 'How to apply',
    body: `Email ${CONTACT} with the subject line “Insurance Affiliate — Freedom Paws”. Include your affiliate program overview, proposed financial structure, tracking link capabilities, and lost-pet/urgent-care product details.`,
    bullets: [
      '1. Intro call — mission alignment & Tennessee pilot geography (expanding after validation).',
      '2. Legal review — affiliate agreement + disclosure approval.',
      '3. Technical — provide quote, lost-dog, and urgent URLs for env configuration.',
      '4. QA — test flows from ViT, ID enroll, and /wellness hub.',
      '5. Launch — listed in app after founder approval.',
    ],
  },
};

export const TELEHEALTH_PARTNER_POLICY: PartnerPolicyDoc = {
  slug: 'telehealth',
  title: 'Holistic Telehealth Partner Standards',
  subtitle:
    'Acceptance criteria and financial best practices for integrative veterinary telehealth partners.',
  lastUpdated: UPDATED,
  contactEmail: CONTACT,
  missionAlignment: {
    id: 'mission',
    title: 'Mission alignment',
    body:
      'Freedom Paws telehealth partners are holistic and integrative licensed veterinarians — focused on lifestyle, nutrition, natural wellness, and prevention. We refer to in-person licensed vets for emergency triage. Telehealth is guidance and wellness planning, not a substitute for emergency care or pharmaceutical-first treatment plans.',
    bullets: [
      'Integrative / holistic veterinary philosophy aligned with our 10 wellness protocols.',
      'Licensed veterinarians (DVM/VMD) in good standing; state telehealth compliance documented.',
      'Emphasis on non-toxic nutrition, environmental lifestyle, and supplementation education.',
      'Clear escalation path to in-person care when urgent signs are present.',
    ],
  },
  acceptanceCriteria: {
    id: 'acceptance',
    title: 'Acceptance criteria',
    body: 'Telehealth partners must meet clinical, legal, and experience standards before app listing.',
    bullets: [
      'Licensed DVM/VMD telehealth platform with multi-state coverage (CA & TN minimum for pilot).',
      'Documented holistic / integrative care approach — not urgent-care-only or pharma-first.',
      'Booking deep-link with Freedom Paws referral tracking.',
      'Consult types include wellness planning, nutrition, behavior, and chronic support — not only prescriptions.',
      'Written policy: emergencies directed to in-person ER; no false reassurance on acute symptoms.',
      'HIPAA-compliant or equivalent data handling; privacy policy linked from booking flow.',
      'Member pricing or first-consult discount via Freedom Paws referral.',
      'Monthly reporting: bookings, consult completion, member satisfaction (if available).',
    ],
  },
  financialStructure: {
    intro:
      'We prefer models that reward quality holistic consults without incentivizing unnecessary visits or pharmaceutical upsells.',
    preferred: [
      {
        tier: 'Preferred — Per consult',
        structure: '$15–$35 referral fee per completed initial consult',
        minimum: 'Attribution via tracked booking URL; 30-day cookie',
        notes: 'Follow-up consults: $5–$15 optional; no fee if consult cancelled by provider.',
      },
      {
        tier: 'Preferred — Subscription share',
        structure: '20–30% of first 3 months membership OR 10–15% ongoing',
        minimum: 'Wellness subscription plans only; disclose renewal terms to members',
        notes: 'Ideal for ongoing holistic care plans aligned with our protocols.',
      },
      {
        tier: 'Member value — Required',
        structure: 'First consult discount or bundled wellness package',
        minimum: '≥ 10% off first consult OR fixed $10–$25 member credit',
        notes: 'Members must save vs. booking directly on partner site.',
      },
      {
        tier: 'Protocol alignment bonus',
        structure: 'Co-branded wellness content or protocol cross-links',
        minimum: 'Optional — non-monetary; strengthens partnership tier',
        notes: 'Partners referencing Gut Balance, Freedom Calm, etc. eligible for featured placement.',
      },
    ],
    requirements: [
      'Net-30 payment; transparent fee schedule in affiliate agreement.',
      'No pay-per-prescription models as primary compensation structure.',
      'Freedom Paws not liable for medical advice — partner holds malpractice coverage.',
    ],
  },
  brandAndDisclosure: {
    id: 'brand',
    title: 'Brand & disclosure',
    body: 'Telehealth listings must clearly distinguish Freedom Paws education from partner clinical services.',
    bullets: [
      'Display: “Telehealth partners are independent licensed providers. Not a substitute for emergency care.”',
      'Freedom Paws does not provide diagnosis or treatment.',
      'No co-marketing that implies Freedom Paws is a veterinary practice.',
      'ViT urgent flags always recommend in-person care when severe indicators meet threshold.',
    ],
  },
  memberExperience: {
    id: 'experience',
    title: 'Member experience requirements',
    body: 'Telehealth CTAs appear in wellness hub, ViT results, ID completion, and My Pets — optional referral paths.',
    bullets: [
      'Booking completes in ≤ 3 taps from app partner link.',
      'First-available holistic vet within stated SLA (e.g., ≤ 24–48 hours).',
      'Video or async consult options; mobile-friendly.',
      'Post-consult summary shareable by member (optional, privacy-preserving).',
    ],
  },
  exclusions: {
    id: 'exclusions',
    title: 'What we will not accept',
    body: 'Partners misaligned with wellness-first positioning are not listed.',
    bullets: [
      'Telehealth services primarily driven by prescription fulfillment or pharma partnerships.',
      'Providers without verifiable veterinary licensure.',
      'Platforms that discourage in-person ER referral for acute emergencies.',
      'Compensation tied exclusively to pharmaceutical product sales.',
      'Partners marketing “replace your vet entirely” messaging.',
    ],
  },
  onboardingSteps: {
    id: 'onboarding',
    title: 'How to apply',
    body: `Email ${CONTACT} with the subject line “Telehealth Partner — Freedom Paws”. Include licensure overview, holistic care philosophy, booking tracking capabilities, and proposed referral fee structure.`,
    bullets: [
      '1. Intro call — integrative care alignment & state coverage.',
      '2. Clinical review — escalation policies & emergency disclaimers.',
      '3. Legal — affiliate/referral agreement + HIPAA acknowledgment.',
      '4. Technical — provide tracked booking URL for env configuration.',
      '5. Launch — listed after QA from /wellness and ViT funnel.',
    ],
  },
};

export const PARTNER_POLICIES = {
  insurance: INSURANCE_PARTNER_POLICY,
  telehealth: TELEHEALTH_PARTNER_POLICY,
} as const;

export type PartnerPolicySlug = keyof typeof PARTNER_POLICIES;

export function getPartnerPolicy(slug: string): PartnerPolicyDoc | null {
  if (slug === 'insurance' || slug === 'telehealth') {
    return PARTNER_POLICIES[slug];
  }
  return null;
}
