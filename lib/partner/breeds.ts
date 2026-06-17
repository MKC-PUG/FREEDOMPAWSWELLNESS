/** Curated shelter breed list — primary dropdown (~50 + mixed + unknown). */

export const BREED_MIXED = 'Mixed breed';
export const BREED_UNKNOWN = 'Unknown';

export const ADOPTION_BREEDS = [
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'American Pit Bull Terrier',
  'Chihuahua',
  'Beagle',
  'Boxer',
  'Dachshund',
  'Australian Shepherd',
  'Yorkshire Terrier',
  'Bulldog',
  'Poodle',
  'Rottweiler',
  'Siberian Husky',
  'Shih Tzu',
  'Great Dane',
  'Doberman Pinscher',
  'Miniature Schnauzer',
  'Cavalier King Charles Spaniel',
  'Border Collie',
  'Cocker Spaniel',
  'Maltese',
  'Bernese Mountain Dog',
  'Havanese',
  'English Springer Spaniel',
  'Shetland Sheepdog',
  'Boston Terrier',
  'Pembroke Welsh Corgi',
  'Mastiff',
  'Basset Hound',
  'Vizsla',
  'Belgian Malinois',
  'Collie',
  'Rhodesian Ridgeback',
  'Newfoundland',
  'Weimaraner',
  'Chesapeake Bay Retriever',
  'Akita',
  'Bloodhound',
  'Saint Bernard',
  'Bull Terrier',
  'Alaskan Malamute',
  'Whippet',
  'Greyhound',
  'Terrier (generic)',
  'Hound (generic)',
  'Herding (generic)',
  'Retriever (generic)',
  BREED_MIXED,
  BREED_UNKNOWN,
] as const;

export type AdoptionBreed = (typeof ADOPTION_BREEDS)[number];

export const ADOPTION_SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' },
] as const;

export const ADOPTION_AGE_BANDS = [
  { value: 'puppy', label: 'Puppy' },
  { value: 'young', label: 'Young' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
  { value: 'unknown', label: 'Unknown' },
] as const;

export const ADOPTION_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
  { value: 'unknown', label: 'Unknown' },
] as const;

export const LISTING_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  available: 'Available',
  pending: 'Pending adoption',
  adopted: 'Adopted',
  archived: 'Archived',
};

export const PUBLIC_LISTING_STATUSES = ['available', 'pending'] as const;
