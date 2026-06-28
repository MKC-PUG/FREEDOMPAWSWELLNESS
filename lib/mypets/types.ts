export type PetProfile = {
  id: string;
  name: string;
  breed: string;
  age: string;
  notes: string;
  /** Compressed JPEG data URL (~120px) — optional */
  photoThumb: string | null;
  /** Track 2 — linked microchip (9/10/15 digit), when set on server pet row */
  microchipId?: string | null;
  microchipLinkedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PetFormInput = {
  name: string;
  breed: string;
  age: string;
  notes: string;
  photoThumb: string | null;
};
