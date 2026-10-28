import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { UntranslatedBanner } from '@/components/ui/UntranslatedBanner';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Privacy Policy',
    description: 'How Rufus Bird Art Advisory Ltd collects, uses, and protects your personal data.',
    path: '/privacy',
    locale,
  });
}

export default function PrivacyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <>
      <UntranslatedBanner locale={locale} />

      <section className="py-16">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">Legal</p>
          <h1 className="font-display text-4xl italic leading-tight mb-10">Privacy Policy</h1>

          <div className="space-y-10 text-[var(--ink-soft)]">

            <div className="space-y-3">
              <p>
                Rufus Bird Art Advisory Ltd is the data controller for the personal information we hold
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
              <p>
                If you subscribe to our monthly newsletter, we collect your email address and the date
                you confirmed your subscription.
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
                necessary to deliver our services or meet legal obligations, including shipping
                agents, insurers, tax authorities, legal advisers, and fraud prevention agencies. Any
                such sharing is carried out on a strictly need-to-know basis.
              </p>
              <p>
                We use the following service providers, which process personal data only on our
                instructions: Buttondown, LLC (newsletter delivery), Resend (contact form delivery),
                and Vercel (website hosting). Our analytics provider, Plausible, receives no personal
                data.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl italic text-[var(--ink)]">International transfers</h2>
              <p>
                Some of our service providers are based in the United States, including Buttondown,
                Resend, and Vercel. Transfers to Resend and Vercel are made under the UK-US data
                bridge, under which both are certified. Transfers to Buttondown are made under the UK
                Addendum to the EU Standard Contractual Clauses. Copies of the relevant safeguards are
                available on request.
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
                Personal data is retained for as long as necessary for the purposes described above,
                ordinarily seven years after the end of a client relationship, unless a longer
                period is required by law or for the resolution of disputes.
              </p>
              <p>
                Newsletter subscribers are not clients. Their data is retained as described under
                Newsletter below.
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
              <p>
                Our website is hosted by Vercel, which may record IP addresses and request logs for
                security and operational purposes. These logs are kept for one day.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl italic text-[var(--ink)]">Newsletter</h2>
              <p>
                If you subscribe to our monthly newsletter, we hold your email address and the date
                you confirmed. We use it only to send the newsletter, on the basis of your consent,
                which you give when you subscribe and confirm by email. When you subscribe, we record
                the IP address from which you signed up, as evidence of your consent and to prevent
                abuse.
              </p>
              <p>
                Buttondown, LLC acts as our data processor, storing subscribers&rsquo; details and
                sending the newsletter on our behalf under our instructions. Its{' '}
                <a
                  href="https://buttondown.com/legal/data-processing-agreement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
                >
                  data processing agreement
                </a> and{' '}
                <a
                  href="https://buttondown.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
                >
                  privacy policy
                </a>{' '}
                describe its handling of data in full.
              </p>
              <p>
                You can unsubscribe at any time using the link at the foot of every issue, or by
                writing to us. We then remove your address from the mailing list. Buttondown keeps
                unsubscribed addresses on a suppression list so that we cannot send to you by
                mistake. We keep that record for as long as the list exists, on the basis of our
                legitimate interest in honouring your request. It is the only record we retain after
                you leave.
              </p>
              <p>
                Some subscribers joined through an earlier newsletter platform and confirmed their
                subscription again with us. Their details were transferred to Buttondown only after
                that confirmation.
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
              Last updated: October 2026.
            </p>

          </div>
        </div>
      </section>
    </>
  );
}
