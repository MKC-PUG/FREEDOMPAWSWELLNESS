import Link from 'next/link';
import { getOpsOverview } from '@/lib/ops/stats-server';
import { getServerUser } from '@/lib/supabase/server';
import OpsFeatureFlags from '../../components/OpsFeatureFlags';
import {
  OpsCard,
  OpsKpiCard,
  OpsPageShell,
  OpsSection,
} from '../../components/OpsUi';

export default async function OpsProductPage() {
  const user = await getServerUser();
  const { product, shop, featureFlags } = await getOpsOverview(user?.email);

  return (
    <OpsPageShell
      title="Product"
      subtitle="PWA version, feature flags, token shop readiness, and content admin."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <OpsKpiCard label="PWA version" value={product.pwaVersion} />
        <OpsKpiCard
          label="Xaman / XRPL"
          value={shop.xummReady ? 'Ready' : 'Setup'}
          accent={shop.xummReady ? 'emerald' : 'amber'}
        />
        <OpsKpiCard
          label="Stripe shop"
          value={shop.stripeReady ? 'Ready' : 'Setup'}
          accent={shop.stripeReady ? 'emerald' : 'amber'}
        />
      </div>

      <OpsSection title="Feature flags">
        <OpsFeatureFlags initial={featureFlags} />
      </OpsSection>

      <OpsSection title="Content & tools">
        <div className="grid sm:grid-cols-2 gap-4">
          <OpsCard>
            <h3 className="font-bold">Symptom lexicon</h3>
            <p className="mt-2 text-sm text-white/60">
              Review ViT symptom feedback and approved terms.
            </p>
            <p className="mt-2 text-xs text-white/45">
              Admin password: {product.symptomAdminConfigured ? 'configured' : 'not set'}
            </p>
            <Link
              href="/admin/symptoms"
              className="mt-4 inline-flex text-sm font-bold text-[#F5C242] hover:underline"
            >
              Symptom admin →
            </Link>
          </OpsCard>
          <OpsCard>
            <h3 className="font-bold">Protocols</h3>
            <p className="mt-2 text-sm text-white/60">10 holistic wellness protocols.</p>
            <Link href="/protocols" className="mt-4 inline-flex text-sm font-bold text-[#F5C242] hover:underline">
              Protocol overview →
            </Link>
          </OpsCard>
          <OpsCard>
            <h3 className="font-bold">Photo Booth</h3>
            <Link href="/photobooth" className="mt-4 inline-flex text-sm font-bold text-[#F5C242] hover:underline">
              Open Photo Booth →
            </Link>
          </OpsCard>
          <OpsCard>
            <h3 className="font-bold">Token shop</h3>
            <Link href="/token-shop" className="mt-4 inline-flex text-sm font-bold text-[#F5C242] hover:underline">
              Token shop →
            </Link>
          </OpsCard>
        </div>
      </OpsSection>
    </OpsPageShell>
  );
}
