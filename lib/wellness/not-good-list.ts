/**
 * Freedom Paws not-good-for-your-dog list.
 * Locked: a label result may name an entry only when the printed words match.
 * The camera does not test for metals, bacteria, mycotoxins, or cancer.
 * Cancer notes cite a human toxicology listing. They are not a finding that this bag causes cancer in this dog.
 */

export type HazardTier = 'poison' | 'cancer_note' | 'regulatory_watch' | 'optimum';

export type LabelCategory = 'food' | 'treat' | 'chew' | 'toy';

export type HazardEntry = {
  id: string;
  tier: HazardTier;
  title: string;
  /** Normalized phrases. Matching is whole-phrase, after lowercasing. */
  phrases: string[];
  /** If one of these phrases is present, do not count a shorter phrase inside it. */
  suppressPhrases?: string[];
  categories: Array<LabelCategory | 'household' | 'any'>;
  note: string;
  sourceName: string;
  sourceUrl: string;
};

export const TIER_LABEL: Record<HazardTier, string> = {
  poison: 'Known hazard',
  cancer_note: 'Cancer-related toxicology note',
  regulatory_watch: 'Agency or company watch',
  optimum: 'Optimum-health list',
};

export const NOT_A_LAB_TEST =
  'This is not a laboratory test. A photo cannot see heavy metals, bacteria, mycotoxins, aflatoxin, or anything the label does not print. No hit is not a finding that the product is safe, non-toxic, or free of contaminants.';

