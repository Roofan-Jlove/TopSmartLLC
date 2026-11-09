import { CtaBand } from '@/components/sections/CtaBand';
import { HowWeWork } from '@/components/sections/HowWeWork';
import { Stats } from '@/components/sections/Stats';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { aboutStory, disciplines, reasons, values } from '@/data/about';
import { site } from '@/data/site';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About Us',
  description:
    'TopSmartLLC is one team for websites, mobile apps, content writing and e-book publishing. Meet the people, the values and the process behind your project.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <section className="bg-bg-subtle py-14 md:py-20">
        <div className="container max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">About {site.name}</p>
          <h1>One team for everything you need to launch and grow</h1>
          <p className="mt-5 text-lg text-muted md:text-xl">
            We design, build, write and publish, so you work with one accountable partner instead of four separate
            suppliers.
          </p>
        </div>
      </section>

      <section aria-labelledby="story-title" className="py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">Our story</p>
            <h2 id="story-title">Built to make working with an agency simple</h2>
          </div>
          <div className="space-y-5 text-lg text-muted">
            {aboutStory.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <section aria-labelledby="values-title" className="bg-bg-subtle py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="values-title"
            eyebrow="What we stand for"
            title="Four promises behind every project"
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {values.map((value, index) => (
              <li key={value.title}>
                <Reveal delay={index * 0.05} className="h-full">
                  <div className="h-full rounded-lg border border-border bg-surface p-6 shadow-sm md:p-8">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-heading font-bold text-brand-fg">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 text-xl">{value.title}</h3>
                    <p className="mt-2 text-muted">{value.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="team-title" className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            id="team-title"
            eyebrow="The team"
            title="Specialists under one roof"
            description="Four disciplines that work together on your project, so nothing gets lost between suppliers."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {disciplines.map((discipline) => (
              <li key={discipline.title} className="rounded-lg border border-border bg-surface p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-bg-subtle text-brand">
                  <Icon name={discipline.icon} />
                </span>
                <h3 className="mt-4 text-xl">{discipline.title}</h3>
                <p className="mt-2 text-sm text-muted">{discipline.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HowWeWork />

      <section aria-labelledby="why-title" className="py-16 md:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">Why TopSmartLLC</p>
            <h2 id="why-title">What you can expect when you work with us</h2>
          </div>
          <ul className="space-y-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3 text-lg">
                <Icon name="check" size={22} className="mt-1 shrink-0 text-success" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Let's talk about your project"
        description="Send us a few details and any files you have. We reply within one business day with next steps."
        ctaLabel="Start your order request"
        ctaHref="/contact"
      />
    </>
  );
}
