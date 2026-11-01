import Link from 'next/link';
import { parseManual } from '@/lib/ops/manual-blocks';
import { readStudioPageManual } from '@/lib/ops/manual-source';
import { getStudioKeyStatus, listStudioJobs } from '@/lib/ops/studio-server';
import { OpsReferenceManual } from '../../components/OpsReferenceManual';
import OpsStudioDesk from '../../components/OpsStudioDesk';
import { OpsPageShell } from '../../components/OpsUi';

export default async function OpsDeskPage() {
  let jobs: Awaited<ReturnType<typeof listStudioJobs>> = [];
  let tableReady = true;
  let tableError: string | null = null;
  try {
    jobs = await listStudioJobs(40);
  } catch (e) {
    tableReady = false;
    tableError = e instanceof Error ? e.message : 'ops_jobs unavailable';
  }

  return (
    <OpsPageShell
      title="Studio (Production)"
      subtitle="Video jobs only. Research, script, plates, and the cut stay here. Sending lives on SuperBud (Distribution)."
    >
      <OpsReferenceManual
        kicker="UPDATED 11/1/26"
        title="Studio page — click-by-click"
        note="Internal reference. Hand to SuperBud creates drafts. It does not send them."
        blocks={parseManual(readStudioPageManual())}
      />
      <div className="mb-6 rounded-2xl border border-[#F5C242]/30 bg-[#F5C242]/10 px-4 py-3 text-sm text-white/80">
        When a cut is ready, use <strong>Hand to SuperBud</strong>. That creates draft cards. It
        does not send them. Approve and send on{' '}
        <Link href="/ops/marketing" className="font-bold text-[#F5C242] hover:underline">
          SuperBud (Distribution)
        </Link>
        .
      </div>
      <OpsStudioDesk
        initialJobs={jobs}
        tableReady={tableReady}
        tableError={tableError}
        keys={getStudioKeyStatus()}
      />
    </OpsPageShell>
  );
}
