type Props = {
  label?: string;
  onNudge: (dx: number, dy: number) => void;
  onScale: (factor: number) => void;
  nudgeStep?: number;
  zoomOutLabel?: string;
  zoomInLabel?: string;
  onDone?: () => void;
  showTilt?: boolean;
  onTilt?: (direction: -1 | 1) => void;
};

const btnBase =
  'rounded-lg bg-[#0A1625] border border-white/15 touch-manipulation active:bg-amber-400/20';
const btnPad = `${btnBase} px-3 py-2 text-sm min-w-[2.25rem] min-h-[2.25rem]`;

/** Below-image move/zoom controls — never overlays the photo. */
export default function AdjustPhotoPad({
  label,
  onNudge,
  onScale,
  nudgeStep = 0.03,
  zoomOutLabel = '−',
  zoomInLabel = '+',
  onDone,
  showTilt = false,
  onTilt,
}: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A1625]/80 p-2">
      {label ? (
        <p className="mb-2 text-center text-[10px] font-semibold text-amber-300/90">{label}</p>
      ) : null}
      <div className="flex items-center justify-center gap-2">
        <div className="grid grid-cols-3 gap-0.5">
          <span />
          <button type="button" aria-label="Nudge up" onClick={() => onNudge(0, -nudgeStep)} className={btnPad}>
            ↑
          </button>
          <span />
          <button type="button" aria-label="Nudge left" onClick={() => onNudge(-nudgeStep, 0)} className={btnPad}>
            ←
          </button>
          <button type="button" aria-label="Nudge down" onClick={() => onNudge(0, nudgeStep)} className={btnPad}>
            ↓
          </button>
          <button type="button" aria-label="Nudge right" onClick={() => onNudge(nudgeStep, 0)} className={btnPad}>
            →
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onScale(1.1)}
            className={`${btnPad} text-xs font-bold`}
            aria-label="Zoom in"
          >
            {zoomInLabel}
          </button>
          <button
            type="button"
            onClick={() => onScale(0.9)}
            className={`${btnPad} text-xs font-bold`}
            aria-label="Zoom out"
          >
            {zoomOutLabel}
          </button>
        </div>
        {onDone ? (
          <button
            type="button"
            onClick={onDone}
            className="min-h-[2.25rem] rounded-lg bg-amber-400 px-3 text-xs font-bold text-black touch-manipulation"
          >
            Done
          </button>
        ) : null}
      </div>
      {showTilt && onTilt ? (
        <div className="mt-2 flex gap-1">
          <button
            type="button"
            aria-label="Tilt left"
            onClick={() => onTilt(-1)}
            className={`${btnPad} flex-1 text-xs font-semibold`}
          >
            ↺ Tilt
          </button>
          <button
            type="button"
            aria-label="Tilt right"
            onClick={() => onTilt(1)}
            className={`${btnPad} flex-1 text-xs font-semibold`}
          >
            Tilt ↻
          </button>
        </div>
      ) : null}
    </div>
  );
}
