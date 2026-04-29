import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllCaseStudies, getCaseStudy, compileMDX } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { UntranslatedBanner } from '@/components/ui/UntranslatedBanner';
import { JsonLd } from '@/components/ui/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rufusbirdartadvisory.com';

export async function generateStaticParams() {
  return getAllCaseStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const item = getCaseStudy(slug);
  if (!item) return {};
  const { frontmatter: fm } = item;
  return buildMetadata({
    title: fm.title,
    description: `${fm.mandate} — ${fm.location}. ${fm.scope}`,
    path: `/case-studies/${slug}`,
    locale,
    type: 'article',
  });
}

export default function CaseStudyPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const item = getCaseStudy(slug);
  if (!item) notFound();
  const { frontmatter: fm, content } = item;
  const html = compileMDX(content);

  const caseStudyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    articleSection: 'Case Study',
    headline: fm.title,
    description: `${fm.mandate} — ${fm.location}. ${fm.scope}`,
    datePublished: fm.date,
    url: `${siteUrl}/case-studies/${slug}`,
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#rufus-bird`,
    },
    publisher: { '@id': `${siteUrl}/#organization` },
    ...(fm.heroImage ? { image: `${siteUrl}${fm.heroImage}` } : {}),
  };

  return (
    <>
      <JsonLd data={caseStudyJsonLd} />
      <UntranslatedBanner locale={locale} />

      <div className="h-2 bg-[var(--accent)]" aria-hidden />

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <Eyebrow>Case Study · {fm.location} · {fm.duration}</Eyebrow>
          <h1 className="mt-3 font-display text-4xl md:text-5xl italic leading-tight">
            {fm.title}
          </h1>
        </div>
      </section>

      <section className="py-10 border-b border-[var(--rule)] bg-[var(--ground-soft)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {[
              { label: 'Mandate', value: fm.mandate },
              { label: 'Client', value: fm.client },
              { label: 'Object types', value: fm.objectTypes.join(', ') },
              { label: 'Duration', value: fm.duration },
              { label: 'Status', value: fm.status },
              { label: 'Scope', value: fm.scope },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs small-caps text-[var(--muted)]">{label}</dt>
                <dd className="mt-0.5 text-sm text-[var(--ink-soft)]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 border-b border-[var(--rule)]">
        <article
          className="max-w-[var(--measure)] mx-auto px-[var(--gutter)] rbaa-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      <section className="py-12">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <Button href="/contact">Begin a conversation →</Button>
        </div>
      </section>
    </>
  );
}
