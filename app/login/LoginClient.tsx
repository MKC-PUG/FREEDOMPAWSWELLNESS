'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Props = {
  nextPath: string;
  configured: boolean;
  authError: boolean;
};

export default function LoginClient({ nextPath, configured, authError }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(
    authError
      ? 'Sign-in link expired or invalid. Request a new link, then open it once in Safari (long-press → Open in Safari if Mail opened a preview).'
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

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-md px-6 py-10">
        <BackLink href="/" />

        <header className="mt-6 mb-8 text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
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
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-6 text-center">
            <p className="font-semibold text-emerald-300">Check your email</p>
            <p className="mt-2 text-sm text-white/70">
              We sent a sign-in link to <strong>{email}</strong>. Tap it once in your email app.
              On iPhone, if sign-in fails, long-press the link and choose <strong>Open in Safari</strong>.
            </p>
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
