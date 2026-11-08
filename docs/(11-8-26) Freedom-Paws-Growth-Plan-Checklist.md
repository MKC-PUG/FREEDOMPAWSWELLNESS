# Freedom Paws — from the October 31 roadmap to the growth plan

Checklist dated November 8, 2026. Source of the sequence: the November 7, 2026 valuation and income plan. Status of the starting point: the October 31, 2026 launch roadmap.

This is the build. It ends in November 2027, when a shelter can be invoiced, an adopter can claim a dog that was enrolled at intake, and a membership renews on the card already on file. After that the work repeats: acquire, activate, retain, collect. A clinic seat is the only later build, and only if the year-3 profit test is met. Years 4 and 5 add no product.

Hours are founder time, one person, doing the engineering and the outreach. Waiting on the IRS, a bank, counsel, or an affiliate program is calendar time and is labeled separately. If the EIN or the bank slips, slide every later date by the same number of weeks. Do not catch up by spending the ad budget early.

## Summary

The app already has the scan, the ten protocols, the vault, the consult link, the Tennessee directory, found-dog intake, chip-number entry, and the partner pages. The October 31 roadmap was still opening the company: EIN, bank, a one-dollar charge into the LLC, then public mode, then one shelter email.

The growth plan changes that order in four ways.

- The first product to sell is an annual membership at $79 through February 28, 2027, then $99. The $18 lifetime protocol stops being the offer. A $12 monthly plan and a $29 twelve-month single-protocol pass exist so a conversation can still close.
- A payment is finished only when a second device shows the membership with no manual step. The browser flag used today does not count.
- Shelters and rescues, municipal and private, are the distribution door. The seat fee is small. The build that matters is enrolling the dog at intake and having the adopter claim that record. A hardware scanner is not part of this build.
- SuperBud is the face of five posts a week that point at the free scan. Paid video tools stay off. The photo booth stays unpublished.

Counted product work from here to the November 2027 finish is about **160 hours**, spread across the year, plus about **8 hours a week** of outreach, posts, and a look at the numbers. November 2026 itself is about **55 hours** plus the IRS and bank wait.

## Already in place

- Counsel’s October 26 terms, privacy, biometric consent, and diagnostics disclaimer are posted. The October 28 posting gate is cleared.
- ViT, ten protocols, vault, consult share, label scan, training week, daily log, and the hazard list are in the app.
- Freedom Paws ID enroll, found-dog intake, shelter dashboard, and chip-number scan for a logged-in user are in the app.
- Tennessee adoption directory and partner standards for insurance and telehealth are in the app.
- Stripe can open a checkout session. Xaman can take a payment. Neither writes a server entitlement.
- Affiliate, insurance, and telehealth links stay off until a partner URL exists and the bank can receive the commission.

## Stop, from the October 31 roadmap

- Stop the $18 lifetime protocol as the thing the shop asks people to buy.
- Stop paid HeyGen, Runway, and similar studio spend. Phone clips from protocols already written are the content.
- Stop the token-shop video and the wellness-partners video until a membership is the thing they point at.
- Do not order scanner kits. Do not build a hardware business this year.
- Do not turn on photo-booth checkout, ViT Pro billing, token minting, hosted cameras, or a second full-time hire.
- Do not submit a research grant that describes the scan as a diagnosis.
- Leave n8n off until reminder volume needs it. The day-7 note and the reorder note can go out through Resend.
- Leave the 10% give-back sentence off the site.

## Weekly rhythm, from December 2026 until the build is finished

- Five vendor-ledger moves and no more. About 2.5 hours. Brands on hold stay off email: Open Farm, Whimzees, Ruffwear, Native Pet, Walkin’ Pets, Help ’Em Up, North Hound Life, miNATURALS.
- Five shelter or rescue conversations, municipal and private. About 2.5 hours.
- Five public posts. One useful step from a protocol, SuperBud may host, link to the free scan. No sentence that says the scan found a condition. About 2.5 hours.
- Ad cost, OpenAI bill, and cash. About 30 minutes.

Raise ads to the next step only when the prior month hit at least 70 percent of its new-member target and an ad-acquired member cost under $100. If that fails, repeat the month’s task list and hold the prior ad budget.

---

## 1. November 8–30, 2026 — the cash register

The month is done when a real card payment creates a membership that appears on a second device. No members and no ad spend are required.

