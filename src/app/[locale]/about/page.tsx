import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { buildMetadata } from '@/lib/seo';
import { CareerTimeline } from '@/components/about/CareerTimeline';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'About',
    description:
      "Rufus Bird — Cambridge, Christie's, the Royal Household, Gurr Johns, and now an independent practice in Shaftesbury, Dorset. Twenty-five years inside European works of art.",
    path: '/about',
    locale,
  });
}

const affiliations = [
  'Society of Fine Art Auctioneers',
  'CINOA (associate)',
  'Burlington Magazine contributor',
];

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <>
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">{t('eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">
            {t('headline')}
          </h1>
        </div>
      </section>

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)] space-y-5">
          <p>{t('bio.p1')}</p>
          <p>{t('bio.p2')}</p>
          <p>{t('bio.p3')}</p>
          <div className="mt-6">
            <Link
              href="/about/full-biography"
              className="text-sm small-caps tracking-wider text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:text-[var(--accent-soft)] hover:border-[var(--accent-soft)] transition-colors"
            >
              {t('fullBioCta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <h2 className="font-display text-2xl italic mb-2">{t('careerHeading')}</h2>
          <CareerTimeline />
        </div>
      </section>

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <h2 className="font-display text-2xl italic mb-6">{t('publicationsHeading')}</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xs small-caps text-[var(--muted)] mb-3">
                {t('publicationsLabel')}
              </h3>
              <p className="text-sm text-[var(--ink-muted)] italic">{t('publicationsNote')}</p>
            </div>
            <div>
              <h3 className="text-xs small-caps text-[var(--muted)] mb-3">{t('lecturesLabel')}</h3>
              <p className="text-sm text-[var(--ink-muted)] italic">{t('lecturesNote')}</p>
            </div>
            <div>
              <h3 className="text-xs small-caps text-[var(--muted)] mb-3">
                {t('affiliationsLabel')}
              </h3>
              <ul className="space-y-1">
                {affiliations.map((a) => (
                  <li key={a} className="text-sm text-[var(--ink-soft)]">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <Button href="/contact">{t('cta')}</Button>
        </div>
      </section>
    </>
  );
}
