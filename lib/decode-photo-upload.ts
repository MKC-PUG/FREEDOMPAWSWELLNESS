export function decodePhotoBase64(raw: string): { buffer: Buffer; mime: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const dataUrl = /^data:([^;]+);base64,(.+)$/s.exec(trimmed);
  if (dataUrl) {
    try {
      return {
        mime: dataUrl[1] || 'image/jpeg',
        buffer: Buffer.from(dataUrl[2], 'base64'),
      };
    } catch {
      return null;
    }
  }

  try {
    return { mime: 'image/jpeg', buffer: Buffer.from(trimmed, 'base64') };
  } catch {
    return null;
  }
}
