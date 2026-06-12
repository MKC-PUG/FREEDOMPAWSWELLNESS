/** Freedom Paws ID — biometric (Track 1) + chip (Track 2) types */

export type IdUserRole =
  | 'owner'
  | 'shelter_admin'
  | 'shelter_staff'
  | 'vet_staff'
  | 'fp_ops';

export type BiometricEnrollmentStatus = 'draft' | 'complete' | 'consented' | 'revoked';

export type IdentityRegion = 'eyes' | 'face' | 'body' | 'posture' | 'gait';

export const IDENTITY_REGIONS: IdentityRegion[] = [
  'eyes',
  'face',
  'body',
  'posture',
  'gait',
];

export type MatchReviewStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'insufficient_evidence';

export type FoundDogReportStatus =
  | 'submitted'
  | 'searching'
  | 'candidates_ready'
  | 'matched'
  | 'closed';

/** Per-region capture stored during enrollment */
export type EnrollmentRegionCapture = {
  region: IdentityRegion;
  mediaId: string;
  storageUrl?: string;
  qualityScore: number;
  descriptors: string[];
  analyzedAt: string;
};

/** Track 1 — biometric enrollment record */
export type BiometricEnrollment = {
  id: string;
  petId: string;
  ownerId: string;
  status: BiometricEnrollmentStatus;
  regions: Partial<Record<IdentityRegion, EnrollmentRegionCapture>>;
  embeddingId: string | null;
  embeddingModelVersion: string | null;
  freedomPawsId: string;
  qrSlug: string;
  consentedAt: string | null;
  consentVersion: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Track 1 — found dog intake */
export type FoundDogReport = {
  id: string;
  shelterId: string | null;
  reporterId: string;
  reporterRole: IdUserRole;
  mediaIds: string[];
  notes: string | null;
  queryEmbeddingId: string | null;
  status: FoundDogReportStatus;
  createdAt: string;
  updatedAt: string;
};

/** Match candidate (shelter review only) */
export type MatchCandidate = {
  id: string;
  foundReportId: string;
  enrolledPetId: string;
  enrollmentId: string;
  similarityScore: number;
  reviewStatus: MatchReviewStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

/** Track 2 — chip link (deferred) */
export type ChipLink = {
  id: string;
  petId: string;
  chipRaw: string;
  iso15: string | null;
  manufacturerPrefix: string | null;
  registryHint: string | null;
  linkedAt: string;
};

export type ScanEvent = {
  id: string;
  chipRaw: string;
  scannerDeviceId: string | null;
  actorId: string;
  actorRole: IdUserRole;
  registryLookupResult: string | null;
  matchedPetId: string | null;
  createdAt: string;
};

/** Vision API — identity region analysis result */
export type IdentityRegionResult = {
  region: IdentityRegion;
  descriptors: string[];
  qualityScore: number;
  qualityIssues: string[];
  postureClass?: string;
  gaitDescriptor?: string;
  limbSymmetry?: 'symmetric' | 'mild_asymmetry' | 'marked_asymmetry' | 'unknown';
};

export type IdentityAnalysisResult = {
  regions: Partial<Record<IdentityRegion, IdentityRegionResult>>;
  fusedDescriptorText: string;
  enrollReady: boolean;
  disclaimer: string;
};

export type AnalyzeMode = 'wellness' | 'identity' | 'both';

/** Default match threshold — tune during CA/TN pilot */
export const ID_MATCH_THRESHOLD_DEFAULT = 0.72;

/** Pilot regions (founder decision F) */
export const ID_PILOT_STATES = ['California', 'Tennessee'] as const;
