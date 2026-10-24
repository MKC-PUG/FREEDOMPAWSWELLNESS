export type CeoSeat = 'orion' | 'echo' | 'proof' | 'email' | 'calls' | 'grant' | 'id' | 'nest';

export type CeoCardState = 'open' | 'approved' | 'held' | 'ready';

export type CeoCardView = {
  id: string;
  seat: CeoSeat;
  seatLabel: string;
  lane: 'priority' | 'overflow';
  title: string;
  draft: string;
  doNot: string;
  doneWhen: string;
  href: string | null;
  hrefLabel: string | null;
  readyLabel: string | null;
  blockedReason: string | null;
  state: CeoCardState;
  note: string;
  noteLabel: string;
};

type CeoCardSeed = Omit<CeoCardView, 'state' | 'note' | 'draft'> & { draft: string };

export type CeoCardPatch = {
  id: string;
  state?: CeoCardState;
  note?: string;
  draft?: string;
};

export type CeoDeskSaved = {
  cards: Record<string, { state?: CeoCardState; note?: string; draft?: string }>;
};

const SEAT_LABEL: Record<CeoSeat, string> = {
  orion: 'ORION · five boxes',
  echo: 'ECHO · social',
  proof: 'PROOF · smoke',
  email: 'EMAIL · info@',
  calls: 'CALLS · (629) 206-4430',
  grant: 'GRANT · draft only',
  id: 'ID · match watch',
  nest: 'NEST · HOLD',
};

function seed(partial: Omit<CeoCardSeed, 'seatLabel'> & { seat: CeoSeat }): CeoCardSeed {
  return { ...partial, seatLabel: SEAT_LABEL[partial.seat] };
}

