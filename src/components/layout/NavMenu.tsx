'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Link } from '@/navigation';

type NavLink = {
  key: string;
  href: string;
  label: string;
};

export function NavMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-[5px]"
      >
        <span
          className={`block h-px w-6 bg-[var(--ink)] transition-transform duration-200 ${
            open ? 'translate-y-[6px] rotate-45' : ''
          }`}
        />
        <span
          className={`block h-px w-6 bg-[var(--ink)] transition-opacity duration-200 ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-px w-6 bg-[var(--ink)] transition-transform duration-200 ${
            open ? '-translate-y-[6px] -rotate-45' : ''
          }`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          ref={panelRef}
          role="menu"
          aria-label="Primary"
          className="absolute right-0 top-full z-50 mt-4 w-56 border border-[var(--rule)] bg-[var(--ground)] py-2 shadow-lg"
        >
          <ul>
            {links.map(({ key, href, label }) => (
              <li key={key}>
                <Link
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-5 py-2.5 text-sm small-caps text-[var(--ink-soft)] transition-colors hover:bg-[var(--ground-soft)] hover:text-[var(--ink)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
