'use client';

import { usePathname } from 'next/navigation';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const login = usePathname() === '/admin/login';
  return (
    <div className="va-shell" data-theme="dark">
      <aside className="va-sidebar" aria-label="Workspace">
        <a className="va-brand" href="/admin" aria-label="VYRA Dashboard">
          <span className="va-monogram" aria-hidden="true">V</span>
          <span>VYRA<small>PRIVATE WORKSPACE</small></span>
        </a>
        <div className="va-side-label">WORKSPACE</div>
        <nav aria-label="Admin navigation">
          <a className="va-nav-active" href={login ? '/admin/login' : '/admin'} aria-current="page"><span aria-hidden="true">▤</span> {login ? 'Administrator access' : 'Enquiries'}</a>
        </nav>
        <div className="va-sidebar-bottom">
          <div className="va-preview-label"><span /> Private workspace</div>
          <a href="/" target="_blank" rel="noopener noreferrer">View public website <span aria-hidden="true">↗</span></a>
        </div>
      </aside>
      <div className="va-workspace">
        <header className="va-topbar"><span>VYRA <span className="va-separator">/</span> {login ? 'Sign in' : 'Enquiries'}</span><span className="va-private-label">Administrator only</span></header>
        <div className="va-content">{children}</div>
        <footer className="va-footer"><span>VYRA Admin</span><span>Administrator only</span></footer>
      </div>
    </div>
  );
}