export const HAZARD_ENTRIES: HazardEntry[] = [
  {
    id: 'xylitol',
    tier: 'poison',
    title: 'Xylitol (birch sugar)',
    phrases: ['xylitol', 'birch sugar'],
    categories: ['any', 'household'],
    note: 'ASPCA and FDA: xylitol can drop a dog’s blood sugar and injure the liver. Gum, toothpaste, and some peanut butters use it.',
    sourceName: 'ASPCA Poison Control — people foods to avoid',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
  {
    id: 'chocolate',
    tier: 'poison',
    title: 'Chocolate, cocoa, or cacao',
    phrases: ['chocolate', 'cocoa', 'cacao', 'theobromine'],
    categories: ['any', 'household'],
    note: 'ASPCA: methylxanthines in chocolate can cause vomiting, heart rhythm changes, tremors, and seizures. Darker chocolate and cocoa powder carry more.',
    sourceName: 'ASPCA Poison Control — people foods to avoid',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
  {
    id: 'caffeine',
    tier: 'poison',
    title: 'Caffeine, coffee, or guarana',
    phrases: ['caffeine', 'coffee', 'guarana'],
    categories: ['any', 'household'],
    note: 'ASPCA groups caffeine with chocolate. It can cause restlessness, abnormal heart rhythm, and tremors.',
    sourceName: 'ASPCA Poison Control — people foods to avoid',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
  {
    id: 'grapes',
    tier: 'poison',
    title: 'Grapes, raisins, currants, or sultanas',
    phrases: ['grape', 'grapes', 'raisin', 'raisins', 'currant', 'currants', 'sultana', 'sultanas'],
    suppressPhrases: ['grape seed', 'grapeseed'],
    categories: ['any', 'household'],
    note: 'ASPCA: grapes and raisins can injure a dog’s kidneys. Grape seed extract is a different ingredient and is not this hit.',
    sourceName: 'ASPCA Poison Control — people foods to avoid',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
  {
    id: 'allium',
    tier: 'poison',
    title: 'Onion, garlic, chives, leeks, or shallots',
    phrases: [
      'onion',
      'onions',
      'onion powder',
      'garlic',
      'garlic powder',
      'chive',
      'chives',
      'leek',
      'leeks',
      'shallot',
      'shallots',
    ],
    categories: ['any', 'household'],
    note: 'ASPCA: these alliums can irritate the gut and damage red blood cells. The scan only sees the word. It does not measure the amount.',
    sourceName: 'ASPCA Poison Control — people foods to avoid',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
  {
    id: 'macadamia',
    tier: 'poison',
    title: 'Macadamia nuts',
    phrases: ['macadamia'],
    categories: ['any', 'household'],
    note: 'ASPCA: macadamia nuts can cause weakness, vomiting, tremors, and a high temperature in dogs.',
    sourceName: 'ASPCA Poison Control — people foods to avoid',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
  {
    id: 'hops',
    tier: 'poison',
    title: 'Hops',
    phrases: ['hops', 'humulus'],
    categories: ['any', 'household'],
    note: 'ASPCA: hops can cause a dangerous high temperature in dogs. Brewing hops are the concern, not a trace word to ignore.',
    sourceName: 'ASPCA — hops',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/hops',
  },
  {
    id: 'alcohol',
    tier: 'poison',
    title: 'Alcohol',
    phrases: ['alcohol', 'ethanol', 'ethyl alcohol'],
    categories: ['any', 'household'],
    note: 'ASPCA: alcohol can depress the nervous system and, in enough quantity, kill. A product that lists alcohol is on this list.',
    sourceName: 'ASPCA Poison Control — people foods to avoid',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
  {
    id: 'essential-oils',
    tier: 'poison',
    title: 'Essential oils that are hard on dogs',
    phrases: [
      'tea tree',
      'melaleuca',
      'pennyroyal',
      'wintergreen',
      'methyl salicylate',
      'clove oil',
      'cinnamon oil',
      'oregano oil',
      'thyme oil',
      'eucalyptus oil',
      'peppermint oil',
      'pine oil',
    ],
    categories: ['any', 'household'],
    note: 'Concentrated oils can irritate the mouth, skin, and nervous system. A culinary herb in a food is not the same as an oil. This hit is for the oil words above.',
    sourceName: 'ASPCA — people foods and household hazards',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
  {
    id: 'bha',
    tier: 'cancer_note',
    title: 'BHA (butylated hydroxyanisole)',
    phrases: ['bha', 'butylated hydroxyanisole'],
    categories: ['food', 'treat', 'chew'],
    note: 'The National Toxicology Program lists BHA as reasonably anticipated to be a human carcinogen. That is a human toxicology listing, not a test of this bag and not a finding that this food gives your dog cancer. Freedom Paws Safe Picks exclude it.',
    sourceName: 'National Toxicology Program, Report on Carcinogens',
    sourceUrl: 'https://ntp.niehs.nih.gov/whatwestudy/assessments/cancer/roc',
  },
  {
    id: 'potassium-bromate',
    tier: 'cancer_note',
    title: 'Potassium bromate',
    phrases: ['potassium bromate'],
    categories: ['food', 'treat'],
    note: 'California Proposition 65 lists potassium bromate for cancer. It is uncommon on a dog-food label. This scan did not test the bag.',
    sourceName: 'California Office of Environmental Health Hazard Assessment, Proposition 65',
    sourceUrl: 'https://oehha.ca.gov/proposition-65/proposition-65-list',
  },
  {
    id: 'ethoxyquin',
    tier: 'regulatory_watch',
    title: 'Ethoxyquin',
    phrases: ['ethoxyquin'],
    categories: ['food', 'treat', 'chew'],
    note: 'Ethoxyquin has been allowed in animal feed at limited levels. It was nominated for National Toxicology Program study because of uncertainty about toxicity. Freedom Paws Safe Picks exclude it. This is not a cancer diagnosis.',
    sourceName: 'NTP nomination background for ethoxyquin',
    sourceUrl: 'https://ntp.niehs.nih.gov/sites/default/files/ntp/htdocs/chem_background/exsumpdf/ethoxyquin_508.pdf',
  },
  {
    id: 'fda-dcm-ingredients',
    tier: 'regulatory_watch',
    title: 'Peas, lentils, or potatoes high on a diet the FDA has investigated',
    phrases: [
      'peas',
      'pea protein',
      'pea fiber',
      'pea flour',
      'lentil',
      'lentils',
      'chickpea',
      'chickpeas',
      'potato',
      'potatoes',
      'sweet potato',
      'sweet potatoes',
    ],
    categories: ['food', 'treat'],
    note: 'FDA has investigated a possible link between some diets — often with peas, lentils, or potatoes — and a heart-muscle disease in dogs. The agency did not prove that every food with these words is harmful. This hit means the words are on that watch list.',
    sourceName: 'FDA investigation into certain diets and canine dilated cardiomyopathy',
    sourceUrl:
      'https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy',
  },
  {
    id: 'bht-tbhq',
    tier: 'optimum',
    title: 'BHT, TBHQ, or propyl gallate',
    phrases: ['bht', 'butylated hydroxytoluene', 'tbhq', 'tertiary butylhydroquinone', 'propyl gallate'],
    categories: ['food', 'treat', 'chew'],
    note: 'Synthetic preservatives on the Freedom Paws optimum-health list. Safe Picks exclude BHT. These are not listed here as proven canine carcinogens.',
    sourceName: 'Freedom Paws Safe Picks criteria',
    sourceUrl: 'https://app.freedompawsinc.com/wellness/safe-products',
  },
  {
    id: 'colors',
    tier: 'optimum',
    title: 'Unnecessary artificial colors',
    phrases: [
      'red 40',
      'red no 40',
      'yellow 5',
      'yellow no 5',
      'yellow 6',
      'yellow no 6',
      'blue 1',
      'blue 2',
      'blue no 1',
      'blue no 2',
      'allura red',
      'tartrazine',
      'sunset yellow',
      'caramel color',
      'artificial color',
      'artificial colors',
      'fd and c',
    ],
    categories: ['food', 'treat', 'chew', 'toy'],
    note: 'Freedom Paws leaves unnecessary colors off the optimum-health list. Some caramel colorings are discussed for 4-MEI. The label usually does not say which form. This hit is the color word, not a cancer test.',
    sourceName: 'Freedom Paws owner-empowerment standard',
    sourceUrl: 'https://app.freedompawsinc.com/wellness/not-good-list',
  },
  {
    id: 'artificial-flavor',
    tier: 'optimum',
    title: 'Artificial flavor or artificial sweetener',
    phrases: ['artificial flavor', 'artificial flavors', 'artificial sweetener', 'artificial sweeteners'],
    categories: ['food', 'treat', 'chew'],
    note: 'Unnecessary flavors and sweeteners are on the Freedom Paws optimum-health list. Xylitol, if printed, is also a separate known hazard.',
    sourceName: 'Freedom Paws owner-empowerment standard',
    sourceUrl: 'https://app.freedompawsinc.com/wellness/not-good-list',
  },
  {
    id: 'propylene-glycol',
    tier: 'optimum',
    title: 'Propylene glycol',
    phrases: ['propylene glycol'],
    categories: ['food', 'treat'],
    note: 'Used in some semi-moist foods. Freedom Paws leaves it off the optimum-health list. This is not the same chemical as ethylene glycol in antifreeze.',
    sourceName: 'Freedom Paws owner-empowerment standard',
    sourceUrl: 'https://app.freedompawsinc.com/wellness/not-good-list',
  },
  {
    id: 'carrageenan',
    tier: 'optimum',
    title: 'Carrageenan',
    phrases: ['carrageenan'],
    categories: ['food', 'treat'],
    note: 'A thickener on the Freedom Paws watch list. Food-grade carrageenan is not the degraded form discussed in some cancer research. This hit does not say the product causes cancer.',
    sourceName: 'Freedom Paws owner-empowerment standard',
    sourceUrl: 'https://app.freedompawsinc.com/wellness/not-good-list',
  },
  {
    id: 'menadione',
    tier: 'optimum',
    title: 'Menadione (synthetic vitamin K3)',
    phrases: ['menadione'],
    categories: ['food', 'treat'],
    note: 'A synthetic vitamin K. Freedom Paws prefers nutrients in a whole-food form when that form can meet the need. This is not an ASPCA poison-control listing.',
    sourceName: 'Freedom Paws owner-empowerment standard',
    sourceUrl: 'https://app.freedompawsinc.com/wellness/not-good-list',
  },
  {
    id: 'rawhide',
    tier: 'optimum',
    title: 'Rawhide',
    phrases: ['rawhide'],
    categories: ['chew', 'toy', 'treat'],
    note: 'Freedom Paws Safe Picks do not use rawhide as a primary chew. It can swell and block the gut. This is a chew hazard, not a cancer finding.',
    sourceName: 'Freedom Paws Safe Picks criteria',
    sourceUrl: 'https://app.freedompawsinc.com/wellness/safe-products',
  },
  {
    id: 'hard-chew',
    tier: 'optimum',
    title: 'Antler or hard nylon',
    phrases: ['antler', 'nylon'],
    categories: ['chew', 'toy'],
    note: 'Freedom Paws does not recommend antlers or rock-hard nylon. They can break teeth. This is not a toxicity test.',
    sourceName: 'Freedom Paws owner-empowerment standard',
    sourceUrl: 'https://app.freedompawsinc.com/wellness/not-good-list',
  },
  {
    id: 'contact-chemicals',
    tier: 'regulatory_watch',
    title: 'BPA, phthalates, or lead printed on the item',
    phrases: ['bpa', 'phthalate', 'phthalates', 'lead'],
    categories: ['toy', 'chew'],
    note: 'If the package prints these words, they are on the watch list. A photo cannot measure lead or phthalates that are not printed.',
    sourceName: 'FDA food-contact phthalate evaluation',
    sourceUrl: 'https://www.fda.gov/food/food-chemical-safety/list-select-chemicals-food-supply-under-fda-review',
  },
];

export const HOUSEHOLD_ONLY: HazardEntry[] = [
  {
    id: 'household-meds',
    tier: 'poison',
    title: 'Ibuprofen, naproxen, or acetaminophen',
    phrases: ['ibuprofen', 'naproxen', 'acetaminophen', 'tylenol', 'advil', 'aleve'],
    categories: ['household'],
    note: 'Human pain tablets are a common dog poison. Do not give a human pain tablet because a person would take one.',
    sourceName: 'ASPCA Poison Control',
    sourceUrl: 'https://www.aspca.org/pet-care/animal-poison-control',
  },
  {
    id: 'antifreeze',
    tier: 'poison',
    title: 'Ethylene glycol (antifreeze)',
    phrases: ['ethylene glycol', 'antifreeze'],
    categories: ['household'],
    note: 'A small lick of ethylene glycol antifreeze can injure the kidneys. Propylene glycol in a food label is a different chemical and a different list entry.',
    sourceName: 'ASPCA Poison Control',
    sourceUrl: 'https://www.aspca.org/pet-care/animal-poison-control',
  },
  {
    id: 'yeast-dough',
    tier: 'poison',
    title: 'Raw yeast dough',
    phrases: ['raw dough', 'yeast dough', 'bread dough'],
    categories: ['household'],
    note: 'ASPCA: raw yeast dough can expand in the stomach and produce alcohol. Baked bread and a vitamin named “yeast” are not this item.',
    sourceName: 'ASPCA Poison Control — people foods to avoid',
    sourceUrl: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets',
  },
];

export function normalizeLabelText(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function preparedText(normalized: string, suppressPhrases: string[] | undefined): string {
  let text = ` ${normalized} `;
  const suppress = [...(suppressPhrases ?? [])].sort((a, b) => b.length - a.length);
  for (const phrase of suppress) {
    text = text.split(` ${phrase} `).join(' ');
  }
  return text;
}

function textHasPhrase(prepared: string, phrase: string): boolean {
  return prepared.includes(` ${phrase} `);
}

export type HazardHit = HazardEntry & { matchedPhrases: string[] };

export function matchNotGoodList(raw: string, category: LabelCategory): HazardHit[] {
  const normalized = normalizeLabelText(raw);
  if (!normalized) return [];

  const hits: HazardHit[] = [];
  for (const entry of HAZARD_ENTRIES) {
    const allowed =
      entry.categories.includes('any') || entry.categories.includes(category);
    if (!allowed) continue;
    const prepared = preparedText(normalized, entry.suppressPhrases);
    const matchedPhrases = entry.phrases.filter((phrase) => textHasPhrase(prepared, phrase));
    if (matchedPhrases.length > 0) hits.push({ ...entry, matchedPhrases });
  }
  return hits;
}

export function listForReading(): HazardEntry[] {
  return [...HAZARD_ENTRIES, ...HOUSEHOLD_ONLY];
}
