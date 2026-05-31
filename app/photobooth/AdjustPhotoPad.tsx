type Props = {
  label?: string;
  onNudge: (dx: number, dy: number) => void;
  onScale: (factor: number) => void;
  nudgeStep?: number;
  zoomOutLabel?: string;
  zoomInLabel?: string;
};

export default function AdjustPhotoPad({
  label,
  onNudge,
  onScale,
  nudgeStep = 0.03,
  zoomOutLabel = '− Zoom out',
  zoomInLabel = '+ Zoom in',
}: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label ? <p className="text-[10px] text-white/40">{label}</p> : null}
      <div className="grid grid-cols-3 gap-1">
        <span />
        <button
          type="button"
          aria-label="Nudge up"
          onClick={() => onNudge(0, -nudgeStep)}
          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm touch-manipulation"
        >
          ↑
        </button>
        <span />
        <button
          type="button"
          aria-label="Nudge left"
          onClick={() => onNudge(-nudgeStep, 0)}
          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm touch-manipulation"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Nudge down"
          onClick={() => onNudge(0, nudgeStep)}
          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm touch-manipulation"
        >
          ↓
        </button>
        <button
          type="button"
          aria-label="Nudge right"
          onClick={() => onNudge(nudgeStep, 0)}
          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm touch-manipulation"
        >
          →
        </button>
      </div>
      <div className="flex w-full max-w-xs gap-2">
        <button
          type="button"
          onClick={() => onScale(0.9)}
          className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold touch-manipulation"
        >
          {zoomOutLabel}
        </button>
        <button
          type="button"
          onClick={() => onScale(1.1)}
          className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold touch-manipulation"
        >
          {zoomInLabel}
        </button>
      </div>
    </div>
  );
}