- File the EIN for Freedom Paws Wellness LLC. Responsible party as already named on the October 31 roadmap. About 1 hour. IRS wait is often one to four weeks. Save the CP 575.
- Open the bank account in the LLC’s name after the CP 575 arrives. About 2 hours, plus several business days of bank wait. Book any founder advance. Confirm the account can receive an affiliate commission. This is the gate on every partner link.
- Create Stripe products: Founding Annual $79, Annual $99 hidden until March 1, Monthly $12, Protocol Pass $29. About 3 hours.
- Add one Stripe webhook that writes the entitlement on the server, tied to the account. Remove the path that unlocks from the success URL alone. About 16 hours.
- Run a live one-dollar charge into the LLC, then the real membership price in test or live as Stripe allows. Open the same account on a second device and confirm the membership is there with no manual step. About 3 hours.
- Do the same write for an Xaman payment. A signed payload that only sets a browser flag is not a sale. About 10 hours.
- Put the free ViT scan behind an email, limit a free account to one run, and show the membership immediately after the result. Members get eight ViT runs and eight label scans a month. About 10 hours.
- Fix the public photo path the October 31 roadmap already flagged: the in-browser upload worked on the phone check, and the server temporary-file path did not. A public scan invite uses the path that worked. About 6 hours.
- Retire $18 lifetime as the primary shop offer. The page offers the annual membership first. The pass is the side door. About 6 hours.
- Put the commission disclosure that already exists in the product on every page that will hold a partner link. About 3 hours.
- Ask counsel to look at two checkout sentences before they are shown: a 14-day refund on the annual plan, and the line that the membership is education and tools. About 1 hour to send. Counsel’s review is their clock. Do not rewrite the posted terms beyond those two sentences.
- Request two quotes for technology and professional liability insurance. About 2 hours. Buy the policy in February, not this month.
- Send the RippleX invitation form with a demo of membership checkout, including Xaman, and a one-page note that the milestone is server entitlements and on-ledger settlement of the same price. About 2 hours. Count $0 until an award is in the bank. Ask XRPL Commons when the next Aquarium cohort opens. About 30 minutes.
- Turn paid video production off. December’s content is a phone clip and a paragraph from a protocol already written. Decision, same day.

November build time: about 55 hours, plus IRS, bank, and counsel waits.

## 2. December 2026 — first cash

Ads of $350 stay locked until five real memberships have cleared. If they have not, December is the organic line only, and January picks up the same ads.

- Turn founding checkout on in public. Flip `NEXT_PUBLIC_SITE_MODE=public` only after the one-dollar charge is in the LLC and the second-device test has passed. Audit Framer buttons the same week. About 3 hours.
- Post once each weekday. One useful step, a link to the free scan, SuperBud may speak it. About 30 minutes a post, 2.5 hours across the week, already inside the weekly rhythm.
- Write personally to 30 Tennessee shelters and rescues, municipal and private. The ask is a conversation and a look at the directory and ID enrollment. Mention the 90-day free seat that starts in May. About 8 hours across the month.
- Keep the five vendor moves a week. Honest Kitchen, Pets Best, West Paw, and Vetster come first, then the next rows that are not on hold. Pets Best and Vetster are the priority because one payout is larger than a protocol sale.

## 3. January 2027 — links that have actually been approved

- Follow up every affiliate application that has gone quiet. About 2 hours.
- The week a program approves a tracked link, and the bank gate is open, place that link on the matching protocol and nowhere else. About 1 hour per program.
- Seven days after each purchase, send one email: one care step from the protocol they use, and a partner link only when one is honestly relevant. About 4 hours to set the template, then a few minutes per member.
- Ask ten early buyers for one sentence that can be shown, with permission. About 2 hours.

## 4. February 2027 — founding price ends, insurance starts

- In the last week of February, email everyone who has scanned or bought and say the founding price ends February 28. About 2 hours.
- Bind the technology and professional liability policy quoted in November. About 2 hours, plus the insurer’s clock. Planning cost $200 a month from this month.
- Raise ads from $350 to $700 only if December and January together reached at least 15 memberships and ad cost per member is under $100. Turn off any ad set that has spent $150 without a member under $120. About 2 hours to read and change the campaigns.
- Open paperwork for the first shelter pilot, at no charge, for 90 days, aimed at a May start. Municipal or rescue. About 4 hours.

## 5. March 2027 — one annual price

- On March 1, the $99 annual plan is the only annual plan on the page. Retire founding checkout. About 2 hours.
- Reconcile affiliate clicks against deposits once a week. A program that cannot report has its link removed. About 30 minutes a week.

## 6. April 2027 — read the first 90 days, add no feature

- Start a monthly bookkeeping close. About 3 hours to set up, then about 2 hours a month.
- Read members, refunds, ad cost, OpenAI cost, and which protocol people buy the pass for. About 3 hours.
- Put the next shelter pilot dates on a calendar. About 1 hour.
- Add no feature. The library is already larger than the audience.

## 7. May 2027 — first shelter pilot and the intake handoff

This is the build that makes a shelter worth using on every dog that comes in. The dog is enrolled at intake. At adoption, the new owner claims that record and lands on the free scan with the shelter’s name attached. The scanner they already own can supply a chip number. A Freedom Paws hardware kit is not required.

