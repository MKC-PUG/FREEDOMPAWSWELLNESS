export type Protocol = {
  slug: string;
  title: string;
  detect: string;
};

export const protocols: Protocol[] = [
  { slug: 'max-movement', title: 'Max Movement Pro – Joint Support', detect: 'Detects Gait Asymmetry' },
  { slug: 'freedom-calm', title: 'Freedom Calm – Anxiety Relief', detect: 'Analyzes Facial Stress' },
  { slug: 'liver-kidney-detox', title: 'Foundation Liver & Kidney Detox', detect: 'Detects Coat Dullness & Liver Markers' },
  { slug: 'gut-balance', title: "Buddy's Gut Balance & Cleanse", detect: 'Detects Digestive Patterns' },
  { slug: 'infrared-spine', title: 'Red Light Spine & Joint Support', detect: 'Detects Movement Asymmetry' },
  { slug: 'allergy-shield', title: 'Allergy Shield – Skin & Coat Glow', detect: 'Skin Pattern Recognition' },
  { slug: 'fresh-smile-dental', title: 'Fresh Smile Dental & Oral Health', detect: 'Plaque Detection' },
  { slug: 'heart-strong', title: 'Heart Strong Cardio-Support', detect: 'Monitors Stamina' },
  { slug: 'patriot-immune', title: 'Patriot Defender – Immunity & Vitality', detect: 'Holistic Pattern Recognition' },
  { slug: 'clear-vision', title: 'Clear Vision Defender – Eye Health Protocol', detect: 'Eye Change Analysis' },
];
