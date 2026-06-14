'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchVitRunsServer, latestVitRunLocal, type VitRunSummary } from '@/lib/vit/history';

type Props = {
  petId: string;
  useServer: boolean;
};

export default function PetVitRunBadge({ petId, useServer }: Props) {
  const [run, setRun] = useState<VitRunSummary | null>(null);

  useEffect(() => {
    const local = latestVitRunLocal(petId);
    if (local) setRun(local);

    if (useServer) {
      void fetchVitRunsServer(petId).then((runs) => {
        if (runs[0]) setRun(runs[0]);
      });
    }
  }, [petId, useServer]);

  if (!run?.primaryTitle) return null;

  const date = new Date(run.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="mt-3 rounded-xl border border-blue-500/25 bg-blue-950/20 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-300/90">Last ViT scan</p>
      <p className="text-xs text-white/80 mt-0.5">
        {run.primaryTitle}
        {run.primaryConfidence != null ? ` · ${run.primaryConfidence}%` : ''}
        <span className="text-white/40"> · {date}</span>
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {run.primarySlug && (
          <Link
            href={`/protocols/${run.primarySlug}`}
            className="text-[10px] font-bold text-amber-400"
          >
            Protocol →
          </Link>
        )}
        <Link
          href={
            run.primarySlug
              ? `/wellness/safe-products#${run.primarySlug}`
              : '/wellness/safe-products'
          }
          className="text-[10px] font-bold text-emerald-400"
        >
          Safe Picks →
        </Link>
      </div>
    </div>
  );
}
