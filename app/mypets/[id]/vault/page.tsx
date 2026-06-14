import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPetForUser } from '@/lib/pets/server';
import { getServerUser } from '@/lib/supabase/server';
import PetVaultPageLoader from './PetVaultPageLoader';

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'Wellness Vault • My Pets • Freedom Paws',
  description: 'Vet records, vaccinations, and daily wellness notes for your pet.',
};

export default async function PetVaultPage({ params }: Props) {
  const { id } = await params;
  let serverPetName: string | null = null;

  const user = await getServerUser();
  if (user) {
    const pet = await getPetForUser(user.id, id);
    if (!pet) notFound();
    serverPetName = pet.name;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A1428]" />}>
      <PetVaultPageLoader petId={id} serverPetName={serverPetName} />
    </Suspense>
  );
}
