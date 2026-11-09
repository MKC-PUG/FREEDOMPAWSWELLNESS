import { XummSdk } from 'xumm-sdk';
import { SHOP_PRICE } from '@/app/token-shop/shop-items';
import { getCatalogBySlug } from '@/lib/shop/protocol-catalog';
import {
  PLAN_AMOUNT_USD,
  PLAN_LABEL,
  isMembershipPlanId,
  planIsOffered,
  xrpForUsd,
  type MembershipPlanId,
} from '@/lib/shop/membership-plans';
import { getLivePriceQuote } from '@/lib/shop/pricing';
import {
  getRlusdCurrencyCode,
  getRlusdIssuer,
  getXummCredentials,
  type ShopCurrency,
  tokenShopReturnUrl,
  validateTreasuryAddress,
  xrpToDrops,
} from './config';
import { appOrigin } from '@/lib/site-urls';

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

  const treasuryCheck = validateTreasuryAddress();
  if (!treasuryCheck.ok) {
    return {
      ok: false,
      code: treasuryCheck.code === 'X_ADDRESS' ? 'TREASURY_X_ADDRESS' : 'TREASURY_NOT_CONFIGURED',
      error: treasuryCheck.message,
    };
  }
  const treasury = treasuryCheck.address;

  const row = getCatalogBySlug(input.slug);
  if (!row) {
    return { ok: false, code: 'INVALID_PROTOCOL', error: 'Unknown protocol slug.' };
  }

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

  // Omit Account — Xaman fills it from the signing user ({{user}} causes error 603).
  const txjson = {
    TransactionType: 'Payment' as const,
    Destination: treasury,
    Amount: amount,
  };

  const buildPayload = (withReturnUrl: boolean) => ({
    txjson,
    custom_meta: {
      identifier: `fp-protocol-${row.slug}`,
      instruction: `Freedom Paws protocol ${row.slug} — ${amountLabel}`,
    },
    options: {
      submit: true,
      expire: 15,
      ...(withReturnUrl
        ? {
            return_url: {
              app: tokenShopReturnUrl(row.slug, true),
              web: tokenShopReturnUrl(row.slug, true),
            },
          }
        : {}),
    },
  });

  try {
    // Second arg `true` forces SDK to throw with the real XUMM API error instead of null.
    type CreatedPayload = {
      uuid?: string;
      next?: { always?: string };
      refs?: { qr_png?: string };
    };
    let created: CreatedPayload | null = null;

    const attempts = [buildPayload(true), buildPayload(false), { txjson, options: { submit: true, expire: 15 } }];

    let lastErr: unknown;
    for (let i = 0; i < attempts.length; i++) {
      try {
        created = (await sdk.payload.create(attempts[i]!, true)) as CreatedPayload;
        if (created?.uuid) break;
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : '';
        if (!msg.includes('603') || i === attempts.length - 1) throw err;
        console.warn(`[xumm/create] 603 on attempt ${i + 1} — retrying simpler payload`);
      }
    }
    if (!created?.uuid && lastErr) throw lastErr;

    if (!created?.uuid) {
      return {
        ok: false,
        code: 'XUMM_PAYLOAD_FAILED',
        error: 'Xaman returned no payload. Check API Key + Secret match in apps.xumm.dev.',
      };
    }

    const deeplink =
      created.next?.always ||
      (created.uuid ? `https://xaman.app/sign/${created.uuid}` : null);
    if (!deeplink) {
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
    console.error('[xumm/create]', msg, err);
    const lower = msg.toLowerCase();
    let hint = '';
    if (lower.includes('603') || lower.includes('invalid hex')) {
      hint =
        ' This usually means XRPL_TREASURY_ADDRESS is an X-address. Use a classic r-address from Xaman Receive.';
    } else if (lower.includes('credential') || lower.includes('unauthorized')) {
      hint = ' Verify API Key and API Secret are from the same app at apps.xumm.dev.';
    }
    return { ok: false, code: 'XUMM_ERROR', error: `${msg}${hint}` };
  }
}

export type XamanGrant = {
  userId: string;
  plan: MembershipPlanId;
  protocolSlug: string | null;
  usd: number;
};

function shopCheckoutReturnUrl(): string {
  const path = '/token-shop?checkout=1';
  const origin = appOrigin();
  return origin ? `${origin}${path}` : `http://localhost:3000${path}`;
}

