export type PetProfile = {
  id: string;
  name: string;
  breed: string;
  age: string;
  notes: string;
  /** Compressed JPEG data URL (~120px) — optional */
  photoThumb: string | null;
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
