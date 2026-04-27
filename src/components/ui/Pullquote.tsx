import type { ComponentPropsWithoutRef } from 'react';

export function Pullquote({ children }: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote className="border-l-2 border-[var(--rule)] pl-6 my-8 italic text-xl leading-relaxed text-[var(--ink-soft)]">
      {children}
    </blockquote>
  );
}
