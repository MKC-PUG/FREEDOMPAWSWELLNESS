'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SOCIAL_PLATFORMS,
  STUDIO_SEATS,
  STUDIO_STATUS_LABEL,
  STUDIO_TOPICS,
  type StudioJob,
  type StudioKeyStatus,
  type StudioSeat,
  type StudioStatus,
} from '@/lib/ops/studio-catalog';
import { atHomeComfort, factCardFromHit, type ResearchHit } from '@/lib/ops/studio-research';
import { storyboardFor, type StoryboardFields } from '@/lib/ops/studio-plates';
import { VENDOR_VIDEO_TOPICS, vendorFactCard } from '@/lib/ops/studio-vendors';
import OpsStoryboardPreview from './OpsStoryboardPreview';
import { OpsCard, OpsKpiCard, OpsSection } from './OpsUi';

function statusClass(status: StudioStatus): string {
  if (status === 'watch' || status === 'research' || status === 'script') {
    return 'border-amber-500/40 text-amber-200';
  }
  if (status === 'rendering' || status === 'queued') return 'border-sky-500/40 text-sky-200';
  if (status === 'done') return 'border-emerald-500/40 text-emerald-200';
  if (status === 'hold') return 'border-rose-500/40 text-rose-200';
  return 'border-white/20 text-white/70';
}

type SlateItem = {
  id: string;
  title: string;
  catalogCode?: string;
  factCard?: string;
  doNotSay?: string;
  sourceUrl?: string;
  vendor?: string;
  script?: string;
  onScreenText?: string;
  backgroundId?: string;
  motionId?: string;
};

type ExcerptView = {
  id: string;
  url: string;
  loading: boolean;
  error?: string;
  sentences: string[];
  terms: string[];
};

