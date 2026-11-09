import { describe, expect, it } from 'vitest';
import { caseStudies } from '@/data/portfolio';
import { pricing } from '@/data/pricing';
import { services } from '@/data/services';
import { getTestimonialById, testimonials } from '@/data/testimonials';
import { serviceNav } from '@/data/site';

const keys = ['web', 'app', 'content', 'ebook'] as const;
const tiers = ['starter', 'growth', 'premium'] as const;

describe('services data', () => {
  it('defines the four services with unique slugs', () => {
    expect(services.map((s) => s.key).sort()).toEqual([...keys].sort());
    expect(new Set(services.map((s) => s.slug)).size).toBe(4);
  });

  it('matches the navigation links', () => {
    const hrefs = serviceNav.map((n) => n.href).sort();
    expect(hrefs).toEqual(services.map((s) => `/services/${s.slug}`).sort());
  });

  it.each(services)('$name has 3 ascending tiers and 4-6 FAQs', (service) => {
    expect(service.tiers.map((t) => t.key)).toEqual([...tiers]);
    for (const tier of service.tiers) expect(tier.priceMin).toBeLessThan(tier.priceMax);
    expect(service.tiers[0]!.priceMax).toBeLessThanOrEqual(service.tiers[1]!.priceMin);
    expect(service.tiers[1]!.priceMax).toBeLessThanOrEqual(service.tiers[2]!.priceMin);
    expect(service.faqs.length).toBeGreaterThanOrEqual(4);
    expect(service.faqs.length).toBeLessThanOrEqual(6);
    expect(service.tiers.filter((t) => t.popular)).toHaveLength(1);
  });

  it.each(services)('$name only references add-ons that apply to it', (service) => {
    for (const id of service.addOnIds) {
      const addOn = pricing.addOns.find((a) => a.id === id);
      expect(addOn, `unknown add-on ${id}`).toBeDefined();
      expect(addOn!.appliesTo).toContain(service.key);
    }
  });
});

describe('pricing data', () => {
  it('has rates for every service and tier', () => {
    for (const key of keys) {
      for (const tier of tiers) expect(pricing.services[key].tiers[tier].base).toBeGreaterThan(0);
    }
  });

  it('matches the documented constants', () => {
    expect(pricing.rushMultiplier).toBe(1.35);
    expect(pricing.platformMultiplier.both).toBe(1.5);
    expect(pricing.range).toEqual({ low: 0.9, high: 1.2 });
  });
});

describe('portfolio and testimonials', () => {
  it('has at least 8 case studies covering every category', () => {
    expect(caseStudies.length).toBeGreaterThanOrEqual(8);
    for (const key of keys) expect(caseStudies.some((c) => c.category === key)).toBe(true);
    expect(new Set(caseStudies.map((c) => c.slug)).size).toBe(caseStudies.length);
  });

  it('links case studies to existing testimonials', () => {
    for (const study of caseStudies) {
      if (study.testimonialId) expect(getTestimonialById(study.testimonialId)).toBeDefined();
    }
  });

  it('has at least 6 testimonials', () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(6);
  });
});
