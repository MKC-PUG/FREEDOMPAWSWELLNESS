# UPDATED 10/24/26

# SuperBud page — click-by-click manual

**Title:** UPDATED 10/24/26  
**Page:** SUPERBUD  
**URL:** https://app.freedompawsinc.com/ops/marketing  
**Entity:** Freedom Paws Wellness LLC (Wyoming)  
**Audience:** Michael Corey, Founder, CEO, and sole operator  
**Classification:** Internal. Not legal, tax, financial, or veterinary advice.

This is the operating copy for the SuperBud page. The same text sits at the top of that page. A PDF of this file is `docs/(UPDATED 10-24-26) Freedom-Paws-SuperBud-Page-Click-by-Click-Manual.pdf`.

The page drafts, holds an approval, and can hand an approved caption to Buffer. You still publish. While L5 is open, the pieces you may move are educational: Adoption Network, Freedom Paws ID, ViT Diagnostics, My Pets Vault, Photo Booth, and Mission and Veterans. Wellness Partners and Token Shop stay untouched. Workflows A through I stay unchecked.

---

## 1. Open the page

1. Open https://app.freedompawsinc.com/login?next=/ops/marketing
2. Sign in with the fp_ops account.
3. In the nav bar, click **SUPERBUD**.
4. Confirm the title is **SuperBud (Distribution)**.
5. Confirm this manual is the first block on the page.
6. Read the gold line under the manual. Video production is **Studio (Production)** at `/ops/desk`. This page distributes: draft cards, Approve, and Send to Buffer. Member email on this page is closed.

If an amber line says to run `supabase/migrations/015_social_posts.sql`, open the Supabase project **freedom-paws-id**, SQL Editor, paste that file, run it once, then hard-refresh this page. The pillar buttons stay grey until that table exists.

---

## 2. How the page is laid out

Work top to bottom.

| Block | What you click |
| --- | --- |
| This manual | Read it. Download PDF if you want the file. |
| Gold Studio line | **Studio (Production)** opens `/ops/desk`. |
| SuperBud social dashboard | Counts only. No button. |
| Generate draft | Pillar, platform, then one of two create buttons. |
| Pipeline | A post card on the left. Review and action buttons on the right. |
| Production studio — step-by-step | Numbered list, then one card per outside tool. |
| Email automation note | Read it. The toggles below do not send mail. |
| Global gates | **Emergency stop** and **Master marketing enabled**. |
| n8n workflows | Letters A through I. |
| TN pilot partner approvals | A note. The approval checkbox lives on ADOPTION. |
| Workflow reference | Names for A through I. |
| Local tooling | Two Mac commands. This page does not run them. |

---

## 3. Counts, badges, and the words on a card

The dashboard row is **Total**, **In draft**, **Needs approval**, **Approved**, **Scheduled**, **Posted**.

**In draft** counts posts marked draft and posts marked needs approval. **Needs approval** counts only the second of those. One submitted post can raise both numbers.

| Badge | Status on the post |
| --- | --- |
| Dormant | Draft, or archived |
| Needs attention | Submitted for approval |
| Ready | Approved, or scheduled |
| Active | Posted |
| Blocked | Failed |

The pipeline list shows the pillar, then the platform. An X post shows the letter `x` in that list. The platform button itself says **X**.

The right-hand card shows the title, the badge, a **CTA** link, **Caption**, **Script**, and **Storyboard**. Those three boxes are for reading. There is no edit field on this page. If the words are wrong, click **Archive** and create the draft again.

The caption that Buffer receives is the caption on this card. Polish the video elsewhere, and change this caption by generating a new card before you click **Approve**.

---

## 4. Shared clicks for every social piece

Use this path for each pillar in sections 5 through 12, after you have clicked that pillar and one platform.

