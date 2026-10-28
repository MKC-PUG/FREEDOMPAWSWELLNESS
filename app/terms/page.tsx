import type { Metadata } from 'next';
import LegalPageShell from '@/app/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Terms of Use • Freedom Paws Wellness',
  description: 'Freedom Paws Wellness terms of use — educational wellness platform, not veterinary care.',
};

export default function TermsPage() {
  return (
    <LegalPageShell kind="terms" />
  );
}
