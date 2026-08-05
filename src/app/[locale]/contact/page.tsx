import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { ContactForm } from '@/components/contact/ContactForm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Contact',
    description:
      'Begin a conversation with Rufus Bird. First conversations are without fee or obligation. Correspondence in English, German, French, Spanish and Italian.',
    path: '/contact',
    locale,
  });
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  const details = [
    {
      key: 'emailLabel',
      value: 'rufus@rufusbirdartadvisory.com',
      href: 'mailto:rufus@rufusbirdartadvisory.com',
    },
    { key: 'phoneLabel', value: 'WhatsApp / Telephone: +44 (0)7815 588181', href: 'https://wa.me/447815588181' },
    {
      key: 'postLabel',
      value: 'Rufus Bird Art Advisory Ltd., Buddens Farm, Shaftesbury, Dorset SP7 0JE',
    },
    { key: 'hoursLabel', value: t('hours') },
    { key: 'languagesLabel', value: t('languages') },
  ] as const;

  return (
    <>
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">{t('headline')}</h1>
          <p className="mt-6 text-[var(--ink-soft)]">{t('sub')}</p>
        </div>
      </section>

      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <dl className="space-y-0 border-t border-[var(--rule)]">
            {details.map(({ key, value, href }: { key: string; value: string; href?: string }) => (
              <div key={key} className="flex gap-8 py-5 border-b border-[var(--rule)]">
                <dt className="small-caps text-xs text-[var(--muted)] w-32 shrink-0 pt-0.5">
                  {t(key as Parameters<typeof t>[0])}
                </dt>
                <dd className="text-[var(--ink-soft)]">
                  {href ? (
                    <a href={href} className="hover:text-[var(--ink)] transition-colors">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
            <div id="pgp" className="flex gap-8 py-5 border-b border-[var(--rule)]">
              <dt className="small-caps text-xs text-[var(--muted)] w-32 shrink-0 pt-0.5">
                {t('pgpLabel')}
              </dt>
              <dd className="text-sm font-mono text-[var(--ink-soft)]">{t('pgpNote')}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