1. Click **Create SuperBud template** when you want the locked template. It does not call an outside model.
2. Click **Generate draft (AI)** when you want a rewrite. If `OPENAI_API_KEY` is missing or the call fails, the card is still the template, and the green line still says **Generate draft OK**.
3. A new card appears at the top of **Pipeline**. Click it.
4. Click the **CTA** link. Confirm it opens the path named in that pillar’s section. Close the tab and return here.
5. Read **Caption**, **Script**, and all three storyboard beats.
6. Reject the card when the caption contains a diagnosis, a cure, a prescription, “AI vet”, “detects disease”, a reunion rate, a guaranteed reunion, “match live nationally”, “shop now”, “buy now”, FDA, or AAFCO. Click **Archive**. The badge becomes **Dormant**. Create another draft.
7. Click **Submit for approval**. The badge becomes **Needs attention**.
8. Read the caption once more.
9. Click **Approve**. The badge becomes **Ready**. This writes an audit row. Nothing is public yet.
10. Finish the video with the tool clicks in section 14 if this piece is a video. Return to this card when the cut matches the script.
11. Click **Send to Buffer**. The button stays grey until the badge is **Ready** from Approve or from a previous send.
12. Read the green or red line above **Generate draft**.
13. **Send to Buffer OK (dry-run — set BUFFER_WEBHOOK_URL for live Buffer)** means the caption was stored and the badge is **Ready** under Scheduled. Buffer did not receive it.
14. **Send to Buffer OK** with no dry-run means the webhook accepted the payload. Open Buffer and confirm the draft in the Freedom Paws Wellness channel for that network.
15. A red line and badge **Blocked** means the webhook refused the post. Read the line. Fix the webhook. Select the card. Click **Approve** again if the badge is no longer Ready. Click **Send to Buffer** again.

**Emergency stop** does not grey out **Send to Buffer**. The stop covers workflows A through I.

---

## 5. Adoption Network · TN

**Button:** Adoption Network · TN  
**CTA you must see:** https://app.freedompawsinc.com/adopt/tn  
**Platforms for this piece:** instagram, tiktok, facebook, **X**. YouTube is on the page if you need a longer cut. Click one platform per card. One card is one network.

This piece introduces the Tennessee directory. It may say municipal and private rescues share one directory. It may point at a live listing.

1. Click **Adoption Network · TN**. The pill turns gold.
2. Click one platform pill: **instagram**, **tiktok**, **facebook**, or **X**.
3. Follow section 4 from the create button through **Send to Buffer**.
4. In the caption, keep the promise inside the directory: people browse listings. Freedom Paws does not take custody, finish the adoption, or promise the dog is still there on arrival.
5. Leave shelter Email 1 on HOLD. This post is not that email.

**Done when:** One card for the network you chose is Scheduled, or you archived it and the note in your own day says this was not today’s post.

---

## 6. Freedom Paws ID

**Button:** Freedom Paws ID  
**CTA you must see:** https://app.freedompawsinc.com/id  
**Platforms:** instagram, tiktok, youtube, **X**. Facebook is available on the page for a feed post.

This piece teaches enroll, a found-dog report, and why a record can outlast a tag.

1. Click **Freedom Paws ID**.
2. Click **instagram**, **tiktok**, **youtube**, or **X**.
3. Follow section 4.
4. The caption may send a finder to keep the dog safe and to use the found-dog flow. A person reviews a possible match before anyone contacts an owner.
5. Archive any line that quotes a reunion rate, promises a reunion, or calls the ID a government license.

**Done when:** The approved caption matches that limit and **Send to Buffer** has returned a green line.

---

## 7. ViT Diagnostics

**Button:** ViT Diagnostics  
**CTA you must see:** https://app.freedompawsinc.com/diagnostics  
**Platforms:** instagram, tiktok, youtube, **X**.

This piece shows a calm scan, a plain-language explanation, and a handoff to the owner’s veterinarian.

1. Click **ViT Diagnostics**.
2. Click **instagram**, **tiktok**, **youtube**, or **X**.
3. Follow section 4.
4. Keep a line that this is education and not a veterinary diagnosis. The template already says never to claim a veterinary diagnosis or a guaranteed cure. Leave that limit in the caption.
5. Archive a caption that names a disease as the answer, offers a dose, or says the scan detects disease.

**Done when:** The caption still carries the education limit and the card is Scheduled, or it is archived.

---

## 8. My Pets Vault

**Button:** My Pets Vault  
**CTA you must see:** https://app.freedompawsinc.com/mypets  
**Platforms:** instagram, facebook, **X**. TikTok and YouTube are on the page if the cut needs them.

This piece shows records, notes, and one vault per pet for travel, sitters, and a vet visit.

1. Click **My Pets Vault**.
2. Click **instagram**, **facebook**, or **X**.
3. Follow section 4.
4. Keep the caption on organization. Archive diagnosis, treatment, and shop language.

**Done when:** The card is Scheduled for the network you clicked, or archived.

---

## 9. Photo Booth

