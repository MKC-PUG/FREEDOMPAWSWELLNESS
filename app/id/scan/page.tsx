import type { Metadata } from 'next';
import Track2Planned from '../Track2Planned';

export const metadata: Metadata = {
  title: 'Microchip Scan • Freedom Paws ID',
  description: 'Universal LF RFID scanner for 125, 128, and 134.2 kHz chips — Track 2.',
};

export default function IdScanPage() {
  return (
    <Track2Planned
      icon="📡"
      title="Microchip scan"
      subtitle="Bluetooth universal scanner reads 125 kHz, 128 kHz, and 134.2 kHz (ISO) implanted chips — then links to your biometric Freedom Paws ID profile."
      targetDate="Nov 15, 2026"
      bullets={[
        'Pair Freedom Paws scanner kit via Bluetooth Low Energy',
        'Read 9-, 10-, and 15-digit chip formats with checksum validation',
        'Link chip ID to existing biometric enrollment — one reunion profile',
        'Shelter intake: scan first, biometric match second for unregistered chips',
      ]}
    />
  );
}
