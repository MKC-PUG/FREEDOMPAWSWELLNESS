const DB_NAME = 'fp-gait-clips';
const STORE = 'clips';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open gait clips'));
  });
}

export function saveGaitClip(clipId: string, blob: Blob): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(blob, clipId);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error('Could not save gait clip'));
        };
      })
  );
}

export function getGaitClip(clipId: string): Promise<Blob | null> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const request = tx.objectStore(STORE).get(clipId);
        request.onsuccess = () => {
          db.close();
          resolve((request.result as Blob | undefined) ?? null);
        };
        request.onerror = () => {
          db.close();
          reject(request.error ?? new Error('Could not read gait clip'));
        };
      })
  );
}

export function deleteGaitClip(clipId: string): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(clipId);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error('Could not delete gait clip'));
        };
      })
  );
}

export function clipIdFromBody(body: string): string | null {
  const match = body.match(/clipId:(\S+)/);
  return match?.[1] ?? null;
}

export function newClipId(): string {
  return `gait-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
