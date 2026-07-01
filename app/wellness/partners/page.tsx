import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import { PARTNER_POLICIES } from '@/lib/wellness/partner-policies';

export const metadata: Metadata = {
  title: 'Wellness Partner Program • Freedom Paws',
  description:
    'Acceptance standards and financial best practices for insurance affiliate and holistic telehealth partners.',
};

const PROGRAM_CARDS = [
  {
    slug: 'insurance' as const,
    icon: '🛡️',
    title: 'Pet insurance affiliates',
    desc: 'Rev share, CPA, member discounts, lost-dog & urgent-care funnel requirements.',
    href: '/wellness/partners/insurance',
  },
  {
    slug: 'telehealth' as const,
    icon: '🌿',
    title: 'Holistic telehealth partners',
    desc: 'Integrative vet standards, per-consult referral fees, and wellness-first exclusions.',
    href: '/wellness/partners/telehealth',
  },
  {
    slug: 'print' as const,
    icon: '🎁',
    title: 'Photo Booth print & gifts',
    desc: 'Framed prints, mugs, pillows, non-toxic blankets, and Christmas greeting cards from member pet photos.',
    href: '/photobooth/partners',
  },
];

export default function WellnessPartnersHubPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/wellness', label: 'Back to Wellness' }}>
      <PageHeader
        eyebrow="For prospective partners"
        eyebrowVariant="gold"
        title="Freedom Paws Partner Program"
        subtitle={
          <>
            Best practices, acceptance criteria, and recommended financial structures for insurance
            affiliates and holistic telehealth providers. We partner only with organizations aligned
            with <strong className="text-white/90">wellness-first, prevention-focused</strong>{' '}
            care — not pharmaceutical-first veterinary models.
          </>
        }
        className="mt-2 mb-8"
      />

      <SectionCard variant="glass" className="mb-6">
          <h2 className="text-sm font-bold text-amber-300">Shared principles</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/65 list-disc pl-5">
            <li>Members receive tangible savings vs. direct signup (required).</li>
            <li>FTC-compliant disclosure on all affiliate surfaces.</li>
            <li>Freedom Paws is education &amp; referral — not insurer, clinic, or prescriber.</li>
            <li>ViT urgent gating (≥80% severe-indicator congruency) always defers to in-person ER when indicated.</li>
            <li>Partners removed if misaligned with natural wellness positioning.</li>
          </ul>
          <p className="mt-4 text-xs text-white/45">
            Contact:{' '}
            <a href="mailto:partners@freedompawsinc.com" className="text-amber-400/90">
              partners@freedompawsinc.com
            </a>
          </p>
      </SectionCard>

      <ul className="space-y-4 mb-8">
        {PROGRAM_CARDS.map((card) => {
          const policy = card.slug === 'print' ? null : PARTNER_POLICIES[card.slug];
          return (
            <li key={card.slug}>
              <Link href={card.href} className="block group">
                <SectionCard variant="glass" className="transition hover:border-amber-400/40">
                  <span className="text-2xl" aria-hidden>
                    {card.icon}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold">{card.title}</h2>
                  <p className="mt-1 text-sm text-white/60">{card.desc}</p>
                  <p className="mt-3 text-xs font-bold text-amber-400 uppercase tracking-wide">
                    View full standards →
                  </p>
                  {policy && (
                    <p className="mt-2 text-[10px] text-white/40">
                      Preferred: {policy.financialStructure.preferred[0]?.structure.slice(0, 60)}…
                    </p>
                  )}
                </SectionCard>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/wellness"
        className="block rounded-2xl border border-white/10 py-4 text-center text-sm font-semibold text-white/80 hover:text-white transition"
      >
        Return to member wellness hub →
      </Link>
    </PageShell>
  );
}
