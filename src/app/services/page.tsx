import { CtaBand } from '@/components/sections/CtaBand';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { services } from '@/data/services';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Services: Web, Mobile Apps, Content & E-books',
  description:
    'Web design and development, Android and iOS apps, SEO content writing, and e-book creation and publishing. Fixed-scope packages with clear price ranges.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <section className="bg-bg-subtle py-14 md:py-20">
        <div className="container max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">Our services</p>
          <h1>Everything you need to launch, grow and get found</h1>
          <p className="mt-5 text-lg text-muted md:text-xl">
            Four specialist services under one roof. Every package has a defined scope, a typical timeline and a
            transparent price range, so you can plan with confidence.
          </p>
        </div>
      </section>

      <section aria-label="All services" className="py-16 md:py-24">
        <div className="container grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.key} service={service} />
          ))}
        </div>
      </section>

      <CtaBand
        title="Not sure which service fits?"
        description="Describe your project and attach any files. We will recommend the right package and reply within one business day."
        ctaLabel="Start your order request"
        ctaHref="/contact"
      />
    </>
  );
}
