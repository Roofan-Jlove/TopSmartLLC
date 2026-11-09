import type { ProcessStep } from '@/types/service';

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="relative mx-auto max-w-3xl space-y-8 border-l-2 border-border pl-8">
      {steps.map((step, index) => (
        <li key={step.title} className="relative">
          <span
            className="absolute -left-[49px] flex h-9 w-9 items-center justify-center rounded-full bg-brand font-heading text-sm font-bold text-brand-fg ring-4 ring-bg"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-xl">{step.title}</h3>
            <p className="text-sm font-medium text-brand">{step.duration}</p>
          </div>
          <p className="mt-1 text-muted">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
