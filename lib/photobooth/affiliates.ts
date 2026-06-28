/** Photo Booth print & gift affiliates — URLs activate via env when agreements are signed. */

export type PhotoBoothAffiliateCategory =
  | 'framed-print'
  | 'drinkware'
  | 'home-decor'
  | 'pet-textiles'
  | 'greeting-cards';

export type PhotoBoothAffiliatePick = {
  id: string;
  brandName: string;
  label: string;
  description: string;
  category: PhotoBoothAffiliateCategory;
  emoji: string;
  /** Founder outreach targets — not shown to members until onboarded. */
  outreachTargets: string[];
  applyUrl: string | null;
  url: string | null;
  active: boolean;
};

export type PhotoBoothAffiliatesData = {
  moduleEnabled: boolean;
  picks: PhotoBoothAffiliatePick[];
  activeCount: number;
  hasActiveLinks: boolean;
  disclosure: string;
  contactEmail: string;
};

export const PHOTO_BOOTH_AFFILIATE_DISCLOSURE =
  'Freedom Paws may earn a commission if you order through a partner link. Print partners ship directly to you — Freedom Paws does not fulfill physical products. Upload your Photo Booth image on the partner site after we activate the link.';

export const PHOTO_BOOTH_AFFILIATE_CONTACT = 'partners@freedompawsinc.com';

type CatalogEntry = Omit<PhotoBoothAffiliatePick, 'url' | 'active'>;

/** Curated print-on-demand & framing targets — live when NEXT_PUBLIC_FP_PHOTO_AFF_*_URL is set. */
export const PHOTO_BOOTH_AFFILIATE_CATALOG: CatalogEntry[] = [
  {
    id: 'custom-framing',
    brandName: 'Custom framing partner',
    label: 'Framed & ready to display',
    emoji: '🖼️',
    category: 'framed-print',
    description:
      'Send any Photo Booth image to our framing partner — receive a professionally framed print, ready to hang in your home or office.',
    outreachTargets: ['Framebridge', 'Simply Framed', 'American Frame'],
    applyUrl: null,
  },
  {
    id: 'coffee-mug',
    brandName: 'Custom drinkware partner',
    label: 'Photo coffee mug',
    emoji: '☕',
    category: 'drinkware',
    description:
      'Put your pet’s Photo Booth portrait on a ceramic coffee mug — a daily reminder of your best friend with every sip.',
    outreachTargets: ['Shutterfly', 'VistaPrint', 'Zazzle'],
    applyUrl: null,
  },
  {
    id: 'photo-pillow',
    brandName: 'Custom home décor partner',
    label: 'Photo pillow',
    emoji: '🛋️',
    category: 'home-decor',
    description:
      'Print your Photo Booth creation on a soft throw pillow — perfect for couch, bed, or a gift for fellow pet lovers.',
    outreachTargets: ['Shutterfly', 'VistaPrint', 'Snapfish'],
    applyUrl: null,
  },
  {
    id: 'photo-blanket',
    brandName: 'Non-toxic textile partner',
    label: 'Photo blanket (non-toxic)',
    emoji: '🧸',
    category: 'pet-textiles',
    description:
      'Wrap up in a custom fleece or sherpa blanket with your pet’s portrait — non-toxic, pet-safe inks and materials only (no harmful dyes or chemical finishes).',
    outreachTargets: ['Printful', 'Shutterfly', 'VistaPrint', 'Zazzle'],
    applyUrl: null,
  },
  {
    id: 'greeting-cards',
    brandName: 'Holiday cards partner',
    label: 'Christmas & greeting cards',
    emoji: '💌',
    category: 'greeting-cards',
    description:
      'Turn your pet photo into Christmas cards, holiday announcements, or thank-you notes — mailed to family and friends.',
    outreachTargets: ['Minted', 'Shutterfly', 'Tiny Prints', 'Vistaprint'],
    applyUrl: null,
  },
];

export const PHOTO_BOOTH_AFFILIATE_CATEGORY_LABELS: Record<
  PhotoBoothAffiliateCategory,
  string
> = {
  'framed-print': 'Framed prints',
  drinkware: 'Drinkware',
  'home-decor': 'Home décor',
  'pet-textiles': 'Pet-safe textiles',
  'greeting-cards': 'Greeting cards',
};

function idToEnvKey(id: string): string {
  return id.replace(/-/g, '_').toUpperCase();
}

function envUrl(key: string): string | null {
  const v = process.env[key]?.trim();
  return v && v.startsWith('http') ? v : null;
}

function affiliatesModuleEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_FP_PHOTOBOOTH_AFFILIATES_ENABLED?.trim().toLowerCase();
  if (raw === '0' || raw === 'false' || raw === 'no') return false;
  return true;
}

function resolvePick(entry: CatalogEntry): PhotoBoothAffiliatePick {
  const envKey = idToEnvKey(entry.id);
  const url = envUrl(`NEXT_PUBLIC_FP_PHOTO_AFF_${envKey}_URL`);
  return { ...entry, url, active: Boolean(url) };
}

export function getPhotoBoothAffiliatesData(): PhotoBoothAffiliatesData {
  const moduleEnabled = affiliatesModuleEnabled();
  const picks = PHOTO_BOOTH_AFFILIATE_CATALOG.map(resolvePick);
  const activeCount = picks.filter((p) => p.active).length;

  return {
    moduleEnabled,
    picks,
    activeCount,
    hasActiveLinks: activeCount > 0,
    disclosure: PHOTO_BOOTH_AFFILIATE_DISCLOSURE,
    contactEmail: PHOTO_BOOTH_AFFILIATE_CONTACT,
  };
}

export type PhotoBoothAffiliateStatusSummary = {
  moduleEnabled: boolean;
  catalogCount: number;
  activeCount: number;
  byPick: { id: string; label: string; brandName: string; active: boolean }[];
  setupNote: string;
};

export function getPhotoBoothAffiliateStatus(): PhotoBoothAffiliateStatusSummary {
  const data = getPhotoBoothAffiliatesData();
  return {
    moduleEnabled: data.moduleEnabled,
    catalogCount: data.picks.length,
    activeCount: data.activeCount,
    byPick: data.picks.map((p) => ({
      id: p.id,
      label: p.label,
      brandName: p.brandName,
      active: p.active,
    })),
    setupNote:
      'After affiliate agreements are signed, set NEXT_PUBLIC_FP_PHOTO_AFF_{ID}_URL in .env.local (e.g. CUSTOM_FRAMING, COFFEE_MUG, PHOTO_PILLOW, PHOTO_BLANKET, GREETING_CARDS), then npm run vercel:env:push. Members see “Launching soon” until URLs are set.',
  };
}
