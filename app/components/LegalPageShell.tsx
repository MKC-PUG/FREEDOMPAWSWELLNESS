import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import { LEGAL_LAST_UPDATED, PRIVACY_SECTIONS, TERMS_SECTIONS } from '@/lib/legal/content';

type Props = {
  kind: 'terms' | 'privacy';
  title: string;
  intro: string;
};

export default function LegalPageShell({ kind, title, intro }: Props) {
  const sections = kind === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/" label="Back to Home" />

        <header className="mt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
            Legal
          </p>
          <h1 className="mt-2 text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-xs text-white/45">Last updated {LEGAL_LAST_UPDATED}</p>
          <p className="mt-4 text-sm text-white/65 leading-relaxed">{intro}</p>
          <p className="mt-3 rounded-xl border border-amber-400/25 bg-amber-950/20 px-4 py-3 text-xs text-amber-200/85 leading-relaxed">
            This is a founder draft for pilot operations — not formal legal counsel. Have your
            attorney review before broad public marketing.
          </p>
        </header>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-bold text-white/90">{section.title}</h2>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">{section.body}</p>
            </section>
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
      </div>
    </div>
  );
}
