import Link from 'next/link';
import { CtaBand } from '@/components/sections/CtaBand';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { PricingOverview } from '@/components/sections/PricingOverview';
import { PricingTiers } from '@/components/sections/PricingTiers';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { pricingFaqs } from '@/data/about';
import { pricing } from '@/data/pricing';
import { services } from '@/data/services';
import { formatUsd } from '@/lib/format';
import { buildMetadata, faqJsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Pricing: Transparent Packages for Every Service',
  description:
    'Clear price ranges for web design, mobile apps, content writing and e-book publishing. Compare Starter, Growth and Premium packages, add-ons and rush delivery.',
  path: '/pricing',
});

export default function PricingPage() {
  const rushPercent = Math.round((pricing.rushMultiplier - 1) * 100);

  return (
    <>
      <JsonLd data={faqJsonLd(pricingFaqs)} />

      <section className="bg-bg-subtle py-14 md:py-20">
        <div className="container max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">Pricing</p>
          <h1>Clear prices, no hidden extras</h1>
          <p className="mt-5 text-lg text-muted md:text-xl">
            Every package has a defined scope, a typical timeline and a transparent price range. Compare below, or get an
            instant estimate for your exact project.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/#estimate" size="lg">
              Get a Free Estimate
              <Icon name="arrow-right" size={18} />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Talk to us
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="overview-title" className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="overview-title"
            eyebrow="At a glance"
            title="Compare packages across services"
            description="Typical project ranges in USD. Your fixed quote is confirmed after we review your requirements."
          />
          <div className="mt-12">
            <PricingOverview />
          </div>
        </div>
      </section>

      {services.map((service, index) => (
        <section
          key={service.key}
          id={service.slug}
          aria-labelledby={`${service.slug}-title`}
          className={`scroll-mt-24 py-16 md:py-24 ${index % 2 === 0 ? 'bg-bg-subtle' : ''}`}
        >
          <div className="container">
            <SectionHeading
              id={`${service.slug}-title`}
              eyebrow={service.shortName}
              title={service.name}
              description={service.tagline}
            />
            <div className="mt-14">
              <PricingTiers service={service} />
            </div>
            <p className="mt-8 text-center">
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-brand hover:underline"
              >
                See everything included in {service.shortName.toLowerCase()}
                <Icon name="arrow-right" size={16} />
              </Link>
            </p>
          </div>
        </section>
      ))}

      <section aria-labelledby="extras-title" className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="extras-title"
            eyebrow="Extras"
            title="Add-ons and rush delivery"
            description="Add what you need to any package. Each one is priced separately so you only pay for what you use."
          />
          <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pricing.addOns.map((addOn) => (
              <li key={addOn.id} className="rounded-md border border-border bg-surface p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base">{addOn.name}</h3>
                  <p className="whitespace-nowrap font-semibold text-brand">
                    {formatUsd(addOn.price)}
                    {addOn.billing === 'monthly' ? <span className="text-sm text-muted"> /month</span> : null}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted">{addOn.description}</p>
              </li>
            ))}
            <li className="rounded-md border border-brand bg-bg-subtle p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base">Rush delivery</h3>
                <p className="whitespace-nowrap font-semibold text-brand">+{rushPercent}%</p>
              </div>
              <p className="mt-1 text-sm text-muted">
                Compressed timeline with a prioritized team, added to the one-time project price.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-bg-subtle py-16 md:py-24">
        <div className="container">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Pricing questions, answered" />
          <div className="mt-12">
            <FaqAccordion faqs={pricingFaqs} />
          </div>
        </div>
      </section>

      <div className="pt-16 md:pt-24" />
      <CtaBand
        title="Get a price for your exact project"
        description="Use the calculator for an instant range, or send us your brief and we will reply with a fixed quote within one business day."
        ctaLabel="Start your order request"
        ctaHref="/contact"
      />
    </>
  );
}
