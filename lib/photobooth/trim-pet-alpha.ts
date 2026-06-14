/** Crop transparent padding from cutout PNGs so the pet fits the canvas tighter. */

export type AlphaBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function findOpaqueBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = 12
): AlphaBounds | null {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > alphaThreshold) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) return null;

  const pad = Math.max(2, Math.round(Math.min(width, height) * 0.012));
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
  if (!bounds || (bounds.width >= w * 0.98 && bounds.height >= h * 0.98)) {
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
