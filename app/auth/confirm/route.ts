import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { loginUrlWithError, safeNextPath } from '@/lib/auth/safe-next-path';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const OTP_TYPES_TO_TRY: EmailOtpType[] = ['magiclink', 'email'];

/** Server-side magic link confirm — works when email opens a fresh browser (no PKCE cookie). */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  const origin = request.nextUrl.origin;
  const safeNext = safeNextPath(next, '/mypets');

  const supabase = await createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    console.error('[auth/confirm] exchangeCodeForSession failed:', error.message);
  }

  if (token_hash) {
    const types = type
      ? [type, ...OTP_TYPES_TO_TRY.filter((t) => t !== type)]
      : OTP_TYPES_TO_TRY;

    for (const otpType of types) {
      try {
        const { error } = await supabase.auth.verifyOtp({ type: otpType, token_hash });
        if (!error) {
          return NextResponse.redirect(`${origin}${safeNext}`);
        }
        console.error(`[auth/confirm] verifyOtp type=${otpType} failed:`, error.message);
      } catch (err) {
        console.error(`[auth/confirm] verifyOtp type=${otpType}`, err);
      }
    }
  }

  return NextResponse.redirect(loginUrlWithError(origin, safeNext));
}
