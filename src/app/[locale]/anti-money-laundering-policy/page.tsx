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
      'Rufus Bird Art Advisory AML policy — customer due diligence, verification requirements, and compliance under 5AMLD.',
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
              Rufus Bird Art Advisory operates under the standards established by the Fifth
              Anti-Money Laundering Directive (5AMLD) to prevent money laundering and the financing
              of terrorism. These obligations apply to all transactions and engagements, regardless
              of the client's location.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">
              Customer due diligence and Know Your Client
            </h2>
            <p>
              As a regulated entity, we conduct customer due diligence (CDD) checks on all clients
              — both new and existing. This includes verifying the identity of the client and, where
              the client is a corporate entity, the identity of any beneficial owners.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">
              Verification requirements
            </h2>
            <h3 className="text-xs small-caps text-[var(--muted)] mt-4 mb-2">Individual clients</h3>
            <p>
              For artwork purchases exceeding €10,000, clients are required to provide valid proof
              of identity — such as a passport, driving licence, or national identity card.
            </p>
            <h3 className="text-xs small-caps text-[var(--muted)] mt-4 mb-2">Corporate clients</h3>
            <p>
              Documentation must include confirmation of incorporation, details of directors, and
              identification of ultimate beneficial owners.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Payments</h2>
            <p>
              All payments must be made from a bank account held in the name of the person or
              entity listed on the invoice. Third-party payments require confirmation of the source
              of funds in accordance with 5AMLD requirements.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Data protection</h2>
            <p>
              Personal data collected during the CDD process is held securely and processed in
              accordance with applicable data protection legislation. Further details are set out in
              our{' '}
              <a
                href="/privacy"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl italic text-[var(--ink)]">Guidance</h2>
            <p>
              This policy is informed by the British Art Market Federation (BAMF) guidelines,
              approved by HM Treasury on 24 January 2020.
            </p>
          </div>

          <p className="text-sm text-[var(--ink-muted)] pt-4 border-t border-[var(--rule)]">
            Rufus Bird Art Advisory · UK AML Registration XHML00000198329
          </p>

        </div>
      </div>
    </section>
  );
}
