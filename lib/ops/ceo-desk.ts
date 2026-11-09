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
      id: 'stripe-webhook',
      seat: 'orion',
      lane: 'priority',
      title: '1. Add the Stripe webhook.',
      draft:
        'The membership code is already on the site. The tables entitlements and scan_usage already exist in the Supabase project freedom-paws-id. This card turns on the listener.\n\n1. Open the Stripe dashboard for Freedom Paws. Turn on Test mode.\n2. Open Developers, then Webhooks, then Add endpoint.\n3. Endpoint URL: https://app.freedompawsinc.com/api/stripe/webhook\n4. Subscribe to checkout.session.completed, customer.subscription.updated, and customer.subscription.deleted.\n5. Copy the signing secret.\n6. In the Vercel project for the app, add STRIPE_WEBHOOK_SECRET and paste that secret. Leave the live-mode webhook until the LLC bank is the payout account.',
      doNot: 'Do not turn on public mode. Do not take a live charge from this card.',
      doneWhen: 'The test endpoint exists and STRIPE_WEBHOOK_SECRET is saved in Vercel.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll add the webhook',
      blockedReason: null,
      noteLabel: 'Secret saved on',
    }),
    seed({
      id: 'stripe-test-prices',
      seat: 'orion',
      lane: 'priority',
      title: '2. Create the four prices in Stripe test mode.',
      draft:
        'Stay in Stripe test mode.\n\n1. Add Founding Annual Membership at $79, one time. Copy the price ID.\n2. Add Annual Membership at $99, one time. Copy the price ID. The shop hides this price until May 1, 2027.\n3. Add Monthly Membership at $12, recurring every month. Copy the price ID.\n4. Add Protocol Pass at $29, one time. Copy the price ID.\n5. In Vercel, save them as STRIPE_PRICE_FOUNDING_ANNUAL, STRIPE_PRICE_ANNUAL, STRIPE_PRICE_MONTHLY, and STRIPE_PRICE_PASS.',
      doNot: 'Do not create these in live mode. Do not bring back the $18 lifetime price.',
      doneWhen: 'All four products are visible in test mode and the four price IDs are in Vercel.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll create the prices',
      blockedReason: null,
      noteLabel: 'Price IDs saved on',
    }),
    seed({
      id: 'stripe-test-card',
      seat: 'orion',
      lane: 'priority',
      title: '3. Prove the membership on a second device.',
      draft:
        'Use the test card. The live one-dollar charge waits until the LLC bank is the Stripe payout account.\n\n1. Sign in on the preview and open founding annual checkout.\n2. Pay with 4242 4242 4242 4242, any future expiration, any three-digit code, and ZIP 82801.\n3. In Supabase, project freedom-paws-id, open entitlements. Confirm a row for that account, plan founding annual, ending about twelve months out.\n4. Sign out. Open a second phone or a private window. Sign in with the same account. Do not copy browser storage.\n5. Confirm the membership shows.',
      doNot: 'Do not use a real card. Do not treat the success page, by itself, as the proof.',
      doneWhen: 'The second device shows the membership, and the note has the date.',
      href: '/token-shop',
      hrefLabel: 'Open the shop',
      readyLabel: 'I’ll run the test card',
      blockedReason: null,
      noteLabel: 'Second device confirmed on',
    }),
    seed({
      id: 'counsel-checkout-sentences',
      seat: 'orion',
      lane: 'priority',
      title: '4. Ask Bass to read two checkout sentences.',
      draft:
        'Email Bass, Berry & Sims, the lawyers already on the Tennessee-pilot file. Send only these two sentences and ask whether they can appear on checkout: the annual plan may be refunded within 14 days, and the membership is education and tools.\n\nDo not change /terms or /privacy while you wait. Save the reply next to the October 26 return. Show the sentences on checkout only if they say the sentences can be shown.',
      doNot: 'Do not rewrite the posted terms from this card. Do not put the sentences on the shop before they reply.',
      doneWhen: 'The email is sent, and the note has the date. Their answer is filed when it arrives.',
      href: null,
      hrefLabel: null,
      readyLabel: 'I’ll send the email',
      blockedReason: null,
      noteLabel: 'Sent on',
    }),
    seed({
      id: 'december-topics',
      seat: 'echo',
      lane: 'priority',
      title: '5. Write December’s five post topics.',
      draft:
        'Write five topics for December. Each one is a step from a protocol already written. Each one closes on the free scan. No shop link. No paid studio render. Health pieces tell the owner to call their own veterinarian.',
      doNot: 'No Token Shop video. No Wellness Partners video. No affiliate link, 10% line, reunion rate, or diagnosis.',
      doneWhen: 'The five topics are written, and no studio render is scheduled.',
      href: '/ops/desk',
      hrefLabel: 'Open Studio',
      readyLabel: 'I’ll write the five topics',
      blockedReason: null,
      noteLabel: 'Topics filed on',
    }),
    seed({
      id: 'ein-january-2027',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. File the EIN on January 1, 2027.',
      draft:
        'If the date is before January 1, 2027, stop.\n\nOn that day, during IRS online hours, apply at irs.gov for a new limited liability company. Legal name Freedom Paws Wellness LLC, formed in Wyoming on September 11, 2026. Responsible party Michael Kevin Corey. Address 30 North Gould Street, Suite R, Sheridan, WY 82801. Phone (629) 206-4430. Download the CP 575 the moment it is offered and save it in the Legal folder.',
      doNot: 'Do not file before January 1, 2027. Do not open the bank from this card. Do not send the CP 575 to anyone except the bank.',
      doneWhen: 'The CP 575 is a file you can open, and the note has the date.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card stays closed until January 1, 2027.',
      noteLabel: 'CP 575 saved on',
    }),
    seed({
      id: 'bank-open',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. Open the bank the week the CP 575 is saved.',
      draft:
        'Planning date: January 31, 2027. If the letter is not saved, do not open the bank and do not start the February selling steps.\n\nOpen the account in the name Freedom Paws Wellness LLC. Then book the founder advances as reimbursement or as capital. The live $1 is the card after this one.',
      doNot: 'Do not open this before the CP 575 is saved. Do not title the account in your personal name. Do not sell on January 1.',
      doneWhen: 'The account is open, the advances are booked, and the note has the date.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits on the CP 575. Planning date January 31, 2027.',
      noteLabel: 'Bank opened on',
    }),
    seed({
      id: 'stripe-one-dollar',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. Take a live $1 into the LLC bank.',
      draft:
        'The test card is box 3 and does not use this card. After the LLC bank is the Stripe payout account, switch Stripe to live mode, run one $1 payment with a real card, and confirm the $1 landed in Freedom Paws Wellness LLC. Leave the $1 there.',
      doNot: 'Do not point Stripe at a personal account. Do not take the live $1 before the bank is the payout account.',
      doneWhen: 'The $1 is visible in the LLC account.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits on the company bank.',
      noteLabel: '$1 received on',
    }),
    seed({
      id: 'public-mode',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. Turn on public mode.',
      draft:
        'Set NEXT_PUBLIC_SITE_MODE=public on Vercel. Publish Framer. Run the six-tap iPhone check. Send waitlist email number 1. The soft social line is: start in the app.',
      doNot: 'Do not flip public mode on the day the bank login arrives. The $1 and the second-device unlock come first.',
      doneWhen: 'Public mode is on, Framer is published, and the six-tap check passed.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits on the $1 in the LLC. Planning case: the first week of February 2027, the week the bank is open.',
      noteLabel: 'Public mode on',
    }),
    seed({
      id: 'care-honest-kitchen',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. Honest Kitchen, in the public-mode week.',
      draft:
        'Do not submit this until public mode is on and the LLC bank is open.\n\nThen open https://www.thehonestkitchen.com/pages/partner-with-us. Use the AFFILIATES application. Do not use the CREATORS application.\n\nPaste: Freedom Paws Wellness LLC. Michael Corey, Managing Member. partners@freedompawsinc.com. (629) 206-4430. Website https://app.freedompawsinc.com. Dog wellness education app. Not a clinic and not a store. No public traffic number. The tracking link will be placed only on a page that shows the commission disclosure.\n\nDo not email questions@thehonestkitchen.com.',
      doNot: 'Do not promise a live page, a give-back percent, or a user count. Do not say the bank cannot receive a commission.',
      doneWhen: 'The affiliates form is submitted in the public-mode week, or the note says the form was missing.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits until the week the bank is open. Planning case: the first week of February 2027.',
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'care-pets-best',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. Pets Best, in the public-mode week.',
      draft:
        'Do not submit this until public mode is on and the LLC bank is open.\n\nThen open https://www.petsbest.com/forms/affiliates. The program page is https://www.petsbest.com/affiliates.\n\nSame identity as Honest Kitchen. The app would use three private links only: a quote, a lost-dog page, and an urgent-care page. You are asking to join the program. The tracking link will be placed only on a page that shows the commission disclosure.\n\nPhone on their page, if a person must talk: 1-888-217-2731. You place the call. This desk does not dial.',
      doNot: 'Do not promise a live marketplace placement. Do not invent a monthly visitor number.',
      doneWhen: 'The form is submitted in the public-mode week, and the note says so.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits until the week the bank is open. Planning case: the first week of February 2027.',
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'care-west-paw',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. West Paw, in the public-mode week.',
      draft:
        'Do not apply until public mode is on and the LLC bank is open.\n\nThen open https://www.westpaw.com/pages/affiliate-program and read the 6-month site rule. Open https://www.avantlink.com/signup/affiliate, choose United States, and create the publisher account with partners@freedompawsinc.com. Use the EIN and the LLC bank if the form asks for tax or payout. Inside AvantLink, apply to West Paw.\n\nAfter the application is in, send this from partners@ to affiliates@westpaw.com.\n\nSubject: Affiliate application — Freedom Paws Wellness LLC\n\nHello,\n\nI applied to the West Paw affiliate program through AvantLink as Freedom Paws Wellness LLC. The property is https://app.freedompawsinc.com, a dog wellness education app. We are not a clinic and not a store. I am asking for a tracking link if you approve the application. The link will be placed only on a page that shows the commission disclosure.\n\nMichael Corey\nManaging Member\nFreedom Paws Wellness LLC\npartners@freedompawsinc.com\n(629) 206-4430',
      doNot:
        'Do not promise a page, a give-back percent, or traffic you do not have. If they decline on the 6-month rule, write declined in the note.',
      doneWhen: 'The AvantLink application is submitted and the email is sent from partners@.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits until the week the bank is open. Planning case: the first week of February 2027. Their page still requires a site active at least 6 months.',
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'care-vetster',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. Vetster, in the public-mode week.',
      draft:
        'Do not submit this until public mode is on and the LLC bank is open.\n\nThen open https://vetster.com/en-us/affiliates and click Join now. Use the same identity as Honest Kitchen. Freedom Paws would describe them as a licensed telehealth booking option. The tracking link will be placed only on a page that shows the commission disclosure.\n\nDo not email support@vetster.com to apply.',
      doNot: 'Do not call Vetster our holistic vet. Do not promise the booking button is already on the app.',
      doneWhen: 'Join now is submitted in the public-mode week, and the note says so.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits until the week the bank is open. Planning case: the first week of February 2027.',
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'care-branch-basics',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. Branch Basics, in the public-mode week.',
      draft:
        'Do not submit this until public mode is on and the LLC bank is open.\n\nThen open https://branchbasics.com/pages/partnerships and click the apply-now link. Their ambassador tier asks for 1,000 followers and for you to be a Branch Basics user in the US or Canada. Write the true follower number. If you are under 1,000 and the form will not take a lower number, stop and write “follower gate” in the note.\n\nIf the apply link is missing, send one email from partners@ to partnerships@branchbasics.com with the same facts as the West Paw note, plus the true follower count. Do not email info@branchbasics.com.',
      doNot: 'Do not invent a follower count. Do not promise a live page or a give-back percent.',
      doneWhen: 'The form is submitted, the one backup email is sent, or the note says the follower gate stopped you.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits until the week the bank is open. Planning case: the first week of February 2027. A follower count under 1,000 can still stop this card.',
      noteLabel: 'Confirmation or what blocked you',
    }),
    seed({
      id: 'shelter-email-send',
      seat: 'nest',
      lane: 'overflow',
      title: 'Next. Send one shelter Email 1.',
      draft:
        'After public mode, send one Email 1 from shelter@ to Memphis or whichever organization is actually ready. Log it. Organizations 2 through 6 stay in the outbox.',
      doNot: 'Do not send the other five from this card. Do not send before public mode.',
      doneWhen: 'One Email 1 is sent and logged.',
      href: '/ops/adoption',
      hrefLabel: 'Adoption partners',
      readyLabel: null,
      blockedReason: 'This card waits until public mode, the week the bank is open. Planning case: the first week of February 2027.',
      noteLabel: 'Sent to / logged on',
    }),
    seed({
      id: 'one-listing',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. One partner listing.',
      draft:
        'Do the 20-minute onboarding. Create the shelter admin login. Get one Available listing on /adopt/tn/... or a trained found-dog intake.',
      doNot: 'Do not expand past the first partner from this card.',
      doneWhen: 'One public listing is live, or the training notes are saved.',
      href: '/ops/adoption',
      hrefLabel: 'Adoption partners',
      readyLabel: null,
      blockedReason: 'This card waits on the one sent Email 1.',
      noteLabel: 'Listing URL or training date',
    }),
    seed({
      id: 'grant-submit',
      seat: 'grant',
      lane: 'overflow',
      title: 'Next. Submit the grant after one listing is live.',
      draft:
        'Submit only after the EIN exists and one listing is live. The application states the real stage of the pilot. Petco-style applications are a later planning year.',
      doNot: 'Do not submit from the writing card above. Do not invent a welfare program.',
      doneWhen: 'One honest application is submitted, and the note has the date.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason: 'This card waits on the EIN and one live listing.',
      noteLabel: 'Submitted on',
    }),
    seed({
      id: 'vendor-media-hold',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. Vendor media, after one signed brand is inside an unlock.',
      draft:
        'Open Studio only after all four are true for that one brand:\n1. The tracking URL is in the Care-support list note.\n2. The company bank is open and can receive the commission.\n3. The disclosure is on the same page as the link.\n4. The link sits inside an unlock.\n\nThen one brand per video. FACT writes the source card from the signed program. BUD writes a 30–45 second script from the locked still and the locked voice. He names that one brand, says the disclosure out loud, and ends by telling the owner to call their own veterinarian. LEX checks the script. You click Approve script and render. ECHO writes the caption with the wellness disclaimer and the commission disclosure. The caption path is the in-app page. No raw tracking URL. You click Hand to SuperBud, then you approve it on Distribution before anything is sent.\n\nDisclosure to speak: Freedom Paws may earn a commission if you use a partner link. The partner sells the product or provides the coverage or the consult. Freedom Paws does not. This is not veterinary treatment. Ask your own veterinarian about your dog.',
      doNot:
        'Do not queue this in Studio today. Do not name a second brand. Do not say a cure, a diagnosis, a reunion rate, or a give-back percent.',
      doneWhen: 'One signed brand has a rendered piece, and the link it names is already inside an unlock.',
      href: null,
      hrefLabel: null,
      readyLabel: null,
      blockedReason:
        'The tracking URL, the open bank, the disclosure, and the unlock all have to exist before this card is a task.',
      noteLabel: 'Signed brand, after the four gates are true',
    }),
    seed({
      id: 'n8n-starter-after-bank',
      seat: 'orion',
      lane: 'overflow',
      title: 'Next. n8n Starter, after the other five pilot emails are logged.',
      draft:
        'Let the current n8n trial end. The app keeps running. The 30-day hold on that workspace can end too. Workflows A through I are not built yet, so a later workspace starts empty.\n\nThe clock starts the week the bank opens. About 3 weeks later you send one shelter Email 1 yourself. About 4 weeks later the first partner listing is live. You then send the other five Tennessee pilot emails yourself and log them.\n\nThe week those five are logged, about 6 to 10 weeks after the bank opens, subscribe to n8n Cloud Starter, billed monthly (about €24). Open a new workspace. Paste the Resend and Google keys. Import the workflows. Leave every workflow Inactive.\n\nTurn on Workflow D only for a row you set to Approved=YES. The nightly CRM sync, the weekly KPI note, and the Buffer webhook use that same plan. Keep each run under 5 minutes.',
      doNot:
        'Do not subscribe the week the bank opens. Do not buy Pro, Business, or an annual plan. Do not set a workflow Active from this card.',
      doneWhen:
        'The note has the date the five emails were logged and the date Cloud Starter monthly was turned on. Workflows are still Inactive except a row you set to Approved=YES on purpose.',
      href: '/ops/marketing',
      hrefLabel: 'Marketing',
      readyLabel: null,
      blockedReason:
        'The bank opening starts the clock. Subscribe the week the other five pilot emails are logged.',
      noteLabel: 'Five emails logged on / Starter subscribed on',
    }),
    seed({
      id: 'proof-smoke',
      seat: 'proof',
      lane: 'overflow',
      title: 'When it happens. iPhone smoke: ViT, Photo Booth, and ID enroll.',
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
      title: 'When it happens. info@ draft. You read the mail. You send the reply.',
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
      title: 'On file. Care-support list and disclosure. Do not publish.',
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
      id: 'orion-oa-signed',
      seat: 'orion',
      lane: 'overflow',
      title: 'On file. Operating agreement signed November 1, 2026.',
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
      id: 'calls-line',
      seat: 'calls',
      lane: 'overflow',
      title: 'When it happens. Script for (629) 206-4430. This desk does not dial.',
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
      id: 'orion-l5-cleared',
      seat: 'orion',
      lane: 'overflow',
      title: 'On file. L5 posting gate is cleared. Do not send another counsel email.',
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
      id: 'id-watch',
      seat: 'id',
      lane: 'overflow',
      title: `When it happens. Match queue: ${pendingReviews} waiting on a person.`,
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
