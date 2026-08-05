import Image from 'next/image';

interface PortraitFrameProps {
  src: string;
  alt: string;
  className?: string;
}

export function PortraitFrame({ src, alt, className }: PortraitFrameProps) {
  return (
    <figure
      className={`relative w-48 h-64 md:w-56 md:h-[18rem] shrink-0 overflow-hidden${className ? ` ${className}` : ''}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top grayscale"
        sizes="(max-width: 768px) 192px, 224px"
        priority
      />
    </figure>
  );
}
