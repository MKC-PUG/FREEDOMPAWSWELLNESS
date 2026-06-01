'use client';

const STEPS = [
  {
    n: '1',
    title: 'Upload photo or video',
    body: 'A clear photo of your dog, or a 10–15 second walking clip for limping, stiffness, or gait.',
  },
  {
    n: '2',
    title: 'Describe symptoms',
    body: 'Use your own words — itching, coughing, senior pacing, and more. Our symptom library matches everyday language.',
  },
  {
    n: '3',
    title: 'Get top-2 protocols',
    body: 'Prioritised supplement recommendations with confidence scores, protocol details, and Token Shop links.',
  },
] as const;

export default function ViTHowItWorks() {
  return (
    <details
      className="mb-6 rounded-2xl border border-[#F5C242]/30 bg-[#1F2A44]/90 overflow-hidden group"
      open
    >
      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-3 touch-manipulation">
        <span className="text-[#F5C242] font-bold text-sm uppercase tracking-wide">
          How ViT Diagnostics works
        </span>
        <span
          className="text-white/40 text-xs group-open:rotate-180 transition-transform shrink-0"
          aria-hidden
        >
          ▼
        </span>
      </summary>

      <div className="px-5 pb-5 space-y-5 border-t border-white/10">
        <p className="text-sm text-white/75 leading-relaxed pt-4">
          <strong className="text-white">ViT</strong> combines what you tell us with what we see in
          your photo or video — then maps signs to Freedom Paws{' '}
          <strong className="text-white">holistic wellness protocols</strong>. This is educational
          guidance only, not a veterinary diagnosis.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-xl border border-white/10 bg-[#0A1428]/50 p-4"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F5C242] text-black text-sm font-bold">
                {step.n}
              </span>
              <p className="mt-2 font-semibold text-white text-sm">{step.title}</p>
              <p className="mt-1 text-xs text-white/55 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0A1428]/40 p-4 space-y-3">
          <p className="text-xs font-semibold text-[#F5C242] uppercase tracking-wide">
            What powers your results
          </p>
          <ul className="text-xs text-white/65 space-y-2 list-none">
            <li className="flex gap-2">
              <span className="text-green-400 shrink-0">●</span>
              <span>
                <strong className="text-white/85">Symptom matching</strong> — hundreds of owner
                phrases mapped to our 10 protocol categories (always runs).
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 shrink-0">●</span>
              <span>
                <strong className="text-white/85">AI vision</strong> — photo or sampled video frames
                add visual observations (coat, eyes, posture, movement).
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 shrink-0">●</span>
              <span>
                <strong className="text-white/85">Top-2 supplements</strong> — when signs overlap
                (e.g. senior cognitive), you may see a #1 and #2 protocol pair.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400 shrink-0">●</span>
              <span>
                <strong className="text-white/85">Quality gate</strong> — we check lighting and
                resolution so analysis is reliable before you tap Get AI Recommendation.
              </span>
            </li>
          </ul>
        </div>

        <p className="text-[10px] text-white/40 leading-relaxed border-t border-white/10 pt-3">
          Urgent signs (pale or blue gums, collapse, severe breathing trouble) may show a veterinary
          attention banner. Always consult your licensed veterinarian for diagnosis and treatment.
        </p>
      </div>
    </details>
  );
}
