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
        <p className="va-kicker">VYRA BUSINESS DESK</p>
        <h1 id="workspace-title">Your enquiries.<br />One clear view.</h1>
        <p className="va-intro">A focused workspace for the conversations that start on your website. Review, respond and keep track of what comes next.</p>
        <div className="va-login-points">
          <div className="va-login-point"><span aria-hidden="true">01</span><div><strong>Private by design</strong>Customer messages stay behind administrator sign-in.</div></div>
          <div className="va-login-point"><span aria-hidden="true">02</span><div><strong>Simple follow-through</strong>Keep new, replied and closed enquiries organised.</div></div>
          <div className="va-login-point"><span aria-hidden="true">03</span><div><strong>No password to remember</strong>Use a one-time code sent to your configured inbox.</div></div>
        </div>
      </section>
      <section className="va-login-card" aria-labelledby="signin-title">
        <div className="va-lock" aria-hidden="true">◇</div>
        <h2 id="signin-title">{requested ? 'Check your inbox' : 'Welcome back'}</h2>
        <p>{requested ? 'Enter the latest six-digit code to open your workspace.' : 'Sign in to your private enquiry dashboard. Codes go only to the configured administrator inbox.'}</p>
        {!requested ? <button className="va-button va-button-primary" type="button" onClick={() => void requestCode()} disabled={busy}>{busy ? 'Sending…' : 'Send sign-in code'}</button> : (
          <form onSubmit={verify}>
            <label htmlFor="admin-code">One-time code</label>
            <input id="admin-code" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" placeholder="000000" required autoFocus disabled={busy} aria-describedby="code-help" />
            <button className="va-button va-button-primary" type="submit" disabled={busy || code.length !== 6}>{busy ? 'Checking…' : 'Open dashboard'}</button>
            <button className="va-button va-button-subtle va-resend" type="button" onClick={() => void requestCode()} disabled={busy}>Request a new code</button>
          </form>
        )}
        {message && <p className="va-login-feedback" role="status">{message}</p>}
        <p className="va-login-help" id="code-help">Codes expire after 10 minutes. Enter your code in the same browser that requested it. Never share it.</p>
      </section>
    </div>
  );
}
