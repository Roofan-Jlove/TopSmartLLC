import type { IconName } from '@/types/service';
import type { Faq } from '@/types/service';

/**
 * About-page content. The mission, values and ways of working are written as
 * commitments the business can keep. Review with the owner before launch.
 */

export const aboutStory = [
  'TopSmartLLC started with a simple frustration: small businesses, founders and authors were stitching together a web designer, an app developer, a copywriter and a book editor, and spending more time managing them than growing.',
  'We built one team that covers all four. A single brief, a single point of contact and a single standard of quality, from the first wireframe to the final EPUB.',
  'Today we work with startups, small and medium businesses, coaches and marketing teams around the world, remotely and in plain English, with clear scopes and prices up front.',
];

export const values: { title: string; description: string }[] = [
  {
    title: 'Clarity before code',
    description: 'We agree the scope, price and timeline in writing before work starts, so there are no surprises.',
  },
  {
    title: 'Results over deliverables',
    description: 'A finished site, app, article or book is the minimum. We measure success by leads, sales and readers.',
  },
  {
    title: 'Speed with care',
    description: 'Fast delivery never means cutting corners on accessibility, security or quality checks.',
  },
  {
    title: 'You own everything',
    description: 'Code, designs, copy and manuscripts belong to you on final payment. No lock-in.',
  },
];

export const disciplines: { title: string; icon: IconName; description: string }[] = [
  {
    title: 'Design & Engineering',
    icon: 'web',
    description: 'Designers and developers who build fast, accessible, search-friendly websites and web apps.',
  },
  {
    title: 'Mobile',
    icon: 'app',
    description: 'App specialists for Android and iOS who also handle store compliance and submission.',
  },
  {
    title: 'Content & SEO',
    icon: 'content',
    description: 'Researchers, writers and editors who turn your expertise into content that ranks and converts.',
  },
  {
    title: 'Publishing',
    icon: 'ebook',
    description: 'Ghostwriters, editors, typesetters and cover designers who take a book from idea to launch.',
  },
];

export const reasons = [
  'One team and one point of contact for web, apps, content and books',
  'Fixed-scope packages with transparent price ranges',
  'Weekly progress updates and approval at every stage',
  'You keep full ownership of everything we create',
  'Post-launch support included with every package',
];

export const pricingFaqs: Faq[] = [
  {
    question: 'Are these prices fixed?',
    answer:
      'The ranges show what projects of each size typically cost. After reviewing your requirements we send a fixed quote, and the price does not change unless the scope does.',
  },
  {
    question: 'How is the estimate calculated?',
    answer:
      'Each package has a base price that includes a set amount of work (for example, pages or screens). Extra pages, screens, words or e-book pages are priced per unit. Add-ons and rush delivery are added on top. The calculator on the homepage shows the full breakdown.',
  },
  {
    question: 'What does rush delivery cost?',
    answer:
      'Rush delivery adds 35% to the one-time project price and gives your project a compressed timeline with a prioritized team. Monthly plans are not affected.',
  },
  {
    question: 'How do payments work?',
    answer:
      'Your written quote sets out the payment schedule, usually tied to project milestones, so you never pay for work you have not seen.',
  },
  {
    question: 'What if I need something outside these packages?',
    answer:
      'Tell us what you need on the order form. We regularly combine services or tailor a package, and we will quote it in the same way.',
  },
  {
    question: 'Are revisions included?',
    answer:
      'Yes. Every package includes revision rounds, from 1 to 5 depending on the service and package. Extra rounds can be added to your quote.',
  },
];
