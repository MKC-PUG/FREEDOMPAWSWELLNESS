# Freedom Paws Wellness
# Pet Monitor — Equipment & Shopping Guide (US)

**Document purpose:** Everything you need to order and set up **Monitor My Dog** beta testing at home — camera, relay, software, and what to skip.

**Last updated:** June 1, 2026  
**Project folder:** `freedompaws-app`  
**App route:** `/monitor`  
**Related:** `Pet-Monitor-MVP-Roadmap.md`, `Freedom-Paws-Master-Business-Plan-and-Roadmap.md`

---

## Table of contents

1. [Quick shopping list](#1-quick-shopping-list)
2. [Camera — what to buy](#2-camera--what-to-buy)
3. [Best sources / sellers (US)](#3-best-sources--sellers-us)
4. [Everything besides the camera](#4-everything-besides-the-camera)
5. [The home relay (required for iPhone)](#5-the-home-relay-required-for-iphone)
6. [Free software — no purchase](#6-free-software--no-purchase)
7. [What NOT to buy](#7-what-not-to-buy)
8. [When your camera arrives](#8-when-your-camera-arrives)
9. [Phase 2 (later) — watch away from home](#9-phase-2-later--watch-away-from-home)

---

## 1. Quick shopping list

Print or check off:

```
☐ Wyze Cam v3 (required for Freedom Paws Monitor beta — RTSP in app)
☐ Buy from wyze.com, Amazon (Wyze official seller), Best Buy, or Home Depot
☐ Install free Wyze app on iPhone (Wi‑Fi setup + RTSP)
☐ Relay device: old laptop/Mac you own OR Raspberry Pi 4 (2GB+) + 32GB microSD + power
☐ Home Wi‑Fi (2.4 GHz — Wyze uses this band)
☐ (Optional) better wall mount or shelf for camera angle
☐ (Optional) Wyze microSD — only if YOU want Wyze app recording (not required for Freedom Paws)
```

**Estimated total (new purchases only):**

| Setup | Approx. cost |
|-------|----------------|
| Wyze Cam v3 + use existing laptop as relay | **~$25–30** |
| Wyze Cam + Raspberry Pi 4 kit as dedicated relay | **~$70–110** |

---

## 2. Camera — what to buy

| Model | Why | Approx. price |
|--------|-----|----------------|
| **Wyze Cam v4** | Newest; RTSP in firmware; recommended for MVP | ~$35 |
| **Wyze Cam v3** | Proven RTSP support; often cheaper | ~$25–30 |

**Stick to official Wyze v3 or v4.** Do not use random “Wyze-compatible” off-brand cameras for this test — RTSP steps in Freedom Paws match real Wyze firmware.

**What RTSP is:** A standard video stream from your camera on your home network. Freedom Paws cannot use it directly on iPhone — you need a **relay** (below) to convert it to HLS (`.m3u8`).

---

## 3. Best sources / sellers (US)

Buy from a source with **easy returns** and **official product**:

| Priority | Seller | Why |
|----------|--------|-----|
| **#1** | **[wyze.com](https://www.wyze.com)** | Official; matches our setup guide |
| **#2** | **Amazon** | Search “Wyze Cam v4” or “Wyze Cam v3” — choose **Wyze** as seller |
| **#3** | **Best Buy** | In-store pickup; official retail |
| **#4** | **Home Depot** | Often stocks Wyze; in-store pickup |

**Avoid:** Unknown third-party sellers with no returns, or cameras that are not genuine Wyze v3/v4.

---

## 4. Everything besides the camera

| Item | Required? | Notes |
|------|-----------|--------|
| **Wyze app** (iPhone) | **Yes** | Free from App Store — Wi‑Fi setup + enable RTSP |
| **Home Wi‑Fi** | **Yes** | 2.4 GHz network (Wyze does not use 5 GHz alone for setup) |
| **USB power adapter + cable** | **Yes** | Included with Wyze camera |
| **MicroSD card** | Optional | Only for recording inside Wyze app — **not** required for Freedom Paws live view |
| **Mount / shelf / bracket** | Helpful | Basic mount included; extra if you need height or corner angle |
| **Relay device** (see Section 5) | **Yes for live view** | Converts RTSP → HLS for iPhone — not sold by Wyze |

**Freedom Paws app:** Already on your iPhone (Vercel PWA) — no extra purchase.

---

## 5. The home relay (required for iPhone)

**Problem:** iPhone and PWA **cannot play RTSP** directly.

**Solution:** A small program running **on your home Wi‑Fi** converts the Wyze stream to **HLS** (URL ending in `.m3u8`). You paste that URL into **Monitor → Camera setup** in Freedom Paws.

```
Wyze Camera (RTSP)  →  Home relay (go2rtc or mediamtx)  →  HLS (.m3u8)  →  Freedom Paws on iPhone
```

### Relay hardware options

| Option | Cost | Best for |
|--------|------|----------|
| **Old laptop or Mac Mini** you already own | **$0** | Easiest first test — leave it on same Wi‑Fi |
| **Raspberry Pi 4 (2GB or 4GB)** + official power supply + 32GB microSD | **~$45–75** | Small, low-power, always-on |
| **Intel NUC / mini PC** | **~$80+** | Dedicated box if you don’t want to use a laptop |

**For first test:** Use any Mac or PC on the same network as the camera. No need to buy a Pi until you want a dedicated 24/7 box.

**Network rule for beta:** iPhone must be on the **same Wi‑Fi** as the camera and relay (or use a secure tunnel you control). Watching from cellular/away-from-home is **Monitor Phase 2** (Freedom Paws cloud relay — not needed for first test).

---

## 6. Free software — no purchase

| Software | Purpose | Link |
|----------|---------|------|
| **Wyze app** | Camera Wi‑Fi + turn on RTSP | iPhone App Store |
| **go2rtc** | RTSP → HLS for iPhone (recommended for beta) | [github.com/AlexxIT/go2rtc](https://github.com/AlexxIT/go2rtc) |
| **mediamtx** | Alternative RTSP → HLS relay | [github.com/bluenviron/mediamtx](https://github.com/bluenviron/mediamtx) |

**No cloud subscription required** for home Wi‑Fi testing.

---

## 7. What NOT to buy

| Do not buy (for MVP test) | Why |
|---------------------------|-----|
| Ring, Nest, Arlo cameras | Closed systems — not supported in v1 |
| Wyze cloud subscription | Not needed for RTSP + relay test |
| Freedom Paws paid relay | Phase 2 — after home test works |
| Extra “pet monitor” apps | Freedom Paws is your viewer |
| Expensive NVR systems | Overkill for beta |

---

## 8. When your camera arrives

### Step A — Wyze setup (about 15 minutes)

1. Unbox camera; plug in near your dog’s room.
2. Open **Wyze app** → add camera → connect to **2.4 GHz Wi‑Fi**.
3. Wyze app → camera → **Settings (gear)** → **Advanced Settings** → **RTSP** → **ON**.
4. Write down: **RTSP URL**, **username**, **password** (shown in app).

### Step B — Home relay (about 30–60 minutes first time)

1. Install **go2rtc** on Mac/laptop/Pi on **same Wi‑Fi**.
2. Add your Wyze RTSP URL to go2rtc config.
3. Start go2rtc; note the **HLS URL** (ends in `.m3u8`).

*Detailed step-by-step when camera arrives: say **“Camera arrived — help me connect”** in Cursor.*

### Step C — Freedom Paws

1. Open **Freedom Paws** on iPhone (same Wi‑Fi).
2. **Monitor My Dog** → **Camera setup**.
3. Enter room name + paste **HLS (.m3u8) URL** → **Save camera**.
4. **Live view** tab → video should play.

**Privacy (beta):** Live view only — Freedom Paws does not store your video on our servers in this beta.

---

## 9. Phase 2 (later) — watch away from home

When home Wi‑Fi test works, **Monitor Phase 2** adds:

- Freedom Paws **cloud relay** (or partner video service)
- Watch from work/errands without home laptop running
- Member-friendly setup (no go2rtc on their own)

**Do not wait for Phase 2 to order the camera** — home test comes first.

---

## Quick reference

| Question | Answer |
|----------|--------|
| Best camera? | Wyze Cam **v3** (not v4 / Pan v4 until Wyze ships RTSP) |
| Best seller? | **wyze.com** or Amazon (Wyze official) |
| Only buy camera? | **No** — need relay device + free software |
| Cheapest test? | Wyze v3 + old laptop + go2rtc |
| Freedom Paws route | `/monitor` |
| Full build plan | `docs/Pet-Monitor-MVP-Roadmap.md` |

---

*Freedom Paws Wellness — Honor Buddy’s Legacy*  
*Equipment guide for planning — not legal or security advice for home network setup.*