**Button:** Photo Booth  
**CTA you must see:** https://app.freedompawsinc.com/photobooth  
**Platforms:** instagram, tiktok, **X**.

This piece shows a portrait, a SuperBud scene, and a share. The suggested tag in the topic catalog is `#SuperBudSelfie`. Repost someone else’s portrait only when you have the right to do so.

1. Click **Photo Booth**.
2. Click **instagram**, **tiktok**, or **X**.
3. Follow section 4.
4. The caption may invite a person to create and share. It stays off diagnosis, reunion, and a shop button.

**Done when:** The card is Scheduled, or you marked the day a rest day and archived the draft.

---

## 10. Wellness Partners

**Button:** Wellness Partners  
**CTA on the template:** https://app.freedompawsinc.com/wellness  
**Platforms on the pillar:** instagram, facebook, youtube, **X**.

Leave this pillar alone until the clearance PDF is saved. Affiliate language, a shop button, and any give-back percent stay off the public site through L5.

On the day that PDF is in the Legal folder, the clicks are:

1. Click **Wellness Partners**.
2. Click one platform.
3. Follow section 4.
4. The caption names the partner only after the agreement is signed, and it includes the disclosure sentence you have already approved.
5. Click **Approve** only after that sentence is in the caption.

Until that day, do not click **Generate draft (AI)** or **Create SuperBud template** on this pillar.

---

## 11. Token Shop

**Button:** Token Shop  
**CTA on the template:** https://app.freedompawsinc.com/token-shop  
**Platforms on the pillar:** instagram, tiktok, **X**.

Leave this pillar alone until L5 is a saved PDF and you have decided the shop may be public. “Shop now” and “buy now” are refused later by the Studio queue. They can still appear in a template on this page, so do not approve them.

On the day the shop is allowed:

1. Click **Token Shop**.
2. Click one platform.
3. Follow section 4.
4. Archive a caption that says shop now, buy now, or states a give-back percent.
5. Click **Approve** only for a caption you would say out loud.

Until that day, do not create a card on this pillar.

---

## 12. Mission and Veterans

**Button:** Mission & Veterans  
**CTA you must see:** https://app.freedompawsinc.com/waitlist  
**Platforms:** instagram, facebook, youtube, **X**.

This piece may invite people to the waitlist. Buddy’s legacy uses the wording you have already approved. It does not invent a birthday episode or a donation total.

1. Click **Mission & Veterans**.
2. Click **instagram**, **facebook**, **youtube**, or **X**.
3. Follow section 4.
4. Confirm the CTA is the waitlist, not a donate link and not the shop.

**Done when:** The card is Scheduled with the waitlist URL, or archived.

---

## 13. Each network

Click the platform pill in **Generate draft** before you create the card. One card carries one network. To cover a second network, create a second card.

### Instagram

1. Click **instagram**. The pill turns gold.
2. Create the card with section 4.
3. The Buffer payload field `platform` is `instagram`. `bufferService` is `instagram`. `account` is empty.
4. Public profile stored in the app: https://www.instagram.com/freedompawswellness
5. In CapCut, export 9:16. Export a 1:1 file as well when the Buffer post is a feed tile.
6. In Buffer, the channel is the Freedom Paws Wellness Instagram account. Connect it in Buffer before a live send.

### TikTok

1. Click **tiktok**.
2. Create the card with section 4.
3. The payload `platform` and `bufferService` are both `tiktok`.
4. The app does not store a TikTok profile URL. Connect the Freedom Paws Wellness TikTok channel in Buffer yourself.
5. Export 9:16 from CapCut. Captions burned in, because many viewers watch without sound.

### YouTube

1. Click **youtube**.
2. Create the card with section 4.
3. The payload `platform` and `bufferService` are both `youtube`.
4. Public profile: https://www.youtube.com/@FreedomPawsWellness
5. A Short uses the same 9:16 export. The caption can be longer. On a Studio job, YouTube receives the article text plus the CTA when you click **Queue social post**. A card born on this page uses the caption shown in **Pipeline**.

### Facebook

1. Click **facebook**.
2. Create the card with section 4.
3. The payload `platform` and `bufferService` are both `facebook`.
4. Public profile: https://www.facebook.com/FreedomPawsWellness
5. Connect that Page in Buffer before a live send.

### X

