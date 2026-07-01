import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';

export const metadata: Metadata = {
  title: 'Freedom Paws ID • Biometric Pet Identity',
  description:
    'Enroll your dog with ViT vision — eyes, face, body, posture, and gait — for lost-dog matching. Shelter pilot: Tennessee.',
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
    desc: 'Tennessee pilot intake — photo or video, auto similarity search, human review.',
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
    desc: 'E2E proof points, pilot steps, and LOI email template for Tennessee partners.',
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
    desc: 'Scan or paste 9/10/15-digit chip IDs — link to biometric Freedom Paws ID (WorldScan wedge supported).',
    cta: 'SCAN CHIP →',
    href: '/id/scan',
    status: 'live' as const,
  },
  {
    icon: '🔍',
    title: 'Registry Lookup',
    desc: 'Validate chip format → open AAHA Universal Lookup + AVID branch guidance.',
    cta: 'LOOKUP →',
    href: '/id/lookup',
    status: 'live' as const,
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
    <PageShell maxWidth="lg" backLink={{ href: '/', label: 'Back to Home' }}>
      <PageHeader
        center
        eyebrow="Freedom Paws ID"
        eyebrowVariant="emerald"
        title="Biometric pet identity"
        subtitle={
          <>
            ViT vision for <strong className="text-white/90">unchipped dogs</strong> — eyes, face,
            body, posture, and gait. Tennessee shelter pilot — expanding after validation.
          </>
        }
        className="mt-2"
      />

      <ul className="space-y-4">
        {hubCards.map((card) => (
          <li key={card.href}>
            <Link href={card.href} className="block group">
              <SectionCard
                variant="glass"
                className="transition hover:border-amber-400/40 hover:bg-[#132A4F]/90 active:border-amber-400/60 touch-manipulation"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl" aria-hidden>
                    {card.icon}
                  </span>
                  {statusBadge(card.status)}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{card.title}</h2>
                <p className="mt-1 text-sm text-white/65 leading-relaxed">{card.desc}</p>
                <p className="mt-3 text-xs font-bold tracking-wider text-amber-400">{card.cta}</p>
              </SectionCard>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-xs leading-relaxed text-white/45">
        Freedom Paws ID is not a government pet license. Not veterinary advice. Biometric enrollment
        requires explicit consent. Match results require human review before owner contact.
      </p>
    </PageShell>
  );
}
