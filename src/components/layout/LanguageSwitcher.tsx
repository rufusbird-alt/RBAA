'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-1.5 text-xs small-caps"
      aria-label="Language"
    >
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="text-[var(--rule)] select-none" aria-hidden>·</span>
          )}
          {code === locale ? (
            <span className="text-[var(--ink)]" aria-current="true">
              {label}
            </span>
          ) : (
            <button
              onClick={() => router.replace(pathname, { locale: code })}
              className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
              lang={code}
            >
              {label}
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
