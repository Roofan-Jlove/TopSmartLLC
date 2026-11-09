import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { Icon } from './Icon';
import { cn } from '@/lib/utils';

const controlClass =
  'w-full rounded-sm border bg-bg px-4 text-base text-text placeholder:text-muted transition focus-visible:border-brand aria-[invalid=true]:border-danger';

type ShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
};

/** Label, hint and inline error wrapper. Errors are announced via role="alert". */
export function FieldShell({ id, label, error, hint, optional, children }: ShellProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm text-danger">
          <Icon name="close" size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, optional, className, ...props },
  ref,
) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional}>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlClass, 'h-12', error ? 'border-danger' : 'border-border', className)}
        {...props}
      />
    </FieldShell>
  );
});

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, optional, className, ...props },
  ref,
) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlClass, 'min-h-[160px] resize-y py-3', error ? 'border-danger' : 'border-border', className)}
        {...props}
      />
    </FieldShell>
  );
});
