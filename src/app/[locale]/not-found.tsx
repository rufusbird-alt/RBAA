import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-[var(--gutter)]">
      <div className="max-w-[var(--measure)] text-center space-y-6">
        <p className="font-display text-xl italic text-[var(--ink-muted)]">
          This page cannot be found. It may have been moved, or it may never have
          existed.
        </p>
        <div className="flex flex-wrap gap-6 justify-center">
          <Button href="/">Return to the beginning →</Button>
          <Button href="/contact">Begin a conversation →</Button>
        </div>
      </div>
    </div>
  );
}