export async function createMembershipPaymentPayload(input: {
  userId: string;
  plan: MembershipPlanId;
  protocolSlug?: string | null;
  currency: ShopCurrency;
}): Promise<CreatePayloadResult> {
  if (!planIsOffered(input.plan, new Date())) {
    return { ok: false, code: 'INVALID_PLAN', error: 'That plan is not for sale.' };
  }
  if (input.plan === 'pass') {
    if (!input.protocolSlug || !getCatalogBySlug(input.protocolSlug)) {
      return { ok: false, code: 'INVALID_PROTOCOL', error: 'Choose a protocol for the pass.' };
    }
  }

  const sdk = getXummSdk();
  if (!sdk) {
    return {
      ok: false,
      code: 'XUMM_NOT_CONFIGURED',
      error: 'Xaman checkout is not configured.',
    };
  }
  const treasuryCheck = validateTreasuryAddress();
  if (!treasuryCheck.ok) {
    return {
      ok: false,
      code: treasuryCheck.code === 'X_ADDRESS' ? 'TREASURY_X_ADDRESS' : 'TREASURY_NOT_CONFIGURED',
      error: treasuryCheck.message,
    };
  }

  const usd = PLAN_AMOUNT_USD[input.plan];
  let amount: string | { currency: string; issuer: string; value: string };
  let amountLabel: string;
  if (input.currency === 'rlusd') {
    const issuer = getRlusdIssuer();
    if (!issuer) {
      return { ok: false, code: 'RLUSD_NOT_CONFIGURED', error: 'RLUSD is not configured.' };
    }
    const currency = getRlusdCurrencyCode();
    amount = { currency, issuer, value: String(usd) };
    amountLabel = `${usd} ${currency}`;
  } else {
    let rate = 0;
    try {
      const quote = await getLivePriceQuote();
      rate = quote.xrpUsdRate;
    } catch {
      rate = 0;
    }
    const xrp = xrpForUsd(usd, rate);
    amount = xrpToDrops(xrp);
    amountLabel = `${xrp} XRP`;
  }

  const grant: XamanGrant = {
    userId: input.userId,
    plan: input.plan,
    protocolSlug: input.plan === 'pass' ? input.protocolSlug ?? null : null,
    usd,
  };
  const txjson = {
    TransactionType: 'Payment' as const,
    Destination: treasuryCheck.address,
    Amount: amount,
  };
  const payload = {
    txjson,
    custom_meta: {
      identifier: 'fp-plan',
      blob: JSON.stringify(grant),
      instruction: `${PLAN_LABEL[input.plan]} — ${amountLabel}`,
    },
    options: {
      submit: true,
      expire: 15,
      return_url: { app: shopCheckoutReturnUrl(), web: shopCheckoutReturnUrl() },
    },
  };

  try {
    type CreatedPayload = { uuid?: string; next?: { always?: string }; refs?: { qr_png?: string } };
    const created = (await sdk.payload.create(
      payload as unknown as Parameters<typeof sdk.payload.create>[0],
      true
    )) as CreatedPayload;
    if (!created?.uuid) {
      return { ok: false, code: 'XUMM_PAYLOAD_FAILED', error: 'Xaman returned no payload.' };
    }
    const deeplink = created.next?.always || `https://xaman.app/sign/${created.uuid}`;
    return {
      ok: true,
      uuid: created.uuid,
      deeplink,
      qrPng: created.refs?.qr_png ?? null,
      currency: input.currency,
      amountLabel,
      protocolTitle: PLAN_LABEL[input.plan],
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Xaman payload creation failed';
    console.error('[xumm/create-plan]', msg);
    return { ok: false, code: 'XUMM_ERROR', error: msg };
  }
}

export function parseXamanGrant(blob: unknown): XamanGrant | null {
  if (typeof blob !== 'string' || !blob.startsWith('{')) return null;
  try {
    const parsed = JSON.parse(blob) as Partial<XamanGrant>;
    if (!parsed.userId || !isMembershipPlanId(parsed.plan) || typeof parsed.usd !== 'number') return null;
    if (parsed.usd !== PLAN_AMOUNT_USD[parsed.plan]) return null;
    return {
      userId: parsed.userId,
      plan: parsed.plan,
      protocolSlug: parsed.protocolSlug ?? null,
      usd: parsed.usd,
    };
  } catch {
    return null;
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
      grant: XamanGrant | null;
      legacyProtocol: boolean;
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
    const identifier = payload.custom_meta?.identifier as string | undefined;
    const slugFromId = identifier?.startsWith('fp-protocol-')
      ? identifier.slice('fp-protocol-'.length)
      : null;
    const txid = typeof payload.response?.txid === 'string' ? payload.response.txid : null;
    const grant = identifier === 'fp-plan' ? parseXamanGrant(payload.custom_meta?.blob) : null;

    return {
      ok: true,
      signed,
      cancelled: Boolean(meta.cancelled),
      expired: Boolean(meta.expired),
      resolved,
      txid,
      slug: slugFromId,
      grant,
      legacyProtocol: Boolean(slugFromId) && !grant,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Status check failed';
    return { ok: false, code: 'XUMM_STATUS_ERROR', error: msg };
  }
}