1. Click **X**. The button label is the capital letter. The pipeline row shows `x`.
2. Create the card with section 4.
3. Read the caption for length. Shorten it in a new draft if it will not fit the post.
4. Click **Approve**, then **Send to Buffer**.
5. The payload sends `platform` as `x`, `bufferService` as `twitter`, and `account` as `FreedomPawsWellness`.
6. Buffer still calls the channel Twitter. Map `bufferService` `twitter` to the Freedom Paws Wellness X account, https://x.com/FreedomPawsWellness
7. A dry-run does not create a post on X. A live webhook only queues it. You still confirm it in Buffer before it goes out, unless you have already chosen Buffer’s own schedule.

---

## 14. Production tools, one by one

Make the picture on **Studio (Production)**. The tool list on this page is a reminder of that job. Distribution starts at the pipeline: Approve, then Send to Buffer.

The block **Picture tools — used on Studio (Production)** is the order. Each card opens your own account in a new tab. This page does not log into those sites.

Voice is ElevenLabs only. HeyGen lip-syncs that audio. HeyGen does not supply the voice.

### 14.1 ChatGPT

**Card:** ChatGPT · Script & caption drafts · https://chatgpt.com

1. On the SuperBud page, select the post so **Script** is on screen.
2. Select the script text with the pointer and copy it. There is no copy button.
3. Click the **ChatGPT** card.
4. Paste the script. Ask for a 15, 30, or 60 second spoken version that keeps SuperBud, the CTA path, and the education limit.
5. Bring the words you accept back by archiving the weak card and creating a new one whose caption you will actually approve. This page cannot paste into the caption box.

### 14.2 Claude

**Card:** Claude · Brand-safe rewrite · https://claude.ai

1. Copy the caption from the selected card.
2. Click the **Claude** card.
3. Ask for a wellness-first rewrite. Ask it to remove diagnosis, cure, reunion-rate, and shop language.
4. If you keep the rewrite, it has to become a new card’s caption before **Approve**. Archive the old card.

### 14.3 ElevenLabs

**Card:** ElevenLabs · Voiceover · speech synthesis

1. Copy only the voiceover lines from **Script** or from the storyboard **VO** lines.
2. Click the **ElevenLabs** card.
3. Choose the locked voice **SuperBud-FP-Designed**, Voice ID `99s7C3P60wz7zQFwG3Ww`.
4. Paste the lines. Generate. Download WAV or MP3.
5. Leave every other voice unused. The CapCut pitch offset for this voice is none.

### 14.4 HeyGen

**Card:** HeyGen · Host lip-sync · https://app.heygen.com

1. Use this card for a podium shot or a teach-to-camera shot.
2. Click **HeyGen**.
3. Choose Avatar IV.
4. Upload a locked SuperBud still. The chest emblem stays readable.
5. Upload the ElevenLabs file from 14.3 as the audio. Do not pick a HeyGen voice.
6. Export the talking clip.
7. Skip this card for a flying shot or a silent demo. Those stay picture-only until CapCut lays the ElevenLabs track under them.

### 14.5 Runway

**Card:** Runway · AI video / motion · https://app.runwayml.com

1. Click **Runway** when you need motion from the SuperBud still.
2. Upload that still.
3. Generate a short motion clip. Keep the same face and emblem.
4. Download it for CapCut. Leave it silent if HeyGen did not speak in that shot.

### 14.6 Canva

**Card:** Canva · Thumbnails & storyboards · https://www.canva.com

1. Click **Canva**.
2. Build 3 to 5 frames from the storyboard beats on the selected card.
3. Beat 1 is the hero still and the hook. Beat 2 is the app screen for the CTA path. Beat 3 is the end card with the CTA URL.
4. Keep the chest emblem readable. Export frames for CapCut.

### 14.7 CapCut

**Card:** CapCut · Edit & captions · https://www.capcut.com

1. Click **CapCut**.
2. New project, 9:16.
3. Lay the HeyGen host clip, then Runway or app-screen footage.
4. Lay the ElevenLabs track. Do not pitch-shift SuperBud-FP-Designed.
5. Burn captions.
6. End card: SuperBud shield, Freedom Paws Wellness, and the CTA URL from the post.
7. Export MP4, 9:16. Export 1:1 as well for an Instagram feed tile.

### 14.8 Descript

**Card:** Descript · Edit by transcript · https://www.descript.com

1. Click **Descript** when the voiceover needs tightening before CapCut.
2. Import the ElevenLabs file.
3. Cut filler. Export the tightened audio.
4. Use that export as the CapCut track and, if the host shot changes, as the HeyGen audio again.

