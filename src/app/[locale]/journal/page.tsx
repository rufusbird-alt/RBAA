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

      <section className="py-16">
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
