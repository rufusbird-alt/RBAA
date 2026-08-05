import type { Metadata } from 'next';
import { existsSync } from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { CareerTimeline } from '@/components/about/CareerTimeline';
import { PortraitFrame } from '@/components/about/PortraitFrame';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://rufusbirdartadvisory.com/#rufus-bird',
  name: 'Rufus Bird',
  jobTitle: 'Independent Art Advisor',
  alumniOf: 'University of Cambridge',
  worksFor: { '@id': 'https://rufusbirdartadvisory.com/#organization' },
  knowsAbout: [
    'European paintings 1500–1950',
    'European furniture',
    'Silver',
    'Books',
    'Old Masters',
    'Art valuation',
    'Attribution',
  ],
  knowsLanguage: ['en', 'de', 'fr', 'es', 'it'],
};

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
  'Fellow of the Society of Antiquaries of London',
  'Lieutenant of the Royal Victorian Order',
  'Trustee of Thirlestane Castle Trust',
  'Member of the Furniture History Society, The Beckford Society, The Society for the History of Collecting',
];

export default async function AboutPage() {
  const t = await getTranslations('about');
  // Try each portrait filename in preference order; update as needed
  const portraitCandidates = [
    'portrait-RB00009.jpg',
    'portrait.jpg',
    'portrait-RB00001.jpeg',
    'portrait-RB00002.jpeg',
    'portrait-RB00004.JPG',
  ];
  const portraitFile = portraitCandidates.find((f) =>
    existsSync(path.join(process.cwd(), 'public', 'images', f)),
  );
  const portraitSrc = portraitFile ? `/images/${portraitFile}` : null;

  return (
    <>
      <JsonLd data={personJsonLd} />

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">{t('eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">
            {t('headline')}
          </h1>
        </div>
      </section>

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <div className="space-y-5">
            {portraitSrc && (
              <PortraitFrame src={portraitSrc} alt="Rufus Bird" className="float-left mr-8 mb-4" />
            )}
            <p>{t('bio.p1')}</p>
            <p>{t('bio.p2')}</p>
            <p>{t('bio.p3')}</p>
          </div>
          <div className="clear-both" />
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
