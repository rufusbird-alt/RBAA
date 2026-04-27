import type { Metadata } from 'next';
import { Cormorant_Garamond, EB_Garamond } from 'next/font/google';
import { getLocale } from 'next-intl/server';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${ebGaramond.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
