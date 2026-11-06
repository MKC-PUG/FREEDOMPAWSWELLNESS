import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';

export const metadata: Metadata = {
  title: 'Sponsored products • Freedom Paws',
  description: 'How sponsored home products are listed on Freedom Paws care pages.',
};

export default function SponsoredProductsPage() {
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/protocols', label: 'Back to protocols' }}>
      <PageHeader
        title="Sponsored products"
        subtitle="Optional home products listed beside a care plan."
        className="mb-8"
      />
      <SectionCard padding="lg" className="space-y-4 text-sm leading-relaxed text-white/80">
        <p>
          A card marked Sponsored is a home product a partner may offer: a brace, a harness, a
          shirt, a chew, or a food. Freedom Paws may earn a fee if you later buy through a partner
          link. That link is not on the care card. You come here to read this first.
        </p>
        <p>
          Partner links stay off until the product has passed the Freedom Paws standard and a
          partner term is signed. Each physical category is meant to list more than one product,
          so the choice stays yours.
        </p>
        <p>
          These products are optional. They are not veterinary treatment, and a check-in does not
          pick one for your dog. A moderate or severe result does not show them. Your own
          veterinarian is the person who examines your dog.
        </p>
        <p>
          <Link href="/wellness/partners" className="font-semibold text-[#F5C242] underline underline-offset-2">
            Partner standards
          </Link>
        </p>
      </SectionCard>
    </PageShell>
  );
}
