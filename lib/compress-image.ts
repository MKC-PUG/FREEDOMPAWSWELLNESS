/** Resize/compress an image file for mobile upload (keeps under server limit). */
export function compressImageForUpload(
  file: File,
  maxDim = 1280,
  quality = 0.82
): Promise<{ dataUrl: string; name: string }> {
  const isPng =
    file.type === 'image/png' || /\.png$/i.test(file.name || '');

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not available'));
        return;
      }
      if (isPng) {
        ctx.clearRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);

      const base = file.name.replace(/\.[^.]+$/, '') || 'photo';
      if (isPng) {
        resolve({ dataUrl: canvas.toDataURL('image/png'), name: `${base}.png` });
        return;
      }

      resolve({ dataUrl: canvas.toDataURL('image/jpeg', quality), name: `${base}.jpg` });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };

    img.src = url;
  });
}

function base64ByteLength(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.ceil((base64.length * 3) / 4);
}

/** Compress until under target size (iPhone originals are often 5–12 MB). */
export async function compressImageToTarget(
  file: File,
  maxBytes = 1_500_000
): Promise<{ dataUrl: string; name: string }> {
  const isPng =
    file.type === 'image/png' || /\.png$/i.test(file.name || '');

  if (isPng) {
    const pngAttempts = [1280, 1024, 960, 800, 640];
    let last: { dataUrl: string; name: string } | null = null;
    for (const maxDim of pngAttempts) {
      last = await compressImageForUpload(file, maxDim, 0.92);
      if (base64ByteLength(last.dataUrl) <= maxBytes) return last;
    }
    return last ?? compressImageForUpload(file, 640, 0.92);
  }

  const attempts = [
    { maxDim: 1280, quality: 0.82 },
    { maxDim: 1024, quality: 0.72 },
    { maxDim: 960, quality: 0.62 },
    { maxDim: 800, quality: 0.52 },
    { maxDim: 640, quality: 0.42 },
  ];

  let last: { dataUrl: string; name: string } | null = null;
  for (const attempt of attempts) {
    last = await compressImageForUpload(file, attempt.maxDim, attempt.quality);
    if (base64ByteLength(last.dataUrl) <= maxBytes) return last;
  }

  return last ?? compressImageForUpload(file, 640, 0.4);
}

export async function compressFileToUpload(file: File, maxBytes = 1_500_000): Promise<File> {
  const { dataUrl, name } = await compressImageToTarget(file, maxBytes);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const type = name.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return new File([blob], name, { type });
}

/** Smaller target for Photo Booth — avoids iPhone Chrome tab crashes. */
export async function compressFileForPhotoBooth(file: File): Promise<File> {
  return compressFileToUpload(file, 600_000);
}

/** Inline-safe version for public/vit-upload.html (no modules). */
export const COMPRESS_IMAGE_SCRIPT = `
function compressImageForUpload(file, maxDim, quality) {
  maxDim = maxDim || 1280;
  quality = quality || 0.82;
  return new Promise(function (resolve, reject) {
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(url);
      var width = img.width;
      var height = img.height;
      var scale = Math.min(1, maxDim / Math.max(width, height));
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not available')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
      var base = (file.name || 'photo').replace(/\\.[^.]+$/, '') || 'photo';
      resolve({ dataUrl: dataUrl, name: base + '.jpg' });
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}
`.trim();
