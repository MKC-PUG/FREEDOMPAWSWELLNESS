import { isPreviewMode } from '@/lib/site-mode';

/** Shown at top of main content in preview mode (below nav). */
export default function PreviewModeBanner() {
  if (!isPreviewMode()) return null;

  return (
    <div className="bg-amber-400/15 border-b border-amber-400/25 px-4 py-2 text-center text-[11px] text-amber-200/90">
      🔒 Private preview — for your testing only until public launch
    </div>
  );
}
