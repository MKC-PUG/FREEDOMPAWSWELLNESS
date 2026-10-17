import { getSocialDashboardStats, listSocialPosts } from '@/lib/ops/social-server';
import { getStudioKeyStatus, listStudioJobs } from '@/lib/ops/studio-server';
import OpsSocialStudio from '../../components/OpsSocialStudio';
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

  let posts: Awaited<ReturnType<typeof listSocialPosts>> = [];
  let stats = {
    total: 0,
    draft: 0,
    needsApproval: 0,
    approved: 0,
    scheduled: 0,
    posted: 0,
    failed: 0,
  };
  let socialReady = true;
  let socialError: string | null = null;
  try {
    posts = await listSocialPosts(60);
    stats = await getSocialDashboardStats();
  } catch (e) {
    socialReady = false;
    socialError = e instanceof Error ? e.message : 'social_posts unavailable';
  }

  return (
    <OpsPageShell
      title="Studio desk"
      subtitle="Videos and social posts in one place. Research, script, and the finished cut wait on you. Buffer receives a draft only after you queue the post."
    >
      <OpsStudioDesk
        initialJobs={jobs}
        tableReady={tableReady}
        tableError={tableError}
        keys={getStudioKeyStatus()}
      />
      <div className="mt-12 border-t border-white/10 pt-8">
        <OpsSocialStudio
          initialPosts={posts}
          stats={stats}
          tableReady={socialReady}
          tableError={socialError}
        />
      </div>
    </OpsPageShell>
  );
}
