'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchVaultCount } from '@/lib/mypets/vault-api';
import { countVaultEntriesLocal } from '@/lib/mypets/vault-storage';

type Props = {
  petId: string;
  petName: string;
  useServer: boolean;
};

export default function PetVaultBadge({ petId, petName, useServer }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const local = countVaultEntriesLocal(petId);
    setCount(local);

    if (useServer) {
      void fetchVaultCount(petId).then((c) => {
        if (c !== null) setCount(c);
      });
    }
  }, [petId, useServer]);

  const label =
    count === null || count === 0
      ? 'Open wellness vault'
      : `${count} vault item${count === 1 ? '' : 's'}`;

  return (
    <Link
      href={`/mypets/${encodeURIComponent(petId)}/vault?name=${encodeURIComponent(petName)}`}
      className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-950/20 px-3 py-2 touch-manipulation"
    >
      <span className="text-xs font-bold text-emerald-300">🗂️ {label}</span>
      <span className="text-[10px] text-emerald-400/80">→</span>
    </Link>
  );
}
