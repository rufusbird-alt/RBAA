import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCaseStudies, formatDate } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Eyebrow } from '@/components/ui/Eyebrow';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Case Studies',
    description:
      'Work the client has released us to discuss. Where discretion requires, the principals remain anonymous and commercial details are withheld.',
    path: '/case-studies',
    locale,
  });
}

export default function CaseStudiesPage() {
  const studies = getAllCaseStudies();

  return (
    <>
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">Case Studies</p>
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">
            Work in the world
          </h1>
          <p className="mt-6 text-xl italic text-[var(--ink-soft)]">
            Work the client has released us to discuss. Where discretion requires, the principals
            remain anonymous and commercial details are withheld.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <div className="space-y-0 border-t border-[var(--rule)]">
            {studies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="block py-10 border-b border-[var(--rule)] hover:bg-[var(--ground-soft)] -mx-[var(--gutter)] px-[var(--gutter)] transition-colors group"
              >
                <Eyebrow>
                  {study.mandate} · {study.location} · {study.year}
                </Eyebrow>
                <h2 className="mt-2 font-display text-2xl italic group-hover:text-[var(--accent)] transition-colors">
                  {study.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{study.scope}</p>
                <p className="mt-3 text-sm small-caps text-[var(--accent)]">Read the study →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
