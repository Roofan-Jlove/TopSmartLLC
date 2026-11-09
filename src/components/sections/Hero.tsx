import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { primaryCta, trustBadges } from '@/data/site';

/**
 * Server component, no images and no entrance animation on the text, so the
 * headline is the LCP element and paints with the first HTML response.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,var(--brand),transparent)] opacity-20"
        aria-hidden="true"
      />
      <div className="container relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted shadow-sm">
            <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
            Taking on new projects this month
          </p>
          <h1 id="hero-title" className="mt-6">
            One expert team for your{' '}
            <span className="bg-gradient-to-r from-brand to-accent-strong bg-clip-text text-transparent">
              website, app, content and <span className="whitespace-nowrap">e-book</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">
            Stop juggling freelancers. TopSmartLLC designs, builds, writes and publishes, so you
            launch faster, look more professional and win more customers.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
              <Icon name="arrow-right" size={18} />
            </ButtonLink>
            <ButtonLink href="/portfolio" variant="secondary" size="lg">
              View Our Work
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">
            Free estimate in 2 minutes. No account, no obligation.
          </p>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-8 sm:grid-cols-4">
            {trustBadges.map((badge) => (
              <li key={badge.title}>
                <p className="font-heading text-lg font-bold">{badge.title}</p>
                <p className="mt-0.5 text-sm text-muted">{badge.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

/** Decorative, CSS/SVG-only composition of the four services. Hidden below lg to keep mobile light. */
function HeroVisual() {
  return (
    <div
      className="relative mx-auto hidden h-[460px] w-full max-w-[460px] lg:block"
      aria-hidden="true"
    >
      <div className="absolute inset-6 rounded-lg bg-brand-gradient opacity-90 shadow-glow" />
      <div className="absolute inset-6 rounded-lg bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.35),transparent_55%)]" />

      <div className="absolute left-0 top-10 w-60 animate-float rounded-md border border-border bg-surface p-4 shadow-md">
        <div className="mb-3 flex gap-1.5">
          <span className="bg-danger/70 h-2.5 w-2.5 rounded-full" />
          <span className="bg-warning/70 h-2.5 w-2.5 rounded-full" />
          <span className="bg-success/70 h-2.5 w-2.5 rounded-full" />
        </div>
        <div className="bg-brand/80 h-3 w-3/4 rounded" />
        <div className="mt-2 h-2 w-full rounded bg-border" />
        <div className="mt-1.5 h-2 w-5/6 rounded bg-border" />
        <div className="mt-4 h-8 w-24 rounded-full bg-brand" />
      </div>

      <div className="absolute right-0 top-28 w-32 animate-float rounded-lg border border-border bg-surface p-3 shadow-md [animation-delay:-2s]">
        <div className="mx-auto mb-2 h-1.5 w-10 rounded bg-border" />
        <div className="bg-accent/30 h-16 rounded-md" />
        <div className="mt-2 h-2 w-full rounded bg-border" />
        <div className="mt-1.5 h-2 w-2/3 rounded bg-border" />
        <div className="mt-3 h-6 rounded-full bg-brand" />
      </div>

      <div className="absolute bottom-24 left-6 w-56 animate-float rounded-md border border-border bg-surface p-4 shadow-md [animation-delay:-4s]">
        <div className="bg-text/70 h-2.5 w-2/3 rounded" />
        <div className="mt-3 space-y-1.5">
          <div className="h-2 w-full rounded bg-border" />
          <div className="h-2 w-full rounded bg-border" />
          <div className="h-2 w-4/5 rounded bg-border" />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-success">
          <Icon name="check" size={14} />
          SEO score 94
        </div>
      </div>

      <div className="absolute bottom-6 right-8 flex h-40 w-28 animate-float items-end rounded-md bg-gradient-to-br from-text to-brand-strong p-3 shadow-md [animation-delay:-1s]">
        <div>
          <div className="h-1.5 w-12 rounded bg-white/80" />
          <div className="mt-1.5 h-1.5 w-8 rounded bg-white/50" />
        </div>
      </div>
    </div>
  );
}
