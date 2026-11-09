import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatUsdRange } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/service';

export function PricingTiers({ service }: { service: Service }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {service.tiers.map((tier) => (
        <article
          key={tier.key}
          className={cn(
            'relative flex flex-col rounded-lg border bg-surface p-6 shadow-sm md:p-8',
            tier.popular ? 'border-brand ring-1 ring-brand lg:-translate-y-2 lg:shadow-md' : 'border-border',
          )}
        >
          {tier.popular ? (
            <p className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-fg">
              Most popular
            </p>
          ) : null}
          <h3 className="text-2xl">{tier.name}</h3>
          <p className="mt-2 text-muted">{tier.summary}</p>
          <p className="mt-5 font-heading text-3xl font-bold">{formatUsdRange(tier.priceMin, tier.priceMax)}</p>
          <p className="mt-1 text-sm text-muted">
            Typical range · {tier.timeline} · {tier.revisions} revisions
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {tier.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
          <ButtonLink
            href={`/contact?services=${service.key}&tier=${tier.key}&source=service-page`}
            variant={tier.popular ? 'primary' : 'secondary'}
            className="mt-8 w-full"
          >
            Choose {tier.name}
          </ButtonLink>
        </article>
      ))}
    </div>
  );
}