### 14.9 Buffer

**Card:** Buffer · Schedule & distribute · https://buffer.com

The card says to schedule Instagram, TikTok, YouTube, Facebook, and X after you click **Approve**. Use the clicks in section 13 for the payload.

1. Click the **Buffer** card.
2. Confirm the Freedom Paws Wellness channel exists for the network on the card.
3. For X, the channel is the account `FreedomPawsWellness` and the service name Buffer still uses is Twitter.
4. Return to the SuperBud page. Select the approved card. Click **Send to Buffer**.
5. If the green line says dry-run, stay in Buffer only to connect channels. The post is not there yet. Set `BUFFER_WEBHOOK_URL` or `N8N_SOCIAL_BUFFER_WEBHOOK_URL` on the Vercel project **freedompaws-app**, redeploy, then click **Send to Buffer** again.
6. If the green line has no dry-run, find the draft in that channel and schedule it, or publish it yourself.
7. The page never marks a post Posted by itself. **Posted** is a status this screen can show after a later update. Your confirmation is the Buffer queue.

n8n Workflow F stays inactive until you deliberately activate it under `docs/marketing/ACTIVATION-GATE.md`. A dry-run or a single webhook is not that activation.

---

## 15. When the piece starts on Studio

Video jobs are created on **Studio (Production)**. A finished cut is handed here as drafts. Nothing is sent until you click **Send to Buffer** on this page.

1. In the nav, click **STUDIO**.
2. Click one chip: **All platforms**, **instagram only**, **tiktok only**, **youtube only**, **facebook only**, or **X only**.
3. On the topic row, click **Queue**. A catalog topic becomes a video job. A custom title needs a research card of substance or the queue stops with an error.
4. Click the job. Read **Do not say**.
5. Edit **Social caption** if the words are wrong. Click **Save**.
6. Click **Accept research** when the research card is something you can stand behind.
7. Leave **Approve script and render** alone when you are making the clips yourself. Click **Check render** only when that button is on the card and you started a render.
8. Click **Hand to SuperBud**. It creates one draft card per network. It does not approve the cards and it does not call Buffer. If the button says **On SuperBud**, the drafts are already here.
9. Come back to **SUPERBUD**. Open **Pipeline**. Read each new card. Click **Approve** only when the words are the ones you will send. Click **Send to Buffer** yourself. A dry-run card is Scheduled. A refused webhook is **Blocked**.

**All platforms** fans out to instagram, tiktok, youtube, facebook, and x. YouTube’s caption is the article plus the CTA. The other four use the social caption.

A line you would not publish has to be fixed before step 8. Studio refuses a caption or script that contains a diagnosis, a cure, a prescription, “AI vet”, “detects disease”, a reunion rate, a guaranteed reunion, “match live nationally”, “shop now”, “buy now”, FDA, or AAFCO. The error names the phrase. Rewrite, click **Save**, then queue again.

Vendor rows and a shop topic stay off this queue while L5 is open.

---

## 16. Global gates

These sit under the email-automation note. They save to Supabase. They do not send mail. n8n would read them later. n8n is not running.

### Emergency stop

1. Find **Global gates**.
2. Read **Emergency stop**. The line under it says it blocks automated outbound when on.
3. Leave the checkbox **checked**. That is the safe state while L5 is open.
4. With it checked, **Master marketing enabled** is grey, and every letter A through I is grey.

Checking it does not disable **Send to Buffer**.

### Master marketing enabled

1. Leave this checkbox **unchecked**.
2. It cannot be turned on while Emergency stop is checked.
3. The line **Send path status** should read **Blocked — dormant**.
4. The other reading, **Workflow D could send (if n8n active)**, means both gates are open. Turn Emergency stop back on if you see that line before the clearance PDF is saved.

---

## 17. Workflows A through I

Each checkbox shows only the letter. The matching name is in **Workflow reference** below the toggles. D and G also show the words **sends email** next to the letter.

Leave every checkbox unchecked. They are grey while Emergency stop is on. The clicks below are the meaning of each letter so you know what the page is holding.

