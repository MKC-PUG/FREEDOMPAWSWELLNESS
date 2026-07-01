import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import { LEGAL_LAST_UPDATED, PRIVACY_SECTIONS, TERMS_SECTIONS } from '@/lib/legal/content';

type Props = {
  kind: 'terms' | 'privacy';
  title: string;
  intro: string;
};

export default function LegalPageShell({ kind, title, intro }: Props) {
  const sections = kind === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <PageShell maxWidth="lg" backLink={{ href: '/', label: 'Back to Home' }}>
      <PageHeader
        eyebrow="Legal"
        eyebrowVariant="gold"
        title={title}
        subtitle={
          <>
            Last updated {LEGAL_LAST_UPDATED}
            <span className="block mt-4 text-sm text-white/65 leading-relaxed font-normal">
              {intro}
            </span>
          </>
        }
        className="mt-2 mb-8"
      />

      <SectionCard className="mb-8 border-amber-400/25 bg-amber-950/20 text-xs text-amber-200/85 leading-relaxed">
        This is a founder draft for pilot operations — not formal legal counsel. Have your
        attorney review before broad public marketing.
      </SectionCard>

      <div className="space-y-6">
        {sections.map((section) => (
          <SectionCard key={section.title}>
            <h2 className="text-sm font-bold text-white/90">{section.title}</h2>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">{section.body}</p>
          </SectionCard>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-white/45">
        {kind === 'terms' ? (
          <>
            Privacy policy:{' '}
            <Link href="/privacy" className="text-emerald-400/90 underline">
              /privacy
            </Link>
          </>
        ) : (
          <>
            Terms of use:{' '}
            <Link href="/terms" className="text-emerald-400/90 underline">
              /terms
            </Link>
          </>
        )}
      </p>
    </PageShell>
  );
}
