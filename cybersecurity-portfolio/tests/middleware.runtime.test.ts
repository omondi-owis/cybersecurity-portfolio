import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

function request(path: string, headers: HeadersInit = {}) {
  return new NextRequest(`https://vyra.test${path}`, { headers });
}

function forwardedRequestHeader(response: Response, name: string): string | null {
  const encoded = response.headers.get(`x-middleware-request-${name}`);
  return encoded;
}

describe('middleware runtime behavior', () => {
  it('replaces a forged nonce and forwards the generated nonce/CSP to HTML rendering', () => {
    const first = middleware(request('/security', { 'x-nonce': 'forged-attacker-value' }));
    const second = middleware(request('/security', { 'x-nonce': 'another-forged-value' }));

    const firstNonce = forwardedRequestHeader(first, 'x-nonce');
    const secondNonce = forwardedRequestHeader(second, 'x-nonce');
    const firstCsp = first.headers.get('content-security-policy');

    expect(first.status).toBe(200);
    expect(firstNonce).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(secondNonce).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(firstNonce).not.toBe('forged-attacker-value');
    expect(secondNonce).not.toBe('another-forged-value');
    expect(firstNonce).not.toBe(secondNonce);
    expect(forwardedRequestHeader(first, 'content-security-policy')).toBe(firstCsp);
    expect(firstCsp).toContain(`'nonce-${firstNonce}'`);
    expect(firstCsp).toContain("script-src-attr 'none'");
    expect(first.headers.get('cache-control')).toBe('private, no-store, max-age=0, must-revalidate');
  });

  it('chooses the admin shell only for real admin paths and replaces forged hints', () => {
    for (const path of ['/admin', '/admin/login']) {
      expect(forwardedRequestHeader(middleware(request(path, { 'x-vyra-shell': 'public' })), 'x-vyra-shell')).toBe('admin');
    }
    for (const path of ['/', '/services', '/administrator']) {
      expect(forwardedRequestHeader(middleware(request(path, { 'x-vyra-shell': 'admin' })), 'x-vyra-shell')).toBe('public');
    }
  });

  it('keeps API requests nonce-free while preserving the API size guard', () => {
    const normal = middleware(request('/api/contact', { 'content-length': '10240', 'x-nonce': 'forged' }));
    const tooLarge = middleware(request('/api/contact', { 'content-length': '10241' }));

    expect(normal.status).toBe(200);
    expect(normal.headers.get('content-security-policy')).toContain("script-src 'self'");
    expect(normal.headers.get('content-security-policy')).not.toContain("'nonce-");
    expect(forwardedRequestHeader(normal, 'x-nonce')).toBeNull();
    expect(normal.headers.get('cache-control')).toBe('no-store, max-age=0');
    expect(tooLarge.status).toBe(413);
    expect(tooLarge.headers.get('content-security-policy')).toBe(normal.headers.get('content-security-policy'));
  });

  it('returns scanner probes as 404 without bypassing the HTML CSP', () => {
    const blocked = middleware(request('/.env'));
    expect(blocked.status).toBe(404);
    expect(blocked.headers.get('content-security-policy')).toContain("script-src 'self'");
    expect(blocked.headers.get('content-security-policy')).toContain("'nonce-");
    expect(blocked.headers.get('cache-control')).toBe('private, no-store, max-age=0, must-revalidate');
  });
});
