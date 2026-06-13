/** Freedom Paws Safe Picks — curated non-toxic chews, toys, and home products. */

export type SafeProductCategory =
  | 'chews-dental'
  | 'toys-enrichment'
  | 'home-environment'
  | 'monitor-wellness';

export type SafeProductPick = {
  id: string;
  brandName: string;
  productLine: string;
  category: SafeProductCategory;
  description: string;
  whySafe: string[];
  protocolSlugs: string[];
  applyUrl: string | null;
  url: string | null;
  active: boolean;
  priority: 'featured' | 'standard';
};

export type SafeProductsPageData = {
  moduleEnabled: boolean;
  picks: SafeProductPick[];
  activeCount: number;
  featured: SafeProductPick[];
  byCategory: Record<SafeProductCategory, SafeProductPick[]>;
  disclosure: string;
};

export const SAFE_PRODUCTS_DISCLOSURE =
  'Freedom Paws may earn a commission on partner purchases. We curate for non-toxic materials and mission alignment — not every SKU from a brand is approved. Products are not veterinary treatment. Check ingredients for your dog\'s allergies and consult your licensed veterinarian.';

export const SAFE_PRODUCT_CRITERIA = [
  'No rawhide in our primary chew picks',
  'No BHA, BHT, or ethoxyquin in listed treat lines',
  'Transparent or USA-made sourcing where possible',
  'Durable design or digestible ingredients suited to the use case',
  'Quarterly founder review against FDA pet recall alerts',
] as const;

export const SAFE_PRODUCT_CATEGORY_LABELS: Record<
  SafeProductCategory,
  { title: string; subtitle: string; icon: string }
> = {
  'chews-dental': {
    icon: '🦷',
    title: 'Chews & dental',
    subtitle: 'Digestible dental routines and safer chew alternatives — pairs with Fresh Smile protocol.',
  },
  'toys-enrichment': {
    icon: '🎾',
    title: 'Toys & enrichment',
    subtitle: 'Non-toxic, durable enrichment for calm, movement, and allergy-friendly play.',
  },
  'home-environment': {
    icon: '🏡',
    title: 'Home & environment',
    subtitle: 'Reduce household toxins — supports Allergy Shield and daily prevention pillars.',
  },
  'monitor-wellness': {
    icon: '📷',
    title: 'Monitor & wellness setup',
    subtitle: 'Optional camera tools for Monitor My Dog — not required for ViT or ID.',
  },
};

type CatalogEntry = Omit<SafeProductPick, 'url' | 'active'>;

/** Curated catalog — affiliate URLs activate via env when signed. */
export const SAFE_PRODUCTS_CATALOG: CatalogEntry[] = [
  {
    id: 'west-paw',
    brandName: 'West Paw',
    productLine: 'Zogoflex & Seaflex chews',
    category: 'chews-dental',
    description:
      'USA-made, recyclable Zogoflex chews and toys — durable enrichment without rawhide.',
    whySafe: ['USA manufactured', 'BPA- and phthalate-free Zogoflex', 'Recyclable through West Paw program'],
    protocolSlugs: ['fresh-smile-dental', 'freedom-calm', 'allergy-shield'],
    applyUrl: 'https://www.westpaw.com/pages/affiliates',
    priority: 'featured',
  },
  {
    id: 'whimzees',
    brandName: 'Whimzees',
    productLine: 'Vegetable dental chews',
    category: 'chews-dental',
    description:
      'Vegetable-based dental chews for daily oral enrichment — limited-ingredient dental routine.',
    whySafe: ['No rawhide', 'Vegetable-based shapes', 'Limited-ingredient dental focus'],
    protocolSlugs: ['fresh-smile-dental'],
    applyUrl: 'https://www.whimzees.com',
    priority: 'featured',
  },
  {
    id: 'earth-animal',
    brandName: 'Earth Animal',
    productLine: 'No-Hide chews',
    category: 'chews-dental',
    description: 'No-Hide chew alternative — digestible enrichment without traditional rawhide.',
    whySafe: ['No rawhide positioning', 'Digestible chew alternative', 'Whole-food brand ethos'],
    protocolSlugs: ['gut-balance', 'allergy-shield'],
    applyUrl: 'https://www.earthanimal.com',
    priority: 'featured',
  },
  {
    id: 'planet-dog',
    brandName: 'Planet Dog',
    productLine: 'Orbee-Tuff toys',
    category: 'toys-enrichment',
    description: 'Non-toxic Orbee-Tuff enrichment toys — soft, durable fetch and puzzle play.',
    whySafe: ['Non-toxic Orbee-Tuff material', 'Made in USA', 'Enrichment without food dyes'],
    protocolSlugs: ['freedom-calm', 'max-movement'],
    applyUrl: 'https://www.planetdog.com',
    priority: 'featured',
  },
  {
    id: 'outward-hound',
    brandName: 'Outward Hound',
    productLine: 'Puzzle & snuffle enrichment',
    category: 'toys-enrichment',
    description: 'Puzzle feeders and snuffle mats for calm enrichment and slower feeding.',
    whySafe: ['Mental enrichment focus', 'Pairs with anxiety and gut protocols', 'Supervised use recommended'],
    protocolSlugs: ['freedom-calm', 'gut-balance'],
    applyUrl: 'https://outwardhound.com',
    priority: 'standard',
  },
  {
    id: 'bow-wow-labs',
    brandName: 'Bow Wow Labs',
    productLine: 'Bully Buddy safety holder',
    category: 'chews-dental',
    description:
      'Safety holder for bully sticks — reduces swallow risk when using single-ingredient chews.',
    whySafe: ['Choking-risk mitigation device', 'Pairs with audited single-ingredient chews', 'Supervised chew sessions'],
    protocolSlugs: ['fresh-smile-dental'],
    applyUrl: 'https://bowwowlabs.com',
    priority: 'standard',
  },
  {
    id: 'branch-basics',
    brandName: 'Branch Basics',
    productLine: 'Human-safe home concentrate',
    category: 'home-environment',
    description:
      'Fragrance-free, plant-based concentrate for floors and surfaces your dog contacts daily.',
    whySafe: ['No synthetic fragrance priority', 'Reduces paw-contact toxin load', 'Human-grade cleaning base'],
    protocolSlugs: ['allergy-shield', 'patriot-immune'],
    applyUrl: 'https://www.branchbasics.com',
    priority: 'featured',
  },
  {
    id: 'force-of-nature',
    brandName: 'Force of Nature',
    productLine: 'Electrolyzed water cleaner',
    category: 'home-environment',
    description:
      'EPA-registered cleaner made from salt, water, and vinegar — pet-area friendly sanitizing.',
    whySafe: ['No harsh residue formula', 'Suitable for pet-adjacent surfaces', 'Hypoallergenic cleaning option'],
    protocolSlugs: ['allergy-shield'],
    applyUrl: 'https://www.forceofnatureclean.com',
    priority: 'standard',
  },
  {
    id: 'wyze',
    brandName: 'Wyze',
    productLine: 'Home camera (Monitor My Dog)',
    category: 'monitor-wellness',
    description:
      'Budget-friendly camera option referenced in our Monitor My Dog setup guide — optional wellness tool.',
    whySafe: ['Documented in Freedom Paws monitor guide', 'Optional — not required for ViT or ID', 'Local storage options available'],
    protocolSlugs: [],
    applyUrl: 'https://www.wyze.com',
    priority: 'standard',
  },
  {
    id: 'ruffwear',
    brandName: 'Ruffwear',
    productLine: 'Outdoor harness & gear',
    category: 'toys-enrichment',
    description:
      'Durable outdoor harnesses and gear for lake walks and low-impact movement days.',
    whySafe: ['Adventure-grade durability', 'Supports Max Movement lifestyle pillar', 'Proper fit reduces injury risk'],
    protocolSlugs: ['max-movement', 'infrared-spine'],
    applyUrl: 'https://ruffwear.com/pages/affiliates',
    priority: 'standard',
  },
];

