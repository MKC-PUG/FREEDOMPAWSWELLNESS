'use client';

const STEPS = [
  'Upload photo',
  'Magic cutout (optional)',
  'Choose background',
  'Dress & share',
] as const;

type Props = {
  /** 0–3 */
  activeStep: number;
};

export default function PhotoBoothFlowHint({ activeStep }: Props) {
  const step = Math.min(STEPS.length - 1, Math.max(0, activeStep));

  return (
    <div
      className="mb-3 rounded-xl border border-black/20 bg-white/75 px-3 py-2 text-center shadow-sm backdrop-blur-sm"
      aria-label={`Photo Booth step ${step + 1} of ${STEPS.length}`}
    >
      <p className="text-[11px] font-semibold leading-snug text-black/85">
        {STEPS.map((label, i) => {
          const isActive = i === step;
          const isPast = i < step;
          return (
            <span key={label}>
              {i > 0 && <span className="mx-1 text-black/35">›</span>}
              <span
                className={
                  isActive
                    ? 'text-black'
                    : isPast
                      ? 'text-black/55'
                      : 'text-black/40'
                }
              >
                {label}
              </span>
            </span>
          );
        })}
      </p>
    </div>
  );
}
