import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Terms of engagement',
    description: 'How engagements with Rufus Bird Art Advisory work: scope, fees, confidentiality.',
    path: '/terms-of-engagement',
    locale,
  });
}

export default function TermsPage() {
  return (
    <section className="py-16">
      <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
        <h1 className="font-display text-3xl italic mb-10">Terms of engagement</h1>
        <div className="space-y-5 text-[var(--ink-soft)]">
          <p>
            Every engagement begins with a written fee note, issued before any work commences. The
            fee note sets out the scope of the engagement, the basis of the fee (hourly, project, or
            retainer), and the estimated total where a project basis is used. No work proceeds until
            the fee note is accepted in writing.
          </p>
          <p>
            Rufus Bird Art Advisory accepts no commissions, rebates, or introductory fees from
            dealers, auction houses, or any third party in connection with any client transaction.
            The fee paid by the client is the only remuneration for advisory work. This
            unconflicted basis is not negotiable.
          </p>
          <p>
            All client information — identities, mandates, prices, and provenance discussions — is
            treated as strictly confidential. Information is not disclosed to third parties except
            where required for the conduct of the engagement (for example, instructing a
            conservator or a specialist appraiser) and then only with the client&rsquo;s knowledge.
            PGP-encrypted communication is available on request.
          </p>
          <p>
            The scope and limits of professional liability are set out in the individual engagement
            letter. In general, the practice accepts liability for the accuracy of its professional
            opinions but not for the performance of the art market or the outcome of auctions or
            private sales.
          </p>
          <p>
            Detailed terms for any specific engagement are contained in the engagement letter for
            that engagement. These general terms provide context only and do not constitute a
            contract.
          </p>
          <p className="text-sm text-[var(--ink-muted)]">Last updated: April 2026.</p>
        </div>
      </div>
    </section>
  );
}
