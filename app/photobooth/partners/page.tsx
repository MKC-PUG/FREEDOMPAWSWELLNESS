import type { Metadata } from 'next';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import {
  PHOTO_BOOTH_AFFILIATE_CATALOG,
  PHOTO_BOOTH_AFFILIATE_CONTACT,
  PHOTO_BOOTH_AFFILIATE_DISCLOSURE,
  getPhotoBoothAffiliatesData,
} from '@/lib/photobooth/affiliates';

export const metadata: Metadata = {
  title: 'Photo Booth Print Partners • Freedom Paws',
  description:
    'Affiliate standards for custom framing, photo mugs, pillows, non-toxic blankets, and holiday greeting cards from SuperBud Photo Booth.',
};

export default function PhotoBoothPartnersPage() {
  const data = getPhotoBoothAffiliatesData();

  return (
    <div className="min-h-screen bg-[#0A1625] text-white">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/photobooth" label="Back to Photo Booth" />

        <header className="mt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            For prospective partners
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight">Photo Booth Print &amp; Gift Program</h1>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Freedom Paws members create pet portraits in{' '}
            <strong className="text-white/90">SuperBud Photo Booth</strong> — then order framed
            prints, mugs, pillows, non-toxic blankets, and holiday cards through vetted affiliate partners. We onboard
            partners when agreements are ready.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-5 mb-6">
          <h2 className="text-sm font-bold text-violet-200">Product lines we are signing</h2>
          <ul className="mt-3 space-y-3">
            {PHOTO_BOOTH_AFFILIATE_CATALOG.map((pick) => (
              <li key={pick.id} className="text-sm text-white/65">
                <span className="mr-1.5" aria-hidden>
                  {pick.emoji}
                </span>
                <strong className="text-white/85">{pick.label}</strong> — {pick.description}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-5 mb-6">
          <h2 className="text-sm font-bold text-amber-300">Partner requirements</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/65 list-disc pl-5">
            <li>Member uploads any Photo Booth PNG/JPEG — no proprietary format lock-in.</li>
            <li>Tracked affiliate or rev-share reporting with Freedom Paws sub-ID.</li>
            <li>FTC-compliant disclosure support on co-branded surfaces.</li>
            <li>USA shipping for pilot; clear production and delivery timelines.</li>
            <li>Quality standards for color accuracy, framing, and wash-safe drinkware.</li>
            <li>Non-toxic blanket SKUs — pet-safe inks, no harmful dyes or chemical finishes.</li>
            <li>Holiday card SKUs with Christmas, Hanukkah, and general winter themes.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-5 mb-6">
          <h2 className="text-sm font-bold text-amber-300">Member experience today</h2>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            {data.activeCount > 0
              ? `${data.activeCount} partner link${data.activeCount === 1 ? '' : 's'} live in Photo Booth.`
              : 'All print & gift lines show “Launching soon” until affiliate URLs are configured.'}
          </p>
          <p className="mt-3 text-xs text-white/45 leading-relaxed">{PHOTO_BOOTH_AFFILIATE_DISCLOSURE}</p>
        </section>

        <section className="rounded-2xl border border-violet-400/30 bg-violet-950/20 p-5 mb-8">
          <h2 className="text-sm font-bold text-violet-200">Onboarding</h2>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            Email{' '}
            <a href={`mailto:${PHOTO_BOOTH_AFFILIATE_CONTACT}`} className="text-violet-300 underline">
              {PHOTO_BOOTH_AFFILIATE_CONTACT}
            </a>{' '}
            with subject line <strong className="text-white/80">Photo Booth Print Partner</strong>.
            Include your product catalog, affiliate commission structure, tracking link capabilities,
            and sample fulfillment SLAs.
          </p>
          <ol className="mt-3 space-y-1.5 text-xs text-white/50 list-decimal pl-5">
            <li>Intro call &amp; product fit review</li>
            <li>Affiliate agreement + disclosure approval</li>
            <li>Tracking URL added to production env</li>
            <li>Member-facing “Order →” goes live in Photo Booth</li>
          </ol>
        </section>

        <Link
          href="/photobooth"
          className="block rounded-2xl border border-white/10 py-4 text-center text-sm font-semibold text-white/80 hover:text-white transition"
        >
          Return to Photo Booth →
        </Link>
      </div>
    </div>
  );
}
