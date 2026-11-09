import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/sections/CtaBand';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { PricingTiers } from '@/components/sections/PricingTiers';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getServiceBySlug, services, startingPrice } from '@/data/services';
import { formatUsd } from '@/lib/format';
import { addOnsFor, buildMetadata, faqJsonLd, serviceJsonLd } from '@/lib/seo';

type PageProps = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};
  return buildMetadata({
    title: service.name,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: PageProps) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const addOns = addOnsFor(service);
  const orderHref = `/contact?services=${service.key}&source=service-page`;

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={faqJsonLd(service.faqs)} />

      <section className="relative overflow-hidden bg-bg-subtle py-12 md:py-20">
        <div className="container">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-brand">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="hover:text-brand">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-text">
                {service.shortName}
              </li>
            </ol>
          </nav>
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-surface text-brand shadow-sm">
                <Icon name={service.icon} size={28} />
              </span>
              <h1 className="mt-5">{service.name}</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted md:text-xl">{service.tagline}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={orderHref} size="lg">
                  Order this service
                  <Icon name="arrow-right" size={18} />
                </ButtonLink>
                <ButtonLink href="#pricing" variant="secondary" size="lg">
                  See pricing
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted">Packages from</p>
              <p className="mt-1 font-heading text-4xl font-bold">{formatUsd(startingPrice(service))}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {service.tiers.map((tier) => (
                  <li key={tier.key} className="flex justify-between gap-4 border-t border-border pt-2">
                    <span className="font-medium">{tier.name}</span>
                    <span className="text-muted">{tier.timeline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="overview-title" className="py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="overview-title">Sound familiar?</h2>
            <p className="mt-4 text-lg text-muted">{service.positioning}</p>
            <ul className="mt-6 space-y-3">
              {service.problems.map((problem) => (
                <li key={problem} className="flex items-start gap-3">
                  <Icon name="close" size={20} className="mt-0.5 shrink-0 text-danger" />
                  {problem}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm md:p-8">
            <h3>What we offer</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.offerings.map((offering) => (
                <li key={offering} className="flex items-start gap-2.5 text-sm">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-success" />
                  {offering}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-title" className="bg-bg-subtle py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="features-title" className="text-3xl md:text-4xl">
              Features
            </h2>
            <ul className="mt-6 space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl">What you receive</h2>
            <ul className="mt-6 space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="process-title"
            eyebrow="Process"
            title="How the project runs"
            description="A clear sequence with an approval at each stage."
          />
          <div className="mt-12">
            <ProcessTimeline steps={service.process} />
          </div>
        </div>
      </section>

      <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-24 bg-bg-subtle py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="pricing-title"
            eyebrow="Pricing"
            title="Choose the package that fits"
            description="Typical project ranges in USD. The final quote is confirmed after we review your requirements."
          />
          <div className="mt-14">
            <PricingTiers service={service} />
          </div>

          <div className="mt-16">
            <h3 className="text-center">Optional add-ons</h3>
            <ul className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
              {addOns.map((addOn) => (
                <li key={addOn.id} className="rounded-md border border-border bg-surface p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-heading font-semibold">{addOn.name}</p>
                    <p className="whitespace-nowrap font-semibold text-brand">
                      {formatUsd(addOn.price)}
                      {addOn.billing === 'monthly' ? <span className="text-sm text-muted"> /month</span> : null}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted">{addOn.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="py-16 md:py-24">
        <div className="container">
          <SectionHeading id="faq-title" eyebrow="FAQ" title={`${service.shortName} questions, answered`} />
          <div className="mt-12">
            <FaqAccordion faqs={service.faqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Ready to start your ${service.shortName.toLowerCase()} project?`}
        description="Send your requirements and any files or images. We reply within one business day with next steps."
        ctaLabel="Order this service"
        ctaHref={orderHref}
      />
    </>
  );
}
