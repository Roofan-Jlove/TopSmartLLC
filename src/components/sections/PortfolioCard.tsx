import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { ServiceKey } from '@/types/lead';
import type { CaseStudy } from '@/types/portfolio';
import { CaseStudyArt } from './CaseStudyArt';

export const CATEGORY_LABEL: Record<ServiceKey, string> = {
  web: 'Web',
  app: 'App',
  content: 'Content',
  ebook: 'E-book',
};

export function PortfolioCard({ study, style }: { study: CaseStudy; style?: React.CSSProperties }) {
  const headline = study.results[0];
  return (
    <article
      style={style}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition duration-200 ease-soft hover:-translate-y-1 hover:shadow-md motion-reduce:hover:translate-y-0"
    >
      <CaseStudyArt study={study} />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          {CATEGORY_LABEL[study.category]} · {study.industry}
        </p>
        <h3 className="mt-2 text-xl">
          {/* The stretched link makes the whole card clickable with a single tab stop. */}
          <Link href={`/portfolio/${study.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-brand">
            {study.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted">{study.summary}</p>
        {headline ? (
          <p className="mt-4 flex items-baseline gap-2 border-t border-border pt-4">
            <span className="font-heading text-2xl font-bold">{headline.value}</span>
            <span className="text-sm text-muted">{headline.label}</span>
          </p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Read case study
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
        </span>
      </div>
    </article>
  );
}
