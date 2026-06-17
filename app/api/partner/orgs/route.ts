import { NextResponse } from 'next/server';
import { listTnPilotPartners } from '@/lib/partner/orgs-server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/** Public list of TN Adoption Network pilot partners (no PII). */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, error: 'Database not configured.' }, { status: 503 });
  }

  try {
    const partners = await listTnPilotPartners();
    return NextResponse.json({ success: true, partners });
  } catch (err) {
    console.error('[api/partner/orgs]', err);
    return NextResponse.json({ success: false, error: 'Could not load partners.' }, { status: 500 });
  }
}
