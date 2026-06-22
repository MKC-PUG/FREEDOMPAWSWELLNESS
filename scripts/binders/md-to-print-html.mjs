#!/usr/bin/env node
/**
 * Minimal markdown → print HTML for Freedom Paws binders.
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PRINT_CSS = `
@page { size: letter; margin: 0.75in; }
@media print {
  .page-break { page-break-before: always; break-before: page; }
  h1, h2, h3 { break-after: avoid; }
  table, pre, blockquote { break-inside: avoid; }
}
* { box-sizing: border-box; }
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11pt;
  line-height: 1.45;
  color: #1a1a1a;
  max-width: 7.5in;
  margin: 0 auto;
  padding: 0.25in;
}
h1 { font-size: 22pt; color: #0A1428; margin-top: 0; border-bottom: 2px solid #F5C242; padding-bottom: 0.2em; }
h2 { font-size: 16pt; color: #0A1428; margin-top: 1.2em; }
h3 { font-size: 13pt; color: #333; }
.cover-title { font-size: 28pt; text-align: center; border: none; color: #0A1428; }
.cover-sub { text-align: center; font-size: 14pt; color: #555; }
.cover-meta { text-align: center; margin-top: 2em; font-size: 11pt; }
.hero-placeholder {
  border: 2px dashed #ccc; background: #f8f8f8; text-align: center;
  padding: 2em; margin: 1.5em 0; color: #888; font-size: 10pt;
}
table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 10pt; }
th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
th { background: #0A1428; color: #fff; }
tr:nth-child(even) { background: #f6f6f6; }
code { background: #f0f0f0; padding: 1px 4px; font-size: 9pt; border-radius: 3px; }
pre {
  background: #f4f4f4; border: 1px solid #ddd; padding: 10px;
  font-size: 8.5pt; line-height: 1.35; overflow-x: auto; white-space: pre-wrap;
  word-break: break-word;
}
blockquote {
  border-left: 4px solid #F5C242; margin: 1em 0; padding: 0.5em 1em;
  background: #fffbf0; color: #333;
}
ul, ol { margin: 0.5em 0; padding-left: 1.4em; }
li { margin: 0.25em 0; }
a { color: #1565c0; }
.doc-header {
  font-size: 9pt; color: #666; border-bottom: 1px solid #ddd;
  padding-bottom: 8px; margin-bottom: 16px;
}
.technical .doc-header { border-color: #0288d1; }
.footer-note { font-size: 9pt; color: #666; margin-top: 2em; border-top: 1px solid #ddd; padding-top: 8px; }
`;

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineFormat(s) {
  let out = escapeHtml(s);
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

export function markdownToHtml(md, options = {}) {
  const { title = 'Freedom Paws Document', variant = 'general' } = options;
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;
  let inCode = false;
  let codeBuf = [];
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    html.push('<table>');
    tableRows.forEach((row, ri) => {
      const tag = ri === 0 ? 'th' : 'td';
      html.push('<tr>' + row.map((c) => `<${tag}>${inlineFormat(c.trim())}</${tag}>`).join('') + '</tr>');
    });
    html.push('</table>');
    tableRows = [];
    inTable = false;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCode) {
        html.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
        codeBuf = [];
        inCode = false;
      } else {
        flushTable();
        inCode = true;
      }
      i += 1;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i += 1;
      continue;
    }

    if (/^\[PAGE BREAK/.test(line)) {
      flushTable();
      html.push('<div class="page-break"></div>');
      i += 1;
      continue;
    }

    if (line.includes('|') && line.trim().startsWith('|')) {
      const cells = line.split('|').slice(1, -1);
      if (/^[\s\-:|]+$/.test(line.replace(/\|/g, ''))) {
        i += 1;
        continue;
      }
      inTable = true;
      tableRows.push(cells);
      i += 1;
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith('# ')) {
      const t = line.slice(2).trim();
      if (html.length < 5 && t.includes('Freedom Paws')) {
        html.push(`<h1 class="cover-title">${inlineFormat(t)}</h1>`);
      } else {
        html.push(`<h1>${inlineFormat(t)}</h1>`);
      }
      i += 1;
      continue;
    }
    if (line.startsWith('## ')) {
      html.push(`<h2>${inlineFormat(line.slice(3))}</h2>`);
      i += 1;
      continue;
    }
    if (line.startsWith('### ')) {
      html.push(`<h3>${inlineFormat(line.slice(4))}</h3>`);
      i += 1;
      continue;
    }
    if (line.startsWith('> ')) {
      html.push(`<blockquote>${inlineFormat(line.slice(2))}</blockquote>`);
      i += 1;
      continue;
    }
    if (/^\*\*\[Insert full-page SuperBud/.test(line)) {
      html.push('<div class="hero-placeholder">[Insert SuperBud hero image — public/images/superbud-hero.png]</div>');
      i += 1;
      continue;
    }
    if (line.startsWith('- ')) {
      html.push('<ul>');
      while (i < lines.length && lines[i].startsWith('- ')) {
        html.push(`<li>${inlineFormat(lines[i].slice(2))}</li>`);
        i += 1;
      }
      html.push('</ul>');
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      html.push('<ol>');
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        html.push(`<li>${inlineFormat(lines[i].replace(/^\d+\.\s/, ''))}</li>`);
        i += 1;
      }
      html.push('</ol>');
      continue;
    }
    if (line.trim() === '---') {
      html.push('<hr/>');
      i += 1;
      continue;
    }
    if (line.trim() === '') {
      i += 1;
      continue;
    }
    html.push(`<p>${inlineFormat(line)}</p>`);
    i += 1;
  }
  flushTable();
  if (inCode && codeBuf.length) {
    html.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(title)}</title>
<style>${PRINT_CSS}</style>
</head>
<body class="${variant}">
<div class="doc-header">${escapeHtml(title)} · Freedom Paws Wellness · May 2026</div>
${html.join('\n')}
<div class="footer-note">Freedom Paws Wellness © 2026 · Honor Buddy's Legacy · Educational purposes only where applicable.</div>
</body>
</html>`;
}

export function convertFile(mdPath, htmlPath, options) {
  const md = readFileSync(mdPath, 'utf8');
  const html = markdownToHtml(md, { title: basename(mdPath, '.md'), ...options });
  writeFileSync(htmlPath, html);
  return htmlPath;
}
