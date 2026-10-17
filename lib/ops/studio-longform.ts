/** Long-story plans. Choices are locked. Action clips are named here and filmed later. */

export const LONGFORM_KEY = 'fp-studio-longform-v1';

export type SituationId =
  | 'origin'
  | 'sidewalk'
  | 'lakeside'
  | 'stray'
  | 'ride-charlie'
  | 'podium';

export type LengthId = '60' | '90' | '120' | '180';
export type EgoId = 'ordinary' | 'superbud' | 'scientist' | 'veterinarian';
export type TransformId = 'roll-poof' | 'tornado' | 'shield' | 'none';
export type TransformWhen = 'opening' | 'middle' | 'before-lesson';
export type PowerId = 'none' | 'walk' | 'fly-land' | 'ride-charlie' | 'zap';
export type ChapterId = 'hook' | 'transform' | 'power' | 'lesson' | 'closer';
export type PlaceId = 'sidewalk' | 'lakeside' | 'sky' | 'podium';

export type LongChoices = {
  title: string;
  situation: SituationId;
  length: LengthId;
  lesson: string;
  startsAs: EgoId;
  endsAs: EgoId;
  transform: TransformId;
  transformWhen: TransformWhen;
  powers: PowerId[];
};

export type ClipSlotId = 'roll-poof' | 'tornado' | 'fly-land' | 'rides' | 'food-zap';

export type ClipSlot = {
  id: ClipSlotId;
  label: string;
  start: string;
  cover: string;
  end: string;
  emptyNote: string;
  src?: string;
  locked?: boolean;
};

/** Approved action files land here. Shake and gold poof is locked. Tornado twist is a first cut. The other three are empty. */
export const CLIP_SLOTS: ClipSlot[] = [
  {
    id: 'roll-poof',
    label: 'Shake and gold poof',
    start: 'Buddy standing on all four legs',
    cover: 'A very quick whole-body shiver that builds as the gold smoke explodes',
    end: 'The smoke clears slowly and SuperBud is standing',
    emptyNote:
      'Locked. Buddy stands on all four legs, shakes, the gold smoke bomb goes off in front of him, and it clears to SuperBud. This cut can be replaced later.',
    src: '/clips/roll-poof.mp4',
    locked: true,
  },
  {
    id: 'tornado',
    label: 'Tornado twist',
    start: 'Buddy standing on all four legs',
    cover: 'He spins in place until his body is a tornado cone',
    end: 'The wind thins and SuperBud is standing',
    emptyNote:
      'First cut. Not locked. Dust lifts around Buddy and becomes a funnel that hides him, darker in the core and lighter at the edge. It thins and SuperBud is standing.',
    src: '/clips/tornado-preview-1.mp4',
  },
  {
    id: 'fly-land',
    label: 'Fly and land',
    start: 'The locked flying pose',
    cover: 'The whole picture drifts across the sky',
    end: 'He lowers onto the sidewalk or the lake',
    emptyNote: 'Empty. No file yet.',
  },
  {
    id: 'rides',
    label: 'Ride Charlie',
    start: 'SuperBud on Charlie’s back',
    cover: 'The picture drifts forward',
    end: 'The same pug, still on Charlie',
    emptyNote: 'Empty. Charlie’s plate is locked. The ride clip is not filmed yet.',
  },
  {
    id: 'food-zap',
    label: 'Food zap',
    start: 'The host still, shield toward a bowl',
    cover: 'A gold beam from the shield to the bowl',
    end: 'A separate shot of the stray at the bowl',
    emptyNote: 'Empty. No file yet.',
  },
];

export type LongShot = {
  id: string;
  chapter: ChapterId;
  kind: 'talk' | 'action';
  place: PlaceId;
  costume: EgoId;
  beat: string;
  line: string;
  onScreenText: string;
  clipLabel: string;
  slotId: ClipSlotId | null;
};

export type LongPlan = {
  id: string;
  choices: LongChoices;
  shots: LongShot[];
};

export type LongTalkingHandoff = {
  id: string;
  title: string;
  script: string;
  onScreenText: string;
  backgroundId: string;
  factCard: string;
  doNotSay: string;
};

