const BANNED: RegExp[] = [
  /\bdiagnos(?:e|ed|ing)\b/i,
  /\b(?<!not )a diagnosis\b/i,
  /\bprescription\b/i,
  /\bcures?\b/i,
  /\bai vet\b/i,
  /\bdetects disease\b/i,
  /\bguaranteed reunion\b/i,
  /\breunion rate\b/i,
  /\bmatch live nationally\b/i,
  /\bshop now\b/i,
  /\bbuy now\b/i,
  /\bfda\b/i,
  /\baafco\b/i,
];

export function findBannedPhrase(text: string): string | null {
  for (const pattern of BANNED) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}

export function assertStudioCopy(text: string, label: string): void {
  const hit = findBannedPhrase(text);
  if (hit) {
    throw new Error(`${label} includes “${hit}”. Rewrite that line before it can be spoken or queued.`);
  }
}
