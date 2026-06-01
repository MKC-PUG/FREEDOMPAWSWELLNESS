/** Server-side media validation for ViT analyze API. */

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
]);

const VIDEO_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-m4v',
]);

export function isValidAnalyzeImage(file: File): boolean {
  const isImage =
    file.type.startsWith('image/') ||
    file.type === '' ||
    IMAGE_TYPES.has(file.type) ||
    /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(file.name);
  return isImage && file.size > 0 && file.size < 15 * 1024 * 1024;
}

export function isValidAnalyzeVideo(file: File): boolean {
  const isVideo =
    file.type.startsWith('video/') ||
    VIDEO_TYPES.has(file.type) ||
    /\.(mp4|mov|m4v|webm)$/i.test(file.name);
  return isVideo && file.size > 0 && file.size < 25 * 1024 * 1024;
}

export function collectAnalyzeFrameFiles(formData: FormData): File[] {
  const frames: File[] = [];
  for (let i = 0; i < 8; i += 1) {
    const f = formData.get(`frame_${i}`);
    if (f instanceof File && f.size > 0 && isValidAnalyzeImage(f)) {
      frames.push(f);
    }
  }
  return frames;
}
