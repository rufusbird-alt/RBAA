import type { Metadata } from 'next';
import Script from 'next/script';
import { Cormorant_Garamond, EB_Garamond } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { JsonLd } from '@/components/ui/JsonLd';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s — Rufus Bird Art Advisory',
    default:
      'Rufus Bird Art Advisory — Independent counsel for collectors, family offices and institutions',
  },
  description:
    'Rufus Bird is an independent art advisor counselling private collectors, family offices, museums and corporations on the acquisition, stewardship, valuation and sale of European works of art and pictures, 1500–1950.',
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://rufusbirdartadvisory.com/#organization',
  name: 'Rufus Bird Art Advisory',
  url: 'https://rufusbirdartadvisory.com',
  founder: { '@type': 'Person', '@id': 'https://rufusbirdartadvisory.com/#rufus-bird' },
  areaServed: ['United Kingdom', 'Europe', 'Middle East', 'United States', 'Asia'],
  serviceType: [
    'Art advisory',
    'Art valuation',
    'Art acquisition',
    'Collection management',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Shaftesbury',
    addressRegion: 'Dorset',
    postalCode: 'SP7',
    addressCountry: 'GB',
  },
  email: 'rufus@rufusbirdartadvisory.com',
  telephone: '+441747000000',
  knowsLanguage: ['en', 'de', 'fr', 'es', 'it'],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${cormorant.variable} ${ebGaramond.variable}`}
    >
      <body>
        <JsonLd data={orgJsonLd} />
        {children}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
