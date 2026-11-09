'use client';

import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/Field';
import { budgetOptions, timelineOptions } from '@/data/options';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { formatBytes } from '@/lib/schemas/files';
import type { LeadInput } from '@/lib/schemas/lead';

type StepContactProps = {
  form: UseFormReturn<LeadInput>;
  fileCount: number;
  totalBytes: number;
};

export function StepContact({ form, fileCount, totalBytes }: StepContactProps) {
  const { register, watch, formState } = form;
  const { errors } = formState;
  const selected = watch('services') ?? [];
  const budget = budgetOptions.find((option) => option.value === watch('budget'))?.label;
  const timeline = timelineOptions.find((option) => option.value === watch('timeline'))?.label;
  const serviceNames = services.filter((s) => selected.includes(s.key)).map((s) => s.name);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Phone or WhatsApp"
          optional
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <TextField label="Company" optional autoComplete="organization" error={errors.company?.message} {...register('company')} />
      </div>

      <section aria-labelledby="review-title" className="rounded-md border border-border bg-bg-subtle p-5">
        <h3 id="review-title" className="font-heading text-base">
          Your request
        </h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="w-28 shrink-0 text-muted">Services</dt>
            <dd className="font-medium">{serviceNames.join(', ') || 'None selected'}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="w-28 shrink-0 text-muted">Budget</dt>
            <dd className="font-medium">{budget ?? 'Not chosen'}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="w-28 shrink-0 text-muted">Timeline</dt>
            <dd className="font-medium">{timeline ?? 'Not chosen'}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="w-28 shrink-0 text-muted">Attachments</dt>
            <dd className="font-medium">
              {fileCount === 0 ? 'None' : `${fileCount} ${fileCount === 1 ? 'file' : 'files'} (${formatBytes(totalBytes)})`}
            </dd>
          </div>
        </dl>
      </section>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--brand)]"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            {...register('consent')}
          />
          <span className="text-sm">
            I agree that TopSmartLLC may use my details and attachments to reply to this request, as described in the{' '}
            <Link href="/privacy" className="font-medium text-brand underline" target="_blank">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent?.message ? (
          <p id="consent-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-danger">
            <Icon name="close" size={16} />
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      <p className="text-xs text-muted">
        We only use your details to reply to your request. We reply {site.replyTime}.
      </p>
    </div>
  );
}
