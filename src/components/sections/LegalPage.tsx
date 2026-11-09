import Link from 'next/link';
import type { LegalDocument } from '@/data/legal';

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <section className="bg-bg-subtle py-12 md:py-16">
        <div className="container max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-brand">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-text">
                {document.title}
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl">{document.title}</h1>
          <p className="mt-3 text-sm text-muted">Last updated: {document.lastUpdated}</p>
        </div>
      </section>

      <article className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <p className="text-lg">{document.intro}</p>
          {document.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="text-2xl md:text-3xl">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-muted">
                  {paragraph}
                </p>
              ))}
              {section.list ? (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-muted marker:text-brand">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
            See also:{' '}
            <Link href="/privacy" className="text-brand underline">
              Privacy Policy
            </Link>
            ,{' '}
            <Link href="/terms" className="text-brand underline">
              Terms of Service
            </Link>
            ,{' '}
            <Link href="/cookies" className="text-brand underline">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
      </article>
    </>
  );
}
