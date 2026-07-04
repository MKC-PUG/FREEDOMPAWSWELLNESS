/** Client-side pet cutout via @imgly/background-removal (browser + self-hosted WASM). */

import {
  labelForImglyPhase,
  mapImglyPhaseToRange,
  type TaskProgressSnapshot,
} from '@/lib/photobooth/task-progress';

export type BgRemovalProgress = TaskProgressSnapshot & {
  phase: string;
};

export type BgRemovalOptions = {
  /** Overall progress window (default 0–99). */
  rangeStart?: number;
  rangeEnd?: number;
};

const PACKAGE_VERSION = '1.7.0';

/** IMG.LY CDN — always a valid absolute base URL for the library. */
const CDN_PUBLIC_PATH = `https://staticimgly.com/@imgly/background-removal-data/${PACKAGE_VERSION}/dist/`;

function localPublicPath(): string {
  if (typeof window === 'undefined') return CDN_PUBLIC_PATH;
  // imgly resolves assets via `new URL(relative, publicPath)` — must be absolute, not "/path/"
  return `${window.location.origin}/imgly-bg-removal/`;
}

async function resolvePublicPath(): Promise<string> {
  if (typeof window === 'undefined') return CDN_PUBLIC_PATH;

  const local = localPublicPath();
  try {
    const res = await fetch(`${local}resources.json`, { method: 'GET', cache: 'no-store' });
    if (res.ok) return local;
  } catch {
    /* fall through to CDN */
  }
  return CDN_PUBLIC_PATH;
}

export async function removePetBackground(
  imageSource: Blob | string,
  onProgress?: (p: BgRemovalProgress) => void,
  options?: BgRemovalOptions
): Promise<Blob> {
  const rangeStart = options?.rangeStart ?? 0;
  const rangeEnd = options?.rangeEnd ?? 99;
  let maxEmitted = rangeStart;

  const emit = (phase: string, percent: number, label: string) => {
    const next = Math.min(rangeEnd - 1, Math.max(maxEmitted, percent));
    maxEmitted = next;
    onProgress?.({ phase, percent: next, label });
  };

  const publicPath = await resolvePublicPath();
  const { removeBackground } = await import('@imgly/background-removal');
  emit('load-model', Math.min(rangeStart + 2, rangeEnd - 1), 'Loading AI model…');

  const blob = await removeBackground(imageSource, {
    publicPath,
    model: 'isnet_fp16',
    device: 'cpu',
    output: { format: 'image/png', quality: 0.92 },
    progress: (key, current, total) => {
      const mapped = mapImglyPhaseToRange(key, current, total, rangeStart, rangeEnd);
      emit(key, mapped, labelForImglyPhase(key, mapped));
    },
  });

  return blob;
}
