export type ExportPhotoPayload = {
  blob: Blob;
  filename: string;
  title: string;
  shareText: string;
};

export function blobToFile(payload: ExportPhotoPayload): File {
  return new File([payload.blob], payload.filename, { type: 'image/png' });
}

/** Trigger browser download (desktop / Android). */
export function downloadPhotoBlob(payload: ExportPhotoPayload): void {
  const url = URL.createObjectURL(payload.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = payload.filename;
  link.click();
  URL.revokeObjectURL(url);
}

function canShareFiles(file: File): boolean {
  return typeof navigator.share === 'function' && Boolean(navigator.canShare?.({ files: [file] }));
}

/**
 * Save to camera roll on mobile (Share sheet → Save Image) or download on desktop.
 */
export async function saveToPhotoLibrary(payload: ExportPhotoPayload): Promise<'shared' | 'downloaded'> {
  const file = blobToFile(payload);
  if (canShareFiles(file)) {
    try {
      await navigator.share({
        title: payload.title,
        files: [file],
      });
      return 'shared';
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') throw e;
    }
  }
  downloadPhotoBlob(payload);
  return 'downloaded';
}

/** Post to social apps via the system share sheet. */
export async function shareToSocial(payload: ExportPhotoPayload): Promise<void> {
  const file = blobToFile(payload);
  if (canShareFiles(file)) {
    await navigator.share({
      title: payload.title,
      text: payload.shareText,
      files: [file],
    });
    return;
  }
  if (typeof navigator.share === 'function') {
    await navigator.share({
      title: payload.title,
      text: `${payload.shareText}\n\n(Saving image to your device — attach it in your post if needed.)`,
    });
    downloadPhotoBlob(payload);
    return;
  }
  downloadPhotoBlob(payload);
}

/** Email via share sheet (Mail app) or mailto fallback. */
export async function shareViaEmail(payload: ExportPhotoPayload): Promise<'shared' | 'mailto'> {
  const file = blobToFile(payload);
  const subject = encodeURIComponent(payload.title);
  const body = encodeURIComponent(
    `${payload.shareText}\n\n— Created with Freedom Paws Wellness Photo Booth 🐾\nhttps://app.freedompawsinc.com/photobooth`
  );

  if (canShareFiles(file)) {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.shareText,
        files: [file],
      });
      return 'shared';
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') throw e;
    }
  }

  downloadPhotoBlob(payload);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  return 'mailto';
}