export function ceoCardSeeds(pendingReviews: number): CeoCardSeed[] {
  return [
    seed({
      id: 'orion-l5',
      seat: 'orion',
      lane: 'priority',
      title: 'Wait on Bass. Do not send another counsel email today.',
      draft:
        'The October 24 reply to Paula Alvarez and Roy Wyman already asks for the Terms without the leftover arbitration notice and for written “approved for TN pilot.” Silence is not clearance. Send a short status note only if a silence date you set has already passed.',
      doNot: 'Do not post Terms, flip public mode, or treat a polite reply as L5.',
      doneWhen: 'You left the thread alone today, or you saved a real clearance PDF.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll wait',
      blockedReason: null,
      noteLabel: 'Your note',
    }),
    seed({
      id: 'orion-entity',
      seat: 'orion',
      lane: 'priority',
      title: 'Mail the name correction and sign the operating agreement.',
      draft:
        'The Articles still show the prior last name Slumpff. Mail the Wyoming Statement of Correction to Michael Kevin Corey ($60) and keep a copy. Sign the operating agreement. The EIN may stay blank. Log founder advances: Bass $4,000 paid September 11, Framer, Wyoming fees, the registered agent, and the correction when it is mailed.',
      doNot: 'Do not open an EIN or a company bank in this step.',
      doneWhen: 'The correction is in the mail and the signed agreement is in the Legal folder.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll do this today',
      blockedReason: null,
      noteLabel: 'Your note',
    }),
    seed({
      id: 'echo-studio',
      seat: 'echo',
      lane: 'priority',
      title: 'Queue one educational SuperBud piece in Studio.',
      draft:
        'Open Studio and queue one topic from the locked list. The CTA is watch, share, waitlist, the booth, ViT, or enroll. Target while L5 is open: about 4–7 Shorts a week. Buffer receives a draft only after you queue the post.',
      doNot: 'No shop, no affiliate link, no reunion rate, no diagnosis, no hard give-back percent.',
      doneWhen: 'One Studio job is queued, or you marked today as a rest day in the note.',
      href: '/ops/desk',
      hrefLabel: 'Open Studio',
      readyLabel: 'I’ll do this in Studio',
      blockedReason: null,
      noteLabel: 'Your note',
    }),
    seed({
      id: 'proof-smoke',
      seat: 'proof',
      lane: 'priority',
      title: 'iPhone smoke: ViT, Photo Booth, and ID enroll.',
      draft:
        'On your iPhone, signed in:\n1. /diagnostics — photo plus symptoms, then the top two protocols and the green banner (red only if urgent).\n2. /photobooth — create and share.\n3. /id/enroll — consent checkbox visible and unchecked by default.\nWrite pass or fail in the note. Fix only a failure.',
      doNot: 'Do not start the monitor cloud relay or a new module from a smoke fail.',
      doneWhen: 'The note says pass, or names the one screen that failed.',
      href: '/diagnostics',
      hrefLabel: 'Open ViT',
      readyLabel: 'I’ll run this on iPhone',
      blockedReason: null,
      noteLabel: 'Pass / fail',
    }),
    seed({
      id: 'email-info',
      seat: 'email',
      lane: 'priority',
      title: 'info@ draft. You read the mail. You send the reply.',
      draft:
        'To:\nSubject: Re:\n\n[Reply]\n\n— Michael Corey\nFreedom Paws Wellness LLC\ninfo@freedompawsinc.com\n(629) 206-4430',
      doNot:
        'This desk does not read Namecheap and does not send. Paste the inbound message in the note, edit the reply, then send it yourself in webmail.',
      doneWhen: 'You sent the reply from info@, or there was nothing to answer.',
      href: null,
      hrefLabel: null,
      readyLabel: 'Copy reply — I send it',
      blockedReason: null,
      noteLabel: 'Paste the inbound message',
    }),
    seed({
      id: 'nest-hold',
      seat: 'nest',
      lane: 'overflow',
      title: 'Tennessee Email 1 stays HOLD.',
      draft:
        'Six shelter drafts already live in docs/marketing/outbox/tn-pilot/. Each stays marked HOLD FOR L5. Do not personalize a send today. A call script can wait in the Calls card. No match-rate promise and no claim that Freedom Paws is the shelter or a government license.',
      doNot: 'Do not send Email 1. Written TN-pilot approval is still open.',
      doneWhen: 'The card is held. Nothing left this building.',
      href: '/ops/adoption',
      hrefLabel: 'Adoption partners',
      readyLabel: null,
      blockedReason: 'L5 is open. Shelter email cannot be marked ready to send.',
      noteLabel: 'Your note',
    }),
    seed({
      id: 'calls-line',
      seat: 'calls',
      lane: 'overflow',
      title: 'Script for (629) 206-4430. This desk does not dial.',
      draft:
        'Freedom Paws Wellness, this is Michael.\n\nFound dog: a person reviews the report before anyone contacts an owner. Do not confirm a match on the call.\n\nHealth question: this is general education. Their veterinarian decides.\n\nShelter: Email 1 is on hold until counsel clears the Tennessee pilot. Take a name and a time to talk after that.\n\nDo not quote a reunion rate, a give-back percent, or a shop offer.',
      doNot: 'Do not place the call from this page. Do not promise a reunion.',
      doneWhen: 'You used the script on a live call, or no call came in.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll use this script',
      blockedReason: null,
      noteLabel: 'Who called / what you said',
    }),
    seed({
      id: 'grant-hold',
      seat: 'grant',
      lane: 'overflow',
      title: 'Grant narrative stays a draft. Do not submit.',
      draft:
        'Petco Love, Maddie’s Fund, and ASPCA stay dark until L5 is saved and one partner listing is live. The July 2026 note said XRPL grant applications were closed — check the site before treating any draft as current.\n\nWhen the gate opens, the story is the Tennessee pilot, phone-first ID with a human review, and wellness education that is not a diagnosis. No welfare-grant fiction.',
      doNot: 'Do not submit an application from this card.',
      doneWhen: 'The narrative is accepted as a hold file, not an application.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'L5 is open and there is no live partner listing. Submit stays off.',
      noteLabel: 'Your note',
    }),
    seed({
      id: 'id-watch',
      seat: 'id',
      lane: 'overflow',
      title: `Match queue: ${pendingReviews} waiting on a person.`,
      draft:
        'Open the match queue. You review. You decide whether an owner is contacted. An agent never contacts an owner from a biometric match.',
      doNot: 'Do not let a card, a draft, or an agent email an owner.',
      doneWhen: 'The queue is checked, or it was already empty.',
      href: '/id/match',
      hrefLabel: 'Open match queue',
      readyLabel: null,
      blockedReason: 'Owner contact stays with you, outside this desk.',
      noteLabel: 'Your note',
    }),
  ];
}

const STATES: CeoCardState[] = ['open', 'approved', 'held', 'ready'];

export function isCeoCardState(value: unknown): value is CeoCardState {
  return typeof value === 'string' && STATES.includes(value as CeoCardState);
}

export function mergeCeoDesk(
  saved: CeoDeskSaved | null,
  pendingReviews: number
): CeoCardView[] {
  const patches = saved?.cards ?? {};
  return ceoCardSeeds(pendingReviews).map((card) => {
    const patch = patches[card.id];
    const state = patch && isCeoCardState(patch.state) ? patch.state : 'open';
    const note = typeof patch?.note === 'string' ? patch.note : '';
    const draft = typeof patch?.draft === 'string' ? patch.draft : card.draft;
    const readyBlocked = state === 'ready' && card.readyLabel == null;
    return {
      ...card,
      draft,
      note,
      state: readyBlocked ? 'approved' : state,
    };
  });
}

export function emptyCeoDesk(): CeoDeskSaved {
  return { cards: {} };
}
