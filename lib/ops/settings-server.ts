import {
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_MARKETING_SETTINGS,
  type FeatureFlags,
  type MarketingAutomationSettings,
} from '@/lib/ops/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const MARKETING_KEY = 'marketing_automation';
const FEATURE_KEY = 'feature_flags';

function mergeMarketing(raw: unknown): MarketingAutomationSettings {
  const base = { ...DEFAULT_MARKETING_SETTINGS, workflows: { ...DEFAULT_MARKETING_SETTINGS.workflows } };
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<MarketingAutomationSettings>;
  return {
    emergencyStop: o.emergencyStop ?? base.emergencyStop,
    masterEnabled: o.masterEnabled ?? base.masterEnabled,
    workflows: { ...base.workflows, ...(o.workflows ?? {}) },
    partnerApprovals: { ...base.partnerApprovals, ...(o.partnerApprovals ?? {}) },
    n8nWebhookUrl: o.n8nWebhookUrl ?? base.n8nWebhookUrl,
  };
}

function mergeFlags(raw: unknown): FeatureFlags {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_FEATURE_FLAGS };
  return { ...DEFAULT_FEATURE_FLAGS, ...(raw as Partial<FeatureFlags>) };
}

export async function getMarketingSettings(): Promise<MarketingAutomationSettings> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('ops_settings')
      .select('value')
      .eq('key', MARKETING_KEY)
      .maybeSingle();
    if (error) {
      console.warn('[ops] marketing settings read:', error.message);
      return { ...DEFAULT_MARKETING_SETTINGS, workflows: { ...DEFAULT_MARKETING_SETTINGS.workflows } };
    }
    return mergeMarketing(data?.value);
  } catch {
    return { ...DEFAULT_MARKETING_SETTINGS, workflows: { ...DEFAULT_MARKETING_SETTINGS.workflows } };
  }
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('ops_settings')
      .select('value')
      .eq('key', FEATURE_KEY)
      .maybeSingle();
    if (error) {
      console.warn('[ops] feature flags read:', error.message);
      return { ...DEFAULT_FEATURE_FLAGS };
    }
    return mergeFlags(data?.value);
  } catch {
    return { ...DEFAULT_FEATURE_FLAGS };
  }
}

export function marketingCanSend(settings: MarketingAutomationSettings): boolean {
  return (
    !settings.emergencyStop &&
    settings.masterEnabled &&
    settings.workflows.d
  );
}

export async function saveMarketingSettings(
  actorId: string,
  patch: Partial<MarketingAutomationSettings>
): Promise<MarketingAutomationSettings> {
  const current = await getMarketingSettings();
  const next = mergeMarketing({
    ...current,
    ...patch,
    workflows: { ...current.workflows, ...(patch.workflows ?? {}) },
    partnerApprovals: { ...current.partnerApprovals, ...(patch.partnerApprovals ?? {}) },
  });

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('ops_settings').upsert(
    {
      key: MARKETING_KEY,
      value: next,
      updated_at: new Date().toISOString(),
      updated_by: actorId,
    },
    { onConflict: 'key' }
  );
  if (error) throw new Error(error.message);
  return next;
}

export async function saveFeatureFlags(actorId: string, patch: Partial<FeatureFlags>): Promise<FeatureFlags> {
  const current = await getFeatureFlags();
  const next = { ...current, ...patch };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('ops_settings').upsert(
    {
      key: FEATURE_KEY,
      value: next,
      updated_at: new Date().toISOString(),
      updated_by: actorId,
    },
    { onConflict: 'key' }
  );
  if (error) throw new Error(error.message);
  return next;
}

export async function setPartnerApproval(
  actorId: string,
  partnerSlug: string,
  approved: boolean
): Promise<MarketingAutomationSettings> {
  const current = await getMarketingSettings();
  const partnerApprovals = { ...current.partnerApprovals, [partnerSlug]: approved };
  return saveMarketingSettings(actorId, { partnerApprovals });
}