function productIdToEnvKey(id: string): string {
  return id.replace(/-/g, '_').toUpperCase();
}

function envUrl(key: string): string | null {
  const v = process.env[key]?.trim();
  return v && v.startsWith('http') ? v : null;
}

function safeProductsModuleEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_FP_SAFE_PRODUCTS_ENABLED?.trim().toLowerCase();
  if (raw === '0' || raw === 'false' || raw === 'no') return false;
  return true;
}

function resolvePick(entry: CatalogEntry): SafeProductPick {
  const envKey = productIdToEnvKey(entry.id);
  const url = envUrl(`NEXT_PUBLIC_FP_SAFE_${envKey}_URL`);
  return {
    ...entry,
    url,
    active: Boolean(url),
  };
}

const CATEGORY_ORDER: SafeProductCategory[] = [
  'chews-dental',
  'toys-enrichment',
  'home-environment',
  'monitor-wellness',
];

export function getSafeProductsPageData(): SafeProductsPageData {
  const moduleEnabled = safeProductsModuleEnabled();
  const picks = SAFE_PRODUCTS_CATALOG.map(resolvePick);
  const activeCount = picks.filter((p) => p.active).length;
  const featured = picks.filter((p) => p.priority === 'featured');

  const byCategory = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      acc[cat] = picks.filter((p) => p.category === cat);
      return acc;
    },
    {} as Record<SafeProductCategory, SafeProductPick[]>
  );

  return {
    moduleEnabled,
    picks,
    activeCount,
    featured,
    byCategory,
    disclosure: SAFE_PRODUCTS_DISCLOSURE,
  };
}

export type SafeProductsStatusSummary = {
  moduleEnabled: boolean;
  catalogCount: number;
  activeCount: number;
  featuredCount: number;
  byProduct: { id: string; brandName: string; active: boolean }[];
  setupNote: string;
};

export function getSafeProductsStatus(): SafeProductsStatusSummary {
  const data = getSafeProductsPageData();
  return {
    moduleEnabled: data.moduleEnabled,
    catalogCount: data.picks.length,
    activeCount: data.activeCount,
    featuredCount: data.featured.length,
    byProduct: data.picks.map((p) => ({
      id: p.id,
      brandName: p.brandName,
      active: p.active,
    })),
    setupNote:
      'Set NEXT_PUBLIC_FP_SAFE_{PRODUCT_ID}_URL in .env.local (e.g. WEST_PAW, WHIMZEES) after affiliate signup, then npm run vercel:env:push. Products show “Launching soon” until URLs are set.',
  };
}
