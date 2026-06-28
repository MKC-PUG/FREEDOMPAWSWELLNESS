import type { Metadata } from 'next';
import LookupClient from './LookupClient';

export const metadata: Metadata = {
  title: 'Registry Lookup • Freedom Paws ID',
  description:
    'Validate microchip IDs and route to AAHA Universal Pet Microchip Lookup and AVID branch guidance.',
};

export default function IdLookupPage() {
  return <LookupClient />;
}
