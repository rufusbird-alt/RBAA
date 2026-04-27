import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllServices, getService, compileMDX } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import { UntranslatedBanner } from '@/components/ui/UntranslatedBanner';

export async function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const item = getService(slug);
  if (!item) return {};
  return buildMetadata({
    title: item.frontmatter.archetype,
    description: item.frontmatter.metaDescription,
    path: `/services/${slug}`,
    locale,
  });
}

export default function ServicePage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const item = getService(slug);
  if (!item) notFound();
  const { frontmatter: fm, content } = item;
  const html = compileMDX(content);

  return (
    <>
      <UntranslatedBanner locale={locale} />

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">{fm.tagline}</p>
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">
            {fm.archetype}
          </h1>
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
