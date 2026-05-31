import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Photo Booth How-To • Freedom Paws Wellness',
  description: 'Step-by-step guide for SuperBud Photo Booth and Me & My Pup frames.',
};

const steps = [
  {
    title: '1. Upload your pet photo',
    body: 'Tap Choose Photo and pick a picture from your camera roll. Your photo uploads automatically — no cutout required for most backgrounds.',
  },
  {
    title: '2. Pick a style',
    body: 'Tap any background theme, or choose Me & My Pup for a duo card with you and your pup in gold circles.',
  },
  {
    title: '3. Share or save',
    body: 'Tap Share to send to Messages, social apps, or family. Tap Save to download a PNG to your phone.',
  },
];

const meAndMyPupSteps = [
  'Add your pet photo first, then tap Me & My Pup.',
  'Tap Add my photo for a selfie — it stays on your device until you share.',
  'Pick a frame style (Birthday, Whole Lives, Make It Yours, etc.).',
  'Tap MY PUP or ME, then drag to pan and pinch (or use ±) to zoom each circle.',
  'Make It Yours: type your own headline, move it up/down, pick a solid or scene background, and choose ring color.',
];

const accessoryTips = [
  'Tap an accessory to add it to the photo.',
  'Drag to move · gold corners to resize · pinch with two fingers.',
  'Double-tap an accessory on the photo to remove it.',
];

const optionalTips = [
  {
    title: 'Magic cutout (optional)',
    body: 'Try magic cutout if your pet is on a plain background. Most people skip this and use a themed background with the full photo — it still looks great.',
  },
  {
    title: 'Picture frame (optional)',
    body: 'After picking a background, scroll down to add a mat and border. Drag the thickness slider for thin → thick.',
  },
];

export default function PhotoBoothHelpPage() {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white">
      <div className="max-w-lg mx-auto px-4 py-6 pb-16">
        <Link
          href="/photobooth"
          className="inline-block mb-4 text-xs font-bold tracking-wider text-amber-400"
        >
          ← BACK TO PHOTO BOOTH
        </Link>

        <h1 className="text-3xl font-bold text-amber-400">Photo Booth How-To</h1>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          Dress up your pet, create a Me &amp; My Pup card, and share in seconds.
        </p>

        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-white">Quick start</h2>
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-4"
            >
              <h3 className="text-sm font-bold text-amber-300">{step.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-white">Me &amp; My Pup</h2>
          <div className="rounded-2xl border border-amber-400/30 bg-[#0F1E38]/80 p-4">
            <ul className="space-y-3 text-sm text-white/75 leading-relaxed">
              {meAndMyPupSteps.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-white">Accessories (optional)</h2>
          <div className="rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-4">
            <ul className="space-y-2 text-sm text-white/75 leading-relaxed">
              {accessoryTips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-bold text-white">Good to know</h2>
          {optionalTips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl border border-white/10 bg-[#0F1E38]/60 p-4"
            >
              <h3 className="text-sm font-bold text-white/90">{tip.title}</h3>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{tip.body}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-green-500/30 bg-green-950/20 p-4">
            <p className="text-sm text-green-300/90 leading-relaxed">
              <strong className="text-green-300">Privacy:</strong> Your selfie in Me &amp; My Pup
              stays on your phone until you tap Share or Save — it is not uploaded to our server.
            </p>
          </div>
        </section>

        <div className="mt-10">
          <Link
            href="/photobooth"
            className="block w-full min-h-[52px] rounded-2xl bg-amber-400 py-4 text-center text-base font-bold text-black touch-manipulation"
          >
            Open Photo Booth →
          </Link>
        </div>
      </div>
    </div>
  );
}
