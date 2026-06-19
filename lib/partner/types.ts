/** Freedom Paws Adoption Network — partner organization types */

export type PartnerOrgType = 'municipal' | 'county' | 'private';

export type PartnerPilotTier = 'tn_pilot' | 'national' | 'waitlist';

export type PartnerOrg = {
  id: string;
  name: string;
  slug: string;
  orgType: PartnerOrgType;
  city: string | null;
  county: string | null;
  state: string;
  stateCode: string;
  pilotTier: PartnerPilotTier;
  listingsEnabled: boolean;
  website: string | null;
  phone: string | null;
};

export type AppSurface = 'consumer' | 'partner' | 'ops';
