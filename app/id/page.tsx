import type { Metadata } from 'next';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';

export const metadata: Metadata = {
  title: 'Freedom Paws ID • Biometric Pet Identity',
  description:
    'Enroll your dog with ViT vision — eyes, face, body, posture, and gait — for lost-dog matching. Shelter pilot: California & Tennessee.',
};

const hubCards = [
  {
    icon: '📸',
    title: 'Enroll Biometric ID',
    desc: 'Full 9-step wizard: pet, consent, 6 vision regions, review, embedding & QR card.',
    cta: 'START ENROLL →',
    href: '/id/enroll',
    status: 'live' as const,
  },
  {
    icon: '🔬',
    title: 'ViT Identity Capture',
    desc: 'Test vision regions in Diagnostics — same AI engine as wellness, tuned for reunion.',
    cta: 'OPEN DIAGNOSTICS →',
    href: '/diagnostics?mode=identity',
    status: 'live' as const,
  },
  {
    icon: '🐾',
    title: 'My Pets',
    desc: 'Add or manage pet profiles before enrolling biometric ID.',
    cta: 'MY PETS →',
    href: '/mypets',
    status: 'live' as const,
  },
  {
    icon: '🏠',
    title: 'Report Found Dog',
    desc: 'CA/TN pilot intake — photo or video, auto similarity search, human review.',
    cta: 'SHELTER INTAKE →',
    href: '/id/found',
    status: 'live' as const,
  },
  {
    icon: '🌿',
    title: 'Wellness Partners',
    desc: 'Holistic telehealth referrals, pet insurance affiliates, and prevention education — wellness-first, not pharmaceutical care.',
    cta: 'WELLNESS HUB →',
    href: '/wellness',
    status: 'live' as const,
  },
  {
    icon: '✅',
    title: 'Safe Picks',
    desc: 'Vetted non-toxic chews, toys, and home products — linked from ViT results and protocols.',
    cta: 'SAFE PICKS →',
    href: '/wellness/safe-products',
    status: 'live' as const,
  },
  {
    icon: '🛡️',
    title: 'Shelter Dashboard',
    desc: 'Found-dog intake + match review queue for pilot partners.',
    cta: 'SHELTER PORTAL →',
    href: '/id/shelter',
    status: 'live' as const,
  },
  {
    icon: '📋',
    title: 'Shelter Outreach Kit',
    desc: 'E2E proof points, pilot steps, and LOI email template for CA/TN partners.',
    cta: 'OUTREACH KIT →',
    href: '/id/shelter/outreach',
    status: 'live' as const,
  },
  {
    icon: '⚙️',
    title: 'ID Settings',
    desc: 'Match email alerts, revoke biometric data, view enrollments.',
    cta: 'SETTINGS →',
    href: '/id/settings',
    status: 'live' as const,
  },
  {
    icon: '📡',
    title: 'Microchip Scan',
    desc: 'Universal scanner for 125 / 128 / 134.2 kHz chips — Track 2 (after biometric pilot).',
    cta: 'TRACK 2 PREVIEW →',
    href: '/id/scan',
    status: 'planned' as const,
  },
  {
    icon: '🔍',
    title: 'Registry Lookup',
    desc: 'AAHA routing + AVID branch for scanned chip IDs.',
    cta: 'TRACK 2 PREVIEW →',
    href: '/id/lookup',
    status: 'planned' as const,
  },
  {
    icon: '🛒',
    title: 'Scanner Kit',
    desc: 'Shelter/vet Bluetooth scanner — pilot kit ~$129 (decision pending).',
    cta: 'TRACK 2 PREVIEW →',
    href: '/id/kit',
    status: 'planned' as const,
  },
];

function statusBadge(status: 'live' | 'coming_soon' | 'planned') {
  if (status === 'live') {
    return (
      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
        Live
      </span>
    );
  }
  if (status === 'coming_soon') {
    return (
      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
        Building
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
      Track 2
    </span>
  );
}

export default function FreedomPawsIdPage() {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/" label="Back to Home" />

        <header className="mt-6 mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Freedom Paws ID
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight">
            Biometric pet identity
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            ViT vision for <strong className="text-white/90">unchipped dogs</strong> — eyes,
            face, body, posture, and gait. Shelter pilot: California &amp; Tennessee.
            Microchip module follows after Oct 2026 pilot.
          </p>
        </header>

        <ul className="space-y-4">
          {hubCards.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-amber-400/40 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl" aria-hidden>
                    {card.icon}
                  </span>
                  {statusBadge(card.status)}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{card.title}</h2>
                <p className="mt-1 text-sm text-white/65">{card.desc}</p>
                <p className="mt-3 text-sm font-semibold text-amber-400">{card.cta}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs leading-relaxed text-white/45">
          Freedom Paws ID is not a government pet license. Not veterinary advice.
          Biometric enrollment requires explicit consent. Match results require human
          review before owner contact.
        </p>
      </div>
    </div>
  );
}
