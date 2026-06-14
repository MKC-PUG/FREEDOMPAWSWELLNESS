/** ViT results → protocol + Safe Picks funnel mapping */

export type VitWellnessFunnelHint = {
  protocolSlug: string;
  protocolLabel: string;
  safePickNote: string;
  safeProductIds: string[];
};

const FUNNEL_BY_SLUG: Record<string, Omit<VitWellnessFunnelHint, 'protocolSlug'>> = {
  'gut-balance': {
    protocolLabel: "Buddy's Gut Balance",
    safePickNote: 'Whole-food bases and digestive-safe chews',
    safeProductIds: ['earth-animal', 'whimzees'],
  },
  'allergy-shield': {
    protocolLabel: 'Allergy Shield',
    safePickNote: 'Limited-ingredient nutrition and non-toxic home cleaners',
    safeProductIds: ['branch-basics', 'force-of-nature', 'planet-dog'],
  },
  'fresh-smile-dental': {
    protocolLabel: 'Fresh Smile Dental',
    safePickNote: 'Natural dental chews and safe enrichment',
    safeProductIds: ['whimzees', 'west-paw', 'bow-wow-labs'],
  },
  'freedom-calm': {
    protocolLabel: 'Freedom Calm',
    safePickNote: 'Non-toxic enrichment toys for calm routines',
    safeProductIds: ['west-paw', 'planet-dog', 'outward-hound'],
  },
  'max-movement': {
    protocolLabel: 'Max Movement Pro',
    safePickNote: 'Durable outdoor gear and joint-friendly enrichment',
    safeProductIds: ['ruffwear', 'west-paw'],
  },
  'patriot-immune': {
    protocolLabel: 'Patriot Defender',
    safePickNote: 'Clean nutrition and home environment support',
    safeProductIds: ['branch-basics', 'earth-animal'],
  },
  'heart-strong': {
    protocolLabel: 'Heart Strong',
    safePickNote: 'Whole-food wellness and active lifestyle gear',
    safeProductIds: ['ruffwear'],
  },
  'clear-vision': {
    protocolLabel: 'Clear Vision Defender',
    safePickNote: 'Omega-rich whole-food support picks',
    safeProductIds: [],
  },
  'liver-kidney-detox': {
    protocolLabel: 'Liver & Kidney Detox',
    safePickNote: 'Hydrating whole-food and clean environment',
    safeProductIds: ['branch-basics'],
  },
  'infrared-spine': {
    protocolLabel: 'Red Light Spine Support',
    safePickNote: 'Gentle movement and recovery enrichment',
    safeProductIds: ['ruffwear', 'west-paw'],
  },
};

export function vitWellnessFunnelHints(primarySlug?: string | null, secondarySlug?: string | null): VitWellnessFunnelHint[] {
  const slugs = [primarySlug, secondarySlug].filter(Boolean) as string[];
  const seen = new Set<string>();
  const out: VitWellnessFunnelHint[] = [];

  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const entry = FUNNEL_BY_SLUG[slug];
    if (!entry) continue;
    seen.add(slug);
    out.push({ protocolSlug: slug, ...entry });
  }

  if (out.length === 0) {
    return [
      {
        protocolSlug: 'wellness',
        protocolLabel: 'Prevention-first wellness',
        safePickNote: 'Curated non-toxic chews, toys, and home products',
        safeProductIds: [],
      },
    ];
  }

  return out;
}
