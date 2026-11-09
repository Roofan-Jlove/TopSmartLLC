import { clientLogos } from '@/data/site';

export function LogoStrip() {
  return (
    <section aria-label="Trusted by" className="border-y border-border bg-bg-subtle py-8">
      <div className="container">
        <p className="text-center text-sm font-medium text-muted">
          Trusted by founders, coaches and growing brands
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {clientLogos.map((name) => (
            <li key={name} className="font-heading text-lg font-semibold tracking-tight text-muted">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
