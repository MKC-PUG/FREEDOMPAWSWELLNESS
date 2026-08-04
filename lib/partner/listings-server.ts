import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/lib/id/profiles';
import {
  assertShelterAccess,
  canChangeListingStatus,
  resolveListingShelterId,
} from '@/lib/partner/listing-auth';
import { uniqueListingSlug } from '@/lib/partner/listing-slug';
import type {
  AdoptionListing,
  AdoptionListingWithShelter,
  CreateListingInput,
  ListingStatus,
  UpdateListingInput,
} from '@/lib/partner/listings-types';
import { PUBLIC_LISTING_STATUSES } from '@/lib/partner/breeds';

function mapListing(row: Record<string, unknown>): AdoptionListing {
  return {
    id: row.id as string,
    shelterId: row.shelter_id as string,
    slug: row.slug as string,
    displayName: row.display_name as string,
    breedPrimary: row.breed_primary as string,
    breedSecondary: (row.breed_secondary as string) ?? null,
    sex: row.sex as AdoptionListing['sex'],
    ageBand: row.age_band as AdoptionListing['ageBand'],
    size: (row.size as AdoptionListing['size']) ?? null,
    bio: row.bio as string,
    status: row.status as ListingStatus,
    photoUrls: (row.photo_urls as string[]) ?? [],
    primaryPhotoUrl: (row.primary_photo_url as string) ?? null,
    createdBy: (row.created_by as string) ?? null,
    publishedAt: (row.published_at as string) ?? null,
    adoptedAt: (row.adopted_at as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapWithShelter(row: Record<string, unknown>): AdoptionListingWithShelter {
  const shelter = row.shelters as Record<string, unknown> | null;
  const listing = mapListing(row);
  return {
    ...listing,
    shelterName: (shelter?.name as string) ?? '',
    shelterSlug: (shelter?.slug as string) ?? '',
    shelterCity: (shelter?.city as string) ?? null,
    shelterPhone: (shelter?.phone as string) ?? null,
    shelterWebsite: (shelter?.website as string) ?? null,
  };
}

const LISTING_SELECT =
  '*, shelters!inner(name, slug, city, phone, website, listings_enabled)';

async function slugExists(shelterId: string, slug: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('adoption_listings')
    .select('id')
    .eq('shelter_id', shelterId)
    .eq('slug', slug)
    .maybeSingle();
  return Boolean(data);
}

function validateStatusChange(
  profile: UserProfile,
  current: ListingStatus,
  next: ListingStatus
): void {
  if (current === next) return;
  if (!canChangeListingStatus(profile.role)) {
    throw new Error('Only shelter admin or FP ops can change listing status.');
  }
}

function statusTimestamps(
  status: ListingStatus,
  existing: AdoptionListing
): { published_at?: string | null; adopted_at?: string | null } {
  const patch: { published_at?: string | null; adopted_at?: string | null } = {};
  if (
    (status === 'available' || status === 'pending') &&
    !existing.publishedAt
  ) {
    patch.published_at = new Date().toISOString();
  }
  if (status === 'adopted') {
    patch.adopted_at = new Date().toISOString();
  }
  return patch;
}

export async function listPartnerListings(
  profile: UserProfile
): Promise<AdoptionListingWithShelter[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('adoption_listings')
    .select(LISTING_SELECT)
    .order('updated_at', { ascending: false });

  if (profile.role !== 'fp_ops' && profile.shelterId) {
    query = query.eq('shelter_id', profile.shelterId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapWithShelter(row as Record<string, unknown>));
}

export async function getListingById(
  id: string,
  profile?: UserProfile
): Promise<AdoptionListingWithShelter | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('adoption_listings')
    .select(LISTING_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const listing = mapWithShelter(data as Record<string, unknown>);
  if (profile && !assertShelterAccess(profile, listing.shelterId)) {
    return null;
  }
  return listing;
}

export async function createListing(
  profile: UserProfile,
  userId: string,
  input: CreateListingInput
): Promise<AdoptionListing> {
  const shelterId = resolveListingShelterId(profile, input.shelterId);
  if (!shelterId) throw new Error('Select a shelter for this listing.');
  if (!assertShelterAccess(profile, shelterId)) {
    throw new Error('Not authorized for this shelter.');
  }

  const slug = await uniqueListingSlug(shelterId, input.displayName, slugExists);
  const photoUrls = input.photoUrls ?? [];
  const primary =
    input.primaryPhotoUrl ?? photoUrls[0] ?? null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('adoption_listings')
    .insert({
      shelter_id: shelterId,
      slug,
      display_name: input.displayName.trim(),
      breed_primary: input.breedPrimary,
      breed_secondary: input.breedSecondary?.trim() || null,
      sex: input.sex,
      age_band: input.ageBand,
      size: input.size ?? 'unknown',
      bio: input.bio.trim(),
      status: 'draft',
      photo_urls: photoUrls,
      primary_photo_url: primary,
      created_by: userId,
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapListing(data as Record<string, unknown>);
}

export async function updateListing(
  profile: UserProfile,
  id: string,
  input: UpdateListingInput
): Promise<AdoptionListing> {
  const existing = await getListingById(id, profile);
  if (!existing) throw new Error('Listing not found.');

  if (input.status) {
    validateStatusChange(profile, existing.status, input.status);
  }

  const patch: Record<string, unknown> = {};

  if (input.displayName !== undefined) patch.display_name = input.displayName.trim();
  if (input.breedPrimary !== undefined) patch.breed_primary = input.breedPrimary;
  if (input.breedSecondary !== undefined) {
    patch.breed_secondary = input.breedSecondary?.trim() || null;
  }
  if (input.sex !== undefined) patch.sex = input.sex;
  if (input.ageBand !== undefined) patch.age_band = input.ageBand;
  if (input.size !== undefined) patch.size = input.size;
  if (input.bio !== undefined) patch.bio = input.bio.trim();
  if (input.photoUrls !== undefined) patch.photo_urls = input.photoUrls;
  if (input.primaryPhotoUrl !== undefined) patch.primary_photo_url = input.primaryPhotoUrl;
  if (input.photoUrls !== undefined && input.primaryPhotoUrl === undefined) {
    patch.primary_photo_url = input.photoUrls[0] ?? existing.primaryPhotoUrl;
  }

  if (input.status) {
    patch.status = input.status;
    Object.assign(patch, statusTimestamps(input.status, existing));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('adoption_listings')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return mapListing(data as Record<string, unknown>);
}

export async function listPublicListingsForShelter(
  shelterSlug: string
): Promise<AdoptionListingWithShelter[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('adoption_listings')
    .select(LISTING_SELECT)
    .eq('shelters.slug', shelterSlug)
    .in('status', [...PUBLIC_LISTING_STATUSES])
    .eq('shelters.listings_enabled', true)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapWithShelter(row as Record<string, unknown>));
}

/** Public directory — available + pending only. */
export async function listPublicTnListings(): Promise<AdoptionListingWithShelter[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('adoption_listings')
    .select(LISTING_SELECT)
    .in('status', [...PUBLIC_LISTING_STATUSES])
    .eq('shelters.state_code', 'TN')
    .eq('shelters.listings_enabled', true)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapWithShelter(row as Record<string, unknown>));
}

export async function getPublicListing(
  shelterSlug: string,
  listingSlug: string
): Promise<AdoptionListingWithShelter | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('adoption_listings')
    .select(LISTING_SELECT)
    .eq('slug', listingSlug)
    .eq('shelters.slug', shelterSlug)
    .in('status', [...PUBLIC_LISTING_STATUSES])
    .eq('shelters.listings_enabled', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapWithShelter(data as Record<string, unknown>);
}

export async function listPublicTnSheltersWithCounts(
  listings?: AdoptionListingWithShelter[]
): Promise<
  {
    slug: string;
    name: string;
    city: string | null;
    orgType: string;
    listingCount: number;
  }[]
> {
  // Reuse listings when the caller already fetched them (avoids double round-trip on /adopt/tn).
  const publicListings = listings ?? (await listPublicTnListings());
  const byShelter = new Map<
    string,
    { slug: string; name: string; city: string | null; orgType: string; count: number }
  >();

  for (const l of publicListings) {
    const key = l.shelterSlug;
    const cur = byShelter.get(key);
    if (cur) {
      cur.count += 1;
    } else {
      byShelter.set(key, {
        slug: l.shelterSlug,
        name: l.shelterName,
        city: l.shelterCity,
        orgType: '',
        count: 1,
      });
    }
  }

  const supabase = await createSupabaseServerClient();
  const { data: shelters } = await supabase
    .from('shelters')
    .select('slug, name, city, org_type')
    .eq('state_code', 'TN')
    .eq('listings_enabled', true)
    .not('slug', 'is', null);

  for (const s of shelters ?? []) {
    const slug = s.slug as string;
    if (!byShelter.has(slug)) {
      byShelter.set(slug, {
        slug,
        name: s.name as string,
        city: (s.city as string) ?? null,
        orgType: (s.org_type as string) ?? '',
        count: 0,
      });
    } else {
      const row = byShelter.get(slug)!;
      row.orgType = (s.org_type as string) ?? '';
    }
  }

  return [...byShelter.values()]
    .map((v) => ({
      slug: v.slug,
      name: v.name,
      city: v.city,
      orgType: v.orgType,
      listingCount: v.count,
    }))
    .sort((a, b) => b.listingCount - a.listingCount || a.name.localeCompare(b.name));
}
