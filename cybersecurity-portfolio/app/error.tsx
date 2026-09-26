'use client';

/**
 * 500 page — deliberately generic. Never leaks stack traces,
 * paths, env or query internals to visitors.
 */
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container error-wrap">
      <p className="error-code" aria-hidden="true">500</p>
      <h1>Something went wrong</h1>
      <p>
        An unexpected error occurred. Nothing sensitive was exposed — please try
        again, and if it persists, report it via the contact page.
      </p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => reset()}>
          Try again
        </button>
        <a className="btn btn-ghost" href="/">
          Go home
        </a>
      </div>
    </div>
  );
}
