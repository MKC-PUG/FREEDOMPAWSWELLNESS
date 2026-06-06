import { getRlusdIssuer, getXummCredentials, validateTreasuryAddress } from '@/lib/xumm/config';
import { appBaseUrl, appOrigin } from '@/lib/site-urls';

export type ShopConfigStatus = {
  xummApiKey: boolean;
  xummApiSecret: boolean;
  xummReady: boolean;
  treasuryAddress: boolean;
  treasuryPreview: string | null;
  treasuryLength: number | null;
  treasuryHasQuotes: boolean;
  rlusdIssuer: boolean;
  rlusdIssuerPreview: string | null;
  stripeSecret: boolean;
  stripePriceId: boolean;
  stripeReady: boolean;
  appUrl: string | null;
  appOrigin: string | null;
  readyForXamanTest: boolean;
  missingForXaman: string[];
  missingForStripe: string[];
};

export function getShopConfigStatus(): ShopConfigStatus {
  const creds = getXummCredentials();
  const treasuryRaw = process.env.XRPL_TREASURY_ADDRESS ?? '';
  const treasuryCheck = validateTreasuryAddress();
  const treasury = treasuryCheck.ok ? treasuryCheck.address : null;
  const rlusdIssuer = getRlusdIssuer();
  const stripeSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const stripePriceId = Boolean(process.env.STRIPE_PROTOCOL_PRICE_ID?.trim());

  const missingForXaman: string[] = [];
  if (!process.env.NEXT_PUBLIC_XUMM_API_KEY?.trim() && !process.env.XUMM_API_KEY?.trim()) {
    missingForXaman.push('NEXT_PUBLIC_XUMM_API_KEY or XUMM_API_KEY');
  }
  if (!process.env.XUMM_API_SECRET?.trim()) missingForXaman.push('XUMM_API_SECRET');
  if (!treasuryCheck.ok) {
    if (treasuryCheck.code === 'X_ADDRESS') {
      missingForXaman.push('XRPL_TREASURY_ADDRESS (must be r-address, not X-address)');
    } else {
      missingForXaman.push('XRPL_TREASURY_ADDRESS');
    }
  }
  if (!appOrigin()) missingForXaman.push('NEXT_PUBLIC_APP_URL (or deploy on Vercel for VERCEL_URL fallback)');

  const missingForStripe: string[] = [];
  if (!stripeSecret) missingForStripe.push('STRIPE_SECRET_KEY');
  if (!stripePriceId) missingForStripe.push('STRIPE_PROTOCOL_PRICE_ID');

  return {
    xummApiKey: Boolean(
      process.env.NEXT_PUBLIC_XUMM_API_KEY?.trim() || process.env.XUMM_API_KEY?.trim()
    ),
    xummApiSecret: Boolean(process.env.XUMM_API_SECRET?.trim()),
    xummReady: Boolean(creds && treasury && appOrigin()),
    treasuryAddress: Boolean(treasury),
    treasuryPreview: treasury ? `${treasury.slice(0, 6)}…${treasury.slice(-4)}` : null,
    treasuryLength: treasury ? treasury.length : null,
    treasuryHasQuotes: /^["']|["']$/.test(treasuryRaw.trim()),
    rlusdIssuer: Boolean(rlusdIssuer),
    rlusdIssuerPreview: rlusdIssuer ? `${rlusdIssuer.slice(0, 6)}…${rlusdIssuer.slice(-4)}` : null,
    stripeSecret,
    stripePriceId,
    stripeReady: stripeSecret && stripePriceId,
    appUrl: appBaseUrl() || null,
    appOrigin: appOrigin() || null,
    readyForXamanTest: missingForXaman.length === 0,
    missingForXaman,
    missingForStripe,
  };
}
