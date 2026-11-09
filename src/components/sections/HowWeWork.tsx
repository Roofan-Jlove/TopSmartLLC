import { howWeWork } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function HowWeWork() {
  return (
    <section aria-labelledby="how-title" className="bg-bg-subtle py-16 md:py-24">
      <div className="container">
        <SectionHeading
          id="how-title"
          eyebrow="How we work"
          title="A simple process with no surprises"
          description="Clear scope, weekly progress and approval at every stage, so you always know what happens next."
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howWeWork.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.06} className="h-full">
                <div className="h-full rounded-md border border-border bg-surface p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-heading font-bold text-brand-fg">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl">{step.title}</h3>
                  <p className="mt-2 text-muted">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
