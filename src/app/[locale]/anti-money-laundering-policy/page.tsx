import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Anti-Money Laundering Policy',
    description:
      'Rufus Bird Art Advisory Ltd. AML policy — customer due diligence, verification requirements, and compliance under the UK Money Laundering Regulations.',
    path: '/anti-money-laundering-policy',
    locale,
  });
}

export default function AMLPage() {
  return (
    <section className="py-16">
      <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
        <p className="text-xs small-caps text-[var(--muted)] mb-4">Legal</p>
        <h1 className="font-display text-4xl italic leading-tight mb-2">
          Anti-Money Laundering Policy
        </h1>
        <p className="text-sm text-[var(--ink-muted)] mb-10">
          UK AML Registration XHML00000198329
        </p>

        <div className="space-y-10 text-[var(--ink-soft)]">

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">
              Fighting money laundering and terrorist financing
            </h2>
            <p>
              Rufus Bird Art Advisory Ltd. (UK AML Registration XHML00000198329) is committed to
              preventing money laundering, terrorist financing, and proliferation financing in
              accordance with the Money Laundering, Terrorist Financing and Transfer of Funds
              (Information on the Payer) Regulations 2017, as amended (the &ldquo;UK Money
              Laundering Regulations&rdquo;). Rufus Bird Art Advisory Ltd. is registered with HM Revenue
              &amp; Customs as an Art Market Participant (AMP) and is supervised by HMRC for AML
              purposes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">
              Customer due diligence and Know Your Client
            </h2>
            <p>
              As a regulated Art Market Participant, Rufus Bird Art Advisory Ltd. is required to conduct
              Customer Due Diligence (CDD) checks on all clients, both existing and new, regardless
              of their location. This includes verifying the identity of both the client and any
              beneficial owners if the client is a company, trust, or other legal entity.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">
              Verification requirements
            </h2>
            <h3 className="text-xs small-caps text-[var(--muted)] mt-4 mb-2">Individual clients</h3>
            <p>
              Clients purchasing artwork exceeding £10,000 (or equivalent, whether as a single
              transaction or a series of linked transactions) must provide valid proof of identity,
              such as a passport, driving licence, or national ID card, together with proof of
              address.
            </p>
            <h3 className="text-xs small-caps text-[var(--muted)] mt-4 mb-2">Company clients</h3>
            <p>
              For companies purchasing artwork, we require documents verifying incorporation,
              details of directors, and identification of any Ultimate Beneficial Owner(s) holding
              more than 25% interest in the entity.
            </p>
            <h3 className="text-xs small-caps text-[var(--muted)] mt-4 mb-2">
              Source of funds and wealth
            </h3>
            <p>
              Where a transaction, client, or jurisdiction presents an elevated risk, Enhanced Due
              Diligence (EDD) will be applied, including verification of source of funds and, where
              relevant, source of wealth from independently verifiable sources.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">
              Sanctions screening and proliferation financing
            </h2>
            <p>
              Rufus Bird Art Advisory Ltd., as an Art Market Participant, is a &ldquo;relevant
              firm&rdquo; under the UK sanctions regime and is subject to a mandatory duty to report
              actual or attempted breaches of UK sanctions law to the Office of Financial Sanctions
              Implementation (OFSI). This obligation is separate from, and in addition to, our
              Customer Due Diligence duties under the Money Laundering Regulations.
            </p>
            <p>
              In line with HMRC guidance, we assess and mitigate the risk of proliferation
              financing (PF) alongside money laundering (ML) and terrorist financing (TF) risk,
              with particular attention to high-risk jurisdictions and politically exposed persons
              connected to them.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Payments</h2>
            <p>
              Payments must be made from a bank account held in the name of the person or entity
              listed on the invoice. For third-party payments, confirmation of the source of funds
              will be required to comply with the UK Money Laundering Regulations.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Data protection</h2>
            <p>
              All personal data collected during the CDD process will be held securely and
              processed in accordance with applicable data protection legislation. Please refer to
              our{' '}
              <a
                href="/privacy"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
              >
                Privacy Policy
              </a>{' '}
              for further details.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">AML guidelines</h2>
            <p>
              For additional information, please refer to the AML Guidance for UK Art Market
              Participants published by the British Art Market Federation (BAMF), last updated 6
              February 2023 and approved by HM Treasury. Note that this guidance is under review by
              HM Treasury and HMRC, and may be superseded by new HMRC statutory guidance for the art
              market in due course — this section should be revisited when that guidance is
              confirmed.
            </p>
          </div>

          <p className="text-sm italic text-[var(--ink-muted)] pt-4 border-t border-[var(--rule)]">
            This statement reflects the UK Money Laundering Regulations as amended by the Money
            Laundering and Terrorist Financing (Amendment) Regulations 2026, in force from 30 June
            2026, which set the Customer Due Diligence threshold at £10,000 (previously
            €10,000).
          </p>

          <p className="text-sm text-[var(--ink-muted)]">
            Rufus Bird Art Advisory Ltd. · UK AML Registration XHML00000198329
          </p>

        </div>
      </div>
    </section>
  );
}
