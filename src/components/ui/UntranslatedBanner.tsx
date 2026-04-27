import { getTranslations } from 'next-intl/server';

interface UntranslatedBannerProps {
  locale: string;
}

export async function UntranslatedBanner({ locale }: UntranslatedBannerProps) {
  if (locale === 'en') return null;

  const t = await getTranslations('common');

  return (
    <div
      role="note"
      className="border-b border-[var(--rule)] bg-[var(--ground-soft)] px-[var(--gutter)] py-3"
    >
      <p className="max-w-[var(--max)] mx-auto text-sm italic text-[var(--ink-muted)]">
        {t('untranslated')}
      </p>
    </div>
  );
}
