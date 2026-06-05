import type { Metadata } from 'next';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import {
  monitorPrivacyNote,
  monitorQuickStart,
  monitorTunnelStart,
  monitorTroubleshooting,
} from '@/lib/monitor/help-content';

export const metadata: Metadata = {
  title: 'Monitor Help • Freedom Paws Wellness',
  description: 'Wyze v3, go2rtc, and Freedom Paws Monitor setup and troubleshooting.',
};

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="bg-[#1F2A44] rounded-3xl p-6 sm:p-8 border border-white/10">
      <h2 className="text-xl font-bold text-[#F5C242]">{title}</h2>
      <ul className="mt-4 space-y-3 text-white/80 leading-relaxed text-sm sm:text-base">
        {items.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="text-[#F5C242] shrink-0">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function MonitorHelpPage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8 sm:py-12">
        <BackLink href="/monitor" label="Back to Monitor" />

        <h1 className="text-3xl sm:text-4xl font-bold mt-4">Monitor Help</h1>
        <p className="mt-2 text-[#F5C242] text-base sm:text-lg">
          Wyze v3 · go2rtc · home &amp; away viewing
        </p>

        <div className="mt-8 space-y-6">
          <Section title={monitorQuickStart.title} items={monitorQuickStart.items} />
          <Section title={monitorTunnelStart.title} items={monitorTunnelStart.items} />
          {monitorTroubleshooting.map((block) => (
            <Section key={block.title} title={block.title} items={block.items} />
          ))}

          <section className="rounded-2xl border border-white/15 bg-[#16223C] px-5 py-4 text-sm text-white/65 leading-relaxed">
            <p className="font-semibold text-white/85">Privacy</p>
            <p className="mt-2">{monitorPrivacyNote}</p>
          </section>

          <p className="text-sm text-white/50">
            Full guide:{' '}
            <code className="text-[#F5C242]/90">docs/Wyze-Monitor-Connect-Guide.md</code> in the
            project repo.
          </p>

          <Link
            href="/monitor"
            className="inline-flex min-h-[52px] items-center rounded-xl bg-[#F5C242] px-8 font-bold text-black touch-manipulation"
          >
            Open Monitor →
          </Link>
        </div>
      </div>
    </div>
  );
}
