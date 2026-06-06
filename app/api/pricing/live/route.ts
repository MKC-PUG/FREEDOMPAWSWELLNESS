import { NextResponse } from 'next/server';
import { getLivePriceQuote } from '@/lib/shop/pricing';

export async function GET() {
  try {
    const quote = await getLivePriceQuote();
    return NextResponse.json({ ok: true, ...quote });
  } catch (err) {
    console.error('[api/pricing/live]', err);
    return NextResponse.json(
      { ok: false, error: 'Could not fetch live XRP price.' },
      { status: 500 }
    );
  }
}
