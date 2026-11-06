'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createVaultEntryServer } from '@/lib/mypets/vault-api';
import { readPetProfiles } from '@/lib/mypets/storage';
import { TRAINING_SKILLS } from '@/lib/wellness/training-skills';

type LogEntry = {
  id: string;
  petName: string;
  petId: string | null;
  date: string;
  food: string;
  movement: string;
  training: string;
};

const STORAGE_KEY = 'fp-owner-daily-log';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function readLog(): LogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as unknown;
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : [];
  } catch {
    return [];
  }
}

export default function DailyLogClient() {
  const [pets, setPets] = useState<Array<{ id: string; name: string }>>([]);
  const [petId, setPetId] = useState('');
  const [date, setDate] = useState(today);
  const [food, setFood] = useState('');
  const [movement, setMovement] = useState('');
  const [training, setTraining] = useState('');
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setEntries(readLog());
    const local = readPetProfiles().map((pet) => ({ id: pet.id, name: pet.name }));
    setPets(local);
    if (local[0]) setPetId(local[0].id);
    void fetch('/api/pets', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as { pets?: Array<{ id: string; name: string }> };
        if (data.pets && data.pets.length > 0) {
          setPets(data.pets);
          setPetId(data.pets[0].id);
        }
      })
      .catch(() => undefined);
  }, []);

  const week = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    const cutoff = start.toISOString().slice(0, 10);
    return entries
      .filter((entry) => entry.date >= cutoff)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries]);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    const pet = pets.find((item) => item.id === petId);
    const entry: LogEntry = {
      id: `log-${Date.now().toString(36)}`,
      petName: pet?.name || 'Your dog',
      petId: pet?.id ?? null,
      date,
      food: food.trim(),
      movement: movement.trim(),
      training: training.trim(),
    };
    const next = [entry, ...readLog()].slice(0, 60);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEntries(next);
    setFood('');
    setMovement('');
    setTraining('');
    setMessage('Saved on this phone.');
    if (entry.petId && !entry.petId.startsWith('pet-')) {
      try {
        await createVaultEntryServer(entry.petId, {
          kind: 'daily_note',
          title: `Daily log ${entry.date}`,
          body: `Food: ${entry.food || '—'}\nMovement: ${entry.movement || '—'}\nTraining: ${entry.training || '—'}`,
          recordDate: entry.date,
        });
        setMessage('Saved on this phone and in the vault.');
      } catch {
        setMessage('Saved on this phone. Sign in to copy it into the vault.');
      }
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSave} className="space-y-4">
        <label className="block text-sm text-white/80">
          Dog
          <select
            value={petId}
            onChange={(event) => setPetId(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-3 text-sm"
          >
            {pets.length === 0 ? <option value="">Your dog</option> : null}
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-white/80">
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-3 text-sm"
          />
        </label>
        <LogField label="Food" value={food} onChange={setFood} placeholder="What they ate, and whether the bowl was finished" />
        <LogField label="Movement" value={movement} onChange={setMovement} placeholder="Walk, stairs, rest" />
        <label className="block text-sm text-white/80">
          Training skill
          <select
            value=""
            onChange={(event) => {
              const skill = TRAINING_SKILLS.find((item) => item.id === event.target.value);
              if (skill) setTraining(skill.title);
            }}
            className="mt-2 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-3 text-sm"
          >
            <option value="">Choose a skill, or type your own below</option>
            {TRAINING_SKILLS.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.title}
              </option>
            ))}
          </select>
        </label>
        <LogField label="Training note" value={training} onChange={setTraining} placeholder="Which skill, and how it went" />
        <button type="submit" className="w-full rounded-2xl bg-[#F5C242] py-4 text-sm font-bold text-black">
          Save this day
        </button>
        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
        <p className="text-xs text-white/45">
          Reps for the week live on{' '}
          <Link href="/wellness/training" className="text-amber-300 underline">
            the training week
          </Link>
          .
        </p>
      </form>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-white/50">Last seven days</h2>
        <p className="mt-2 text-xs leading-relaxed text-white/45">
          Older days stay on this phone, up to sixty entries. They are not deleted when the week
          rolls forward. A signed-in dog also gets each day copied into the My Pets vault.
        </p>
        {week.length === 0 ? (
          <p className="mt-3 text-sm text-white/55">No days saved yet. The week starts with the first note.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {week.map((entry) => (
              <li key={entry.id} className="rounded-2xl border border-white/10 p-4 text-sm">
                <p className="font-semibold text-white">
                  {entry.date} · {entry.petName}
                </p>
                <p className="mt-2 text-white/70">Food: {entry.food || '—'}</p>
                <p className="text-white/70">Movement: {entry.movement || '—'}</p>
                <p className="text-white/70">Training: {entry.training || '—'}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {entries.filter((entry) => !week.some((item) => item.id === entry.id)).length > 0 ? (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/50">Kept on this phone</h2>
          <ul className="mt-3 space-y-3">
            {entries
              .filter((entry) => !week.some((item) => item.id === entry.id))
              .map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-white/10 p-4 text-sm">
                  <p className="font-semibold text-white">
                    {entry.date} · {entry.petName}
                  </p>
                  <p className="mt-2 text-white/70">Food: {entry.food || '—'}</p>
                  <p className="text-white/70">Movement: {entry.movement || '—'}</p>
                  <p className="text-white/70">Training: {entry.training || '—'}</p>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function LogField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block text-sm text-white/80">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={2}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-3 text-sm text-white"
      />
    </label>
  );
}
