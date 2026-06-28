import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from '../enroll/EnrollSetupRequired';
import ScanClient from './ScanClient';

export const metadata: Metadata = {
  title: 'Microchip Scan • Freedom Paws ID',
  description: 'Scan or paste a microchip ID — link to your Freedom Paws biometric profile.',
};

export default async function IdScanPage() {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/id/scan');
  }

  return <ScanClient userEmail={user.email ?? 'your account'} />;
}
