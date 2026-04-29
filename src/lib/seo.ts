import type { Metadata } from 'next';

interface BuildMetadataArgs {
  title: string;
  description: string;
  path: string;
  locale: string;
  ogImage?: string;
  type?: 'website' | 'article';
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rufusbirdartadvisory.com';

function localePath(locale: string, p: string): string {
  return locale === 'en' ? p : `/${locale}${p}`;
}

export function buildMetadata({
  title,
  description,
  path,
  locale,
  ogImage,
  type = 'website',
}: BuildMetadataArgs): Metadata {
  const url = `${siteUrl}${localePath(locale, path)}`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type,
      locale,
      alternateLocale: (['en', 'de', 'fr'] as const).filter((l) => l !== locale),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
      siteName: 'Rufus Bird Art Advisory',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}${path}`,
        de: `${siteUrl}/de${path}`,
        fr: `${siteUrl}/fr${path}`,
        'x-default': `${siteUrl}${path}`,
      },
    },
    robots: { index: true, follow: true },
  };
}
