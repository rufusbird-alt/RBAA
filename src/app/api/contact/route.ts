import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  enquiryType: z.enum(['acquisition', 'sale', 'valuation', 'estate', 'general']),
  message: z.string().min(20).max(3000),
  website: z.string().max(0), // honeypot
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }

  // Silently accept honeypot submissions
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  if (!process.env.RESEND_API_KEY) {
    console.log('[contact]', parsed.data);
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Enquiry <forms@rufusbirdartadvisory.com>',
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: parsed.data.email,
      subject: `New enquiry: ${parsed.data.enquiryType} — ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\nType: ${parsed.data.enquiryType}\n\n${parsed.data.message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'send' }, { status: 500 });
  }
}
