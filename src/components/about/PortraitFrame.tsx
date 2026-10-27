import Image from 'next/image';

interface PortraitFrameProps {
  src: string;
  alt: string;
  className?: string;
}

export function PortraitFrame({ src, alt, className }: PortraitFrameProps) {
  return (
    <figure className={`w-full max-w-[28rem]${className ? ` ${className}` : ''}`}>
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top grayscale"
          sizes="(max-width: 768px) 100vw, 448px"
          priority
        />
      </div>
      <PhotoCredit />
    </figure>
  );
}

export function PhotoCredit() {
  return (
    <figcaption className="mt-2 text-xs text-[var(--ink-muted)]">
      Photograph:{' '}
      <a
        href="https://www.felixbirdphotography.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[var(--accent)] transition-colors"
      >
        Felix Bird
      </a>
    </figcaption>
  );
}
