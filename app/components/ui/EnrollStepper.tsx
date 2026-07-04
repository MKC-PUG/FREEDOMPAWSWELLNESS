type Step = { n: number; label: string };

type Props = {
  steps: readonly Step[];
  currentStep: number;
  /** Pass 100 when enrollment is fully complete; otherwise bar caps at 99% during last step. */
  progressOverride?: number;
};

export default function EnrollStepper({ steps, currentStep, progressOverride }: Props) {
  const progress =
    progressOverride ??
    Math.min(99, Math.round(((currentStep - 0.5) / steps.length) * 100));

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-xs text-white/50">
        <span>
          Step {currentStep} of {steps.length}
        </span>
        <span>{progress}%</span>
      </div>
      <div
        className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label={`Enrollment step ${currentStep} of ${steps.length}`}
      >
        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ol className="grid grid-cols-9 gap-1">
        {steps.map((s) => {
          const done = currentStep > s.n;
          const active = currentStep === s.n;
          return (
            <li key={s.n} className="flex flex-col items-center gap-1">
              <span
                className={`flex h-2 w-2 rounded-full ${
                  active
                    ? 'bg-emerald-400 ring-2 ring-emerald-400/40 ring-offset-1 ring-offset-[#0A1428]'
                    : done
                      ? 'bg-emerald-500/60'
                      : 'bg-white/20'
                }`}
                aria-hidden
              />
              <span
                className={`hidden sm:block text-center text-[8px] font-semibold uppercase leading-tight tracking-tight ${
                  active
                    ? 'text-emerald-200'
                    : done
                      ? 'text-white/50'
                      : 'text-white/30'
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
