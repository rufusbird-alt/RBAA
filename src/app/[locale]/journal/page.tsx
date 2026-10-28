import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllJournalEntries, formatDate, readingTime } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SubscribeForm } from '@/components/journal/SubscribeForm';

const heroImage = {
  src: '/images/journal/coppenol_calligraphy-amsterdam-town-hall-detail_01.jpg',
  alt: 'Detail of calligraphy by Lieven van Coppenol, 1657, verses dedicated to the governors of Amsterdam on their new Town Hall (Rijksmuseum, Amsterdam)',
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Journal',
    description:
      'Essays, notes, rediscoveries, and market commentary. Read chronologically, or filter by theme.',
    path: '/journal',
    locale,
  });
}

const themeSlug = (theme: string) => theme.toLowerCase().replace(/\s+/g, '-');

const themes = [
  'Attribution',
  'Condition',
  'Provenance',
  'Rediscoveries',
  'On the Market',
  'On Collecting',
  'On Valuation',
  'Practice',
];

export default function JournalPage({
  searchParams,
}: {
  searchParams: { theme?: string };
}) {
  const allEntries = getAllJournalEntries();
  // Only headings with at least one essay are shown; empty ones appear once used
  const activeThemes = themes.filter((theme) => allEntries.some((e) => e.theme === theme));
  const selected = activeThemes.find((theme) => themeSlug(theme) === searchParams.theme);
  const entries = selected ? allEntries.filter((e) => e.theme === selected) : allEntries;
  const filterClass = (active: boolean) =>
    `text-xs small-caps transition-colors ${
      active
        ? 'text-[var(--accent)] border-b border-[var(--accent)] pb-0.5'
        : 'text-[var(--muted)] hover:text-[var(--accent)]'
    }`;

  return (
    <>
      {/* Hero image */}
      <figure className="border-b border-[var(--rule)]">
        <div className="relative aspect-[3/2] md:aspect-[2/1] overflow-hidden">
          <Image src={heroImage.src} alt={heroImage.alt} fill priority className="object-cover" sizes="100vw" />
        </div>
        <figcaption className="max-w-[var(--measure)] mx-auto px-[var(--gutter)] py-3 text-xs text-[var(--ink-muted)]">
          Lieven van Coppenol, verses dedicated to the governors of Amsterdam on their new Town
          Hall, 1657 (detail). Pen and brown ink on paper. Written by Coppenol, the city&rsquo;s
          celebrated writing-master, at the age of 58.{' '}
          <a
            href="https://www.rijksmuseum.nl/en/collection/RP-T-00-412"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--accent)] transition-colors"
          >
            Rijksmuseum, Amsterdam
          </a>
          .
        </figcaption>
      </figure>

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">Journal</p>
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">
            Essays and notes
          </h1>
          <p className="mt-6 text-xl italic text-[var(--ink-soft)]">
            Essays, notes, rediscoveries, and market commentary. Read chronologically, or filter by
            theme.
          </p>
          <p className="mt-5 text-sm text-[var(--ink-muted)]">
            Also published on{' '}
            <a
              href="https://rufusbird.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:text-[var(--accent-soft)] hover:border-[var(--accent-soft)] transition-colors"
            >
              Substack →
            </a>
          </p>
          <SubscribeForm />
        </div>
      </section>

      {/* Theme filter: each heading filters the list below, on this page */}
      <nav
        id="essays"
        aria-label="Filter essays by theme"
        className="py-6 border-b border-[var(--rule)] bg-[var(--ground-soft)] scroll-mt-20"
      >
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/journal#essays" scroll={false} className={filterClass(!selected)}>
                All ({allEntries.length})
              </Link>
            </li>
            {activeThemes.map((theme) => (
              <li key={theme}>
                <Link
                  href={`/journal?theme=${themeSlug(theme)}#essays`}
                  scroll={false}
                  className={filterClass(theme === selected)}
                  aria-current={theme === selected ? 'page' : undefined}
                >
                  {theme} ({allEntries.filter((e) => e.theme === theme).length})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <div className="border-t border-[var(--rule)]">
            {entries.map((entry) => (
              <article
                key={entry.slug}
                className="py-8 border-b border-[var(--rule)] grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-x-12"
              >
                <div>
                  <Eyebrow>
                    {entry.theme} · {formatDate(entry.date)}
                  </Eyebrow>
                  <h2 className="mt-2 font-display text-xl italic">
                    <Link
                      href={`/journal/${entry.slug}`}
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      {entry.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-prose">
                    {entry.excerpt}
                  </p>
                </div>
                <div className="text-xs small-caps text-[var(--muted)] whitespace-nowrap self-start mt-1 sm:text-right">
                  <p>{readingTime(entry.wordCount)}</p>
                  {entry.footnoteCount > 0 && (
                    <p className="mt-1">{entry.footnoteCount} fn.</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
