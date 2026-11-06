export type TrainingDay = {
  day: number;
  title: string;
  rep: string;
  doneWhen: string;
};

export const TRAINING_WEEK: TrainingDay[] = [
  {
    day: 1,
    title: 'Settle',
    rep: 'Sit with your dog on a mat for five quiet minutes. Reward the calm, not the excitement.',
    doneWhen: 'They stay on the mat for most of the five minutes, or you end while they are still quiet.',
  },
  {
    day: 2,
    title: 'Name',
    rep: 'Say the dog’s name once. When they look at you, mark it and give a tiny piece of their usual food.',
    doneWhen: 'Five looks. Stop while they still want the game.',
  },
  {
    day: 3,
    title: 'Come from close',
    rep: 'From a few steps away, say “come” once. Reward at your feet. Do not chase.',
    doneWhen: 'Five comes in the same room.',
  },
  {
    day: 4,
    title: 'Chew and release',
    rep: 'Offer a chew you already know is appropriate. Trade it for a treat and give the chew back.',
    doneWhen: 'Three calm trades. Stop if they guard it.',
  },
  {
    day: 5,
    title: 'Leash start',
    rep: 'Clip the leash at home. Walk to the door and back. Reward a loose leash.',
    doneWhen: 'One slow lap of the home without pulling the whole way.',
  },
  {
    day: 6,
    title: 'Place after a meal',
    rep: 'After eating, lead them to the mat from day 1 and wait for a down or a quiet sit.',
    doneWhen: 'They settle once before you pick up the bowls.',
  },
  {
    day: 7,
    title: 'Your choice, shorter',
    rep: 'Repeat the day that went best, for half the time.',
    doneWhen: 'You wrote one sentence about what was easier than on day 1.',
  },
];
