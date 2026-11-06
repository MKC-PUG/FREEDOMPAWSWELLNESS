function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function openPrintDocument(title: string, bodyHtml: string): boolean {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return false;
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0.65in; line-height: 1.45; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    h2 { font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; margin: 18px 0 6px; }
    p, li { font-size: 14px; }
    ul { margin: 0; padding-left: 18px; }
    .banner { border: 1px solid #222; padding: 10px 12px; margin-top: 16px; font-size: 12px; }
    .banner strong { display: block; margin-bottom: 4px; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`);
  win.document.close();
  win.focus();
  win.print();
  return true;
}

export function listHtml(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

export { escapeHtml };
