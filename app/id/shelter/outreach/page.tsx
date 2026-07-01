import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import PrimaryButton from '@/app/components/ui/PrimaryButton';

export const metadata: Metadata = {
  title: 'Shelter Outreach Kit • Freedom Paws ID',
  description:
    'Pilot proof points, E2E runbook summary, and LOI template for Tennessee shelter partners.',
};

const proofPoints = [
  {
    label: 'E2E match verified',
    detail: 'Same-dog photo test: 87% similarity after intake-mirror embedding (up from 74% baseline). Human review → owner email delivered.',
  },
  {
    label: 'Pilot region',
    detail: 'Tennessee shelters first — six Adoption Network partners. Biometric ID for unchipped dogs before microchip Track 2 (Oct 2026+). Additional states after pilot validation.',
  },
  {
    label: 'Human-in-the-loop',
    detail: 'No automatic owner contact. Shelter staff approve candidates; Resend alerts owner after review.',
  },
  {
    label: 'ViT + wellness funnel',
    detail: 'Shelter intake uses eyes, face, body, posture regions — same vision stack as wellness ViT, tuned for reunion.',
  },
];

const steps = [
  'Schedule 20-min demo: enroll test dog → found intake → match queue → approve → owner alert.',
  'Sign LOI (non-binding) for 90-day pilot — intake training + match review SOP.',
  'Provide shelter contact for Resend alerts and dashboard access (/id/shelter).',
  'Optional: co-branded outreach to adopters for Freedom Paws ID enrollment.',
];

export default function ShelterOutreachPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/id', label: 'Back to ID hub' }}>
      <PageHeader
        eyebrow="Shelter outreach kit"
        eyebrowVariant="emerald"
        title="Partner with Freedom Paws ID"
        subtitle={
          <>
            Biometric reunion for <strong className="text-white/90">unchipped dogs</strong> — built
            on ViT vision, human review, and owner consent. Use this page in outreach emails and
            LOI conversations.
          </>
        }
        className="mt-2 mb-8"
      />

      <SectionCard className="mb-6 border-emerald-500/30 bg-emerald-950/20">
        <h2 className="text-sm font-bold text-emerald-300">Pilot proof points</h2>
        <ul className="mt-4 space-y-4">
          {proofPoints.map((p) => (
            <li key={p.label}>
              <p className="text-sm font-semibold text-white">{p.label}</p>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">{p.detail}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard className="mb-6">
        <h2 className="text-sm font-bold text-white/90">90-day pilot steps</h2>
        <ol className="mt-4 space-y-3 list-decimal pl-5 text-sm text-white/65 leading-relaxed">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </SectionCard>

      <SectionCard className="mb-6 border-amber-400/25 bg-amber-950/15">
        <h2 className="text-sm font-bold text-amber-300">Try the live flow</h2>
        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link
            href="/id/found"
            className="rounded-xl border border-white/10 py-3 text-center text-sm font-bold text-amber-300 hover:border-amber-400/40 transition"
          >
            Shelter found-dog intake →
          </Link>
          <Link
            href="/id/shelter"
            className="rounded-xl border border-white/10 py-3 text-center text-sm font-bold text-white/75 hover:text-white transition"
          >
            Shelter match dashboard →
          </Link>
          <Link
            href="/id/enroll"
            className="rounded-xl border border-white/10 py-3 text-center text-sm font-bold text-white/75 hover:text-white transition"
          >
            Owner enrollment wizard →
          </Link>
        </div>
      </SectionCard>

      <SectionCard variant="glass" className="text-center">
        <h2 className="text-sm font-bold text-white/90">Request LOI &amp; demo</h2>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          Email us with your shelter name, Tennessee county, and estimated monthly intakes.
        </p>
        <a
          href="mailto:shelter@freedompawsinc.com?subject=Freedom%20Paws%20ID%20Pilot%20LOI&body=Shelter%20name%3A%0ACounty%20(TN)%3A%0AMonthly%20intakes%20(estimate)%3A%0AContact%20name%20%26%20role%3A%0APreferred%20demo%20time%3A"
          className="mt-4 inline-block"
        >
          <PrimaryButton variant="emerald" className="!px-6 !text-sm">
            Email shelter@freedompawsinc.com →
          </PrimaryButton>
        </a>
        <p className="mt-4 text-xs text-white/40">
          CC:{' '}
          <a href="mailto:partners@freedompawsinc.com" className="text-emerald-400/80">
            partners@freedompawsinc.com
          </a>
        </p>
      </SectionCard>

      <p className="mt-8 text-center text-xs text-white/40 leading-relaxed">
        Freedom Paws ID is not a government pet license. Match results require human review before
        owner contact. Not veterinary advice.
      </p>
    </PageShell>
  );
}
