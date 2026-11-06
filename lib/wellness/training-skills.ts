export type TrainingSkill = {
  id: string;
  title: string;
  rep: string;
  doneWhen: string;
  stop: string;
};

/** Foundation cues used by the AKC and the ASPCA: reward the behavior, one cue, stop while the dog is still willing. */
export const TRAINING_SKILLS: TrainingSkill[] = [
  {
    id: 'sit',
    title: 'Sit',
    rep: 'Hold a piece of their usual food at their nose, then lift it slightly back. When the hips touch the floor, say “sit” once and give the food.',
    doneWhen: 'Five sits in a row, each one rewarded.',
    stop: 'Stop if they jump at your hand. Lower the food and try again more slowly.',
  },
  {
    id: 'down',
    title: 'Lay down',
    rep: 'From a sit, take the food from their nose straight to the floor between the front paws. When the belly meets the floor, say “down” once and give the food.',
    doneWhen: 'Five downs from a sit.',
    stop: 'Stop if they pop up and mouth your hand. Toss the food on the floor and reset.',
  },
  {
    id: 'stay',
    title: 'Stay',
    rep: 'Ask for a sit. Show an open palm, take one step back, then return and reward before they move. Add a step only after the short stay is easy.',
    doneWhen: 'A three-second stay at one step away, five times.',
    stop: 'If they follow you, you stepped too far. Shorten it. Do not repeat the word.',
  },
  {
    id: 'come',
    title: 'Come',
    rep: 'Start a few steps away in the house. Say their name and “come” once. When they reach you, reward at your feet. Do not chase them and do not call them for something they dislike.',
    doneWhen: 'Five comes in the same room.',
    stop: 'If they do not move, walk backward or crouch. Do not punish a late come.',
  },
  {
    id: 'leave-it',
    title: 'Leave it',
    rep: 'Put a treat in a closed fist. Say “leave it.” The moment they back off the fist, open the other hand and pay from that hand. The fist treat is not the reward.',
    doneWhen: 'Three times they turn away from the closed fist.',
    stop: 'If they paw hard or mouth, stand up and end. Try again later with a lower-value crumb.',
  },
  {
    id: 'drop',
    title: 'Drop it',
    rep: 'While they hold a toy, offer a treat at the nose. When the toy falls, say “drop” once, give the treat, and give the toy back.',
    doneWhen: 'Three calm drops, and the toy comes back each time.',
    stop: 'Do not pry the mouth. If they stiffen over the toy, end the rep.',
  },
  {
    id: 'food-manners',
    title: 'No bite while eating',
    rep: 'Set the bowl down only when all four feet are on the floor and the mouth is off your hand. If they already eat calmly, practice one trade: show a treat, pick the bowl up when they back off, give the treat, and put the bowl back.',
    doneWhen: 'The bowl goes down without a grab, or one calm trade.',
    stop: 'If they growl, freeze, or snap, stop. Do not reach into the bowl and do not punish the growl. That dog needs a qualified trainer, not a harder rep.',
  },
  {
    id: 'wait',
    title: 'Wait at the door or the bowl',
    rep: 'Ask for a sit at the door or in front of the bowl. Reach for the knob or the bowl. If they stand, close the door or lift the bowl and ask again. Open or lower it when they sit.',
    doneWhen: 'One calm release: you say “ok,” then they go.',
    stop: 'One try that fails means the door opens less, not a correction.',
  },
  {
    id: 'leash',
    title: 'Loose leash',
    rep: 'Indoors, clip the leash. Walk a few steps. When the leash droops, mark and reward beside your leg. If they pull, stop until the leash softens, then walk again.',
    doneWhen: 'One slow lap of the home with a soft leash for most of the way.',
    stop: 'Do not yank. Stopping is the correction.',
  },
  {
    id: 'place',
    title: 'Place',
    rep: 'Toss a treat onto a mat. When they step on it, say “place” once and reward again on the mat. Ask them to sit or lie down there for a few seconds.',
    doneWhen: 'They go to the mat three times and stay for a breath.',
    stop: 'If they grab and leave, use a lower-value crumb and stay closer.',
  },
  {
    id: 'fetch',
    title: 'Fetch',
    rep: 'Roll a toy a short distance. When they pick it up, call them as in Come. Trade with a treat or a second toy, then roll it again. Keep the throws short.',
    doneWhen: 'Two bring-backs in the same room.',
    stop: 'If they will not bring it, stop chasing. Play with a second toy so coming back is the game.',
  },
  {
    id: 'name',
    title: 'Name and look',
    rep: 'Say the name once. When they look at your face, mark it and give a tiny piece of their usual food.',
    doneWhen: 'Five looks. End while they still want the game.',
    stop: 'If the name means nothing yet, reward any glance. Do not repeat the name over and over.',
  },
];

export const TRAINING_SOURCES = [
  {
    name: 'AKC training library',
    url: 'https://www.akc.org/expert-advice/training/',
  },
  {
    name: 'ASPCA dog training',
    url: 'https://www.aspca.org/pet-care/dog-care/dog-training',
  },
];
