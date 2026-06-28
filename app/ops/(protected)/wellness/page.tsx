import Link from 'next/link';
import { getOpsOverview } from '@/lib/ops/stats-server';
import { getServerUser } from '@/lib/supabase/server';
import {
  OpsCard,
  OpsConfigRow,
  OpsPageShell,
  OpsSection,
  OpsStatusBadge,
} from '../../components/OpsUi';

export default async function OpsWellnessPage() {
  const user = await getServerUser();
  const { wellness } = await getOpsOverview(user?.email);

  return (
    <OpsPageShell
      title="Wellness & affiliates"
      subtitle="Insurance, telehealth partners, and affiliate link readiness."
      badge={<OpsStatusBadge status={wellness.ready ? 'ready' : 'warning'} />}
    >
      <OpsSection title="Partner programs">
        <OpsCard>
          <OpsConfigRow
            label={`Insurance — ${wellness.insurancePartnerName}`}
            ok={wellness.insuranceQuoteUrl}
            detail="NEXT_PUBLIC_FP_INSURANCE_QUOTE_URL"
          />
          <OpsConfigRow
            label="Insurance lost-dog URL"
            ok={wellness.insuranceLostDogUrl}
          />
          <OpsConfigRow
            label={`Telehealth — ${wellness.telehealthPartnerName}`}
            ok={wellness.telehealthBookUrl}
            detail="NEXT_PUBLIC_FP_TELEHEALTH_BOOK_URL"
          />
        </OpsCard>
      </OpsSection>

      {wellness.missingForLaunch.length > 0 ? (
        <OpsSection title="Missing for launch">
          <OpsCard>
            <ul className="text-sm text-amber-200/90 space-y-1">
              {wellness.missingForLaunch.map((m) => (
                <li key={m}>· {m}</li>
              ))}
            </ul>
          </OpsCard>
        </OpsSection>
      ) : null}

      <OpsSection title="Member-facing pages">
        <div className="flex flex-wrap gap-4">
          <Link href="/wellness" className="text-sm text-[#F5C242] hover:underline">
            Wellness hub →
          </Link>
          <Link href="/wellness/partners/insurance" className="text-sm text-[#F5C242] hover:underline">
            Insurance page →
          </Link>
          <Link href="/wellness/partners/telehealth" className="text-sm text-[#F5C242] hover:underline">
            Telehealth page →
          </Link>
          <Link href="/wellness/safe-products" className="text-sm text-[#F5C242] hover:underline">
            Safe products →
          </Link>
          <Link href="/photobooth/partners" className="text-sm text-[#F5C242] hover:underline">
            Photo Booth print partners →
          </Link>
        </div>
      </OpsSection>

      <OpsSection title="Outreach inbox">
        <OpsCard>
          <p className="text-sm text-white/65">
            Affiliate and insurance founding partner outreach uses{' '}
            <strong className="text-white">partners@freedompawsinc.com</strong>. Manage approvals in
            Marketing module — dormant until activated.
          </p>
        </OpsCard>
      </OpsSection>
    </OpsPageShell>
  );
}
