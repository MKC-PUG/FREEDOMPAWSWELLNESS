import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from '../enroll/EnrollSetupRequired';
import IdSettingsClient from './IdSettingsClient';

export const metadata: Metadata = {
  title: 'ID Settings • Freedom Paws ID',
  description: 'Manage match alerts and revoke biometric enrollment data.',
};

export default async function IdSettingsPage() {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/id/settings');
  }

  return <IdSettingsClient userEmail={user.email ?? 'your account'} />;
}
