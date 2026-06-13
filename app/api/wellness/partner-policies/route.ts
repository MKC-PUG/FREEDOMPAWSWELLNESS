import { NextResponse } from 'next/server';
import { PARTNER_POLICIES } from '@/lib/wellness/partner-policies';

export async function GET() {
  return NextResponse.json({
    success: true,
    contactEmail: 'partners@freedompawsinc.com',
    policies: PARTNER_POLICIES,
    pages: {
      hub: '/wellness/partners',
      insurance: '/wellness/partners/insurance',
      telehealth: '/wellness/partners/telehealth',
    },
  });
}
