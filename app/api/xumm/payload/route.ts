import { NextRequest, NextResponse } from 'next/server';
import { createProtocolPaymentPayload } from '@/lib/xumm/server';
import type { ShopCurrency } from '@/lib/xumm/config';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { slug?: string; currency?: ShopCurrency };
    const slug = body.slug?.trim();
    const currency = body.currency === 'rlusd' ? 'rlusd' : 'xrp';

    if (!slug) {
      return NextResponse.json(
        { ok: false, code: 'MISSING_SLUG', error: 'Protocol slug is required.' },
        { status: 400 }
      );
    }

    const result = await createProtocolPaymentPayload({ slug, currency });
    if (!result.ok) {
      const status =
        result.code === 'INVALID_PROTOCOL' ? 404 : result.code === 'XUMM_NOT_CONFIGURED' ? 503 : 400;
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
