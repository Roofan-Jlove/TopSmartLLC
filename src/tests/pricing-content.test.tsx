import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PricingOverview } from '@/components/sections/PricingOverview';
import { pricingFaqs } from '@/data/about';
import { pricing } from '@/data/pricing';
import { services } from '@/data/services';
import { formatUsdRange } from '@/lib/format';

afterEach(cleanup);

describe('PricingOverview', () => {
  it('has an accessible caption and column headers for every package', () => {
    render(<PricingOverview />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Service',
      'Starter',
      'Growth',
      'Premium',
    ]);
    expect(table.querySelector('caption')).not.toBeNull();
  });

  it.each(services)('shows $name prices that match the service data', (service) => {
    render(<PricingOverview />);
    const row = screen.getByRole('row', { name: new RegExp(service.name.replace(/[&]/g, '\\&')) });
    for (const tier of service.tiers) {
      expect(row.textContent).toContain(formatUsdRange(tier.priceMin, tier.priceMax));
      expect(row.textContent).toContain(tier.timeline);
    }
  });

  it('links each service to its section on the page', () => {
    render(<PricingOverview />);
    for (const service of services) {
      const link = screen.getByRole('link', { name: service.name });
      expect(link.getAttribute('href')).toBe(`#${service.slug}`);
    }
  });
});

describe('pricing FAQ copy stays in sync with the data', () => {
  const answerFor = (fragment: string) => pricingFaqs.find((faq) => faq.question.includes(fragment))?.answer ?? '';

  it('quotes the real rush percentage', () => {
    const percent = Math.round((pricing.rushMultiplier - 1) * 100);
    expect(answerFor('rush')).toContain(`${percent}%`);
  });

  it('quotes the real revision range', () => {
    const revisions = services.flatMap((service) => service.tiers.map((tier) => tier.revisions));
    expect(answerFor('revisions')).toContain(`from ${Math.min(...revisions)} to ${Math.max(...revisions)}`);
  });

  it('has unique questions with non-empty answers', () => {
    expect(new Set(pricingFaqs.map((f) => f.question)).size).toBe(pricingFaqs.length);
    for (const faq of pricingFaqs) expect(faq.answer.length).toBeGreaterThan(20);
  });
});
