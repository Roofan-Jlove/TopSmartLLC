import type { Testimonial } from '@/types/portfolio';

/**
 * Sample testimonials. isSample must be replaced with real, approved client
 * testimonials before launch (docs/PLAN.md launch checklist).
 */
export const testimonials: Testimonial[] = [
  {
    id: 't-northwind',
    quote:
      'Our online orders went up by more than a third within two months of launch. The new site loads instantly and our customers keep telling us how easy it is to order.',
    name: 'Amelia Hart',
    role: 'Owner',
    company: 'Northwind Coffee',
    rating: 5,
    service: 'web',
    isSample: true,
  },
  {
    id: 't-craftly',
    quote:
      'They rebuilt our store around how people actually shop. Checkout is quicker, the site feels premium, and we finally rank for the products we sell.',
    name: 'Daniel Brooks',
    role: 'Founder',
    company: 'Craftly Market',
    rating: 5,
    service: 'web',
    isSample: true,
  },
  {
    id: 't-lumen',
    quote:
      'We went from a rough idea to both app stores in under four months. Weekly demos meant no surprises, and the store review passed on the first submission.',
    name: 'Dr. Sana Malik',
    role: 'Co-founder',
    company: 'Lumen Health',
    rating: 5,
    service: 'app',
    isSample: true,
  },
  {
    id: 't-peak',
    quote:
      'Our drivers now log deliveries in seconds instead of minutes. The team understood our workflow quickly and delivered exactly what we scoped.',
    name: 'Marcus Reed',
    role: 'Operations Director',
    company: 'Peak Logistics',
    rating: 5,
    service: 'app',
    isSample: true,
  },
  {
    id: 't-brightpath',
    quote:
      'The articles sound like us, not like a template. Organic traffic to our blog has tripled and our discovery calls now start with readers who already trust us.',
    name: 'Priya Nair',
    role: 'Marketing Manager',
    company: 'BrightPath Coaching',
    rating: 5,
    service: 'content',
    isSample: true,
  },
  {
    id: 't-orchard',
    quote:
      'I had twenty years of expertise and no time to write. They turned my interviews into a book I am proud of, with a cover that stands next to the bestsellers.',
    name: 'Maya Collins',
    role: 'Author and business coach',
    company: 'Orchard Books',
    rating: 5,
    service: 'ebook',
    isSample: true,
  },
];

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find((testimonial) => testimonial.id === id);
}
