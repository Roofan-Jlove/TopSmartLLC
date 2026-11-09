import { OrderForm } from '@/components/forms/OrderForm';
import { Icon } from '@/components/ui/Icon';
import { site } from '@/data/site';
import { getServerEnv } from '@/lib/env';
import { SERVICE_KEYS, SOURCE_KEYS } from '@/lib/schemas/lead';
import { buildMetadata } from '@/lib/seo';
import type { LeadSource, ServiceKey } from '@/types/lead';

export const metadata = buildMetadata({
  title: 'Contact & Order Request',
  description:
    'Tell us about your website, app, content or e-book project and attach any files. Get a clear reply and quote within one business day.',
  path: '/contact',
});

type PageProps = { searchParams: { services?: string; source?: string } };

function parseServices(value?: string): ServiceKey[] {
  const keys = (value ?? '').split(',').map((part) => part.trim());
  return SERVICE_KEYS.filter((key) => keys.includes(key));
}

function parseSource(value?: string): LeadSource {
  return (SOURCE_KEYS as readonly string[]).includes(value ?? '') ? (value as LeadSource) : 'contact';
}

export default function ContactPage({ searchParams }: PageProps) {
  const { maxUploadBytes } = getServerEnv();

  return (
    <>
      <section className="bg-bg-subtle py-12 md:py-16">
        <div className="container max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">Start your project</p>
          <h1>Tell us what you need</h1>
          <p className="mt-4 text-lg text-muted">
            Three short steps. Attach briefs, sketches or screenshots if you have them. We reply {site.replyTime}.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16" aria-label="Order request">
        <div className="container grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-lg border border-border bg-surface p-5 shadow-md sm:p-8">
            <OrderForm
              initialServices={parseServices(searchParams.services)}
              initialSource={parseSource(searchParams.source)}
              maxUploadBytes={maxUploadBytes}
            />
          </div>

          <aside className="space-y-6" aria-label="Contact details and next steps">
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-xl">What happens next</h2>
              <ol className="mt-4 space-y-3 text-sm">
                {[
                  'We read your brief and any files you attach.',
                  `We reply ${site.replyTime} with questions and a recommended package.`,
                  'You get a fixed quote and timeline. No obligation.',
                ].map((item, index) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-fg">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-xl">Prefer to talk?</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a className="inline-flex min-h-[44px] items-center gap-2 hover:text-brand" href={`mailto:${site.email}`}>
                    <Icon name="mail" size={18} className="text-brand" />
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex min-h-[44px] items-center gap-2 hover:text-brand"
                    href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}
                  >
                    <Icon name="phone" size={18} className="text-brand" />
                    {site.phone}
                  </a>
                </li>
                <li className="text-muted">{site.hours}</li>
              </ul>
            </div>

            <p className="flex items-start gap-2 text-xs text-muted">
              <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
              Your details and files are used only to reply to your request and are not stored on our website.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
