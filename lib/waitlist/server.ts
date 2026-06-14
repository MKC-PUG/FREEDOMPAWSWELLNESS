import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isResendConfigured } from '@/lib/email/match-owner-alert';
import { Resend } from 'resend';

export type WaitlistSignupResult = {
  ok: boolean;
  duplicate?: boolean;
  error?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signupWaitlist(
  email: string,
  source?: string | null
): Promise<WaitlistSignupResult> {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_RE.test(normalized)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }

  let duplicate = false;

  try {
    const admin = createSupabaseAdminClient();
    if (!admin) {
      return { ok: false, error: 'Waitlist storage unavailable.' };
    }

    const { error } = await admin.from('waitlist_signups').insert({
      email: normalized,
      source: source?.trim() || 'waitlist-page',
    });

    if (error) {
      if (error.code === '23505') {
        duplicate = true;
      } else {
        console.error('[waitlist] insert error:', error);
        return { ok: false, error: 'Could not save signup. Try again shortly.' };
      }
    }
  } catch (err) {
    console.error('[waitlist]', err);
    return { ok: false, error: 'Waitlist storage unavailable.' };
  }

  if (isResendConfigured()) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY!.trim());
      const from =
        process.env.RESEND_FROM_EMAIL?.trim() || 'Freedom Paws <onboarding@resend.dev>';
      const ops = process.env.FP_OPS_EMAIL?.trim() || 'info@freedompawsinc.com';

      await resend.emails.send({
        from,
        to: ops,
        subject: duplicate
          ? `[Waitlist] Repeat signup — ${normalized}`
          : `[Waitlist] New founding member — ${normalized}`,
        text: `Email: ${normalized}\nSource: ${source || 'waitlist-page'}\nDuplicate: ${duplicate ? 'yes' : 'no'}`,
      });

      await resend.emails.send({
        from,
        to: normalized,
        subject: duplicate
          ? 'You are already on the Freedom Paws founding list'
          : 'Welcome to the Freedom Paws founding community',
        text: duplicate
          ? 'You are already on our founding community waitlist. We will email you when new pilot slots and partner launches open.'
          : 'Thank you for joining the Freedom Paws founding community waitlist. We will share pilot updates, Safe Picks launches, and shelter partnership news as they go live.',
      });
    } catch (err) {
      console.error('[waitlist] email error:', err);
    }
  }

  return { ok: true, duplicate };
}
