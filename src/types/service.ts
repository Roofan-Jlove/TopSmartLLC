import type { AddOnId, TierKey } from './pricing';
import type { ServiceKey } from './lead';

export type IconName = 'web' | 'app' | 'content' | 'ebook';

export type Faq = { question: string; answer: string };

export type ProcessStep = { title: string; description: string; duration: string };

export type Tier = {
  key: TierKey;
  name: string;
  priceMin: number;
  priceMax: number;
  summary: string;
  includes: string[];
  revisions: number;
  timeline: string;
  popular?: boolean;
};

export type Service = {
  key: ServiceKey;
  slug: string;
  name: string;
  shortName: string;
  icon: IconName;
  tagline: string;
  positioning: string;
  seoDescription: string;
  problems: string[];
  offerings: string[];
  features: string[];
  deliverables: string[];
  process: ProcessStep[];
  tiers: Tier[];
  addOnIds: AddOnId[];
  faqs: Faq[];
};
