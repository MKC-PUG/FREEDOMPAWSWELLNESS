import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { loginUrlWithError, safeNextPath } from '@/lib/auth/safe-next-path';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/** Server-side magic link confirm — works when email opens a fresh browser (no PKCE cookie). */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next');

  const origin = request.nextUrl.origin;
  const safeNext = safeNextPath(next, '/mypets');

  if (token_hash && type) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
      console.error('[auth/confirm] verifyOtp failed:', error.message);
    } catch (err) {
      console.error('[auth/confirm]', err);
    }
  }

  return NextResponse.redirect(loginUrlWithError(origin, safeNext));
}
