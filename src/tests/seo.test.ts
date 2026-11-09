import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { cookiePolicy, privacyPolicy, termsOfService } from '@/data/legal';
import { caseStudies } from '@/data/portfolio';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { buildMetadata, faqJsonLd, organizationJsonLd, serviceJsonLd } from '@/lib/seo';

describe('sitemap', () => {
  const urls = sitemap().map((entry) => entry.url);

  it('lists every static page, service page and case study exactly once', () => {
    const expected = [
      '',
      '/services',
      '/pricing',
      '/portfolio',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/cookies',
      ...services.map((s) => `/services/${s.slug}`),
      ...caseStudies.map((c) => `/portfolio/${c.slug}`),
    ].map((path) => `${site.url}${path}`);
    expect([...urls].sort()).toEqual([...expected].sort());
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('gives the homepage the highest priority', () => {
    const priorities = sitemap().map((entry) => entry.priority ?? 0);
    expect(sitemap()[0]?.priority).toBe(Math.max(...priorities));
  });
});

describe('robots', () => {
  it('allows the site, hides the API and points at the sitemap', () => {
    const result = robots();
    expect(result.sitemap).toBe(`${site.url}/sitemap.xml`);
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rule?.allow).toBe('/');
    expect(rule?.disallow).toContain('/api/');
  });
});

describe('buildMetadata', () => {
  const meta = buildMetadata({ title: 'Pricing', description: 'Prices.', path: '/pricing' });

  it('sets canonical, Open Graph and Twitter fields', () => {
    expect(meta.alternates?.canonical).toBe('/pricing');
    expect(meta.openGraph?.title).toBe('Pricing');
    expect((meta.twitter as { card?: string }).card).toBe('summary_large_image');
  });

  it('names the share image explicitly, because a page-level openGraph would otherwise drop it', () => {
    const images = meta.openGraph?.images;
    expect(Array.isArray(images) && images.length).toBeGreaterThan(0);
    expect(JSON.stringify(images)).toContain('/opengraph-image');
    expect(JSON.stringify(meta.twitter)).toContain('/opengraph-image');
  });
});

describe('structured data', () => {
  it('describes the organization without unverified social profiles', () => {
    const org = organizationJsonLd() as Record<string, unknown>;
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe(site.name);
    expect(org).not.toHaveProperty('sameAs');
  });

  it('builds a Service with one offer per package', () => {
    const service = services[0]!;
    const ld = serviceJsonLd(service) as { '@type': string; offers: { priceSpecification: { minPrice: number } }[] };
    expect(ld['@type']).toBe('Service');
    expect(ld.offers).toHaveLength(3);
    expect(ld.offers[0]?.priceSpecification.minPrice).toBe(service.tiers[0]!.priceMin);
  });

  it('builds a FAQPage from questions and answers', () => {
    const ld = faqJsonLd([{ question: 'Q?', answer: 'A.' }]) as { mainEntity: { name: string }[] };
    expect(ld.mainEntity[0]?.name).toBe('Q?');
  });
});

describe('legal pages', () => {
  const docs = [privacyPolicy, termsOfService, cookiePolicy];

  it.each(docs)('$title has a path, date and several substantive sections', (doc) => {
    expect(doc.path).toMatch(/^\/(privacy|terms|cookies)$/);
    expect(doc.lastUpdated).toMatch(/\d{4}/);
    expect(doc.sections.length).toBeGreaterThanOrEqual(5);
    for (const section of doc.sections) {
      expect(section.paragraphs?.length || section.list?.length, section.heading).toBeTruthy();
    }
  });

  it('the privacy policy discloses attachments, email delivery and the absence of a database', () => {
    const text = JSON.stringify(privacyPolicy).toLowerCase();
    expect(text).toContain('attached files');
    expect(text).toContain('email delivery provider');
    expect(text).toContain('does not keep a database');
    expect(text).toContain(site.email);
  });

  it('the cookie policy lists exactly the browser storage keys the site really uses', () => {
    const text = JSON.stringify(cookiePolicy);
    expect(text).toContain('tsl.draft');
    expect(text).toContain('tsl.estimate');
  });

  it('contains no unfinished placeholder text', () => {
    for (const doc of docs) {
      expect(JSON.stringify(doc)).not.toMatch(/lorem ipsum|TODO|TBD|\[.*to be confirmed.*\]/i);
    }
  });
});
