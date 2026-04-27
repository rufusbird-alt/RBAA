interface SectionTitleProps {
  children: React.ReactNode;
  as?: 'h2' | 'h3';
  className?: string;
}

export function SectionTitle({ children, as: Tag = 'h2', className = '' }: SectionTitleProps) {
  return (
    <Tag className={`font-display text-2xl italic text-[var(--ink)] ${className}`}>
      {children}
    </Tag>
  );
}
