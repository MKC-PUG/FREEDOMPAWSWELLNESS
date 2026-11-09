import { NextRequest, NextResponse } from 'next/server';
import { grantEntitlement, periodEndForCheckout } from '@/lib/shop/entitlements-server';
import { getServerUser } from '@/lib/supabase/server';
import { getPayloadStatus } from '@/lib/xumm/server';

export async function GET(request: NextRequest) {
  const uuid = request.nextUrl.searchParams.get('uuid')?.trim();
  if (!uuid) {
    return NextResponse.json(
      { ok: false, code: 'MISSING_UUID', error: 'Payload uuid is required.' },
      { status: 400 }
    );
  }

  const result = await getPayloadStatus(uuid);
  if (!result.ok) {
    return NextResponse.json(result, { status: 503 });
  }

  let granted = false;
  if (result.signed && result.grant) {
    const user = await getServerUser();
    if (user && user.id === result.grant.userId) {
      const write = await grantEntitlement({
        userId: user.id,
        plan: result.grant.plan,
        protocolSlug: result.grant.protocolSlug,
        periodEnd: periodEndForCheckout(result.grant.plan, null),
        source: 'xaman',
        xummUuid: uuid,
      });
      granted = write.ok;
      if (!write.ok) {
        return NextResponse.json({ ...result, granted: false, error: write.error }, { status: 503 });
      }
    }
  }

  return NextResponse.json({ ...result, granted });
}
