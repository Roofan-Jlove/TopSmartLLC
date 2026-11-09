'use client';

import type { UseFormReturn } from 'react-hook-form';
import { Icon } from '@/components/ui/Icon';
import { budgetOptions, timelineOptions } from '@/data/options';
import { services } from '@/data/services';
import type { LeadInput } from '@/lib/schemas/lead';
import type { ServiceKey } from '@/types/lead';

const chip =
  'flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-border bg-surface px-4 text-sm font-medium transition hover:border-brand peer-checked:border-brand peer-checked:bg-brand peer-checked:text-brand-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand';

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-danger">
      {message}
    </p>
  );
}

export function StepServices({ form }: { form: UseFormReturn<LeadInput> }) {
  const { register, watch, setValue, formState } = form;
  const selected = watch('services') ?? [];
  const errors = formState.errors;

  const toggle = (key: ServiceKey) => {
    const next = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
    setValue('services', next, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-8">
      <fieldset aria-describedby={errors.services ? 'services-error' : undefined}>
        <legend className="mb-3 text-base font-semibold">What do you need? Select all that apply.</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <label key={service.key} className="block">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={selected.includes(service.key)}
                onChange={() => toggle(service.key)}
              />
              <span className="flex min-h-[72px] cursor-pointer items-center gap-3 rounded-md border border-border bg-surface p-4 transition hover:border-brand peer-checked:border-brand peer-checked:bg-bg-subtle peer-checked:ring-1 peer-checked:ring-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-bg-subtle text-brand">
                  <Icon name={service.icon} />
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-snug">{service.name}</span>
                  <span className="block text-xs text-muted">{service.shortName}</span>
                </span>
                {selected.includes(service.key) ? (
                  <Icon name="check" size={20} className="ml-auto shrink-0 text-brand" />
                ) : null}
              </span>
            </label>
          ))}
        </div>
        <ErrorText id="services-error" message={errors.services?.message} />
      </fieldset>

      <fieldset aria-describedby={errors.budget ? 'budget-error' : undefined}>
        <legend className="mb-3 text-base font-semibold">What is your budget?</legend>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map((option) => (
            <label key={option.value}>
              <input type="radio" value={option.value} className="peer sr-only" {...register('budget')} />
              <span className={chip}>{option.label}</span>
            </label>
          ))}
        </div>
        <ErrorText id="budget-error" message={errors.budget?.message} />
      </fieldset>

      <fieldset aria-describedby={errors.timeline ? 'timeline-error' : undefined}>
        <legend className="mb-3 text-base font-semibold">When do you need it?</legend>
        <div className="flex flex-wrap gap-2">
          {timelineOptions.map((option) => (
            <label key={option.value}>
              <input type="radio" value={option.value} className="peer sr-only" {...register('timeline')} />
              <span className={chip}>{option.label}</span>
            </label>
          ))}
        </div>
        <ErrorText id="timeline-error" message={errors.timeline?.message} />
      </fieldset>
    </div>
  );
}
