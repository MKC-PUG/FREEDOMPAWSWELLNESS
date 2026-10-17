import { atHomeComfort } from '@/lib/ops/studio-research';

export type VendorVideoTopic = {
  id: string;
  title: string;
  vendor: string;
  product: string;
  teach: string;
  doNotSay: string;
  backgroundId: string;
};

/**
 * Video subjects matched to products Freedom Paws vendors carry.
 * A brace brand is not signed yet, so that row teaches the support and does not name a shop.
 */
export const VENDOR_VIDEO_TOPICS: VendorVideoTopic[] = [
  {
    id: 'vendor-hind-support',
    title: 'Hind-leg supports for stiff hips',
    vendor: 'Mobility brace partner (not signed yet)',
    product: 'Hind-leg support',
    teach:
      'A hind-leg support can steady a bright dog who is slow to rise or weak behind. It does not repair hip dysplasia or arthritis.',
    doNotSay: 'It repairs hip dysplasia, reverses arthritis, or replaces a veterinarian.',
    backgroundId: 'navy',
  },
  {
    id: 'vendor-ruffwear',
    title: 'A fitted harness for easy walks',
    vendor: 'Ruffwear',
    product: 'Outdoor harness',
    teach:
      'A harness spreads the pull across the chest for a short, easy walk. Fit it so two fingers slide under the straps.',
    doNotSay: 'A harness prevents injury or replaces a vet visit for a limp.',
    backgroundId: 'lake',
  },
  {
    id: 'vendor-native-pet',
    title: 'Joint toppers and easy movement',
    vendor: 'Native Pet',
    product: 'Joint and mobility nutrition',
    teach:
      'A joint topper is a food habit some owners add to a meal. It is not a treatment for sore hips.',
    doNotSay: 'The powder treats arthritis or hip dysplasia.',
    backgroundId: 'navy',
  },
  {
    id: 'vendor-whimzees',
    title: 'A daily dental chew',
    vendor: 'Whimzees',
    product: 'Vegetable dental chews',
    teach:
      'A vegetable dental chew can be part of a brushing routine. Brushing with dog toothpaste still does the daily work.',
    doNotSay: 'A chew replaces a dental cleaning or fixes gum disease.',
    backgroundId: 'hero',
  },
  {
    id: 'vendor-west-paw',
    title: 'A durable chew instead of rawhide',
    vendor: 'West Paw',
    product: 'Zogoflex chews',
    teach: 'A recyclable chew gives the dog something sturdy to gnaw while you supervise. It is not a dental treatment.',
    doNotSay: 'The chew cleans the teeth or is safe to leave with the dog alone.',
    backgroundId: 'hero',
  },
  {
    id: 'vendor-branch-basics',
    title: 'Floors and itchy skin',
    vendor: 'Branch Basics',
    product: 'Fragrance-free home concentrate',
    teach:
      'Fragrance-free cleaner on the floors a dog lies on can be part of an itch routine, along with a plain oatmeal bath when the skin is intact.',
    doNotSay: 'The cleaner treats allergies or replaces a vet visit for broken skin.',
    backgroundId: 'wellness',
  },
];

export function vendorFactCard(topic: VendorVideoTopic): string {
  return [
    `Vendor: ${topic.vendor}`,
    `Product: ${topic.product}`,
    topic.teach,
    `At-home comfort: ${atHomeComfort(`${topic.title} ${topic.product} ${topic.teach}`)}`,
    'Teach the product category. Do not add a buy button until that partner link is signed.',
    `Do not say: ${topic.doNotSay}`,
  ].join('\n');
}
