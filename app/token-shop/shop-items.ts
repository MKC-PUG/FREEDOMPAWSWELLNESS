export type TokenShopItem = {
  slug: string;
  cardTitle: string;
  detailTitle?: string;
  subtitle?: string;
  detect: string;
  features: string[];
};

export const SHOP_PRICE = { xrp: 25, rlusd: 18 } as const;

export const tokenShopItems: TokenShopItem[] = [
  {
    slug: 'max-movement',
    cardTitle: 'Max Movement Pro – Joint Support',
    detect: 'Detects Gait Asymmetry',
    features: [
      'AI-powered mobility support for senior & working dogs',
      'Vision Transformer (ViT) AI provides gait analysis',
      'Personalized whole-food anti-inflammatory diet & lifestyle plan',
      'Lifetime educational access via Dynamic NFT or MPT',
      'Every purchase funds no-kill shelters & veteran-dog lake meetups',
    ],
  },
  {
    slug: 'freedom-calm',
    cardTitle: 'Freedom Calm – Anxiety Relief',
    detect: 'Analyzes Facial Stress',
    features: [
      'Natural calm for anxious and working dogs',
      'Vision Transformer (ViT) AI detects stress & breathing patterns',
      'Personalized whole-food calming nutrition plan',
      'Shaded lake relaxation lifestyle guidance',
      'Lifetime educational access via Dynamic NFT or MPT',
      'Every purchase funds no-kill shelters & veteran-dog lake meetups',
    ],
  },
  {
    slug: 'liver-kidney-detox',
    cardTitle: 'Foundation Liver & Kidney Detox',
    subtitle: 'Gentle support for vital organs',
    detect: 'Detects Coat Dullness & Liver Markers',
    features: [
      'Vision Transformer (ViT) AI identifies early liver/kidney stress markers',
      'Personalized whole-food cleansing diet',
      'Hydration-focused lake lifestyle guidance',
      'Lifetime educational access via Dynamic NFT or MPT',
    ],
  },
  {
    slug: 'gut-balance',
    cardTitle: "Buddy's Gut Balance & Cleanse",
    detect: 'Detects Digestive Patterns',
    features: [
      'Vision Transformer (ViT) AI analyzes digestive patterns & gut signals',
      'Personalized whole-food gut-support diet',
      'Calm lifestyle routines for better digestion',
      'Lifetime educational access via Dynamic NFT or MPT',
    ],
  },
  {
    slug: 'fresh-smile-dental',
    cardTitle: 'Fresh Smile Dental & Oral Health',
    detect: 'Dental Plaque Detection',
    features: [
      'Bright smiles and healthy gums',
      'Vision Transformer (ViT) AI analyzes teeth, gums & oral markers',
      'Personalized dental-supporting whole-food diet',
      'Gentle chewing and lake-walk lifestyle guidance',
      'Lifetime educational access via Dynamic NFT or MPT',
    ],
  },
  {
    slug: 'heart-strong',
    cardTitle: 'Heart Strong Cardio-Support',
    detailTitle: 'Heart Strong Cardiovascular Support',
    detect: 'Monitors Stamina',
    features: [
      'Strong heart, strong life',
      'Vision Transformer (ViT) AI evaluates heart & cardiovascular indicators',
      'Personalized heart-healthy whole-food diet',
      'Moderate lake-walk and exercise lifestyle plan',
      'Lifetime educational access via Dynamic NFT or MPT',
    ],
  },
  {
    slug: 'infrared-spine',
    cardTitle: 'Red Light Spine & Joint Support',
    detect: 'Detects Movement Asymmetry',
    features: [
      'Targeted spinal and joint comfort',
      'Vision Transformer (ViT) AI detects spine & joint alignment issues',
      'Gentle swimming and lake-walk lifestyle plan',
      'Lifetime educational access via Dynamic NFT or MPT',
    ],
  },
  {
    slug: 'allergy-shield',
    cardTitle: 'Allergy Shield – Skin & Coat Glow',
    detect: 'Skin Pattern Recognition',
    features: [
      'Vision Transformer (ViT) AI identifies skin, coat & allergy patterns',
      'Personalized whole-food anti-inflammatory diet',
      'Grooming-focused lifestyle routines for coat health',
      'Lifetime educational access via Dynamic NFT or MPT',
    ],
  },
  {
    slug: 'patriot-immune',
    cardTitle: 'Patriot Immune Defender – Immunity & Vitality',
    detailTitle: 'Patriot Immune Defender – Overall Immunity & Vitality',
    detect: 'Holistic Pattern Recognition',
    features: [
      'Vision Transformer (ViT) AI assesses overall vitality & immune markers',
      'Personalized immune-boosting whole-food diet',
      'Moderate exercise and lake-walk lifestyle guidance',
      'Lifetime educational access via Dynamic NFT or MPT',
      'Every purchase funds no-kill shelters & veteran-dog lake meetups',
    ],
  },
  {
    slug: 'clear-vision',
    cardTitle: 'Clear Vision Defender – Eye Health Protocol',
    detect: 'Eye Change Analysis',
    features: [
      'Protect and support clear vision',
      'Vision Transformer (ViT) AI detects early eye changes & redness',
      'Personalized antioxidant-rich whole-food diet',
      'Shaded lake-walk and gentle eye-care routines',
      'Lifetime educational access via Dynamic NFT or MPT',
    ],
  },
];
