import Link from 'next/link';

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const base =
  'inline-block text-sm small-caps tracking-wider text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:text-[var(--accent-soft)] hover:border-[var(--accent-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({
  href,
  children,
  type = 'button',
  disabled,
  onClick,
  className = '',
}: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${className}`}
    >
      {children}
    </button>
  );
}
