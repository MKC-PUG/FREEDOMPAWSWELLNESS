import type { Metadata } from 'next';
import Track2Planned from '../Track2Planned';

export const metadata: Metadata = {
  title: 'Scanner Kit • Freedom Paws ID',
  description: 'Freedom Paws universal microchip scanner kit — Track 2 retail.',
};

export default function IdKitPage() {
  return (
    <Track2Planned
      icon="🛒"
      title="Scanner kit"
      subtitle="Freedom Paws universal scanner kit for shelters and veterinarians — recommended pilot price $129 (founder decision pending)."
      targetDate="Jan 1, 2027"
      bullets={[
        'Bluetooth LF RFID reader + quick-start guide for shelter intake',
        'Works with Freedom Paws ID app — scan, lookup, link to biometric profile',
        'DAO shelter donation bundles: 3–5 kits per pilot partner (see cost report)',
        'Vet waitlist converts to kit orders at full launch promotion',
      ]}
    />
  );
}
