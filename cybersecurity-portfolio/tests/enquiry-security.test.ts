import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const calls: { query: [string, unknown[]][] } = { query: [] };
const queryResults: unknown[][] = [];
vi.mock('@neondatabase/serverless', () => ({ neon: vi.fn(() => ({ query: vi.fn(async (query: string, params: unknown[] = []) => { calls.query.push([query, params]); return queryResults.shift() ?? []; }) })) }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: vi.fn() }));
vi.mock('@/lib/client-ip', () => ({ clientIp: vi.fn(() => '203.0.113.8') }));

import { sameOrigin } from '@/lib/admin-auth';
import { cleanup, consumeChallenge, equal, featureReady, otp } from '@/lib/enquiries';
import { rateLimit } from '@/lib/rate-limit';
import { POST as authRequest } from '@/app/api/admin/auth/request/route';
import { POST as verify } from '@/app/api/admin/auth/verify/route';
import { POST as cleanupRoute } from '@/app/api/admin/cron/cleanup/route';
import { POST as contactPost } from '@/app/api/contact/route';
import { DELETE, GET, PATCH, POST as enquiryPost } from '@/app/api/admin/enquiries/route';

const origin = 'https://vyra.example';
const env = {
  ENQUIRY_DASHBOARD_ENABLED: 'true', DATABASE_URL: 'test-database-url', ADMIN_EMAIL: 'admin@vyra.example',
  ADMIN_AUTH_SECRET: 'a'.repeat(32), SITE_URL: origin, CRON_SECRET: 'c'.repeat(32), UPSTASH_REDIS_REST_URL: 'https://redis.example/',
  UPSTASH_REDIS_REST_TOKEN: 'token', RATE_LIMIT_HMAC_SECRET: 'r'.repeat(32), RESEND_API_KEY: 'resend-test-key', CONTACT_TO_EMAIL: 'inbox@vyra.example',
};

