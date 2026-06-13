/** Protocol-aligned whole-food & safe-product affiliate picks — env URLs when signed. */

export type ProtocolAffiliatePick = {
  id: string;
  brandName: string;
  label: string;
  description: string;
  url: string | null;
  active: boolean;
};

export type ProtocolAffiliateSection = {
  slug: string;
  protocolTitle: string;
  picks: ProtocolAffiliatePick[];
  activeCount: number;
  hasActiveLinks: boolean;
  moduleEnabled: boolean;
  disclosure: string;
};

export const PROTOCOL_AFFILIATE_DISCLOSURE =
  'Freedom Paws may earn a commission if you purchase through partner links. We only list non-toxic, whole-food, and mission-aligned brands that fit this protocol. Products are not veterinary treatment. Always consult your licensed veterinarian.';

type CatalogPick = {
  id: string;
  brandName: string;
  label: string;
  description: string;
};

/** Curated targets per protocol — URLs activate via env when affiliate deals are signed. */
export const PROTOCOL_AFFILIATE_CATALOG: Record<string, CatalogPick[]> = {
  'max-movement': [
    {
      id: '1',
      brandName: 'Native Pet',
      label: 'Joint & mobility nutrition',
      description: 'Whole-food joint support powders aligned with low-impact movement protocols.',
    },
    {
      id: '2',
      brandName: 'The Honest Kitchen',
      label: 'Bone broth & whole-food toppers',
      description: 'Human-grade toppers for collagen and anti-inflammatory whole-food support.',
    },
  ],
  'freedom-calm': [
    {
      id: '1',
      brandName: 'West Paw',
      label: 'Non-toxic enrichment toys',
      description: 'Durable, safe chew and enrichment tools for anxiety-reducing routines.',
    },
    {
      id: '2',
      brandName: 'The Honest Kitchen',
      label: 'Calming whole-food base',
      description: 'Limited-ingredient whole-food options for sensitive, stress-prone dogs.',
    },
  ],
  'liver-kidney-detox': [
    {
      id: '1',
      brandName: 'The Honest Kitchen',
      label: 'Hydrating whole-food base',
      description: 'Human-grade base mixes supporting clean protein and hydration.',
    },
    {
      id: '2',
      brandName: 'Open Farm',
      label: 'Ethically sourced protein',
      description: 'Transparently sourced proteins for liver-supportive whole-food feeding.',
    },
  ],
  'gut-balance': [
    {
      id: '1',
      brandName: 'The Honest Kitchen',
      label: 'Digestive whole-food base',
      description: 'Dehydrated whole-food diets and toppers for gut harmony — Buddy\'s protocol anchor brand.',
    },
    {
      id: '2',
      brandName: 'Open Farm',
      label: 'Limited-ingredient recipes',
      description: 'Ethically sourced, limited-ingredient options for sensitive digestion.',
    },
    {
      id: '3',
      brandName: 'Answers Pet Food',
      label: 'Fermented whole-food',
      description: 'Fermented raw and broth options for microbiome-focused wellness.',
    },
  ],
  'infrared-spine': [
    {
      id: '1',
      brandName: 'Native Pet',
      label: 'Mobility & recovery support',
      description: 'Whole-food supplements that complement red-light and gentle movement routines.',
    },
    {
      id: '2',
      brandName: 'West Paw',
      label: 'Safe recovery enrichment',
      description: 'Non-toxic toys for calm, controlled activity during spine & joint support.',
    },
  ],
  'allergy-shield': [
    {
      id: '1',
      brandName: 'Open Farm',
      label: 'Limited-ingredient diet',
      description: 'Single-protein and transparent sourcing for skin & coat allergy support.',
    },
    {
      id: '2',
      brandName: 'JustFoodForDogs',
      label: 'Fresh limited recipes',
      description: 'Fresh, vet-formulated limited-ingredient meals for allergy-prone dogs.',
    },
  ],
  'fresh-smile-dental': [
    {
      id: '1',
      brandName: 'Whimzees',
      label: 'Natural dental chews',
      description: 'Vegetable-based chews for daily oral enrichment — non-toxic dental routine.',
    },
    {
      id: '2',
      brandName: 'West Paw',
      label: 'Safe chew alternatives',
      description: 'Durable, non-toxic chews for dogs who need gentler dental enrichment.',
    },
  ],
  'heart-strong': [
    {
      id: '1',
      brandName: 'Open Farm',
      label: 'Omega-rich whole-food',
      description: 'Ethically sourced proteins and recipes supporting cardio-friendly nutrition.',
    },
    {
      id: '2',
      brandName: 'Native Pet',
      label: 'Daily wellness powder',
      description: 'Whole-food daily support aligned with stamina and active lifestyle protocols.',
    },
  ],
  'patriot-immune': [
    {
      id: '1',
      brandName: 'The Honest Kitchen',
      label: 'Immune-support whole-food',
      description: 'Human-grade base mixes for vitality and clean daily nutrition.',
    },
    {
      id: '2',
      brandName: 'Answers Pet Food',
      label: 'Fermented nutrition',
      description: 'Fermented whole-food options for gut-immune axis support.',
    },
  ],
  'clear-vision': [
    {
      id: '1',
      brandName: 'Native Pet',
      label: 'Omega & antioxidant support',
      description: 'Whole-food daily support aligned with eye-health and antioxidant nutrition.',
    },
    {
      id: '2',
      brandName: 'Open Farm',
      label: 'Clean protein base',
      description: 'Transparent whole-food recipes supporting overall vitality and coat health.',
    },
  ],
};

