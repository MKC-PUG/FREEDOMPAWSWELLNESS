import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Photo Booth How-To • Freedom Paws Wellness',
  description: 'Step-by-step guide for SuperBud Photo Booth, AI Magic Look, and Me & My Pup frames.',
};

const steps = [
  {
    title: '1. Upload your pet photo',
    body: 'Tap Choose Photo and pick a picture of your pet (dog or cat). Upload starts automatically.',
  },
  {
    title: '2. Optional: magic cutout',
    body: 'Tap ✨ Remove background for a clean cutout on themed scenes. First run downloads a small model (~15–30 sec on Wi‑Fi). Use Restore original anytime.',
  },
  {
    title: '3. Pick a style',
    body: 'Swipe the style row and tap a background — holidays, landmarks, lake, and more. Try 🎲 Surprise Me, or Me & My Pup for a duo card. Tap ↩ Change background to switch scenes without losing your pet.',
  },
  {
    title: '4. Optional: AI Magic Look',
    body: 'Tap ✨ AI Magic Look for a photoreal holiday costume on your pet (~20 sec). Uses your monthly AI looks allowance. Backgrounds, cutout, frames, and cartoon stickers stay free.',
  },
  {
    title: '5. Share or save',
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
  'Tap Add accessory — Photo props (when available) or Fun stickers.',
  'For photoreal costumes on your pet, use AI Magic Look first; props are quick extras.',
  'Drag to move · gold corners to resize · pinch with two fingers.',
  'Double-tap an accessory on the photo to remove it.',
];

const optionalTips = [
  {
    title: 'Adjust your pet (any background)',
    body: 'Tap your pet on the canvas to select it, then drag to pan and pinch (or use the arrow and ± buttons) to zoom — no cutout required.',
  },
  {
    title: 'Picture frame + print headline',
    body: 'After picking a background, tap Picture frame to add a mat and border. Type a print headline on the cream mat — great for gifts and wall prints.',
  },
  {
    title: 'Flow bar',
    body: 'Follow Upload › Cutout › Background › Dress & share at the top of the editor. Gold buttons mark the recommended path.',
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
          Dress up your pet (dog or cat), try AI Magic Look costumes, create a Me &amp; My Pup card,
          and share in seconds.
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
