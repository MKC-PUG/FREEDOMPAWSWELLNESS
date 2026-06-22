import VitProAnalyzeClient from '../../components/VitProAnalyzeClient';
import { VitProBadge, VitProPageShell } from '../../components/VitProUi';

export default function VitProAnalyzePage() {
  return (
    <VitProPageShell
      title="CDS Analyze"
      subtitle="Structured clinical decision support report with literature citations. Toggle Tier B (vet) vs Tier A (owner preview)."
      badge={<VitProBadge status="foundation" />}
    >
      <VitProAnalyzeClient />
    </VitProPageShell>
  );
}
