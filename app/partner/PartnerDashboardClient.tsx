'use client';

import Link from 'next/link';
import type { ShelterDashboardStats } from '@/lib/id/shelter-stats';
import type { PartnerOrg } from '@/lib/partner/types';

type Props = {
  signedIn: boolean;
  userEmail?: string;
  partners: PartnerOrg[];
  role: string | null;
  isReviewer: boolean;
  stats: ShelterDashboardStats | null;
  shelterName: string | null;
};

function orgBadge(orgType: PartnerOrg['orgType']) {
  if (orgType === 'municipal') return 'Municipal';
  if (orgType === 'county') return 'County';
  return 'Private';
}

export default function PartnerDashboardClient({
  signedIn,
  userEmail,
  partners,
  role,
  isReviewer,
  stats,
  shelterName,
}: Props) {
  const municipal = partners.filter((p) => p.orgType === 'municipal');
  const privates = partners.filter((p) => p.orgType === 'private');

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Freedom Paws Adoption Network
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight">Partner dashboard</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Tennessee pilot — found-dog ID, adoption listings, and Adoption Studio
          </p>
        </header>

        {!signedIn ? (
          <div className="rounded-2xl border border-emerald-500/35 bg-emerald-950/25 p-6 text-center">
            <p className="text-sm text-white/75">
              Sign in with your shelter or municipal partner account to use intake and match tools.
            </p>
            <Link
              href="/login?next=/partner"
              className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-bold text-black touch-manipulation"
            >
              Sign in →
            </Link>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className="text-white/50">Signed in as</p>
            <p className="font-medium text-white">{userEmail}</p>
            <p className="mt-2 text-white/60">
              Role: <span className="text-emerald-300">{role}</span>
              {shelterName ? (
                <>
                  {' '}
                  · Org: <span className="text-white/85">{shelterName}</span>
                </>
              ) : null}
            </p>
          </div>
        )}

        {signedIn && isReviewer && stats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Found reports', value: stats.totalReports },
              { label: 'Pending reviews', value: stats.pendingReviews },
              { label: 'Matched', value: stats.matchedReports },
              { label: 'Pilot partners', value: stats.pilotShelters },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center"
              >
                <p className="text-2xl font-bold text-emerald-300">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {signedIn && (
          <ul className="space-y-4 mb-8">
            <li>
              <Link
                href="/id/found"
                className="block rounded-2xl border border-amber-500/40 bg-amber-900/20 p-5 hover:bg-amber-900/30 transition"
              >
                <p className="font-bold text-amber-300">Found dog intake →</p>
                <p className="mt-1 text-sm text-white/60">
                  Photo or video — automatic similarity search
                </p>
              </Link>
            </li>
            {isReviewer ? (
              <li>
                <Link
                  href="/id/match"
                  className="block rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-5 hover:bg-emerald-900/30 transition"
                >
                  <p className="font-bold text-emerald-300">Match review queue →</p>
                  <p className="mt-1 text-sm text-white/60">
                    Approve or reject before owner contact
                  </p>
                </Link>
              </li>
            ) : (
              <li className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
                Match review requires shelter admin or FP ops.
              </li>
            )}
            <li>
              <Link
                href="/partner/listings"
                className="block rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-5 hover:bg-emerald-900/30 transition"
              >
                <p className="font-bold text-emerald-300">Adoption listings →</p>
                <p className="mt-1 text-sm text-white/60">
                  Publish adoptable dogs to app.freedompawsinc.com/adopt/tn
                </p>
              </Link>
            </li>
            <li className="rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-5 opacity-80">
              <p className="text-xs font-bold uppercase tracking-wide text-white/45">
                Phase 4 — coming soon
              </p>
              <p className="mt-2 font-semibold text-white/70">Adoption Studio</p>
              <p className="mt-1 text-sm text-white/50">
                Shelter marketing photos and share packs (Photo Booth mode)
              </p>
            </li>
          </ul>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/50">
            TN pilot partners ({partners.length})
          </h2>
          {partners.length === 0 ? (
            <p className="mt-3 text-sm text-amber-300/90">
              No partners loaded — run Supabase migration{' '}
              <code className="text-xs">009_partner_orgs_tn_pilot.sql</code>.
            </p>
          ) : (
            <>
              {municipal.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
                    Municipal
                  </p>
                  <ul className="mt-2 space-y-2">
                    {municipal.map((p) => (
                      <PartnerRow key={p.id} org={p} />
                    ))}
                  </ul>
                </div>
              )}
              {privates.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
                    Private no-kill
                  </p>
                  <ul className="mt-2 space-y-2">
                    {privates.map((p) => (
                      <PartnerRow key={p.id} org={p} />
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>

        <p className="mt-8 text-center text-[10px] text-white/40 leading-relaxed">
          Partner portal · shelter.freedompawsinc.com · Same database as member ID matching
        </p>
      </div>
    </div>
  );
}

function PartnerRow({ org }: { org: PartnerOrg }) {
  return (
    <li className="rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-white/90">{org.name}</span>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wide text-white/50">
          {orgBadge(org.orgType)}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-white/45">
        {[org.city, org.county ? `${org.county} Co.` : null].filter(Boolean).join(', ')}
      </p>
    </li>
  );
}
