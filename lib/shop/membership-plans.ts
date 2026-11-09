import { CANONICAL_USD, FALLBACK_XRP } from '@/lib/shop/pricing';

export const MEMBERSHIP_PLAN_IDS = ['founding_annual', 'annual', 'monthly', 'pass'] as const;

export type MembershipPlanId = (typeof MEMBERSHIP_PLAN_IDS)[number];

export const FOUNDING_LAST_DAY = '2027-04-30';

export const PLAN_AMOUNT_USD: Record<MembershipPlanId, number> = {
  founding_annual: 79,
  annual: 99,
  monthly: 12,
  pass: 29,
};

export const PLAN_LABEL: Record<MembershipPlanId, string> = {
  founding_annual: 'Founding Annual Membership',
  annual: 'Annual Membership',
  monthly: 'Monthly Membership',
  pass: 'Protocol Pass',
};

const PRICE_ENV: Record<MembershipPlanId, string> = {
  founding_annual: 'STRIPE_PRICE_FOUNDING_ANNUAL',
  annual: 'STRIPE_PRICE_ANNUAL',
  monthly: 'STRIPE_PRICE_MONTHLY',
  pass: 'STRIPE_PRICE_PASS',
};

export function isMembershipPlanId(value: string | null | undefined): value is MembershipPlanId {
  return Boolean(value && (MEMBERSHIP_PLAN_IDS as readonly string[]).includes(value));
}

export function isMembershipPlan(plan: MembershipPlanId): boolean {
  return plan !== 'pass';
}

/** Calendar date in America/Chicago, YYYY-MM-DD. Founding ends after April 30, 2027. */
export function centralCalendarDate(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function foundingIsOpen(now: Date): boolean {
  return centralCalendarDate(now) <= FOUNDING_LAST_DAY;
}

export function featuredAnnualPlan(now: Date): 'founding_annual' | 'annual' {
  return foundingIsOpen(now) ? 'founding_annual' : 'annual';
}

export function planIsOffered(plan: MembershipPlanId, now: Date): boolean {
  if (plan === 'founding_annual') return foundingIsOpen(now);
  if (plan === 'annual') return !foundingIsOpen(now);
  return true;
}

export function addMonthsUtc(from: Date, months: number): Date {
  const next = new Date(from.getTime());
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export function xrpForUsd(usd: number, xrpUsdRate: number): number {
  if (xrpUsdRate > 0) return Math.ceil((usd / xrpUsdRate) * 100) / 100;
  const fallbackRate = CANONICAL_USD / FALLBACK_XRP;
  return Math.ceil((usd / fallbackRate) * 100) / 100;
}

export function stripePriceId(plan: MembershipPlanId): string | null {
  const value = process.env[PRICE_ENV[plan]]?.trim();
  return value || null;
}

export const FREE_VIT_RUNS = 1;
export const MEMBER_VIT_RUNS = 8;
export const MEMBER_LABEL_SCANS = 8;

export function scanLimit(kind: 'vit' | 'label', isMember: boolean): number {
  if (!isMember) return kind === 'vit' ? FREE_VIT_RUNS : 0;
  return kind === 'vit' ? MEMBER_VIT_RUNS : MEMBER_LABEL_SCANS;
}

export function scanAllowed(kind: 'vit' | 'label', isMember: boolean, used: number): boolean {
  return used < scanLimit(kind, isMember);
}
