import { Icon } from '@/components/ui/Icon';
import type { Faq } from '@/types/service';

/** Native <details> disclosure: keyboard and screen-reader accessible with zero client JavaScript. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-md border border-border bg-surface">
      {faqs.map((faq) => (
        <details key={faq.question} className="group p-5 md:p-6">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {faq.question}
            <Icon
              name="chevron-down"
              className="shrink-0 text-brand transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="mt-3 text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
