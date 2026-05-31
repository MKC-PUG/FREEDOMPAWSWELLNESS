export type SetupStep = {
  title: string;
  body: string[];
};

export const wyzeSetupSteps: SetupStep[] = [
  {
    title: '1. Get a Wyze Cam v3 or v4',
    body: [
      'Mount the camera where your dog rests — crate, bed, or main room.',
      'Connect it to your home Wi‑Fi using the Wyze app first.',
    ],
  },
  {
    title: '2. Turn on RTSP in Wyze app',
    body: [
      'Open Wyze app → your camera → Settings (gear icon).',
      'Advanced Settings → RTSP → turn ON.',
      'Note the username, password, and RTSP URL shown.',
    ],
  },
  {
    title: '3. Home stream bridge (required for iPhone)',
    body: [
      'iPhone cannot play RTSP directly. A small home relay converts RTSP to HLS.',
      'For beta: use go2rtc, mediamtx, or Wyze WebRTC tools on a home PC or Raspberry Pi on the same Wi‑Fi.',
      'Your relay gives you an HLS link ending in .m3u8 — paste that below.',
    ],
  },
  {
    title: '4. Paste your HLS link in Freedom Paws',
    body: [
      'Open Monitor → Live View → enter the .m3u8 URL from your relay.',
      'Phone must be on the same Wi‑Fi as the camera (or use a secure tunnel you control).',
      'Freedom Paws does not record video in this beta — live view only.',
    ],
  },
];
