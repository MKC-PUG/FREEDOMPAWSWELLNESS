import type { Metadata } from 'next';
import BackLink from '@/app/components/BackLink';
import PartnerPolicyView from '@/app/components/wellness/PartnerPolicyView';
import { TELEHEALTH_PARTNER_POLICY } from '@/lib/wellness/partner-policies';

export const metadata: Metadata = {
  title: 'Telehealth Partner Standards • Freedom Paws Partners',
  description:
    'Holistic veterinary telehealth acceptance criteria, referral fee structures, and integrative care requirements.',
};

export default function TelehealthPartnerPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/wellness/partners" label="Partner program" />
        <div className="mt-6">
          <PartnerPolicyView policy={TELEHEALTH_PARTNER_POLICY} />
        </div>
      </div>
    </div>
  );
}
