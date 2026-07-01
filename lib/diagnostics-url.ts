/** Query keys kept when cleaning upload params from /diagnostics URLs. */
const PRESERVED_PARAMS = ['petId', 'pet', 'mode'] as const;

export type DiagnosticsUrlParams = {
  petId?: string | null;
  pet?: string | null;
  mode?: string | null;
  uploaded?: string | null;
  uploadId?: string | null;
  uploadError?: string | null;
};

export function buildDiagnosticsPath(params: DiagnosticsUrlParams = {}): string {
  const sp = new URLSearchParams();
  const petId = params.petId?.trim();
  const pet = params.pet?.trim();
  const mode = params.mode?.trim();

  if (petId) sp.set('petId', petId);
  if (pet) sp.set('pet', pet);
  if (mode === 'identity') sp.set('mode', 'identity');
  if (params.uploaded) sp.set('uploaded', params.uploaded);
  if (params.uploadId) sp.set('uploadId', params.uploadId);
  if (params.uploadError) sp.set('uploadError', params.uploadError);

  const qs = sp.toString();
  return qs ? `/diagnostics?${qs}` : '/diagnostics';
}

/** Read pet/mode params from the current browser URL. */
export function readDiagnosticsParamsFromSearch(search: string): Pick<
  DiagnosticsUrlParams,
  'petId' | 'pet' | 'mode'
> {
  const sp = new URLSearchParams(search);
  return {
    petId: sp.get('petId'),
    pet: sp.get('pet'),
    mode: sp.get('mode'),
  };
}

/** Strip upload redirect params; keep petId, pet, and mode=identity. */
export function diagnosticsPathWithoutUploadParams(search = ''): string {
  const sp = new URLSearchParams(search);
  sp.delete('uploaded');
  sp.delete('uploadId');
  sp.delete('uploadError');

  const kept = new URLSearchParams();
  for (const key of PRESERVED_PARAMS) {
    const value = sp.get(key);
    if (value) kept.set(key, value);
  }

  const qs = kept.toString();
  return qs ? `/diagnostics?${qs}` : '/diagnostics';
}

/** Build returnTo for Direct Upload — path only, preserves pet context. */
export function diagnosticsReturnTo(params: Pick<DiagnosticsUrlParams, 'petId' | 'pet' | 'mode'>): string {
  return buildDiagnosticsPath(params);
}
