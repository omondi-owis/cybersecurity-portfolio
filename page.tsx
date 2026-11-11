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
      setCode('');
      setRequested(true);
      setMessage('If sign-in is available, a code has been sent to the configured admin inbox.');
    } catch {
      setMessage('Sign-in is unavailable. Please try again later.');
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
      setMessage('We could not sign you in. Check the latest code or request a new one.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="va-login">
      <section className="va-login-story" aria-labelledby="workspace-title">
        <p className="va-kicker">VYRA ADMIN</p>
        <h1 id="workspace-title">Enquiry dashboard</h1>
      </section>
      <section className="va-login-card" aria-labelledby="signin-title">
        <div className="va-lock" aria-hidden="true">◇</div>
        <h2 id="signin-title">{requested ? 'Check your inbox' : 'Welcome back'}</h2>
        <p>{requested ? 'Enter the six-digit code from your admin inbox.' : 'Use a one-time code to sign in.'}</p>
        {!requested ? <button className="va-button va-button-primary" type="button" onClick={() => void requestCode()} disabled={busy}>{busy ? 'Sending…' : 'Send sign-in code'}</button> : (
          <form onSubmit={verify}>
            <label htmlFor="admin-code">One-time code</label>
            <input id="admin-code" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" placeholder="000000" required autoFocus disabled={busy} aria-describedby="code-help" />
            <button className="va-button va-button-primary" type="submit" disabled={busy || code.length !== 6}>{busy ? 'Checking…' : 'Open dashboard'}</button>
            <button className="va-button va-button-subtle va-resend" type="button" onClick={() => void requestCode()} disabled={busy}>Request a new code</button>
          </form>
        )}
        {message && <p className="va-login-feedback" role="status">{message}</p>}
        {requested && <p className="va-login-help" id="code-help">Expires in 10 minutes. Use this browser.</p>}
      </section>
    </div>
  );
}
