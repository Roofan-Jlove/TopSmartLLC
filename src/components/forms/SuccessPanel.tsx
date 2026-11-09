'use client';

import { useEffect, useRef } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { site } from '@/data/site';

type SuccessPanelProps = {
  referenceId: string;
  attachmentsReceived: number;
  email: string;
  onReset: () => void;
};

export function SuccessPanel({ referenceId, attachmentsReceived, email, onReset }: SuccessPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div role="status" className="py-4 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <Icon name="check" size={32} />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-3xl outline-none md:text-4xl">
        Request received. Thank you!
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        We will reply to <strong className="text-text">{email}</strong> {site.replyTime}.
        {attachmentsReceived > 0
          ? ` Your ${attachmentsReceived} ${attachmentsReceived === 1 ? 'attachment was' : 'attachments were'} included.`
          : ''}
      </p>

      <div className="mx-auto mt-6 inline-block rounded-md border border-border bg-bg-subtle px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Your reference</p>
        <p className="mt-1 font-mono text-xl font-bold tracking-wide">{referenceId}</p>
      </div>

      <ol className="mx-auto mt-8 max-w-md space-y-3 text-left text-sm">
        {[
          'We review your brief and any files you sent.',
          'We reply with questions, a recommended package and a fixed quote.',
          'You approve the scope and we schedule your project.',
        ].map((item, index) => (
          <li key={item} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-fg">
              {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/">Back to the homepage</ButtonLink>
        <Button variant="secondary" onClick={onReset}>
          Send another request
        </Button>
      </div>
    </div>
  );
}
