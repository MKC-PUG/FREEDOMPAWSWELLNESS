import type { Metadata } from 'next';
import MyPetsClient from './MyPetsClient';

export const metadata: Metadata = {
  title: 'My Pets • Freedom Paws Wellness',
  description: 'Pet profiles, unlocked protocols, and your wellness vault on Freedom Paws.',
};

export default function MyPetsPage() {
  return <MyPetsClient />;
}