function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  const cleaned = terms.filter((term) => term.length > 2);
  if (cleaned.length === 0) return <>{text}</>;
  const pattern = new RegExp(
    `(${cleaned.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'ig'
  );
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, index) =>
        cleaned.some((term) => term.toLowerCase() === part.toLowerCase()) ? (
          <mark key={index} className="rounded bg-[#F5C242] px-0.5 text-[#0A1428]">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

const SLATE_KEY = 'fp-studio-slate-v1';

function catalogSlate(): SlateItem[] {
  const vendorRows: SlateItem[] = VENDOR_VIDEO_TOPICS.map((topic) => ({
    id: topic.id,
    title: topic.title,
    factCard: vendorFactCard(topic),
    doNotSay: topic.doNotSay,
    vendor: topic.vendor,
    backgroundId: topic.backgroundId,
  }));
  const catalogRows: SlateItem[] = STUDIO_TOPICS.map((topic) => ({
    id: topic.code,
    title: `${topic.code} · ${topic.title}`,
    catalogCode: topic.code,
  }));
  return [...vendorRows, ...catalogRows];
}

function mergeSlate(saved: SlateItem[]): SlateItem[] {
  const known = new Set(saved.map((item) => item.id));
  const missing = catalogSlate().filter((item) => !known.has(item.id));
  return [...missing, ...saved];
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
  const [slate, setSlate] = useState<SlateItem[]>(catalogSlate);
  const [slateReady, setSlateReady] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [researchQuery, setResearchQuery] = useState('');
  const [researchHits, setResearchHits] = useState<ResearchHit[]>([]);
  const [researchBusy, setResearchBusy] = useState(false);
  const [platform, setPlatform] = useState('all');
  const [seat, setSeat] = useState<StudioSeat>('lex');
  const [generalTitle, setGeneralTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [factCard, setFactCard] = useState('');
  const [script, setScript] = useState('');
  const [caption, setCaption] = useState('');
  const [article, setArticle] = useState('');
  const [onScreenText, setOnScreenText] = useState('');
  const [backgroundId, setBackgroundId] = useState('locked');
  const [motionId, setMotionId] = useState('subtle');
  const [boardId, setBoardId] = useState<string | null>(null);
  const [boardMode, setBoardMode] = useState<'preview' | 'edit'>('preview');
  const [excerpt, setExcerpt] = useState<ExcerptView | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(tableError ?? null);

  const selected = useMemo(
    () => jobs.find((job) => job.id === selectedId) ?? null,
    [jobs, selectedId]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SLATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SlateItem[];
        if (Array.isArray(parsed) && parsed.length > 0) setSlate(mergeSlate(parsed));
      }
    } catch {
      /* keep the catalog order */
    }
    setSlateReady(true);
  }, []);

  useEffect(() => {
    if (!slateReady) return;
    localStorage.setItem(SLATE_KEY, JSON.stringify(slate));
  }, [slate, slateReady]);

  useEffect(() => {
    if (!selected) return;
    setFactCard(selected.factCard);
    setScript(selected.script);
    setCaption(selected.echoCaption);
    setArticle(selected.echoArticle);
    setOnScreenText(selected.onScreenText);
    setBackgroundId(selected.backgroundId);
    setMotionId(selected.motionId);
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

  function moveSlate(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= slate.length) return;
    const copy = slate.slice();
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    setSlate(copy);
  }

  function addCustomTitle() {
    const title = customTitle.trim();
    if (title.length < 3) {
      setError('Type a topic title of at least 3 letters.');
      return;
    }
    setSlate((prev) => [
      {
        id: `custom-${Date.now()}`,
        title,
        factCard: `Topic: ${title}\nAdd a public source before you accept this card.\nAt-home comfort: ${atHomeComfort(title)}\nSuperBud may say that at-home step when the dog is otherwise bright, then call your own veterinarian if it continues.\nDo not say: naming a condition as the answer, a treatment promise, a dose, or a reunion promise.`,
        doNotSay: 'Naming a condition as the answer, a treatment promise, a dose, or a reunion promise.',
      },
      ...prev,
    ]);
    setCustomTitle('');
    setMessage(`“${title}” is on the topic list. Queue it when you want it produced.`);
  }

  function addHitToSlate(hit: ResearchHit) {
    const card = factCardFromHit(hit);
    setSlate((prev) => [
      {
        id: hit.id,
        title: hit.title,
        factCard: card.factCard,
        doNotSay: card.doNotSay,
        sourceUrl: hit.url,
      },
      ...prev.filter((item) => item.id !== hit.id),
    ]);
    setMessage(`“${hit.title}” is on the topic list.`);
  }

  async function searchResearch() {
    const q = researchQuery.trim();
    setResearchBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/ops/desk/research?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { success?: boolean; hits?: ResearchHit[]; error?: string };
      if (!data.success) throw new Error(data.error || 'Research failed');
      setResearchHits(data.hits ?? []);
    } catch (e) {
      setResearchHits([]);
      setError(e instanceof Error ? e.message : 'Research failed');
    } finally {
      setResearchBusy(false);
    }
  }

  function boardOf(item: SlateItem): SlateItem {
    const board = storyboardFor(item.title, item.factCard || '', {
      script: item.script,
      onScreenText: item.onScreenText,
      backgroundId: item.backgroundId,
      motionId: item.motionId,
    });
    return { ...item, ...board };
  }

  function openBoard(item: SlateItem, mode: 'preview' | 'edit') {
    const ready = boardOf(item);
    setSlate((prev) => prev.map((row) => (row.id === item.id ? ready : row)));
    setBoardId(item.id);
    setBoardMode(mode);
    requestAnimationFrame(() => {
      document.getElementById(`topic-${item.id}`)?.scrollIntoView({ block: 'nearest' });
    });
  }

  function patchBoard(id: string, patch: Partial<StoryboardFields>) {
    setSlate((prev) => prev.map((row) => (row.id === id ? { ...boardOf(row), ...patch } : row)));
  }

  function queueSlateItem(item: SlateItem) {
    const ready = boardOf(item);
    setSlate((prev) => prev.map((row) => (row.id === item.id ? ready : row)));
    const board = {
      script: ready.script,
      onScreenText: ready.onScreenText,
      backgroundId: ready.backgroundId,
      motionId: ready.motionId,
    };
    if (item.catalogCode) {
      return run('Queue topic', {
        action: 'create_video',
        catalogCode: item.catalogCode,
        platform,
        ...board,
      });
    }
    return run('Queue topic', {
      action: 'queue_source',
      title: item.title,
      factCard: item.factCard || '',
      doNotSay: item.doNotSay,
      platform,
      ...board,
    });
  }

  async function openExcerpt(hit: ResearchHit) {
    setExcerpt({ id: hit.id, url: hit.url, loading: true, sentences: [], terms: [] });
    try {
      const params = new URLSearchParams({ url: hit.url, q: researchQuery, title: hit.title });
      const res = await fetch(`/api/ops/desk/research/excerpt?${params.toString()}`);
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        excerpt?: { sentences: string[]; terms: string[]; url: string };
      };
      if (!data.success || !data.excerpt) throw new Error(data.error || 'Excerpt failed');
      setExcerpt({
        id: hit.id,
        url: data.excerpt.url,
        loading: false,
        sentences: data.excerpt.sentences,
        terms: data.excerpt.terms,
      });
    } catch (e) {
      setExcerpt({
        id: hit.id,
        url: hit.url,
        loading: false,
        error: e instanceof Error ? e.message : 'Excerpt failed',
        sentences: [],
        terms: [],
      });
    }
  }

  function jobDraft() {
    return {
      factCard,
      script,
      echoCaption: caption,
      echoArticle: article,
      onScreenText,
      backgroundId,
      motionId,
    };
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
          One row is one SuperBud package: research, spoken script, one MP4, and the social pack.
          Queue sends that same cut to Instagram, TikTok, YouTube, and Facebook. You still accept
          the research, the spoken words, and the finished cut. Ad spend stays off.
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

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || !tableReady}
          onClick={() => setPlatform('all')}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
            platform === 'all' ? 'border-[#F5C242] bg-[#F5C242] text-[#0A1428]' : 'border-white/20 text-white/80'
          }`}
        >
          All platforms
        </button>
        {SOCIAL_PLATFORMS.map((item) => (
          <button
            key={item}
            type="button"
            disabled={busy || !tableReady}
            onClick={() => setPlatform(item)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${
              platform === item ? 'border-[#F5C242] bg-[#F5C242] text-[#0A1428]' : 'border-white/20 text-white/80'
            }`}
          >
            {item} only
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <OpsCard>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold">Topic list</h3>
              <p className="mt-1 text-xs text-white/50">
                Vendor rows are the products partners carry, including hind-leg supports for stiff hips.
                Reorder, add your own title, then queue the one you want produced.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 text-xs font-bold text-white/50 hover:text-white"
              onClick={() => setSlate(catalogSlate())}
            >
              Reset
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
              placeholder="Add a topic title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
            <button
              type="button"
              className="rounded-xl border border-[#F5C242]/50 px-3 py-2 text-xs font-bold text-[#F5C242]"
              onClick={addCustomTitle}
            >
              Add
            </button>
          </div>
          <ul className={`mt-3 space-y-2 ${boardId ? '' : 'max-h-80 overflow-y-auto'}`}>
            {slate.map((item, index) => (
              <li
                key={item.id}
                id={`topic-${item.id}`}
                className={`rounded-xl border px-3 py-2 ${
                  item.id === boardId ? 'border-[#F5C242]/60 bg-white/10' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                {item.vendor ? (
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#F5C242]">{item.vendor}</p>
                ) : null}
                <p className="text-sm font-medium">{item.title}</p>
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-xs text-[#F5C242] hover:underline"
                  >
                    Read source
                  </a>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold disabled:opacity-30"
                    onClick={() => moveSlate(index, -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    disabled={index === slate.length - 1}
                    className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold disabled:opacity-30"
                    onClick={() => moveSlate(index, 1)}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold"
                    onClick={() => openBoard(item, 'preview')}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold"
                    onClick={() => openBoard(item, 'edit')}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busy || !tableReady}
                    className="rounded-lg bg-[#F5C242] px-2 py-1 text-[11px] font-bold text-[#0A1428] disabled:opacity-40"
                    onClick={() => void queueSlateItem(item)}
                  >
                    Queue
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold text-white/60"
                    onClick={() => setSlate((prev) => prev.filter((row) => row.id !== item.id))}
                  >
                    Remove
                  </button>
                </div>
                {item.id === boardId ? (
                  <OpsStoryboardPreview
                    script={item.script || ''}
                    onScreenText={item.onScreenText || ''}
                    backgroundId={item.backgroundId || 'locked'}
                    motionId={item.motionId || 'subtle'}
                    mode={boardMode}
                    onEdit={() => openBoard(item, 'edit')}
                    onChange={(patch) => patchBoard(item.id, patch)}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </OpsCard>

        <OpsCard>
          <h3 className="text-sm font-bold">FACT research</h3>
          <p className="mt-1 text-xs text-white/50">
            Search veterinary and dog topics. Read opens the matching lines, with the full article linked.
            Each project includes one at-home comfort step, such as a plain oatmeal bath for itchy skin,
            and says to call a vet if it continues or the dog seems worse.
          </p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void searchResearch();
            }}
          >
            <input
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
              placeholder="Search, such as dog itchy skin"
              value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={researchBusy}
              className="rounded-xl bg-[#F5C242] px-3 py-2 text-xs font-bold text-[#0A1428] disabled:opacity-40"
            >
              {researchBusy ? 'Searching' : 'Search'}
            </button>
          </form>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {researchHits.length === 0 ? (
              <li className="text-xs text-white/45">Results show here after a search.</li>
            ) : (
              researchHits.map((hit) => (
                <li key={hit.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#F5C242]">{hit.source}</p>
                  <p className="mt-1 text-sm font-medium">{hit.title}</p>
                  <p className="mt-1 text-xs text-white/55">{hit.summary}</p>
                  <p className="mt-1 text-xs text-white/75">At-home: {atHomeComfort(`${hit.title} ${hit.summary}`)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold text-white/80"
                      onClick={() => void openExcerpt(hit)}
                    >
                      Read
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-[#F5C242] px-2 py-1 text-[11px] font-bold text-[#0A1428]"
                      onClick={() => addHitToSlate(hit)}
                    >
                      Add to topic list
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
          {excerpt ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              {excerpt.loading ? <p className="text-xs text-white/60">Reading the matching lines…</p> : null}
              {excerpt.error ? <p className="text-xs text-amber-200">{excerpt.error}</p> : null}
              <div className="space-y-2">
                {excerpt.sentences.map((sentence) => (
                  <p key={sentence} className="text-xs leading-5 text-white/80">
                    <Highlighted text={sentence} terms={excerpt.terms} />
                  </p>
                ))}
              </div>
              <a
                href={excerpt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-bold text-[#F5C242] hover:underline"
              >
                Full article
              </a>
            </div>
          ) : null}
        </OpsCard>
      </div>

      <OpsCard>
        <h3 className="text-sm font-bold">New agent job</h3>
        <p className="mt-1 text-xs text-white/50">
          FACT, BUD, ECHO, FORGE, or LEX. The row holds a paste-ready prompt. It does not render video.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STUDIO_SEATS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSeat(item.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                seat === item.id ? 'border-[#F5C242] bg-[#F5C242] text-[#0A1428]' : 'border-white/20 text-white/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          className="mt-3 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
          placeholder="Title"
          value={generalTitle}
          disabled={busy || !tableReady}
          onChange={(e) => setGeneralTitle(e.target.value)}
        />
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
                  {selected.platform === 'all' ? 'Instagram, TikTok, YouTube, Facebook' : selected.platform}
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
            {selected.kind === 'superbud_video' ? (
              <OpsStoryboardPreview
                script={script}
                onScreenText={onScreenText}
                backgroundId={backgroundId}
                motionId={motionId}
                mode="edit"
                onChange={(patch) => {
                  if (patch.script !== undefined) setScript(patch.script);
                  if (patch.onScreenText !== undefined) setOnScreenText(patch.onScreenText);
                  if (patch.backgroundId !== undefined) setBackgroundId(patch.backgroundId);
                  if (patch.motionId !== undefined) setMotionId(patch.motionId);
                }}
              />
            ) : (
              <label className="mt-3 block text-sm">
                <span className="text-white/50 text-xs uppercase tracking-wide">Spoken script</span>
                <textarea
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm"
                  rows={5}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                />
              </label>
            )}
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
                    ...jobDraft(),
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
                      ...jobDraft(),
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
                        ...jobDraft(),
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
                        ...jobDraft(),
                      });
                      if (saved) await run('Queue social', { action: 'queue_social', id: selected.id });
                    })();
                  }}
                >
                  {selected.platform === 'all' ? 'Queue all platforms' : 'Queue social post'}
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
