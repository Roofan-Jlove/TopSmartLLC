import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

const STEPS = ['Project', 'Details', 'Contact'] as const;

export function FormProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted">
        Step {step} of {STEPS.length}: <span className="text-text">{STEPS[step - 1]}</span>
      </p>
      <ol className="mt-3 flex items-center gap-2" aria-label="Form progress">
        {STEPS.map((label, index) => {
          const number = index + 1;
          const done = number < step;
          const current = number === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2" aria-current={current ? 'step' : undefined}>
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  done && 'bg-success text-white',
                  current && 'bg-brand text-brand-fg',
                  !done && !current && 'border border-border text-muted',
                )}
              >
                {done ? <Icon name="check" size={16} /> : number}
                <span className="sr-only">
                  {label}
                  {done ? ' (completed)' : current ? ' (current)' : ''}
                </span>
              </span>
              {index < STEPS.length - 1 ? (
                <span className={cn('h-0.5 flex-1 rounded-full', done ? 'bg-success' : 'bg-border')} aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
