/** Client-side pet cutout via @imgly/background-removal (browser + self-hosted WASM). */

export type BgRemovalProgress = {
  phase: string;
  percent: number;
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
  onProgress?: (p: BgRemovalProgress) => void
): Promise<Blob> {
  const publicPath = await resolvePublicPath();
  const { removeBackground } = await import('@imgly/background-removal');
  onProgress?.({ phase: 'load-model', percent: 5 });

  const blob = await removeBackground(imageSource, {
    publicPath,
    model: 'isnet_fp16',
    device: 'cpu',
    output: { format: 'image/png', quality: 0.92 },
    progress: (key, current, total) => {
      const percent = total > 0 ? Math.round((current / total) * 100) : 0;
      onProgress?.({ phase: key, percent: Math.max(percent, 8) });
    },
  });

  return blob;
}
