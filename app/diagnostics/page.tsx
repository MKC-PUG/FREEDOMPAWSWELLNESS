import { cookies } from 'next/headers';
import { getUpload, toDataUrl } from '@/lib/upload-store';
import ViTDiagnosticsClient from './ViTDiagnosticsClient';

type Props = {
  searchParams: Promise<{ uploadError?: string; uploaded?: string; uploadId?: string }>;
};

export default async function ViTDiagnosticsPage({ searchParams }: Props) {
  const params = await searchParams;
  const jar = await cookies();
  const cookieId = jar.get('fp-upload-id')?.value;
  const uploadId = params.uploadId ?? cookieId;
  const uploadKey = jar.get('fp-upload-key')?.value;

  let initialPhoto: string | null = null;
  let initialFileName = 'photo.jpg';

  if (uploadId && (uploadKey === 'vit-diagnostics' || Boolean(params.uploadId))) {
    const stored = await getUpload(uploadId);
    if (stored) {
      initialPhoto = toDataUrl(stored.bytes, stored.mime);
      initialFileName = stored.name;
    }
  }

  const uploadErrorMessages: Record<string, string> = {
    'no-file': 'No photo received. Choose a photo, then tap Upload & Save Photo.',
    'too-large': 'Photo is too large (over 8 MB). Try a smaller image or use the backup upload page — it compresses automatically.',
    failed: 'Upload failed. Please try again.',
    invalid: 'Invalid upload request.',
  };

  const uploadError = params.uploadError
    ? uploadErrorMessages[params.uploadError] ?? 'Upload failed.'
    : params.uploaded === '1' && !initialPhoto
      ? 'Upload completed but photo could not be loaded. Please try the backup upload link below.'
      : null;

  const uploadSuccess = params.uploaded === '1' && Boolean(initialPhoto);

  return (
    <ViTDiagnosticsClient
      initialPhoto={initialPhoto}
      initialFileName={initialFileName}
      uploadError={uploadError}
      uploadSuccess={uploadSuccess}
    />
  );
}
