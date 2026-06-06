import { appPath } from '@/lib/site-urls';

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
  const addr = process.env.XRPL_TREASURY_ADDRESS?.trim();
  return addr && addr.startsWith('r') ? addr : null;
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
  const q = paid ? `?protocol=${encodeURIComponent(slug)}&paid=1` : `?protocol=${encodeURIComponent(slug)}`;
  return appPath(`/token-shop${q}#${slug}`);
}
