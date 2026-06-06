import { NextRequest, NextResponse } from 'next/server';
import { getCatalogBySlug } from '@/lib/shop/protocol-catalog';
import { CANONICAL_USD } from '@/lib/shop/pricing';
import { tokenShopReturnUrl } from '@/lib/xumm/config';
import { appPath } from '@/lib/site-urls';

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const priceId = process.env.STRIPE_PROTOCOL_PRICE_ID?.trim();

  if (!secret || !priceId) {
    return NextResponse.json(
      {
        ok: false,
        code: 'STRIPE_NOT_CONFIGURED',
        error:
          'Card checkout is not configured yet. Set STRIPE_SECRET_KEY and STRIPE_PROTOCOL_PRICE_ID in Vercel.',
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as { slug?: string };
    const slug = body.slug?.trim();
    if (!slug || !getCatalogBySlug(slug)) {
      return NextResponse.json(
        { ok: false, code: 'INVALID_PROTOCOL', error: 'Unknown protocol.' },
        { status: 400 }
      );
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(secret);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { protocol_slug: slug, product: 'freedom-paws-protocol' },
      client_reference_id: slug,
      success_url: `${tokenShopReturnUrl(slug, true)}&stripe=1`,
      cancel_url: appPath(`/token-shop?protocol=${encodeURIComponent(slug)}#${slug}`),
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
      amountUsd: CANONICAL_USD,
      slug,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Stripe checkout failed';
    console.error('[api/stripe/checkout]', msg);
    return NextResponse.json({ ok: false, code: 'STRIPE_ERROR', error: msg }, { status: 500 });
  }
}
