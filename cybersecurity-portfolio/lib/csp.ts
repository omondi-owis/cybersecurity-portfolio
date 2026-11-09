const PAGE_CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "style-src 'self' https://fonts.googleapis.com",
  // React server-rendered style props remain while their CSS migration is out of scope.
  "style-src-attr 'unsafe-inline'",
  "script-src-attr 'none'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
];

const API_CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self'",
  "style-src-attr 'none'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
];

/** Generate a cryptographically secure, per-request CSP nonce in Edge-compatible APIs. */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * CSP for rendered HTML. A nonce is required for every executable script.
 * Development permits eval only for Next's local dev tooling; production does not.
 */
export function pageCsp(nonce: string, isDevelopment = process.env.NODE_ENV === 'development'): string {
  const scriptSources = ["script-src 'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];
  if (isDevelopment) scriptSources.push("'unsafe-eval'");

  return [
    ...PAGE_CSP_DIRECTIVES.filter((directive) => !directive.startsWith('script-src')),
    scriptSources.join(' '),
    "script-src-attr 'none'",
  ].join('; ');
}

/** Baseline policy for API and non-rendered responses: no inline script exception. */
export function baselineCsp(): string {
  return API_CSP_DIRECTIVES.join('; ');
}
