import fs from 'fs';
import path from 'path';
import { getShelterDashboardStats } from '@/lib/id/shelter-stats';
import { getIdConfigStatus } from '@/lib/id/config-status';
import { getWellnessConfigStatus } from '@/lib/wellness/config-status';
import { getShopConfigStatus } from '@/lib/shop/config-status';
import { isAdminConfigured } from '@/lib/admin-auth';
import { listTnPilotPartners } from '@/lib/partner/orgs-server';
import { PWA_VERSION } from '@/lib/pwa-version';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  getFeatureFlags,
  getMarketingSettings,
  marketingCanSend,
} from '@/lib/ops/settings-server';
import type {
  ListingStatusCounts,
  OpsAuditRow,
  OpsOverview,
  OpsPartnerRow,
} from '@/lib/ops/types';
import {
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_MARKETING_SETTINGS,
} from '@/lib/ops/types';

const OUTBOX_DIR = path.join(process.cwd(), 'docs/marketing/outbox/tn-pilot');

async function getListingStatusCounts(): Promise<ListingStatusCounts> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('adoption_listings').select('status');
  if (error) {
    return { draft: 0, available: 0, pending: 0, adopted: 0, archived: 0, total: 0 };
  }

  const counts: ListingStatusCounts = {
    draft: 0,
    available: 0,
    pending: 0,
    adopted: 0,
    archived: 0,
    total: 0,
  };

  for (const row of data ?? []) {
    const s = row.status as string;
    if (s === 'draft' || s === 'available' || s === 'pending' || s === 'adopted' || s === 'archived') {
      counts[s] += 1;
      counts.total += 1;
    }
  }
  return counts;
}

function draftPathForSlug(slug: string): string | null {
  if (!fs.existsSync(OUTBOX_DIR)) return null;
  const files = fs.readdirSync(OUTBOX_DIR);
  const match = files.find((f) => f.includes(slug) && f.endsWith('-email-1.md'));
  return match ? `docs/marketing/outbox/tn-pilot/${match}` : null;
}

async function buildPartnerRows(
  marketingApprovals: Record<string, boolean>
): Promise<OpsPartnerRow[]> {
  const partners = await listTnPilotPartners();
  const supabase = await createSupabaseServerClient();

  const { data: listings } = await supabase
    .from('adoption_listings')
    .select('shelter_id, status, shelters!inner(slug)');

  const countBySlug = new Map<string, { total: number; available: number }>();
  for (const row of listings ?? []) {
    const shelter = row.shelters as { slug?: string } | null;
    const slug = shelter?.slug;
    if (!slug) continue;
    const cur = countBySlug.get(slug) ?? { total: 0, available: 0 };
    cur.total += 1;
    if (row.status === 'available') cur.available += 1;
    countBySlug.set(slug, cur);
  }

  return partners.map((p) => {
    const counts = countBySlug.get(p.slug) ?? { total: 0, available: 0 };
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      orgType: p.orgType,
      city: p.city,
      listingsEnabled: p.listingsEnabled,
      listingCount: counts.total,
      availableCount: counts.available,
      approvedForOutreach: Boolean(marketingApprovals[p.slug]),
      draftEmailPath: draftPathForSlug(p.slug),
      publicUrl: `https://app.freedompawsinc.com/adopt/tn/${p.slug}`,
      partnerPortalUrl: 'https://shelter.freedompawsinc.com/partner/listings',
    };
  });
}

async function getWaitlistCount(): Promise<number | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;
  const { count, error } = await admin
    .from('waitlist_signups')
    .select('id', { count: 'exact', head: true });
  if (error) return null;
  return count ?? 0;
}

async function getRecentAudit(): Promise<OpsAuditRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('audit_log')
      .select('id, action, resource_type, created_at, metadata')
      .order('created_at', { ascending: false })
      .limit(15);
    if (error) return [];
    return (data ?? []).map((row) => ({
      id: row.id as string,
      action: row.action as string,
      resourceType: row.resource_type as string,
      createdAt: row.created_at as string,
      metadata: (row.metadata as Record<string, unknown>) ?? {},
    }));
  } catch {
    return [];
  }
}

