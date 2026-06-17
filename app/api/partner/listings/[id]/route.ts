import { NextRequest, NextResponse } from 'next/server';
import { requirePartnerStaff } from '@/lib/api/auth';
import { canChangeListingStatus } from '@/lib/partner/listing-auth';
import { getListingById, updateListing } from '@/lib/partner/listings-server';
import { parseUpdateListingBody } from '@/lib/partner/listing-validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { profile, error } = await requirePartnerStaff();
  if (error) return error;

  const { id } = await context.params;

  try {
    const listing = await getListingById(id, profile!);
    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, listing });
  } catch (err) {
    console.error('[api/partner/listings/[id] GET]', err);
    return NextResponse.json({ success: false, error: 'Could not load listing.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { profile, error } = await requirePartnerStaff();
  if (error) return error;

  const { id } = await context.params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const patch = parseUpdateListingBody(body);

    if (patch.status && !canChangeListingStatus(profile!.role)) {
      return NextResponse.json(
        { success: false, error: 'Only shelter admin or FP ops can change listing status.' },
        { status: 403 }
      );
    }

    const existing = await getListingById(id, profile!);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
    }

    const nextPhotos = patch.photoUrls ?? existing.photoUrls;
    const nextStatus = patch.status ?? existing.status;
    if (
      nextStatus !== 'draft' &&
      nextPhotos.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'Published listings need at least one photo.' },
        { status: 400 }
      );
    }

    const listing = await updateListing(profile!, id, patch);
    return NextResponse.json({ success: true, listing });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not update listing.';
    console.error('[api/partner/listings/[id] PATCH]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
