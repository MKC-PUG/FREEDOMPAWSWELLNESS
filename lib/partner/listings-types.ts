export type ListingStatus = 'draft' | 'available' | 'pending' | 'adopted' | 'archived';

export type ListingSex = 'male' | 'female' | 'unknown';
export type ListingAgeBand = 'puppy' | 'young' | 'adult' | 'senior' | 'unknown';
export type ListingSize = 'small' | 'medium' | 'large' | 'xl' | 'unknown';

export type AdoptionListing = {
  id: string;
  shelterId: string;
  slug: string;
  displayName: string;
  breedPrimary: string;
  breedSecondary: string | null;
  sex: ListingSex;
  ageBand: ListingAgeBand;
  size: ListingSize | null;
  bio: string;
  status: ListingStatus;
  photoUrls: string[];
  primaryPhotoUrl: string | null;
  createdBy: string | null;
  publishedAt: string | null;
  adoptedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdoptionListingWithShelter = AdoptionListing & {
  shelterName: string;
  shelterSlug: string;
  shelterCity: string | null;
  shelterPhone: string | null;
  shelterWebsite: string | null;
};

export type CreateListingInput = {
  shelterId: string;
  displayName: string;
  breedPrimary: string;
  breedSecondary?: string | null;
  sex: ListingSex;
  ageBand: ListingAgeBand;
  size?: ListingSize | null;
  bio: string;
  photoUrls?: string[];
  primaryPhotoUrl?: string | null;
};

export type UpdateListingInput = Partial<
  Omit<CreateListingInput, 'shelterId'>
> & {
  status?: ListingStatus;
};
