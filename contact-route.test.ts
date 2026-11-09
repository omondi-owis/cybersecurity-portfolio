import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';
vi.mock('@/lib/rate-limit', () => ({ rateLimit: vi.fn() }));
import { POST, GET } from '@/app/api/contact/route';
const valid = { name: 'Test Visitor', email: 'visitor@example.com', subject: 'Portfolio test', message: 'Synthetic local test message only.', website: '' };
let counter = 0;
function request(body: unknown = valid, type = 'application/json', raw = false) {
  return new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': type, 'x-forwarded-for': `198.51.100.${++counter}`, 'x-request-id': 'local-test' }, body: raw ? String(body) : JSON.stringify(body) });
}
beforeEach(() => { vi.mocked(rateLimit).mockReset().mockResolvedValue({allowed:true,remaining:4,resetAfterMs:3600000}); vi.stubEnv('RESEND_API_KEY', ''); vi.stubEnv('CONTACT_TO_EMAIL', ''); vi.stubGlobal('fetch', vi.fn()); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });
describe('contact delivery honesty and regressions', () => {
 it.each([['',''],['fake-key',''],['','owner@example.com'],['  ','owner@example.com']])('returns 503 for missing config %s/%s', async (key, to) => {
  vi.stubEnv('RESEND_API_KEY', key); vi.stubEnv('CONTACT_TO_EMAIL', to);
  const r = await POST(request()); expect(r.status).toBe(503); expect((await r.json()).ok).toBe(false); expect(r.headers.get('x-request-id')).toBe('local-test'); expect(fetch).not.toHaveBeenCalled();
 });
 it('returns success only after mocked provider acceptance', async () => {
  vi.stubEnv('RESEND_API_KEY','fake-test-key'); vi.stubEnv('CONTACT_TO_EMAIL','owner@example.com');
  vi.mocked(fetch).mockResolvedValue(new Response('{"id":"mock-only"}',{status:200}));
  const r=await POST(request()); expect(r.status).toBe(200); expect((await r.json()).ok).toBe(true);
  expect(fetch).toHaveBeenCalledTimes(1); const [url,opts]=vi.mocked(fetch).mock.calls[0]; expect(url).toBe('https://api.resend.com/emails'); expect(JSON.parse(String(opts?.body)).to).toEqual(['owner@example.com']);
 });
 it('returns 502 on provider rejection', async () => {
  vi.stubEnv('RESEND_API_KEY','fake-test-key'); vi.stubEnv('CONTACT_TO_EMAIL','owner@example.com'); vi.mocked(fetch).mockResolvedValue(new Response('{}',{status:403}));
  const r=await POST(request()); expect(r.status).toBe(502); expect((await r.json()).ok).toBe(false);
 });
 it('returns 502 on network error', async () => {
  vi.stubEnv('RESEND_API_KEY','fake-test-key'); vi.stubEnv('CONTACT_TO_EMAIL','owner@example.com'); vi.mocked(fetch).mockRejectedValue(new Error('mock failure'));
  const r=await POST(request()); expect(r.status).toBe(502); expect((await r.json()).ok).toBe(false);
 });
 it('returns 502 on an aborted provider request', async () => {
  vi.useFakeTimers(); vi.stubEnv('RESEND_API_KEY','fake-test-key'); vi.stubEnv('CONTACT_TO_EMAIL','owner@example.com');
  vi.mocked(fetch).mockImplementation(async (_url, opts) => new Promise((_resolve,reject)=>{ opts?.signal?.addEventListener('abort',()=>reject(new Error('aborted'))); }));
  const pending=POST(request()); await vi.advanceTimersByTimeAsync(8100); const r=await pending; expect(r.status).toBe(502);
 });
 it('rejects unsupported content type',async()=>{expect((await POST(request(valid,'text/plain'))).status).toBe(415);});
 it('rejects invalid JSON',async()=>{expect((await POST(request('{','application/json',true))).status).toBe(400);});
 it('rejects oversized body',async()=>{expect((await POST(request('x'.repeat(10241),'application/json',true))).status).toBe(413);});
 it('rejects invalid fields',async()=>{expect((await POST(request({...valid,email:'bad'}))).status).toBe(422);});
 it('retains honeypot fake success without delivery',async()=>{const r=await POST(request({...valid,website:'bot'}));expect(r.status).toBe(200);expect(fetch).not.toHaveBeenCalled();});
 it('rate-limits the sixth request from the same IP',async()=>{
  vi.mocked(rateLimit).mockResolvedValueOnce({allowed:true,remaining:4,resetAfterMs:3600000}).mockResolvedValueOnce({allowed:true,remaining:3,resetAfterMs:3600000}).mockResolvedValueOnce({allowed:true,remaining:2,resetAfterMs:3600000}).mockResolvedValueOnce({allowed:true,remaining:1,resetAfterMs:3600000}).mockResolvedValueOnce({allowed:true,remaining:0,resetAfterMs:3600000}).mockResolvedValue({allowed:false,remaining:0,resetAfterMs:3600000});
  const make=()=>new Request('http://localhost/api/contact',{method:'POST',headers:{'Content-Type':'application/json','x-forwarded-for':'203.0.113.250'},body:JSON.stringify(valid)});
  for(let i=0;i<5;i++) expect((await POST(make())).status).toBe(503);
  const r=await POST(make());expect(r.status).toBe(429);expect(Number(r.headers.get('Retry-After'))).toBeGreaterThan(0);
 });
 it('fails closed without delivery when limiter is unavailable',async()=>{vi.mocked(rateLimit).mockRejectedValue(new Error('synthetic backend error'));vi.stubEnv('RESEND_API_KEY','fake-test-key');vi.stubEnv('CONTACT_TO_EMAIL','owner@example.com');const r=await POST(request());expect(r.status).toBe(503);expect(r.headers.get('Retry-After')).toBe('60');expect(r.headers.get('Cache-Control')).toBe('no-store');expect(fetch).not.toHaveBeenCalled();expect(await r.text()).not.toContain('synthetic backend error');});
 it('rejects GET',async()=>{expect((await GET()).status).toBe(405);});
});
