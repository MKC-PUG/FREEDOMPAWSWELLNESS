export type ManualBlock =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'hr' }
  | { type: 'pre'; text: string };

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSep(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

/** Parse the subset of markdown used by the ops manuals. */
export function parseManual(markdown: string): ManualBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: ManualBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        buf.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: 'pre', text: buf.join('\n') });
      continue;
    }

    if (trimmed.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!isTableSep(lines[i])) rows.push(splitTableRow(lines[i]));
        i += 1;
      }
      const [headers, ...body] = rows;
      if (headers) blocks.push({ type: 'table', headers, rows: body });
      continue;
    }

    if (/^#{1,3}\s/.test(trimmed)) {
      const level = trimmed.startsWith('###') ? 'h3' : trimmed.startsWith('##') ? 'h2' : 'h1';
      blocks.push({ type: level, text: trimmed.replace(/^#{1,3}\s+/, '') });
      i += 1;
      continue;
    }

    if (trimmed === '---') {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    if (trimmed === '') {
      i += 1;
      continue;
    }

    const para: string[] = [trimmed];
    i += 1;
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,3}\s/.test(lines[i].trim())) {
      const next = lines[i].trim();
      if (
        next.startsWith('|') ||
        next.startsWith('```') ||
        next === '---' ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next)
      ) {
        break;
      }
      para.push(next);
      i += 1;
    }
    blocks.push({ type: 'p', text: para.join(' ') });
  }

  return blocks;
}
