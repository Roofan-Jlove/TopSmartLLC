import type { PricingConfig } from '@/types/pricing';

/**
 * Calculator rates. Mirrors docs/SERVICE_SPECIFICATIONS.md section 7 exactly.
 * Change the doc first, then this file.
 */
export const pricing: PricingConfig = {
  services: {
    web: {
      unitLabel: 'page',
      unitLabelPlural: 'pages',
      defaultQuantity: 5,
      minQuantity: 1,
      maxQuantity: 100,
      tiers: {
        starter: { base: 1500, includedUnits: 5, extraUnitPrice: 120 },
        growth: { base: 3500, includedUnits: 12, extraUnitPrice: 150 },
        premium: { base: 9000, includedUnits: 25, extraUnitPrice: 200 },
      },
    },
    app: {
      unitLabel: 'screen',
      unitLabelPlural: 'screens',
      defaultQuantity: 8,
      minQuantity: 1,
      maxQuantity: 100,
      tiers: {
        starter: { base: 6000, includedUnits: 8, extraUnitPrice: 250 },
        growth: { base: 12000, includedUnits: 20, extraUnitPrice: 300 },
        premium: { base: 30000, includedUnits: 40, extraUnitPrice: 400 },
      },
    },
    content: {
      unitLabel: 'word',
      unitLabelPlural: 'words',
      defaultQuantity: 1000,
      minQuantity: 1,
      maxQuantity: 100000,
      tiers: {
        starter: { base: 50, includedUnits: 0, extraUnitPrice: 0.08 },
        growth: { base: 150, includedUnits: 0, extraUnitPrice: 0.12 },
        premium: { base: 400, includedUnits: 0, extraUnitPrice: 0.2 },
      },
    },
    ebook: {
      unitLabel: 'e-book page',
      unitLabelPlural: 'e-book pages',
      defaultQuantity: 100,
      minQuantity: 1,
      maxQuantity: 600,
      tiers: {
        starter: { base: 300, includedUnits: 0, extraUnitPrice: 5 },
        growth: { base: 900, includedUnits: 0, extraUnitPrice: 12 },
        premium: { base: 2500, includedUnits: 0, extraUnitPrice: 35 },
      },
    },
  },
  addOns: [
    {
      id: 'seo-audit',
      name: 'SEO audit',
      description: 'Technical, on-page and content review with a prioritized fix list.',
      price: 350,
      billing: 'one-time',
      appliesTo: ['web', 'app', 'content', 'ebook'],
    },
    {
      id: 'branding-logo',
      name: 'Branding & logo design',
      description: 'Logo, color palette, typography and a one-page brand guide.',
      price: 600,
      billing: 'one-time',
      appliesTo: ['web', 'app', 'content', 'ebook'],
    },
    {
      id: 'maintenance',
      name: 'Maintenance plan',
      description: 'Monthly updates, backups, security patches and uptime monitoring.',
      price: 120,
      billing: 'monthly',
      appliesTo: ['web', 'app'],
    },
    {
      id: 'uiux-audit',
      name: 'UI/UX audit',
      description: 'Expert review of flows, usability and accessibility with recommendations.',
      price: 450,
      billing: 'one-time',
      appliesTo: ['web', 'app', 'content'],
    },
    {
      id: 'social-pack',
      name: 'Social media content pack',
      description: '20 on-brand posts with captions and hashtags, ready to schedule.',
      price: 300,
      billing: 'one-time',
      appliesTo: ['web', 'content', 'ebook'],
    },
    {
      id: 'hosting-domain',
      name: 'Hosting & domain setup',
      description: 'Domain registration help, DNS, SSL, hosting and email setup.',
      price: 150,
      billing: 'one-time',
      appliesTo: ['web', 'app', 'ebook'],
    },
  ],
  rushMultiplier: 1.35,
  platformMultiplier: { android: 1, ios: 1, both: 1.5 },
  range: { low: 0.9, high: 1.2 },
  roundTo: 10,
};
