import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatUsd } from '@/lib/format';
import { startingPrice } from '@/data/services';
import type { Service } from '@/types/service';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition duration-200 ease-soft hover:-translate-y-1 hover:shadow-md motion-reduce:hover:translate-y-0 md:p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-bg-subtle text-brand">
        <Icon name={service.icon} />
      </span>
      <h2 className="mt-5 text-2xl">
        <Link href={`/services/${service.slug}`} className="hover:text-brand">
          {service.name}
        </Link>
      </h2>
      <p className="mt-2 text-muted">{service.tagline}</p>
      <ul className="mt-5 flex-1 space-y-2">
        {service.offerings.slice(0, 4).map((offering) => (
          <li key={offering} className="flex items-start gap-2.5 text-sm">
            <Icon name="check" size={18} className="mt-0.5 shrink-0 text-success" />
            {offering}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Packages from <span className="font-semibold text-text">{formatUsd(startingPrice(service))}</span>
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={`/services/${service.slug}`}>
          View details
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
        <ButtonLink href={`/contact?services=${service.key}&source=service-page`} variant="secondary">
          Order now
        </ButtonLink>
      </div>
    </article>
  );
}
