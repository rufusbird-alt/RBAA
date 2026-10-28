import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().trim().email().max(254),
  website: z.string().max(0), // honeypot
  referrer: z.string().url().max(2000).optional(),
});

// The visitor's own IP address, so Buttondown records it rather than the server's
function clientIp(req: NextRequest): string | undefined {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? undefined;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });

  // Silently accept honeypot submissions
  if (typeof body.website === 'string' && body.website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }

  if (!process.env.BUTTONDOWN_API_KEY) {
    console.log('[subscribe] BUTTONDOWN_API_KEY not set; would subscribe', parsed.data.email);
    return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 });
  }

  try {
    // New subscribers are sent Buttondown's confirmation email before they are added
    const res = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: parsed.data.email,
        ip_address: clientIp(req),
        referrer_url: parsed.data.referrer,
      }),
    });

    if (res.ok) return NextResponse.json({ ok: true });

    // An address that is already on the list gets the same reply as a new one,
    // so the form never reveals who is subscribed
    const detail = await res.text();
    if (res.status === 400 && /exist|already|suppress/i.test(detail)) {
      return NextResponse.json({ ok: true });
    }
    console.error('[subscribe] Buttondown', res.status, detail);
    return NextResponse.json({ ok: false, error: 'send' }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: 'send' }, { status: 502 });
  }
}
