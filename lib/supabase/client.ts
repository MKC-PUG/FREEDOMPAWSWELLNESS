'use client';

import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
    );
  }
  return browserClient;
}
