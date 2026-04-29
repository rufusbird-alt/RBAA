import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllJournalEntries, getJournalEntry, compileMDX, formatDate, readingTime } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { UntranslatedBanner } from '@/components/ui/UntranslatedBanner';
import { JsonLd } from '@/components/ui/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rufusbirdartadvisory.com';

export async function generateStaticParams() {
  return getAllJournalEntries().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const item = getJournalEntry(slug);
  if (!item) return {};
  const { frontmatter: fm } = item;
  return buildMetadata({
    title: fm.title,
    description: fm.excerpt,
    path: `/journal/${slug}`,
    locale,
    type: 'article',
  });
}

export default function JournalEntryPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const item = getJournalEntry(slug);
  if (!item) notFound();
  const { frontmatter: fm, content } = item;
  const html = compileMDX(content);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.excerpt,
    datePublished: fm.date,
    dateModified: fm.date,
    wordCount: fm.wordCount,
    keywords: [fm.theme],
    url: `${siteUrl}/journal/${slug}`,
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#rufus-bird`,
      name: fm.author,
    },
    publisher: { '@id': `${siteUrl}/#organization` },
    ...(fm.coverImage ? { image: `${siteUrl}${fm.coverImage}` } : {}),
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <UntranslatedBanner locale={locale} />

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <Eyebrow>
            {fm.theme} · {formatDate(fm.date)} · {readingTime(fm.wordCount)}
          </Eyebrow>
          <h1 className="mt-3 font-display text-3xl md:text-4xl italic leading-snug">
            {fm.title}
          </h1>
          <p className="mt-4 text-xs small-caps text-[var(--muted)]">By {fm.author}</p>
        </div>
      </section>

      <section className="py-16">
        <article
          className="max-w-[var(--measure)] mx-auto px-[var(--gutter)] rbaa-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>
    </>
  );
}
