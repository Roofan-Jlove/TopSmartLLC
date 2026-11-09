import type { CaseStudy } from '@/types/portfolio';
import type { ServiceKey } from '@/types/lead';

/**
 * Sample case studies. Client names are fictional (isSample: true) and must be
 * replaced with real, approved projects before launch (docs/PLAN.md checklist).
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'northwind-coffee-online-store',
    title: 'Northwind Coffee: a faster online store',
    category: 'web',
    client: 'Northwind Coffee',
    industry: 'Food & beverage',
    year: 2025,
    summary: 'A fast, mobile-first store that lifted online orders by 38%.',
    challenge:
      'Northwind sold specialty coffee through a slow, template-based site. Mobile checkout was clumsy, product pages did not rank, and the owner could not update menus without help.',
    solution:
      'We redesigned the store around a three-tap mobile checkout, rebuilt product pages with structured data and added a simple CMS so the team can manage products and promotions on their own.',
    tools: ['Next.js', 'Tailwind CSS', 'Stripe', 'Headless CMS'],
    results: [
      { value: '+38%', label: 'online orders in 60 days' },
      { value: '1.4s', label: 'mobile largest contentful paint' },
      { value: '96', label: 'Lighthouse performance score' },
    ],
    testimonialId: 't-northwind',
    gradient: ['#4f46e5', '#06b6d4'],
    isSample: true,
  },
  {
    slug: 'craftly-marketplace-redesign',
    title: 'Craftly Market: marketplace redesign',
    category: 'web',
    client: 'Craftly Market',
    industry: 'E-commerce',
    year: 2025,
    summary: 'A marketplace redesign that cut checkout abandonment by 27%.',
    challenge:
      'Craftly connects independent makers with buyers, but a cluttered catalog and a five-step checkout caused buyers to abandon their carts.',
    solution:
      'We simplified navigation, introduced filters buyers actually use, and shortened checkout to two steps with guest purchase and saved payment options.',
    tools: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe Connect'],
    results: [
      { value: '-27%', label: 'checkout abandonment' },
      { value: '+52%', label: 'organic search traffic' },
      { value: '2.1x', label: 'repeat purchase rate' },
    ],
    testimonialId: 't-craftly',
    gradient: ['#7c3aed', '#ec4899'],
    isSample: true,
  },
  {
    slug: 'lumen-health-patient-app',
    title: 'Lumen Health: patient wellness app',
    category: 'app',
    client: 'Lumen Health',
    industry: 'Healthcare',
    year: 2025,
    summary: 'A cross-platform wellness app live on both stores in 14 weeks.',
    challenge:
      'Lumen needed patients to track medication and appointments, but had no app and a tight launch window tied to a clinic partnership.',
    solution:
      'We scoped a focused MVP, designed accessible flows for older users, built it once for Android and iOS, and handled store compliance, including health-data privacy requirements.',
    tools: ['React Native', 'Node.js', 'Firebase', 'Push notifications'],
    results: [
      { value: '14 weeks', label: 'idea to both app stores' },
      { value: '4.7', label: 'average store rating' },
      { value: '8,000+', label: 'downloads in first quarter' },
    ],
    testimonialId: 't-lumen',
    gradient: ['#0ea5e9', '#22c55e'],
    isSample: true,
  },
  {
    slug: 'peak-logistics-driver-app',
    title: 'Peak Logistics: driver delivery app',
    category: 'app',
    client: 'Peak Logistics',
    industry: 'Logistics',
    year: 2024,
    summary: 'A driver app that cut proof-of-delivery time from minutes to seconds.',
    challenge:
      'Drivers recorded deliveries on paper, causing delays in invoicing and frequent disputes over missed drop-offs.',
    solution:
      'We built an offline-first Android app with barcode scanning, photo proof, signatures and live status updates synced to the dispatch dashboard.',
    tools: ['Kotlin', 'Android', 'REST API', 'Google Maps'],
    results: [
      { value: '-70%', label: 'time to record a delivery' },
      { value: '-45%', label: 'delivery disputes' },
      { value: '3 days', label: 'faster invoicing cycle' },
    ],
    testimonialId: 't-peak',
    gradient: ['#f97316', '#eab308'],
    isSample: true,
  },
  {
    slug: 'brightpath-seo-content-engine',
    title: 'BrightPath Coaching: SEO content engine',
    category: 'content',
    client: 'BrightPath Coaching',
    industry: 'Coaching & training',
    year: 2025,
    summary: 'Twenty-four articles that tripled organic traffic in six months.',
    challenge:
      'BrightPath published irregularly and none of the posts targeted search intent, so the blog brought almost no qualified visitors.',
    solution:
      'We built a keyword map, wrote 24 long-form articles in the founder voice, and added internal linking and calls to action tied to discovery-call bookings.',
    tools: ['Keyword research', 'Surfer-style briefs', 'Editorial calendar', 'Google Search Console'],
    results: [
      { value: '3x', label: 'organic traffic in 6 months' },
      { value: '41', label: 'keywords on page one' },
      { value: '+64%', label: 'discovery-call bookings' },
    ],
    testimonialId: 't-brightpath',
    gradient: ['#14b8a6', '#6366f1'],
    isSample: true,
  },
  {
    slug: 'saas-landing-page-copy',
    title: 'Flowdesk: landing page copywriting',
    category: 'content',
    client: 'Flowdesk',
    industry: 'B2B software',
    year: 2024,
    summary: 'New landing page copy that raised trial sign-ups by 31%.',
    challenge:
      'Flowdesk’s landing page listed features but never explained the outcome, so visitors left without starting a trial.',
    solution:
      'We interviewed customers, rewrote the page around the problem and the result, tested two headline variants, and tightened every call to action.',
    tools: ['Customer interviews', 'Messaging framework', 'A/B testing'],
    results: [
      { value: '+31%', label: 'free-trial sign-ups' },
      { value: '-18%', label: 'bounce rate' },
      { value: '2', label: 'headline variants tested' },
    ],
    gradient: ['#ef4444', '#f59e0b'],
    isSample: true,
  },
  {
    slug: 'orchard-books-leadership-ebook',
    title: 'Orchard Books: a leadership e-book',
    category: 'ebook',
    client: 'Orchard Books',
    industry: 'Publishing',
    year: 2025,
    summary: 'A ghostwritten 180-page e-book published on three platforms.',
    challenge:
      'An experienced business coach had two decades of material but no time to turn it into a book that would build her authority.',
    solution:
      'We ran a series of interviews, wrote and edited the manuscript in her voice, designed the layout and cover, and set up publishing on Amazon KDP, Apple Books and Kobo.',
    tools: ['Ghostwriting', 'Two-pass editing', 'Affinity Publisher', 'EPUB validation'],
    results: [
      { value: '11 weeks', label: 'interview to publication' },
      { value: '#3', label: 'Amazon leadership new releases' },
      { value: '420', label: 'copies in launch month' },
    ],
    testimonialId: 't-orchard',
    gradient: ['#8b5cf6', '#06b6d4'],
    isSample: true,
  },
  {
    slug: 'wellness-workbook-ebook',
    title: 'Mindful Mornings: a wellness workbook',
    category: 'ebook',
    client: 'Mindful Mornings',
    industry: 'Health & wellness',
    year: 2024,
    summary: 'An illustrated interactive workbook converted into EPUB and print-ready PDF.',
    challenge:
      'The author had a Word manuscript with inconsistent formatting and needed fillable exercises, a cover and files ready for every platform.',
    solution:
      'We re-typeset the whole book, designed a calming cover and exercise pages, produced a validated EPUB and print-ready PDF, and prepared the store metadata.',
    tools: ['Typesetting', 'Cover design', 'EPUB 3', 'Print-ready PDF'],
    results: [
      { value: '2 formats', label: 'validated EPUB and print PDF' },
      { value: '9 days', label: 'manuscript to final files' },
      { value: '4.8', label: 'average reader rating' },
    ],
    gradient: ['#10b981', '#3b82f6'],
    isSample: true,
  },
];

export const portfolioCategories: { value: 'all' | ServiceKey; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web' },
  { value: 'app', label: 'Apps' },
  { value: 'content', label: 'Content' },
  { value: 'ebook', label: 'E-books' },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
