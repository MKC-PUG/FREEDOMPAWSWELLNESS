import type { Metadata } from 'next';
import LegalPageShell from '@/app/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Privacy Policy • Freedom Paws Wellness',
  description: 'How Freedom Paws collects and uses data for ViT, Freedom Paws ID, and wellness features.',
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      kind="privacy"
      title="Privacy Policy"
      intro="Freedom Paws respects your privacy. This policy describes what we collect when you use ViT Diagnostics, Freedom Paws ID, My Pets, and partner referrals."
    />
  );
}