export async function getOpsOverview(userEmail?: string | null): Promise<OpsOverview> {
  const emptyListingCounts: ListingStatusCounts = {
    draft: 0,
    available: 0,
    pending: 0,
    adopted: 0,
    archived: 0,
    total: 0,
  };

  const build = async (): Promise<OpsOverview> => {
    const [
      marketing,
      featureFlags,
      shelterId,
      listingCounts,
      wellness,
      shop,
      idConfig,
      waitlistSignups,
      recentAudit,
    ] = await Promise.all([
      getMarketingSettings(),
      getFeatureFlags(),
      getShelterDashboardStats(),
      getListingStatusCounts(),
      Promise.resolve(getWellnessConfigStatus()),
      Promise.resolve(getShopConfigStatus()),
      Promise.resolve(getIdConfigStatus()),
      getWaitlistCount(),
      getRecentAudit(),
    ]);

    let partners: OpsPartnerRow[] = [];
    try {
      partners = await buildPartnerRows(marketing.partnerApprovals);
    } catch (error) {
      console.error('[ops] buildPartnerRows failed', error);
    }
    const sheltersWithListings = partners.filter((p) => p.listingCount > 0).length;

    return {
      generatedAt: new Date().toISOString(),
      userEmail: userEmail ?? null,
      pwaVersion: PWA_VERSION,
      marketing,
      marketingCanSend: marketingCanSend(marketing),
      featureFlags,
      adoption: {
        tnPilotPartners: partners.length,
        sheltersWithListings,
        listingCounts,
        partners,
      },
      shelterId,
      growth: { waitlistSignups },
      wellness: {
        insuranceEnabled: wellness.insuranceEnabled,
        insurancePartnerName: wellness.insurancePartnerName,
        insuranceQuoteUrl: wellness.insuranceQuoteUrl,
        insuranceLostDogUrl: wellness.insuranceLostDogUrl,
        telehealthEnabled: wellness.telehealthEnabled,
        telehealthPartnerName: wellness.telehealthPartnerName,
        telehealthBookUrl: wellness.telehealthBookUrl,
        ready: wellness.ready,
        missingForLaunch: wellness.missingForLaunch,
      },
      product: {
        pwaVersion: PWA_VERSION,
        symptomAdminConfigured: isAdminConfigured(),
      },
      shop: {
        xummReady: shop.xummReady,
        stripeReady: shop.stripeReady,
      },
      system: {
        supabaseReady: idConfig.supabaseReady,
        resendReady: idConfig.resendReady,
        matchEmailReady: idConfig.readyForMatchEmail,
        fpOpsEmails: idConfig.fpOpsEmails,
        serviceRoleKey: idConfig.serviceRoleKey,
        migrationsNote:
          'Run supabase/migrations/012_ops_settings.sql in SQL Editor if ops toggles fail to save.',
      },
      recentAudit,
    };
  };

  try {
    return await Promise.race([
      build(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('getOpsOverview timed out')), 10_000);
      }),
    ]);
  } catch (error) {
    console.error('[ops] getOpsOverview failed or timed out', error);
    const marketing = {
      ...DEFAULT_MARKETING_SETTINGS,
      workflows: { ...DEFAULT_MARKETING_SETTINGS.workflows },
    };
    return {
      generatedAt: new Date().toISOString(),
      userEmail: userEmail ?? null,
      pwaVersion: PWA_VERSION,
      marketing,
      marketingCanSend: false,
      featureFlags: { ...DEFAULT_FEATURE_FLAGS },
      adoption: {
        tnPilotPartners: 0,
        sheltersWithListings: 0,
        listingCounts: emptyListingCounts,
        partners: [],
      },
      shelterId: {
        totalReports: 0,
        pendingReviews: 0,
        matchedReports: 0,
        totalEnrollments: 0,
        pilotShelters: 0,
      },
      growth: { waitlistSignups: null },
      wellness: {
        insuranceEnabled: false,
        insurancePartnerName: '',
        insuranceQuoteUrl: false,
        insuranceLostDogUrl: false,
        telehealthEnabled: false,
        telehealthPartnerName: '',
        telehealthBookUrl: false,
        ready: false,
        missingForLaunch: [],
      },
      product: {
        pwaVersion: PWA_VERSION,
        symptomAdminConfigured: isAdminConfigured(),
      },
      shop: { xummReady: false, stripeReady: false },
      system: {
        supabaseReady: false,
        resendReady: false,
        matchEmailReady: false,
        fpOpsEmails: false,
        serviceRoleKey: false,
        migrationsNote:
          'Ops overview timed out or failed — check Supabase connectivity and try again.',
      },
      recentAudit: [],
    };
  }
}