| Letter | Card name | What it is for | What you do today |
| --- | --- | --- | --- |
| A | A — CRM sync | Nightly CRM hygiene into Google Sheets. It does not send email. | Leave unchecked. |
| B | B — Fit scoring | Batch fit scores for contacts. It does not send email. | Leave unchecked. |
| C | C — Draft generation | Outreach drafts when a CRM row is in research. It does not send email. | Leave unchecked. |
| D | D — Send sequence | Would send Email 1–3 when a partner is approved, master is on, and Emergency stop is off. | Leave unchecked. Shelter Email 1 stays HOLD FOR L5. |
| E | E — Reply triage | Would classify replies. It does not send from this page. | Leave unchecked. You read info@ yourself. |
| F | F — Social factory | Would build a weekly Buffer queue from listings. | Leave unchecked. Use section 4 for one post at a time. |
| G | G — Post-adoption drip | Would send day 0, 3, 7, and 14 emails. | Leave unchecked. |
| H | H — KPI weekly | Would post a Monday metrics note to Slack. | Leave unchecked. Read the counts on this page instead. |
| I | I — Listing spotlight | Would make a daily social post from a new listing. | Leave unchecked. |

A checkbox that you can click is already a warning that Emergency stop is off and master is on. Click it back off. Then turn Emergency stop on.

---

## 18. TN pilot partner approvals

1. Scroll to **TN pilot partner approvals**.
2. Read the line. Workflow D would send only for a partner marked approved, and only if the gates allow it.
3. If you see **Approve partners from the Adoption module**, there is nothing to click here.
4. Open **ADOPTION** from the nav when you need the real control. The checkbox label there is **Approved for outreach**.
5. Leave **Approved for outreach** unchecked while L5 is open.

---

## 19. Local tooling

**Local tooling** lists two commands. Clicking the page does not run them. On your Mac, in the freedompaws-app folder:

1. `npm run marketing:crm-export` writes a CSV on this machine. It does not call a mail API.
2. `npm run marketing:tn-outreach` writes markdown drafts to `docs/marketing/outbox/tn-pilot/`. It does not email the shelters.

Leave those drafts on HOLD FOR L5. The page is reminding you where they are.

---

## 20. One educational post, start to finish

Use this when today’s Command box is one SuperBud piece. Photo Booth is the example. Swap the pillar button if the day’s topic is ID, ViT, the directory, the vault, or the waitlist.

1. Open **SUPERBUD**.
2. Click **Photo Booth**.
3. Click **X**, or whichever single network you are filling today.
4. Click **Create SuperBud template**.
5. Click the new card.
6. Click the CTA. Confirm `/photobooth`.
7. Read the caption for diagnosis, reunion, and shop language.
8. Click **Submit for approval**.
9. Click **Approve**.
10. If you are also cutting video, run section 14 in order: Canva, ElevenLabs, HeyGen or Runway, CapCut. Then return to this card.
11. Click **Send to Buffer**.
12. Read the green line. Dry-run means you still open Buffer yourself when the webhook exists. Until then, the scheduled card is the record that you approved the words.

Stop after one piece on a 30 to 45 minute day.

---

## 21. When something looks wrong

| What you see | What you do |
| --- | --- |
| Pillar buttons are grey and the amber line names migration 015 | Run that SQL once in freedom-paws-id. Hard-refresh. |
| **Send to Buffer** is grey | The card is not approved. Click **Approve**. The button enables for Approved and for Scheduled. |
| Green line says dry-run | The webhook is unset. The words are saved. Buffer has nothing new. |
| Red line and badge Blocked | Read the webhook error. Approve again if needed. Send again. |
| You wanted to edit the caption in place | Archive the card and create another. This page has no caption field. |
| Studio **Hand to SuperBud** shows an error naming a phrase | Rewrite that phrase on Studio. Save. Hand off again. |
| **Workflow D could send** | Turn **Emergency stop** on. Leave A through I unchecked. |
| The post never appears on X | Dry-run, or the Buffer channel for Twitter / FreedomPawsWellness is not connected. |

---

## 22. Files

| File | Use |
| --- | --- |
| This manual | Click path for the SuperBud page. |
| `docs/brand/SuperBud-Series-Topic-Catalog.md` | Topics SuperBud may say. |
| `docs/brand/SuperBud-Master/voice-id/README.md` | Locked voice. |
| `docs/marketing/ACTIVATION-GATE.md` | When a workflow may be turned on. |
| `docs/ops/SUPERBUD-SOCIAL-STUDIO-CLICK-BY-CLICK.md` | Earlier studio note. This edition is the one on the page. |

---

*UPDATED 10/24/26 · Freedom Paws Wellness LLC · SuperBud page click-by-click manual · Internal*
