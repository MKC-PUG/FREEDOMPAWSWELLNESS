/** Client-side pet cutout via @imgly/background-removal (browser + self-hosted WASM). */

export type BgRemovalProgress = {
  phase: string;
  percent: number;
};

const PACKAGE_VERSION = '1.7.0';

/** Same-origin assets (built by scripts/fetch-imgly-bg-assets.mjs). */
const LOCAL_PUBLIC_PATH = '/imgly-bg-removal/';

/** IMG.LY CDN fallback if local assets missing (e.g. dev without build script). */
const CDN_PUBLIC_PATH = `https://staticimgly.com/@imgly/background-removal-data/${PACKAGE_VERSION}/dist/`;

async function resolvePublicPath(): Promise<string> {
  if (typeof window === 'undefined') return CDN_PUBLIC_PATH;
  try {
    const res = await fetch(`${LOCAL_PUBLIC_PATH}resources.json`, { method: 'HEAD' });
    if (res.ok) return LOCAL_PUBLIC_PATH;
  } catch {
    /* use CDN */
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
    model: 'isnet_quint8',
    device: 'cpu',
    output: { format: 'image/png', quality: 0.92 },
    progress: (key, current, total) => {
      const percent = total > 0 ? Math.round((current / total) * 100) : 0;
      onProgress?.({ phase: key, percent: Math.max(percent, 8) });
    },
  });

  return blob;
}
