import type { Metadata } from 'next';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import LabelScanClient from './LabelScanClient';

export const metadata: Metadata = {
  title: 'Label check • Freedom Paws',
  description:
    'Photograph a dog food, treat, chew, or toy label. Freedom Paws checks the printed words against a fixed not-good list.',
};

export default function LabelScanPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/wellness', label: 'Back to Wellness' }}>
      <PageHeader
        eyebrow="Label check"
        title="Read the package. Check the list."
        subtitle="A photo reads the words on the label. Those words are compared with the Freedom Paws not-good list. The camera does not test the product."
      />
      <LabelScanClient />
    </PageShell>
  );
}
