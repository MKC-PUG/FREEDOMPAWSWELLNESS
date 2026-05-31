const PREFIX = 'fp-photo:';

export function savePhotoPreview(key: string, dataUrl: string): void {
  try {
    sessionStorage.setItem(`${PREFIX}${key}`, dataUrl);
  } catch {
    // Quota exceeded — preview may be too large; upload still works in memory.
  }
}

export function loadPhotoPreview(key: string): string | null {
  try {
    return sessionStorage.getItem(`${PREFIX}${key}`);
  } catch {
    return null;
  }
}

export function clearPhotoPreview(key: string): void {
  try {
    sessionStorage.removeItem(`${PREFIX}${key}`);
  } catch {
    // ignore
  }
}
