# Monitor Phase 2 — HTTPS Tunnel Relay (Beta)

**Purpose:** Watch your dog from the **installed Freedom Paws PWA** (Vercel) while away from home — without building a custom cloud video server yet.

**How it works:**

```
Wyze v3 → go2rtc on home Mac → Cloudflare quick tunnel (HTTPS) → Freedom Paws on iPhone
```

Freedom Paws does **not** host your video. The tunnel exposes **your** home go2rtc over HTTPS for this beta.

---

## Prerequisites

- Home beta working (RTSP + go2rtc + stream.html on LAN)
- Mac stays on at home with go2rtc running
- `cloudflared` installed: `brew install cloudflared`

---

## Steps

### 1. Start go2rtc (Terminal 1)

```bash
bash scripts/monitor/start-home.sh
```

### 2. Start HTTPS tunnel (Terminal 2)

```bash
bash scripts/monitor/start-tunnel.sh
```

Copy the `https://….trycloudflare.com` URL from the output.

### 3. Freedom Paws — Camera setup

Paste:

```
https://YOUR-TUNNEL-HOST/stream.html?src=wyze
```

Example:

```
https://random-words.trycloudflare.com/stream.html?src=wyze
```

**Save camera** → **Live view**.

### 4. Watch from anywhere

Open the **installed Freedom Paws app** (home-screen icon) → Monitor → Live view.

Works on cellular or work Wi‑Fi while tunnel + go2rtc stay running at home.

---

## Notes

| Topic | Detail |
|-------|--------|
| Tunnel URL | Changes each run (quick tunnel). Named Cloudflare tunnel = stable URL (advanced). |
| Mac must stay on | go2rtc + tunnel run on your Mac |
| Security | Anyone with the tunnel URL could view while tunnel is open — treat as private beta |
| Production | Later: Freedom Paws hosted relay with member auth |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Tunnel starts but no video | Confirm go2rtc works at http://localhost:1984/ first |
| PWA still offline | Stream URL must be **https://** not http://192.168… |
| Tunnel died | Re-run start-tunnel.sh and update saved URL in Monitor |

---

*Freedom Paws Wellness — Monitor Phase 2 beta*
