import type { ServiceKey } from './lead';

export type CaseStudy = {
  slug: string;
  title: string;
  category: ServiceKey;
  client: string;
  industry: string;
  year: number;
  summary: string;
  challenge: string;
  solution: string;
  tools: string[];
  results: { value: string; label: string }[];
  testimonialId?: string;
  /** Gradient used for the generated placeholder artwork: [from, to] hex colors. */
  gradient: [string, string];
  /** True until replaced by a real, approved client project. */
  isSample: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: 4 | 5;
  service: ServiceKey;
  /** True until replaced by a real, approved client testimonial. */
  isSample: boolean;
};
