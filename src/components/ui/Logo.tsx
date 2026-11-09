import Link from 'next/link';
import { site } from '@/data/site';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex min-h-[44px] items-center gap-2.5 ${className ?? ''}`} aria-label={`${site.name} home`}>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-gradient text-white shadow-sm"
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h14M12 6v13" />
        </svg>
      </span>
      <span className="font-heading text-lg font-bold tracking-tight">
        TopSmart<span className="text-brand">LLC</span>
      </span>
    </Link>
  );
}
