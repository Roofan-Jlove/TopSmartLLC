import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { companyLinks, legalLinks, serviceNav, site, socialLinks } from '@/data/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-subtle pb-24 lg:pb-0">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">{site.description}</p>
          <ul className="mt-5 flex gap-2" aria-label="Social media">
            {socialLinks.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (opens in a new tab)`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-brand hover:text-brand"
                >
                  <Icon name={social.platform} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Services">
          <h2 className="font-heading text-base font-semibold">Services</h2>
          <ul className="mt-4 space-y-1">
            {serviceNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-[44px] items-center text-sm text-muted hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="font-heading text-base font-semibold">Company</h2>
          <ul className="mt-4 space-y-1">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-[44px] items-center text-sm text-muted hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-heading text-base font-semibold">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a className="inline-flex min-h-[44px] items-center gap-2 hover:text-brand" href={`mailto:${site.email}`}>
                <Icon name="mail" size={18} />
                {site.email}
              </a>
            </li>
            <li>
              <a className="inline-flex min-h-[44px] items-center gap-2 hover:text-brand" href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>
                <Icon name="phone" size={18} />
                {site.phone}
              </a>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-sm text-muted md:flex-row">
          <p>
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap justify-center gap-x-5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-[44px] items-center hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
