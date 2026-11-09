import { NextRequest, NextResponse } from 'next/server';
import { isMembershipPlanId } from '@/lib/shop/membership-plans';
import { getServerUser } from '@/lib/supabase/server';
import { createMembershipPaymentPayload } from '@/lib/xumm/server';
import type { ShopCurrency } from '@/lib/xumm/config';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, code: 'SIGN_IN_REQUIRED', error: 'Sign in with your email before paying.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      plan?: string;
      slug?: string;
      currency?: ShopCurrency;
    };
    const plan = body.plan?.trim();
    if (!isMembershipPlanId(plan)) {
      return NextResponse.json(
        { ok: false, code: 'INVALID_PLAN', error: 'Choose a membership or a protocol pass.' },
        { status: 400 }
      );
    }

    const result = await createMembershipPaymentPayload({
      userId: user.id,
      plan,
      protocolSlug: body.slug?.trim() || null,
      currency: body.currency === 'rlusd' ? 'rlusd' : 'xrp',
    });
    if (!result.ok) {
      const status = result.code === 'INVALID_PLAN' || result.code === 'INVALID_PROTOCOL' ? 400 : 503;
      return NextResponse.json(result, { status });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error('[api/xumm/payload]', err);
    return NextResponse.json(
      { ok: false, code: 'SERVER_ERROR', error: 'Could not create Xaman payment.' },
      { status: 500 }
    );
  }
}
