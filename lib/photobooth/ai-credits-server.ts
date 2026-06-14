import type { NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getServerUser } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  aiCreditsConfig,
  creditErrorMessage,
  GUEST_ID_HEADER,
  parseGuestKey,
  type AiCreditTier,
} from './ai-credits-config';

export type AiCreditStatus = {
  configured: boolean;
  bypass?: boolean;
  remaining: number;
  monthlyAllowance: number;
  allowanceResetAt: string | null;
  dailyUsed: number;
  dailyCap: number;
  tier: AiCreditTier;
  lifetimeUsed: number;
  packs: { code: string; name: string; credits: number; priceUsd: number }[];
};

type ConsumeResult =
  | { allowed: true; status: AiCreditStatus }
  | { allowed: false; errorCode: string; message: string; waitSeconds?: number; status?: AiCreditStatus };

function rpcParams(cfg: ReturnType<typeof aiCreditsConfig>) {
  return {
    p_guest_monthly: cfg.guestMonthly,
    p_free_monthly: cfg.freeMonthly,
    p_member_monthly: cfg.memberMonthly,
    p_founding_monthly: cfg.foundingMonthly,
  };
}

function mapStatus(row: Record<string, unknown>, configured: boolean): AiCreditStatus {
  const cfg = aiCreditsConfig();
  const tier = (row.tier as AiCreditTier) || 'guest';
  const dailyCap =
    typeof row.daily_cap === 'number'
      ? row.daily_cap
      : tier === 'guest'
        ? cfg.guestDailyCap
        : cfg.dailyCap;

  return {
    configured,
    remaining: Number(row.remaining ?? 0),
    monthlyAllowance: Number(row.monthly_allowance ?? 0),
    allowanceResetAt: row.allowance_reset_at ? String(row.allowance_reset_at) : null,
    dailyUsed: Number(row.daily_used ?? 0),
    dailyCap,
    tier,
    lifetimeUsed: Number(row.lifetime_used ?? 0),
    packs: [],
  };
}

export async function resolveAiCreditIdentity(request: NextRequest) {
  const user = await getServerUser();
  const guestKey = parseGuestKey(request.headers.get(GUEST_ID_HEADER));
  return { ownerId: user?.id ?? null, guestKey };
}

export async function getAiCreditStatus(request: NextRequest): Promise<AiCreditStatus> {
  const cfg = aiCreditsConfig();
  const { AI_CREDIT_PACKS } = await import('./ai-credits-config');
  const { ownerId, guestKey } = await resolveAiCreditIdentity(request);

  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      bypass: process.env.NODE_ENV !== 'production',
      remaining: 999,
      monthlyAllowance: cfg.freeMonthly,
      allowanceResetAt: null,
      dailyUsed: 0,
      dailyCap: cfg.dailyCap,
      tier: ownerId ? 'free' : 'guest',
      lifetimeUsed: 0,
      packs: AI_CREDIT_PACKS.map((p) => ({
        code: p.code,
        name: p.name,
        credits: p.credits,
        priceUsd: p.priceUsd,
      })),
    };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return {
      configured: false,
      remaining: 0,
      monthlyAllowance: 0,
      allowanceResetAt: null,
      dailyUsed: 0,
      dailyCap: cfg.dailyCap,
      tier: 'guest',
      lifetimeUsed: 0,
      packs: [],
    };
  }

  if (!ownerId && !guestKey) {
    return {
      configured: true,
      remaining: 0,
      monthlyAllowance: cfg.guestMonthly,
      allowanceResetAt: null,
      dailyUsed: 0,
      dailyCap: cfg.guestDailyCap,
      tier: 'guest',
      lifetimeUsed: 0,
      packs: AI_CREDIT_PACKS.map((p) => ({
        code: p.code,
        name: p.name,
        credits: p.credits,
        priceUsd: p.priceUsd,
      })),
    };
  }

  const { data, error } = await admin.rpc('ai_credits_status', {
    p_owner_id: ownerId,
    p_guest_key: guestKey,
    ...rpcParams(cfg),
  });

  if (error) {
    console.error('[ai-credits] status', error.message);
    throw new Error('Could not load AI credits');
  }

  const status = mapStatus(data as Record<string, unknown>, true);
  status.packs = AI_CREDIT_PACKS.map((p) => ({
    code: p.code,
    name: p.name,
    credits: p.credits,
    priceUsd: p.priceUsd,
  }));
  return status;
}

export async function consumeAiMagicLookCredit(
  request: NextRequest,
  costumeId: string
): Promise<ConsumeResult> {
  const cfg = aiCreditsConfig();
  const { ownerId, guestKey } = await resolveAiCreditIdentity(request);

  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        allowed: false,
        errorCode: 'not_configured',
        message: 'AI credits are not configured. Contact support.',
      };
    }
    return {
      allowed: true,
      status: {
        configured: false,
        bypass: true,
        remaining: 999,
        monthlyAllowance: cfg.freeMonthly,
        allowanceResetAt: null,
        dailyUsed: 0,
        dailyCap: cfg.dailyCap,
        tier: 'guest',
        lifetimeUsed: 0,
        packs: [],
      },
    };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return {
      allowed: false,
      errorCode: 'not_configured',
      message: 'AI credits unavailable.',
    };
  }

  if (!ownerId && !guestKey) {
    return {
      allowed: false,
      errorCode: 'no_identity',
      message: 'Refresh the page and try again.',
    };
  }

  const { data, error } = await admin.rpc('ai_credits_consume_magic_look', {
    p_owner_id: ownerId,
    p_guest_key: guestKey,
    p_costume_id: costumeId,
    ...rpcParams(cfg),
    p_daily_cap: cfg.dailyCap,
    p_guest_daily_cap: cfg.guestDailyCap,
    p_min_interval_seconds: cfg.minIntervalSec,
  });

  if (error) {
    console.error('[ai-credits] consume', error.message);
    return {
      allowed: false,
      errorCode: 'server_error',
      message: 'Could not verify AI credits. Try again.',
    };
  }

  const row = data as Record<string, unknown>;
  const allowed = row.allowed === true;

  if (!allowed) {
    const code = String(row.error_code ?? 'denied');
    const waitSeconds =
      typeof row.wait_seconds === 'number' ? row.wait_seconds : undefined;
    return {
      allowed: false,
      errorCode: code,
      message: creditErrorMessage(code, waitSeconds),
      waitSeconds,
      status: mapStatus(row, true),
    };
  }

  return {
    allowed: true,
    status: mapStatus(row, true),
  };
}

export async function refundAiMagicLookCredit(
  request: NextRequest,
  costumeId: string,
  reason = 'generation_failed'
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const admin = createSupabaseAdminClient();
  if (!admin) return;

  const { ownerId, guestKey } = await resolveAiCreditIdentity(request);
  if (!ownerId && !guestKey) return;

  await admin.rpc('ai_credits_refund_magic_look', {
    p_owner_id: ownerId,
    p_guest_key: guestKey,
    p_costume_id: costumeId,
    p_reason: reason,
  });
}
