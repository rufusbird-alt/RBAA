'use client';

import { useState } from 'react';

// The newsletter is run on Buttondown (buttondown.com/rbaa). The form posts to
// our own /api/subscribe, which adds the address through Buttondown's API;
// Buttondown then sends its confirmation email.

interface SubscribeText {
  label: string;
  sent: string;
  invalid: string;
  failed: string;
  button: string;
  placeholder: string;
}

const ENGLISH: SubscribeText = {
  label: 'Subscribe to the monthly newsletter. Unsubscribe at any time.',
  sent: 'Thank you. Please check your inbox to confirm your subscription.',
  invalid: 'Please enter a valid email address.',
  failed: 'Sorry, something went wrong. Please try again later.',
  button: 'Subscribe',
  placeholder: 'Your email address',
};

type State = 'idle' | 'sending' | 'sent' | 'invalid' | 'failed';

export function SubscribeForm({ text = ENGLISH }: { text?: SubscribeText }) {
  const [state, setState] = useState<State>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const trap = form.elements.namedItem('website') as HTMLInputElement;
    if (!email.checkValidity()) {
      setState('invalid');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          website: trap.value, // honeypot: real visitors never see or fill this field
          referrer: window.location.href,
        }),
      });
      if (res.ok) {
        setState('sent');
        form.reset();
      } else {
        setState(res.status === 422 ? 'invalid' : 'failed');
      }
    } catch {
      setState('failed');
    }
  }

  const message =
    state === 'sent'
      ? text.sent
      : state === 'invalid'
        ? text.invalid
        : state === 'failed'
          ? text.failed
          : null;

  return (
    <form className="rbaa-subscribe" onSubmit={handleSubmit} noValidate>
      <label htmlFor="subscribe-email">{text.label}</label>
      <div className="rbaa-row">
        <input
          id="subscribe-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={text.placeholder}
          onChange={() => (state === 'invalid' || state === 'failed') && setState('idle')}
        />
        <button type="submit" disabled={state === 'sending'}>
          {text.button}
        </button>
      </div>
      <div className="rbaa-hp" aria-hidden="true">
        <label htmlFor="subscribe-website">Leave this field empty</label>
        <input id="subscribe-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p
        className={`rbaa-note${state === 'invalid' || state === 'failed' ? ' rbaa-error' : ''}`}
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
