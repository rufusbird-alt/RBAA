import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import Image from 'next/image';
import { getAllJournalEntries, formatDate, getAllServices } from '@/lib/content';
import { QuotesCarousel } from '@/components/home/QuotesCarousel';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';

const heroImage = { src: '/images/home/panini-ancient-rome.jpg', alt: 'Pannini, A View of Ancient Rome' };

export default async function HomePage() {
  const t = await getTranslations('home');
  const tc = await getTranslations('common');
  const recentEntries = getAllJournalEntries().slice(0, 4);
  const services = getAllServices();

  return (
    <>
      {/* §1.1 Intro text replacing the hero image */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">Independent art advisory</p>
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">
            Rufus Bird Art Advisory
          </h1>
          <p className="mt-6 text-xl italic text-[var(--ink-soft)]">{t('definingStatement')}</p>
        </div>
      </section>

      {/* §1.1 Hero — quotes carousel */}
      <QuotesCarousel />

      {/* §1.2 Defining statement */}
      <section className="py-16 border-b border-[var(--rule)]">
        <p className="max-w-[44rem] mx-auto px-[var(--gutter)] text-center text-2xl md:text-3xl leading-snug font-display italic">
          {t('definingStatement')}
        </p>
      </section>

      {/* §1.3 Opening paragraphs */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)] grid gap-10 md:grid-cols-[minmax(0,20rem)_1fr] md:items-start">
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src="/images/portrait-RB00003.jpg"
              alt="Rufus Bird"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
          <div className="space-y-5 max-w-[var(--measure)]">
            <p>{t('opening.p1')}</p>
            <p>{t('opening.p2')}</p>
            <p>{t('opening.p3')}</p>
            <p>{t('opening.p4')}</p>
            <p>{t('opening.p5')}</p>
          </div>
        </div>
      </section>

      {/* §1.4 Approach teaser */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <blockquote className="text-xl md:text-2xl italic leading-relaxed text-[var(--ink)]">
            {t('approachTeaser.quote')}
            <footer className="mt-5 not-italic small-caps text-sm text-[var(--ink-muted)]">
              {t('approachTeaser.attribution')}
            </footer>
          </blockquote>
          <ul className="mt-8 space-y-2 text-[var(--ink-soft)]">
            <li><em>{t('approachTeaser.d1italic')}</em> {t('approachTeaser.d1plain')}</li>
            <li><em>{t('approachTeaser.d2italic')}</em> {t('approachTeaser.d2plain')}</li>
            <li><em>{t('approachTeaser.d3italic')}</em> {t('approachTeaser.d3plain')}</li>
            <li><em>{t('approachTeaser.d4italic')}</em> {t('approachTeaser.d4plain')}</li>
          </ul>
          <div className="mt-8">
            <Button href="/approach">{t('approachTeaser.cta')}</Button>
          </div>
        </div>
      </section>

      {/* §1.5 Services teaser */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <SectionTitle>{t('servicesSection')}</SectionTitle>
          <div className="mt-10 grid gap-px bg-[var(--rule)] border border-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="block bg-[var(--ground)] p-8 hover:bg-[var(--ground-soft)] transition-colors group"
              >
                <h3 className="font-display text-xl italic group-hover:text-[var(--accent)] transition-colors">
                  {service.archetype}
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{service.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* §1.6 Featured case study */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <Eyebrow>{t('caseStudy.eyebrow')}</Eyebrow>
          <h2 className="mt-3 font-display text-3xl md:text-4xl italic max-w-2xl leading-snug">
            {t('caseStudy.headline')}
          </h2>
          {t('caseStudy.pull') && (
            <blockquote className="mt-6 text-xl italic text-[var(--ink-soft)]">
              {t('caseStudy.pull')}
            </blockquote>
          )}
          <div className="mt-8">
            <Button href="/case-studies/venetian-palazzo">{t('caseStudy.cta')}</Button>
          </div>
        </div>
      </section>

      {/* §1.7 From the journal */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <SectionTitle>{t('journalSection')}</SectionTitle>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {recentEntries.map((entry) => (
              <article key={entry.slug}>
                <Eyebrow>
                  {entry.theme} · {formatDate(entry.date)}
                </Eyebrow>
                <h3 className="mt-2 font-display text-xl italic leading-snug">
                  <Link
                    href={`/journal/${entry.slug}`}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    {entry.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{entry.excerpt}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/journal">{t('journalCta')}</Button>
          </div>
        </div>
      </section>

      {/* §1.8 Contact CTA */}
      <section className="py-20">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)] text-center">
          <h2 className="font-display text-3xl italic">{t('contactCta.heading')}</h2>
          <p className="mt-5 text-[var(--ink-soft)]">{t('contactCta.body')}</p>
          <div className="mt-8">
            <Button href="/contact">{t('contactCta.cta')}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
