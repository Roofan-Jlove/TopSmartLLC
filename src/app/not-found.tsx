import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Page not found' };

const suggestions = [
  { label: 'Services', href: '/services', text: 'Web, apps, content and e-books' },
  { label: 'Portfolio', href: '/portfolio', text: 'Projects and results' },
  { label: 'Pricing', href: '/pricing', text: 'Packages and add-ons' },
  { label: 'Contact', href: '/contact', text: 'Send us your project' },
];

export default function NotFound() {
  return (
    <section className="container py-16 text-center md:py-24">
      <p className="font-heading text-6xl font-bold text-brand md:text-8xl" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-4xl md:text-5xl">We could not find that page</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
        The link may be old or mistyped. Try one of these instead, or head back to the homepage.
      </p>
      <ul className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
        {suggestions.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface p-5 transition hover:border-brand hover:shadow-sm"
            >
              <span>
                <span className="block font-heading font-semibold">{item.label}</span>
                <span className="text-sm text-muted">{item.text}</span>
              </span>
              <Icon name="arrow-right" size={18} className="shrink-0 text-brand" />
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink href="/" size="lg" className="mt-10">
        Back to the homepage
      </ButtonLink>
    </section>
  );
}
