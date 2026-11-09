import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getCaseStudyBySlug } from '@/data/portfolio';
import type { CaseStudy } from '@/types/portfolio';
import { PortfolioCard } from './PortfolioCard';

const FEATURED = [
  'northwind-coffee-online-store',
  'lumen-health-patient-app',
  'brightpath-seo-content-engine',
];

export function PortfolioHighlights() {
  const studies = FEATURED.map(getCaseStudyBySlug).filter((s): s is CaseStudy => Boolean(s));

  return (
    <section aria-labelledby="work-title" className="py-16 md:py-24">
      <div className="container">
        <SectionHeading
          id="work-title"
          eyebrow="Selected work"
          title="Results our clients can measure"
          description="Real problems, clear solutions and numbers that show the impact."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study, index) => (
            <li key={study.slug}>
              <Reveal delay={index * 0.06} className="h-full">
                <PortfolioCard study={study} />
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <ButtonLink href="/portfolio" variant="secondary" size="lg">
            View all projects
            <Icon name="arrow-right" size={18} />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
