# Wyze → Freedom Paws Monitor — Connect Tonight

**Use this when your camera is in hand.** ~45–60 minutes first time.

**App:** Freedom Paws → **Monitor My Dog** (`/monitor`)

---

## What you need

- **Wyze Cam v3** plugged in (v4 / Pan v4 do not have RTSP in the Wyze app yet)
- iPhone with **Wyze app** (same home Wi‑Fi, **2.4 GHz**)
- Mac on the **same Wi‑Fi** (relay — leave it on while testing)
- Freedom Paws on iPhone (Vercel PWA or localhost)

---

## Step 1 — Wyze app (iPhone, ~15 min)

1. Unbox, plug in camera near your dog’s room.
2. **Wyze app** → **+** → add device → scan QR on camera.
3. Connect to your **2.4 GHz** Wi‑Fi (not 5 GHz-only guest network).
4. When live view works in Wyze, open the camera.
5. **Settings (gear)** → **Advanced Settings** → **RTSP** → **ON**.
6. **Copy or write down** (you’ll need all three):
   - **RTSP URL** (looks like `rtsp://USER:PASS@192.168.x.x:554/live`)
   - **Username**
   - **Password**
   - **Camera IP** (inside the URL)

> **Pan v4:** Pan/tilt stays in the Wyze app for now. Freedom Paws beta = live view only.

---

## Step 2 — go2rtc on Mac (relay, ~20–30 min)

iPhone cannot play RTSP. **go2rtc** on your Mac converts Wyze RTSP → **HLS** (`.m3u8`).

### 2a. Install go2rtc

**Option A — Homebrew (if available):**

```bash
brew install go2rtc
```

**Option B — Official binary:**

1. Open [go2rtc releases](https://github.com/AlexxIT/go2rtc/releases/latest)
2. Download **`go2rtc_mac_arm64.zip`** (Apple Silicon) or **`go2rtc_mac_amd64.zip`** (Intel)
3. Unzip, then in Terminal:

```bash
chmod +x go2rtc
mkdir -p ~/freedompaws-monitor
mv go2rtc ~/freedompaws-monitor/
cd ~/freedompaws-monitor
```

### 2b. Create config

Create `~/freedompaws-monitor/go2rtc.yaml` (replace with **your** Wyze RTSP URL from Step 1):

```yaml
streams:
  wyze: rtsp://YOUR_USER:YOUR_PASS@192.168.1.XXX:554/live
```

Example (fake values):

```yaml
streams:
  wyze: rtsp://admin:abc123xyz@192.168.1.42:554/live
```

Copy the template from the repo: `scripts/monitor/go2rtc-wyze.example.yaml`

### 2c. Start go2rtc

```bash
cd ~/freedompaws-monitor
./go2rtc
```

Or if installed via Homebrew:

```bash
cd ~/freedompaws-monitor
go2rtc
```

Leave this Terminal window **open** while testing.

### 2d. Find your Mac’s IP

```bash
ipconfig getifaddr en0
```

Example: `192.168.1.10`

### 2e. Test in browser (Mac)

Open:

- **go2rtc UI:** `http://localhost:1984/`
- **HLS stream:** `http://localhost:1984/api/stream.m3u8?src=wyze`

You should see the stream listed under **wyze**. If the `.m3u8` page loads or downloads, the relay works.

**Freedom Paws HLS URL** (use your Mac IP, not `localhost`, on iPhone):

```
http://YOUR_MAC_IP:1984/api/stream.m3u8?src=wyze
```

Example:

```
http://192.168.1.10:1984/api/stream.m3u8?src=wyze
```

---

## Step 3 — Freedom Paws (iPhone)

1. iPhone on **same Wi‑Fi** as camera and Mac.
2. Open **Safari** at `http://YOUR_MAC_IP:3000/monitor` — **not** the installed Vercel PWA icon.
3. Tab **Camera setup** → room name (e.g. `Living room`).
4. Paste **stream.html** URL from go2rtc → **Save camera**  
   (example: `http://YOUR_MAC_IP:1984/stream.html?src=wyze`).
5. Tab **Live view** → video should play (WebRTC via go2rtc).

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| No RTSP in Wyze app | Firmware update in Wyze app; camera must be v3/v4/Pan with RTSP support |
| go2rtc won’t start | Port 1984 in use — quit other apps or change port in yaml |
| Mac browser works, iPhone doesn’t | Use **Mac LAN IP**, not `localhost`; same Wi‑Fi; Mac firewall allow incoming on 1984 |
| ● Offline in app | Relay not running, wrong URL, or phone on cellular — switch to home Wi‑Fi |
| Black video | Wrong RTSP URL/password; re-copy from Wyze app after RTSP toggle |

---

## After it works

- **Away from home:** needs Monitor Phase 2 (cloud relay) — not this beta.
- **Pan/tilt in Freedom Paws:** future phase — use Wyze app for now.
- Say in Cursor: **“Monitor works”** or **“Monitor stuck on …”** for next steps.

---

*Freedom Paws Wellness — live view only; no video stored on our servers in this beta.*
