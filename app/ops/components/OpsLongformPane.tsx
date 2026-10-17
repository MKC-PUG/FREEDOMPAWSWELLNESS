'use client';

import { useEffect, useState } from 'react';
import { findBannedPhrase } from '@/lib/ops/studio-compliance';
import {
  CHAPTERS,
  CLIP_SLOTS,
  STUDIO_FRIENDS,
  EGOS,
  LENGTHS,
  LONGFORM_KEY,
  POWERS,
  SITUATIONS,
  TRANSFORMS,
  TRANSFORM_WHENS,
  applyChoices,
  clipSlotById,
  labelOf,
  moveShot,
  originPlan,
  parseLongPlan,
  patchShot,
  planNotes,
  spokenWordCount,
  talkingHandoffs,
  talkingPlate,
  togglePower,
  wordTarget,
  type LongPlan,
  type LongShot,
  type LongTalkingHandoff,
  type PlaceId,
} from '@/lib/ops/studio-longform';
import OpsStoryboardPreview from './OpsStoryboardPreview';
import { OpsCard } from './OpsUi';

const PLACES: { id: PlaceId; label: string }[] = [
  { id: 'sidewalk', label: 'City sidewalk' },
  { id: 'lakeside', label: 'Lakeside' },
  { id: 'sky', label: 'Sky' },
  { id: 'podium', label: 'Podium' },
];

