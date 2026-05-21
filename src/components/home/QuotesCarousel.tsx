'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const QUOTES = [
  {
    text: "Art washes away from the soul the dust of everyday life.",
    attribution: "Pablo Picasso",
    descriptor: "We find works that transform the spaces you live in.",
  },
  {
    text: "Creativity takes courage.",
    attribution: "Henri Matisse",
    descriptor: "We help you collect boldly, with conviction, clarity and confidence.",
  },
  {
    text: "Art is not what you see, but what you make others see.",
    attribution: "Edgar Degas",
    descriptor: "We source works that speak quietly, powerfully and unmistakably.",
  },
  {
    text: "The true collector is not one who owns, but one who understands.",
    attribution: "Douglas Cooper",
    descriptor: "We help you cultivate knowledge as carefully as we build your collections.",
  },
  {
    text: "Where there is ruin, there is hope for a treasure.",
    attribution: "Rumi",
    descriptor: "We see value where history, rarity and restoration converge.",
  },
  {
    text: "A picture lives by companionship, expanding and quickening in the eyes of the sensitive observer.",
    attribution: "Mark Rothko",
    descriptor: "We guide you towards works that deepen over time — visually, intellectually, emotionally.",
  },
  {
    text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
    attribution: "Marcel Proust",
    descriptor: "We evaluate your collections, seeing your art with informed eyes.",
  },
  {
    text: "Nothing makes a thing more precious than its scarcity.",
    attribution: "Thomas Fuller",
    descriptor: "We pursue rarity with understanding, discretion and access.",
  },
  {
    text: "A thing of beauty is a joy for ever.",
    attribution: "John Keats",
    descriptor: "We build collections intended to be enjoyed across generations.",
  },
  {
    text: "Possession is nothing without appreciation.",
    attribution: "John Ruskin",
    descriptor: "We believe that stewardship is enhanced by the histories we share.",
  },
  {
    text: "We shape our buildings: thereafter they shape us.",
    attribution: "Winston Churchill",
    descriptor: "We source art that defines the design and character of your spaces.",
  },
  {
    text: "The finest pleasure is the joy of understanding.",
    attribution: "Leonardo da Vinci",
    descriptor: "We offer insight, bringing confidence to every acquisition.",
  },
] as const;

const DWELL = 3000;
const FADE_MS = 500;

export function QuotesCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % QUOTES.length),
    [],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + QUOTES.length) % QUOTES.length),
    [],
  );

  useEffect(() => {
    if (paused || reducedMotion) return;
    intervalRef.current = setInterval(next, DWELL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, reducedMotion, next]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p); }
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Collected reflections on art"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="relative h-[560px] md:h-[480px] border-b border-[var(--rule)] overflow-hidden focus-visible:outline-none"
    >
      {QUOTES.map((quote, i) => (
        <div
          key={i}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${QUOTES.length}: ${quote.attribution}`}
          aria-hidden={i !== current}
          style={{
            opacity: i === current ? 1 : 0,
            transition: reducedMotion ? 'none' : `opacity ${FADE_MS}ms ease-in-out`,
            pointerEvents: i === current ? 'auto' : 'none',
          }}
          className="absolute inset-0 flex flex-col items-center justify-center px-[var(--gutter)] pb-14"
        >
          <div className="max-w-[var(--measure)] text-center">
            <blockquote className="font-display text-3xl md:text-5xl italic leading-tight text-[var(--ink)]">
              <p>&ldquo;{quote.text}&rdquo;</p>
              <footer className="mt-5 not-italic small-caps text-base text-[var(--ink-soft)]">
                {quote.attribution}
              </footer>
            </blockquote>
            <p className="mt-4 text-lg text-[var(--ink-muted)]">{quote.descriptor}</p>
          </div>
        </div>
      ))}

      {/* Pager */}
      <div
        className="absolute bottom-5 left-0 right-0 flex justify-center gap-3"
        role="group"
        aria-label="Slide navigation"
      >
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
            className="px-1.5 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
          >
            <span
              style={{
                background: i === current ? 'var(--ink)' : 'var(--rule)',
                transition: reducedMotion ? 'none' : 'background-color 300ms',
              }}
              className="block w-px h-5"
            />
          </button>
        ))}
      </div>

      {paused && !reducedMotion && (
        <p className="sr-only" aria-live="polite">Carousel paused</p>
      )}
    </section>
  );
}
