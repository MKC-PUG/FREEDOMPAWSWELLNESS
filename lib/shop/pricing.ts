import { SHOP_PRICE } from '@/app/token-shop/shop-items';

/** RLUSD list price — canonical fiat-equivalent anchor (1 RLUSD ≈ $1 USD). */
export const CANONICAL_RLUSD = SHOP_PRICE.rlusd;

/** USD display equivalent (matches RLUSD). */
export const CANONICAL_USD = SHOP_PRICE.rlusd;

/** Fallback XRP if live rate API is unavailable. */
export const FALLBACK_XRP = SHOP_PRICE.xrp;

export function computeLiveXrpAmount(usd: number, xrpUsdRate: number): number {
  if (!xrpUsdRate || xrpUsdRate <= 0) return FALLBACK_XRP;
  const raw = usd / xrpUsdRate;
  return Math.ceil(raw * 100) / 100;
}

export type LivePriceQuote = {
  rlusd: number;
  usd: number;
  xrp: number;
  xrpUsdRate: number;
  xrpIsLive: boolean;
  source: string;
  updatedAt: string;
};

let cachedQuote: { quote: LivePriceQuote; expires: number } | null = null;
const CACHE_MS = 2 * 60 * 1000;

async function fetchXrpUsdFromCoinGecko(): Promise<number | null> {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd',
    { headers: { Accept: 'application/json' }, cache: 'no-store' }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { ripple?: { usd?: number } };
  const rate = data.ripple?.usd;
  return typeof rate === 'number' && rate > 0 ? rate : null;
}

/** Server-side live quote with short in-memory cache. */
export async function getLivePriceQuote(): Promise<LivePriceQuote> {
  const now = Date.now();
  if (cachedQuote && cachedQuote.expires > now) {
    return cachedQuote.quote;
  }

  let xrpUsdRate: number | null = null;
  let source = 'fallback';

  try {
    xrpUsdRate = await fetchXrpUsdFromCoinGecko();
    if (xrpUsdRate) source = 'coingecko';
  } catch {
    xrpUsdRate = null;
  }

  const xrpIsLive = xrpUsdRate !== null;
  const rate = xrpUsdRate ?? CANONICAL_USD / FALLBACK_XRP;
  const xrp = computeLiveXrpAmount(CANONICAL_USD, rate);

  const quote: LivePriceQuote = {
    rlusd: CANONICAL_RLUSD,
    usd: CANONICAL_USD,
    xrp,
    xrpUsdRate: rate,
    xrpIsLive,
    source,
    updatedAt: new Date().toISOString(),
  };

  cachedQuote = { quote, expires: now + CACHE_MS };
  return quote;
}
