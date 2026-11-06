import { createVaultEntryServer } from '@/lib/mypets/vault-api';
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
    await createVaultEntryServer(input.petId, entry);
    return 'vault';
  } catch {
    createVaultEntryLocal(input.petId, entry);
    return 'phone';
  }
}
