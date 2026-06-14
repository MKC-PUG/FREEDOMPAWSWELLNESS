/** Crop transparent padding from cutout PNGs so the pet fits the canvas tighter. */

export type AlphaBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Ignore faint edge halos from background-removal — only rows/columns with
 * enough solid pixels count toward the crop box.
 */
export function findOpaqueBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = 55
): AlphaBounds | null {
  const minRowPixels = Math.max(4, Math.round(width * 0.006));
  const minColPixels = Math.max(4, Math.round(height * 0.006));

  const rowHits = new Uint32Array(height);
  const colHits = new Uint32Array(width);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > alphaThreshold) {
        rowHits[y] += 1;
        colHits[x] += 1;
      }
    }
  }

  let minY = height;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    if (rowHits[y] >= minRowPixels) {
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  let minX = width;
  let maxX = 0;
  for (let x = 0; x < width; x += 1) {
    if (colHits[x] >= minColPixels) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
  }

  if (maxY < minY || maxX < minX) return null;

  const pad = Math.max(1, Math.round(Math.min(width, height) * 0.006));
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for trim'));
    img.src = url;
  });
}

export async function trimTransparentPetImage(img: HTMLImageElement): Promise<HTMLImageElement> {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (w < 2 || h < 2) return img;

  const scratch = document.createElement('canvas');
  scratch.width = w;
  scratch.height = h;
  const ctx = scratch.getContext('2d', { willReadFrequently: true });
  if (!ctx) return img;

  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const bounds = findOpaqueBounds(data, w, h);
  if (!bounds || (bounds.width >= w * 0.97 && bounds.height >= h * 0.97)) {
    return img;
  }

  const out = document.createElement('canvas');
  out.width = bounds.width;
  out.height = bounds.height;
  const outCtx = out.getContext('2d');
  if (!outCtx) return img;

  outCtx.drawImage(
    scratch,
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height,
    0,
    0,
    bounds.width,
    bounds.height
  );

  return new Promise((resolve, reject) => {
    const trimmed = new Image();
    trimmed.onload = () => resolve(trimmed);
    trimmed.onerror = () => reject(new Error('Failed to trim cutout'));
    trimmed.src = out.toDataURL('image/png');
  });
}

/** Trim a cutout blob right after background removal (preview + canvas). */
export async function trimPetCutoutBlob(blob: Blob): Promise<Blob> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImageElement(url);
    const trimmed = await trimTransparentPetImage(img);
    if (trimmed === img) return blob;

    const w = trimmed.naturalWidth || trimmed.width;
    const h = trimmed.naturalHeight || trimmed.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return blob;
    ctx.drawImage(trimmed, 0, 0, w, h);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Trim export failed'))), 'image/png');
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
