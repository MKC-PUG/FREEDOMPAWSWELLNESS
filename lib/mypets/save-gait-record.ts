import { createVaultEntryLocal } from '@/lib/mypets/vault-storage';
import { newClipId, saveGaitClip } from '@/lib/mypets/gait-clips';

export async function saveGaitVideoToPetRecord(input: {
  petId: string;
  file: File;
  seen: string;
}): Promise<'vault' | 'phone'> {
  const clipId = newClipId();
  await saveGaitClip(clipId, input.file);
  const today = new Date().toISOString().slice(0, 10);
  const body = [
    `clipId:${clipId}`,
    input.seen,
    'Walking video saved for this dog. It plays on this phone.',
  ].join('\n');
  const entry = {
    kind: 'gait_clip' as const,
    title: 'Gait video',
    body,
    recordDate: today,
    attachmentName: input.file.name || 'gait-video',
  };

  try {
    const res = await fetch(`/api/pets/${encodeURIComponent(input.petId)}/vault/gait`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seen: input.seen,
        fileName: input.file.name || 'gait-video',
        contentType: input.file.type || 'video/mp4',
        clipId,
      }),
    });
    const data = (await res.json()) as { success?: boolean; signedUrl?: string };
    if (!res.ok || !data.success || !data.signedUrl) throw new Error('vault');
    const upload = new FormData();
    upload.append('cacheControl', '3600');
    upload.append('', input.file);
    const put = await fetch(data.signedUrl, { method: 'PUT', body: upload });
    if (!put.ok) throw new Error('upload');
    return 'vault';
  } catch {
    createVaultEntryLocal(input.petId, entry);
    return 'phone';
  }
}
