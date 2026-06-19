import { NextResponse } from 'next/server';
import { loginUrlWithError, safeNextPath } from '@/lib/auth/safe-next-path';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/** PKCE OAuth callback — kept for older magic links and OAuth providers. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const safeNext = safeNextPath(searchParams.get('next'), '/mypets');

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message);
  }

  return NextResponse.redirect(loginUrlWithError(origin, safeNext));
}
