import type { ChipFormat, ChipValidationResult, ChipValidationStatus } from '@/lib/id/chip-types';

const TEMP_SUFFIX = /temp\s+below\s+range/gi;

/** ISO 11784/11785 check digit for 15-digit IDs. */
export function isoMicrochipChecksumOk(fifteenDigits: string): boolean {
  if (!/^\d{15}$/.test(fifteenDigits)) return false;
  let sum = 0;
  for (let i = 0; i < 14; i += 1) {
    const n = Number(fifteenDigits[i]);
    sum += i % 2 === 0 ? n : n * 3;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === Number(fifteenDigits[14]);
}

export function detectChipFormat(digits: string): ChipFormat {
  if (digits.length === 15) return 'iso_fdx_b';
  if (digits.length === 9) return 'avid_legacy_9';
  if (digits.length === 10) return 'trovan_10';
  return 'unknown';
}

/** Extract chip digits from scanner wedge, PuTTY, or paste (WorldScan suffixes stripped). */
export function extractChipDigits(raw: string): string | null {
  const cleaned = raw.replace(TEMP_SUFFIX, ' ').replace(/,/g, ' ').trim();
  const digitsOnly = cleaned.replace(/\D/g, '');

  if (digitsOnly.length === 9 || digitsOnly.length === 10 || digitsOnly.length === 15) {
    return digitsOnly;
  }

  const isoMatch = digitsOnly.match(/\d{15}/);
  if (isoMatch) return isoMatch[0];

  const tenMatch = digitsOnly.match(/\d{10}/);
  if (tenMatch) return tenMatch[0];

  const nineMatch = digitsOnly.match(/\d{9}/);
  if (nineMatch) return nineMatch[0];

  return null;
}

export function validateChipRaw(raw: string): ChipValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      ok: false,
      status: 'invalid',
      normalized: null,
      digitCount: 0,
      format: 'unknown',
      checksumOk: null,
      display: null,
      error: 'Enter or scan a microchip ID.',
    };
  }

  const normalized = extractChipDigits(trimmed);
  if (!normalized) {
    return {
      ok: false,
      status: 'invalid',
      normalized: null,
      digitCount: 0,
      format: 'unknown',
      checksumOk: null,
      display: null,
      error: 'Could not find a 9-, 10-, or 15-digit chip ID.',
    };
  }

  const format = detectChipFormat(normalized);
  const digitCount = normalized.length;
  let status: ChipValidationStatus = 'valid';
  let checksumOk: boolean | null = null;
  let ok = true;

  let warning: string | undefined;

  if (format === 'iso_fdx_b') {
    checksumOk = isoMicrochipChecksumOk(normalized);
    if (!checksumOk) {
      status = 'checksum_fail';
      // Practice / demo tags often fail ISO checksum — still linkable for pilot QA.
      warning =
        'ISO checksum did not validate (common on test tags). You can still save this ID for pilot testing.';
    }
  }

  if (format === 'unknown') {
    status = 'invalid';
    ok = false;
  }

  return {
    ok,
    status,
    normalized,
    digitCount,
    format,
    checksumOk,
    display: normalized,
    warning,
    error: ok
      ? undefined
      : 'Unsupported chip ID length.',
  };
}
