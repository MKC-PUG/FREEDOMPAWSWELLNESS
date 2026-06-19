/** Freedom Paws Ops Command Center navigation */

export const OPS_NAV = [
  { label: 'COMMAND', href: '/ops', exact: true },
  { label: 'ADOPTION', href: '/ops/adoption' },
  { label: 'MARKETING', href: '/ops/marketing' },
  { label: 'SHELTER & ID', href: '/ops/shelter-id' },
  { label: 'WELLNESS', href: '/ops/wellness' },
  { label: 'PRODUCT', href: '/ops/product' },
  { label: 'SYSTEM', href: '/ops/system' },
] as const;

export const OPS_QUICK_LINKS = [
  { label: 'Partner portal', href: '/partner' },
  { label: 'Public adopt TN', href: '/adopt/tn', external: false },
  { label: 'Match queue', href: '/id/match' },
  { label: 'Symptom admin', href: '/admin/symptoms' },
] as const;
