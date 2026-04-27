import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Biography — Rufus Bird',
    description:
      "The full professional biography of Rufus Bird: Cambridge, Christie's, the Royal Household, Gurr Johns, and twenty-five years of advisory practice.",
    path: '/about/full-biography',
    locale,
  });
}

export default function FullBiographyPage() {
  return (
    <section className="py-20">
      <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
        <p className="text-xs small-caps text-[var(--muted)] mb-4">Biography</p>
        <p className="font-display text-2xl italic leading-relaxed text-[var(--ink-muted)]">
          This page will carry the full biographical account of Rufus Bird&rsquo;s career to date.
          For now, please see the short biography and career timeline on the{' '}
          <Link href="/about" className="text-[var(--accent)] hover:text-[var(--accent-soft)]">
            About page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
