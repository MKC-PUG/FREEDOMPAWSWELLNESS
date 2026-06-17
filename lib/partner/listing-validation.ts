import {
  ADOPTION_BREEDS,
  ADOPTION_AGE_BANDS,
  ADOPTION_SEX_OPTIONS,
  ADOPTION_SIZES,
  BREED_MIXED,
} from '@/lib/partner/breeds';
import type {
  CreateListingInput,
  ListingAgeBand,
  ListingSex,
  ListingSize,
  ListingStatus,
  UpdateListingInput,
} from '@/lib/partner/listings-types';

const BREED_SET = new Set<string>(ADOPTION_BREEDS);
const SEX_SET = new Set(ADOPTION_SEX_OPTIONS.map((o) => o.value));
const AGE_SET = new Set(ADOPTION_AGE_BANDS.map((o) => o.value));
const SIZE_SET = new Set(ADOPTION_SIZES.map((o) => o.value));
const STATUS_SET = new Set<ListingStatus>([
  'draft',
  'available',
  'pending',
  'adopted',
  'archived',
]);

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function optionalStr(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = str(v);
  return s || null;
}

export function parseCreateListingBody(body: Record<string, unknown>): CreateListingInput {
  const displayName = str(body.displayName);
  if (!displayName) throw new Error('Display name is required.');

  const breedPrimary = str(body.breedPrimary);
  if (!BREED_SET.has(breedPrimary)) throw new Error('Select a valid primary breed.');

  const breedSecondary = optionalStr(body.breedSecondary);
  if (breedPrimary === BREED_MIXED && !breedSecondary) {
    throw new Error('Mixed breed listings need a secondary breed or description.');
  }

  const sex = str(body.sex) as ListingSex;
  if (!SEX_SET.has(sex)) throw new Error('Select sex.');

  const ageBand = str(body.ageBand) as ListingAgeBand;
  if (!AGE_SET.has(ageBand)) throw new Error('Select age band.');

  const sizeRaw = body.size === undefined || body.size === null ? 'unknown' : str(body.size);
  const size = sizeRaw as ListingSize;
  if (!SIZE_SET.has(size)) throw new Error('Select size.');

  const bio = str(body.bio);
  if (!bio) throw new Error('Bio is required.');

  const shelterId = str(body.shelterId);
  if (!shelterId) throw new Error('Shelter is required.');

  const photoUrls = Array.isArray(body.photoUrls)
    ? body.photoUrls.filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
    : [];

  const primaryPhotoUrl =
    typeof body.primaryPhotoUrl === 'string' ? body.primaryPhotoUrl.trim() || null : null;

  return {
    shelterId,
    displayName,
    breedPrimary,
    breedSecondary,
    sex,
    ageBand,
    size,
    bio,
    photoUrls,
    primaryPhotoUrl,
  };
}

export function parseUpdateListingBody(body: Record<string, unknown>): UpdateListingInput {
  const patch: UpdateListingInput = {};

  if (body.displayName !== undefined) {
    const displayName = str(body.displayName);
    if (!displayName) throw new Error('Display name cannot be empty.');
    patch.displayName = displayName;
  }

  if (body.breedPrimary !== undefined) {
    const breedPrimary = str(body.breedPrimary);
    if (!BREED_SET.has(breedPrimary)) throw new Error('Select a valid primary breed.');
    patch.breedPrimary = breedPrimary;
  }

  if (body.breedSecondary !== undefined) {
    patch.breedSecondary = optionalStr(body.breedSecondary);
  }

  if (body.sex !== undefined) {
    const sex = str(body.sex) as ListingSex;
    if (!SEX_SET.has(sex)) throw new Error('Select sex.');
    patch.sex = sex;
  }

  if (body.ageBand !== undefined) {
    const ageBand = str(body.ageBand) as ListingAgeBand;
    if (!AGE_SET.has(ageBand)) throw new Error('Select age band.');
    patch.ageBand = ageBand;
  }

  if (body.size !== undefined) {
    const size = str(body.size) as ListingSize;
    if (!SIZE_SET.has(size)) throw new Error('Select size.');
    patch.size = size;
  }

  if (body.bio !== undefined) {
    const bio = str(body.bio);
    if (!bio) throw new Error('Bio cannot be empty.');
    patch.bio = bio;
  }

  if (body.photoUrls !== undefined) {
    if (!Array.isArray(body.photoUrls)) throw new Error('photoUrls must be an array.');
    patch.photoUrls = body.photoUrls.filter(
      (u): u is string => typeof u === 'string' && u.trim().length > 0
    );
  }

  if (body.primaryPhotoUrl !== undefined) {
    patch.primaryPhotoUrl =
      typeof body.primaryPhotoUrl === 'string' ? body.primaryPhotoUrl.trim() || null : null;
  }

  if (body.status !== undefined) {
    const status = str(body.status) as ListingStatus;
    if (!STATUS_SET.has(status)) throw new Error('Invalid status.');
    patch.status = status;
  }

  return patch;
}
