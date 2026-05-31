import { cookies } from 'next/headers';
import { getUpload } from '@/lib/upload-store';
import PhotoBoothClient from './PhotoBoothClient';

type Props = {
  searchParams: Promise<{ uploadError?: string; uploaded?: string; uploadId?: string }>;
};

export default async function PhotoBoothPage({ searchParams }: Props) {
  const params = await searchParams;
  const jar = await cookies();
  const cookieId = jar.get('fp-upload-id')?.value;
  const uploadId = params.uploadId ?? cookieId;
  const uploadKey = jar.get('fp-upload-key')?.value;

  let initialUploadId: string | null = null;
  const returnedFromUpload = params.uploaded === '1' || Boolean(params.uploadId);

  if (
    returnedFromUpload &&
    uploadId &&
    uploadKey === 'photobooth' &&
    (await getUpload(uploadId))
  ) {
    initialUploadId = uploadId;
  }

  const uploadErrorMessages: Record<string, string> = {
    'no-file': 'No photo received. Choose a photo, then tap Upload & Save Photo.',
    'too-large': 'Photo is too large (over 8 MB). Try a smaller image or use the backup upload page.',
    failed: 'Upload failed. Please try again.',
    invalid: 'Invalid upload request.',
  };

  const uploadError = params.uploadError
    ? uploadErrorMessages[params.uploadError] ?? 'Upload failed.'
    : params.uploaded === '1' && !initialUploadId
      ? 'Upload completed but photo could not be loaded. Try the backup upload link.'
      : null;

  const uploadSuccess = params.uploaded === '1' && Boolean(initialUploadId);

  return (
    <PhotoBoothClient
      initialUploadId={initialUploadId}
      uploadError={uploadError}
      uploadSuccess={uploadSuccess}
    />
  );
}
