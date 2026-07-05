import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import PrimaryButton from '@/app/components/ui/PrimaryButton';

export const metadata: Metadata = {
  title: 'Install App • Freedom Paws Wellness',
  description:
    'Add Freedom Paws to your home screen on iPhone or Android — no App Store required.',
};

const iphoneSteps = [
  'Open Safari — not Facebook, Instagram, or Messages in-app browser.',
  'Go to app.freedompawsinc.com',
  'Tap Share (square with arrow up) at the bottom of Safari.',
  'Scroll and tap Add to Home Screen.',
  'Tap Add — the paw icon appears on your home screen.',
];

const androidSteps = [
  'Open Chrome on your phone.',
  'Go to app.freedompawsinc.com',
  'Tap the menu (⋮) in the top-right, or tap Install app when prompted.',
  'Choose Add to Home screen or Install app.',
  'Confirm — Freedom Paws opens like a native app.',
];

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-2.5 text-sm sm:text-base text-white/80 leading-relaxed list-none">
      {steps.map((step, i) => (
        <li key={step} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-xs font-bold text-amber-400">
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default function InstallHelpPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/', label: 'Back to Home' }}>
      <PageHeader
        eyebrow="Quick guide"
        eyebrowVariant="gold"
        title="Install Freedom Paws"
        subtitle="Add to your home screen — no App Store, no download fee."
        className="mt-2 mb-6"
      />

      <SectionCard variant="glass" className="mb-4 border-amber-400/25">
        <p className="text-sm text-white/70 leading-relaxed">
          Freedom Paws is a <strong className="text-white/90">Progressive Web App</strong> — it
          installs from your browser, not the Apple App Store or Google Play. On iPhone, you must
          use <strong className="text-white/90">Safari</strong>; in-app browsers (Facebook,
          Instagram, email links) cannot add to Home Screen.
        </p>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <SectionCard variant="glass">
          <h2 className="text-base font-bold text-amber-300">iPhone · Safari</h2>
          <StepList steps={iphoneSteps} />
        </SectionCard>

        <SectionCard variant="glass">
          <h2 className="text-base font-bold text-amber-300">Android · Chrome</h2>
          <StepList steps={androidSteps} />
        </SectionCard>
      </div>

      <SectionCard className="mt-4 border-white/10 bg-[#16223C]">
        <p className="text-xs text-white/50 leading-relaxed">
          Freedom Paws Wellness, LLC · Educational wellness tools — not veterinary advice.
        </p>
      </SectionCard>

      <div className="mt-6">
        <Link href="/" className="block">
          <PrimaryButton variant="gold" fullWidth size="lg">
            Open Freedom Paws →
          </PrimaryButton>
        </Link>
      </div>
    </PageShell>
  );
}
