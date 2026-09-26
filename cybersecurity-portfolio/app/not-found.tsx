import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container error-wrap">
      <p className="error-code" aria-hidden="true">404</p>
      <h1>Page not found</h1>
      <p>
        This path doesn&apos;t exist on this portfolio. If you followed a link here,
        it may be outdated — the sitemap below will get you back on track.
      </p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <Link className="btn btn-primary" href="/">Go home</Link>
        <Link className="btn btn-ghost" href="/projects">Browse projects</Link>
      </div>
    </div>
  );
}
