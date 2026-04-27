import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Privacy note',
    description: 'How Rufus Bird Art Advisory handles your data.',
    path: '/privacy',
    locale,
  });
}

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
        <h1 className="font-display text-3xl italic mb-10">Privacy note</h1>
        <div className="space-y-5 text-[var(--ink-soft)]">
          <p>
            This site collects no data beyond what is submitted through the contact form. Contact
            form submissions — name, email address, and message — are used solely to respond to your
            enquiry and are not shared with any third party for marketing purposes.
          </p>
          <p>
            Correspondence is handled by Resend for transactional email delivery. Anonymised
            analytics are provided by Plausible, which sets no cookies and collects no personally
            identifiable information. No other tracking scripts are present on this site.
          </p>
          <p>
            Contact form submissions are retained for as long as the correspondence remains
            relevant. You may request deletion at any time by writing to{' '}
            <a
              href="mailto:rufus@rufusbirdartadvisory.com"
              className="text-[var(--accent)] hover:text-[var(--accent-soft)]"
            >
              rufus@rufusbirdartadvisory.com
            </a>
            .
          </p>
          <p>
            This site stores no cookies for advertising, analytics, or personalisation. No cookie
            consent banner is therefore required or displayed.
          </p>
          <p className="text-sm text-[var(--ink-muted)]">Last updated: April 2026.</p>
        </div>
      </div>
    </section>
  );
}
