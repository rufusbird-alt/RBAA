import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { SkipLink } from './SkipLink';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavMenu } from './NavMenu';

export async function Masthead() {
  const t = await getTranslations('nav');

  const navLinks = [
    { key: 'approach' as const, href: '/approach' },
    { key: 'services' as const, href: '/services' },
    { key: 'caseStudies' as const, href: '/case-studies' },
    { key: 'journal' as const, href: '/journal' },
    { key: 'about' as const, href: '/about' },
    { key: 'contact' as const, href: '/contact' },
  ];

  return (
    <header className="border-b border-[var(--rule)] bg-[var(--ground)]">
      <SkipLink />
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)] py-5 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.005em] shrink-0"
          aria-label="Rufus Bird Art Advisory Ltd. — home"
        >
          Rufus <span className="text-[var(--accent)]">Bird</span>
        </Link>

        <div className="flex flex-wrap items-center gap-6">
          <LanguageSwitcher />
          <NavMenu
            links={navLinks.map(({ key, href }) => ({ key, href, label: t(key) }))}
          />
        </div>
      </div>
    </header>
  );
}
