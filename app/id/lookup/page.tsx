import type { Metadata } from 'next';
import Track2Planned from '../Track2Planned';

export const metadata: Metadata = {
  title: 'Registry Lookup • Freedom Paws ID',
  description: 'AAHA microchip registry routing and AVID branch — Track 2.',
};

export default function IdLookupPage() {
  return (
    <Track2Planned
      icon="🔍"
      title="Registry lookup"
      subtitle="Route scanned chip IDs to AAHA participating registries and handle AVID non-participant flows — without exposing owner PII on public pages."
      targetDate="Dec 15, 2026"
      bullets={[
        'AAHA Universal Lookup API integration (participating registries)',
        'AVID non-participant branch with shelter/vet escalation path',
        'Owner contact only after shelter staff review — same policy as biometric match',
        'Audit log of lookup attempts for pilot shelters',
      ]}
    />
  );
}
