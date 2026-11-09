'use client';

import { useState } from 'react';

export default function Login() {
  const [requested, setRequested] = useState(false);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function requestCode() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/auth/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!response.ok) throw new Error('unavailable');
      setRequested(true);
      setMessage('A code was sent if private sign-in is available.');
    } catch {
      setMessage('Sign-in is unavailable.');
    } finally {
      setBusy(false);
    }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
      if (!response.ok) throw new Error('unavailable');
      window.location.assign('/admin');
    } catch {
      setMessage('Sign-in is unavailable.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container page-head">
      <p className="eyebrow">PRIVATE</p>
      <h1>VYRA enquiries</h1>
      <p className="lede">Private access only.</p>
      {!requested ? (
        <button className="btn btn-primary" type="button" onClick={() => void requestCode()} disabled={busy}>
          {busy ? 'Sending…' : 'Send sign-in code'}
        </button>
      ) : (
        <form className="form" onSubmit={verify}>
          <div className="field">
            <label htmlFor="admin-code">One-time code</label>
            <input id="admin-code" aria-label="One-time code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy || code.length !== 6}>{busy ? 'Checking…' : 'Sign in'}</button>
        </form>
      )}
      {message && <p aria-live="polite">{message}</p>}
    </section>
  );
}
