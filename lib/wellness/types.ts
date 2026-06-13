/** Wellness partner surfaces — insurance affiliate + holistic telehealth referral. */

export type WellnessFunnelContext =
  | 'vit_urgent'
  | 'vit_concern'
  | 'vit_prevention'
  | 'id_enroll_complete'
  | 'wellness_hub'
  | 'my_pets';

export type InsurancePartnerConfig = {
  enabled: boolean;
  partnerName: string;
  quoteUrl: string | null;
  lostDogUrl: string | null;
  urgentCareUrl: string | null;
  disclosure: string;
};

export type TelehealthPartnerConfig = {
  enabled: boolean;
  partnerName: string;
  bookUrl: string | null;
  focusNote: string;
  disclosure: string;
};

export type WellnessPartnerConfig = {
  insurance: InsurancePartnerConfig;
  telehealth: TelehealthPartnerConfig;
  ready: boolean;
  philosophyNote: string;
};

export type WellnessPartnersPublic = WellnessPartnerConfig & {
  /** True when at least one partner link is configured for outbound CTAs. */
  hasOutboundLinks: boolean;
};
