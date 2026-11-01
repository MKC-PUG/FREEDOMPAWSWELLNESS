import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { requireFpOps } from '@/lib/api/auth';
import { exchangeAuthCode } from '@/lib/ops/canva';

export async function GET(request: Request) {
  const { error } = await requireFpOps();
  if (error) return error;

  const url = new URL(request.url);
  const desk = new URL('/ops/desk', url.origin);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const jar = await cookies();
  const raw = jar.get('fp_canva_pkce')?.value;
  jar.set('fp_canva_pkce', '', { httpOnly: true, path: '/api/ops/canva', maxAge: 0 });

  let saved: { verifier?: string; state?: string } = {};
  try {
    saved = raw ? (JSON.parse(raw) as { verifier?: string; state?: string }) : {};
  } catch {
    saved = {};
  }

  if (!code || !state || !saved.verifier || saved.state !== state) {
    desk.searchParams.set('canva', 'error');
    return NextResponse.redirect(desk);
  }

  try {
    await exchangeAuthCode({ code, verifier: saved.verifier, origin: url.origin });
    desk.searchParams.set('canva', 'connected');
  } catch {
    desk.searchParams.set('canva', 'error');
  }
  return NextResponse.redirect(desk);
}
