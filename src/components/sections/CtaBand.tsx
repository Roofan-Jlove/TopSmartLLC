import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

type CtaBandProps = {
  id?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export function CtaBand({ id, title, description, ctaLabel, ctaHref }: CtaBandProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-24 pb-16 md:pb-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-lg bg-[linear-gradient(135deg,#3730a3,#4f46e5_60%,#0e7490)] px-6 py-12 text-center text-white shadow-glow md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgb(255_255_255/0.25),transparent_50%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 id={id ? `${id}-title` : undefined} className="text-white">
              {title}
            </h2>
            <p className="mt-4 text-lg text-white/90">{description}</p>
            <ButtonLink
              href={ctaHref}
              size="lg"
              className="mt-8 bg-white text-[#0b1020] shadow-md hover:bg-white/90"
            >
              {ctaLabel}
              <Icon name="arrow-right" size={18} />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
