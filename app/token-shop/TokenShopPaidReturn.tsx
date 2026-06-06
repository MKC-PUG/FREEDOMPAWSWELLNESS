'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { unlockProtocol } from '@/lib/shop/unlocks';

/** When Xaman return_url lands with ?paid=1, mark protocol unlocked (backup to polling). */
export default function TokenShopPaidReturn() {
  const searchParams = useSearchParams();
  const protocol = searchParams.get('protocol');
  const paid = searchParams.get('paid') === '1';
  const stripe = searchParams.get('stripe') === '1';

  useEffect(() => {
    if (!protocol) return;
    if (paid || stripe) unlockProtocol(protocol);
  }, [paid, stripe, protocol]);

  return null;
}
