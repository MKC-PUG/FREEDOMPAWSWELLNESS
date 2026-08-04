'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import PrimaryButton from '@/app/components/ui/PrimaryButton';
import SecondaryButton from '@/app/components/ui/SecondaryButton';

type Enrollment = {
  enrollmentId: string;
  petName: string;
  status: string;
  freedomPawsId: string | null;
  qrSlug: string | null;
  microchipId: string | null;
  microchipLinkedAt: string | null;
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
      const res = await fetch('/api/id/settings', {
        credentials: 'include',
        signal: AbortSignal.timeout(12_000),
      });
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
    <PageShell maxWidth="lg">
      <BackLink href="/id" label="Back to ID hub" />

      <PageHeader
        eyebrow="Freedom Paws ID"
        eyebrowVariant="emerald"
        title="ID settings"
        subtitle={userEmail}
        className="mt-4 mb-6"
      />

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

        <SectionCard className="mb-6">
          <h2 className="font-semibold">Match alerts</h2>
          <p className="mt-1 text-sm text-white/60">
            Email when a shelter-approved potential match is found for your enrolled pet.
          </p>
          <SecondaryButton
            type="button"
            variant={alertEmailEnabled ? 'emerald' : 'neutral'}
            fullWidth
            disabled={busy || loading}
            onClick={() => void toggleAlerts()}
            className={`mt-4 ${alertEmailEnabled ? '' : ''}`}
          >
            {alertEmailEnabled ? '✓ Email alerts ON' : 'Email alerts OFF'}
          </SecondaryButton>
        </SectionCard>

        <SectionCard className="mb-6 border-amber-500/20 bg-amber-950/10">
          <h2 className="font-semibold text-amber-200">Microchip (Track 2)</h2>
          <p className="mt-1 text-sm text-white/60">
            Link a scanned chip to biometric ID or look up external registries.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/id/scan"
              className="inline-flex min-h-[44px] items-center rounded-xl bg-[#F5C242] px-4 py-2 text-xs font-bold text-black hover:bg-white transition"
            >
              Scan / link chip →
            </Link>
            <Link
              href="/id/lookup"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/25 px-4 py-2 text-xs font-semibold text-white/75 hover:border-white/40 transition"
            >
              AAHA lookup →
            </Link>
          </div>
        </SectionCard>

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
                <li key={e.enrollmentId}>
                <SectionCard padding="md">
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
                  {e.microchipId ? (
                    <p className="mt-2 text-xs text-white/55">
                      Microchip:{' '}
                      <span className="font-mono text-amber-300/90">{e.microchipId}</span>
                      {e.microchipLinkedAt && (
                        <span className="block mt-0.5 text-white/40">
                          Linked {new Date(e.microchipLinkedAt).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  ) : (
                    e.status === 'complete' && (
                      <Link
                        href="/id/scan"
                        className="mt-2 inline-block text-xs text-amber-400/90 underline"
                      >
                        Add microchip (optional) →
                      </Link>
                    )
                  )}
                  {e.status === 'complete' && (
                    <SecondaryButton
                      type="button"
                      variant="neutral"
                      fullWidth
                      disabled={busy}
                      onClick={() => void revoke(e.enrollmentId, e.petName)}
                      className="mt-3 !border-red-500/40 !text-red-300 hover:!border-red-400"
                    >
                      Revoke biometric data
                    </SecondaryButton>
                  )}
                </SectionCard>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-8 text-[10px] text-white/40 leading-relaxed text-center">
          Freedom Paws ID is not a government pet license. Revoking removes embeddings and region
          captures from match search.
        </p>
    </PageShell>
  );
}
