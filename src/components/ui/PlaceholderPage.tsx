type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="container py-16 md:py-24">
      <h1>{title}</h1>
      <p className="mt-4 max-w-prose text-muted">{description}</p>
    </section>
  );
}
