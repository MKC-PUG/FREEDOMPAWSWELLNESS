export type ChipFormat = 'iso_fdx_b' | 'avid_legacy_9' | 'trovan_10' | 'unknown';

export type ChipValidationStatus = 'valid' | 'invalid' | 'checksum_fail';

export type ChipValidationResult = {
  ok: boolean;
  status: ChipValidationStatus;
  normalized: string | null;
  digitCount: number;
  format: ChipFormat;
  checksumOk: boolean | null;
  display: string | null;
  error?: string;
  /** Non-blocking notice (e.g. practice test tag fails ISO checksum). */
  warning?: string;
};

export type ChipLookupResult = {
  freedomPawsMatch: boolean;
  petId?: string;
  petName?: string;
  freedomPawsId?: string;
  qrSlug?: string;
  enrollmentStatus?: string;
};

export type ChipScanSource = 'hid' | 'manual' | 'web_serial';
