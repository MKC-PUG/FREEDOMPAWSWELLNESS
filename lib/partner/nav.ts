/** Partner portal navigation — no consumer shop/wellness routes. */

export const PARTNER_NAV = [
  { label: 'DASHBOARD', href: '/partner' },
  { label: 'LISTINGS', href: '/partner/listings' },
  { label: 'FOUND INTAKE', href: '/id/found' },
  { label: 'MATCH QUEUE', href: '/id/match' },
  { label: 'SIGN IN', href: '/login?next=/partner' },
] as const;
