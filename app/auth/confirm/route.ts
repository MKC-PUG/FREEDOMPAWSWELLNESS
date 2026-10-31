import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { loginUrlWithError, safeNextPath } from '@/lib/auth/safe-next-path';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const OTP_TYPES_TO_TRY: EmailOtpType[] = ['magiclink', 'email'];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Mail apps prefetch links. A GET must not spend the one-time token. */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const code = request.nextUrl.searchParams.get('code');
  const next = request.nextUrl.searchParams.get('next');
  const origin = request.nextUrl.origin;

  if (!tokenHash && !code) {
    return NextResponse.redirect(loginUrlWithError(origin, safeNextPath(next)));
  }

  const action = escapeHtml(`${request.nextUrl.pathname}${request.nextUrl.search}`);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sign in • Freedom Paws</title>
</head>
<body style="margin:0;background:#0A1625;color:#fff;font-family:sans-serif;">
  <main style="max-width:24rem;margin:4rem auto;padding:1.5rem;text-align:center;">
    <h1 style="font-size:1.5rem;">Finish sign-in</h1>
    <p style="color:rgba(255,255,255,.7);">Tap continue once. This page does not sign you in until you tap.</p>
    <form method="post" action="${action}">
      <button type="submit" style="margin-top:1.5rem;width:100%;border:0;border-radius:1rem;background:#fbbf24;color:#000;font-weight:700;padding:1rem;">Continue</button>
    </form>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

/** The tap from the confirm page spends the one-time token. */
export async function POST(request: NextRequest) {
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
      return NextResponse.redirect(`${origin}${safeNext}`, { status: 303 });
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
          return NextResponse.redirect(`${origin}${safeNext}`, { status: 303 });
        }
        console.error(`[auth/confirm] verifyOtp type=${otpType} failed:`, error.message);
      } catch (err) {
        console.error(`[auth/confirm] verifyOtp type=${otpType}`, err);
      }
    }
  }

  return NextResponse.redirect(loginUrlWithError(origin, safeNext), { status: 303 });
}
