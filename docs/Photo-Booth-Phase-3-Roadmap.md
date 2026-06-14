# Freedom Paws Wellness
## SuperBud Photo Booth — Phase 3 (AI Magic Look + Holidays)

**Last updated:** June 14, 2026  
**Route:** `/photobooth`

---

## What we built

| Feature | Status |
|---------|--------|
| Holiday backgrounds (9 themes in style picker) | ✅ Live |
| AI Magic Look drawer (11 costumes) | ✅ Built — needs `REPLICATE_API_TOKEN` |
| Veterans Day — Army / Navy / Marines | ✅ |
| Restore AI costume | ✅ |
| Freedom Paws Wellness export watermark | ✅ (Phase 2.5) |

---

## AR vs AI — honest product note

**True augmented reality** (live camera, costume tracks as the pet moves) requires pet face/body mesh tracking. Snapchat and Instagram invest heavily in this; **mobile browsers do not offer reliable pet AR today**.

**Our Phase 3 approach: AI Magic Look**
- Member uploads or cutouts their pet
- FLUX Kontext Pro (Replicate) applies a photorealistic holiday costume in ~15–30 sec
- Result composites on themed backgrounds + stickers + Share/Save

**Phase 3.5 (future): Live camera capture**
- Snap from camera → same AI pipeline (feels interactive, not true AR)

**Phase 4 (future): Native app AR**
- iOS/Android with custom pet segmentation if member demand justifies cost

---

## Holiday calendar

| Holiday | Background theme | AI costumes |
|---------|------------------|-------------|
| New Year's | `holiday-new-years` | Party hat & sparkle |
| St. Patrick's Day | `holiday-st-patricks` | Green hat / shamrock |
| Easter | `holiday-easter` | Bunny ears |
| Cinco de Mayo | `holiday-cinco-de-mayo` | Sombrero / serape |
| 4th of July | `holiday-july-4th` | Patriotic bandana |
| Veterans Day | `holiday-veterans` | Army · Navy · Marines |
| Halloween | `holiday-halloween` | Witch / pumpkin |
| Thanksgiving | `holiday-thanksgiving` | Pilgrim / autumn |
| Christmas | `holiday-christmas` | Santa / reindeer |

---

## Enable AI Magic Look (founder setup)

1. Create account at [replicate.com](https://replicate.com)
2. Create API token
3. Add to Vercel **Production** env:
   ```
   REPLICATE_API_TOKEN=r8_...
   ```
4. Redeploy `freedompaws-app`
5. Smoke test: Photo Booth → AI Magic Look → pick Halloween → wait ~20 sec

**Cost:** ~$0.03–0.05 per costume image (FLUX Kontext Pro). Monitor usage in Replicate dashboard.

---

## Member flow

1. Upload pet photo  
2. Optional: magic cutout (recommended)  
3. Pick holiday **background** in style row (instant)  
4. Tap **AI Magic Look ✨** → choose holiday costume  
5. Adjust / add stickers → Share / Save  

---

## Files

- `lib/photobooth/ai-costumes.ts` — prompts & IDs  
- `lib/photobooth/ai-costume-generate.ts` — Replicate server call  
- `app/api/photobooth/ai-costume/route.ts` — API  
- `app/photobooth/AiCostumeDrawer.tsx` — UI  

---

*Freedom Paws Wellness — Honor Buddy's Legacy*
