# Me & My Pup — Dual Photo Frame (Phase 3 preview)

**Purpose:** Product plan for owner + dog themed frames — requested May 2026.

---

## The idea

Members upload **two photos**:

1. **Their dog** (already in Photo Booth)
2. **Their face / selfie** (optional second upload)

Both appear in a **pre-designed card** with circular (or rounded) compartments, gold/navy Freedom Paws styling, ready to share.

---

## Why this spreads

- **Emotional hook:** “Me and my best friend” posts outperform pet-only on Facebook/Instagram.
- **Identity:** Owner sees themselves + their dog — pride + share impulse.
- **Giftable:** Kids, spouses, and grandkids love making these for family.

---

## Recommended MVP (better than generic circles)

### Theme name: **“Me & My Pup”**

| Element | Design |
|--------|--------|
| Layout | Two circles side-by-side (60% dog, 40% human — dog is hero) |
| Frame | Navy gradient + gold ring borders + subtle paw connector |
| Text | Optional caption: “Best friends · Freedom Paws” |
| Background | Lake, patriot, or birthday variant (reuse theme palette) |

### Member flow

1. Upload dog photo (existing)
2. Tap **“Add my photo”** (new — camera or gallery)
3. Optional cutout on each (same beta tool)
4. Drag each face inside its circle
5. Share

---

## Build phases

| Phase | Scope | Effort |
|-------|--------|--------|
| **3a** | One static template PNG overlay + two circular clip regions on canvas | ~2–3 days |
| **3b** | Second upload slot + drag/resize per slot (reuse cutout pet logic) | ~1–2 days |
| **3c** | 3 template variants (Lake, Patriot, Birthday) | art + 1 day |
| **3d** | Optional AI face cutout for owner selfie | same imgly pipeline |

---

## Simpler alternative (ship faster)

**“Owner sticker”** — treat the human headshot like an accessory:

- Upload selfie → appears as a **circular clipped sticker**
- Member drags next to dog on any background
- No fixed template yet — still shareable, less design work

Good for testing demand before building full dual-frame art.

---

## Assets needed

- `frame-me-and-pup-lake.png` — transparent PNG with gold rings (holes for photos)
- `frame-me-and-pup-patriot.png`
- Optional: Canva template 1080×1080 for social square export

---

## Technical notes

- Canvas: `ctx.save()` → circular `clip()` → `drawImage()` per slot
- Store `{ dog: PetTransform, owner: PetTransform }` like cutout reposition (Phase 2.5 — shipped)
- Second photo: new upload key `photobooth-owner` or in-memory blob only (privacy)

---

*Freedom Paws Wellness — Honor Buddy’s Legacy*
