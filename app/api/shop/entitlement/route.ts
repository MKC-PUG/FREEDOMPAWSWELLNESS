import { NextResponse } from 'next/server';
import { entitlementIsOpen, listEntitlements, openMembership } from '@/lib/shop/entitlements-server';
import {
  PLAN_AMOUNT_USD,
  featuredAnnualPlan,
  foundingIsOpen,
} from '@/lib/shop/membership-plans';
import { getServerUser } from '@/lib/supabase/server';

export async function GET() {
  const now = new Date();
  const offers = {
    foundingOpen: foundingIsOpen(now),
    featuredAnnual: featuredAnnualPlan(now),
    foundingAnnualUsd: PLAN_AMOUNT_USD.founding_annual,
    annualUsd: PLAN_AMOUNT_USD.annual,
    monthlyUsd: PLAN_AMOUNT_USD.monthly,
    passUsd: PLAN_AMOUNT_USD.pass,
  };

  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ ok: true, signedIn: false, membership: null, passes: [], offers });
  }

  const listed = await listEntitlements(user.id);
  if (!listed.ok) {
    return NextResponse.json({ ok: false, error: listed.error, offers }, { status: 503 });
  }

  const membership = openMembership(listed.rows, now);
  const passes = listed.rows
    .filter((row) => row.plan === 'pass' && row.protocol_slug && entitlementIsOpen(row, now))
    .map((row) => ({ protocolSlug: row.protocol_slug as string, periodEnd: row.period_end }));

  return NextResponse.json({
    ok: true,
    signedIn: true,
    membership: membership
      ? { plan: membership.plan, status: membership.status, periodEnd: membership.period_end }
      : null,
    passes,
    offers,
  });
}
