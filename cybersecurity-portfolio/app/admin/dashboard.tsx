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
type Filter = 'all' | Enquiry['status'];
const filters: { value: Filter; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'new', label: 'New' }, { value: 'replied', label: 'Replied' }, { value: 'closed', label: 'Closed' }];

export default function Dashboard() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/enquiries', { cache: 'no-store' });
      if (!response.ok) throw new Error('unavailable');
      const data = await response.json() as { enquiries: Enquiry[] };
      setItems(data.enquiries);
      setLoaded(true);
    } catch {
      // Do not leave previously loaded private records visible on failed revalidation.
      setItems([]);
      setLoaded(false);
      setMessage('Enquiries are unavailable. Please sign in again or try refreshing.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function update(id: string, status?: Enquiry['status'], remove = false) {
    if (remove && !window.confirm('Permanently delete this enquiry? This cannot be undone.')) return;
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
      setItems([]);
      setLoaded(false);
      setMessage('The action could not be confirmed. Sign in again and check the enquiry before retrying.');
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!response.ok) throw new Error('unavailable');
      setItems([]);
      window.location.assign('/admin/login');
    } catch {
      setMessage('Sign-out could not be confirmed. Please try again.');
      setBusy(false);
    }
  }

  const query = search.trim().toLocaleLowerCase();
  const visible = items.filter(item => (filter === 'all' || item.status === filter) && (!query || [item.name, item.email, item.subject, item.message].some(value => value.toLocaleLowerCase().includes(query))));
  const count = (status: Enquiry['status']) => items.filter(item => item.status === status).length;
  const unavailable = loading || !loaded;

  return (
    <section aria-labelledby="enquiries-title">
      <div className="va-page-head">
        <div><p className="va-kicker">PRIVATE ENQUIRY INBOX</p><h1 id="enquiries-title">Every conversation,<br />in focus.</h1><p className="va-intro">Review incoming requests and keep follow-up organised. Reply through your email app, then update the enquiry status here.</p></div>
        <div className="va-head-actions"><button className="va-button va-button-subtle" type="button" onClick={() => void load()} disabled={busy || loading}>{loading ? 'Refreshing…' : 'Refresh'}</button><button className="va-button" type="button" onClick={() => void signOut()} disabled={busy}>Sign out</button></div>
      </div>
      {message && <div className="va-notice" role="alert">{message}<a href="/admin/login">Back to sign in</a></div>}
      <div className="va-summary" aria-label="Loaded enquiry summary">
        <div className="va-stat"><span className="va-stat-label">Needs attention</span><strong>{unavailable ? '—' : count('new')}</strong><small>New enquiries</small></div>
        <div className="va-stat"><span className="va-stat-label">Responded</span><strong>{unavailable ? '—' : count('replied')}</strong><small>Marked as replied</small></div>
        <div className="va-stat"><span className="va-stat-label">Resolved</span><strong>{unavailable ? '—' : count('closed')}</strong><small>Closed enquiries</small></div>
      </div>
      <div className="va-toolbar">
        <div className="va-filters" role="group" aria-label="Filter enquiries by status">{filters.map(option => <button key={option.value} className="va-filter" type="button" aria-pressed={filter === option.value} onClick={() => setFilter(option.value)}>{option.label}</button>)}</div>
        <label className="va-search"><span className="va-screen-reader">Search loaded enquiries</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search enquiries…" /></label>
      </div>
      <p className="va-screen-reader" role="status">{loading ? 'Loading enquiries' : loaded ? `${visible.length} matching enquiries` : 'Enquiries unavailable'}</p>
      <div className="va-list" aria-busy={loading || busy}>
        {loading ? <div className="va-empty"><div className="va-empty-mark" aria-hidden="true">···</div><h2>Loading your inbox</h2><p>Checking the latest saved enquiries.</p></div> : loaded && visible.length === 0 ? <div className="va-empty"><div className="va-empty-mark" aria-hidden="true">▤</div><h2>{items.length ? 'No matching enquiries' : 'A clear inbox'}</h2><p>{items.length ? 'Try another status or search term.' : 'New website enquiries will appear here.'}</p>{items.length > 0 && <button className="va-button va-button-subtle" type="button" onClick={() => { setFilter('all'); setSearch(''); }}>Clear filters</button>}</div> : visible.map(enquiry => (
          <article className="va-enquiry" key={enquiry.id}>
            <div className="va-enquiry-top"><div><h2>{enquiry.subject}</h2><p className="va-sender">{enquiry.name} · <a href={`mailto:${encodeURIComponent(enquiry.email)}`}>{enquiry.email}</a></p></div><span className={`va-status va-status-${enquiry.status}`}>{enquiry.status}</span></div>
            <p className="va-message">{enquiry.message}</p>
            <div className="va-enquiry-meta"><time dateTime={enquiry.createdAt}>{new Date(enquiry.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</time><span className={enquiry.emailStatus === 'failed' ? 'va-delivery-failed' : undefined}>Notification email: {enquiry.emailStatus === 'sent' ? 'sent' : enquiry.emailStatus === 'failed' ? 'delivery failed · enquiry saved' : 'pending'}</span></div>
            <div className="va-enquiry-actions">
              <a className="va-button va-button-primary" href={`mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(`Re: ${enquiry.subject}`)}`}>Reply by email <span aria-hidden="true">↗</span></a>
              {enquiry.status !== 'replied' && <button className="va-button" type="button" disabled={busy} onClick={() => void update(enquiry.id, 'replied')}>Mark replied</button>}
              {enquiry.status !== 'closed' && <button className="va-button va-button-subtle" type="button" disabled={busy} onClick={() => void update(enquiry.id, 'closed')}>Close</button>}
              {enquiry.status !== 'new' && <button className="va-button va-button-subtle" type="button" disabled={busy} onClick={() => void update(enquiry.id, 'new')}>Reopen</button>}
              <button className="va-button va-button-danger va-delete" type="button" disabled={busy} onClick={() => void update(enquiry.id, undefined, true)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
      <p className="va-note">Showing up to the latest 100 enquiries. Counts and search cover this loaded set only. Enquiries are retained for no more than 90 days. Opening an email draft does not send it or mark the enquiry as replied.</p>
    </section>
  );
}
