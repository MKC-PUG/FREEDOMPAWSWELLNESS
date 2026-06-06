import { appOrigin, appPath } from '@/lib/site-urls';

export type ShopCurrency = 'xrp' | 'rlusd';

export function getXummCredentials(): { apiKey: string; apiSecret: string } | null {
  const apiKey =
    process.env.XUMM_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_XUMM_API_KEY?.trim() ||
    '';
  const apiSecret = process.env.XUMM_API_SECRET?.trim() || '';
  if (!apiKey || !apiSecret) return null;
  return { apiKey, apiSecret };
}

export function getTreasuryAddress(): string | null {
  const v = validateTreasuryAddress();
  return v.ok ? v.address : null;
}

/** XUMM rejects X-addresses (error 603) — treasury must be classic r-address. */
export function validateTreasuryAddress():
  | { ok: true; address: string }
  | { ok: false; code: 'MISSING' | 'X_ADDRESS' | 'INVALID'; message: string } {
  const addr = process.env.XRPL_TREASURY_ADDRESS?.trim();
  if (!addr) {
    return {
      ok: false,
      code: 'MISSING',
      message: 'Set XRPL_TREASURY_ADDRESS (classic r-address) in Vercel.',
    };
  }
  if (addr.startsWith('X')) {
    return {
      ok: false,
      code: 'X_ADDRESS',
      message:
        'XRPL_TREASURY_ADDRESS is an X-address (starts with X). Xaman requires a classic r-address. In Xaman → Receive → switch to classic address, then update Vercel.',
    };
  }
  if (!addr.startsWith('r') || addr.length < 25) {
    return {
      ok: false,
      code: 'INVALID',
      message: 'XRPL_TREASURY_ADDRESS must be a valid classic XRPL r-address.',
    };
  }
  return { ok: true, address: addr };
}

export function getRlusdIssuer(): string | null {
  const issuer = process.env.XRPL_RLUSD_ISSUER?.trim();
  return issuer && issuer.startsWith('r') ? issuer : null;
}

export function getRlusdCurrencyCode(): string {
  return process.env.XRPL_RLUSD_CURRENCY?.trim() || 'RLUSD';
}

export function xrpToDrops(xrp: number): string {
  return String(Math.round(xrp * 1_000_000));
}

export function tokenShopReturnUrl(slug: string, paid = false): string {
  const q = paid
    ? `?protocol=${encodeURIComponent(slug)}&paid=1`
    : `?protocol=${encodeURIComponent(slug)}`;
  // No URL hash — some XUMM return_url parsers reject fragments (error 603).
  const path = `/token-shop${q}`;
  const origin = appOrigin();
  return origin ? `${origin}${path}` : appPath(path);
}
