import { createClient } from '@supabase/supabase-js';

/** Server-only admin client — never expose service role to the browser. */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: init?.signal ?? AbortSignal.timeout(8_000),
        }),
    },
  });
}

export async function getOwnerEmailById(ownerId: string): Promise<string | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const { data, error } = await admin.auth.admin.getUserById(ownerId);
  if (error || !data.user?.email) return null;
  return data.user.email;
}
