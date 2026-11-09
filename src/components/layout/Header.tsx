'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import { mainNav, quoteCta, serviceNav } from '@/data/site';
import { MobileNav } from './MobileNav';

const desktopLinks = mainNav.filter((l) => !['/', '/services', '/contact'].includes(l.href));

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  // A mouse reaches the button by hovering (which opens the menu) and then clicks it. That click must
  // not toggle the menu shut again, so remember that this open came from hover.
  const openedByHover = useRef(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the services dropdown on Esc or click/focus outside.
  useEffect(() => {
    if (!servicesOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    }
    function onPointerOrFocus(event: Event) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerOrFocus);
    document.addEventListener('focusin', onPointerOrFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerOrFocus);
      document.removeEventListener('focusin', onPointerOrFocus);
    };
  }, [servicesOpen]);

  const onServicesKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setServicesOpen(true);
      requestAnimationFrame(() => servicesRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
    }
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next = event.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  const onServicesPage = pathname.startsWith('/services');

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-all duration-200',
        scrolled
          ? 'border-border bg-bg/85 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-bg',
      )}
    >
      <div className={cn('container flex items-center justify-between transition-all duration-200', scrolled ? 'h-16' : 'h-[72px]')}>
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <div ref={servicesRef} className="relative" onMouseEnter={() => {
              if (!servicesOpen) openedByHover.current = true;
              setServicesOpen(true);
            }}
            onMouseLeave={() => {
              openedByHover.current = false;
              setServicesOpen(false);
            }}>
            <button
              ref={servicesButtonRef}
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              aria-controls="services-menu"
              onClick={() => {
                if (openedByHover.current) {
                  openedByHover.current = false;
                  return;
                }
                setServicesOpen((v) => !v);
              }}
              onKeyDown={onServicesKeyDown}
              className={cn(
                'flex min-h-[44px] items-center gap-1 rounded-full px-4 text-sm font-medium hover:bg-bg-subtle',
                onServicesPage && 'text-brand',
              )}
            >
              Services
              <Icon name="chevron-down" size={16} className={cn('transition-transform', servicesOpen && 'rotate-180')} />
            </button>
            {servicesOpen ? (
              <div id="services-menu" className="absolute left-1/2 top-full w-[380px] -translate-x-1/2 pt-2">
                <div className="rounded-md border border-border bg-surface p-2 shadow-md">
                  <ul role="menu" aria-label="Services" onKeyDown={onMenuKeyDown}>
                    {serviceNav.map((item) => (
                      <li key={item.href} role="none">
                        <Link
                          role="menuitem"
                          href={item.href}
                          className="flex items-start gap-3 rounded-sm p-3 hover:bg-bg-subtle"
                        >
                          {item.icon ? (
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-bg-subtle text-brand">
                              <Icon name={item.icon} size={20} />
                            </span>
                          ) : null}
                          <span>
                            <span className="block text-sm font-semibold">{item.label}</span>
                            <span className="block text-sm text-muted">{item.description}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/services"
                    className="mt-1 flex items-center justify-between rounded-sm border-t border-border px-3 py-3 text-sm font-semibold text-brand hover:bg-bg-subtle"
                  >
                    View all services
                    <Icon name="arrow-right" size={16} />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? 'page' : undefined}
              className="flex min-h-[44px] items-center rounded-full px-4 text-sm font-medium hover:bg-bg-subtle aria-[current=page]:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={quoteCta.href} className="hidden sm:inline-flex">
            {quoteCta.label}
          </ButtonLink>
          <button
            ref={menuButtonRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-bg-subtle lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      <MobileNav open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </header>
  );
}
