import {
  getInsurancePartnerConfig,
  getTelehealthPartnerConfig,
  getWellnessPartnerConfig,
} from '@/lib/wellness/partners';

export type WellnessConfigStatus = {
  insuranceEnabled: boolean;
  insurancePartnerName: string;
  insuranceQuoteUrl: boolean;
  insuranceLostDogUrl: boolean;
  telehealthEnabled: boolean;
  telehealthPartnerName: string;
  telehealthBookUrl: boolean;
  ready: boolean;
  missingForLaunch: string[];
  setupNote: string;
};

export function getWellnessConfigStatus(): WellnessConfigStatus {
  const config = getWellnessPartnerConfig();
  const missingForLaunch: string[] = [];

  if (!config.insurance.quoteUrl && config.insurance.enabled) {
    missingForLaunch.push('NEXT_PUBLIC_FP_INSURANCE_QUOTE_URL');
  }
  if (!config.telehealth.bookUrl && config.telehealth.enabled) {
    missingForLaunch.push('NEXT_PUBLIC_FP_TELEHEALTH_BOOK_URL');
  }
  if (!config.ready) {
    missingForLaunch.push(
      'Set NEXT_PUBLIC_FP_INSURANCE_QUOTE_URL and/or NEXT_PUBLIC_FP_TELEHEALTH_BOOK_URL'
    );
  }

  return {
    insuranceEnabled: config.insurance.enabled,
    insurancePartnerName: config.insurance.partnerName,
    insuranceQuoteUrl: Boolean(config.insurance.quoteUrl),
    insuranceLostDogUrl: Boolean(config.insurance.lostDogUrl),
    telehealthEnabled: config.telehealth.enabled,
    telehealthPartnerName: config.telehealth.partnerName,
    telehealthBookUrl: Boolean(config.telehealth.bookUrl),
    ready: config.ready,
    missingForLaunch,
    setupNote:
      'Wellness partners are affiliate/referral links — no vet license required. Paste partner URLs from your affiliate dashboards into .env.local, then npm run vercel:env:push.',
  };
}

export function getWellnessEnvPreview() {
  const ins = getInsurancePartnerConfig();
  const tel = getTelehealthPartnerConfig();
  return { insurance: ins, telehealth: tel };
}
