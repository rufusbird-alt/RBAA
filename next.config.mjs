import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 180,
  async redirects() {
    return [
      // Common patterns from old sites — replace with actual audit from §10
      { source: '/about-rufus', destination: '/about', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/our-services', destination: '/services', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/blog', destination: '/journal', permanent: true },
      { source: '/blog/:slug', destination: '/journal/:slug', permanent: true },
      { source: '/news', destination: '/journal', permanent: true },
      { source: '/news/:slug', destination: '/journal/:slug', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
