export type Protocol = {
  slug: string;
  title: string;
  detect: string;
};

export const protocols: Protocol[] = [
  { slug: 'max-movement', title: 'Max Movement Pro – Joint Support', detect: 'Altered gait, limping, or hesitation on stairs' },
  { slug: 'freedom-calm', title: 'Freedom Calm – Anxiety Relief', detect: 'Panting, pacing, hiding, or not settling' },
  { slug: 'liver-kidney-detox', title: 'Foundation Liver & Kidney Detox', detect: 'Thirst, appetite, energy, and how the coat looks' },
  { slug: 'gut-balance', title: "Buddy's Gut Balance & Cleanse", detect: 'Appetite, stool, and comfort after meals' },
  { slug: 'infrared-spine', title: 'Red Light Spine & Joint Support', detect: 'Slow to get up, turn, or climb' },
  { slug: 'allergy-shield', title: 'Allergy Shield – Skin & Coat Glow', detect: 'Dull coat, scratching, a bare patch, or a sore' },
  { slug: 'fresh-smile-dental', title: 'Fresh Smile Dental & Oral Health', detect: 'Tartar, a dark spot on a tooth, or one-sided chewing' },
  { slug: 'heart-strong', title: 'Heart Strong Cardio-Support', detect: 'Tiring on a usual walk, or hard breathing after rest' },
  { slug: 'patriot-immune', title: 'Patriot Defender – Immunity & Vitality', detect: 'Energy, appetite, play, and sleep' },
  { slug: 'clear-vision', title: 'Clear Vision Defender – Eye Health Protocol', detect: 'Cloudy eye, red eye, squinting, or rubbing' },
];
