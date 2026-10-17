'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  STUDIO_SEATS,
  STUDIO_STATUS_LABEL,
  STUDIO_TOPICS,
  type StudioJob,
  type StudioKeyStatus,
  type StudioSeat,
  type StudioStatus,
} from '@/lib/ops/studio-catalog';
import type { SocialPlatform } from '@/lib/ops/social-pillars';
import { OpsCard, OpsKpiCard, OpsSection } from './OpsUi';

const PLATFORMS: SocialPlatform[] = ['instagram', 'tiktok', 'youtube', 'facebook'];

function statusClass(status: StudioStatus): string {
  if (status === 'watch' || status === 'research' || status === 'script') {
    return 'border-amber-500/40 text-amber-200';
  }
  if (status === 'rendering' || status === 'queued') return 'border-sky-500/40 text-sky-200';
  if (status === 'done') return 'border-emerald-500/40 text-emerald-200';
  if (status === 'hold') return 'border-rose-500/40 text-rose-200';
  return 'border-white/20 text-white/70';
}

type Props = {
  initialJobs: StudioJob[];
  tableReady: boolean;
  tableError?: string | null;
  keys: StudioKeyStatus;
};

export default function OpsStudioDesk({ initialJobs, tableReady, tableError, keys }: Props) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedId, setSelectedId] = useState<string | null>(initialJobs[0]?.id ?? null);
  const [catalogCode, setCatalogCode] = useState(STUDIO_TOPICS[0]?.code ?? 'HA-01');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [seat, setSeat] = useState<StudioSeat>('lex');
  const [generalTitle, setGeneralTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [factCard, setFactCard] = useState('');
  const [script, setScript] = useState('');
  const [caption, setCaption] = useState('');
  const [article, setArticle] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(tableError ?? null);

  const selected = useMemo(
    () => jobs.find((job) => job.id === selectedId) ?? null,
    [jobs, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    setFactCard(selected.factCard);
    setScript(selected.script);
    setCaption(selected.echoCaption);
    setArticle(selected.echoArticle);
  }, [selected]);

  useEffect(() => {
    if (!selected || selected.status !== 'rendering') return;
    const timer = setInterval(() => {
      void run('Check render', { action: 'poll_render', id: selected.id }, true);
    }, 8000);
    return () => clearInterval(timer);
  }, [selected?.id, selected?.status]);

  const waiting = jobs.filter((job) =>
    job.status === 'research' || job.status === 'script' || job.status === 'watch'
  ).length;
  const rendering = jobs.filter((job) => job.status === 'rendering').length;
  const queued = jobs.filter((job) => job.status === 'queued').length;

  async function run(
    label: string,
    body: Record<string, unknown>,
    quiet = false
  ): Promise<boolean> {
    if (!quiet) {
      setBusy(true);
      setError(null);
      setMessage(null);
    }
    try {
      const res = await fetch('/api/ops/desk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { success?: boolean; job?: StudioJob; error?: string };
      if (!data.success || !data.job) throw new Error(data.error || `${label} failed`);
      setJobs((prev) => {
        const exists = prev.some((job) => job.id === data.job!.id);
        return exists
          ? prev.map((job) => (job.id === data.job!.id ? data.job! : job))
          : [data.job!, ...prev];
      });
      setSelectedId(data.job.id);
      if (!quiet) setMessage(`${label} saved.`);
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : `${label} failed`);
      return false;
    } finally {
      if (!quiet) setBusy(false);
    }
  }

  async function copyPrompt() {
    if (!selected?.prompt) return;
    await navigator.clipboard.writeText(selected.prompt);
    setMessage('Prompt copied. Paste it into a new Grok chat.');
  }

  return (
    <div className="space-y-8">
      <OpsSection title="Video and social jobs">
        <p className="mb-4 max-w-3xl text-sm text-white/65">
          One row is one SuperBud package: research, spoken script, MP3, talking MP4, caption,
          article, and ad drafts. You accept the research, the words that will be spoken, and the
          finished cut. The last acceptance is what enters the social queue. Ad spend stays off.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <OpsKpiCard label="Waiting on you" value={waiting} accent="amber" hint="Research, script, or watch" />
          <OpsKpiCard label="Rendering" value={rendering} hint="HeyGen in flight" />
          <OpsKpiCard label="Queued" value={queued} accent="emerald" hint="Approved into Buffer" />
          <OpsKpiCard
            label="Render keys"
            value={keys.elevenlabs && keys.heygen ? 'Ready' : 'Add keys'}
            accent={keys.elevenlabs && keys.heygen ? 'emerald' : 'amber'}
            hint={keys.draftModel ? 'Draft model connected' : 'Drafts fall back to the catalog'}
          />
        </div>
        {!tableReady ? (
          <p className="mt-3 text-xs text-amber-300">
            Run <code className="text-[#F5C242]">supabase/migrations/016_ops_studio_jobs.sql</code> in
            the Supabase SQL Editor, then refresh.
          </p>
        ) : null}
      </OpsSection>

      {error || message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? 'border-rose-500/40 bg-rose-950/30 text-rose-200'
              : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
          }`}
        >
          {error || message}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-4">
        <OpsCard>
          <h3 className="text-sm font-bold">New SuperBud video</h3>
          <p className="mt-1 text-xs text-white/50">
            Starts a FACT card from the topic catalog. Voice stays SuperBud-FP-Designed. The still
            stays the locked host plate.
          </p>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <label className="text-sm block">
              <span className="text-white/50 text-xs uppercase tracking-wide">Topic</span>
              <select
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2"
                value={catalogCode}
                disabled={busy || !tableReady}
                onChange={(e) => setCatalogCode(e.target.value)}
              >
                {STUDIO_TOPICS.map((topic) => (
                  <option key={topic.code} value={topic.code}>
                    {topic.code} · {topic.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm block">
              <span className="text-white/50 text-xs uppercase tracking-wide">Platform</span>
              <select
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2"
                value={platform}
                disabled={busy || !tableReady}
                onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              >
                {PLATFORMS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            disabled={busy || !tableReady}
            className="mt-3 rounded-xl bg-[#F5C242] px-4 py-2 text-sm font-bold text-[#0A1428] disabled:opacity-50"
            onClick={() => run('Create video', { action: 'create_video', catalogCode, platform })}
          >
            Create video job
          </button>
        </OpsCard>

        <OpsCard>
          <h3 className="text-sm font-bold">New agent job</h3>
          <p className="mt-1 text-xs text-white/50">
            FACT, BUD, ECHO, FORGE, or LEX. The row holds a paste-ready prompt. It does not render
            video.
          </p>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <label className="text-sm block">
              <span className="text-white/50 text-xs uppercase tracking-wide">Seat</span>
              <select
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2"
                value={seat}
                disabled={busy || !tableReady}
                onChange={(e) => setSeat(e.target.value as StudioSeat)}
              >
                {STUDIO_SEATS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm block">
              <span className="text-white/50 text-xs uppercase tracking-wide">Title</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2"
                value={generalTitle}
                disabled={busy || !tableReady}
                onChange={(e) => setGeneralTitle(e.target.value)}
              />
            </label>
          </div>
          <textarea
            className="mt-3 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
            rows={2}
            placeholder="What this seat should draft"
            value={brief}
            disabled={busy || !tableReady}
            onChange={(e) => setBrief(e.target.value)}
          />
          <button
            type="button"
            disabled={busy || !tableReady}
            className="mt-3 rounded-xl border border-[#F5C242]/50 px-4 py-2 text-sm font-bold text-[#F5C242] disabled:opacity-50"
            onClick={() =>
              run('Create job', {
                action: 'create_general',
                seat,
                title: generalTitle,
                brief,
              })
            }
          >
            Add job
          </button>
        </OpsCard>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        <div className="space-y-2">
          {jobs.length === 0 ? (
            <OpsCard>
              <p className="text-sm text-white/55">No jobs yet.</p>
            </OpsCard>
          ) : (
            jobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => setSelectedId(job.id)}
                className={`w-full rounded-2xl border px-3 py-3 text-left ${
                  job.id === selectedId ? 'border-[#F5C242]/60 bg-white/10' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#F5C242]">{job.seat.toUpperCase()}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClass(job.status)}`}>
                    {STUDIO_STATUS_LABEL[job.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{job.title}</p>
              </button>
            ))
          )}
        </div>

        {selected ? (
          <OpsCard>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/45">
                  {selected.kind === 'superbud_video' ? 'SuperBud video' : 'Agent job'} ·{' '}
                  {selected.platform}
                </p>
                <h3 className="mt-1 text-lg font-bold">{selected.title}</h3>
              </div>
              <button
                type="button"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold"
                onClick={() => void copyPrompt()}
              >
                Copy Grok prompt
              </button>
            </div>
            {selected.errorMessage ? (
              <p className="mt-3 text-sm text-amber-200">{selected.errorMessage}</p>
            ) : null}
            {selected.doNotSay ? (
              <p className="mt-3 text-xs text-white/50">Do not say: {selected.doNotSay}</p>
            ) : null}

            <label className="mt-4 block text-sm">
              <span className="text-white/50 text-xs uppercase tracking-wide">Research card</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
                rows={4}
                value={factCard}
                onChange={(e) => setFactCard(e.target.value)}
              />
            </label>
            <label className="mt-3 block text-sm">
              <span className="text-white/50 text-xs uppercase tracking-wide">Spoken script</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
                rows={5}
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />
            </label>
            <label className="mt-3 block text-sm">
              <span className="text-white/50 text-xs uppercase tracking-wide">Social caption</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </label>
            <label className="mt-3 block text-sm">
              <span className="text-white/50 text-xs uppercase tracking-wide">Article</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
                rows={4}
                value={article}
                onChange={(e) => setArticle(e.target.value)}
              />
            </label>
            {selected.echoAds.length > 0 ? (
              <div className="mt-3 text-sm">
                <p className="text-white/50 text-xs uppercase tracking-wide">Ad drafts · spend off</p>
                <ul className="mt-1 space-y-1 text-white/80">
                  {selected.echoAds.map((ad) => (
                    <li key={ad}>{ad}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selected.audioUrl ? (
              <audio className="mt-4 w-full" controls src={selected.audioUrl} />
            ) : null}
            {selected.videoUrl ? (
              <video className="mt-3 w-full max-w-sm rounded-xl" controls src={selected.videoUrl} />
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold"
                onClick={() =>
                  run('Save', {
                    action: 'save',
                    id: selected.id,
                    factCard,
                    script,
                    echoCaption: caption,
                    echoArticle: article,
                  })
                }
              >
                Save
              </button>
              <button
                type="button"
                disabled={busy || selected.status === 'rendering'}
                className="rounded-xl border border-amber-400/40 px-3 py-2 text-xs font-bold text-amber-200"
                onClick={() => {
                  void (async () => {
                    const saved = await run('Save', {
                      action: 'save',
                      id: selected.id,
                      factCard,
                      script,
                      echoCaption: caption,
                      echoArticle: article,
                    });
                    if (saved) await run('Accept research', { action: 'accept_research', id: selected.id });
                  })();
                }}
              >
                Accept research
              </button>
              {selected.kind === 'superbud_video' ? (
                <button
                  type="button"
                  disabled={busy}
                  className="rounded-xl bg-[#F5C242] px-3 py-2 text-xs font-bold text-[#0A1428] disabled:opacity-50"
                  onClick={() => {
                    void (async () => {
                      const saved = await run('Save', {
                        action: 'save',
                        id: selected.id,
                        factCard,
                        script,
                        echoCaption: caption,
                        echoArticle: article,
                      });
                      if (saved) await run('Render', { action: 'approve_script', id: selected.id });
                    })();
                  }}
                >
                  Approve script and render
                </button>
              ) : null}
              {selected.heygenVideoId ? (
                <button
                  type="button"
                  disabled={busy}
                  className="rounded-xl border border-sky-400/40 px-3 py-2 text-xs font-bold text-sky-200"
                  onClick={() => run('Check render', { action: 'poll_render', id: selected.id })}
                >
                  Check render
                </button>
              ) : null}
              {selected.kind === 'superbud_video' ? (
                <button
                  type="button"
                  disabled={busy || (selected.status !== 'watch' && selected.status !== 'queued')}
                  className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-bold text-emerald-200 disabled:opacity-40"
                  onClick={() => {
                    void (async () => {
                      const saved = await run('Save', {
                        action: 'save',
                        id: selected.id,
                        factCard,
                        script,
                        echoCaption: caption,
                        echoArticle: article,
                      });
                      if (saved) await run('Queue social', { action: 'queue_social', id: selected.id });
                    })();
                  }}
                >
                  Queue social post
                </button>
              ) : null}
              <button
                type="button"
                disabled={busy}
                className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-white/70"
                onClick={() => run('Hold', { action: 'hold', id: selected.id })}
              >
                Hold
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-white/70"
                onClick={() => run('Done', { action: 'done', id: selected.id })}
              >
                Mark done
              </button>
            </div>
          </OpsCard>
        ) : (
          <OpsCard>
            <p className="text-sm text-white/55">Select a job.</p>
          </OpsCard>
        )}
      </div>
    </div>
  );
}