export const SITUATIONS: { id: SituationId; label: string }[] = [
  { id: 'origin', label: 'Origin' },
  { id: 'sidewalk', label: 'City sidewalk' },
  { id: 'lakeside', label: 'Lakeside' },
  { id: 'stray', label: 'Helping a stray' },
  { id: 'ride-charlie', label: 'Ride with Charlie' },
  { id: 'podium', label: 'Lesson at the podium' },
];

export const LENGTHS: { id: LengthId; label: string; words: number }[] = [
  { id: '60', label: '1 minute', words: 150 },
  { id: '90', label: '90 seconds', words: 225 },
  { id: '120', label: '2 minutes', words: 300 },
  { id: '180', label: '3 minutes', words: 450 },
];

export const EGOS: { id: EgoId; label: string }[] = [
  { id: 'ordinary', label: 'Ordinary pug' },
  { id: 'superbud', label: 'SuperBud' },
  { id: 'scientist', label: 'Scientist' },
  { id: 'veterinarian', label: 'Veterinarian' },
];

export const TRANSFORMS: { id: TransformId; label: string }[] = [
  { id: 'roll-poof', label: 'Shake and gold poof' },
  { id: 'tornado', label: 'Tornado twist' },
  { id: 'shield', label: 'Shield flash' },
  { id: 'none', label: 'None' },
];

export const TRANSFORM_WHENS: { id: TransformWhen; label: string }[] = [
  { id: 'opening', label: 'Opening' },
  { id: 'middle', label: 'Middle' },
  { id: 'before-lesson', label: 'Just before the lesson' },
];

export const POWERS: { id: PowerId; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'walk', label: 'Walk and talk' },
  { id: 'fly-land', label: 'Fly and land' },
  { id: 'ride-charlie', label: 'Ride Charlie' },
  { id: 'zap', label: 'Zap food to a stray' },
];

export const STUDIO_FRIENDS: {
  id: string;
  name: string;
  role: string;
  detail: string;
  plates: { label: string; src: string }[];
}[] = [
  {
    id: 'buddy',
    name: 'Buddy',
    role: 'Ordinary pug',
    detail:
      'Locked. Buddy is SuperBud before the cape. He stands on all four legs, then shakes. That shake is the trigger whenever he becomes SuperBud.',
    plates: [
      { label: 'Front', src: '/images/brand/friends/buddy-front.jpg' },
      { label: 'Side', src: '/images/brand/friends/buddy-side.jpg' },
    ],
  },
  {
    id: 'presley',
    name: 'Presley',
    role: 'Sidekick',
    detail: 'Locked. She is the white poodle-maltese. She appears in her own shot beside SuperBud.',
    plates: [
      { label: 'Front', src: '/images/brand/friends/presley-front.jpg' },
      { label: 'Three-quarter', src: '/images/brand/friends/presley-three-quarter.jpg' },
    ],
  },
  {
    id: 'charlie',
    name: 'Charlie',
    role: 'Ride friend',
    detail: 'Locked. He is the Rottweiler SuperBud calls for a ride. The ride clip is not filmed yet.',
    plates: [
      { label: 'Front', src: '/images/brand/friends/charlie-front.jpg' },
      { label: 'Side', src: '/images/brand/friends/charlie-side.jpg' },
    ],
  },
];

export const CHAPTERS: { id: ChapterId; label: string }[] = [
  { id: 'hook', label: 'Hook' },
  { id: 'transform', label: 'Transform' },
  { id: 'power', label: 'Power' },
  { id: 'lesson', label: 'Lesson' },
  { id: 'closer', label: 'Closer' },
];

const DO_NOT_SAY =
  'A diagnosis, a cure, a dose, shop now, or a reunion promise.';

const DEFAULT_LESSON =
  'Owners can notice how their dog walks, eats, and rests at home. Write it down. Skip home care and call your own veterinarian the same day if there is blood, swelling, repeated vomiting, or the dog will not get up.';

export function labelOf<T extends string>(rows: { id: T; label: string }[], id: T): string {
  return rows.find((row) => row.id === id)?.label ?? id;
}

export function situationPlace(id: SituationId): PlaceId {
  if (id === 'lakeside') return 'lakeside';
  if (id === 'podium') return 'podium';
  return 'sidewalk';
}

export function talkingPlate(place: PlaceId): string {
  if (place === 'lakeside') return 'lake';
  if (place === 'podium') return 'navy';
  return 'locked';
}

