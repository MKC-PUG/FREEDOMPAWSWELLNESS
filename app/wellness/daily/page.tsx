import type { Metadata } from 'next';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import DailyLogClient from './DailyLogClient';

export const metadata: Metadata = {
  title: 'Daily log • Freedom Paws',
  description: 'Food, movement, and training notes for one dog, with the last seven days beside them.',
};

export default function DailyLogPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/wellness', label: 'Back to Wellness' }}>
      <PageHeader
        eyebrow="Daily log"
        title="Food, movement, and one training rep"
        subtitle="The last seven days are the window you see first. Older days stay on this phone. When you are signed in, each day is also copied into that dog’s vault."
      />
      <DailyLogClient />
    </PageShell>
  );
}
