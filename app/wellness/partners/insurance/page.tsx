import type { Metadata } from 'next';
import PageShell from '@/app/components/ui/PageShell';
import PartnerPolicyView from '@/app/components/wellness/PartnerPolicyView';
import { INSURANCE_PARTNER_POLICY } from '@/lib/wellness/partner-policies';

export const metadata: Metadata = {
  title: 'Insurance Affiliate Standards • Freedom Paws Partners',
  description:
    'Pet insurance affiliate acceptance criteria, rev share & CPA structures, and member discount requirements.',
};

export default function InsurancePartnerPolicyPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/wellness/partners', label: 'Partner program' }}>
      <div className="mt-2">
        <PartnerPolicyView policy={INSURANCE_PARTNER_POLICY} />
      </div>
    </PageShell>
  );
}
