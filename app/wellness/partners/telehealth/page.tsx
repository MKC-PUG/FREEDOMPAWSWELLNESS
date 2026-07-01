import type { Metadata } from 'next';
import PageShell from '@/app/components/ui/PageShell';
import PartnerPolicyView from '@/app/components/wellness/PartnerPolicyView';
import { TELEHEALTH_PARTNER_POLICY } from '@/lib/wellness/partner-policies';

export const metadata: Metadata = {
  title: 'Telehealth Partner Standards • Freedom Paws Partners',
  description:
    'Holistic veterinary telehealth acceptance criteria, referral fee structures, and integrative care requirements.',
};

export default function TelehealthPartnerPolicyPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/wellness/partners', label: 'Partner program' }}>
      <div className="mt-2">
        <PartnerPolicyView policy={TELEHEALTH_PARTNER_POLICY} />
      </div>
    </PageShell>
  );
}
