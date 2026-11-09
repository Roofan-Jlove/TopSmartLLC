import { Suspense } from 'react';
import { CtaBand } from '@/components/sections/CtaBand';
import { PortfolioCard } from '@/components/sections/PortfolioCard';
import { PortfolioGrid } from '@/components/sections/PortfolioGrid';
import { caseStudies } from '@/data/portfolio';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Portfolio & Case Studies',
  description:
    'Websites, mobile apps, content programs and e-books we have delivered, with the challenge, the solution and the measurable results.',
  path: '/portfolio',
});

export default function PortfolioPage() {
  return (
    <>
      <section className="bg-bg-subtle py-14 md:py-20">
        <div className="container max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">Our work</p>
          <h1>Projects that moved the numbers</h1>
          <p className="mt-5 text-lg text-muted md:text-xl">
            A selection of websites, apps, content programs and books, each with the problem we solved and the result
            it delivered.
          </p>
        </div>
      </section>

      <section aria-label="Projects" className="py-16 md:py-24">
        <div className="container">
          <h2 className="sr-only">All projects</h2>
          {/* Fallback lists every project, so crawlers and slow connections see the full portfolio. */}
          <Suspense
            fallback={
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {caseStudies.map((study) => (
                  <li key={study.slug}>
                    <PortfolioCard study={study} />
                  </li>
                ))}
              </ul>
            }
          >
            <PortfolioGrid />
          </Suspense>
        </div>
      </section>

      <CtaBand
        title="Want results like these?"
        description="Tell us about your project and attach any files. We reply within one business day."
        ctaLabel="Start your order request"
        ctaHref="/contact"
      />
    </>
  );
}
