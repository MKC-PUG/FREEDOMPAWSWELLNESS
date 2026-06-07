'use client';

type Props = {
  message: string | null;
};

/** Brief confirmation after Share / Save — fixed below nav. */
export default function PhotoBoothToast({ message }: Props) {
  if (!message) return null;
  const isSuccess =
    message.includes('Saved') || message.includes('Shared') || message.startsWith('✓');
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-4 right-4 z-[200] flex justify-center pointer-events-none"
      style={{ top: 'calc(var(--nav-total-height) + 0.5rem)' }}
    >
      <div
        className={`max-w-sm rounded-2xl px-5 py-3.5 text-center text-sm font-bold shadow-lg border ${
          isSuccess
            ? 'bg-green-950/95 border-green-500/50 text-green-200'
            : 'bg-[#0F1E38]/95 border-amber-400/40 text-amber-100'
        }`}
      >
        {isSuccess && <span className="mr-1">✓</span>}
        {message.replace(/^✓\s*/, '')}
      </div>
    </div>
  );
}
