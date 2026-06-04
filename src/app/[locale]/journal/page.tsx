import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllJournalEntries, formatDate, readingTime } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Eyebrow } from '@/components/ui/Eyebrow';

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

export default function JournalPage() {
  const entries = getAllJournalEntries();

  return (
    <>
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
        </div>
      </section>

      {/* Theme filter — static labels in Phase 2; interactive in Phase 4 */}
      <section className="py-6 border-b border-[var(--rule)] bg-[var(--ground-soft)]">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {themes.map((theme) => (
              <li key={theme}>
                <span className="text-xs small-caps text-[var(--muted)]">{theme}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
      {/* Publications, lectures & media */}
      <section className="py-16">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <h2 className="font-display text-2xl italic mb-8">Publications, lectures &amp; media</h2>
          <div className="space-y-10">

            <div>
              <h3 className="text-xs small-caps text-[var(--muted)] mb-4">Lectures</h3>
              <ul className="space-y-3">
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://vimeo.com/1049450177/8e11338201?share=copy" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    Rothschild Lecture, Palm Beach, 2025
                  </a>
                </li>
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://www.frick.org/interact/rufus_bird_objects_fashion_and_seduction_mounted_asian_porcelains_and_lacquers" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    Objects, Fashion and Seduction: Mounted Asian Porcelains and Lacquers — Frick Collection, 2016
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs small-caps text-[var(--muted)] mb-4">Books</h3>
              <ul className="space-y-3">
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://yalebooks.co.uk/book/9780300267464/st-jamess-palace/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    <em>St James's Palace</em> — Yale University Press
                  </a>
                </li>
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://www.bloomsbury.com/uk/jeanhenri-riesener-9781781300909/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    <em>Jean-Henri Riesener</em> — Bloomsbury
                  </a>
                </li>
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://www.furniturehistorysociety.org/journals/search/?keywords=Rufus+Bird&x=24&y=26" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    Articles in <em>Furniture History</em>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs small-caps text-[var(--muted)] mb-4">Exhibitions</h3>
              <ul className="space-y-3">
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://www.rct.uk/collection/exhibitions/george-iv-art-spectacle/the-queens-gallery-buckingham-palace" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    George IV: Art &amp; Spectacle — The Queen's Gallery, Buckingham Palace, 2019
                  </a>
                </li>
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://www.rct.uk/collection/exhibitions/charles-ii-art-power/the-queens-gallery-palace-of-holyroodhouse" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    Charles II: Art &amp; Power — The Queen's Gallery, Palace of Holyroodhouse, 2017
                  </a>
                </li>
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://www.rct.uk/collection/exhibitions/the-first-georgians/the-queens-gallery-buckingham-palace" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    The First Georgians — The Queen's Gallery, Buckingham Palace, 2014
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs small-caps text-[var(--muted)] mb-4">Media</h3>
              <ul className="space-y-3">
                <li className="text-sm text-[var(--ink-soft)]">
                  <a href="https://www.bbc.co.uk/programmes/p05r355t" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)] transition-colors border-b border-[var(--rule)] pb-0.5">
                    BBC — The Royal Collection
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
