export type HelpSection = {
  title: string;
  items: string[];
};

export const monitorQuickStart: HelpSection = {
  title: 'Quick start (home Wi‑Fi)',
  items: [
    'Wyze Cam v3 on 2.4 GHz Wi‑Fi — RTSP ON in Wyze app (free plan OK).',
    'Mac on same Wi‑Fi: run go2rtc (see scripts/monitor/start-home.sh).',
    'iPhone Safari: http://YOUR_MAC_IP:3000/monitor — not the Vercel home-screen icon for local http streams.',
    'go2rtc → wyze → links → stream.html — copy full URL into Camera setup.',
    'Save → Live view. Pan/tilt stays in the Wyze app.',
  ],
};

export const monitorTunnelStart: HelpSection = {
  title: 'Away from home (HTTPS tunnel — Phase 2 beta)',
  items: [
    'Keep go2rtc running on your Mac at home.',
    'Run scripts/monitor/start-tunnel.sh — copies an https://….trycloudflare.com URL.',
    'In go2rtc links, use the tunnel host: https://TUNNEL_HOST/stream.html?src=wyze',
    'Paste that https URL in Monitor → Save. Now the installed PWA app icon works.',
    'Tunnel URL changes each time unless you use a named Cloudflare tunnel (advanced).',
  ],
};

export const monitorTroubleshooting: HelpSection[] = [
  {
    title: '● Offline in Live view',
    items: [
      'go2rtc terminal still running? Restart: cd ~/freedompaws-monitor && ./go2rtc',
      'Stream URL complete? Must end with stream.html?src=wyze (not cut off at …/strea).',
      'Home: phone on same Wi‑Fi as Mac. Away: use https tunnel URL, not http://192.168…',
      'Mac firewall blocking port 1984? Allow go2rtc or turn firewall off briefly to test.',
    ],
  },
  {
    title: 'RTSP setup failed in Wyze',
    items: [
      'Use Wyze Cam v3 — v4 and Pan v4 do not show RTSP yet.',
      'Turn Secure RTSP (RTSPS) OFF for simpler local RTSP.',
      'Credentials: 4–10 chars, letters and numbers only.',
      'If spinner fails: reboot camera, retry on stable live view.',
    ],
  },
  {
    title: 'go2rtc stream errors on Mac',
    items: [
      'IP must be valid (e.g. 192.168.1.37 — not 192.168.1.322).',
      'URL format: rtsp://user:pass@192.168.1.37/stream0 (no :554 needed on v3).',
      'Password with ! → use %21 in go2rtc.yaml or use letters-only password in Wyze.',
    ],
  },
  {
    title: 'White screen / MJPEG / HLS failed on iPhone',
    items: [
      'Use stream.html from go2rtc links — not MJPEG or plain m3u8 on iPhone.',
      'Test stream.html in Safari first before Freedom Paws.',
    ],
  },
];

export const monitorPrivacyNote =
  'Live view only. Freedom Paws does not store your video on our servers in this beta. You own the camera. Not a substitute for a pet sitter or emergency vet care.';
