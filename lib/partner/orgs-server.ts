import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { PartnerOrg, PartnerOrgType, PartnerPilotTier } from '@/lib/partner/types';

function mapRow(row: Record<string, unknown>): PartnerOrg {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    orgType: row.org_type as PartnerOrgType,
    city: (row.city as string) ?? null,
    county: (row.county as string) ?? null,
    state: row.state as string,
    stateCode: (row.state_code as string) ?? 'TN',
    pilotTier: (row.pilot_tier as PartnerPilotTier) ?? 'tn_pilot',
    listingsEnabled: Boolean(row.listings_enabled),
    website: (row.website as string) ?? null,
    phone: (row.phone as string) ?? null,
  };
}

/** TN Adoption Network pilot partners (listings_enabled). */
export async function listTnPilotPartners(): Promise<PartnerOrg[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shelters')
    .select(
      'id, name, slug, org_type, city, county, state, state_code, pilot_tier, listings_enabled, website, phone'
    )
    .eq('pilot_tier', 'tn_pilot')
    .eq('state_code', 'TN')
    .not('slug', 'is', null)
    .order('org_type')
    .order('name');

  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export async function getPartnerOrgBySlug(slug: string): Promise<PartnerOrg | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shelters')
    .select(
      'id, name, slug, org_type, city, county, state, state_code, pilot_tier, listings_enabled, website, phone'
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRow(data as Record<string, unknown>);
}
