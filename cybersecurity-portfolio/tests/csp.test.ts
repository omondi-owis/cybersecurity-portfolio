import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { baselineCsp, createNonce, pageCsp } from '../lib/csp';

describe('strict CSP policy', () => {
  it('uses secure, unique nonces', () => {
    const first = createNonce();
    const second = createNonce();
    expect(first).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(second).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(first).not.toBe(second);
  });

  it('is strict in production and permits eval only for local development tooling', () => {
    const nonce = createNonce();
    const production = pageCsp(nonce, false);
    const development = pageCsp(nonce, true);

    expect(production).toContain(`script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`);
    expect(production).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(production).not.toContain("'unsafe-eval'");
    expect(production).toContain("script-src-attr 'none'");
    expect(production).toContain("style-src 'self' https://fonts.googleapis.com");
    expect(production).toContain("style-src-attr 'unsafe-inline'");
    expect(development).toContain("'unsafe-eval'");
  });

  it('uses a baseline with no inline script exception for APIs', () => {
    const csp = baselineCsp();
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('has middleware replace forged nonces and forward its CSP to renderer and response', () => {
    const middleware = fs.readFileSync('middleware.ts', 'utf8');
    expect(middleware).toContain("requestHeaders.set('x-nonce', nonce)");
    expect(middleware).toContain("requestHeaders.set('Content-Security-Policy', csp)");
    expect(middleware).toContain('request: { headers: requestHeaders }');
    expect(middleware).toContain("'Content-Security-Policy': csp");
    expect(middleware).toContain('responseHeaders.forEach((value, key) => response.headers.set(key, value))');
    expect(middleware).toContain("'private, no-store, max-age=0, must-revalidate'");
  });

  it('does not leave a second, conflicting CSP in next config', () => {
    const config = fs.readFileSync('next.config.js', 'utf8');
    expect(config).not.toContain('Content-Security-Policy');
  });

  it('forces dynamic, nonce-aware rendering', () => {
    const layout = fs.readFileSync('app/layout.tsx', 'utf8');
    expect(layout).toContain("export const dynamic = 'force-dynamic'");
    expect(layout).toContain('export const revalidate = 0');
    expect(layout).toContain("get('x-nonce')");
  });
});
