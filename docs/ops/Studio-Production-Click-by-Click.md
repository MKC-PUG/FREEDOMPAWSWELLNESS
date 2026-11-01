## Flow

| Step | Where | What happens |
| --- | --- | --- |
| 1 | Production slate | You edit the title, spoken script, and caption. Status stays REVIEW. |
| 2 | Production slate | You change that one row to APPROVED. |
| 3 | Studio (Production) | You queue that topic. One job. One module. |
| 4 | This page | You read Do not say. You save the script and the caption. |
| 5 | ElevenLabs, HeyGen, Runway, CapCut | You make the clips. This page does not log into those accounts. |
| 6 | This page | Hand to SuperBud creates draft cards. It does not send them. |
| 7 | SuperBud (Distribution) | You approve, then you send to Buffer. |

## 1. Open the page

1. Open https://app.freedompawsinc.com/ops/desk
2. Confirm the title is **Studio (Production)**.
3. Confirm this guide is the first block under the title.

## 2. What this page does

This page makes the video. It holds the research card, the spoken script, the caption, and the cut.

It does not send to Buffer. It does not email a vendor, a shelter, or a member.

The topic list still includes partner product rows: the unsigned brace, Ruffwear, Native Pet, Whimzees, West Paw, and Branch Basics. Queue one only after that partner is signed and the words are approved.

## 3. Queue one job

1. Choose the networks for the later handoff: **Instagram Only**, **YouTube Only**, **Facebook Only**, **X Only**, or **All platforms**.
2. Skip **TikTok Only**. TikTok is not a Buffer channel.
3. In **Topic list**, click **Queue** on one education row. The rows are the walk, the meal, skin and coat, the check-in, the visit notes, Photo Booth, Freedom Paws ID, and the Adoption Network.
4. Click the new job.
5. Read **Do not say**.
6. Paste the approved script into **Spoken script**. Paste the approved caption into **Social caption**.
7. Click **Save**.

Leave **Approve script and render** alone when you are cutting the clips yourself. That button starts a HeyGen render from this desk.

## 4. Make the picture

Use this order. One spoken line is one talking clip.

1. **ElevenLabs.** Voice **SuperBud-FP-Designed** only. Voice ID `99s7C3P60wz7zQFwG3Ww`. Download the mp3. Do not run it through another voice.
2. **HeyGen Avatar IV.** Upload the locked still and that mp3. HeyGen does not supply the voice. Delete a clip if the face leaves the canon plate.
3. **Runway Gen-4.5** only when the dog moves and the mouth is not delivering a line. Image to video. 9:16. 5 seconds. No Runway voice. No text-to-video.
4. **CapCut** on this Mac. 9:16. 1080×1920. Lay the talking clips in script order. Burn the words he is actually saying. On a health video, burn the closer while he says it: “This is general pet wellness education, not a veterinary diagnosis. If something seems different, call your own veterinarian.”
5. Export MP4, 30 fps, under 3 minutes.
6. Upload the file to the **social-videos** bucket. Copy the public https link. Open it in a private window. It must play with no login.

Locked stills live in `docs/brand/SuperBud-Master/frames/`. Leave every file in `not-identity/` out of HeyGen, Runway, and CapCut.

## 5. Canva layout

This step is optional. It fills a brand template. It does not draw a new dog.

1. On the open job, find **Canva layout**.
2. Click **Connect Canva** once, and allow the requested scopes.
3. Choose the brand template for the end card, the thumbnail, and the one-page sheet. Click **Save templates**.
4. The template text fields are named **HEADLINE**, **CTA**, and **MODULE**. The one-page sheet may also have **BODY**. An image field named **STILL** receives the locked plate.
5. Click **Make end card**, **Make thumbnail**, or **Make one-page sheet**.
6. Look at the file. Click **Approve Canva layout**, or **Reject**.
7. An unapproved file blocks **Hand to SuperBud**. An approved file is linked on the SuperBud card. Buffer does not receive it.

## 6. Hand the cut to distribution

1. Paste the public https link on the job if the field is there, and click **Save**.
2. Click **Hand to SuperBud**.
3. The button changes to **On SuperBud**. The line says the drafts are waiting and nothing was sent to Buffer.
4. Open **SuperBud (Distribution)** and continue there.

## 7. Stop

- Do not queue a shop video or a vendor video.
- Do not state a percent, a reunion rate, a diagnosis, or “AI vet.”
- A mild education line still ends by telling the owner to call their own veterinarian when the subject is health.
