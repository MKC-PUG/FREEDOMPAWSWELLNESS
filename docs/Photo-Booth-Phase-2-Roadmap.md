# Freedom Paws Wellness
## SuperBud Photo Booth — Phase 2 Roadmap (Background Removal)

**Document purpose:** Phase 2 build plan — automatic pet background removal and polish after Phase 1 sign-off.

**Last updated:** May 31, 2026  
**Project folder:** `freedompaws-app`  
**Route:** `/photobooth`  
**Related:** `Photo-Booth-Phase-1-Roadmap.md`, `Monitor-Equipment-Shopping-Guide.md`

---

## Phase 2 status

| Feature | Status |
|---------|--------|
| **Remove background (beta)** — client-side cutout | ✅ In build |
| Restore original photo | ✅ In build |
| Smarter sticker placement (head zone) | ⏳ Planned |
| “Surprise Me” random theme | ⏳ Planned |
| Sparkle reveal animation | ⏳ Planned |
| Cats + dogs copy (“your pet”) | ⏳ Planned |

---

## How background removal works

- Uses **`@imgly/background-removal`** in the **browser** (no API key, no server cost).
- Runs on the member’s phone after upload — first run downloads a small AI model (~15–30 sec on iPhone).
- Output: **PNG with transparent background** — pet composites cleanly on themes and lake backgrounds.
- **Restore original** brings back the unedited upload.

**Best photos:** One pet, clear subject, good lighting, minimal busy clutter behind the pet.

---

## Member flow

1. Upload pet photo  
2. Tap **✨ Remove background (beta)**  
3. Wait for progress (15–30 sec first time)  
4. Tap a theme — pet appears “dressed up” on the scene  
5. Share / Save  

---

## Test on iPhone (Vercel PWA)

1. Open **SuperBud Photo Booth** from installed app  
2. Upload a dog photo  
3. Tap **Remove background**  
4. Pick **Lake Legend** or **SuperBud Hero** — pet should float on scene without rectangular photo box  
5. Share to Messages or Photos  

---

## Phase 2 remaining tasks

- [ ] iPhone test pass on background removal (Wi‑Fi first run)  
- [ ] Auto-suggest remove background after upload (optional prompt)  
- [ ] “Surprise Me” theme button  
- [ ] Head-zone hint for sticker placement  
- [ ] Short sparkle animation when theme applies  
- [ ] Copy: “your pet” for cats + dogs  

---

## Phase 3 preview (later)

- AI costume (Replicate — already in dependencies)  
- Share card with QR  
- Hashtag / gallery  
- Sound + haptic on share  

---

*Freedom Paws Wellness — Honor Buddy’s Legacy*
