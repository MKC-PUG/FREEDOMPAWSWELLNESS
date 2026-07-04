/** Shared progress helpers — monotonic 0–99 during work, 100 only when explicitly complete. */

export type TaskProgressSnapshot = {
  percent: number;
  label: string;
};

const PHASE_HINTS: [RegExp, number, number][] = [
  [/fetch|download|cache/i, 0, 0.28],
  [/load|wasm|model|enum|init/i, 0.2, 0.5],
  [/compute|inference|run|segment|decode/i, 0.45, 0.98],
];

/** Map imgly per-phase 0–100 into an overall sub-range without hitting rangeEnd early. */
export function mapImglyPhaseToRange(
  key: string,
  current: number,
  total: number,
  rangeStart: number,
  rangeEnd: number
): number {
  const phasePct = total > 0 ? Math.min(1, current / total) : 0;
  const span = rangeEnd - rangeStart;
  const k = key.toLowerCase();
  let startFrac = 0;
  let endFrac = 1;
  for (const [re, s, e] of PHASE_HINTS) {
    if (re.test(k)) {
      startFrac = s;
      endFrac = e;
      break;
    }
  }
  const subStart = rangeStart + span * startFrac;
  const subEnd = rangeStart + span * endFrac;
  const mapped = subStart + phasePct * (subEnd - subStart);
  return Math.round(Math.min(rangeEnd - 1, mapped));
}

export function labelForImglyPhase(key: string, percent: number): string {
  const k = key.toLowerCase();
  if (/fetch|download/i.test(k)) return `Downloading model… ${percent}%`;
  if (/load|wasm|model|enum|init/i.test(k)) return `Loading AI model… ${percent}%`;
  if (/compute|inference|run|segment|decode/i.test(k)) return `Tracing your pet… ${percent}%`;
  return `Processing… ${percent}%`;
}

export function createMonotonicProgress(onUpdate: (p: TaskProgressSnapshot) => void) {
  let max = 0;

  const emit = (percent: number, label: string) => {
    const next = Math.min(99, Math.max(max, Math.round(percent)));
    max = next;
    onUpdate({ percent: next, label });
  };

  const complete = (label: string) => {
    max = 100;
    onUpdate({ percent: 100, label });
  };

  const mapImgly = (
    rangeStart: number,
    rangeEnd: number,
    key: string,
    current: number,
    total: number
  ) => {
    const mapped = mapImglyPhaseToRange(key, current, total, rangeStart, rangeEnd);
    emit(mapped, labelForImglyPhase(key, mapped));
  };

  return { emit, complete, mapImgly };
}

/** Slow creep for unknown-duration network work — caps below `to` until stopped. */
export function startSimulatedProgress(
  onTick: (percent: number) => void,
  options: { from: number; to: number; durationMs: number; intervalMs?: number }
): () => void {
  if (typeof window === 'undefined') return () => {};
  const { from, to, durationMs, intervalMs = 400 } = options;
  const cap = to - 1;
  const t0 = performance.now();
  const id = window.setInterval(() => {
    const t = Math.min(1, (performance.now() - t0) / durationMs);
    const eased = from + (cap - from) * (1 - Math.pow(1 - t, 1.75));
    onTick(Math.round(Math.min(cap, eased)));
  }, intervalMs);
  return () => {
    window.clearInterval(id);
  };
}