function slugToEnvKey(slug: string): string {
  return slug.replace(/-/g, '_').toUpperCase();
}

function envUrl(key: string): string | null {
  const v = process.env[key]?.trim();
  return v && v.startsWith('http') ? v : null;
}

function envText(key: string): string | null {
  const v = process.env[key]?.trim();
  return v || null;
}

function affiliatesModuleEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_FP_PROTOCOL_AFFILIATES_ENABLED?.trim().toLowerCase();
  if (raw === '0' || raw === 'false' || raw === 'no') return false;
  return true;
}

function resolvePick(slug: string, catalog: CatalogPick): ProtocolAffiliatePick {
  const envKey = slugToEnvKey(slug);
  const prefix = `NEXT_PUBLIC_FP_PROTOCOL_${envKey}_AFF_${catalog.id}`;
  const url = envUrl(`${prefix}_URL`);
  const nameOverride = envText(`${prefix}_NAME`);
  const labelOverride = envText(`${prefix}_LABEL`);

  return {
    id: catalog.id,
    brandName: nameOverride ?? catalog.brandName,
    label: labelOverride ?? catalog.label,
    description: catalog.description,
    url,
    active: Boolean(url),
  };
}

export function getProtocolAffiliateSection(
  slug: string,
  protocolTitle: string
): ProtocolAffiliateSection | null {
  const catalog = PROTOCOL_AFFILIATE_CATALOG[slug];
  if (!catalog?.length) return null;

  const moduleEnabled = affiliatesModuleEnabled();
  const picks = catalog.map((c) => resolvePick(slug, c));
  const activeCount = picks.filter((p) => p.active).length;

  return {
    slug,
    protocolTitle,
    picks,
    activeCount,
    hasActiveLinks: activeCount > 0,
    moduleEnabled,
    disclosure: PROTOCOL_AFFILIATE_DISCLOSURE,
  };
}

export type ProtocolAffiliateStatusSummary = {
  moduleEnabled: boolean;
  protocolsWithCatalog: number;
  protocolsWithActiveLinks: number;
  totalActiveLinks: number;
  byProtocol: {
    slug: string;
    title: string;
    catalogCount: number;
    activeCount: number;
    ready: boolean;
  }[];
  setupNote: string;
};

export function getProtocolAffiliateStatus(
  protocolTitles: Record<string, string>
): ProtocolAffiliateStatusSummary {
  const slugs = Object.keys(PROTOCOL_AFFILIATE_CATALOG);
  const moduleEnabled = affiliatesModuleEnabled();

  let totalActiveLinks = 0;
  const byProtocol = slugs.map((slug) => {
    const section = getProtocolAffiliateSection(slug, protocolTitles[slug] ?? slug);
    const activeCount = section?.activeCount ?? 0;
    totalActiveLinks += activeCount;
    return {
      slug,
      title: protocolTitles[slug] ?? slug,
      catalogCount: PROTOCOL_AFFILIATE_CATALOG[slug]?.length ?? 0,
      activeCount,
      ready: activeCount > 0,
    };
  });

  return {
    moduleEnabled,
    protocolsWithCatalog: slugs.length,
    protocolsWithActiveLinks: byProtocol.filter((p) => p.ready).length,
    totalActiveLinks,
    byProtocol,
    setupNote:
      'Paste affiliate tracking URLs into .env.local as NEXT_PUBLIC_FP_PROTOCOL_{SLUG}_AFF_{1|2|3}_URL (e.g. GUT_BALANCE), then npm run vercel:env:push. Catalog brands show as “Launching soon” until URLs are set.',
  };
}
