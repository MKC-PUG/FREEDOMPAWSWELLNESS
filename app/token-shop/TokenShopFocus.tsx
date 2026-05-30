'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/** Scroll to and highlight the protocol card when arriving from a detail page. */
export default function TokenShopFocus() {
  const searchParams = useSearchParams();
  const protocol = searchParams.get('protocol');
  const buy = searchParams.get('buy') === '1';

  useEffect(() => {
    if (!protocol) return;

    const card = document.getElementById(protocol);
    if (!card) return;

    window.requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('ring-2', 'ring-[#F5C242]', 'ring-offset-2', 'ring-offset-[#0A1428]');

      if (buy) {
        const purchase = card.querySelector<HTMLElement>('[data-purchase]');
        purchase?.focus({ preventScroll: true });
        purchase?.classList.add('animate-pulse');
      }
    });

    return () => {
      card.classList.remove('ring-2', 'ring-[#F5C242]', 'ring-offset-2', 'ring-offset-[#0A1428]');
      card.querySelector<HTMLElement>('[data-purchase]')?.classList.remove('animate-pulse');
    };
  }, [protocol, buy]);

  return null;
}
