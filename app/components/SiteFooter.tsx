import Link from 'next/link';
import Image from 'next/image';
import { isPreviewMode } from '@/lib/site-mode';
import { BRAND_LOGO_PAW } from '@/lib/brand/paths';
import {
  framerGrantsUrl,
  framerMissionUrl,
  framerSheltersUrl,
  framerVeteransUrl,
  isAppSubdomainConfigured,
} from '@/lib/site-urls';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const preview = isPreviewMode();
  const appSubdomainLive = isAppSubdomainConfigured();

  return (
    <footer className="border-t border-white/10 bg-[#0A1625] px-4 py-8 text-center text-[11px] leading-relaxed text-white/45">
      {preview && (
        <p className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-amber-300/90 max-w-lg mx-auto">
          Private preview — not indexed by search engines. Do not share publicly until launch.
        </p>
      )}

      <nav
        className="mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/60"
        aria-label="Freedom Paws website links"
      >
        <a
          href={framerGrantsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#F5C242] transition-colors"
        >
          Grants &amp; Give-Back
        </a>
        <span className="text-white/20" aria-hidden>
          |
        </span>
        <a
          href={framerMissionUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#F5C242] transition-colors"
        >
          Our Mission
        </a>
        <span className="text-white/20" aria-hidden>
          |
        </span>
        <a
          href={framerVeteransUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#F5C242] transition-colors"
        >
          Veterans
        </a>
        <span className="text-white/20" aria-hidden>
          |
        </span>
        <a
          href={framerSheltersUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#F5C242] transition-colors"
        >
          Shelters
        </a>
        <span className="text-white/20" aria-hidden>
          |
        </span>
        <Link href="/token-shop" className="hover:text-[#F5C242] transition-colors">
          Token Shop (App)
        </Link>
        <span className="text-white/20" aria-hidden>
          |
        </span>
        <Link href="/waitlist" className="hover:text-[#F5C242] transition-colors">
          Founding Waitlist
        </Link>
        <span className="text-white/20" aria-hidden>
          |
        </span>
        <Link href="/terms" className="hover:text-[#F5C242] transition-colors">
          Terms
        </Link>
        <span className="text-white/20" aria-hidden>
          |
        </span>
        <Link href="/privacy" className="hover:text-[#F5C242] transition-colors">
          Privacy
        </Link>
      </nav>

      {!appSubdomainLive && (
        <p className="mb-4 text-[10px] text-amber-400/70 max-w-md mx-auto">
          Set <code className="text-amber-200/80">NEXT_PUBLIC_APP_URL</code> to{' '}
          <code className="text-amber-200/80">https://app.freedompawsinc.com</code> when DNS is live on
          Vercel.
        </p>
      )}

      <Image
        src={BRAND_LOGO_PAW}
        alt="Freedom Paws"
        width={56}
        height={56}
        className="mx-auto mb-4 h-12 w-auto object-contain opacity-90"
      />

      <p>© {year} Freedom Paws Wellness. All rights reserved.</p>
      <p className="mt-1">
        SuperBud™, Freedom Paws™, and protocol content are proprietary. Unauthorized use prohibited.
      </p>
    </footer>
  );
}
