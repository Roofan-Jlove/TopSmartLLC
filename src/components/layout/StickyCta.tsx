'use client';

import { usePathname } from 'next/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { quoteCta } from '@/data/site';

/** Mobile-only bottom action bar. Hidden on the order form page. */
export function StickyCta() {
  const pathname = usePathname();
  if (pathname === '/contact') return null;

  return (
    <aside
      aria-label="Quick action"
      className="bg-bg/90 fixed inset-x-0 bottom-0 z-30 border-t border-border p-3 backdrop-blur-md sm:hidden"
    >
      <ButtonLink href={quoteCta.href} size="lg" className="w-full">
        {quoteCta.label}
        <Icon name="arrow-right" size={18} />
      </ButtonLink>
    </aside>
  );
}