- Go live with the first pilot on the tools that already exist: enroll, list, found-dog photo. About 6 hours of onboarding with the shelter.
- Build the intake-to-adopter claim: a shelter record created before there is an owner, and a claim step that opens the owner account. About 24 hours.
- Build the $20 referral credit before the month ends. The member who brings a paying member receives $20, and the new member receives $20 off. Cap it at $20 if it gets popular. About 12 hours. It ships in June.

## 8. June 2027 — referrals on, second pilot

- Turn the referral credit on. About 2 hours of checking the May build against a real pair of accounts.
- Open a second shelter pilot, municipal or rescue. About 6 hours.

## 9. July 2027 — the reorder note

- Ship the care-reminder email. A member who logged a food or a supplement gets a reorder note on a sensible cadence, with the disclosed partner link. About 16 hours.
- If this email slips, the affiliate line in the plan uses the downside rate until it is live.

## 10. August 2027 — aim the posts

- Open a third pilot shelter. About 6 hours.
- Read which two protocols produce the pass and the membership. Point the posts and the ad tests at those two. The other eight stay in the library. About 3 hours.

## 11. September 2027 — the paid seat and the renewal note

- Draft the paid shelter agreement at $69 a month, starting when that org’s 90-day pilot ends. About 4 hours, plus counsel if the draft needs a review.
- Draft the renewal email the December 2026 cohort receives in November, 30 days before the year is up. One-click renewal at $99. No new discount. About 3 hours of copy. The billing build is the next block.

## 12. October 2027 — close year 1 on paper

- Compare actual members with 316, affiliate deposits with about $2,100, and ad cost per member with $70 to $85. About 3 hours.
- Sign the first shelter onto the paid seat for November if the pilot produced even a handful of owner signups. If it produced none, extend the pilot once and do not invoice. About 2 hours.
- Finish renewal billing: ask 30 days ahead, charge the card already on file, send a receipt, and offer a one-click cancel. About 16 hours. First use is November.

## 13. November 2027 — the build is complete

- Invoice the first shelter at $69. Keep two or three orgs in a free pilot so the next paid seats have a pipeline. About 3 hours.
- The new-adopter handoff from May is in use on the paid seat, with the shelter’s name on the free scan. About 2 hours to confirm it on a real adoption.
- Renewal billing is on for the December cohort. About 1 hour to confirm the schedule.

Product work for the growth plan ends here. About 160 hours from November 8, 2026.

## 14. December 2027 through April 2028 — run the machine, then one hire

These months are operating time, about 8 hours a week, plus the items below. No new product.

- December 2027. The first renewal cohort is due. Renew them personally while the list is small enough to write to. About 3 hours. If renewal on this cohort is under 45 percent, freeze ad increases until the reason is known.
- January and February 2028. Move shelters to $69 as their pilots end. The plan’s paid-org count is 2, then 2, then 3 in March, then 4 in April. Onboarding a shelter from the checklist is about 6 hours each.
- February 2028. Take the $3,000 draw only after two consecutive months of operating profit above $5,000 and cash above $10,000. If February misses the rule, take nothing.
- March 2028. Write the contractor description: member email within one business day, shelter onboarding from a checklist, reminder sequence. About 2 hours. Do not hire yet unless the profit and cash rule is already met.
- April 2028. Fourth paid shelter. Last month of the hard $1,500 cap. Hire the contractor at $2,200 a month only if the founder draw has started, operating profit is above $8,000, and cash is above $20,000. Hand them the inbox and the shelter checklist. The founder keeps ads, partner relationships, and what the scan is allowed to say.

## 15. After the build — only if the test is passed

- May through July 2028. Once a week, read ten scan transcripts against the disclaimer. Anything that sounds like a diagnosis gets the prompt tightened that week. About 1 hour a week.
- August through October 2028. Write the November 2028 shelter price of $99 for new agreements. Existing $69 agreements step up when they renew. About 2 hours. Nine paid shelters is the October target.
- November 2028 through April 2029. The work that makes the month true is the 30-day renewal note and the quality of the shelter-to-owner handoff. Open no new product line in this window.
- May through October 2029. If operating profit has been above $20,000 for three straight months, write a one-page clinic offer: the consult packet the product already creates, plus a shared link, at $49 a month. Show it to five clinics. About 4 hours to write. Build it, about 20 hours, only if those five say they would pay. ViT Pro stays out of that offer.

## Standing rules

- Free scan, one run, email required, from the November launch of the membership.
- Member allowance, eight ViT runs and eight label scans a month.
- Card and Xaman are the same price. The entitlement is a row on the server either way.
- Links stay off until the bank can receive the commission and the disclosure is on the page.
- Ads obey the $100 cost rule. Through April 2028 the tools, legal, insurance, bookkeeping, and ads together stay at or under $1,500. Variable OpenAI and card fees sit outside that cap.
- Inventory, a scanner product, photo-booth checkout, token minting, and a diagnosis claim stay out.
