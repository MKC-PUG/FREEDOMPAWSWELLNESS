'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BackLink from '@/app/components/BackLink';
import BrandLogo from '@/app/components/BrandLogo';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Props = {
  nextPath: string;
  configured: boolean;
  authError: boolean;
};

export default function LoginClient({ nextPath, configured, authError }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(
    authError
      ? 'Sign-in link expired or invalid. Request a new link, then open it once in Safari — or enter the 6-digit code from the same email below.'
      : ''
  );

  const signIn = async () => {
    if (!configured) return;
    if (!email.trim()) {
      setError('Enter your email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`;
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }
      setSent(true);
    } catch {
      setError('Could not send sign-in link.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!configured || !email.trim()) return;
    const code = otpCode.replace(/\D/g, '');
    if (code.length < 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'email',
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }
      router.push(nextPath);
      router.refresh();
    } catch {
      setError('Could not verify code.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-md px-6 py-10">
        <BackLink href="/" />

        <header className="mt-6 mb-8 text-center">
          <BrandLogo href="/" variant="consumer" size="hero" className="mx-auto" />
          <h1 className="mt-6 text-2xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-white/65">
            Use your email for a magic link — required for Freedom Paws ID enrollment and
            server-backed pet profiles.
          </p>
        </header>

        {!configured ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-900/20 p-5 text-sm text-amber-200">
            Supabase is not configured yet. Add{' '}
            <code className="text-amber-100">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-amber-100">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
            <code className="text-amber-100">.env.local</code>, run the SQL migration in{' '}
            <code className="text-amber-100">supabase/migrations/</code>, then restart the dev
            server.
          </div>
        ) : sent ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-6 text-center">
              <p className="font-semibold text-emerald-300">Check your email</p>
              <p className="mt-2 text-sm text-white/70">
                We sent a sign-in link and 6-digit code to <strong>{email}</strong>. Tap the link
                once, or enter the code below (works even if the link was already used).
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-[#0A1428] p-5">
              <p className="mb-3 text-sm font-medium text-white/80">Or enter code from email</p>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full rounded-2xl border border-white/20 bg-[#0A1625] px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                disabled={verifying}
                onClick={() => void verifyCode()}
                className="mt-3 w-full rounded-2xl bg-amber-400 py-3 font-bold text-black disabled:opacity-50"
              >
                {verifying ? 'Verifying…' : 'Sign in with code'}
              </button>
            </div>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/20 bg-[#0A1428] px-4 py-3 text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => void signIn()}
              className="w-full rounded-2xl bg-amber-400 py-4 font-bold text-black disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Email me a sign-in link'}
            </button>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-white/45">
          My Pets still works offline on this device without signing in.{' '}
          <Link href="/mypets" className="text-amber-400/80 underline">
            Continue without account →
          </Link>
        </p>
      </div>
    </div>
  );
}