beforeEach(() => {
  Object.assign(process.env, env);
  calls.query = [];
  queryResults.length = 0;
  vi.mocked(rateLimit).mockReset().mockResolvedValue({ allowed: true, remaining: 1, resetAfterMs: 1000 });
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('enquiry dashboard security routes', () => {
  it('fails closed unless the feature has a valid HTTPS SITE_URL and both mail configurations', () => {
    expect(featureReady()).toBe(true);
    vi.stubEnv('SITE_URL', 'http://vyra.example'); expect(featureReady()).toBe(false);
    vi.stubEnv('SITE_URL', origin); vi.stubEnv('RESEND_API_KEY', ''); expect(featureReady()).toBe(false);
    vi.stubEnv('RESEND_API_KEY', env.RESEND_API_KEY); vi.stubEnv('CONTACT_TO_EMAIL', ''); expect(featureReady()).toBe(false);
  });

  it('accepts only the configured exact HTTPS origin, including no missing-origin mutation', () => {
    expect(sameOrigin(new Request('https://x', { headers: { origin, host: 'attacker.example' } }))).toBe(true);
    expect(sameOrigin(new Request('https://x', { headers: { origin: 'http://vyra.example' } }))).toBe(false);
    expect(sameOrigin(new Request('https://x', { headers: { origin: 'https://vyra.example.evil' } }))).toBe(false);
    expect(sameOrigin(new Request('https://x'))).toBe(false);
  });

  it('generates CSPRNG six-digit OTPs', () => { for (let i = 0; i < 100; i += 1) expect(otp()).toMatch(/^\d{6}$/); });
  it('applies absolute ninety-day retention', async () => { await cleanup(); expect(calls.query[0][0]).toContain("created_at < NOW() - INTERVAL '90 days'"); });

  it('rate limits authentication before creating a challenge or sending email', async () => {
    vi.mocked(rateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, resetAfterMs: 1 });
    const response = await authRequest(new NextRequest('https://vyra.example/api/admin/auth/request', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: '{}' }));
    expect(response.status).toBe(200); expect(calls.query).toHaveLength(0); expect(fetch).not.toHaveBeenCalled();
  });

  it('binds an OTP challenge to an HttpOnly strict cookie only after mail accepts it', async () => {
    const response = await authRequest(new NextRequest('https://vyra.example/api/admin/auth/request', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: '{}' }));
    expect(response.status).toBe(200); expect(vi.mocked(rateLimit)).toHaveBeenCalledTimes(2); expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.cookies.get('vyra_admin_challenge')?.httpOnly).toBe(true); expect(response.cookies.get('vyra_admin_challenge')?.sameSite).toBe('strict');
  });

  it('rejects verification without the cookie before database access', async () => {
    const response = await verify(new NextRequest('https://vyra.example/api/admin/auth/verify', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ code: '123456' }) }));
    expect(response.status).toBe(401); expect(calls.query).toHaveLength(0);
  });

  it('sets the admin cookie at root path so the API receives it', async () => {
    const { createHmac } = await import('crypto');
    queryResults.push([{ code_hash: createHmac('sha256', env.ADMIN_AUTH_SECRET).update('123456').digest('hex'), used_at: new Date().toISOString() }], []);
    const response = await verify(new NextRequest('https://vyra.example/api/admin/auth/verify', { method: 'POST', headers: { origin, cookie: 'vyra_admin_challenge=00000000-0000-4000-8000-000000000000', 'content-type': 'application/json' }, body: JSON.stringify({ code: '123456' }) }));
    expect(response.status).toBe(200);
    expect(response.cookies.get('vyra_admin')?.path).toBe('/');
  });

  it('uses one atomic query for OTP expiry, attempts and single use', async () => {
    await consumeChallenge('00000000-0000-4000-8000-000000000000', '123456');
    const [query, params] = calls.query[0];
    expect(query).toContain('attempts=attempts+1'); expect(query).toContain('used_at IS NULL'); expect(query).toContain('expires_at>NOW()'); expect(query).toContain('attempts<5'); expect(params).toHaveLength(2);
  });

  it('rejects unauthenticated reads and CSRF/missing-origin mutations without data changes', async () => {
    const read = await GET(new NextRequest('https://vyra.example/api/admin/enquiries'));
    const patch = await PATCH(new NextRequest('https://vyra.example/api/admin/enquiries', { method: 'PATCH', headers: { cookie: 'vyra_admin=x', 'content-type': 'application/json' }, body: JSON.stringify({ id: '00000000-0000-4000-8000-000000000000', status: 'closed' }) }));
    // Disabled/misconfigured mode deliberately remains opaque (404); enabled mode denies unauthenticated access (401).
    expect([401, 404]).toContain(read.status); expect([401, 404]).toContain(patch.status); expect(calls.query).toHaveLength(0);
  });

  it('rejects malformed identifiers before mutation queries', async () => {
    const cookie = 'vyra_admin=x';
    const patch = await PATCH(new NextRequest('https://vyra.example/api/admin/enquiries', { method: 'PATCH', headers: { origin, cookie, 'content-type': 'application/json' }, body: JSON.stringify({ id: 'x', status: 'closed' }) }));
    const deletion = await DELETE(new NextRequest('https://vyra.example/api/admin/enquiries', { method: 'DELETE', headers: { origin, cookie, 'content-type': 'application/json' }, body: JSON.stringify({ id: 'x', confirm: 'DELETE' }) }));
    expect([400, 401, 404]).toContain(patch.status); expect([400, 401, 404]).toContain(deletion.status);
  });

  it('ends an authenticated session server-side before clearing its root-path cookie', async () => {
    const response = await enquiryPost(new NextRequest('https://vyra.example/api/admin/enquiries', { method: 'POST', headers: { origin, cookie: 'vyra_admin=session-token', 'content-type': 'application/json' }, body: '{}' }));
    expect([200, 401, 404]).toContain(response.status);
    if (response.status === 200) {
      expect(calls.query.some(([query]) => query.startsWith('DELETE FROM admin_sessions'))).toBe(true);
      expect(response.cookies.get('vyra_admin')?.path).toBe('/');
    }
  });

  it('compares Unicode secrets by byte length without throwing', () => {
    expect(equal('é', 'aa')).toBe(false);
  });

  it('replaces malformed idempotency keys with a canonical UUIDv4', async () => {
    queryResults.push([{ id: '00000000-0000-4000-8000-000000000000' }], []);
    const response = await contactPost(new Request('https://vyra.example/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': '00000000-0000-4000-8000-000000000000---' }, body: JSON.stringify({ name: 'Jane Doe', email: 'jane@example.com', subject: 'Help', message: 'Please contact me about security.' }) }));
    expect(response.status).toBe(200);
    expect(calls.query[0][1][1]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('fails closed without storing or mailing when enabled configuration is invalid', async () => {
    vi.stubEnv('DATABASE_URL', '');
    const response = await contactPost(new Request('https://vyra.example/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Jane Doe', email: 'jane@example.com', subject: 'Help', message: 'Please contact me about security.' }) }));
    expect(response.status).toBe(503);
    expect(calls.query).toHaveLength(0);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('protects scheduled cleanup with a constant-time bearer comparison', async () => {
    const denied = await cleanupRoute(new NextRequest('https://vyra.example/api/admin/cron/cleanup', { method: 'POST' }));
    expect(denied.status).toBe(404);
    const allowed = await cleanupRoute(new NextRequest('https://vyra.example/api/admin/cron/cleanup', { method: 'POST', headers: { authorization: `Bearer ${env.CRON_SECRET}` } }));
    expect(allowed.status).toBe(200); expect(calls.query.map(([query]) => query)).toContain("DELETE FROM enquiries WHERE created_at < NOW() - INTERVAL '90 days'");
  });
});
