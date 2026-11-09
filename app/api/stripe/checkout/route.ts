import { NextRequest, NextResponse } from 'next/server';
import { getCatalogBySlug } from '@/lib/shop/protocol-catalog';
import {
  PLAN_AMOUNT_USD,
  PLAN_LABEL,
  featuredAnnualPlan,
  isMembershipPlanId,
  planIsOffered,
  stripePriceId,
  type MembershipPlanId,
} from '@/lib/shop/membership-plans';
import { appOrigin } from '@/lib/site-urls';
import { getServerUser } from '@/lib/supabase/server';

function shopUrl(search: string): string {
  const origin = appOrigin() || 'http://localhost:3000';
  return `${origin}/token-shop${search}`;
}

function lineItem(plan: MembershipPlanId) {
  const price = stripePriceId(plan);
  if (price) return { price, quantity: 1 };
  const recurring = plan === 'monthly' ? { interval: 'month' as const } : undefined;
  return {
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: PLAN_AMOUNT_USD[plan] * 100,
      ...(recurring ? { recurring } : {}),
      product_data: { name: PLAN_LABEL[plan] },
    },
  };
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, code: 'STRIPE_NOT_CONFIGURED', error: 'Card checkout is not configured yet.' },
      { status: 503 }
    );
  }

  const user = await getServerUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, code: 'SIGN_IN_REQUIRED', error: 'Sign in with your email before paying.' },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as { plan?: string; slug?: string };
    const plan = body.plan?.trim();
    const slug = body.slug?.trim() || null;
    if (!isMembershipPlanId(plan) || !planIsOffered(plan, new Date())) {
      const featured = featuredAnnualPlan(new Date());
      return NextResponse.json(
        {
          ok: false,
          code: 'INVALID_PLAN',
          error: `That plan is not for sale. The annual plan today is ${PLAN_LABEL[featured]}.`,
        },
        { status: 400 }
      );
    }
    if (plan === 'pass' && (!slug || !getCatalogBySlug(slug))) {
      return NextResponse.json(
        { ok: false, code: 'INVALID_PROTOCOL', error: 'Choose a protocol for the pass.' },
        { status: 400 }
      );
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(secret);
    const metadata = {
      user_id: user.id,
      plan,
      protocol_slug: plan === 'pass' && slug ? slug : '',
      product: 'freedom-paws-membership',
    };

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      line_items: [lineItem(plan)],
      client_reference_id: user.id,
      metadata,
      ...(plan === 'monthly'
        ? { subscription_data: { metadata } }
        : { customer_creation: 'always' as const, payment_intent_data: { metadata } }),
      success_url: shopUrl('?checkout=1'),
      cancel_url: shopUrl(''),
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, code: 'STRIPE_SESSION_FAILED', error: 'Stripe did not return a checkout URL.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: session.url,
      amountUsd: PLAN_AMOUNT_USD[plan],
      plan,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Stripe checkout failed';
    console.error('[api/stripe/checkout]', msg);
    return NextResponse.json({ ok: false, code: 'STRIPE_ERROR', error: msg }, { status: 500 });
  }
}
