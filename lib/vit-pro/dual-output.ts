import { PROTOCOL_BY_SLUG } from '@/lib/ai/protocol-registry';
import {
  VIT_PRO_DISCLAIMER_PUBLIC,
  VIT_PRO_DISCLAIMER_VET,
  VIT_PRO_REPORT_SCHEMA_VERSION,
} from './constants';
import type {
  VitProDifferential,
  VitProFullReport,
  VitProPublicOutput,
  VitProVetOutput,
} from './types';

function slugTitle(slug: string | null): string | null {
  if (!slug || !PROTOCOL_BY_SLUG[slug]) return null;
  return PROTOCOL_BY_SLUG[slug].brandedTitle;
}

function uniqueDifferentials(report: VitProFullReport): VitProDifferential[] {
  const seen = new Set<string>();
  const out: VitProDifferential[] = [];
  for (const region of report.regions) {
    for (const d of region.differentialConsiderations) {
      const key = d.label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(d);
    }
  }
  return out.slice(0, 8);
}

function uniqueDiagnostics(report: VitProFullReport): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const region of report.regions) {
    for (const d of region.suggestedDiagnostics) {
      const key = d.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(d);
    }
  }
  return out.slice(0, 10);
}

function allCitations(report: VitProFullReport) {
  const seen = new Set<string>();
  const out = [];
  for (const c of report.globalCitations) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  for (const region of report.regions) {
    for (const c of region.citations) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      out.push(c);
    }
  }
  return out;
}

function buildEmrPlainText(report: VitProFullReport): string {
  const lines: string[] = [
    'ViT Pro CDS Report (clinical decision support — not a diagnosis)',
    `Report ID: ${report.reportId}`,
    `Date: ${report.analyzedAt}`,
    '',
    'HISTORY',
    report.historySummary,
  ];
  if (report.signalmentNotes) {
    lines.push('', 'SIGNALMENT', report.signalmentNotes);
  }
  for (const region of report.regions) {
    lines.push('', `${region.region.toUpperCase()} FINDINGS`);
    if (region.visualFindings.length) {
      lines.push(`Visual: ${region.visualFindings.join('; ')}`);
    }
    for (const sf of region.structuredFindings) {
      lines.push(`${sf.label}: ${String(sf.value)}`);
    }
    if (region.differentialConsiderations.length) {
      lines.push(
        'Considerations: ' +
          region.differentialConsiderations.map((d) => d.label).join('; ')
      );
    }
    if (region.suggestedDiagnostics.length) {
      lines.push('Suggested diagnostics: ' + region.suggestedDiagnostics.join('; '));
    }
  }
  lines.push('', 'URGENCY', `${report.urgency}${report.urgencyReason ? ` — ${report.urgencyReason}` : ''}`);
  const cites = allCitations(report);
  if (cites.length) {
    lines.push('', 'REFERENCES');
    cites.forEach((c, i) => {
      lines.push(`[${i + 1}] ${c.title} — ${c.source}${c.url ? ` (${c.url})` : ''}`);
    });
  }
  lines.push('', VIT_PRO_DISCLAIMER_VET);
  return lines.join('\n');
}

/** Tier A — strip citations, differentials, and diagnostics from public response. */
export function toPublicOutput(report: VitProFullReport): VitProPublicOutput {
  const visualFindings = report.regions.flatMap((r) => r.visualFindings).slice(0, 6);
  const primaryTitle = slugTitle(report.primaryProtocolSlug);

  const indications = report.regions.flatMap((r) =>
    r.visualFindings.map((f) => `Signs consistent with findings in ${r.region} region: ${f}`)
  );

  if (indications.length === 0) {
    indications.push('General wellness review — no specific visual indications captured.');
  }

  let finding = primaryTitle
    ? `Wellness support — consider ${primaryTitle.split(' – ')[0]}`
    : 'Wellness review completed';
  if (report.urgency === 'urgent') {
    finding = 'Urgent veterinary evaluation recommended';
  }

  const reasoningParts = [
    `History: ${report.historySummary.slice(0, 200)}`,
    visualFindings.length ? `Observed: ${visualFindings.join('; ')}` : '',
    primaryTitle ? `Protocol alignment: ${primaryTitle}` : '',
    report.mildModerateOnly && report.urgency !== 'urgent'
      ? 'Signs appear mild-to-moderate — monitor and consult a vet if worsening.'
      : '',
  ].filter(Boolean);

  return {
    tier: 'public',
    mode: 'wellness',
    finding,
    indications: indications.slice(0, 4),
    reasoning: reasoningParts.join(' '),
    primaryProtocolSlug: report.primaryProtocolSlug,
    secondaryProtocolSlug: report.secondaryProtocolSlug,
    vetUrgent: report.urgency === 'urgent' || report.urgency === 'prompt_vet',
    vetUrgentReason: report.urgencyReason,
    visualFindings,
    disclaimer: VIT_PRO_DISCLAIMER_PUBLIC,
    analyzedAt: report.analyzedAt,
  };
}

/** Tier B — full CDS report for licensed professionals. */
export function toVetOutput(report: VitProFullReport): VitProVetOutput {
  return {
    tier: 'vet',
    mode: 'vit_pro',
    reportId: report.reportId,
    reportSchemaVersion: VIT_PRO_REPORT_SCHEMA_VERSION,
    historySummary: report.historySummary,
    signalmentNotes: report.signalmentNotes,
    regions: report.regions,
    urgency: report.urgency,
    urgencyReason: report.urgencyReason,
    urgentCongruency: report.urgentCongruency,
    matchedSevereCondition: report.matchedSevereCondition,
    differentialConsiderations: uniqueDifferentials(report),
    suggestedDiagnostics: uniqueDiagnostics(report),
    citations: allCitations(report),
    primaryProtocolSlug: report.primaryProtocolSlug,
    secondaryProtocolSlug: report.secondaryProtocolSlug,
    emrPlainText: buildEmrPlainText(report),
    disclaimer: VIT_PRO_DISCLAIMER_VET,
    analyzedAt: report.analyzedAt,
    audit: report.audit,
  };
}

/** Dual output helper — same pipeline, two tiers. */
export function toDualOutput(report: VitProFullReport): {
  public: VitProPublicOutput;
  vet: VitProVetOutput;
} {
  return {
    public: toPublicOutput(report),
    vet: toVetOutput(report),
  };
}
