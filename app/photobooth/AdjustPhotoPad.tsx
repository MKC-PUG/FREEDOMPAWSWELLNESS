type Props = {
  label?: string;
  onNudge: (dx: number, dy: number) => void;
  onScale: (factor: number) => void;
  nudgeStep?: number;
  zoomOutLabel?: string;
  zoomInLabel?: string;
  layout?: 'default' | 'floating';
  onDone?: () => void;
  showTilt?: boolean;
  onTilt?: (direction: -1 | 1) => void;
};

const btnBase =
  'rounded-lg bg-[#0F1E38] border border-white/15 touch-manipulation active:bg-amber-400/20';
const btnFloating = `${btnBase} px-3 py-2 text-sm min-w-[2.5rem] min-h-[2.5rem]`;
const btnDefault = `${btnBase} px-4 py-2 text-sm`;

export default function AdjustPhotoPad({
  label,
  onNudge,
  onScale,
  nudgeStep = 0.03,
  zoomOutLabel = '− Zoom out',
  zoomInLabel = '+ Zoom in',
  layout = 'default',
  onDone,
  showTilt = false,
  onTilt,
}: Props) {
  if (layout === 'floating') {
    return (
      <div className="rounded-2xl border border-amber-400/45 bg-[#0A1625]/95 backdrop-blur-md p-2.5 shadow-xl pointer-events-auto">
        {label ? (
          <p className="mb-1.5 text-center text-[10px] font-semibold text-amber-300/90">{label}</p>
        ) : null}
        <div className="flex items-center justify-center gap-2">
          <div className="grid grid-cols-3 gap-0.5">
            <span />
            <button
              type="button"
              aria-label="Nudge up"
              onClick={() => onNudge(0, -nudgeStep)}
              className={btnFloating}
            >
              ↑
            </button>
            <span />
            <button
              type="button"
              aria-label="Nudge left"
              onClick={() => onNudge(-nudgeStep, 0)}
              className={btnFloating}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Nudge down"
              onClick={() => onNudge(0, nudgeStep)}
              className={btnFloating}
            >
              ↓
            </button>
            <button
              type="button"
              aria-label="Nudge right"
              onClick={() => onNudge(nudgeStep, 0)}
              className={btnFloating}
            >
              →
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onScale(1.1)}
              className={`${btnFloating} text-xs font-semibold whitespace-nowrap px-2`}
            >
              {zoomInLabel}
            </button>
            <button
              type="button"
              onClick={() => onScale(0.9)}
              className={`${btnFloating} text-xs font-semibold whitespace-nowrap px-2`}
            >
              {zoomOutLabel}
            </button>
          </div>
          {onDone ? (
            <button
              type="button"
              onClick={onDone}
              className="min-h-[2.5rem] rounded-lg bg-amber-400 px-3 text-xs font-bold text-black touch-manipulation"
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
              className={`${btnFloating} flex-1 text-xs font-semibold`}
            >
              ↺ Tilt
            </button>
            <button
              type="button"
              aria-label="Tilt right"
              onClick={() => onTilt(1)}
              className={`${btnFloating} flex-1 text-xs font-semibold`}
            >
              Tilt ↻
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {label ? <p className="text-[10px] text-white/40">{label}</p> : null}
      <div className="grid grid-cols-3 gap-1">
        <span />
        <button
          type="button"
          aria-label="Nudge up"
          onClick={() => onNudge(0, -nudgeStep)}
          className={btnDefault}
        >
          ↑
        </button>
        <span />
        <button
          type="button"
          aria-label="Nudge left"
          onClick={() => onNudge(-nudgeStep, 0)}
          className={btnDefault}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Nudge down"
          onClick={() => onNudge(0, nudgeStep)}
          className={btnDefault}
        >
          ↓
        </button>
        <button
          type="button"
          aria-label="Nudge right"
          onClick={() => onNudge(nudgeStep, 0)}
          className={btnDefault}
        >
          →
        </button>
      </div>
      <div className="flex w-full max-w-xs gap-2">
        <button
          type="button"
          onClick={() => onScale(0.9)}
          className={`${btnDefault} flex-1 py-2.5 font-semibold`}
        >
          {zoomOutLabel}
        </button>
        <button
          type="button"
          onClick={() => onScale(1.1)}
          className={`${btnDefault} flex-1 py-2.5 font-semibold`}
        >
          {zoomInLabel}
        </button>
      </div>
    </div>
  );
}
