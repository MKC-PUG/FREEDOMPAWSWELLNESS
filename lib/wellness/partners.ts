import type {
  InsurancePartnerConfig,
  TelehealthPartnerConfig,
  WellnessFunnelContext,
  WellnessPartnerConfig,
  WellnessPartnersPublic,
} from '@/lib/wellness/types';

const WELLNESS_PHILOSOPHY =
  'Freedom Paws focuses on holistic wellness — non-toxic nutrition, lifestyle, and our 10 protocols. We are not a veterinary clinic and do not prescribe drugs. When professional triage is indicated, we refer you to licensed veterinarians.';

const INSURANCE_DISCLOSURE =
  'Freedom Paws may earn a commission if you enroll through our partner link. Coverage is provided by the insurer, not Freedom Paws. Compare plans and read policy terms before enrolling.';

const TELEHEALTH_DISCLOSURE =
  'Telehealth partners are independent licensed providers. Consultations are for guidance and triage — not a substitute for in-person emergency care. Freedom Paws does not provide medical diagnosis or treatment.';

function envFlag(key: string, defaultOn = false): boolean {
  const raw = process.env[key]?.trim().toLowerCase();
  if (!raw) return defaultOn;
  return raw === '1' || raw === 'true' || raw === 'yes';
}

function envUrl(key: string): string | null {
  const v = process.env[key]?.trim();
  return v && v.startsWith('http') ? v : null;
}

export function getInsurancePartnerConfig(): InsurancePartnerConfig {
  const quoteUrl = envUrl('NEXT_PUBLIC_FP_INSURANCE_QUOTE_URL');
  const lostDogUrl =
    envUrl('NEXT_PUBLIC_FP_INSURANCE_LOST_DOG_URL') ?? quoteUrl;
  const urgentCareUrl =
    envUrl('NEXT_PUBLIC_FP_INSURANCE_URGENT_URL') ?? quoteUrl;

  const enabled =
    envFlag('NEXT_PUBLIC_FP_INSURANCE_ENABLED', Boolean(quoteUrl)) &&
    Boolean(quoteUrl || lostDogUrl || urgentCareUrl);

  return {
    enabled,
    partnerName:
      process.env.NEXT_PUBLIC_FP_INSURANCE_PARTNER_NAME?.trim() ||
      'Pet insurance partner',
    quoteUrl,
    lostDogUrl,
    urgentCareUrl,
    disclosure: INSURANCE_DISCLOSURE,
  };
}

export function getTelehealthPartnerConfig(): TelehealthPartnerConfig {
  const bookUrl = envUrl('NEXT_PUBLIC_FP_TELEHEALTH_BOOK_URL');

  const enabled =
    envFlag('NEXT_PUBLIC_FP_TELEHEALTH_ENABLED', Boolean(bookUrl)) &&
    Boolean(bookUrl);

  return {
    enabled,
    partnerName:
      process.env.NEXT_PUBLIC_FP_TELEHEALTH_PARTNER_NAME?.trim() ||
      'Holistic veterinary telehealth partner',
    bookUrl,
    focusNote:
      process.env.NEXT_PUBLIC_FP_TELEHEALTH_FOCUS?.trim() ||
      'Holistic and integrative veterinarians — lifestyle, nutrition, and natural wellness aligned with Freedom Paws protocols.',
    disclosure: TELEHEALTH_DISCLOSURE,
  };
}

export function getWellnessPartnerConfig(): WellnessPartnerConfig {
  const insurance = getInsurancePartnerConfig();
  const telehealth = getTelehealthPartnerConfig();
  const ready = insurance.enabled || telehealth.enabled;

  return {
    insurance,
    telehealth,
    ready,
    philosophyNote: WELLNESS_PHILOSOPHY,
  };
}

export function toPublicWellnessConfig(
  config: WellnessPartnerConfig
): WellnessPartnersPublic {
  const hasOutboundLinks =
    (config.insurance.enabled &&
      Boolean(
        config.insurance.quoteUrl ||
          config.insurance.lostDogUrl ||
          config.insurance.urgentCareUrl
      )) ||
    (config.telehealth.enabled && Boolean(config.telehealth.bookUrl));

  return { ...config, hasOutboundLinks };
}

/** Headlines and emphasis per funnel step — wellness-first copy. */
export function wellnessFunnelCopy(context: WellnessFunnelContext): {
  title: string;
  subtitle: string;
  showInsurance: boolean;
  showTelehealth: boolean;
  insuranceLabel: string;
  telehealthLabel: string;
  insuranceHrefKey: 'quoteUrl' | 'lostDogUrl' | 'urgentCareUrl';
} {
  switch (context) {
    case 'vit_urgent':
      return {
        title: 'Professional care may be needed',
        subtitle:
          'ViT flagged signs that warrant licensed veterinary triage. Use telehealth for guidance, or seek in-person urgent care. Insurance can help with unexpected vet costs.',
        showInsurance: true,
        showTelehealth: true,
        insuranceLabel: 'Compare urgent-care coverage',
        telehealthLabel: 'Holistic vet telehealth consult',
        insuranceHrefKey: 'urgentCareUrl',
      };
    case 'vit_concern':
      return {
        title: 'Protect & optimize your dog\'s wellness',
        subtitle:
          'Consider enrolling in Freedom Paws ID, exploring holistic telehealth, and securing coverage before an emergency.',
        showInsurance: true,
        showTelehealth: true,
        insuranceLabel: 'Get a pet insurance quote',
        telehealthLabel: 'Book holistic vet consult',
        insuranceHrefKey: 'quoteUrl',
      };
    case 'id_enroll_complete':
      return {
        title: 'Complete your protection plan',
        subtitle:
          'Your dog\'s biometric ID is active. Add holistic telehealth access and insurance for lost-dog peace of mind and urgent-care savings.',
        showInsurance: true,
        showTelehealth: true,
        insuranceLabel: 'Add lost-dog & emergency coverage',
        telehealthLabel: 'Connect with holistic vet telehealth',
        insuranceHrefKey: 'lostDogUrl',
      };
    case 'my_pets':
    case 'wellness_hub':
      return {
        title: 'Prevention & partner services',
        subtitle:
          'Education, holistic telehealth, and optional insurance — supporting natural wellness, not pharmaceutical care.',
        showInsurance: true,
        showTelehealth: true,
        insuranceLabel: 'Explore pet insurance options',
        telehealthLabel: 'Holistic veterinary telehealth',
        insuranceHrefKey: 'quoteUrl',
      };
    case 'vit_prevention':
    default:
      return {
        title: 'Prevention beats crisis',
        subtitle:
          'Reduce toxicity, address deficiencies, and use our protocols daily. When you want extra support, explore ID enrollment, telehealth, and coverage.',
        showInsurance: true,
        showTelehealth: true,
        insuranceLabel: 'Learn about pet insurance',
        telehealthLabel: 'Holistic wellness consult',
        insuranceHrefKey: 'quoteUrl',
      };
  }
}

/** Map ViT analyze response to funnel context. */
export function vitResultToWellnessContext(input: {
  vetUrgent?: boolean;
  primaryConfidence?: number;
}): WellnessFunnelContext {
  if (input.vetUrgent) return 'vit_urgent';
  if ((input.primaryConfidence ?? 0) >= 72) return 'vit_concern';
  return 'vit_prevention';
}
