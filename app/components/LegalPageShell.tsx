import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import { PRIVACY_DOCUMENT, TERMS_DOCUMENT } from '@/lib/legal/content';

type Props = {
  kind: 'terms' | 'privacy';
};

function isHeading(line: string): boolean {
  if (line.length > 80) return false;
  if (/^\d+\.\s+[A-Z]/.test(line)) {
    const rest = line.replace(/^\d+\.\s+/, '').replace(/U\.S\./g, 'US');
    return !rest.includes('.');
  }
  if (line.includes('.')) return false;
  const letters = line.replace(/[^A-Za-z]/g, '');
  return letters.length >= 3 && letters === letters.toUpperCase();
}

export default function LegalPageShell({ kind }: Props) {
  const doc = kind === 'terms' ? TERMS_DOCUMENT : PRIVACY_DOCUMENT;

  return (
    <PageShell maxWidth="lg" backLink={{ href: '/', label: 'Back to Home' }}>
      <PageHeader
        eyebrow="Legal"
        eyebrowVariant="gold"
        title={doc.title}
        subtitle={<span className="block text-sm text-white/65 leading-relaxed font-normal">{doc.dateLine}</span>}
        className="mt-2 mb-8"
      />

      <article className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 sm:px-8">
        {doc.paragraphs.map((paragraph, index) =>
          isHeading(paragraph) ? (
            <h2 key={`${index}-${paragraph}`} className="pt-4 text-sm font-bold text-white/90">
              {paragraph}
            </h2>
          ) : (
            <p key={`${index}-${paragraph.slice(0, 24)}`} className="text-sm text-white/70 leading-relaxed">
              {paragraph}
            </p>
          )
        )}
      </article>

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
