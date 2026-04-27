import type { ComponentPropsWithoutRef } from 'react';
import { Pullquote } from '@/components/ui/Pullquote';

function H2({ children }: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2 className="font-display text-2xl italic mt-10 mb-3 text-[var(--ink)]">
      {children}
    </h2>
  );
}

function H3({ children }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3 className="font-display text-xl italic mt-8 mb-2 text-[var(--ink)]">
      {children}
    </h3>
  );
}

function SmallCaps({ children }: { children: React.ReactNode }) {
  return <span className="small-caps">{children}</span>;
}

function Footnote({ number }: { number: number; children?: React.ReactNode }) {
  return (
    <sup className="text-xs text-[var(--accent)] ml-0.5">
      <a href={`#fn-${number}`} id={`fnref-${number}`}>
        {number}
      </a>
    </sup>
  );
}

function Plate({
  src,
  alt,
  caption,
  number,
}: {
  src: string;
  alt: string;
  caption?: string;
  number?: number;
}) {
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full" />
      {(caption || number !== undefined) && (
        <figcaption className="mt-2 text-sm text-[var(--muted)] small-caps">
          {number !== undefined && `Plate ${number}. `}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  blockquote: Pullquote,
  SmallCaps,
  Footnote,
  Plate,
};