export function wordTarget(length: LengthId): number {
  return LENGTHS.find((row) => row.id === length)?.words ?? 225;
}

export function spokenWordCount(shots: LongShot[]): number {
  const text = shots.map((shot) => shot.line).join(' ');
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function togglePower(current: PowerId[], id: PowerId): PowerId[] {
  if (id === 'none') return ['none'];
  const withoutNone = current.filter((power) => power !== 'none');
  if (withoutNone.includes(id)) {
    const next = withoutNone.filter((power) => power !== id);
    return next.length > 0 ? next : ['none'];
  }
  if (withoutNone.length >= 2) return withoutNone;
  return [...withoutNone, id];
}

function egoSpeech(id: EgoId): string {
  if (id === 'ordinary') return 'the neighborhood pug';
  if (id === 'scientist') return 'SuperBud in the scientist coat';
  if (id === 'veterinarian') return 'SuperBud in the veterinarian coat';
  return 'SuperBud';
}

function shortTitle(title: string): string {
  const clean = title.trim();
  return clean.length > 72 ? `${clean.slice(0, 69)}…` : clean;
}

function hookLine(choices: LongChoices): string {
  if (choices.situation === 'origin') {
    return 'Hi friends. Before the cape, I was a neighborhood pug on this sidewalk.';
  }
  const who = egoSpeech(choices.startsAs);
  if (choices.situation === 'lakeside') {
    return `Hi friends. I am ${who}, and the lake is today's classroom.`;
  }
  if (choices.situation === 'stray') {
    return `Hi friends. I am ${who}. A stray on this block needs a meal and a kind plan.`;
  }
  if (choices.situation === 'ride-charlie') {
    return `Hi friends. I am ${who}, and today I ride with Charlie.`;
  }
  if (choices.situation === 'podium') {
    return `Hi friends. I am ${who}. Today we learn something that can help your dog live a happier, healthier life.`;
  }
  return `Hi friends. I am ${who}, and this sidewalk is today's classroom.`;
}

function transformCopy(
  id: TransformId,
  starts: EgoId,
  ends: EgoId,
): { beat: string; line: string; clipLabel: string } {
  const next = egoSpeech(ends);
  if (id === 'tornado') {
    return {
      beat: 'Tornado twist',
      line: `I spin in place, the wind becomes a cone around me, and I am ${next} when it thins.`,
      clipLabel: 'Tornado twist. Not locked.',
    };
  }
  if (id === 'shield') {
    return {
      beat: 'Shield flash',
      line: `The shield flares, and I am ${next}.`,
      clipLabel: 'Shield flash. Not filmed yet.',
    };
  }
  const buddyToSuper = starts === 'ordinary' && ends === 'superbud';
  return {
    beat: 'Shake and gold poof',
    line: buddyToSuper
      ? 'I stand on all four paws, I shiver, a gold smoke bomb explodes in front of me, and it clears to show SuperBud.'
      : `I shake, a gold smoke bomb goes off, and I am ${next}.`,
    clipLabel: 'Shake, then the gold smoke bomb. The shake is the trigger. Locked.',
  };
}

function powerCopy(id: PowerId, placeLabel: string): { beat: string; line: string; clipLabel: string; place: PlaceId } {
  if (id === 'walk') {
    return {
      beat: 'Walk and talk',
      line:
        placeLabel === 'podium'
          ? 'We cross to the podium and talk through one thing you can notice at home.'
          : `We walk the ${placeLabel} and talk through one thing you can notice at home.`,
      clipLabel: 'Walk and talk. Not filmed yet.',
      place: 'sidewalk',
    };
  }
  if (id === 'fly-land') {
    return {
      beat: 'Fly and land',
      line: 'I lift off, cross above the scene, and land before the lesson.',
      clipLabel: 'Fly and land. Not filmed yet.',
      place: 'sky',
    };
  }
  if (id === 'ride-charlie') {
    return {
      beat: 'Ride Charlie',
      line: 'I call Charlie, and I ride on his back from one block to the next.',
      clipLabel: 'Ride Charlie. His plate is locked. The clip is not filmed yet.',
      place: 'sidewalk',
    };
  }
  return {
    beat: 'Zap food to a stray',
    line: 'I send an ordinary meal to a stray. A sick dog still needs a veterinarian the same day.',
    clipLabel: 'Zap food to a stray. Not filmed yet.',
    place: 'sidewalk',
  };
}

function talkShot(
  id: string,
  chapter: ChapterId,
  place: PlaceId,
  costume: EgoId,
  line: string,
  onScreenText: string
): LongShot {
  return {
    id,
    chapter,
    kind: 'talk',
    place,
    costume,
    beat: 'Talking to camera',
    line,
    onScreenText,
    clipLabel: '',
    slotId: null,
  };
}

export function clipSlotById(id: ClipSlotId | null): ClipSlot | null {
  if (!id) return null;
  return CLIP_SLOTS.find((slot) => slot.id === id) ?? null;
}

export function slotForShot(shotId: string, transform: TransformId): ClipSlotId | null {
  if (shotId === 'transform' && (transform === 'roll-poof' || transform === 'tornado')) return transform;
  if (shotId === 'power-fly-land') return 'fly-land';
  if (shotId === 'power-ride-charlie') return 'rides';
  if (shotId === 'power-zap') return 'food-zap';
  return null;
}

export function buildShots(choices: LongChoices): LongShot[] {
  const ground = situationPlace(choices.situation);
  const groundLabel = labelOf(
    [
      { id: 'sidewalk' as PlaceId, label: 'sidewalk' },
      { id: 'lakeside' as PlaceId, label: 'lakeside' },
      { id: 'sky' as PlaceId, label: 'sky' },
      { id: 'podium' as PlaceId, label: 'podium' },
    ],
    ground
  );
  const powers = choices.powers.filter((power) => power !== 'none');
  const shots: LongShot[] = [
    talkShot('hook', 'hook', ground, choices.startsAs, hookLine(choices), shortTitle(choices.title)),
  ];
  for (const power of powers) {
    const copy = powerCopy(power, groundLabel);
    const place = power === 'walk' ? ground : copy.place;
    shots.push({
      id: `power-${power}`,
      chapter: 'power',
      kind: 'action',
      place,
      costume: choices.startsAs,
      beat: copy.beat,
      line: copy.line,
      onScreenText: copy.beat,
      clipLabel: copy.clipLabel,
      slotId: slotForShot(`power-${power}`, choices.transform),
    });
  }
  shots.push(
    talkShot('lesson', 'lesson', ground, choices.startsAs, choices.lesson.trim(), "Today's lesson")
  );
  shots.push(
    talkShot(
      'closer',
      'closer',
      ground,
      choices.startsAs,
      'I will be back with another lesson. This is general pet wellness education. Your own veterinarian knows your dog.',
      'See you next lesson'
    )
  );

  if (choices.transform === 'none') return shots;

  const copy = transformCopy(choices.transform, choices.startsAs, choices.endsAs);
  const transformShot: LongShot = {
    id: 'transform',
    chapter: 'transform',
    kind: 'action',
    place: ground,
    costume: choices.endsAs,
    beat: copy.beat,
    line: copy.line,
    onScreenText: copy.beat,
    clipLabel: copy.clipLabel,
    slotId: slotForShot('transform', choices.transform),
  };
  const lessonAt = shots.findIndex((shot) => shot.id === 'lesson');
  let insertAt = 1;
  if (choices.transformWhen === 'before-lesson') insertAt = lessonAt;
  if (choices.transformWhen === 'middle') {
    insertAt = 1 + Math.max(1, Math.floor(powers.length / 2));
    if (insertAt > lessonAt) insertAt = lessonAt;
  }
  shots.splice(insertAt, 0, transformShot);
  return shots.map((shot, index) =>
    index > insertAt ? { ...shot, costume: choices.endsAs } : shot
  );
}

function sameLine(a: string, b: string): boolean {
  return a.trim() === b.trim();
}

function mergeOrder(previous: LongShot[], refreshed: LongShot[]): LongShot[] {
  const byId = new Map(refreshed.map((shot) => [shot.id, shot]));
  const kept = previous.map((shot) => byId.get(shot.id)).filter((shot): shot is LongShot => Boolean(shot));
  const seen = new Set(kept.map((shot) => shot.id));
  const added = refreshed.filter((shot) => !seen.has(shot.id));
  const result = kept.slice();
  for (const shot of added) {
    const canonIndex = refreshed.findIndex((row) => row.id === shot.id);
    let insertAt = result.length;
    for (let i = 0; i < result.length; i += 1) {
      const idx = refreshed.findIndex((row) => row.id === result[i].id);
      if (idx > canonIndex) {
        insertAt = i;
        break;
      }
    }
    result.splice(insertAt, 0, shot);
  }
  return result;
}

export function originChoices(): LongChoices {
  return {
    title: 'How SuperBud came to be',
    situation: 'origin',
    length: '90',
    lesson: DEFAULT_LESSON,
    startsAs: 'ordinary',
    endsAs: 'superbud',
    transform: 'roll-poof',
    transformWhen: 'opening',
    powers: ['fly-land'],
  };
}

export function originPlan(): LongPlan {
  const choices = originChoices();
  return { id: 'origin', choices, shots: buildShots(choices) };
}

export function applyChoices(plan: LongPlan, patch: Partial<LongChoices>): LongPlan {
  const choices: LongChoices = {
    ...plan.choices,
    ...patch,
    powers: patch.powers ? toggleNormalize(patch.powers) : plan.choices.powers,
    lesson: patch.lesson !== undefined ? patch.lesson : plan.choices.lesson,
  };
  const oldDefaults = buildShots(plan.choices);
  const nextDefaults = buildShots(choices);
  const oldById = new Map(oldDefaults.map((shot) => [shot.id, shot]));
  const currentById = new Map(plan.shots.map((shot) => [shot.id, shot]));
  const refreshed = nextDefaults.map((fresh) => {
    const current = currentById.get(fresh.id);
    const previous = oldById.get(fresh.id);
    if (!current || !previous) return fresh;
    if (fresh.id === 'lesson') {
      return {
        ...fresh,
        onScreenText: sameLine(current.onScreenText, previous.onScreenText) ? fresh.onScreenText : current.onScreenText,
      };
    }
    return {
      ...fresh,
      line: sameLine(current.line, previous.line) ? fresh.line : current.line,
      onScreenText: sameLine(current.onScreenText, previous.onScreenText) ? fresh.onScreenText : current.onScreenText,
    };
  });
  const resetOrder =
    patch.transform !== undefined || patch.transformWhen !== undefined || patch.powers !== undefined;
  return { ...plan, choices, shots: resetOrder ? refreshed : mergeOrder(plan.shots, refreshed) };
}

function toggleNormalize(powers: PowerId[]): PowerId[] {
  const cleaned = powers.filter((power) => POWERS.some((row) => row.id === power));
  if (cleaned.length === 0 || cleaned.every((power) => power === 'none')) return ['none'];
  return cleaned.filter((power) => power !== 'none').slice(0, 2);
}

export function moveShot(shots: LongShot[], index: number, direction: -1 | 1): LongShot[] {
  const next = index + direction;
  if (next < 0 || next >= shots.length) return shots;
  const copy = shots.slice();
  const [shot] = copy.splice(index, 1);
  copy.splice(next, 0, shot);
  return copy;
}

export function patchShot(plan: LongPlan, id: string, patch: Partial<Pick<LongShot, 'line' | 'onScreenText'>>): LongPlan {
  const shots = plan.shots.map((shot) => (shot.id === id ? { ...shot, ...patch } : shot));
  const lesson = shots.find((shot) => shot.id === 'lesson');
  const choices =
    id === 'lesson' && patch.line !== undefined
      ? { ...plan.choices, lesson: patch.line }
      : plan.choices;
  return { ...plan, choices, shots };
}

export function planNotes(choices: LongChoices): string[] {
  const notes: string[] = [];
  if (choices.startsAs !== choices.endsAs && choices.transform === 'none') {
    notes.push('He starts and ends as different costumes. Pick a transform, or the change is unmarked.');
  }
  if (choices.startsAs === choices.endsAs && choices.transform !== 'none') {
    notes.push('The costume is the same on both sides. Pick a different ending if this transform should reveal an alter ego.');
  }
  if (choices.situation === 'ride-charlie' && !choices.powers.includes('ride-charlie')) {
    notes.push('This situation names Charlie. Add Ride Charlie if SuperBud should ride in a shot.');
  }
  if (choices.situation === 'stray' && !choices.powers.includes('zap')) {
    notes.push('This situation names a stray. Add Zap food to a stray if that beat should be in the film.');
  }
  if (choices.powers.filter((power) => power !== 'none').length === 0 && choices.transform !== 'none') {
    notes.push('With no power selected, the transform sits between the hook and the lesson.');
  }
  if (choices.startsAs === 'ordinary' && choices.endsAs === 'superbud' && choices.transform === 'tornado') {
    notes.push(
      'This story uses the tornado twist. The shake and gold poof is the other way Buddy becomes SuperBud.',
    );
  }
  if (choices.startsAs === 'ordinary' && choices.endsAs === 'superbud' && choices.transform === 'shield') {
    notes.push(
      'Buddy becomes SuperBud with the locked shake, or with the tornado twist. The shield flash is for a later costume change.',
    );
  }
  if (choices.startsAs === 'ordinary' || choices.endsAs === 'ordinary') {
    notes.push('Ordinary-pug shots use Buddy’s locked plate. SuperBud shots keep the host photo.');
  }
  return notes;
}

export function talkingHandoffs(plan: LongPlan): LongTalkingHandoff[] {
  return plan.shots
    .filter((shot) => shot.kind === 'talk')
    .map((shot) => ({
      id: `longform-${plan.id}-${shot.id}`,
      title: `${plan.choices.title} · ${labelOf(CHAPTERS, shot.chapter)}`,
      script: shot.line,
      onScreenText: shot.onScreenText,
      backgroundId: talkingPlate(shot.place),
      factCard: `Long story: ${plan.choices.title}\nLesson: ${plan.choices.lesson.trim()}\nThis row is one talking shot from the long-story plan. Action shots stay on that pane until the clips are filmed.\nDo not say: ${DO_NOT_SAY}`,
      doNotSay: DO_NOT_SAY,
    }));
}

export function parseLongPlan(raw: unknown): LongPlan | null {
  if (!raw || typeof raw !== 'object') return null;
  const plan = raw as Partial<LongPlan>;
  if (!plan.choices || typeof plan.choices !== 'object' || !Array.isArray(plan.shots)) return null;
  const base = originChoices();
  const incoming = plan.choices as Record<string, unknown>;
  const situationRaw = typeof incoming.situation === 'string' ? incoming.situation : '';
  const situation: SituationId =
    situationRaw === 'ride-charlie' || situationRaw === 'ride-rottweiler' || situationRaw === 'ride-lab'
      ? 'ride-charlie'
      : SITUATIONS.some((row) => row.id === situationRaw)
        ? (situationRaw as SituationId)
        : base.situation;
  const rawPowers = Array.isArray(incoming.powers)
    ? incoming.powers.map((power) =>
        power === 'ride-lab' || power === 'ride-rottweiler' ? 'ride-charlie' : power
      )
    : base.powers;
  const choices: LongChoices = {
    ...base,
    title: typeof incoming.title === 'string' ? incoming.title : base.title,
    length: LENGTHS.some((row) => row.id === incoming.length) ? (incoming.length as LengthId) : base.length,
    lesson: typeof incoming.lesson === 'string' ? incoming.lesson : base.lesson,
    startsAs: EGOS.some((row) => row.id === incoming.startsAs) ? (incoming.startsAs as EgoId) : base.startsAs,
    endsAs: EGOS.some((row) => row.id === incoming.endsAs) ? (incoming.endsAs as EgoId) : base.endsAs,
    transform: TRANSFORMS.some((row) => row.id === incoming.transform)
      ? (incoming.transform as TransformId)
      : base.transform,
    transformWhen: TRANSFORM_WHENS.some((row) => row.id === incoming.transformWhen)
      ? (incoming.transformWhen as TransformWhen)
      : base.transformWhen,
    situation,
    powers: toggleNormalize(rawPowers as PowerId[]),
  };
  const defaults = buildShots(choices);
  const saved = plan.shots.filter((shot): shot is LongShot => Boolean(shot) && typeof shot.id === 'string');
  return {
    id: 'origin',
    choices,
    shots: mergeOrder(saved, defaults.map((fresh) => {
      const current = saved.find((shot) => shot.id === fresh.id);
      if (!current) return fresh;
      return {
        ...fresh,
        line: typeof current.line === 'string' ? current.line : fresh.line,
        onScreenText: typeof current.onScreenText === 'string' ? current.onScreenText : fresh.onScreenText,
      };
    })),
  };
}
