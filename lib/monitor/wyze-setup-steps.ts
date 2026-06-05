export type SetupStep = {
  title: string;
  body: string[];
};

export const wyzeSetupSteps: SetupStep[] = [
  {
    title: '1. Wyze Cam v3 on Wi‑Fi',
    body: [
      'Use Wyze Cam v3 — v4 and Pan v4 do not show RTSP in the Wyze app yet.',
      'Wyze app → add camera → 2.4 GHz Wi‑Fi. Skip paid subscriptions.',
      'Mount where your dog rests. Pan/tilt: use Wyze app (not Freedom Paws yet).',
    ],
  },
  {
    title: '2. Turn on RTSP',
    body: [
      'Wyze app → camera → Settings → Advanced Settings → RTSP → Set Up.',
      'Username/password: 4–10 characters, letters and numbers only.',
      'Turn Secure RTSP (RTSPS) OFF for beta. Note camera IP in Device Info.',
    ],
  },
  {
    title: '3. Start go2rtc on your Mac',
    body: [
      'Install once: go2rtc in ~/freedompaws-monitor/ (see Wyze-Monitor-Connect-Guide.md).',
      'Edit go2rtc.yaml with your RTSP URL → run: cd ~/freedompaws-monitor && ./go2rtc',
      'Leave Terminal open. Test on Mac: http://localhost:1984/ — wyze stream listed.',
    ],
  },
  {
    title: '4. Copy stream.html URL',
    body: [
      'On iPhone Safari: http://YOUR_MAC_IP:1984/ → wyze → links.',
      'Under “Any codec in source”, tap stream.html (WebRTC — works on iPhone).',
      'Copy full URL, e.g. http://192.168.1.51:1984/stream.html?src=wyze',
    ],
  },
  {
    title: '5. Save in Freedom Paws',
    body: [
      'Home Wi‑Fi: Safari → http://YOUR_MAC_IP:3000/monitor (not home-screen PWA icon).',
      'Camera setup → paste stream.html URL → Save → Live view.',
      'Need help? Open Monitor → Help & troubleshooting.',
    ],
  },
  {
    title: '6. Away from home (optional)',
    body: [
      'Run start-tunnel.sh on Mac for a free HTTPS URL (Cloudflare quick tunnel).',
      'Paste https://….trycloudflare.com/stream.html?src=wyze in Camera setup.',
      'Then the installed Freedom Paws app icon works from cellular or work Wi‑Fi.',
    ],
  },
];