function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-full border px-2 py-1 text-[11px] font-bold ${
            option.id === value
              ? 'border-[#F5C242] bg-[#F5C242] text-[#0A1428]'
              : 'border-white/20 text-white/80'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function OpsLongformPane({
  onSendTalking,
}: {
  onSendTalking: (items: LongTalkingHandoff[]) => void;
}) {
  const [plan, setPlan] = useState<LongPlan>(originPlan);
  const [ready, setReady] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LONGFORM_KEY);
      if (raw) {
        const parsed = parseLongPlan(JSON.parse(raw));
        if (parsed) setPlan(parsed);
      }
    } catch {
      /* keep the origin plan */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LONGFORM_KEY, JSON.stringify(plan));
  }, [plan, ready]);

  const words = spokenWordCount(plan.shots);
  const target = wordTarget(plan.choices.length);
  const notes = planNotes(plan.choices);
  const activePowers = plan.choices.powers.filter((power) => power !== 'none');
  const banned = plan.shots
    .map((shot) => findBannedPhrase(`${shot.line} ${shot.onScreenText}`))
    .find((hit) => hit);

  function send(items: LongTalkingHandoff[]) {
    if (banned) return;
    onSendTalking(items);
  }

  return (
    <OpsCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">Long stories</h3>
          <p className="mt-1 text-xs text-white/50">
            Plan a 1–3 minute film. Talking shots can go to the topic list. Walks, flights, rides,
            and transforms stay here until those clips are filmed.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 text-xs font-bold text-white/50 hover:text-white"
          onClick={() => {
            setPlan(originPlan());
            setPreviewId(null);
          }}
        >
          Restore origin
        </button>
      </div>

      <label className="mt-3 block text-xs text-white/50">
        Title
        <input
          className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm text-white"
          value={plan.choices.title}
          onChange={(e) => setPlan((current) => applyChoices(current, { title: e.target.value }))}
        />
      </label>

      <div className="mt-3 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Situation</p>
        <Pills
          options={SITUATIONS}
          value={plan.choices.situation}
          onChange={(situation) => setPlan((current) => applyChoices(current, { situation }))}
        />
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Length</p>
        <Pills
          options={LENGTHS}
          value={plan.choices.length}
          onChange={(length) => setPlan((current) => applyChoices(current, { length }))}
        />
        <p className="text-xs text-white/55">
          Spoken words: {words} of about {target} for this length. Chapters become the shorts later.
        </p>
      </div>

      <label className="mt-3 block text-xs text-white/50">
        Lesson
        <textarea
          className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm text-white"
          rows={4}
          value={plan.choices.lesson}
          onChange={(e) => setPlan((current) => applyChoices(current, { lesson: e.target.value }))}
        />
      </label>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Starts as</p>
          <Pills
            options={EGOS}
            value={plan.choices.startsAs}
            onChange={(startsAs) => setPlan((current) => applyChoices(current, { startsAs }))}
          />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Ends as</p>
          <Pills
            options={EGOS}
            value={plan.choices.endsAs}
            onChange={(endsAs) => setPlan((current) => applyChoices(current, { endsAs }))}
          />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Transform</p>
        <Pills
          options={TRANSFORMS}
          value={plan.choices.transform}
          onChange={(transform) => setPlan((current) => applyChoices(current, { transform }))}
        />
        {plan.choices.transform !== 'none' ? (
          <Pills
            options={TRANSFORM_WHENS}
            value={plan.choices.transformWhen}
            onChange={(transformWhen) => setPlan((current) => applyChoices(current, { transformWhen }))}
          />
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Powers, up to two</p>
        <div className="flex flex-wrap gap-1">
          {POWERS.map((power) => {
            const selected = plan.choices.powers.includes(power.id);
            const blocked = !selected && power.id !== 'none' && activePowers.length >= 2;
            return (
              <button
                key={power.id}
                type="button"
                disabled={blocked}
                onClick={() =>
                  setPlan((current) =>
                    applyChoices(current, { powers: togglePower(current.choices.powers, power.id) })
                  )
                }
                className={`rounded-full border px-2 py-1 text-[11px] font-bold disabled:opacity-30 ${
                  selected
                    ? 'border-[#F5C242] bg-[#F5C242] text-[#0A1428]'
                    : 'border-white/20 text-white/80'
                }`}
              >
                {power.label}
              </button>
            );
          })}
        </div>
      </div>

      {notes.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {notes.map((note) => (
            <li key={note} className="text-xs text-amber-200">
              {note}
            </li>
          ))}
        </ul>
      ) : null}
      {banned ? (
        <p className="mt-3 text-xs text-rose-200">
          A line includes “{banned}”. Rewrite it before a talking shot can go to the topic list.
        </p>
      ) : null}

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Friends</p>
        <p className="mt-1 text-xs text-white/50">
          Buddy is the ordinary pug. Presley walks beside SuperBud. Charlie is the ride.
        </p>
        <ul className="mt-2 grid gap-3 sm:grid-cols-2">
          {STUDIO_FRIENDS.map((friend) => (
            <li key={friend.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold">
                  {friend.name}{' '}
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#F5C242]">{friend.role}</span>
                </p>
                <span className="rounded-full border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                  Locked
                </span>
              </div>
              <p className="mt-1 text-[11px] text-white/55">{friend.detail}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {friend.plates.map((plate) => (
                  <figure key={plate.src}>
                    <img
                      src={plate.src}
                      alt={`${friend.name}, ${plate.label.toLowerCase()} plate`}
                      className="h-48 w-full rounded-lg object-contain bg-[#d7d1ca]"
                    />
                    <figcaption className="mt-1 text-[10px] text-white/45">{plate.label}</figcaption>
                  </figure>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Clip library</p>
        <p className="mt-1 text-xs text-white/50">
          Five slots. Each stays empty until that clip is approved. The story uses a slot. It does not create the file.
        </p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {CLIP_SLOTS.map((slot) => {
            const used = plan.shots.some((shot) => shot.slotId === slot.id);
            return (
              <li key={slot.id} className="rounded-xl border border-dashed border-white/20 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold">{slot.label}</p>
                  <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                    Empty
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-amber-200">{slot.emptyNote}</p>
                <p className="mt-1 text-[11px] text-white/45">
                  {used ? 'Used in this story.' : 'Not in this story.'} Starts on {slot.start}. {slot.cover}. Ends on {slot.end}.
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-4 text-[11px] text-white/45">
        Changing the transform, its timing, or the powers rebuilds the shot order. Up and Down hold until then.
      </p>
      <ul className="mt-3 space-y-3">
        {plan.shots.map((shot, index) => (
          <ShotRow
            key={shot.id}
            shot={shot}
            index={index}
            count={plan.shots.length}
            open={previewId === shot.id}
            onMove={(direction) =>
              setPlan((current) => ({ ...current, shots: moveShot(current.shots, index, direction) }))
            }
            onPatch={(patch) => setPlan((current) => patchShot(current, shot.id, patch))}
            onPreview={() => setPreviewId((current) => (current === shot.id ? null : shot.id))}
            onSend={
              shot.kind === 'talk'
                ? () => {
                    const handoff = talkingHandoffs(plan).find((item) => item.id.endsWith(`-${shot.id}`));
                    if (handoff) send([handoff]);
                  }
                : undefined
            }
            sendDisabled={Boolean(banned)}
          />
        ))}
      </ul>

      <button
        type="button"
        disabled={Boolean(banned)}
        className="mt-4 rounded-xl bg-[#F5C242] px-4 py-2 text-sm font-bold text-[#0A1428] disabled:opacity-40"
        onClick={() => send(talkingHandoffs(plan))}
      >
        Send talking shots to the topic list
      </button>
    </OpsCard>
  );
}

function ShotRow({
  shot,
  index,
  count,
  open,
  onMove,
  onPatch,
  onPreview,
  onSend,
  sendDisabled,
}: {
  shot: LongShot;
  index: number;
  count: number;
  open: boolean;
  onMove: (direction: -1 | 1) => void;
  onPatch: (patch: Partial<Pick<LongShot, 'line' | 'onScreenText'>>) => void;
  onPreview: () => void;
  onSend?: () => void;
  sendDisabled: boolean;
}) {
  const slot = clipSlotById(shot.slotId);
  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#F5C242]">
        {index + 1} · {labelOf(CHAPTERS, shot.chapter)} · {shot.kind === 'talk' ? 'Talking' : 'Action'}
      </p>
      <p className="mt-1 text-xs text-white/70">
        {labelOf(PLACES, shot.place)} · {labelOf(EGOS, shot.costume)} · {shot.beat}
      </p>
      <label className="mt-2 block text-[10px] uppercase tracking-wide text-white/40">
        On-screen title
        <input
          className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm text-white"
          maxLength={80}
          value={shot.onScreenText}
          onChange={(e) => onPatch({ onScreenText: e.target.value })}
        />
      </label>
      <label className="mt-2 block text-[10px] uppercase tracking-wide text-white/40">
        Spoken line
        <textarea
          className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm text-white"
          rows={3}
          value={shot.line}
          onChange={(e) => onPatch({ line: e.target.value })}
        />
      </label>
      {shot.kind === 'action' ? (
        <p className="mt-2 text-xs text-amber-200">
          {slot
            ? `Clip slot: ${slot.label}. ${slot.emptyNote}`
            : `${shot.clipLabel} This action has no clip slot yet.`}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={index === 0}
          className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold disabled:opacity-30"
          onClick={() => onMove(-1)}
        >
          Up
        </button>
        <button
          type="button"
          disabled={index === count - 1}
          className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold disabled:opacity-30"
          onClick={() => onMove(1)}
        >
          Down
        </button>
        {shot.kind === 'talk' ? (
          <button
            type="button"
            className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold"
            onClick={onPreview}
          >
            Preview
          </button>
        ) : null}
        {onSend ? (
          <button
            type="button"
            disabled={sendDisabled}
            className="rounded-lg bg-[#F5C242] px-2 py-1 text-[11px] font-bold text-[#0A1428] disabled:opacity-40"
            onClick={onSend}
          >
            Send to topic list
          </button>
        ) : null}
      </div>
      {open && shot.kind === 'talk' ? (
        <OpsStoryboardPreview
          mode="preview"
          script={shot.line}
          onScreenText={shot.onScreenText}
          backgroundId={talkingPlate(shot.place)}
          motionId="subtle"
          stillSrc={shot.costume === 'ordinary' ? '/images/brand/friends/buddy-front.jpg' : undefined}
        />
      ) : null}
      {open && shot.kind === 'talk' && shot.costume === 'ordinary' ? (
        <p className="mt-2 text-[11px] text-white/45">This shot uses Buddy’s locked plate.</p>
      ) : null}
      {open && shot.kind === 'talk' && shot.costume !== 'ordinary' && talkingPlate(shot.place) === 'locked' && shot.place === 'sidewalk' ? (
        <p className="mt-2 text-[11px] text-white/45">
          The film place is the city sidewalk. This preview uses the locked SuperBud photo until a sidewalk plate exists.
        </p>
      ) : null}
    </li>
  );
}
