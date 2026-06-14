import { NextRequest, NextResponse } from 'next/server';
import { signupWaitlist } from '@/lib/waitlist/server';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; source?: string };
    if (!body.email?.trim()) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const result = await signupWaitlist(body.email, body.source);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      duplicate: result.duplicate ?? false,
      message: result.duplicate
        ? 'You are already on the founding list — we will keep you posted.'
        : 'Welcome to the founding community. Check your inbox for confirmation.',
    });
  } catch (err) {
    console.error('[api/waitlist]', err);
    return NextResponse.json({ success: false, error: 'Signup failed.' }, { status: 500 });
  }
}
