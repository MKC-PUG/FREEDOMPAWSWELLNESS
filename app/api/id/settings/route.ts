import { NextRequest, NextResponse } from 'next/server';
import { requireApiUserWithProfile } from '@/lib/api/auth';
import { getOwnerIdSettings, setAlertEmailEnabled } from '@/lib/id/settings-server';

export async function GET() {
  const { user, error } = await requireApiUserWithProfile();
  if (error) return error;

  try {
    const settings = await getOwnerIdSettings(user!.id);
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error('[api/id/settings GET]', err);
    return NextResponse.json({ success: false, error: 'Could not load settings.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireApiUserWithProfile();
  if (error) return error;

  try {
    const body = (await request.json()) as { alertEmailEnabled?: boolean };
    if (typeof body.alertEmailEnabled !== 'boolean') {
      return NextResponse.json({ success: false, error: 'alertEmailEnabled required.' }, { status: 400 });
    }
    await setAlertEmailEnabled(user!.id, body.alertEmailEnabled);
    const settings = await getOwnerIdSettings(user!.id);
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error('[api/id/settings PATCH]', err);
    return NextResponse.json({ success: false, error: 'Could not update settings.' }, { status: 500 });
  }
}
