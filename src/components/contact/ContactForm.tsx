'use client';

import { useState, useRef } from 'react';

const ENQUIRY_TYPES = [
  { value: 'acquisition', label: 'Acquisition' },
  { value: 'sale', label: 'Sale' },
  { value: 'valuation', label: 'Valuation' },
  { value: 'estate', label: 'Estate or Trust matter' },
  { value: 'general', label: 'General' },
] as const;

const fieldClass =
  'w-full bg-transparent border-b border-[var(--rule)] py-2 text-[var(--ink)] placeholder:text-[var(--rule)] focus:border-[var(--ink)] focus:outline-none transition-colors';
const labelClass = 'block text-xs small-caps text-[var(--muted)] mb-1.5';

type Status = 'idle' | 'sending' | 'ok' | 'error' | 'validation';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const data = new FormData(e.currentTarget);
    const body = Object.fromEntries(data);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.error === 'validation') {
        setStatus('validation');
      } else if (json.ok) {
        setStatus('ok');
        formRef.current?.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div role="status">
        <p className="font-display text-2xl italic text-[var(--ink)]">
          Thank you. Your message has been received.
        </p>
        <p className="mt-3 text-[var(--ink-muted)]">I will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Honeypot — hidden from real users, filled by bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="enquiryType" className={labelClass}>Nature of enquiry</label>
        <select
          id="enquiryType"
          name="enquiryType"
          required
          className={`${fieldClass} cursor-pointer`}
          defaultValue=""
        >
          <option value="" disabled>Select…</option>
          {ENQUIRY_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={3000}
          rows={6}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === 'validation' && (
        <p role="alert" aria-live="polite" className="text-sm text-[var(--accent)]">
          Please check the form — all fields are required and your message must be at least 20 characters.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" aria-live="polite" className="text-sm text-[var(--accent)]">
          Something went wrong. Please write directly to{' '}
          <a href="mailto:rufus@rufusbirdartadvisory.com" className="underline">
            rufus@rufusbirdartadvisory.com
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="text-sm small-caps tracking-wider text-[var(--accent)] border-b border-[var(--accent)] pb-0.5 hover:text-[var(--accent-soft)] hover:border-[var(--accent-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Send enquiry →'}
      </button>
    </form>
  );
}
