import type { MetadataRoute } from 'next';
import { caseStudies } from '@/data/portfolio';
import { services } from '@/data/services';
import { site } from '@/data/site';

const staticRoutes: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/portfolio', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.2, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const url = (path: string) => `${site.url}${path === '/' ? '' : path}`;

  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: url(path),
      lastModified,
      changeFrequency,
      priority,
    })),
    ...services.map((service) => ({
      url: url(`/services/${service.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...caseStudies.map((study) => ({
      url: url(`/portfolio/${study.slug}`),
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];
}
