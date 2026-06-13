import type { Metadata } from 'next';
import BackLink from '@/app/components/BackLink';
import PartnerPolicyView from '@/app/components/wellness/PartnerPolicyView';
import { INSURANCE_PARTNER_POLICY } from '@/lib/wellness/partner-policies';

export const metadata: Metadata = {
  title: 'Insurance Affiliate Standards • Freedom Paws Partners',
  description:
    'Pet insurance affiliate acceptance criteria, rev share & CPA structures, and member discount requirements.',
};

export default function InsurancePartnerPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/wellness/partners" label="Partner program" />
        <div className="mt-6">
          <PartnerPolicyView policy={INSURANCE_PARTNER_POLICY} />
        </div>
      </div>
    </div>
  );
}
