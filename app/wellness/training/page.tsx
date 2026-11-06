import type { Metadata } from 'next';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import { TRAINING_SOURCES } from '@/lib/wellness/training-skills';
import { TRAINING_WEEK } from '@/lib/wellness/training-week';
import TrainingSkillChooser from './TrainingSkillChooser';

export const metadata: Metadata = {
  title: 'Training week • Freedom Paws',
  description: 'Seven short training reps an owner can do with the dog they already have.',
};

export default function TrainingWeekPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/wellness', label: 'Back to Wellness' }}>
      <PageHeader
        eyebrow="Training week"
        title="Seven short reps"
        subtitle="One rep a day. Use food they already eat. Stop while the dog is still willing. This is practice, not a diagnosis and not a promise to change a behavior condition."
      />
      <section className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white/50">Choose a skill</h2>
        <p className="mt-2 mb-4 text-sm leading-relaxed text-white/65">
          Sit, down, stay, come, leave it, drop it, food manners, wait, leash, place, fetch, and
          name. Pick one. Practice that rep. Write the skill name in the daily log.
        </p>
        <TrainingSkillChooser />
        <ul className="mt-4 space-y-1 text-xs text-white/45">
          {TRAINING_SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} className="text-amber-300 underline" target="_blank" rel="noreferrer">
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/50">
        Or follow the seven-day starter
      </h2>
      <ol className="space-y-4">
        {TRAINING_WEEK.map((day) => (
          <li key={day.day} className="rounded-2xl border border-white/10 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Day {day.day}</p>
            <h2 className="mt-1 font-bold">{day.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{day.rep}</p>
            <p className="mt-2 text-xs text-white/50">Done when: {day.doneWhen}</p>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
