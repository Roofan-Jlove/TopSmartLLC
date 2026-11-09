import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CaseStudyArt } from '@/components/sections/CaseStudyArt';
import { CATEGORY_LABEL } from '@/components/sections/PortfolioCard';
import { CtaBand } from '@/components/sections/CtaBand';
import { StarRating } from '@/components/ui/StarRating';
import { Icon } from '@/components/ui/Icon';
import { caseStudies, getCaseStudyBySlug } from '@/data/portfolio';
import { getTestimonialById } from '@/data/testimonials';
import { buildMetadata } from '@/lib/seo';

type PageProps = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) return {};
  return buildMetadata({
    title: study.title,
    description: study.summary,
    path: `/portfolio/${study.slug}`,
  });
}

export default function CaseStudyPage({ params }: PageProps) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((item) => item.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length]!;
  const testimonial = study.testimonialId ? getTestimonialById(study.testimonialId) : undefined;

  return (
    <>
      <section className="bg-bg-subtle py-12 md:py-16">
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
                <Link href="/portfolio" className="hover:text-brand">
                  Portfolio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-text">
                {study.client}
              </li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand">
                {CATEGORY_LABEL[study.category]} · {study.industry}
              </p>
              <h1 className="mt-3">{study.title}</h1>
              <p className="mt-4 text-lg text-muted md:text-xl">{study.summary}</p>
              <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted">Client</dt>
                  <dd className="font-semibold">{study.client}</dd>
                </div>
                <div>
                  <dt className="text-muted">Industry</dt>
                  <dd className="font-semibold">{study.industry}</dd>
                </div>
                <div>
                  <dt className="text-muted">Year</dt>
                  <dd className="font-semibold">{study.year}</dd>
                </div>
              </dl>
            </div>
            <CaseStudyArt study={study} className="rounded-lg shadow-md" />
          </div>
        </div>
      </section>

      <section aria-labelledby="results-title" className="py-14 md:py-20">
        <div className="container">
          <h2 id="results-title" className="text-center">
            The results
          </h2>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {study.results.map((result) => (
              <li key={result.label} className="rounded-lg border border-border bg-surface p-6 text-center shadow-sm">
                <p className="font-heading text-4xl font-bold text-brand">{result.value}</p>
                <p className="mt-2 text-sm text-muted">{result.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Challenge and solution" className="bg-bg-subtle py-14 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl">The challenge</h2>
            <p className="mt-4 text-lg text-muted">{study.challenge}</p>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl">Our solution</h2>
            <p className="mt-4 text-lg text-muted">{study.solution}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="tools-title" className="py-14 md:py-20">
        <div className="container text-center">
          <h2 id="tools-title" className="text-3xl md:text-4xl">
            Tools and methods
          </h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {study.tools.map((tool) => (
              <li key={tool} className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {testimonial ? (
        <section aria-label="Client testimonial" className="pb-14 md:pb-20">
          <div className="container">
            <figure className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-8 text-center shadow-md md:p-12">
              <StarRating rating={testimonial.rating} className="justify-center" />
              <blockquote className="mt-5 text-xl leading-relaxed md:text-2xl">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <figcaption className="mt-6">
                <span className="block font-heading font-semibold">{testimonial.name}</span>
                <span className="text-sm text-muted">
                  {testimonial.role}, {testimonial.company}
                </span>
              </figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      <section aria-label="Next project" className="border-t border-border py-10">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/portfolio" className="inline-flex min-h-[44px] items-center gap-2 font-medium hover:text-brand">
            <Icon name="chevron-left" size={18} />
            All projects
          </Link>
          <Link
            href={`/portfolio/${next.slug}`}
            className="inline-flex min-h-[44px] items-center gap-2 text-right font-medium hover:text-brand"
          >
            <span>
              <span className="block text-xs text-muted">Next project</span>
              {next.title}
            </span>
            <Icon name="chevron-right" size={18} />
          </Link>
        </div>
      </section>

      <CtaBand
        title="Want results like these?"
        description="Tell us about your project and attach any files. We reply within one business day."
        ctaLabel="Start your order request"
        ctaHref={`/contact?services=${study.category}&source=service-page`}
      />
    </>
  );
}
