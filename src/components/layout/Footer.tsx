import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';

const siteLinks = [
  { navKey: 'approach', href: '/approach' },
  { navKey: 'services', href: '/services' },
  { navKey: 'caseStudies', href: '/case-studies' },
  { navKey: 'journal', href: '/journal' },
  { navKey: 'about', href: '/about' },
  { navKey: 'contact', href: '/contact' },
] as const;

const legalLinks = [
  { footerKey: 'privacy', href: '/privacy' },
  { footerKey: 'terms', href: '/terms-of-engagement' },
  { footerKey: 'aml', href: '/anti-money-laundering-policy' },
] as const;

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rufus-bird-lvo-fsa-94499332/' },
  { label: 'Instagram', href: 'https://www.instagram.com/birdrufus/' },
  { label: 'Substack', href: 'https://rufusbird.substack.com/' },
] as const;

export async function Footer() {
  const tFooter = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  return (
    <footer className="border-t border-[var(--rule)] mt-24">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)] py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              {tFooter('colophon')}
            </p>
            <ul className="mt-6 space-y-2">
              {socialLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs small-caps text-[var(--muted)] mb-4">{tFooter('theSite')}</h3>
            <ul className="space-y-2">
              {siteLinks.map(({ navKey, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    {tNav(navKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs small-caps text-[var(--muted)] mb-4">
              {tFooter('languages')}
            </h3>
            <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
              <li>{tFooter('languageNames.en')}</li>
              <li>{tFooter('languageNames.de')}</li>
              <li>{tFooter('languageNames.fr')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs small-caps text-[var(--muted)] mb-4">
              {tFooter('discretion')}
            </h3>
            <ul className="space-y-2">
              {legalLinks.map(({ footerKey, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    {tFooter(footerKey)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact#pgp"
                  className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                >
                  {tFooter('pgp')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--rule-soft)]">
          <p className="text-xs small-caps text-[var(--muted)]">{tFooter('baseline')}</p>
        </div>
      </div>
    </footer>
  );
}
