/**
 * Canonical protocol metadata: spec category (member-facing) + branded supplement name + slug.
 * Single source for ViT results, token shop, and protocol pages.
 */

export type ProtocolRecord = {
  slug: string;
  /** Branded product title (matches app/protocols/protocols.ts) */
  brandedTitle: string;
  /** Executive-spec category name shown alongside branded name in ViT results */
  specCategory: string;
  /** Short spec label for cards */
  specShort: string;
};

/** All sellable / recommendable protocols keyed by full branded title. */
export const PROTOCOL_BY_TITLE: Record<string, ProtocolRecord> = {
  'Max Movement Pro – Joint Support': {
    slug: 'max-movement',
    brandedTitle: 'Max Movement Pro – Joint Support',
    specCategory: 'Joint & Mobility Protocol',
    specShort: 'Joint & Mobility',
  },
  'Freedom Calm – Anxiety Relief': {
    slug: 'freedom-calm',
    brandedTitle: 'Freedom Calm – Anxiety Relief',
    specCategory: 'Cognitive & Senior Support Protocol',
    specShort: 'Cognitive & Calm',
  },
  'Foundation Liver & Kidney Detox': {
    slug: 'liver-kidney-detox',
    brandedTitle: 'Foundation Liver & Kidney Detox',
    specCategory: 'Heart & Vital Organs Protocol',
    specShort: 'Liver & Kidney',
  },
  "Buddy's Gut Balance & Cleanse": {
    slug: 'gut-balance',
    brandedTitle: "Buddy's Gut Balance & Cleanse",
    specCategory: 'Digestive Harmony Protocol',
    specShort: 'Digestive Harmony',
  },
  'Red Light Spine & Joint Support': {
    slug: 'infrared-spine',
    brandedTitle: 'Red Light Spine & Joint Support',
    specCategory: 'Musculoskeletal Recovery Protocol',
    specShort: 'Spine & Recovery',
  },
  'Allergy Shield – Skin & Coat Glow': {
    slug: 'allergy-shield',
    brandedTitle: 'Allergy Shield – Skin & Coat Glow',
    specCategory: 'Allergy & Respiratory Relief Protocol',
    specShort: 'Allergy & Respiratory',
  },
  'Fresh Smile Dental & Oral Health': {
    slug: 'fresh-smile-dental',
    brandedTitle: 'Fresh Smile Dental & Oral Health',
    specCategory: 'Holistic Wellness Baseline Protocol',
    specShort: 'Dental & Oral',
  },
  'Heart Strong Cardio-Support': {
    slug: 'heart-strong',
    brandedTitle: 'Heart Strong Cardio-Support',
    specCategory: 'Heart & Vital Organs Protocol',
    specShort: 'Heart & Vitals',
  },
  'Patriot Defender – Immunity & Vitality': {
    slug: 'patriot-immune',
    brandedTitle: 'Patriot Defender – Immunity & Vitality',
    specCategory: 'Immune Vitality Protocol',
    specShort: 'Immune Vitality',
  },
  'Clear Vision Defender – Eye Health Protocol': {
    slug: 'clear-vision',
    brandedTitle: 'Clear Vision Defender – Eye Health Protocol',
    specCategory: 'Eye & Vision Health Protocol',
    specShort: 'Eye & Vision',
  },
  'General Wellness Restore': {
    slug: 'patriot-immune',
    brandedTitle: 'Patriot Defender – Immunity & Vitality',
    specCategory: 'Holistic Wellness Baseline Protocol',
    specShort: 'Wellness Baseline',
  },
};

export const PROTOCOL_BY_SLUG: Record<string, ProtocolRecord> = Object.values(
  PROTOCOL_BY_TITLE
).reduce(
  (acc, rec) => {
    if (!acc[rec.slug]) acc[rec.slug] = rec;
    return acc;
  },
  {} as Record<string, ProtocolRecord>
);

export function resolveProtocol(title: string): ProtocolRecord | null {
  return PROTOCOL_BY_TITLE[title] ?? null;
}

export function formatDualLabel(title: string): string {
  const rec = resolveProtocol(title);
  if (!rec) return title;
  return `${rec.specShort} → ${rec.brandedTitle.split(' – ')[0]}`;
}

export type ProtocolRecommendation = {
  /** Full branded title (lexicon key) */
  protocolTitle: string;
  specCategory: string;
  specShort: string;
  brandedTitle: string;
  slug: string;
  confidence: number;
};

export function toRecommendation(title: string, confidence: number): ProtocolRecommendation {
  const rec = resolveProtocol(title);
  if (!rec) {
    return {
      protocolTitle: title,
      specCategory: title,
      specShort: title,
      brandedTitle: title,
      slug: '',
      confidence,
    };
  }
  return {
    protocolTitle: rec.brandedTitle,
    specCategory: rec.specCategory,
    specShort: rec.specShort,
    brandedTitle: rec.brandedTitle,
    slug: rec.slug,
    confidence,
  };
}
