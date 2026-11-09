import type { Metadata } from 'next';
import { Calculator } from '@/components/sections/Calculator';
import { CtaBand } from '@/components/sections/CtaBand';
import { Hero } from '@/components/sections/Hero';
import { HowWeWork } from '@/components/sections/HowWeWork';
import { LogoStrip } from '@/components/sections/LogoStrip';
import { ServicesTabs } from '@/components/sections/ServicesTabs';
import { PortfolioHighlights } from '@/components/sections/PortfolioHighlights';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: { absolute: 'TopSmartLLC | Web Design, Mobile Apps, Content Writing & E-book Publishing' },
  description:
    'One expert team for your website, mobile app, content and e-book. Fixed-scope packages, transparent pricing and a free instant estimate.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'TopSmartLLC | Web, Apps, Content & E-books',
    description:
      'One expert team for your website, mobile app, content and e-book. Get a free instant estimate.',
    url: '/',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoStrip />

      <section id="services" aria-labelledby="services-title" className="scroll-mt-24 py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="services-title"
            eyebrow="What we do"
            title="Four services, one accountable team"
            description="Pick one or combine them. Every package has a fixed scope, a clear timeline and a price range up front."
          />
          <div className="mt-12">
            <ServicesTabs />
          </div>
        </div>
      </section>

      <PortfolioHighlights />
      <HowWeWork />

      <section aria-labelledby="proof-title" className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="proof-title"
            eyebrow="Client stories"
            title="What our clients say"
            description="Founders, coaches and marketing teams on working with TopSmartLLC."
          />
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      <Stats />

      <section id="estimate" aria-labelledby="estimate-title" className="scroll-mt-24 bg-bg-subtle py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="estimate-title"
            eyebrow="Free estimate"
            title="See your project cost in two minutes"
            description="Choose your services, size your project and get an instant price range. No sign-up needed."
          />
          <div className="mt-12">
            <Calculator />
          </div>
        </div>
      </section>

      <div className="pt-16 md:pt-24" />
      <CtaBand
        title="Ready to start your project?"
        description="Tell us what you need and attach any files or images. You will get a clear reply within one business day."
        ctaLabel="Start your order request"
        ctaHref="/contact"
      />
    </>
  );
}
