import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  grantEntitlement,
  periodEndForCheckout,
  planFromMetadata,
  updateMembershipBySubscription,
} from '@/lib/shop/entitlements-server';

export const runtime = 'nodejs';

function customerId(value: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

function subscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  const end = sub.items?.data?.[0]?.current_period_end;
  return typeof end === 'number' ? new Date(end * 1000) : null;
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret || !key) {
    return NextResponse.json({ ok: false, error: 'Stripe webhook is not configured.' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ ok: false, error: 'Missing Stripe signature.' }, { status: 400 });
  }

  const StripeSdk = (await import('stripe')).default;
  const stripe = new StripeSdk(key);
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
        return NextResponse.json({ ok: true, skipped: true });
      }
      const plan = planFromMetadata(session.metadata?.plan);
      const userId = session.metadata?.user_id?.trim();
      if (!plan || !userId) return NextResponse.json({ ok: true, skipped: true });

      let periodFromStripe: Date | null = null;
      let subscriptionId: string | null = null;
      if (session.mode === 'subscription' && session.subscription) {
        subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        periodFromStripe = subscriptionPeriodEnd(sub);
      }

      const granted = await grantEntitlement({
        userId,
        plan,
        protocolSlug: session.metadata?.protocol_slug || null,
        periodEnd: periodEndForCheckout(plan, periodFromStripe),
        source: 'stripe',
        stripeCustomerId: customerId(session.customer),
        stripeSubscriptionId: subscriptionId,
        stripeSessionId: session.id,
      });
      if (!granted.ok) {
        console.error('[stripe/webhook] grant', granted.error);
        return NextResponse.json({ ok: false, error: granted.error }, { status: 500 });
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const periodEnd = subscriptionPeriodEnd(sub) ?? periodEndForCheckout('monthly', null);
      const status = event.type === 'customer.subscription.deleted' || sub.status === 'canceled' ? 'canceled' : 'active';
      const updated = await updateMembershipBySubscription(sub.id, { status, periodEnd });
      if (!updated.ok) {
        console.error('[stripe/webhook] subscription', updated.error);
        return NextResponse.json({ ok: false, error: updated.error }, { status: 500 });
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook failed';
    console.error('[stripe/webhook]', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
