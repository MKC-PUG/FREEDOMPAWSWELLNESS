export type ImageSelection = {
  file: File;
  previewUrl: string;
};

const MAX_DIMENSION = 2048;

export class PhotoPickerCancelled extends Error {
  constructor() {
    super('Photo selection cancelled.');
    this.name = 'PhotoPickerCancelled';
  }
}

function isLikelyImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif|bmp)$/i.test(file.name || '');
}

function jpegFileName(name: string): string {
  const base = name.replace(/\.(heic|heif|png|webp|gif|bmp)$/i, '') || 'photo';
  return `${base}.jpg`;
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not display the photo.'));
    img.src = src;
  });
}

function readFileAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Could not read the photo.'));
    };
    reader.onerror = () => reject(new Error('Could not read the photo.'));
    reader.readAsDataURL(file);
  });
}

async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || 'image/jpeg' });
}

async function encodeAsJpegFromBlob(blob: Blob, name: string): Promise<ImageSelection> {
  const objectUrl = URL.createObjectURL(blob);

  try {
    const img = await loadImageElement(objectUrl);

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (!width || !height) {
      throw new Error('Could not read photo dimensions.');
    }

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not process the photo.');
    }

    ctx.drawImage(img, 0, 0, width, height);

    const previewUrl = canvas.toDataURL('image/jpeg', 0.88);
    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Could not encode the photo.'))),
        'image/jpeg',
        0.88
      );
    });

    return {
      file: new File([jpegBlob], jpegFileName(name), { type: 'image/jpeg' }),
      previewUrl,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * iOS Photo Library often reports size=0 when change first fires.
 * Poll until the file is populated or timeout.
 */
export function waitForPickerFile(input: HTMLInputElement): Promise<File> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 40;

    const check = () => {
      attempts += 1;
      const file = input.files?.[0];

      if (file && file.size > 0) {
        resolve(file);
        return;
      }

      // User cancelled — no file appears after ~450ms.
      if (!file && attempts >= 6) {
        reject(new PhotoPickerCancelled());
        return;
      }

      if (attempts >= maxAttempts) {
        reject(new Error('Could not load photo. Please try again.'));
        return;
      }

      window.setTimeout(check, 75);
    };

    check();
  });
}

/** Read a picked file into a stable preview + upload File. */
export async function processPickerFile(file: File): Promise<ImageSelection> {
  const name = file.name || 'photo.jpg';

  if (!isLikelyImageFile(file)) {
    throw new Error('Please choose a photo (JPG, PNG, or HEIC).');
  }

  const dataUrl = await readFileAsDataUrl(file);

  try {
    await loadImageElement(dataUrl);
    const uploadFile = await dataUrlToFile(dataUrl, jpegFileName(name));
    return { file: uploadFile, previewUrl: dataUrl };
  } catch {
    const blob = file.slice(0, file.size, file.type || 'image/jpeg');
    return encodeAsJpegFromBlob(blob, name);
  }
}

export function revokePreviewUrl(url: string | null | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/** Rebuild selection from a stored data URL (e.g. after iOS page reload). */
export async function selectionFromDataUrl(dataUrl: string): Promise<ImageSelection> {
  const file = await dataUrlToFile(dataUrl, 'photo.jpg');
  return { file, previewUrl: dataUrl };
}
