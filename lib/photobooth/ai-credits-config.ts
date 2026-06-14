/** Metered AI Magic Look — tune via Vercel env without code changes. */

export type AiCreditTier = 'guest' | 'free' | 'member' | 'founding';

export type AiCreditPack = {
  code: string;
  name: string;
  credits: number;
  priceUsd: number;
  stripePriceEnvKey?: string;
};

export const AI_CREDIT_PACKS: AiCreditPack[] = [
  { code: 'pack_10', name: '10 AI Looks', credits: 10, priceUsd: 2.99 },
  { code: 'pack_30', name: '30 AI Looks', credits: 30, priceUsd: 6.99 },
  { code: 'pack_100', name: '100 AI Looks', credits: 100, priceUsd: 14.99 },
];

function envInt(key: string, fallback: number): number {
  const raw = process.env[key]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function aiCreditsConfig() {
  return {
    guestMonthly: envInt('AI_CREDITS_GUEST_MONTHLY', 3),
    freeMonthly: envInt('AI_CREDITS_FREE_MONTHLY', 5),
    memberMonthly: envInt('AI_CREDITS_MEMBER_MONTHLY', 20),
    foundingMonthly: envInt('AI_CREDITS_FOUNDING_MONTHLY', 30),
    dailyCap: envInt('AI_CREDITS_DAILY_CAP', 10),
    guestDailyCap: envInt('AI_CREDITS_GUEST_DAILY_CAP', 5),
    minIntervalSec: envInt('AI_CREDITS_MIN_INTERVAL_SEC', 25),
  };
}

export const GUEST_ID_HEADER = 'x-fp-guest-id';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseGuestKey(raw: string | null | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed || !UUID_RE.test(trimmed)) return null;
  return trimmed.toLowerCase();
}

export function creditErrorMessage(code: string, waitSeconds?: number): string {
  switch (code) {
    case 'no_credits':
      return 'No AI Magic Looks left this month — join Freedom Paws membership or buy a look pack (coming soon). Backgrounds & accessories stay free!';
    case 'daily_cap':
      return 'Daily AI limit reached — try again tomorrow. Unlimited backgrounds & cutout still work.';
    case 'rate_limit':
      return waitSeconds && waitSeconds > 0
        ? `Please wait ${waitSeconds}s before another AI look.`
        : 'Please wait a moment before another AI look.';
    default:
      return 'AI Magic Look unavailable right now.';
  }
}
