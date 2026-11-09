'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { ContactResponse } from '@/lib/api-types';
import { leadSchema, STEP_FIELDS, type LeadInput } from '@/lib/schemas/lead';
import { omit } from '@/lib/utils';
import type { LeadSource, ServiceKey } from '@/types/lead';
import { FormProgress } from './FormProgress';
import { StepContact } from './StepContact';
import { StepDetails } from './StepDetails';
import { StepServices } from './StepServices';
import { SuccessPanel } from './SuccessPanel';

type OrderFormProps = {
  initialServices: ServiceKey[];
  initialSource: LeadSource;
  maxUploadBytes: number;
};

type Step = 1 | 2 | 3;
type Status = 'idle' | 'sending' | 'success';

const DRAFT_KEY = 'tsl.draft';
const ESTIMATE_KEY = 'tsl.estimate';

const STEP_TITLES: Record<Step, string> = {
  1: 'What do you need?',
  2: 'Tell us about your project',
  3: 'How can we reach you?',
};

const FIELD_STEP: Partial<Record<keyof LeadInput, Step>> = {
  services: 1,
  budget: 1,
  timeline: 1,
  description: 2,
  links: 2,
  name: 3,
  email: 3,
  phone: 3,
  company: 3,
  consent: 3,
};

const GENERIC_ERROR = 'We could not send your request. Please try again.';

function readSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked (private mode); the form still works without a draft.
  }
}

