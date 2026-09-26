import { NextResponse } from 'next/server';
import { contactSchema, safeFieldErrors } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/**
 * POST /api/contact
 * - JSON only, 10 KB cap (also enforced in middleware)
 * - Zod schema validation (authoritative)
 * - Honeypot: bots get a fake success (don't reveal detection)
 * - Rate limit: 5 submissions / IP / hour
 * - Delivery: Resend if configured, else logged for manual review
 * - Never logs message content or emails in plaintext to stdout in prod shape
 */

function reqId(headers: Headers): string {
  return headers.get('x-request-id') ?? `r_${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  const headers = new Headers(req.headers);
  const id = reqId(headers);
  const ip = clientIp(headers);

  const ctype = req.headers.get('content-type') ?? '';
  if (!ctype.includes('application/json')) {
    return NextResponse.json(
      { ok: false, error: 'Content-Type must be application/json.' },
      { status: 415, headers: { 'x-request-id': id } }
    );
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > 10 * 1024) {
      return NextResponse.json(
        { ok: false, error: 'Payload too large. Maximum 10 KB.' },
        { status: 413, headers: { 'x-request-id': id } }
      );
    }
    raw = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400, headers: { 'x-request-id': id } }
    );
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    // Honeypot trip → fake success (do not reveal the trap).
    if (parsed.error.issues.some((i) => String(i.path[0]) === 'website')) {
      console.warn(JSON.stringify({ evt: 'contact.honeypot', id, ip: ip.slice(0, 16) }));
      return NextResponse.json({ ok: true }, { headers: { 'x-request-id': id } });
    }
    return NextResponse.json(
      { ok: false, error: 'Please fix the highlighted fields.', errors: safeFieldErrors(parsed.error) },
      { status: 422, headers: { 'x-request-id': id } }
    );
  }

  const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    const retryAfterSec = Math.ceil(rl.resetAfterMs / 1000);
    console.warn(JSON.stringify({ evt: 'contact.rate_limited', id, ip: ip.slice(0, 16) }));
    return NextResponse.json(
      { ok: false, error: 'Too many messages. Please wait and try again.', retryAfterSec },
      { status: 429, headers: { 'x-request-id': id, 'Retry-After': String(retryAfterSec) } }
    );
  }

  const { name, email, subject, message } = parsed.data;

  // Metadata-only audit log (never log message body or full email to stdout).
  console.info(
    JSON.stringify({
      evt: 'contact.received',
      id,
      nameLen: name.length,
      subjectLen: subject.length,
      msgLen: message.length,
      emailDomain: email.split('@')[1] ?? '?',
    })
  );

  // Optional delivery via Resend (server-side secret, never exposed).
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (apiKey && to) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Portfolio contact <onboarding@resend.dev>',
          to: [to],
          reply_to: email,
          subject: `[Portfolio] ${subject}`.slice(0, 140),
          text: `From: ${name} <${email}>\nRequest: ${id}\n\n${message}`.slice(0, 5000),
        }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        console.error(JSON.stringify({ evt: 'contact.delivery_failed', id, status: res.status }));
        // Still return success shape? No — be honest but generic.
        return NextResponse.json(
          { ok: false, error: 'Delivery failed. Please try again later.' },
          { status: 502, headers: { 'x-request-id': id } }
        );
      }
    } catch {
      console.error(JSON.stringify({ evt: 'contact.delivery_error', id }));
      return NextResponse.json(
        { ok: false, error: 'Delivery failed. Please try again later.' },
        { status: 502, headers: { 'x-request-id': id } }
      );
    }
  } else {
    // No delivery backend configured — the submission validated + passed
    // anti-abuse. Owner wires RESEND_API_KEY later; see DEPLOYMENT.md.
    console.info(JSON.stringify({ evt: 'contact.queued_no_backend', id }));
  }

  return NextResponse.json({ ok: true }, { headers: { 'x-request-id': id } });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
