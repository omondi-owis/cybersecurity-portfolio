'use client';

import { useState } from 'react';

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  form?: string;
}

function validate(values: { name: string; email: string; subject: string; message: string }): FieldErrors {
  const e: FieldErrors = {};
  if (values.name.trim().length < 2) e.name = 'Please enter your name (2+ characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = 'Please enter a valid email address.';
  if (values.subject.trim().length < 3) e.subject = 'Subject needs at least 3 characters.';
  if (values.message.trim().length < 10) e.message = 'Message needs at least 10 characters.';
  if (values.message.length > 4000) e.message = 'Message must be under 4000 characters.';
  if ((values.message.match(/https?:\/\//g) ?? []).length >= 3) e.message = 'Please remove extra links and try again.';
  return e;
}

export default function ContactForm({ directEmail }: { directEmail: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'limited'>('idle');
  const [serverMsg, setServerMsg] = useState('');

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const errs = validate({ name, email, subject, message });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');
    setServerMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; errors?: FieldErrors; retryAfterSec?: number };
      if (res.status === 429) {
        setStatus('limited');
        setServerMsg(
          data.retryAfterSec
            ? `Too many messages sent recently. Please wait about ${Math.ceil(data.retryAfterSec / 60)} minute(s) and try again.`
            : 'Too many messages sent recently. Please wait and try again.'
        );
        return;
      }
      if (!res.ok || !data.ok) {
        setStatus('error');
        setErrors(data.errors ?? {});
        setServerMsg(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setStatus('sent');
      setServerMsg('Message received. VYRA will review your enquiry and respond if the requested scope is a fit.');
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      setStatus('error');
      setServerMsg('Network error. Please check your connection and try again.');
    }
  }

  function copyFallback() {
    const text = `To: ${directEmail || '(contact email not yet published)'}\nSubject: ${subject}\n\n${message}\n\n— ${name} (${email})`;
    void navigator.clipboard?.writeText(text).catch(() => undefined);
  }

  if (status === 'sent') {
    return (
      <div className="alert alert-ok" role="status">
        <strong>Message received.</strong>
        <br />
        {serverMsg}
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Contact form">
      {(status === 'error' || status === 'limited') && serverMsg && (
        <div className="alert alert-err" role="alert">{serverMsg}</div>
      )}

      <div className="field">
        <label htmlFor="cf-name">Name <span className="req" aria-hidden="true">*</span></label>
        <input
          id="cf-name" name="name" type="text" autoComplete="name" maxLength={80}
          value={name} onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'cf-name-err' : undefined}
        />
        {errors.name && <p className="err" id="cf-name-err">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor="cf-email">Email <span className="req" aria-hidden="true">*</span></label>
        <input
          id="cf-email" name="email" type="email" autoComplete="email" maxLength={254}
          value={email} onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? 'cf-email-err' : 'cf-email-hint'}
        />
        <p className="hint" id="cf-email-hint">Only used to reply to you. Never shared, never subscribed to anything.</p>
        {errors.email && <p className="err" id="cf-email-err">{errors.email}</p>}
      </div>

      <div className="field">
        <label htmlFor="cf-subject">Subject <span className="req" aria-hidden="true">*</span></label>
        <input
          id="cf-subject" name="subject" type="text" maxLength={120}
          value={subject} onChange={(e) => setSubject(e.target.value)}
          aria-invalid={errors.subject ? 'true' : undefined}
          aria-describedby={errors.subject ? 'cf-subject-err' : undefined}
        />
        {errors.subject && <p className="err" id="cf-subject-err">{errors.subject}</p>}
      </div>

      <div className="field">
        <label htmlFor="cf-message">Message <span className="req" aria-hidden="true">*</span></label>
        <textarea
          id="cf-message" name="message" maxLength={4000}
          value={message} onChange={(e) => setMessage(e.target.value)}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'cf-message-err' : 'cf-message-hint'}
        />
        <p className="hint" id="cf-message-hint">{message.length}/4000 characters. Please do not include passwords or secrets.</p>
        {errors.message && <p className="err" id="cf-message-err">{errors.message}</p>}
      </div>

      {/* Honeypot — hidden from humans, bots fill it */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website (leave blank)</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div>
        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>

      <p className="form-note">
        Protected by validation, rate limiting and spam checks.
        {directEmail ? (
          <> Prefer email? <a href={`mailto:${directEmail}`}>Write directly</a>.</>
        ) : (
          <> If the form fails, <button type="button" onClick={copyFallback} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>copy your message</button> and try again later.</>
        )}
      </p>
    </form>
  );
}
