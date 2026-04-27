import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 301 redirect table populated in Phase 5 after old-URL audit
    ];
  },
};

export default withNextIntl(nextConfig);
