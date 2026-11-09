import type { Service } from '@/types/service';
import type { ServiceKey } from '@/types/lead';

/** Source: docs/SERVICE_SPECIFICATIONS.md. Keep price ranges and add-on ids in sync with it. */
export const services: Service[] = [
  {
    key: 'web',
    slug: 'web-design-development',
    name: 'Web Design & Development',
    shortName: 'Web',
    icon: 'web',
    tagline: 'Websites that load fast, look premium and turn visitors into customers.',
    positioning:
      'Fast, beautiful, conversion-focused websites and web apps built around your business goals.',
    seoDescription:
      'Custom website design and development: responsive, SEO-ready and fast. Packages from $1,500 with CMS, e-commerce and web app options.',
    problems: [
      'Your current site is outdated, slow or hard to use on a phone',
      'Visitors arrive but never enquire or buy',
      'You do not show up on Google for the services you sell',
      'Updating content needs a developer every time',
    ],
    offerings: [
      'Business and marketing websites',
      'Sales and landing pages',
      'E-commerce stores',
      'Custom web apps and dashboards',
      'Redesign and migration',
      'CMS integration',
    ],
    features: [
      'Responsive, mobile-first UI/UX design',
      'SEO-ready structure and technical SEO',
      'Speed optimization for Core Web Vitals',
      'Contact and lead forms with email delivery',
      'Analytics and conversion tracking setup',
      'Accessibility to WCAG AA',
      'CMS for easy editing (Growth and Premium)',
      'Secure payments and inventory (e-commerce)',
    ],
    deliverables: [
      'Sitemap and wireframes',
      'High-fidelity design in Figma',
      'Production code repository you own',
      'Deployed, live website',
      'CMS and admin training session',
      '30-day post-launch support',
    ],
    process: [
      {
        title: 'Discovery',
        description: 'Goals, audience, competitors and content plan agreed in a short workshop.',
        duration: '2–3 days',
      },
      {
        title: 'Design',
        description: 'Wireframes and high-fidelity designs you review and approve.',
        duration: '1–2 weeks',
      },
      {
        title: 'Development',
        description: 'Clean, tested code with weekly demos on a staging link.',
        duration: '2–4 weeks',
      },
      {
        title: 'QA & launch',
        description: 'Cross-browser, accessibility and speed checks, then go live.',
        duration: '3–5 days',
      },
      {
        title: 'Support',
        description: 'Fixes, training and optional ongoing maintenance.',
        duration: '30 days included',
      },
    ],
    tiers: [
      {
        key: 'starter',
        name: 'Starter',
        priceMin: 1500,
        priceMax: 3000,
        summary: 'A sharp, mobile-ready site to get your business online.',
        includes: [
          'Up to 5 pages',
          'Responsive design',
          'Contact form',
          'Basic SEO setup',
          '1 round of copy placement',
        ],
        revisions: 2,
        timeline: '2–3 weeks',
      },
      {
        key: 'growth',
        name: 'Growth',
        priceMin: 3500,
        priceMax: 8000,
        summary: 'A content-managed site built to rank and generate leads.',
        includes: [
          'Up to 12 pages',
          'CMS and blog',
          'Advanced SEO',
          'Analytics setup',
          'Speed optimization',
        ],
        revisions: 3,
        timeline: '4–8 weeks',
        popular: true,
      },
      {
        key: 'premium',
        name: 'Premium',
        priceMin: 9000,
        priceMax: 25000,
        summary: 'Custom web apps and e-commerce with integrations.',
        includes: [
          'Up to 25 pages',
          'Custom web app or e-commerce features',
          'Third-party integrations',
          'Custom animations',
          '90-day support',
        ],
        revisions: 5,
        timeline: '8–16 weeks',
      },
    ],
    addOnIds: ['seo-audit', 'branding-logo', 'maintenance', 'uiux-audit', 'social-pack', 'hosting-domain'],
    faqs: [
      {
        question: 'How long does a website take?',
        answer:
          'Starter sites take 2–3 weeks and Growth sites 4–8 weeks, depending on how quickly you provide content and feedback.',
      },
      {
        question: 'Can I update the site myself?',
        answer:
          'Yes. Growth and Premium include a CMS and a training session so you can edit pages and posts without a developer.',
      },
      {
        question: 'Do you build online stores?',
        answer:
          'Yes. We build stores with product management, secure checkout and inventory. The Premium tier covers custom e-commerce.',
      },
      {
        question: 'Will my site rank on Google?',
        answer:
          'We build technical SEO in: structure, speed, metadata and schema. Rankings also depend on your content and competition, which our content services can support.',
      },
      {
        question: 'Who owns the code and design?',
        answer: 'You do. Ownership transfers to you on final payment.',
      },
      {
        question: 'Do you offer maintenance?',
        answer:
          'Yes, from $120 per month for updates, backups, security patches and uptime monitoring.',
      },
    ],
  },
  {
    key: 'app',
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    shortName: 'Mobile Apps',
    icon: 'app',
    tagline: 'Android and iOS apps, from idea to the Play Store and App Store.',
    positioning:
      'End-to-end mobile app development: scope, design, build, test and store submission.',
    seoDescription:
      'Android and iOS app development with Google Play and App Store submission. MVPs from $6,000, cross-platform and native options.',
    problems: [
      'You have an idea but no clear MVP scope',
      'You need Android and iOS on one budget',
      'You worry about store rejection and compliance',
      'You lack a technical partner who ships on time',
    ],
    offerings: [
      'MVP apps',
      'Cross-platform apps (React Native, Flutter)',
      'Native iOS and Android',
      'Backend and API development',
      'App redesign',
      'Store submission and launch',
    ],
    features: [
      'UX flows and clickable prototype',
      'Secure sign-in and user accounts',
      'Push notifications',
      'Payments and in-app purchases',
      'Offline mode (Premium)',
      'Analytics and crash reporting',
      'Admin panel (Growth and Premium)',
      'API and third-party integrations',
    ],
    deliverables: [
      'Product scope document',
      'Clickable prototype',
      'Full source code you own',
      'Test builds (TestFlight and internal testing)',
      'Store listings, screenshots and assets',
      'Submission to Google Play and the Apple App Store',
      '30-day post-launch support',
    ],
    process: [
      {
        title: 'Scoping',
        description: 'Define the MVP, user stories, platforms and technical approach.',
        duration: '1 week',
      },
      {
        title: 'UX/UI design',
        description: 'User flows and a clickable prototype you can test on your phone.',
        duration: '2 weeks',
      },
      {
        title: 'Build in sprints',
        description: 'Two-week sprints with a demo and a test build at the end of each.',
        duration: '4–12 weeks',
      },
      {
        title: 'Testing',
        description: 'Device testing, performance checks and bug fixing.',
        duration: '1–2 weeks',
      },
      {
        title: 'Store launch',
        description: 'Listings, compliance review and submission to both stores.',
        duration: '1–2 weeks',
      },
    ],
    tiers: [
      {
        key: 'starter',
        name: 'Starter',
        priceMin: 6000,
        priceMax: 12000,
        summary: 'A focused MVP on one platform to validate your idea.',
        includes: [
          'One platform (Android or iOS)',
          'Up to 8 screens',
          'Basic backend and API',
          'Store submission',
        ],
        revisions: 2,
        timeline: '6–8 weeks',
      },
      {
        key: 'growth',
        name: 'Growth',
        priceMin: 12000,
        priceMax: 30000,
        summary: 'A cross-platform app for Android and iOS with an admin panel.',
        includes: [
          'Android and iOS',
          'Up to 20 screens',
          'Admin panel',
          'Push notifications',
          'Analytics',
        ],
        revisions: 3,
        timeline: '10–16 weeks',
        popular: true,
      },
      {
        key: 'premium',
        name: 'Premium',
        priceMin: 30000,
        priceMax: 80000,
        summary: 'A full-scale product with custom backend and integrations.',
        includes: [
          'Up to 40 screens',
          'Custom backend',
          'Payments',
          'Advanced integrations',
          'Performance tuning',
          '90-day support',
        ],
        revisions: 5,
        timeline: '16–28 weeks',
      },
    ],
    addOnIds: ['branding-logo', 'uiux-audit', 'maintenance', 'seo-audit', 'hosting-domain'],
    faqs: [
      {
        question: 'Native or cross-platform?',
        answer:
          'Cross-platform fits most products and typically saves 30–40%. Native is recommended for heavy graphics, specialised hardware or maximum performance.',
      },
      {
        question: 'Do you publish to the stores?',
        answer:
          'Yes. We prepare listings, screenshots and compliance, and handle submission to Google Play and the Apple App Store. The developer accounts (Apple $99 per year, Google $25 one-time) are owned by you.',
      },
      {
        question: 'Can I start with an MVP?',
        answer:
          'Yes. The Starter tier is built for that and can grow into the Growth tier as you learn from real users.',
      },
      {
        question: 'Who owns the app code?',
        answer: 'You do. Ownership transfers to you on final payment.',
      },
      {
        question: 'How will I see progress?',
        answer:
          'Weekly demos, a shared task board and a test build at the end of every sprint.',
      },
      {
        question: 'What if a store rejects the app?',
        answer:
          'We fix the compliance issues and resubmit at no extra charge during your support period.',
      },
    ],
  },
  {
    key: 'content',
    slug: 'content-writing-copywriting',
    name: 'Content Writing & Copywriting',
    shortName: 'Content',
    icon: 'content',
    tagline: 'SEO content and persuasive copy that ranks, reads well and sells.',
    positioning: 'Researched, original writing in your brand voice, edited and SEO-optimized.',
    seoDescription:
      'SEO articles, website copy, landing pages and technical writing. Original, researched and optimized. Packages from $150.',
    problems: [
      'You have no time or in-house writer',
      'Your blog is not bringing organic traffic',
      'Your landing pages get visits but few conversions',
      'Your brand voice is inconsistent across channels',
    ],
    offerings: [
      'SEO articles and blog posts',
      'Website copy',
      'Sales and landing pages',
      'Technical writing',
      'Email sequences',
      'Product descriptions',
    ],
    features: [
      'Keyword and competitor research',
      'Brand-voice matching',
      'Outline approval before drafting',
      'On-page SEO and meta tags',
      'Plagiarism check on every piece',
      'Human editor review',
    ],
    deliverables: [
      'Approved content outlines',
      'Final copy in Google Docs or Word',
      'Meta titles and descriptions',
      'Plagiarism report',
      'Included revision rounds',
    ],
    process: [
      {
        title: 'Brief & voice',
        description: 'Goals, audience and brand voice captured from your samples.',
        duration: '1–2 days',
      },
      {
        title: 'Research & outline',
        description: 'Keyword and competitor research, then an outline for your approval.',
        duration: '2–3 days',
      },
      {
        title: 'Draft',
        description: 'Original writing following the approved outline.',
        duration: '3–7 days',
      },
      {
        title: 'Edit & SEO',
        description: 'Editor review, on-page optimization and plagiarism check.',
        duration: '2 days',
      },
      {
        title: 'Revisions & delivery',
        description: 'Your feedback applied and final files delivered.',
        duration: '1–3 days',
      },
    ],
    tiers: [
      {
        key: 'starter',
        name: 'Starter',
        priceMin: 150,
        priceMax: 800,
        summary: 'Clean, original copy for straightforward topics.',
        includes: ['Standard copy', 'Light research', 'Plagiarism check', 'Priced per word count'],
        revisions: 1,
        timeline: '3–5 days',
      },
      {
        key: 'growth',
        name: 'Growth',
        priceMin: 800,
        priceMax: 3000,
        summary: 'SEO-driven content built to attract and convert.',
        includes: [
          'Keyword research',
          'Outlines for approval',
          'On-page optimization',
          'Brand-voice matching',
        ],
        revisions: 2,
        timeline: '1–2 weeks',
        popular: true,
      },
      {
        key: 'premium',
        name: 'Premium',
        priceMin: 3000,
        priceMax: 10000,
        summary: 'Expert and technical content backed by strategy.',
        includes: [
          'Expert and technical writing',
          'Competitor analysis',
          'Content strategy',
          'Interview-based pieces',
          'Editor and SEO specialist review',
        ],
        revisions: 3,
        timeline: '2–4 weeks',
      },
    ],
    addOnIds: ['seo-audit', 'social-pack', 'branding-logo', 'uiux-audit'],
    faqs: [
      {
        question: 'Do you write in my brand voice?',
        answer:
          'Yes. We start from your existing samples and a short voice questionnaire, then share a sample paragraph for approval.',
      },
      {
        question: 'Is the content original?',
        answer:
          'Always. Every piece passes a plagiarism check and a human edit before delivery.',
      },
      {
        question: 'Do you handle SEO?',
        answer:
          'Growth and Premium include keyword research and on-page optimization. Starter is best for content without SEO targets.',
      },
      {
        question: 'How do you price content?',
        answer:
          'By tier and word count. Use the cost calculator for a live estimate.',
      },
      {
        question: 'Can you write technical articles?',
        answer:
          'Yes. Premium covers technical and expert-level topics, with subject-matter interviews where needed.',
      },
      {
        question: 'Who owns the content?',
        answer: 'You do, with full rights on payment.',
      },
    ],
  },
  {
    key: 'ebook',
    slug: 'ebook-creation-publishing',
    name: 'E-book Creation & Publishing',
    shortName: 'E-books',
    icon: 'ebook',
    tagline: 'From raw idea to a polished, publish-ready e-book with a cover that sells.',
    positioning:
      'Research, ghostwriting, editing, layout and cover design, plus publishing setup.',
    seoDescription:
      'E-book ghostwriting, editing, layout, custom cover design and EPUB/PDF export with publishing setup for Amazon KDP, Apple Books and Kobo.',
    problems: [
      'You have the expertise but no time to write a book',
      'Your manuscript has messy formatting',
      'Your cover looks amateur next to bestsellers',
      'Publishing platforms feel confusing',
    ],
    offerings: [
      'Ghostwriting and research',
      'Editing and proofreading',
      'Layout and typesetting',
      'Custom cover design',
      'EPUB and PDF export',
      'Publishing setup (Amazon KDP, Apple Books, Kobo)',
    ],
    features: [
      'Chapter-by-chapter outline for approval',
      'Tone matching to your voice',
      'Two-pass editing (Premium)',
      'Professional typesetting',
      'EPUB and PDF validation',
      'Print-ready PDF on request',
      'Metadata and keyword setup',
    ],
    deliverables: [
      'Final manuscript',
      'EPUB and PDF files',
      'E-book and print covers',
      'Metadata sheet',
      'Platform upload guidance',
    ],
    process: [
      {
        title: 'Brief',
        description: 'Audience, goals, tone and book structure agreed.',
        duration: '2 days',
      },
      {
        title: 'Research & outline',
        description: 'Chapter outline and research plan for your approval.',
        duration: '1 week',
      },
      {
        title: 'Writing & editing',
        description: 'Ghostwriting or editing in chapter batches with your feedback.',
        duration: '2–8 weeks',
      },
      {
        title: 'Layout & cover',
        description: 'Professional typesetting and a custom cover design.',
        duration: '1–2 weeks',
      },
      {
        title: 'Export & publish',
        description: 'EPUB/PDF export and publishing setup on your chosen platforms.',
        duration: '3–5 days',
      },
    ],
    tiers: [
      {
        key: 'starter',
        name: 'Starter',
        priceMin: 500,
        priceMax: 1500,
        summary: 'Professional formatting for your finished manuscript.',
        includes: [
          'Formatting up to 100 pages',
          'EPUB and PDF export',
          'Template cover',
        ],
        revisions: 2,
        timeline: '1–2 weeks',
      },
      {
        key: 'growth',
        name: 'Growth',
        priceMin: 1500,
        priceMax: 5000,
        summary: 'Editing, custom layout and a custom cover.',
        includes: [
          'Editing and proofreading',
          'Custom layout',
          'Custom cover',
          'Up to 150 pages',
          'Publishing guidance',
        ],
        revisions: 3,
        timeline: '3–6 weeks',
        popular: true,
      },
      {
        key: 'premium',
        name: 'Premium',
        priceMin: 5000,
        priceMax: 15000,
        summary: 'We write it, edit it, design it and publish it.',
        includes: [
          'Research and ghostwriting',
          'Two-pass editing',
          'Custom layout and cover',
          'Up to 250 pages',
          'Publishing setup on 3 platforms',
        ],
        revisions: 5,
        timeline: '8–14 weeks',
      },
    ],
    addOnIds: ['branding-logo', 'social-pack', 'seo-audit', 'hosting-domain'],
    faqs: [
      {
        question: 'Do I keep the rights to my book?',
        answer:
          'Yes. Ghostwritten works are fully yours, and we sign an NDA on request.',
      },
      {
        question: 'Which formats do you deliver?',
        answer: 'EPUB and PDF, plus a print-ready PDF on request.',
      },
      {
        question: 'Can you design just the cover?',
        answer:
          'Yes. Contact us for a cover-only quote based on your genre and format.',
      },
      {
        question: 'Do you publish it for me?',
        answer:
          'We set up and guide uploads to Amazon KDP, Apple Books and Kobo. The publishing accounts remain yours.',
      },
      {
        question: 'How long does ghostwriting take?',
        answer: 'Typically 8–14 weeks for a 150–250 page book.',
      },
      {
        question: 'Can you edit what I already wrote?',
        answer:
          'Yes. The Growth tier includes developmental feedback, copy-editing and proofreading.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServiceByKey(key: ServiceKey): Service {
  const service = services.find((item) => item.key === key);
  if (!service) throw new Error(`Unknown service key: ${key}`);
  return service;
}

export function startingPrice(service: Service): number {
  return Math.min(...service.tiers.map((tier) => tier.priceMin));
}
