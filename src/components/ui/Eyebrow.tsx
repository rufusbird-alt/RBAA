interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p className={`text-xs small-caps text-[var(--muted)] tracking-widest ${className}`}>
      {children}
    </p>
  );
}
