const STORAGE_KEY = 'fp-unlocked-protocols';

export function readUnlockedProtocols(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export function isProtocolUnlocked(slug: string): boolean {
  return readUnlockedProtocols().includes(slug);
}

export function unlockProtocol(slug: string): void {
  if (typeof window === 'undefined') return;
  const current = new Set(readUnlockedProtocols());
  current.add(slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
}
