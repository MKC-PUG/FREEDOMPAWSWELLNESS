import { NextResponse } from 'next/server';
import { getSafeProductsStatus } from '@/lib/wellness/safe-products';

export async function GET() {
  const status = getSafeProductsStatus();
  return NextResponse.json({ success: true, ...status });
}
