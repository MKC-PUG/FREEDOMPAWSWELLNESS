'use client';

import { useState } from 'react';
import { TRAINING_SKILLS } from '@/lib/wellness/training-skills';

export default function TrainingSkillChooser() {
  const [skillId, setSkillId] = useState(TRAINING_SKILLS[0].id);
  const skill = TRAINING_SKILLS.find((item) => item.id === skillId) ?? TRAINING_SKILLS[0];

  return (
    <div className="space-y-4">
      <label className="block text-sm text-white/80">
        Choose a skill
        <select
          value={skill.id}
          onChange={(event) => setSkillId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-3 text-sm"
        >
          {TRAINING_SKILLS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <article className="rounded-2xl border border-amber-400/30 bg-amber-950/20 p-5">
        <h3 className="text-lg font-bold">{skill.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{skill.rep}</p>
        <p className="mt-3 text-xs text-white/55">Done when: {skill.doneWhen}</p>
        <p className="mt-2 text-xs text-white/55">Stop when: {skill.stop}</p>
      </article>
    </div>
  );
}
