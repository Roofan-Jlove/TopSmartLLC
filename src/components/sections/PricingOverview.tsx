import Link from 'next/link';
import { services } from '@/data/services';
import { formatUsdRange } from '@/lib/format';

/** At-a-glance comparison. Values come straight from the service data, so they cannot drift from the detailed cards. */
export function PricingOverview() {
  const tierNames = services[0]!.tiers.map((tier) => tier.name);

  return (
    <div
      role="region"
      aria-label="Price comparison table, scrolls sideways on small screens"
      tabIndex={0}
      className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm"
    >
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">Typical project price ranges in USD by service and package</caption>
        <thead>
          <tr className="border-b border-border bg-bg-subtle">
            <th scope="col" className="px-5 py-4 font-heading text-base">
              Service
            </th>
            {tierNames.map((name) => (
              <th key={name} scope="col" className="px-5 py-4 font-heading text-base">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.key} className="border-b border-border last:border-b-0">
              <th scope="row" className="px-5 py-4 font-semibold">
                <Link href={`#${service.slug}`} className="inline-flex min-h-[44px] items-center hover:text-brand">
                  {service.name}
                </Link>
              </th>
              {service.tiers.map((tier) => (
                <td key={tier.key} className="px-5 py-4">
                  <span className="font-semibold">{formatUsdRange(tier.priceMin, tier.priceMax)}</span>
                  <span className="block text-xs text-muted">{tier.timeline}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
