import type { Metadata } from 'next';
import LoginClient from './LoginClient';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata: Metadata = {
  title: 'Sign in • Freedom Paws',
  description: 'Sign in to manage pets and enroll Freedom Paws ID.',
};

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <LoginClient
      nextPath={params.next ?? '/mypets'}
      configured={configured}
      authError={params.error === 'auth'}
    />
  );
}
