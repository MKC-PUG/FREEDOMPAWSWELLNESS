'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { compressFileForPhotoBooth, compressImageToTarget } from '@/lib/compress-image';
import { clearPhotoFromDb, loadPhotoFromDb, savePhotoToDb } from '@/lib/photo-db';
import { clearPhotoPreview, savePhotoPreview } from '@/lib/photo-storage';
import {
  revokePreviewUrl,
  selectionFromDataUrl,
  type ImageSelection,
} from '@/lib/read-image-file';

export const PHOTO_UPLOAD_BUILD = '2026-05-30-photobooth-v2';

type PhotoUploadZoneProps = {
  onSelect: (selection: ImageSelection) => void;
  onClear?: () => void;
  onError?: (message: string) => void;
  storageKey?: string;
  returnTo?: string;
  className?: string;
  backupUploadHref?: string;
  /** When false, skip reloading a saved photo from session/IndexedDB (safer on Photo Booth). */
  restoreOnLoad?: boolean;
  /** POST via fetch + JSON response — no full-page reload (Photo Booth). */
  useFetchUpload?: boolean;
  onUploadId?: (uploadId: string) => void;
};

const POLL_MS = 50;
const POLL_MAX = 600;

export default function PhotoUploadZone({
  onSelect,
  onClear,
  onError,
  storageKey = 'vit-diagnostics',
  returnTo = '/diagnostics',
  className = '',
  backupUploadHref = '/vit-upload.html',
  restoreOnLoad = true,
  useFetchUpload = false,
  onUploadId,
}: PhotoUploadZoneProps) {
  const libraryRef = useRef<HTMLInputElement>(null);
  const directFormRef = useRef<HTMLFormElement>(null);
  const directFileRef = useRef<HTMLInputElement>(null);
  const base64Ref = useRef<HTMLInputElement>(null);
  const photoNameRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const pollRef = useRef<number | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const lastSigRef = useRef<string | null>(null);
  const hasPhotoRef = useRef(false);

  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [status, setStatus] = useState(
    useFetchUpload ? 'Tap Choose Photo below — upload starts automatically' : 'Use Direct Upload below (recommended on iPhone)'
  );

  const onSelectRef = useRef(onSelect);
  const onErrorRef = useRef(onError);
  const onClearRef = useRef(onClear);
  const onUploadIdRef = useRef(onUploadId);
  onSelectRef.current = onSelect;
  onErrorRef.current = onError;
  onClearRef.current = onClear;
  onUploadIdRef.current = onUploadId;

  const statusKey = `fp-status:${storageKey}`;

  const writeStatus = useCallback((msg: string) => {
    setStatus(msg);
    if (statusRef.current) statusRef.current.textContent = msg;
    try {
      sessionStorage.setItem(statusKey, msg);
    } catch {
      /* quota */
    }
  }, [statusKey]);

  const uploadViaFetch = useCallback(
    async (file: File) => {
      writeStatus(`Compressing ${file.name}…`);
      const uploadFile = await compressFileForPhotoBooth(file);
      writeStatus(`Uploading ${uploadFile.name}…`);

      const fd = new FormData();
      fd.append('storageKey', storageKey);
      fd.append('photo', uploadFile, uploadFile.name);
      fd.append('response', 'json');

      const res = await fetch('/api/upload-photo', { method: 'POST', body: fd });
      const data = (await res.json()) as { ok?: boolean; uploadId?: string; error?: string };
      if (!res.ok || !data.uploadId) {
        throw new Error(data.error ?? 'Upload failed');
      }

      hasPhotoRef.current = true;
      writeStatus('Photo ready ✓');
      onUploadIdRef.current?.(data.uploadId);
    },
    [storageKey, writeStatus]
  );

  const submitDirectUpload = useCallback(() => {
    const input = directFileRef.current;
    const form = directFormRef.current;
    const b64 = base64Ref.current;
    const pname = photoNameRef.current;
    const file = input?.files?.[0];
    if (!file) return;

    if (useFetchUpload) {
      void uploadViaFetch(file).catch(() => {
        writeStatus('Upload failed. Try again or use the backup link.');
        onErrorRef.current?.('Could not upload photo on this device.');
      });
      return;
    }

    if (!form || !b64 || !pname) return;

    writeStatus(`Compressing ${file.name}…`);

    void compressImageToTarget(file)
      .then(({ dataUrl, name }) => {
        writeStatus(`Uploading ${name}…`);
        b64.value = dataUrl;
        pname.value = name;
        form.submit();
      })
      .catch(() => {
        writeStatus('Could not process photo. Try the backup upload link below.');
        onErrorRef.current?.('Could not compress photo on this device.');
      });
  }, [uploadViaFetch, useFetchUpload, writeStatus]);

  const stopPoll = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const showPreview = useCallback(
    (url: string) => {
      hasPhotoRef.current = true;
      setDisplayUrl(url);
      if (imgRef.current) {
        imgRef.current.src = url;
        imgRef.current.style.display = 'block';
      }
      writeStatus('Photo ready ✓');
    },
    [writeStatus]
  );

  const persistAndNotify = useCallback(
    (file: File, previewUrl: string) => {
      if (restoreOnLoad) {
        savePhotoPreview(storageKey, previewUrl);
        void savePhotoToDb(storageKey, previewUrl).catch(() => {});
      }
      void selectionFromDataUrl(previewUrl)
        .then((selection) => onSelectRef.current(selection))
        .catch(() => onSelectRef.current({ file, previewUrl }));
    },
    [restoreOnLoad, storageKey]
  );

  const applyFile = useCallback(
    (file: File) => {
      const sig = `${file.name}|${file.size}|${file.lastModified}`;
      if (lastSigRef.current === sig) return true;
      lastSigRef.current = sig;
      stopPoll();

      if (useFetchUpload) {
        void uploadViaFetch(file).catch(() => {
          onErrorRef.current?.('Could not upload photo.');
        });
        return true;
      }

      if (blobUrlRef.current) revokePreviewUrl(blobUrlRef.current);
      const blobUrl = URL.createObjectURL(file);
      blobUrlRef.current = blobUrl;
      showPreview(blobUrl);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') return;
        showPreview(reader.result);
        persistAndNotify(file, reader.result);
      };
      reader.onerror = () => persistAndNotify(file, blobUrl);
      reader.readAsDataURL(file);
      return true;
    },
    [persistAndNotify, showPreview, stopPoll, uploadViaFetch, useFetchUpload]
  );

  const tryReadInput = useCallback(
    (input: HTMLInputElement | null) => {
      if (!input?.files?.length) return false;
      const file = input.files[0];
      if (!file || file.size <= 0) return false;
      return applyFile(file);
    },
    [applyFile]
  );

  const startPoll = useCallback(
    (input: HTMLInputElement) => {
      stopPoll();
      writeStatus('Waiting for photo…');
      let ticks = 0;
      pollRef.current = window.setInterval(() => {
        ticks += 1;
        if (hasPhotoRef.current) {
          stopPoll();
          return;
        }
        if (tryReadInput(input)) {
          stopPoll();
          return;
        }
        if (ticks % 20 === 0) {
          writeStatus(`Waiting for photo… (${Math.floor(ticks / 20)}s)`);
        }
        if (ticks >= POLL_MAX) {
          stopPoll();
          writeStatus('Use Direct Upload below instead');
        }
      }, POLL_MS);
    },
    [stopPoll, tryReadInput, writeStatus]
  );

  const restoreSaved = useCallback(async () => {
    if (!restoreOnLoad || hasPhotoRef.current) return;

    try {
      const savedStatus = sessionStorage.getItem(statusKey);
      if (savedStatus) writeStatus(savedStatus);
    } catch {
      /* ignore */
    }

    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(`fp-photo:${storageKey}`);
    } catch {
      saved = null;
    }
    if (!saved) {
      try {
        saved = await loadPhotoFromDb(storageKey);
      } catch {
        saved = null;
      }
    }
    if (!saved) return;

    showPreview(saved);
    void selectionFromDataUrl(saved).then((s) => onSelectRef.current(s));
  }, [restoreOnLoad, showPreview, statusKey, storageKey, writeStatus]);

  useEffect(() => {
    if (!restoreOnLoad) return;
    void restoreSaved();

    const lib = libraryRef.current;
    if (!lib) return;

    const onTap = () => startPoll(lib);
    const onChange = () => {
      writeStatus('Reading photo…');
      tryReadInput(lib);
    };

    lib.addEventListener('pointerdown', onTap);
    lib.addEventListener('click', onTap);
    lib.addEventListener('change', onChange);

    const onReturn = () => {
      if (document.visibilityState === 'visible') {
        void restoreSaved();
        tryReadInput(lib);
      }
    };
    window.addEventListener('pageshow', onReturn);
    document.addEventListener('visibilitychange', onReturn);

    return () => {
      stopPoll();
      lib.removeEventListener('pointerdown', onTap);
      lib.removeEventListener('click', onTap);
      lib.removeEventListener('change', onChange);
      window.removeEventListener('pageshow', onReturn);
      document.removeEventListener('visibilitychange', onReturn);
    };
  }, [restoreOnLoad, restoreSaved, startPoll, stopPoll, tryReadInput, writeStatus]);

  useEffect(() => {
    const input = directFileRef.current;
    if (!input) return;
    const onChange = () => submitDirectUpload();
    input.addEventListener('change', onChange);
    return () => input.removeEventListener('change', onChange);
  }, [submitDirectUpload]);

  useEffect(() => {
    return () => {
      stopPoll();
      revokePreviewUrl(blobUrlRef.current);
    };
  }, [stopPoll]);

  const handleClear = () => {
    stopPoll();
    clearPhotoPreview(storageKey);
    void clearPhotoFromDb(storageKey);
    try {
      sessionStorage.removeItem(statusKey);
    } catch {
      /* ignore */
    }
    if (libraryRef.current) libraryRef.current.value = '';
    revokePreviewUrl(blobUrlRef.current);
    blobUrlRef.current = null;
    lastSigRef.current = null;
    hasPhotoRef.current = false;
    setDisplayUrl(null);
    if (imgRef.current) {
      imgRef.current.removeAttribute('src');
      imgRef.current.style.display = 'none';
    }
    writeStatus('Use Direct Upload below (recommended on iPhone)');
    onClearRef.current?.();
  };

  const inputClass =
    'block w-full cursor-pointer rounded-xl border border-[#F5C242]/40 bg-[#0A1428] px-2 py-3 text-sm text-white file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#F5C242] file:px-4 file:py-2 file:text-sm file:font-bold file:text-black';

  return (
    <div className={className}>
      <div className="mb-5 rounded-2xl border-2 border-[#F5C242] bg-[#F5C242]/10 p-4">
        <p className="mb-1 text-base font-bold text-[#F5C242]">★ Direct Upload (iPhone Chrome)</p>
        <p className="mb-4 text-xs text-white/60 leading-relaxed">
          Tap <strong className="text-white">Choose Photo</strong> → pick image → tap ✓. Upload starts
          automatically{useFetchUpload ? ' (no page reload)' : ''}.
          {!useFetchUpload && (
            <>
              <br />
              If Chrome warns the connection is not secure, tap{' '}
              <strong className="text-white">Send anyway</strong>.
            </>
          )}
        </p>
        <form
          ref={directFormRef}
          action={useFetchUpload ? undefined : '/api/upload-photo'}
          method={useFetchUpload ? undefined : 'POST'}
          className="space-y-3"
          onSubmit={useFetchUpload ? (e) => e.preventDefault() : undefined}
        >
          {!useFetchUpload && (
            <>
              <input type="hidden" name="storageKey" value={storageKey} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <input ref={base64Ref} type="hidden" name="photoBase64" defaultValue="" />
              <input ref={photoNameRef} type="hidden" name="photoName" defaultValue="" />
            </>
          )}
          <input ref={directFileRef} type="file" accept="image/*" className={inputClass} />
          {!useFetchUpload && (
            <button
              type="button"
              onClick={submitDirectUpload}
              className="w-full min-h-[48px] rounded-2xl bg-[#F5C242] py-4 text-lg font-bold text-black touch-manipulation active:bg-amber-300"
            >
              Upload &amp; Save Photo (manual)
            </button>
          )}
        </form>
        <p ref={statusRef} className="mt-4 text-center text-sm font-medium text-[#F5C242]">
          {status}
        </p>
        <p className="mt-1 text-center text-[10px] text-white/35">Upload module {PHOTO_UPLOAD_BUILD}</p>
        <p className="mt-3 text-center text-xs">
          <a href={backupUploadHref} className="text-[#F5C242] underline">
            Backup upload page (if auto-upload fails)
          </a>
        </p>
      </div>

      {!useFetchUpload && (
      <div className="rounded-3xl border-2 border-dashed border-[#F5C242]/50 bg-black/20 p-4 sm:p-5">
        <div className="mb-4 flex min-h-[220px] items-center justify-center rounded-2xl bg-black/30">
          {!displayUrl && (
            <div className="px-4 py-10 text-center">
              <span className="mb-3 block text-6xl">📸</span>
              <p className="text-base">Preview appears here</p>
            </div>
          )}
          <img
            ref={imgRef}
            alt="Selected photo"
            className="max-h-72 w-full object-contain rounded-2xl shadow-lg border-2 border-[#F5C242]/40"
            style={{ display: displayUrl ? 'block' : 'none' }}
          />
        </div>

        <p className="mb-2 text-xs text-white/45">Optional JS upload (desktop browsers)</p>
        <input ref={libraryRef} type="file" accept="image/*" className={inputClass} />

        <p ref={statusRef} className="mt-4 text-center text-sm font-medium text-[#F5C242]">
          {status}
        </p>
        <p className="mt-1 text-center text-[10px] text-white/35">Upload module {PHOTO_UPLOAD_BUILD}</p>
      </div>
      )}

      {!useFetchUpload && displayUrl && (
        <button
          type="button"
          onClick={handleClear}
          className="mt-3 w-full min-h-[48px] rounded-2xl border border-white/20 py-3 text-sm text-white/70 touch-manipulation active:bg-white/5"
        >
          Remove Photo
        </button>
      )}
    </div>
  );
}
