import { XummSdk } from 'xumm-sdk';
import { SHOP_PRICE } from '@/app/token-shop/shop-items';
import { getCatalogBySlug } from '@/lib/shop/protocol-catalog';
import {
  getRlusdCurrencyCode,
  getRlusdIssuer,
  getTreasuryAddress,
  getXummCredentials,
  type ShopCurrency,
  tokenShopReturnUrl,
  xrpToDrops,
} from './config';

let sdkSingleton: XummSdk | null = null;

export function getXummSdk(): XummSdk | null {
  const creds = getXummCredentials();
  if (!creds) return null;
  if (!sdkSingleton) {
    sdkSingleton = new XummSdk(creds.apiKey, creds.apiSecret);
  }
  return sdkSingleton;
}

export type CreatePayloadInput = {
  slug: string;
  currency: ShopCurrency;
  /** Live XRP amount (from RLUSD/USD equivalent). Falls back to SHOP_PRICE.xrp. */
  xrpAmount?: number;
};

export type CreatePayloadResult =
  | {
      ok: true;
      uuid: string;
      deeplink: string;
      qrPng: string | null;
      currency: ShopCurrency;
      amountLabel: string;
      protocolTitle: string;
    }
  | { ok: false; error: string; code: string };

export async function createProtocolPaymentPayload(
  input: CreatePayloadInput
): Promise<CreatePayloadResult> {
  const sdk = getXummSdk();
  if (!sdk) {
    return {
      ok: false,
      code: 'XUMM_NOT_CONFIGURED',
      error:
        'Xaman checkout is not configured. Set XUMM_API_KEY (or NEXT_PUBLIC_XUMM_API_KEY) and XUMM_API_SECRET on the server.',
    };
  }

  const treasury = getTreasuryAddress();
  if (!treasury) {
    return {
      ok: false,
      code: 'TREASURY_NOT_CONFIGURED',
      error: 'Set XRPL_TREASURY_ADDRESS (your r-address) in Vercel environment variables.',
    };
  }

  const row = getCatalogBySlug(input.slug);
  if (!row) {
    return { ok: false, code: 'INVALID_PROTOCOL', error: 'Unknown protocol slug.' };
  }

  const memo = `Freedom Paws: ${row.slug}`;
  let amount: string | { currency: string; issuer: string; value: string };
  let amountLabel: string;

  if (input.currency === 'rlusd') {
    const issuer = getRlusdIssuer();
    if (!issuer) {
      return {
        ok: false,
        code: 'RLUSD_NOT_CONFIGURED',
        error: 'RLUSD payments require XRPL_RLUSD_ISSUER in environment variables.',
      };
    }
    const currency = getRlusdCurrencyCode();
    amount = {
      currency: currency.length === 3 ? currency : currency,
      issuer,
      value: String(SHOP_PRICE.rlusd),
    };
    amountLabel = `${SHOP_PRICE.rlusd} ${currency}`;
  } else {
    const xrp =
      typeof input.xrpAmount === 'number' && input.xrpAmount > 0
        ? input.xrpAmount
        : SHOP_PRICE.xrp;
    amount = xrpToDrops(xrp);
    amountLabel = `${xrp} XRP`;
  }

  try {
    const created = (await sdk.payload.create({
      txjson: {
        TransactionType: 'Payment',
        Account: '{{user}}',
        Destination: treasury,
        Amount: amount,
        Memos: [
          {
            Memo: {
              MemoType: Buffer.from('FP-PROTOCOL', 'utf8').toString('hex').toUpperCase(),
              MemoData: Buffer.from(row.slug, 'utf8').toString('hex').toUpperCase(),
            },
          },
        ],
      },
      custom_meta: {
        identifier: `fp-protocol-${row.slug}`,
        blob: {
          protocol: row.slug,
          title: row.cardTitle,
          currency: input.currency,
        },
      },
      options: {
        submit: true,
        expire: 10,
        return_url: {
          app: tokenShopReturnUrl(row.slug, true),
          web: tokenShopReturnUrl(row.slug, true),
        },
      },
    })) as {
      uuid?: string;
      next?: { always?: string };
      refs?: { qr_png?: string };
    } | null;

    if (!created) {
      return {
        ok: false,
        code: 'XUMM_PAYLOAD_FAILED',
        error: 'Xaman returned no payload. Try again.',
      };
    }

    const deeplink = created.next?.always;
    if (!created.uuid || !deeplink) {
      return {
        ok: false,
        code: 'XUMM_PAYLOAD_FAILED',
        error: 'Xaman did not return a sign link. Try again.',
      };
    }

    return {
      ok: true,
      uuid: created.uuid,
      deeplink,
      qrPng: created.refs?.qr_png ?? null,
      currency: input.currency,
      amountLabel,
      protocolTitle: row.cardTitle,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Xaman payload creation failed';
    console.error('[xumm/create]', msg);
    return { ok: false, code: 'XUMM_ERROR', error: msg };
  }
}

export type PayloadStatusResult =
  | {
      ok: true;
      signed: boolean;
      cancelled: boolean;
      expired: boolean;
      resolved: boolean;
      txid: string | null;
      slug: string | null;
    }
  | { ok: false; error: string; code: string };

export async function getPayloadStatus(uuid: string): Promise<PayloadStatusResult> {
  const sdk = getXummSdk();
  if (!sdk) {
    return { ok: false, code: 'XUMM_NOT_CONFIGURED', error: 'Xaman is not configured.' };
  }

  try {
    const payload = await sdk.payload.get(uuid);
    if (!payload?.meta) {
      return { ok: false, code: 'XUMM_NOT_FOUND', error: 'Payment request not found.' };
    }
    const meta = payload.meta;
    const resolved = Boolean(meta.resolved);
    const signed = Boolean(meta.signed);
    const blob = payload.custom_meta?.blob as { protocol?: string } | undefined;
    const txid = typeof payload.response?.txid === 'string' ? payload.response.txid : null;

    return {
      ok: true,
      signed,
      cancelled: Boolean(meta.cancelled),
      expired: Boolean(meta.expired),
      resolved,
      txid,
      slug: blob?.protocol ?? null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Status check failed';
    return { ok: false, code: 'XUMM_STATUS_ERROR', error: msg };
  }
}
