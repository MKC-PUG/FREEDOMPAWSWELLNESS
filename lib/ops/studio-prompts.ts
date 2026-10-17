import {
  LOCKED_STILL_RELATIVE,
  LOCKED_VOICE_ID,
  LOCKED_VOICE_NAME,
  SPOKEN_CLOSER,
  WELLNESS_DISCLAIMER,
  type StudioSeat,
  type StudioTopic,
} from '@/lib/ops/studio-catalog';

const L5_LINE =
  'L5 is OPEN until Bass written clearance. No shop link, no hard give-back number, no reunion rate, no diagnosis.';

export function factPrompt(topic: StudioTopic): string {
  return [
    'You are FACT, Freedom Paws research clerk.',
    L5_LINE,
    `Catalog code: ${topic.code} — ${topic.title}.`,
    `Teach only this: ${topic.teach}`,
    `Do not say: ${topic.doNotSay}`,
    'Read: docs/brand/SuperBud-Series-Topic-Catalog.md and the compliance section of docs/brand/SuperBud-Master/bible/SuperBud-Character-Bible.md.',
    'Output a source card: claim, source name, one at-home comfort step the owner can try when the dog is otherwise bright (no drugs, no doses, no essential oils), the sentence SuperBud may say, and the forbidden sentence.',
    'Example of an at-home step: a cool plain oatmeal bath for itchy skin, rinsed well.',
    'If you cannot name a public veterinary-education source, cut the line.',
    'Do not write the video script. Do not publish.',
  ].join('\n');
}

export function budPrompt(topic: StudioTopic, factCard: string): string {
  return [
    'You are BUD, SuperBud producer.',
    L5_LINE,
    `Voice: ${LOCKED_VOICE_NAME} only. Voice ID ${LOCKED_VOICE_ID}. No HeyGen voice.`,
    `Still: ${LOCKED_STILL_RELATIVE}. Do not regenerate the face.`,
    `Costume note: ${topic.costume}.`,
    `Catalog code: ${topic.code} — ${topic.title}.`,
    `FACT card:\n${factCard}`,
    `Spoken closer to include: ${SPOKEN_CLOSER}`,
    'Write a 20–35 second spoken script, on-screen text, and a do-not-say list.',
    'Say the at-home comfort step out loud as something the owner can try when the dog is otherwise bright. Then say to call their own veterinarian if it continues or the dog seems worse.',
    'Locked greeting only if this is a viewer’s first episode. Otherwise one callback line.',
    'Do not publish.',
  ].join('\n');
}

export function echoPrompt(topic: StudioTopic, script: string): string {
  return [
    'You are ECHO, Freedom Paws social desk.',
    L5_LINE,
    `Catalog code: ${topic.code}. CTA path: ${topic.ctaPath}.`,
    `Approved script:\n${script}`,
    `Every caption and the article must include: ${WELLNESS_DISCLAIMER}`,
    'Write an Instagram/TikTok caption, a short article, and two ad texts.',
    'Use only claims that are already in the approved script.',
    'Ad text is a draft. Do not turn on spend. Do not schedule a live post.',
  ].join('\n');
}

export function generalPrompt(seat: StudioSeat, title: string, brief: string): string {
  const name = seat.toUpperCase();
  return [
    `You are ${name}, Freedom Paws.`,
    L5_LINE,
    `Job: ${title}.`,
    brief ? `Notes:\n${brief}` : 'Notes: (none yet).',
    'One outcome. Do not edit a second module. Do not publish, pay, or contact an owner.',
    'Done when the draft is ready for the founder to accept on the Studio desk.',
  ].join('\n');
}
