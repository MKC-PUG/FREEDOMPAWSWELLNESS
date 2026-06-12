const MAX_EDGE = 160;
const JPEG_QUALITY = 0.72;

function isLikelyImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name || '');
}

function isHeicFile(file: File): boolean {
  return (
    /heic|heif/i.test(file.type) ||
    /\.(heic|heif)$/i.test(file.name || '')
  );
}

async function heicToJpegBlob(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default;
  const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
  return Array.isArray(converted) ? converted[0]! : converted;
}

function canvasToJpegThumb(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

function drawScaledToCanvas(source: CanvasImageSource, width: number, height: number): HTMLCanvasElement {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');
  ctx.drawImage(source, 0, 0, w, h);
  return canvas;
}

async function thumbFromBlob(blob: Blob): Promise<string> {
  try {
    const bitmap = await createImageBitmap(blob);
    try {
      return canvasToJpegThumb(drawScaledToCanvas(bitmap, bitmap.width, bitmap.height));
    } finally {
      bitmap.close();
    }
  } catch {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        try {
          resolve(canvasToJpegThumb(drawScaledToCanvas(img, img.naturalWidth, img.naturalHeight)));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not decode image'));
      };
      img.src = url;
    });
  }
}

/** Small JPEG thumb for My Pets (local + server sync). Handles HEIC from iPhone/Mac Photos. */
export async function fileToPetThumb(file: File): Promise<string | null> {
  if (!isLikelyImageFile(file)) return null;

  let blob: Blob = file;
  if (isHeicFile(file)) {
    blob = await heicToJpegBlob(file);
  }

  return thumbFromBlob(blob);
}
