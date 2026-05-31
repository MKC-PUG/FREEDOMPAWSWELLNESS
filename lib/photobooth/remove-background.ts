/** Client-side pet cutout via @imgly/background-removal (runs in browser — no API key). */

const IMGLY_PUBLIC_PATH =
  'https://unpkg.com/@imgly/background-removal@1.7.0/dist/';

export type BgRemovalProgress = {
  phase: string;
  percent: number;
};

export async function removePetBackground(
  imageSource: Blob | string,
  onProgress?: (p: BgRemovalProgress) => void
): Promise<Blob> {
  const { removeBackground } = await import('@imgly/background-removal');

  const blob = await removeBackground(imageSource, {
    publicPath: IMGLY_PUBLIC_PATH,
    model: 'isnet',
    output: { format: 'image/png', quality: 0.92 },
    progress: (key, current, total) => {
      const percent = total > 0 ? Math.round((current / total) * 100) : 0;
      onProgress?.({ phase: key, percent });
    },
  });

  return blob;
}
