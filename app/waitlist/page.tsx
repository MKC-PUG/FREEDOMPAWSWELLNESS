import type { Metadata } from 'next';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import WaitlistClient from './WaitlistClient';

export const metadata: Metadata = {
  title: 'Founding Community Waitlist • Freedom Paws',
  description:
    'Join the Freedom Paws founding community — early pilot access, Safe Picks launches, and shelter partnership updates.',
};

const perks = [
  'Early Freedom Paws ID pilot slots (CA & TN shelters)',
  'First access when insurance & telehealth partner CTAs go live',
  'Safe Picks affiliate launches and recall alerts',
  'SuperBud community lake meetups and veteran-dog events',
];

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/" label="Back to Home" />

        <header className="mt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Founding community
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight">
            Join the Freedom Paws waitlist
          </h1>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Honor Buddy&apos;s legacy with a wellness-first super app — ViT diagnostics, holistic
            protocols, biometric ID for unchipped dogs, and vetted Safe Picks.
          </p>
        </header>

        <ul className="mt-8 space-y-3">
          {perks.map((perk) => (
            <li
              key={perk}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
            >
              <span className="text-emerald-400 shrink-0" aria-hidden>
                ✓
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <WaitlistClient />

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-center space-y-3">
          <p className="text-sm text-white/65">
            Already using the app? Explore{' '}
            <Link href="/diagnostics" className="text-amber-300 underline">
              ViT Diagnostics
            </Link>
            ,{' '}
            <Link href="/id" className="text-amber-300 underline">
              Freedom Paws ID
            </Link>
            , or{' '}
            <Link href="/wellness/safe-products" className="text-emerald-300 underline">
              Safe Picks
            </Link>
            .
          </p>
          <p className="text-xs text-white/40">
            Partners:{' '}
            <a href="mailto:partners@freedompawsinc.com" className="text-emerald-400/80">
              partners@freedompawsinc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
