export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--ground)] focus:px-4 focus:py-2 focus:text-sm focus:border focus:border-[var(--accent)]"
    >
      Skip to main content
    </a>
  );
}
