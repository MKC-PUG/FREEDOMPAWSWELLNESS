import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import SecondaryButton from '@/app/components/ui/SecondaryButton';

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  targetDate: string;
  bullets: string[];
};

export default function Track2Planned({ title, subtitle, icon, targetDate, bullets }: Props) {
  return (
    <PageShell maxWidth="lg">
      <BackLink href="/id" label="Back to ID hub" />

      <PageHeader
        center
        icon={icon}
        eyebrow="Track 2 · Planned"
        eyebrowVariant="emerald"
        title={title}
        subtitle={subtitle}
        badge={
          <span className="inline-block rounded-full border border-amber-500/40 bg-amber-900/20 px-4 py-1 text-xs font-semibold text-amber-300">
            Target: {targetDate}
          </span>
        }
        className="mt-4 mb-8"
      />

      <ul className="space-y-3 mb-8">
        {bullets.map((b) => (
          <li key={b}>
            <SectionCard variant="glass" className="text-sm text-white/75">
              {b}
            </SectionCard>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <Link href="/id/enroll" className="block">
          <SecondaryButton type="button" variant="emerald" fullWidth className="!font-bold">
            Enroll biometric ID now →
          </SecondaryButton>
        </Link>
        <Link href="/diagnostics?mode=identity" className="block">
          <SecondaryButton type="button" variant="neutral" fullWidth>
            Test ViT identity capture
          </SecondaryButton>
        </Link>
      </div>

      <p className="mt-8 text-center text-[10px] text-white/40 leading-relaxed">
        Biometric pilot launches Oct 1, 2026 (Tennessee). Track 2 ships after pilot validation.
        Phones cannot read implanted microchips — hardware scanner required.
      </p>
    </PageShell>
  );
}
