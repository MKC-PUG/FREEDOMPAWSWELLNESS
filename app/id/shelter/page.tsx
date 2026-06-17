import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Shelter Dashboard • Freedom Paws ID',
  description: 'Redirects to Freedom Paws Adoption Network partner dashboard.',
};

/** Legacy route — partner dashboard lives at /partner. */
export default function IdShelterPage() {
  redirect('/partner');
}
