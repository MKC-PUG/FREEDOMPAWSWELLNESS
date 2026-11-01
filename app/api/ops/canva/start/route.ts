import { NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { authorizeUrl, canvaAppConfigured, createPkce } from '@/lib/ops/canva';

export async function GET(request: Request) {
  const { error } = await requireFpOps();
  if (error) return error;
  if (!canvaAppConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Add CANVA_CLIENT_ID and CANVA_CLIENT_SECRET in Vercel, then connect Canva.',
      },
      { status: 503 }
    );
  }

  const pkce = createPkce();
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(
    authorizeUrl({ origin, challenge: pkce.challenge, state: pkce.state })
  );
  response.cookies.set('fp_canva_pkce', JSON.stringify({ verifier: pkce.verifier, state: pkce.state }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/api/ops/canva',
    maxAge: 600,
  });
  return response;
}
