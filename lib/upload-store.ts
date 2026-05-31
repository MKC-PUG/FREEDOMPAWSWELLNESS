import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';

const TTL_MS = 60 * 60 * 1000; // 1 hour
const uploadDir = path.join(os.tmpdir(), 'freedom-paws-uploads');

type StoredUpload = {
  mime: string;
  name: string;
  expires: number;
};

async function ensureDir() {
  await mkdir(uploadDir, { recursive: true });
}

function filePath(id: string) {
  return path.join(uploadDir, `${id}.bin`);
}

function metaPath(id: string) {
  return path.join(uploadDir, `${id}.json`);
}

export async function saveUpload(
  bytes: Buffer,
  mime: string,
  name: string
): Promise<string> {
  await ensureDir();
  const id = randomUUID();
  const meta: StoredUpload = {
    mime: mime || 'image/jpeg',
    name: name || 'photo.jpg',
    expires: Date.now() + TTL_MS,
  };
  await writeFile(filePath(id), bytes);
  await writeFile(metaPath(id), JSON.stringify(meta));
  return id;
}

export async function getUpload(
  id: string
): Promise<{ bytes: Buffer; mime: string; name: string } | null> {
  try {
    const metaRaw = await readFile(metaPath(id), 'utf8');
    const meta = JSON.parse(metaRaw) as StoredUpload;
    if (Date.now() > meta.expires) {
      await deleteUpload(id);
      return null;
    }
    const bytes = await readFile(filePath(id));
    return { bytes, mime: meta.mime, name: meta.name };
  } catch {
    return null;
  }
}

export async function deleteUpload(id: string) {
  await unlink(filePath(id)).catch(() => {});
  await unlink(metaPath(id)).catch(() => {});
}

export function toDataUrl(bytes: Buffer, mime: string): string {
  return `data:${mime};base64,${bytes.toString('base64')}`;
}
