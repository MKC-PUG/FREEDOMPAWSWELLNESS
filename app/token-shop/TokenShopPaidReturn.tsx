'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { unlockProtocol } from '@/lib/shop/unlocks';

/** When Xaman return_url lands with ?paid=1, mark protocol unlocked (backup to polling). */
export default function TokenShopPaidReturn() {
  const searchParams = useSearchParams();
  const protocol = searchParams.get('protocol');
  const paid = searchParams.get('paid') === '1';

  useEffect(() => {
    if (!paid || !protocol) return;
    unlockProtocol(protocol);
  }, [paid, protocol]);

  return null;
}
