'use client';

import { useRef, useState } from 'react';
import PhotoUploadZone, { PHOTO_UPLOAD_BUILD } from '@/app/components/PhotoUploadZone';
import { extractVideoFrames, isValidVitVideoFile } from '@/lib/vit/extract-video-frames';
import type { ImageSelection } from '@/lib/read-image-file';

export type VitMediaSelection =
  | { kind: 'photo'; file: File; previewUrl: string | null }
  | { kind: 'video'; frames: File[]; previewUrl: string; durationSec: number; fileName: string };

type Props = {
  onSelect: (selection: VitMediaSelection) => void;
  onClear: () => void;
  onError: (message: string) => void;
  uploadSuccess: boolean;
  initialPhoto: string | null;
  selection: VitMediaSelection | null;
};

export default function ViTMediaUpload({
  onSelect,
  onClear,
  onError,
  uploadSuccess,
  initialPhoto,
  selection,
}: Props) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'photo' | 'video'>(
    selection?.kind === 'video' ? 'video' : 'photo'
  );
  const [videoBusy, setVideoBusy] = useState(false);

  const handlePhotoSelect = (image: ImageSelection) => {
    setMode('photo');
    onSelect({
      kind: 'photo',
      file: image.file,
      previewUrl: image.previewUrl,
    });
  };

  const handleVideoPick = async (file: File) => {
    if (!isValidVitVideoFile(file)) {
      onError('Use MP4 or MOV under 25MB (10–15 seconds works best).');
      return;
    }
    setVideoBusy(true);
    onError('');
    try {
      const { frames, durationSec, posterDataUrl } = await extractVideoFrames(file);
      setMode('video');
      onSelect({
        kind: 'video',
        frames,
        previewUrl: posterDataUrl,
        durationSec,
        fileName: file.name,
      });
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not process video.');
    } finally {
      setVideoBusy(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const preview =
    selection?.previewUrl ?? (uploadSuccess && initialPhoto ? initialPhoto : null);

  return (
    <div className="space-y-4">
      <div className="flex rounded-xl border border-white/15 overflow-hidden text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMode('photo')}
          className={`flex-1 py-2.5 transition ${
            mode === 'photo' ? 'bg-[#F5C242] text-black' : 'bg-[#0A1428] text-white/70'
          }`}
        >
          Photo
        </button>
        <button
          type="button"
          onClick={() => setMode('video')}
          className={`flex-1 py-2.5 transition ${
            mode === 'video' ? 'bg-[#F5C242] text-black' : 'bg-[#0A1428] text-white/70'
          }`}
        >
          Short video
        </button>
      </div>

      {mode === 'photo' && !uploadSuccess && (
        <PhotoUploadZone
          onSelect={handlePhotoSelect}
          onClear={onClear}
          onError={onError}
          storageKey="vit-diagnostics"
          returnTo="/diagnostics"
        />
      )}

      {mode === 'video' && (
        <div className="rounded-2xl border-2 border-[#F5C242]/40 bg-[#0A1428]/80 p-5">
          <p className="text-[#F5C242] text-sm font-bold mb-2">★ Gait & movement video</p>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Record 10–15 seconds of your dog walking or moving. We sample{' '}
            <strong className="text-white/80">5 frames</strong> for AI vision — great for limping,
            stiffness, or posture.
          </p>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleVideoPick(file);
            }}
          />
          <button
            type="button"
            disabled={videoBusy}
            onClick={() => videoInputRef.current?.click()}
            className="w-full rounded-xl bg-[#F5C242] disabled:opacity-50 text-black font-bold py-3.5"
          >
            {videoBusy ? 'Extracting frames…' : 'Choose Video (10–15 sec)'}
          </button>
          {selection?.kind === 'video' && (
            <p className="mt-3 text-center text-xs text-green-400">
              ✓ {selection.frames.length} frames ready · {selection.durationSec.toFixed(1)}s
            </p>
          )}
          <p className="mt-2 text-center text-[10px] text-white/35">
            Upload module {PHOTO_UPLOAD_BUILD}
          </p>
        </div>
      )}

      {preview && (
        <div className="rounded-2xl border border-green-500/40 bg-green-900/15 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={selection?.kind === 'video' ? 'Video preview' : 'Uploaded dog'}
            className="max-h-56 w-full object-contain rounded-xl"
          />
          {selection?.kind === 'video' && (
            <p className="text-center text-xs text-green-400/90 mt-2">
              Video mode · {selection.frames.length} frames captured
            </p>
          )}
        </div>
      )}

      {(selection || uploadSuccess) && (
        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-2xl border border-white/20 py-3 text-sm text-white/70"
        >
          Upload different {mode === 'video' ? 'video' : 'photo'}
        </button>
      )}
    </div>
  );
}

export { PHOTO_UPLOAD_BUILD };
