import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Privacy Policy',
    description: 'How Rufus Bird Art Advisory Ltd. collects, uses, and protects your personal data.',
    path: '/privacy',
    locale,
  });
}

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
        <p className="text-xs small-caps text-[var(--muted)] mb-4">Legal</p>
        <h1 className="font-display text-4xl italic leading-tight mb-10">Privacy Policy</h1>

        <div className="space-y-10 text-[var(--ink-soft)]">

          <div className="space-y-3">
            <p>
              Rufus Bird Art Advisory Ltd. is the data controller for the personal information we hold
              about you. Enquiries regarding this policy should be directed to{' '}
              <a
                href="mailto:rufus@rufusbirdartadvisory.com"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
              >
                rufus@rufusbirdartadvisory.com
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Information we collect</h2>
            <p>
              We may collect the following information: name; contact details including home or work
              address, telephone number, and email address; date of birth; employment status and
              professional background; financial information where required for compliance purposes;
              identity documents; and records relating to artworks and transactions.
            </p>
            <p>
              Information is collected when you contact us directly, enter into an engagement, or
              where we are required to collect it under applicable law.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">How we use your information</h2>
            <p>
              Personal information is used to deliver advisory services; to assess and respond to
              your needs and objectives; to comply with legal and regulatory obligations including
              anti-money laundering requirements; to prevent fraud; and, where you have consented,
              to send relevant communications.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Sharing your information</h2>
            <p>
              We do not sell personal data. Information may be shared with third parties where
              necessary to deliver our services or meet legal obligations — including shipping
              agents, insurers, tax authorities, legal advisers, and fraud prevention agencies. Any
              such sharing is carried out on a strictly need-to-know basis.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">International transfers</h2>
            <p>
              Where personal data is transferred outside the United Kingdom or European Economic
              Area, we ensure appropriate contractual protections are in place in accordance with
              applicable data protection legislation.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Your rights</h2>
            <p>
              You have the right to request access to, or a copy of, any personal data we hold
              about you; to have inaccurate data corrected; to request erasure in certain
              circumstances; and to withdraw consent to marketing communications at any time. To
              exercise any of these rights, please write to{' '}
              <a
                href="mailto:rufus@rufusbirdartadvisory.com"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
              >
                rufus@rufusbirdartadvisory.com
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Retention</h2>
            <p>
              Personal data is retained for as long as necessary for the purposes described above —
              ordinarily seven years after the end of a client relationship — unless a longer
              period is required by law or for the resolution of disputes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">This website</h2>
            <p>
              This site collects no advertising or personalisation cookies. Anonymised analytics
              are provided by Plausible, which sets no cookies and collects no personally
              identifiable information. Contact form submissions are handled via Resend and used
              solely to respond to your enquiry.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Complaints</h2>
            <p>
              If you have concerns about how your data is handled, you may contact the Information
              Commissioner's Office at{' '}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
              >
                ico.org.uk
              </a>{' '}
              or by telephone on 0303 123 1113.
            </p>
          </div>

          <p className="text-sm text-[var(--ink-muted)] pt-4 border-t border-[var(--rule)]">
            Last updated: April 2024.
          </p>

        </div>
      </div>
    </section>
  );
}
