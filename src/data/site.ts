import type { NavLink, SocialLink, Stat, TrustBadge } from '@/types/site';

/**
 * TODO(launch): replace every value marked "placeholder" with real company details
 * before going live (see docs/PLAN.md launch checklist).
 */
export const site = {
  name: 'TopSmartLLC',
  legalName: 'TopSmartLLC', // placeholder: add legal suffix/registration
  tagline: 'Web, apps, content and e-books from one expert team',
  description:
    'TopSmartLLC is your single partner for web design and development, Android and iOS apps, SEO content writing, and e-book creation and publishing.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  email: 'hello@topsmartllc.com', // placeholder
  phone: '+1 (555) 010-2040', // placeholder
  hours: 'Mon–Fri, 9:00–18:00 (UTC)',
  address: 'Remote-first team serving clients worldwide', // placeholder
  foundingYear: 2019, // placeholder
  replyTime: 'within 1 business day',
} as const;

export const serviceNav: NavLink[] = [
  {
    label: 'Web Design & Development',
    href: '/services/web-design-development',
    description: 'Fast, conversion-focused websites and web apps',
    icon: 'web',
  },
  {
    label: 'Mobile App Development',
    href: '/services/mobile-app-development',
    description: 'Android and iOS apps, published to the stores',
    icon: 'app',
  },
  {
    label: 'Content Writing & Copywriting',
    href: '/services/content-writing-copywriting',
    description: 'SEO articles and copy that ranks and sells',
    icon: 'content',
  },
  {
    label: 'E-book Creation & Publishing',
    href: '/services/ebook-creation-publishing',
    description: 'From manuscript to publish-ready e-book',
    icon: 'ebook',
  },
];

export const mainNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const companyLinks: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

/** Placeholder handles: replace before launch. */
export const socialLinks: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/topsmartllc', platform: 'linkedin' },
  { label: 'X (Twitter)', href: 'https://x.com/topsmartllc', platform: 'x' },
  { label: 'Instagram', href: 'https://www.instagram.com/topsmartllc', platform: 'instagram' },
  { label: 'GitHub', href: 'https://github.com/topsmartllc', platform: 'github' },
];

export const primaryCta = { label: 'Get a Free Estimate', href: '/#estimate' } as const;
export const quoteCta = { label: 'Get a Quote', href: '/contact' } as const;

/** Placeholder figures: replace with real numbers before launch. */
export const trustBadges: TrustBadge[] = [
  { title: '150+ projects', detail: 'delivered for clients in 20+ countries' },
  { title: '4.9/5 rating', detail: 'average client satisfaction' },
  { title: '98% on-time', detail: 'delivery against agreed milestones' },
  { title: '30-day guarantee', detail: 'money-back if we miss the agreed scope' },
];

export const stats: Stat[] = [
  { value: 150, suffix: '+', label: 'Projects delivered' },
  { value: 60, suffix: '+', label: 'Happy clients' },
  { value: 12, suffix: '', label: 'Books published' },
  { value: 98, suffix: '%', label: 'On-time delivery' },
];

/** Fictional placeholder names for the logo strip. */
export const clientLogos = [
  'Northwind Coffee',
  'BrightPath Coaching',
  'Lumen Health',
  'Craftly Market',
  'Peak Logistics',
  'Orchard Books',
] as const;

export const howWeWork = [
  {
    title: 'Discover',
    description:
      'We learn your goals, audience and budget in a free 30-minute call and send a clear scope.',
  },
  {
    title: 'Design',
    description: 'You approve wireframes, outlines or sample chapters before we build anything.',
  },
  {
    title: 'Build',
    description: 'We deliver in short milestones with weekly demos, so there are never surprises.',
  },
  {
    title: 'Launch & support',
    description: 'We launch, publish or deliver, then stay on hand with post-launch support.',
  },
] as const;
