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
      id: 'orion-l5-cleared',
      seat: 'orion',
      lane: 'overflow',
      title: 'L5 posting gate is cleared. Do not send another counsel email.',
      draft:
        'October 28, 2026. The October 26 Terms and Privacy are posted. Phone (629) 206-4430. The 10% give-back sentence is off the Terms page. The October 14 biometric consent, diagnostics disclaimer, and DPA outline were already cleared and are in place. Bass will say “final” for the Tennessee pilot. Bass will not say “approved.” You will say when the EIN is opened and the bank account is open.',
      doNot: 'Do not call the email an approval. Do not send shelter Email 1 from this card. Do not start selling from this card.',
      doneWhen: 'The October 26 clerk note is the record. You did not send a follow-up today.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll wait',
      blockedReason: null,
      noteLabel: 'Your note',
    }),
    seed({
      id: 'care-honest-kitchen',
      seat: 'orion',
      lane: 'priority',
      title: '1. Apply to The Honest Kitchen affiliate form.',
      draft:
        'Open https://www.thehonestkitchen.com/pages/partner-with-us. Use the AFFILIATES application. Do not use the CREATORS application.\n\nPaste: Freedom Paws Wellness LLC. Michael Corey, Managing Member. partners@freedompawsinc.com. (629) 206-4430. Website https://app.freedompawsinc.com. Dog wellness education app in preview. Not a clinic and not a store. No public traffic number. The partner link is not on the site. If approved, the tracking link stays private until the company bank can receive commission and the disclosure is on the page.\n\nWrite the confirmation in the note. Do not email questions@thehonestkitchen.com.',
      doNot:
        'Do not promise a live page, a give-back percent, or a user count. Do not say they are already a partner.',
      doneWhen: 'The affiliates form is submitted, or the page had no affiliates form and you wrote that in the note.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll submit this form',
      blockedReason: null,
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'care-pets-best',
      seat: 'orion',
      lane: 'priority',
      title: '2. Apply on the Pets Best affiliate form.',
      draft:
        'Open https://www.petsbest.com/forms/affiliates. The program page is https://www.petsbest.com/affiliates.\n\nSame identity block as box 1. Say the app would later use three private links only: a quote, a lost-dog page, and an urgent-care page. Those URLs are not live. You are asking to join the program.\n\nPhone on their page, if a person must talk: 1-888-217-2731. You place the call. This desk does not dial.',
      doNot:
        'Do not promise a live marketplace placement. Do not invent a monthly visitor number.',
      doneWhen: 'The form is submitted and the note says so.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll submit this form',
      blockedReason: null,
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'care-west-paw',
      seat: 'orion',
      lane: 'priority',
      title: '3. Apply to West Paw through AvantLink. Then send one email.',
      draft:
        'Open https://www.westpaw.com/pages/affiliate-program and read the 6-month site rule. Then open https://www.avantlink.com/signup/affiliate, choose United States, and create the publisher account with partners@freedompawsinc.com. Inside AvantLink, apply to West Paw. Answer honestly: the app is in preview.\n\nAfter the application is in, send this from partners@ webmail to affiliates@westpaw.com.\n\nSubject: Affiliate application — Freedom Paws Wellness LLC\n\nHello,\n\nI applied to the West Paw affiliate program through AvantLink as Freedom Paws Wellness LLC. The property is https://app.freedompawsinc.com, a dog wellness education app in preview. We are not a clinic and not a store. I am not asking for a live placement. I am asking for a tracking link if you approve the application. The link would stay private until our company bank can receive commission and a disclosure is on the page.\n\nMichael Corey\nManaging Member\nFreedom Paws Wellness LLC\npartners@freedompawsinc.com\n(629) 206-4430',
      doNot:
        'Do not promise a page, a give-back percent, or traffic you do not have. Their page requires a site active at least 6 months. If they decline, write declined in the note.',
      doneWhen: 'The AvantLink application is submitted and the email is sent from partners@.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll apply, then send',
      blockedReason: null,
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'care-vetster',
      seat: 'orion',
      lane: 'priority',
      title: '4. Apply with Vetster’s Join now button.',
      draft:
        'Open https://vetster.com/en-us/affiliates and click Join now. Use the same identity block. Say Freedom Paws would describe them as a licensed telehealth booking option, not as a holistic-only practice and not as Freedom Paws itself.\n\nDo not email support@vetster.com to apply. That address is for questions after you are in the program.',
      doNot:
        'Do not call Vetster our holistic vet. Do not promise the booking button is already on the app.',
      doneWhen: 'Join now is submitted and the note says so.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll submit this form',
      blockedReason: null,
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'care-branch-basics',
      seat: 'orion',
      lane: 'priority',
      title: '5. Apply on the Branch Basics partnerships page.',
      draft:
        'Open https://branchbasics.com/pages/partnerships and click the apply-now link on that page. Their ambassador tier asks for 1,000 followers and for you to be a Branch Basics user in the US or Canada. Write the true follower number. If you are under 1,000, still submit only if the form allows a lower number. Otherwise stop and write “follower gate” in the note.\n\nIf the apply link is missing, send one email from partners@ to partnerships@branchbasics.com with the same facts as the West Paw note, plus the true follower count. Do not email info@branchbasics.com.',
      doNot:
        'Do not invent a follower count. Do not promise a live page or a give-back percent.',
      doneWhen: 'The form is submitted, the one backup email is sent, or the note says the follower gate stopped you.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll apply or stop',
      blockedReason: null,
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'echo-studio',
      seat: 'echo',
      lane: 'overflow',
      title: 'Queue one educational SuperBud piece in Studio.',
      draft:
        'Open Studio and queue one topic from the locked list. The CTA is watch, share, waitlist, the booth, ViT, or enroll. Target about 4–7 Shorts a week. Buffer receives a draft only after you queue the post.',
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
      lane: 'overflow',
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
      lane: 'overflow',
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
      id: 'care-list-record',
      seat: 'orion',
      lane: 'overflow',
      title: 'Care-support list and disclosure. Filed. Do not publish.',
      draft:
        'Disclosure, for a later page, not for an email: Freedom Paws may earn a commission if you use a partner link. The partner sells the product or provides the coverage or the consult. Freedom Paws does not. This is not veterinary treatment. Ask your own veterinarian about your dog.\n\nDo not email: Whimzees, Ruffwear, Open Farm, Native Pet, Walkin’ Pets, Help ’Em Up. No public apply page was confirmed for those names. Native Pet is reported on Awin only. Search inside a network you already joined. If the brand is not listed, stop.\n\nListed peptide targets, not in the five boxes: North Hound Life Pure Collagen and miNATURALS K9 collagen peptide powder. No public affiliate page was confirmed. Do not email them. Taily, Collagenie, Vetrition, the Native Pet Skin+Coat chew, and GELITA stay off the list.\n\nWhen a tracking URL arrives, paste it in this note. Do not put it on the site. The bank is not open.',
      doNot: 'Do not publish this list. Do not paste a tracking URL into the app from this card.',
      doneWhen: 'The note holds any URL that arrived. The site is unchanged.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'Links stay private until the company bank can receive commission and the disclosure is on the page.',
      noteLabel: 'Tracking URLs, if any arrive',
    }),
    seed({
      id: 'vendor-media-hold',
      seat: 'orion',
      lane: 'overflow',
      title: 'Vendor media — one signed brand. Not today.',
      draft:
        'Open Studio only after all four are true for that one brand:\n1. The tracking URL is in the Care-support list note.\n2. The company bank is open and can receive the commission.\n3. The disclosure is on the same page as the link.\n4. The link sits inside an unlock.\n\nThen one brand per video. FACT writes the source card from the signed program. BUD writes a 30–45 second script from the locked still and the locked voice. He names that one brand, says the disclosure out loud, and ends by telling the owner to call their own veterinarian. LEX checks the script. You click Approve script and render. ECHO writes the caption with the wellness disclaimer and the commission disclosure. The caption path is the in-app page. No raw tracking URL. You click Hand to SuperBud, then you approve it on Distribution before anything is sent.\n\nDisclosure to speak: Freedom Paws may earn a commission if you use a partner link. The partner sells the product or provides the coverage or the consult. Freedom Paws does not. This is not veterinary treatment. Ask your own veterinarian about your dog.',
      doNot:
        'Do not queue this in Studio today. Do not name a second brand. Do not say a cure, a diagnosis, a reunion rate, or a give-back percent.',
      doneWhen: 'One signed brand has a rendered piece, and the link it names is already inside an unlock.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason:
        'The tracking URL, the open bank, the disclosure, and the unlock all have to exist before this card leaves Overflow.',
      noteLabel: 'Signed brand, after the four gates are true',
    }),
    seed({
      id: 'orion-oa-signed',
      seat: 'orion',
      lane: 'overflow',
      title: 'Operating agreement signed November 1, 2026. This is a record.',
      draft:
        'The restatement signed November 1, 2026 is the operating agreement of Freedom Paws Wellness LLC. Both date lines read 11/1/2026. Company and Member signatures are Michael K. Corey, Managing Member. It supersedes the agreement entered into as of September 11, 2026. The October 27, 2026 signed PDF stays in the folder. Article 4 cash is $0. Other property is None. The EIN line is blank. Exhibit C is unsigned. Wyoming filed the name correction on October 9, 2026. Amendment ID 2026-006979381. Receipt 005505671.\n\nThis signature does not open an EIN, a company bank, public mode, or a shelter email. Do not mail the agreement to the Wyoming Secretary of State. Do not send it to Bass unless you ask.',
      doNot:
        'Do not sign it again. Do not treat this signature as EIN, bank, public-mode, or affiliate clearance.',
      doneWhen: 'The signed restatement is the company record. This card is not a task.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason:
        'Signed November 1, 2026. The signature does not open an EIN, a bank, public mode, or affiliate links.',
      noteLabel: 'Your note',
    }),
    seed({
      id: 'nest-hold',
      seat: 'nest',
      lane: 'overflow',
      title: 'Tennessee Email 1 stays HOLD.',
      draft:
        'Six shelter drafts already live in docs/marketing/outbox/tn-pilot/. The posting gate is cleared. Scaled Email 1 is still not a send. Do not personalize a send today. A call script can wait in the Calls card. No match-rate promise and no claim that Freedom Paws is the shelter or a government license.',
      doNot: 'Do not send Email 1. Posting clearance is not a partner send.',
      doneWhen: 'The card is held. Nothing left this building.',
      href: '/ops/adoption',
      hrefLabel: 'Adoption partners',
      readyLabel: null,
      blockedReason: 'Scaled shelter Email 1 stays held. Posting clearance does not send it.',
      noteLabel: 'Your note',
    }),
    seed({
      id: 'calls-line',
      seat: 'calls',
      lane: 'overflow',
      title: 'Script for (629) 206-4430. This desk does not dial.',
      draft:
        'Freedom Paws Wellness, this is Michael.\n\nFound dog: a person reviews the report before anyone contacts an owner. Do not confirm a match on the call.\n\nHealth question: this is general education. Their veterinarian decides.\n\nShelter: take a name and a time. Do not send Email 1 from this call.\n\nDo not quote a reunion rate, a give-back percent, or a shop offer.',
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
        'Petco Love, Maddie’s Fund, and ASPCA stay dark until one partner listing is live. The posting gate is cleared. That is not a submission. The July 2026 note said XRPL grant applications were closed — check the site before treating any draft as current.\n\nThe story, when you do write it, is the Tennessee pilot, phone-first ID with a human review, and wellness education that is not a diagnosis. No welfare-grant fiction.',
      doNot: 'Do not submit an application from this card.',
      doneWhen: 'The narrative is accepted as a hold file, not an application.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'No live partner listing. Submit stays off. Posting clearance is not a grant filing.',
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
