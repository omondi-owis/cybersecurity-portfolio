'use client';

import { useRef, useState } from 'react';

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  form?: string;
}

type Values = { name: string; email: string; subject: string; message: string };

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name (2+ characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (values.subject.trim().length < 3) errors.subject = 'Subject needs at least 3 characters.';
  if (values.message.trim().length < 10) errors.message = 'Message needs at least 10 characters.';
  if (values.message.length > 4000) errors.message = 'Message must be under 4000 characters.';
  if ((values.message.match(/https?:\/\//g) ?? []).length >= 3) errors.message = 'Please remove extra links and try again.';
  return errors;
}

function submissionId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ContactForm({ directEmail }: { directEmail: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'limited'>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const pendingSubmission = useRef<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const fieldErrors = validate({ name, email, subject, message });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const requestId = pendingSubmission.current ?? submissionId();
    pendingSubmission.current = requestId;
    setStatus('sending');
    setServerMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestId },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string; errors?: FieldErrors; retryAfterSec?: number };
      if (response.status === 429) {
        setStatus('limited');
        setServerMsg(data.retryAfterSec ? `Too many messages sent recently. Please wait about ${Math.ceil(data.retryAfterSec / 60)} minute(s) and try again.` : 'Too many messages sent recently. Please wait and try again.');
        return;
      }
      if (!response.ok || !data.ok) {
        setStatus('error');
        setErrors(data.errors ?? {});
        setServerMsg(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      pendingSubmission.current = null;
      setStatus('sent');
      setServerMsg('Message received. VYRA will review your enquiry and respond if the requested scope is a fit.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
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
    return <div className="alert alert-ok" role="status"><strong>Message received.</strong><br />{serverMsg}</div>;
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Contact form">
      {(status === 'error' || status === 'limited') && serverMsg && <div className="alert alert-err" role="alert">{serverMsg}</div>}
      <div className="field">
        <label htmlFor="cf-name">Name <span className="req" aria-hidden="true">*</span></label>
        <input id="cf-name" name="name" type="text" autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={errors.name ? 'true' : undefined} aria-describedby={errors.name ? 'cf-name-err' : undefined} />
        {errors.name && <p className="err" id="cf-name-err">{errors.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email <span className="req" aria-hidden="true">*</span></label>
        <input id="cf-email" name="email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={errors.email ? 'true' : undefined} aria-describedby={errors.email ? 'cf-email-err' : 'cf-email-hint'} />
        <p className="hint" id="cf-email-hint">Only used to reply to you. Never shared, never subscribed to anything.</p>
        {errors.email && <p className="err" id="cf-email-err">{errors.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="cf-subject">Subject <span className="req" aria-hidden="true">*</span></label>
        <input id="cf-subject" name="subject" type="text" maxLength={120} value={subject} onChange={(event) => setSubject(event.target.value)} aria-invalid={errors.subject ? 'true' : undefined} aria-describedby={errors.subject ? 'cf-subject-err' : undefined} />
        {errors.subject && <p className="err" id="cf-subject-err">{errors.subject}</p>}
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message <span className="req" aria-hidden="true">*</span></label>
        <textarea id="cf-message" name="message" maxLength={4000} value={message} onChange={(event) => setMessage(event.target.value)} aria-invalid={errors.message ? 'true' : undefined} aria-describedby={errors.message ? 'cf-message-err' : 'cf-message-hint'} />
        <p className="hint" id="cf-message-hint">{message.length}/4000 characters. Please do not include passwords or secrets.</p>
        {errors.message && <p className="err" id="cf-message-err">{errors.message}</p>}
      </div>
      <div className="hp" aria-hidden="true"><label htmlFor="cf-website">Website (leave blank)</label><input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
      <div><button className="btn btn-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button></div>
      <p className="form-note">Protected by validation, rate limiting and spam checks. {directEmail ? <>Prefer email? <a href={`mailto:${directEmail}`}>Write directly</a>.</> : <>If the form fails, <button type="button" onClick={copyFallback} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>copy your message</button> and try again later.</>}</p>
    </form>
  );
}
