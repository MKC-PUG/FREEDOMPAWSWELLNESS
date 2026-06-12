'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';

type Enrollment = {
  enrollmentId: string;
  petName: string;
  status: string;
  freedomPawsId: string | null;
  qrSlug: string | null;
};

type Props = {
  userEmail: string;
};

export default function IdSettingsClient({ userEmail }: Props) {
  const [alertEmailEnabled, setAlertEmailEnabled] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/id/settings', { credentials: 'include' });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Could not load settings.');
        return;
      }
      setAlertEmailEnabled(data.settings.alertEmailEnabled);
      setEnrollments(data.settings.enrollments ?? []);
    } catch {
      setError('Connection error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleAlerts = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/id/settings', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertEmailEnabled: !alertEmailEnabled }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Update failed.');
        return;
      }
      setAlertEmailEnabled(data.settings.alertEmailEnabled);
      setMessage('Alert preferences saved.');
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (enrollmentId: string, petName: string) => {
    if (
      !window.confirm(
        `Revoke biometric ID for ${petName}? Embeddings and captures will be deleted. This cannot be undone.`
      )
    ) {
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/id/settings/revoke', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Revoke failed.');
        return;
      }
      setEnrollments(data.settings.enrollments ?? []);
      setMessage(`Biometric data revoked for ${petName}.`);
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/id" label="Back to ID hub" />

        <header className="mt-4 mb-6">
          <h1 className="text-2xl font-bold">ID settings</h1>
          <p className="mt-1 text-xs text-white/50">{userEmail}</p>
        </header>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
            {message}
          </p>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
          <h2 className="font-semibold">Match alerts</h2>
          <p className="mt-1 text-sm text-white/60">
            Email when a shelter-approved potential match is found for your enrolled pet.
          </p>
          <button
            type="button"
            disabled={busy || loading}
            onClick={() => void toggleAlerts()}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold ${
              alertEmailEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/10 text-white/60 border border-white/20'
            }`}
          >
            {alertEmailEnabled ? '✓ Email alerts ON' : 'Email alerts OFF'}
          </button>
        </section>

        <section>
          <h2 className="font-semibold mb-3">Biometric enrollments</h2>
          {loading ? (
            <p className="text-sm text-white/50">Loading…</p>
          ) : enrollments.length === 0 ? (
            <p className="text-sm text-white/50">
              No active enrollments.{' '}
              <Link href="/id/enroll" className="text-amber-400 underline">
                Enroll now
              </Link>
            </p>
          ) : (
            <ul className="space-y-3">
              {enrollments.map((e) => (
                <li key={e.enrollmentId} className="rounded-2xl border border-white/10 p-4">
                  <p className="font-semibold">{e.petName}</p>
                  <p className="text-xs text-white/50 mt-1">
                    Status: {e.status}
                    {e.freedomPawsId && (
                      <span className="ml-2 font-mono text-amber-400/80">{e.freedomPawsId}</span>
                    )}
                  </p>
                  {e.qrSlug && e.status === 'complete' && (
                    <Link
                      href={`/id/p/${e.qrSlug}`}
                      className="mt-2 inline-block text-xs text-emerald-400 underline"
                    >
                      View QR card →
                    </Link>
                  )}
                  {e.status === 'complete' && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void revoke(e.enrollmentId, e.petName)}
                      className="mt-3 w-full rounded-xl border border-red-500/40 py-2 text-xs font-semibold text-red-300"
                    >
                      Revoke biometric data
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-8 text-[10px] text-white/40 leading-relaxed text-center">
          Freedom Paws ID is not a government pet license. Revoking removes embeddings and region
          captures from match search.
        </p>
      </div>
    </div>
  );
}
