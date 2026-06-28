import { NextResponse } from 'next/server';
import { getPhotoBoothAffiliateStatus } from '@/lib/photobooth/affiliates';

export async function GET() {
  return NextResponse.json(getPhotoBoothAffiliateStatus());
}
