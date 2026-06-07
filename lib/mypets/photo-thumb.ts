const MAX_EDGE = 160;
const JPEG_QUALITY = 0.72;

/** Small JPEG thumb for localStorage (My Pets MVP). */
export async function fileToPetThumb(file: File): Promise<string | null> {
  if (!file.type.startsWith('image/')) return null;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return null;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}
