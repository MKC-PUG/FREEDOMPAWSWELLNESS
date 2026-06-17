import { NextRequest, NextResponse } from 'next/server';
import { requirePartnerStaff } from '@/lib/api/auth';
import {
  createListing,
  listPartnerListings,
} from '@/lib/partner/listings-server';
import { parseCreateListingBody } from '@/lib/partner/listing-validation';
import { canChangeListingStatus } from '@/lib/partner/listing-auth';

export async function GET() {
  const { profile, error } = await requirePartnerStaff();
  if (error) return error;

  try {
    const listings = await listPartnerListings(profile!);
    return NextResponse.json({ success: true, listings });
  } catch (err) {
    console.error('[api/partner/listings GET]', err);
    return NextResponse.json({ success: false, error: 'Could not load listings.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, profile, error } = await requirePartnerStaff();
  if (error) return error;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input = parseCreateListingBody(body);

    if ((input.photoUrls ?? []).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Add at least one photo before saving.' },
        { status: 400 }
      );
    }

    const listing = await createListing(profile!, user!.id, input);
    return NextResponse.json({ success: true, listing });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not create listing.';
    console.error('[api/partner/listings POST]', err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
