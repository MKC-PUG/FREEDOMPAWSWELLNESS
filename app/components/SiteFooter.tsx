import { isPreviewMode } from '@/lib/site-mode';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const preview = isPreviewMode();

  return (
    <footer className="border-t border-white/10 bg-[#0A1625] px-4 py-6 text-center text-[11px] leading-relaxed text-white/45">
      {preview && (
        <p className="mb-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-amber-300/90">
          Private preview — not indexed by search engines. Do not share publicly until launch.
        </p>
      )}
      <p>
        © {year} Freedom Paws Wellness. All rights reserved.
      </p>
      <p className="mt-1">
        SuperBud™, Freedom Paws™, and protocol content are proprietary. Unauthorized use prohibited.
      </p>
    </footer>
  );
}
