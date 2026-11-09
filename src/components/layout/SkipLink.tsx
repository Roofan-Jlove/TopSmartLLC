export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only z-[100] rounded-full bg-brand px-5 py-3 font-semibold text-brand-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>
  );
}
