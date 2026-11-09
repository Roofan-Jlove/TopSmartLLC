import type { Metadata } from 'next';
import { pricing } from '@/data/pricing';
import { site } from '@/data/site';
import type { Service } from '@/types/service';

type MetaInput = { title: string; description: string; path: string };

/**
 * A page that sets its own `openGraph` replaces the root-level image instead of inheriting it,
 * so every page names the generated share image (src/app/opengraph-image.tsx) explicitly.
 */
const SHARE_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'TopSmartLLC: websites, mobile apps, content writing and e-books',
};

/** Per-page metadata with canonical URL, Open Graph and Twitter cards. Title gets the site template suffix. */
export function buildMetadata({ title, description, path }: MetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'website', siteName: site.name, images: [SHARE_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [SHARE_IMAGE.url] },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    // sameAs (social profile URLs) is added once the real profiles exist.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      availableLanguage: 'English',
    },
  };
}

export function serviceJsonLd(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.seoDescription,
    url: `${site.url}/services/${service.slug}`,
    areaServed: 'Worldwide',
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    offers: service.tiers.map((tier) => ({
      '@type': 'Offer',
      name: `${service.name} – ${tier.name}`,
      description: tier.summary,
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        minPrice: tier.priceMin,
        maxPrice: tier.priceMax,
      },
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function addOnsFor(service: Service) {
  return pricing.addOns.filter((addOn) => service.addOnIds.includes(addOn.id));
}
