import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllServices } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: 'Services',
    description:
      'Every relationship is shaped by its starting point. Four service archetypes for private collectors, family offices, interior designers, and estate trustees.',
    path: '/services',
    locale,
  });
}

export default function ServicesPage() {
  const services = getAllServices();

  return (
    <>
      <section className="py-16 border-b border-[var(--rule)]">
        <div className="max-w-[var(--measure)] mx-auto px-[var(--gutter)]">
          <p className="text-xs small-caps text-[var(--muted)] mb-4">Services</p>
          <h1 className="font-display text-4xl md:text-5xl italic leading-tight">
            Who I work with
          </h1>
          <p className="mt-6 text-xl text-[var(--ink-soft)]">
            Every relationship is shaped by its starting point. These four describe the most common.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          <div className="grid gap-0 border border-[var(--rule)] sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="block p-10 border-b border-[var(--rule)] sm:odd:border-r hover:bg-[var(--ground-soft)] transition-colors group"
              >
                <p className="text-xs small-caps text-[var(--muted)] mb-3">{service.tagline}</p>
                <h2 className="font-display text-2xl italic group-hover:text-[var(--accent)] transition-colors">
                  {service.archetype}
                </h2>
                <p className="mt-3 text-sm text-[var(--ink-muted)] leading-relaxed">
                  {service.metaDescription}
                </p>
                <p className="mt-4 text-sm small-caps text-[var(--accent)]">Read more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
