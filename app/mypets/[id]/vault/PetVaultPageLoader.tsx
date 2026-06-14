'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PetVaultClient from './PetVaultClient';

type Props = { petId: string; serverPetName?: string | null };

export default function PetVaultPageLoader({ petId, serverPetName }: Props) {
  const searchParams = useSearchParams();
  const queryName = searchParams.get('name');
  const [petName, setPetName] = useState(serverPetName || queryName || 'Your pet');

  useEffect(() => {
    if (serverPetName) {
      setPetName(serverPetName);
      return;
    }
    if (queryName) {
      setPetName(queryName);
      return;
    }
    try {
      const raw = localStorage.getItem('fp-pet-profiles');
      if (raw) {
        const pets = JSON.parse(raw) as { id: string; name: string }[];
        const match = pets.find((p) => p.id === petId);
        if (match?.name) setPetName(match.name);
      }
    } catch {
      /* keep default */
    }
  }, [petId, queryName, serverPetName]);

  return <PetVaultClient petId={petId} petName={petName} />;
}
