import { NextResponse } from 'next/server';
import { validateTreasuryAddress } from '@/lib/xumm/config';
import { getXummSdk } from '@/lib/xumm/server';

/** Known-good classic address from Xaman docs — diagnostic only, not a real payment. */
const SAMPLE_DESTINATION = 'rN7n7otQDd6FczFgLdlqtyMVQybDU';

async function tryCreate(label: string, body: object) {
  const sdk = getXummSdk();
  if (!sdk) return { label, ok: false, error: 'XUMM not configured' };
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await sdk.payload.create(body as any, true);
    return { label, ok: Boolean(created?.uuid), uuid: created?.uuid ?? null };
  } catch (err) {
    return { label, ok: false, error: err instanceof Error ? err.message : 'failed' };
  }
}

/** Founder-only diagnostic — isolates SignIn vs Payment vs treasury destination. */
export async function GET() {
  const treasury = validateTreasuryAddress();
  const tests = [
    await tryCreate('sign_in', { txjson: { TransactionType: 'SignIn' } }),
    await tryCreate('payment_no_account', {
      txjson: {
        TransactionType: 'Payment',
        Destination: SAMPLE_DESTINATION,
        Amount: '1000000',
      },
    }),
    await tryCreate('payment_with_account_placeholder', {
      txjson: {
        TransactionType: 'Payment',
        Account: '{{user}}',
        Destination: SAMPLE_DESTINATION,
        Amount: '1000000',
      },
    }),
    await tryCreate('payment_user_tag', {
      txjson: {
        TransactionType: 'Payment',
        Account: '$user',
        Destination: SAMPLE_DESTINATION,
        Amount: '1000000',
      },
    }),
  ];

  if (treasury.ok) {
    tests.push(
      await tryCreate('payment_treasury', {
        txjson: {
          TransactionType: 'Payment',
          Destination: treasury.address,
          Amount: '1000000',
        },
      })
    );
  } else {
    tests.push({
      label: 'payment_treasury',
      ok: false,
      error: treasury.message,
    });
  }

  return NextResponse.json({ ok: true, tests });
}
