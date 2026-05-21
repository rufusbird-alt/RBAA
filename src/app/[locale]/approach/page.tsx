import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'The Approach',
    description:
      'Collecting is not a transaction. An independent counsellor to collectors, family offices and institutions explains how a genuine advisory relationship works.',
    path: '/approach',
    locale,
  });
}

const differentiators = [
  { heading: 'A relational asset,', sub: 'not a service provider.' },
  { heading: 'Embedded counsel,', sub: 'not episodic advisor.' },
  { heading: 'Interpreter of subjective value,', sub: 'not just market value.' },
  { heading: 'Architect of ambition,', sub: 'not a facilitator of purchases.' },
];

export default function ApproachPage() {
  return (
    <>
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">The Approach</p>
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">
            Collecting is not a transaction. Transactions are rational. Collecting is emotional.
          </h1>
        </div>
      </section>

      {/* The manifesto */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)] space-y-5">
          <p>
            Collecting is not a transaction. Transactions are rational. Collecting is emotional.
          </p>
          <p>
            Art is one of the few assets whose value is inseparable from personal meaning. Two
            collectors can look at the same work and see entirely different worth. What compels one
            person leaves another indifferent. Price follows taste as much as the other way around.
          </p>
          <p>
            This makes collecting fundamentally different from other forms of acquisition. It is
            shaped by identity, ambition, reputation, emotion, and legacy — not simply market
            mechanics.
          </p>
          <p>
            Access to art can be learned. Markets can be navigated.{' '}
            <em>What cannot be systematised is judgement.</em>
          </p>
          <p>
            True collecting requires someone who can sit inside the client's world — understanding
            not only what is available, but what is right for them. Someone who can challenge
            impulse, sharpen instinct, and translate unspoken ambition into coherent direction over
            time.
          </p>
          <p>
            Without counsel, collections become accidental.{' '}
            <em>With counsel, they become intentional.</em>
          </p>
          <p>
            The role of a genuine advisor is not to facilitate transactions, but to help a collector
            think clearly about what they are building, why it matters, and how it should evolve.
            The outcome is not simply ownership of objects, but the construction of meaning,
            coherence, and personal legacy.
          </p>
          <p className="italic">
            This is the difference between buying art and building a collection.
          </p>
        </div>
      </section>

      {/* Four differentiators */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <div className="grid gap-px bg-[var(--rule)] border border-[var(--rule)] sm:grid-cols-2">
            {differentiators.map(({ heading, sub }) => (
              <div key={heading} className="bg-[var(--ground)] p-8">
                <p className="font-display text-xl italic">{heading}</p>
                <p className="mt-1 text-[var(--ink-muted)]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How a relationship begins */}
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <h2 className="font-display text-2xl italic mb-8">How a relationship begins</h2>
          <div className="space-y-5">
            <p>
              Every engagement begins with a conversation. You might be pursuing a specific work,
              reconsidering what you already own, facing an inheritance or a dispersal, or simply
              wondering whether what you have makes sense together. The conversation is without fee
              and without obligation, in English, German, or French.
            </p>
            <p>
              From there, most relationships settle into one of three rhythms: a defined project (an
              acquisition, a sale, a collection audit, a valuation), an open retainer (regular
              counsel, a set number of hours per month, on-call where it matters), or a hybrid that
              begins as a project and continues as a partnership. The Venetian palazzo began that
              way.
            </p>
            <p>
              A written fee note precedes every engagement. No secret commissions, ever. Discretion
              is presumed and absolute: client identities, prices, and provenance are treated as
              privileged. PGP-encrypted correspondence is available on request.
            </p>
          </div>
          <div className="mt-10">
            <Button href="/contact">Begin a conversation →</Button>
          </div>
        </div>
      </section>
    </>
  );
}
