import Link from 'next/link';
import { adoptTnPath, appPath } from '@/lib/site-urls';

export default function PartnerFooter() {
  const year = new Date().getFullYear();
  const adoptUrl = adoptTnPath();

  return (
    <footer className="border-t border-emerald-500/15 bg-[#0A1625] px-4 py-8 text-center text-[11px] leading-relaxed text-white/45">
      <nav
        className="mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/60"
        aria-label="Partner portal links"
      >
        <Link href={adoptUrl} className="hover:text-emerald-400 transition-colors">
          Public adoption directory (TN)
        </Link>
        <span className="text-white/20" aria-hidden>
          |
        </span>
        <Link href={appPath('/')} className="hover:text-emerald-400 transition-colors">
          Freedom Paws member app
        </Link>
      </nav>
      <p>
        © {year} Freedom Paws Wellness · Partner portal · Not a government agency
      </p>
      <p className="mt-2 text-white/35">
        shelter.freedompawsinc.com · Adoption listings &amp; ID tools for pilot partners
      </p>
    </footer>
  );
}
