'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { caseStudies, portfolioCategories } from '@/data/portfolio';
import { cn } from '@/lib/utils';
import type { ServiceKey } from '@/types/lead';
import { PortfolioCard } from './PortfolioCard';

type Category = 'all' | ServiceKey;

const VALID = new Set<string>(portfolioCategories.map((c) => c.value));

/** Filter buttons synced to `?category=` so a filtered view can be shared, bookmarked and survives refresh. */
export function PortfolioGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get('category') ?? 'all';
  const active: Category = VALID.has(raw) ? (raw as Category) : 'all';
  const visible = active === 'all' ? caseStudies : caseStudies.filter((study) => study.category === active);

  const select = (category: Category) => {
    const next = new URLSearchParams(searchParams.toString());
    if (category === 'all') next.delete('category');
    else next.set('category', category);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const countFor = (category: Category) =>
    category === 'all' ? caseStudies.length : caseStudies.filter((study) => study.category === category).length;

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap justify-center gap-2">
        {portfolioCategories.map((category) => {
          const selected = category.value === active;
          return (
            <button
              key={category.value}
              type="button"
              aria-pressed={selected}
              onClick={() => select(category.value)}
              className={cn(
                'min-h-[44px] rounded-full border px-5 text-sm font-medium transition',
                selected
                  ? 'border-brand bg-brand text-brand-fg shadow-sm'
                  : 'border-border bg-surface hover:border-brand hover:text-brand',
              )}
            >
              {category.label}
              <span className={cn('ml-1.5', selected ? 'opacity-80' : 'text-muted')}>({countFor(category.value)})</span>
            </button>
          );
        })}
      </div>

      <p role="status" className="sr-only">
        Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        {active === 'all' ? '' : ` in ${portfolioCategories.find((c) => c.value === active)?.label}`}.
      </p>

      {/* key restarts the entrance animation whenever the filter changes */}
      <ul key={active} className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((study, index) => (
          <li key={study.slug} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
            <PortfolioCard study={study} />
          </li>
        ))}
      </ul>
    </div>
  );
}