function clearSession(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function OrderForm({ initialServices, initialSource, maxUploadBytes }: OrderFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<Status>('idle');
  const [showSummary, setShowSummary] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ referenceId: string; attachmentsReceived: number; email: string } | null>(null);
  const [estimateSummary, setEstimateSummary] = useState('');

  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  const upload = useFileUpload(maxUploadBytes);

  const defaults: Partial<LeadInput> = {
    name: '',
    email: '',
    phone: '',
    company: '',
    services: initialServices,
    description: '',
    links: '',
    estimateSummary: '',
    consent: false,
    source: initialSource,
  };

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    // Errors are shown when the visitor presses Continue or Send, never on blur. Validating on blur
    // changes the layout between mouse-down and mouse-up, which swallows the click on the button.
    mode: 'onSubmit',
    defaultValues: defaults,
  });
  const { handleSubmit, trigger, setValue, setError, reset, watch, formState } = form;

  // Restore a saved draft and any calculator estimate (client-only data).
  useEffect(() => {
    const draft = readSession<Partial<LeadInput>>(DRAFT_KEY);
    if (draft) {
      reset({
        ...defaults,
        ...draft,
        services: initialServices.length > 0 ? initialServices : (draft.services ?? []),
        source: initialSource,
        consent: false,
      });
    }
    if (initialSource === 'calculator') {
      const estimate = readSession<{ services: ServiceKey[]; summary: string }>(ESTIMATE_KEY);
      if (estimate?.summary) {
        setEstimateSummary(estimate.summary);
        setValue('estimateSummary', estimate.summary);
        if (initialServices.length === 0 && estimate.services?.length) setValue('services', estimate.services);
      }
    }
    // Runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once a field has an error, re-check it on every change so the message clears as soon as it is fixed
  // (react-hook-form only does this after a full submit, and our steps use trigger()).
  useEffect(() => {
    const subscription = watch((_values, { name }) => {
      if (name && form.getFieldState(name).error) void trigger(name);
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger, form]);

  // Save text fields (never files, consent or the estimate) as the visitor types.
  useEffect(() => {
    const subscription = watch((values) => {
      writeSession(DRAFT_KEY, omit(values, 'consent', 'estimateSummary'));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Move focus to the step heading when the step changes (not on first paint).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, status]);

  const stepErrorCount = STEP_FIELDS[step].filter((name) => formState.errors[name]).length;

  const goNext = useCallback(async () => {
    const valid = await trigger([...STEP_FIELDS[step]], { shouldFocus: true });
    if (!valid) {
      setShowSummary(true);
      return;
    }
    setShowSummary(false);
    setStep((current) => (current < 3 ? ((current + 1) as Step) : current));
  }, [step, trigger]);

  const goBack = () => {
    setShowSummary(false);
    setServerError(null);
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current));
  };

  const send = async (values: LeadInput) => {
    setStatus('sending');
    setServerError(null);

    const body = new FormData();
    body.append('name', values.name);
    body.append('email', values.email);
    body.append('phone', values.phone);
    body.append('company', values.company);
    values.services.forEach((service) => body.append('services', service));
    body.append('budget', values.budget);
    body.append('timeline', values.timeline);
    body.append('description', values.description);
    body.append('links', values.links);
    body.append('estimateSummary', estimateSummary);
    body.append('consent', 'true');
    body.append('source', values.source);
    body.append('website', honeypotRef.current?.value ?? '');
    upload.files.forEach(({ file }) => body.append('attachments', file, file.name));

    let data: ContactResponse | null = null;
    try {
      const response = await fetch('/api/contact', { method: 'POST', body });
      data = (await response.json()) as ContactResponse;
    } catch {
      // Network failure, or a non-JSON reply from the platform (e.g. an over-size body).
    }

    if (data?.ok) {
      clearSession(DRAFT_KEY);
      clearSession(ESTIMATE_KEY);
      setSuccess({ referenceId: data.referenceId, attachmentsReceived: data.attachmentsReceived, email: values.email });
      upload.reset();
      setStatus('success');
      return;
    }

    setStatus('idle');
    const error = data && !data.ok ? data.error : null;
    setServerError(error?.message ?? GENERIC_ERROR);

    let earliest: Step = 3;
    for (const [field, message] of Object.entries(error?.fields ?? {})) {
      if (field === 'attachments') {
        upload.setServerError(message);
        earliest = Math.min(earliest, 2) as Step;
      } else if (field in FIELD_STEP) {
        setError(field as keyof LeadInput, { type: 'server', message });
        earliest = Math.min(earliest, FIELD_STEP[field as keyof LeadInput] ?? 3) as Step;
      }
    }
    if (error?.fields && Object.keys(error.fields).length > 0) setStep(earliest);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    if (step < 3) {
      void goNext();
      return;
    }
    void handleSubmit(send, () => setShowSummary(true))(event);
  };

  const startOver = () => {
    reset({ ...defaults, services: [] });
    setEstimateSummary('');
    setSuccess(null);
    setStep(1);
    setStatus('idle');
  };

  if (status === 'success' && success) {
    return <SuccessPanel {...success} onReset={startOver} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="order-form-title">
      <h2 id="order-form-title" className="sr-only">
        Order request form
      </h2>
      <FormProgress step={step} />

      <h3 ref={headingRef} tabIndex={-1} className="mt-8 text-2xl outline-none md:text-3xl">
        {STEP_TITLES[step]}
      </h3>

      {estimateSummary && step === 1 ? (
        <details className="mt-4 rounded-md border border-brand bg-bg-subtle p-4 text-sm">
          <summary className="cursor-pointer font-medium">Your calculator estimate is attached to this request</summary>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-muted">{estimateSummary}</pre>
        </details>
      ) : null}

      {showSummary && stepErrorCount > 0 ? (
        <div role="alert" className="mt-4 rounded-md border border-danger bg-danger/10 p-4 text-sm text-danger">
          Please fix the {stepErrorCount} highlighted {stepErrorCount === 1 ? 'field' : 'fields'} to continue.
        </div>
      ) : null}

      <div className="mt-6">
        {step === 1 ? <StepServices form={form} /> : null}
        {step === 2 ? <StepDetails form={form} upload={upload} maxBytes={maxUploadBytes} /> : null}
        {step === 3 ? (
          <StepContact form={form} fileCount={upload.files.length} totalBytes={upload.totalBytes} />
        ) : null}
      </div>

      {/* Honeypot: invisible to people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {serverError ? (
        <div role="alert" className="mt-6 rounded-md border border-danger bg-danger/10 p-4 text-sm text-danger">
          {serverError}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 1 ? (
          <Button variant="ghost" onClick={goBack} disabled={status === 'sending'}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button type="submit" size="lg">
            Continue
            <Icon name="arrow-right" size={18} />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={status === 'sending'} aria-busy={status === 'sending'}>
            {status === 'sending' ? 'Sending your request…' : 'Send my request'}
          </Button>
        )}
      </div>
    </form>
  );
}
