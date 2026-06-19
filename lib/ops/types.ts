export type MarketingWorkflowKey = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i';

export type MarketingWorkflows = Record<MarketingWorkflowKey, boolean>;

export type MarketingAutomationSettings = {
  emergencyStop: boolean;
  masterEnabled: boolean;
  workflows: MarketingWorkflows;
  partnerApprovals: Record<string, boolean>;
  n8nWebhookUrl: string | null;
};

export type FeatureFlags = {
  adoptDirectoryPublic: boolean;
  waitlistOpen: boolean;
  photoboothEnabled: boolean;
};

export type ListingStatusCounts = {
  draft: number;
  available: number;
  pending: number;
  adopted: number;
  archived: number;
  total: number;
};

export type OpsPartnerRow = {
  id: string;
  name: string;
  slug: string;
  orgType: string;
  city: string | null;
  listingsEnabled: boolean;
  listingCount: number;
  availableCount: number;
  approvedForOutreach: boolean;
  draftEmailPath: string | null;
  publicUrl: string;
  partnerPortalUrl: string;
};

export type OpsAuditRow = {
  id: string;
  action: string;
  resourceType: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type OpsOverview = {
  generatedAt: string;
  userEmail: string | null;
  pwaVersion: string;
  marketing: MarketingAutomationSettings;
  marketingCanSend: boolean;
  featureFlags: FeatureFlags;
  adoption: {
    tnPilotPartners: number;
    sheltersWithListings: number;
    listingCounts: ListingStatusCounts;
    partners: OpsPartnerRow[];
  };
  shelterId: {
    totalReports: number;
    pendingReviews: number;
    matchedReports: number;
    totalEnrollments: number;
    pilotShelters: number;
  };
  growth: {
    waitlistSignups: number | null;
  };
  wellness: {
    insuranceEnabled: boolean;
    insurancePartnerName: string;
    insuranceQuoteUrl: boolean;
    insuranceLostDogUrl: boolean;
    telehealthEnabled: boolean;
    telehealthPartnerName: string;
    telehealthBookUrl: boolean;
    ready: boolean;
    missingForLaunch: string[];
  };
  product: {
    pwaVersion: string;
    symptomAdminConfigured: boolean;
  };
  shop: {
    xummReady: boolean;
    stripeReady: boolean;
  };
  system: {
    supabaseReady: boolean;
    resendReady: boolean;
    matchEmailReady: boolean;
    fpOpsEmails: boolean;
    serviceRoleKey: boolean;
    migrationsNote: string;
  };
  recentAudit: OpsAuditRow[];
};

export const MARKETING_WORKFLOW_LABELS: Record<
  MarketingWorkflowKey,
  { name: string; sendsEmail: boolean; description: string }
> = {
  a: { name: 'A — CRM sync', sendsEmail: false, description: 'Nightly CRM hygiene into Google Sheets' },
  b: { name: 'B — Fit scoring', sendsEmail: false, description: 'Batch AI fit scores for ★★★ contacts' },
  c: { name: 'C — Draft generation', sendsEmail: false, description: 'Create outreach drafts when Status=Research' },
  d: {
    name: 'D — Send sequence',
    sendsEmail: true,
    description: 'Sends Email 1–3 when Approved=YES (requires master + no emergency stop)',
  },
  e: { name: 'E — Reply triage', sendsEmail: false, description: 'Classify inbound replies → Slack' },
  f: { name: 'F — Social factory', sendsEmail: false, description: 'Weekly Buffer queue from live listings' },
  g: {
    name: 'G — Post-adoption drip',
    sendsEmail: true,
    description: 'Day 0/3/7/14 emails after adopted status',
  },
  h: { name: 'H — KPI weekly', sendsEmail: false, description: 'Monday metrics summary to Slack' },
  i: { name: 'I — Listing spotlight', sendsEmail: false, description: 'Daily new listing social posts' },
};

export const DEFAULT_MARKETING_SETTINGS: MarketingAutomationSettings = {
  emergencyStop: true,
  masterEnabled: false,
  workflows: {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
  },
  partnerApprovals: {},
  n8nWebhookUrl: null,
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  adoptDirectoryPublic: true,
  waitlistOpen: true,
  photoboothEnabled: true,
};
