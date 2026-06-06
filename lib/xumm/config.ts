import { isValidClassicAddress } from 'ripple-address-codec';
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

/** Ripple base58 alphabet — rejects 0, O, I, l and hidden Unicode. */
const CLASSIC_R_ADDRESS = /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/;

export function normalizeClassicAddress(raw: string): string {
  return raw
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

/** XUMM rejects X-addresses (error 603) — treasury must be classic r-address. */
export function validateTreasuryAddress():
  | { ok: true; address: string }
  | { ok: false; code: 'MISSING' | 'X_ADDRESS' | 'INVALID'; message: string } {
  const addr = normalizeClassicAddress(process.env.XRPL_TREASURY_ADDRESS ?? '');
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
  if (!CLASSIC_R_ADDRESS.test(addr) || !isValidClassicAddress(addr)) {
    return {
      ok: false,
      code: 'INVALID',
      message:
        'XRPL_TREASURY_ADDRESS failed XRPL checksum validation. In Xaman → Receive, switch to classic r-address, copy it again, and replace the Vercel value (no spaces or quotes).',
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
