import { NextResponse } from 'next/server';
import { protocols } from '@/app/protocols/protocols';
import { getProtocolAffiliateStatus } from '@/lib/protocols/affiliates';

export async function GET() {
  const titles = Object.fromEntries(protocols.map((p) => [p.slug, p.title]));
  const status = getProtocolAffiliateStatus(titles);
  return NextResponse.json({ success: true, ...status });
}
