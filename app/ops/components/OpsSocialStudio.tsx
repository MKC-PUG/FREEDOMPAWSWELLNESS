'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PRODUCTION_TOOLS,
  SOCIAL_PILLARS,
  SUPERBUD_ASSET,
  type SocialPillarId,
  type SocialPlatform,
} from '@/lib/ops/social-pillars';
import type { SocialPost } from '@/lib/ops/social-server';
import { OpsCard, OpsKpiCard, OpsSection, OpsStatusBadge } from './OpsUi';

const PLATFORMS: SocialPlatform[] = ['instagram', 'tiktok', 'youtube', 'facebook'];

function toBadge(
  status: SocialPost['status']
): 'active' | 'dormant' | 'warning' | 'ready' | 'blocked' {
  if (status === 'posted') return 'active';
  if (status === 'approved' || status === 'scheduled') return 'ready';
  if (status === 'needs_approval') return 'warning';
  if (status === 'failed') return 'blocked';
  return 'dormant';
}

type Props = {
  initialPosts: SocialPost[];
  stats: {
    total: number;
    draft: number;
    needsApproval: number;
    approved: number;
    scheduled: number;
    posted: number;
    failed: number;
  };
  tableReady: boolean;
  tableError?: string | null;
};

export default function OpsSocialStudio({
  initialPosts,
  stats,
  tableReady,
  tableError,
}: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [pillar, setPillar] = useState<SocialPillarId>('adoption_tn');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [selectedId, setSelectedId] = useState<string | null>(initialPosts[0]?.id ?? null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(tableError ?? null);

  const selected = useMemo(
    () => posts.find((p) => p.id === selectedId) ?? null,
    [posts, selectedId]
  );

  async function run(
    label: string,
    fn: () => Promise<{
      success: boolean;
      post?: SocialPost;
      error?: string;
      dryRun?: boolean;
    }>
  ) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const data = await fn();
      if (!data.success) throw new Error(data.error || `${label} failed`);
      if (data.post) {
        setPosts((prev) => {
          const exists = prev.some((p) => p.id === data.post!.id);
          return exists
            ? prev.map((p) => (p.id === data.post!.id ? data.post! : p))
            : [data.post!, ...prev];
        });
        setSelectedId(data.post.id);
      }
      setMessage(
        data.dryRun
          ? `${label} OK (dry-run — set BUFFER_WEBHOOK_URL for live Buffer).`
          : `${label} OK`
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : `${label} failed`);
    } finally {
      setBusy(false);
    }
  }

  function createDraft(action: 'create' | 'generate') {
    return run(action === 'generate' ? 'Generate draft' : 'Create template', async () => {
      const res = await fetch('/api/ops/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, pillar, platform }),
      });
      return res.json();
    });
  }

  function patchStatus(action: 'approve' | 'needs_approval' | 'archive') {
    if (!selectedId) return;
    return run(action, async () => {
      const res = await fetch('/api/ops/social/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId, action }),
      });
      return res.json();
    });
  }

  function sendBuffer() {
    if (!selectedId) return;
    return run('Send to Buffer', async () => {
      const res = await fetch('/api/ops/social/buffer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId }),
      });
      return res.json();
    });
  }

  return (
    <div className="space-y-8">
      <OpsSection title="SuperBud social dashboard">
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#F5C242]/35 bg-white/5">
            <Image
              src={SUPERBUD_ASSET}
              alt="SuperBud — Freedom Paws Wellness mascot"
              fill
              className="object-cover"
              sizes="112px"
              priority
            />
          </div>
          <div className="text-sm text-white/70 max-w-2xl">
            <p className="font-semibold text-[#F5C242]">SuperBud production arm</p>
            <p className="mt-1">
              Draft → approve → Buffer. SuperBud represents Freedom Paws Wellness across Adoption
              TN, ID, Diagnostics, My Pets Vault, Photo Booth, and mission content. Nothing posts
              without Ops approval.
            </p>
            {!tableReady ? (
              <p className="mt-2 text-amber-300 text-xs">
                Run{' '}
                <code className="text-[#F5C242]">supabase/migrations/015_social_posts.sql</code> in
                Supabase SQL Editor to enable the pipeline.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <OpsKpiCard label="Total" value={stats.total} />
          <OpsKpiCard label="In draft" value={stats.draft} accent="amber" />
          <OpsKpiCard label="Needs approval" value={stats.needsApproval} accent="amber" />
          <OpsKpiCard label="Approved" value={stats.approved} accent="emerald" />
          <OpsKpiCard label="Scheduled" value={stats.scheduled} accent="emerald" />
          <OpsKpiCard label="Posted" value={stats.posted} />
        </div>
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

      <OpsSection title="Generate draft">
        <OpsCard>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm block">
              <span className="text-white/50 text-xs uppercase tracking-wide">Pillar</span>
              <select
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2"
                value={pillar}
                disabled={busy || !tableReady}
                onChange={(e) => setPillar(e.target.value as SocialPillarId)}
              >
                {SOCIAL_PILLARS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
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
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !tableReady}
              onClick={() => void createDraft('generate')}
              className="rounded-xl bg-[#F5C242] px-4 py-2 text-sm font-bold text-black disabled:opacity-40"
            >
              Generate draft (AI)
            </button>
            <button
              type="button"
              disabled={busy || !tableReady}
              onClick={() => void createDraft('create')}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 disabled:opacity-40"
            >
              Create SuperBud template
            </button>
          </div>
        </OpsCard>
      </OpsSection>

      <OpsSection title="Pipeline">
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-2 max-h-[28rem] overflow-y-auto pr-1">
            {posts.length === 0 ? (
              <OpsCard>
                <p className="text-sm text-white/50">No posts yet — generate a SuperBud draft.</p>
              </OpsCard>
            ) : (
              posts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left rounded-xl border px-3 py-3 transition ${
                    selectedId === p.id
                      ? 'border-[#F5C242]/50 bg-[#F5C242]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold line-clamp-2">{p.title}</p>
                    <OpsStatusBadge status={toBadge(p.status)} />
                  </div>
                  <p className="mt-1 text-[11px] text-white/45 uppercase tracking-wide">
                    {p.pillar.replace(/_/g, ' ')} · {p.platform}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="lg:col-span-3">
            {!selected ? (
              <OpsCard>
                <p className="text-sm text-white/50">Select a post to review script & actions.</p>
              </OpsCard>
            ) : (
              <OpsCard>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-[#F5C242]">{selected.title}</h3>
                  <OpsStatusBadge status={toBadge(selected.status)} />
                </div>
                <p className="mt-2 text-xs text-white/45">
                  CTA:{' '}
                  <a
                    className="text-sky-300 underline"
                    href={selected.ctaUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selected.ctaUrl}
                  </a>
                </p>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wide text-white/45 mb-1">Caption</p>
                  <pre className="whitespace-pre-wrap rounded-xl bg-black/30 p-3 text-xs text-white/80 max-h-40 overflow-y-auto">
                    {selected.caption}
                  </pre>
                </div>
                {selected.script ? (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-white/45 mb-1">Script</p>
                    <pre className="whitespace-pre-wrap rounded-xl bg-black/30 p-3 text-xs text-white/80 max-h-48 overflow-y-auto">
                      {selected.script}
                    </pre>
                  </div>
                ) : null}
                {selected.storyboard.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-white/45 mb-2">Storyboard</p>
                    <ol className="space-y-2">
                      {selected.storyboard.map((frame) => (
                        <li
                          key={frame.beat}
                          className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70"
                        >
                          <span className="font-bold text-[#F5C242]">Beat {frame.beat}.</span>{' '}
                          {frame.visual}
                          <span className="block mt-1 text-white/50">VO: {frame.voiceover}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void patchStatus('needs_approval')}
                    className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold"
                  >
                    Submit for approval
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void patchStatus('approve')}
                    className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-bold text-black"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={
                      busy ||
                      (selected.status !== 'approved' && selected.status !== 'scheduled')
                    }
                    onClick={() => void sendBuffer()}
                    className="rounded-lg bg-[#F5C242] px-3 py-1.5 text-xs font-bold text-black disabled:opacity-40"
                  >
                    Send to Buffer
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void patchStatus('archive')}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60"
                  >
                    Archive
                  </button>
                </div>
              </OpsCard>
            )}
          </div>
        </div>
      </OpsSection>

      <OpsSection title="Production studio — step-by-step">
        <OpsCard>
          <p className="text-sm text-white/65 mb-4">
            Use SuperBud as the hero still for every short. Work top → bottom. Open each tool in a
            new tab (your accounts). Paste the Ops script into ElevenLabs / CapCut.
          </p>
          <ol className="space-y-3 text-sm text-white/80 list-decimal pl-5">
            <li>
              <strong>Script</strong> — Generate draft above (or polish in ChatGPT/Claude). Approve
              wording in Ops.
            </li>
            <li>
              <strong>Storyboard</strong> — Copy beats into Canva; keep SuperBud chest emblem
              readable.
            </li>
            <li>
              <strong>Voice</strong> — ElevenLabs → paste approved script → export WAV/MP3.
            </li>
            <li>
              <strong>Visuals</strong> — Runway (motion from SuperBud still) and/or CapCut (app
              screen recordings).
            </li>
            <li>
              <strong>Assemble</strong> — CapCut 9:16, captions, end card with CTA URL from the
              post.
            </li>
            <li>
              <strong>Distribute</strong> — Approve in Ops → Send to Buffer (dry-run until webhook
              is set).
            </li>
          </ol>
        </OpsCard>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRODUCTION_TOOLS.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-[#F5C242]/40 transition"
            >
              <p className="font-bold text-sm text-[#F5C242]">{tool.name}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-white/45">{tool.role}</p>
              <p className="mt-2 text-xs text-white/60">{tool.whenToUse}</p>
              <p className="mt-3 text-[11px] text-sky-300">Open →</p>
            </a>
          ))}
        </div>

        <div className="mt-4">
          <OpsCard>
            <h3 className="font-bold text-sm mb-2">Pillar CTA map</h3>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs text-white/65">
              {SOCIAL_PILLARS.map((p) => (
                <li key={p.id} className="rounded-lg border border-white/10 px-3 py-2">
                  <span className="font-semibold text-white/90">{p.label}</span>
                  <span className="block text-sky-300/90">{p.ctaPath}</span>
                </li>
              ))}
            </ul>
          </OpsCard>
        </div>
      </OpsSection>
    </div>
  );
}
