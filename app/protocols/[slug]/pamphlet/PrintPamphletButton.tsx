'use client';

import type { CareFormat } from '@/lib/wellness/care-format';
import {
  DIAGNOSTICS_GREEN_BODY,
  DIAGNOSTICS_GREEN_TITLE,
} from '@/lib/legal/diagnostics-disclaimer';
import { escapeHtml, listHtml, openPrintDocument } from '@/lib/wellness/print-document';

export default function PrintPamphletButton({ care }: { care: CareFormat }) {
  return (
    <button
      type="button"
      onClick={() => {
        const html = `
          <h1>${escapeHtml(care.pamphletTitle)}</h1>
          <p><strong>Seen.</strong> ${escapeHtml(care.seen)}</p>
          <h2>Monitor</h2>
          ${listHtml(care.monitor)}
          <h2>This week at home</h2>
          ${listHtml(care.actions)}
          <p>${escapeHtml(care.photoNote)}</p>
          <div class="banner"><strong>${escapeHtml(DIAGNOSTICS_GREEN_TITLE)}</strong>${escapeHtml(DIAGNOSTICS_GREEN_BODY)}</div>
        `;
        openPrintDocument(care.pamphletTitle, html);
      }}
      className="min-h-[48px] rounded-full bg-[#F5C242] px-6 text-sm font-bold text-black"
    >
      Download / print
    </button>
  );
}
