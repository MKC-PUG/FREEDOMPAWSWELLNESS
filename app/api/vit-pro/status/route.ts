import { NextResponse } from 'next/server';
import { canAccessVitPro } from '@/lib/vit-pro/access';
import { ensureUserProfile } from '@/lib/id/profiles';
import { getVitProModuleStatus } from '@/lib/vit-pro/status-server';
import { getServerUser } from '@/lib/supabase/server';

export async function GET() {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await ensureUserProfile(user.id, user.email);
  if (!canAccessVitPro(profile.role, user.email)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    status: getVitProModuleStatus(),
  });
}
