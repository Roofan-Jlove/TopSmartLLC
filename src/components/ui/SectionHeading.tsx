import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, description, align = 'center', className }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">{eyebrow}</p>
      ) : null}
      <h2 id={id}>{title}</h2>
      {description ? <p className="mt-4 text-lg text-muted">{description}</p> : null}
    </div>
  );
}
