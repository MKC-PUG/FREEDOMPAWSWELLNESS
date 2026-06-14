const MAX_EDGE = 480;
const JPEG_QUALITY = 0.78;

function isLikelyImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name || '');
}

function isHeicFile(file: File): boolean {
  return /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name || '');
}

async function heicToJpegBlob(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default;
  const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.88 });
  return Array.isArray(converted) ? converted[0]! : converted;
}

function canvasToJpeg(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

function drawScaled(source: CanvasImageSource, width: number, height: number): HTMLCanvasElement {
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
      return canvasToJpeg(drawScaled(bitmap, bitmap.width, bitmap.height));
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
          resolve(canvasToJpeg(drawScaled(img, img.naturalWidth, img.naturalHeight)));
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

export type VaultAttachmentResult = {
  attachmentThumb: string | null;
  attachmentName: string;
};

/** Compress image for vault storage; PDFs store filename only. */
export async function fileToVaultAttachment(file: File): Promise<VaultAttachmentResult | null> {
  const name = file.name || 'attachment';

  if (file.type === 'application/pdf' || /\.pdf$/i.test(name)) {
    return { attachmentThumb: null, attachmentName: name };
  }

  if (!isLikelyImageFile(file)) return null;

  let blob: Blob = file;
  if (isHeicFile(file)) {
    blob = await heicToJpegBlob(file);
  }

  const attachmentThumb = await thumbFromBlob(blob);
  return { attachmentThumb, attachmentName: name };
}
