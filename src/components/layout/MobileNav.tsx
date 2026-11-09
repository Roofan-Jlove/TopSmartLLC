'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { mainNav, quoteCta, serviceNav, site } from '@/data/site';

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

const FOCUSABLE = 'a[href], button:not([disabled])';

export function MobileNav({ open, onClose, pathname }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll lock, focus the panel on open, Esc to close, Tab focus trap.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-text/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-bg p-5 shadow-md"
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-bg-subtle"
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-6 flex-1">
          <ul className="space-y-1">
            {mainNav
              .filter((link) => link.href !== '/services' && link.href !== '/contact')
              .map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className="flex min-h-[48px] items-center rounded-sm px-3 text-lg font-medium hover:bg-bg-subtle aria-[current=page]:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>

          <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Services
          </p>
          <ul className="space-y-1">
            {serviceNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="flex min-h-[48px] items-center gap-3 rounded-sm px-3 font-medium hover:bg-bg-subtle aria-[current=page]:text-brand"
                >
                  {link.icon ? <Icon name={link.icon} className="text-brand" /> : null}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <ButtonLink href={quoteCta.href} size="lg" className="w-full" onClick={onClose}>
            {quoteCta.label}
            <Icon name="arrow-right" size={18} />
          </ButtonLink>
          <p className="text-center text-sm text-muted">
            Or email{' '}
            <a className="font-medium text-brand underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
