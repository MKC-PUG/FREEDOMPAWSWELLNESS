import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  addMonthsUtc,
  isMembershipPlan,
  isMembershipPlanId,
  scanAllowed,
  type MembershipPlanId,
} from '@/lib/shop/membership-plans';

export type EntitlementRow = {
  id: string;
  user_id: string;
  plan: MembershipPlanId;
  status: 'active' | 'canceled';
  protocol_slug: string | null;
  period_end: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_session_id: string | null;
  source: 'stripe' | 'xaman';
  xumm_uuid: string | null;
};

const MISSING_TABLE =
  'Entitlements table is missing. Run supabase/migrations/024_entitlements.sql in the freedom-paws-id SQL editor.';

function missingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === '42P01' || (error.message ?? '').toLowerCase().includes('entitlements') && (error.message ?? '').includes('schema cache');
}

export function entitlementIsOpen(row: Pick<EntitlementRow, 'status' | 'period_end'>, now = new Date()): boolean {
  if (row.status !== 'active' && row.status !== 'canceled') return false;
  return new Date(row.period_end).getTime() > now.getTime();
}

export async function listEntitlements(userId: string): Promise<
  { ok: true; rows: EntitlementRow[] } | { ok: false; error: string }
> {
  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, error: 'Supabase service role is not configured.' };
  const { data, error } = await admin
    .from('entitlements')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    return { ok: false, error: missingTable(error) ? MISSING_TABLE : error.message };
  }
  return { ok: true, rows: (data ?? []) as EntitlementRow[] };
}

export function openMembership(rows: EntitlementRow[], now = new Date()): EntitlementRow | null {
  return (
    rows.find((row) => isMembershipPlan(row.plan) && entitlementIsOpen(row, now)) ?? null
  );
}

export type GrantEntitlementInput = {
  userId: string;
  plan: MembershipPlanId;
  protocolSlug?: string | null;
  periodEnd: Date;
  source: 'stripe' | 'xaman';
  status?: 'active' | 'canceled';
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeSessionId?: string | null;
  xummUuid?: string | null;
};

export async function grantEntitlement(
  input: GrantEntitlementInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, error: 'Supabase service role is not configured.' };
  if (input.plan === 'pass' && !input.protocolSlug) {
    return { ok: false, error: 'A protocol pass needs a protocol.' };
  }

  if (input.stripeSessionId) {
    const prior = await admin
      .from('entitlements')
      .select('id')
      .eq('stripe_session_id', input.stripeSessionId)
      .maybeSingle();
    if (prior.data) return { ok: true };
  }
  if (input.xummUuid) {
    const prior = await admin
      .from('entitlements')
      .select('id')
      .eq('xumm_uuid', input.xummUuid)
      .maybeSingle();
    if (prior.data) return { ok: true };
  }

  const patch = {
    plan: input.plan,
    status: input.status ?? 'active',
    protocol_slug: input.plan === 'pass' ? input.protocolSlug : null,
    period_end: input.periodEnd.toISOString(),
    stripe_customer_id: input.stripeCustomerId ?? null,
    stripe_subscription_id: input.stripeSubscriptionId ?? null,
    stripe_session_id: input.stripeSessionId ?? null,
    source: input.source,
    xumm_uuid: input.xummUuid ?? null,
    updated_at: new Date().toISOString(),
  };

  const lookup = admin.from('entitlements').select('id').eq('user_id', input.userId);
  const found =
    input.plan === 'pass'
      ? await lookup.eq('plan', 'pass').eq('protocol_slug', input.protocolSlug!).maybeSingle()
      : await lookup.neq('plan', 'pass').maybeSingle();

  if (found.error) {
    return { ok: false, error: missingTable(found.error) ? MISSING_TABLE : found.error.message };
  }

  const write = found.data
    ? await admin.from('entitlements').update(patch).eq('id', found.data.id)
    : await admin.from('entitlements').insert({ ...patch, user_id: input.userId });

  if (write.error) {
    return { ok: false, error: missingTable(write.error) ? MISSING_TABLE : write.error.message };
  }
  return { ok: true };
}

export async function updateMembershipBySubscription(
  subscriptionId: string,
  patch: { status: 'active' | 'canceled'; periodEnd: Date }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, error: 'Supabase service role is not configured.' };
  const { error } = await admin
    .from('entitlements')
    .update({
      status: patch.status,
      period_end: patch.periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export function periodEndForCheckout(plan: MembershipPlanId, subscriptionPeriodEnd: Date | null, now = new Date()): Date {
  if (plan === 'monthly') return subscriptionPeriodEnd ?? addMonthsUtc(now, 1);
  return addMonthsUtc(now, 12);
}

export async function consumeScan(
  userId: string,
  kind: 'vit' | 'label'
): Promise<{ ok: true; showMembership: boolean } | { ok: false; status: number; code: string; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { ok: false, status: 503, code: 'NOT_CONFIGURED', error: 'Supabase service role is not configured.' };
  }

  const listed = await listEntitlements(userId);
  if (!listed.ok) {
    return { ok: false, status: 503, code: 'ENTITLEMENTS_UNAVAILABLE', error: listed.error };
  }
  const member = openMembership(listed.rows) !== null;
  const since = member
    ? new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString()
    : '1970-01-01T00:00:00.000Z';

  const countQuery = await admin
    .from('scan_usage')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('kind', kind)
    .gte('created_at', since);

  if (countQuery.error) {
    const message = countQuery.error.message ?? '';
    const missing = countQuery.error.code === '42P01' || message.includes('scan_usage');
    return {
      ok: false,
      status: 503,
      code: 'USAGE_UNAVAILABLE',
      error: missing ? MISSING_TABLE : message,
    };
  }

  const used = countQuery.count ?? 0;
  if (!scanAllowed(kind, member, used)) {
    if (!member && kind === 'label') {
      return {
        ok: false,
        status: 402,
        code: 'MEMBERSHIP_REQUIRED',
        error: 'Label scans are included with membership.',
      };
    }
    if (!member) {
      return {
        ok: false,
        status: 402,
        code: 'FREE_SCAN_USED',
        error: 'The free scan is one run. The annual membership is on the shop page.',
      };
    }
    return {
      ok: false,
      status: 402,
      code: 'MEMBER_CAP',
      error:
        kind === 'vit'
          ? 'The eight ViT runs for this month are used.'
          : 'The eight label scans for this month are used.',
    };
  }

  const inserted = await admin.from('scan_usage').insert({ user_id: userId, kind });
  if (inserted.error) {
    return { ok: false, status: 503, code: 'USAGE_UNAVAILABLE', error: inserted.error.message };
  }
  return { ok: true, showMembership: !member };
}

export function planFromMetadata(value: string | undefined): MembershipPlanId | null {
  return isMembershipPlanId(value) ? value : null;
}
