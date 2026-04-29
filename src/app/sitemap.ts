import type { MetadataRoute } from 'next';
import { getAllJournalEntries, getAllCaseStudies, getAllServices } from '@/lib/content';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rufusbirdartadvisory.com';

function alternates(path: string) {
  return {
    languages: {
      en: `${siteUrl}${path}`,
      de: `${siteUrl}/de${path}`,
      fr: `${siteUrl}/fr${path}`,
      'x-default': `${siteUrl}${path}`,
    },
  };
}

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/approach', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/case-studies', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/journal', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about/full-biography', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-of-engagement', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, changeFrequency, priority } of staticRoutes) {
    entries.push({
      url: `${siteUrl}${path}`,
      alternates: alternates(path),
      changeFrequency,
      priority,
    });
  }

  for (const entry of getAllJournalEntries()) {
    const path = `/journal/${entry.slug}`;
    entries.push({
      url: `${siteUrl}${path}`,
      lastModified: new Date(entry.date),
      alternates: alternates(path),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  for (const study of getAllCaseStudies()) {
    const path = `/case-studies/${study.slug}`;
    entries.push({
      url: `${siteUrl}${path}`,
      alternates: alternates(path),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const service of getAllServices()) {
    const path = `/services/${service.slug}`;
    entries.push({
      url: `${siteUrl}${path}`,
      alternates: alternates(path),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
