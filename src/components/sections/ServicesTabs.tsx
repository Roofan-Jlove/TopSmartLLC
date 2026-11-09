'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatUsd, formatUsdRange } from '@/lib/format';
import { cn } from '@/lib/utils';
import { services, startingPrice } from '@/data/services';

/** ARIA tabs pattern: arrow keys move between tabs, Home/End jump, panel is focusable. */
export function ServicesTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = services.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  const service = services[active]!;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Our services"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {services.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${item.key}`}
              aria-selected={selected}
              aria-controls={`panel-${item.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              className={cn(
                'flex flex-col items-start gap-3 rounded-md border p-4 text-left transition duration-200 ease-soft md:p-5',
                selected
                  ? 'border-brand bg-surface shadow-md ring-1 ring-brand'
                  : 'border-border bg-surface hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0',
              )}
            >
              <span
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-[12px]',
                  selected ? 'bg-brand text-brand-fg' : 'bg-bg-subtle text-brand',
                )}
              >
                <Icon name={item.icon} />
              </span>
              <span className="font-heading text-base font-semibold leading-snug md:text-lg">
                {item.name}
              </span>
              <span className="text-sm text-muted">From {formatUsd(startingPrice(item))}</span>
            </button>
          );
        })}
      </div>

      <div
        key={service.key}
        role="tabpanel"
        id={`panel-${service.key}`}
        aria-labelledby={`tab-${service.key}`}
        tabIndex={0}
        className="mt-6 animate-fade-up rounded-lg border border-border bg-surface p-6 shadow-sm md:p-10"
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3>{service.tagline}</h3>
            <p className="mt-3 text-muted">{service.positioning}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.features.slice(0, 6).map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/contact?services=${service.key}`}>Order this service</ButtonLink>
              <ButtonLink href={`/services/${service.slug}`} variant="secondary">
                Learn more<span className="sr-only"> about {service.name}</span>
              </ButtonLink>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Packages</p>
            <ul className="mt-3 space-y-3">
              {service.tiers.map((tier) => (
                <li
                  key={tier.key}
                  className={cn(
                    'rounded-md border p-4',
                    tier.popular ? 'border-brand bg-bg-subtle' : 'border-border',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-heading font-semibold">
                      {tier.name}
                      {tier.popular ? (
                        <span className="ml-2 rounded-full bg-brand px-2.5 py-0.5 align-middle text-xs font-semibold text-brand-fg">
                          Most popular
                        </span>
                      ) : null}
                    </p>
                    <p className="font-semibold">{formatUsdRange(tier.priceMin, tier.priceMax)}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted">{tier.summary}</p>
                  <p className="mt-1 text-sm text-muted">Typical delivery: {tier.timeline}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">
              Not sure which fits?{' '}
              <Link href="/#estimate" className="font-medium text-brand underline">
                Get a free estimate
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
