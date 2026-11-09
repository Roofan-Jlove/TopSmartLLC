import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-soft focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-brand-fg shadow-glow hover:-translate-y-0.5 hover:bg-brand-strong motion-reduce:hover:translate-y-0',
  secondary: 'border border-border bg-surface text-text hover:border-brand hover:text-brand',
  ghost: 'text-text hover:bg-bg-subtle',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
};

export function buttonStyles(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles(variant, size, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles(variant, size, className)} {...props} />;
}
