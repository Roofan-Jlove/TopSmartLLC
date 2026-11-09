import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/types/portfolio';

/**
 * Generated artwork (gradient plus soft shapes) used until real project
 * screenshots exist. Pure CSS: no image requests, no layout shift.
 */
export function CaseStudyArt({ study, className }: { study: CaseStudy; className?: string }) {
  const [from, to] = study.gradient;
  return (
    <div
      className={cn('relative aspect-[16/10] overflow-hidden', className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-white/15" />
      <div className="absolute -bottom-10 right-4 h-44 w-44 rounded-full bg-black/10" />
      <div className="absolute inset-x-[12%] bottom-[14%] top-[22%] rounded-md bg-white/90 shadow-md" />
      <div className="absolute left-[16%] top-[30%] h-2.5 w-1/3 rounded bg-black/20" />
      <div className="absolute left-[16%] top-[40%] h-2 w-1/2 rounded bg-black/10" />
      <div className="absolute left-[16%] top-[48%] h-2 w-2/5 rounded bg-black/10" />
      <span className="absolute bottom-[20%] right-[16%] flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md" style={{ backgroundColor: from }}>
        <Icon name={study.category} size={24} />
      </span>
    </div>
  );
}
