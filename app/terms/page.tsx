import type { Metadata } from 'next';
import LegalPageShell from '@/app/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Terms of Use • Freedom Paws Wellness',
  description: 'Freedom Paws Wellness terms of use — educational wellness platform, not veterinary care.',
};

export default function TermsPage() {
  return (
    <LegalPageShell
      kind="terms"
      title="Terms of Use"
      intro="By using Freedom Paws Wellness (app.freedompawsinc.com), you agree to these terms. The platform is wellness-first education — not a substitute for licensed veterinary care."
    />
  );
}
