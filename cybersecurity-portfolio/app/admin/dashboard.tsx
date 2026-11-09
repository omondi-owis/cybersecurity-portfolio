'use client';

import { useEffect, useState } from 'react';

type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  emailStatus: 'pending' | 'sent' | 'failed';
  createdAt: string;
};

export default function Dashboard() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    setMessage('');
    try {
      const response = await fetch('/api/admin/enquiries', { cache: 'no-store' });
      if (!response.ok) throw new Error('unavailable');
      const data = await response.json() as { enquiries: Enquiry[] };
      setItems(data.enquiries);
    } catch {
      setMessage('Enquiries are unavailable. Please sign in again.');
    }
  }

  useEffect(() => { void load(); }, []);

  async function update(id: string, status?: Enquiry['status'], remove = false) {
    if (remove && !window.confirm('Permanently delete this enquiry?')) return;
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/enquiries', {
        method: remove ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remove ? { id, confirm: 'DELETE' } : { id, status }),
      });
      if (!response.ok) throw new Error('unavailable');
      await load();
    } catch {
      setMessage('Action unavailable. Please sign in again.');
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    try {
      await fetch('/api/admin/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    } finally {
      window.location.assign('/admin/login');
    }
  }

  return (
    <section className="container page-head">
      <p className="eyebrow">PRIVATE DASHBOARD</p>
      <h1>Enquiries</h1>
      <p className="lede">Contact enquiries are stored for no more than 90 days. This dashboard contains no visitor tracking data.</p>
      <button className="btn btn-ghost" type="button" onClick={() => void signOut()} disabled={busy}>Sign out</button>
      {message && <p aria-live="polite" className="alert alert-err">{message}</p>}
      <div className="admin-list">
        {items.map((enquiry) => (
          <article className="side-card" key={enquiry.id}>
            <strong>{enquiry.subject}</strong>
            <p>{enquiry.name} · <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></p>
            <p>{enquiry.message}</p>
            <small>{new Date(enquiry.createdAt).toLocaleString()} · {enquiry.status} · delivery: {enquiry.emailStatus}</small>
            <p>
              <button className="btn btn-ghost" type="button" disabled={busy} onClick={() => void update(enquiry.id, 'replied')}>Mark replied</button>{' '}
              <button className="btn btn-ghost" type="button" disabled={busy} onClick={() => void update(enquiry.id, 'closed')}>Close</button>{' '}
              <button className="btn btn-ghost" type="button" disabled={busy} onClick={() => void update(enquiry.id, undefined, true)}>Delete</button>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
