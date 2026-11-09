import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rateLimit, RateLimitUnavailable } from '@/lib/rate-limit';

beforeEach(() => {
  vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.com');
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token');
  vi.stubEnv('RATE_LIMIT_HMAC_SECRET', 'synthetic-only-secret-32-characters-long');
  vi.stubEnv('RATE_LIMIT_NAMESPACE', 'test:rate:v1');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({result:[1,4,3600000]}))));
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers(); });
describe('shared Redis limiter REST contract', () => {
  it('sends one atomic EVAL with no raw client IP and no retries or caching', async () => {
    expect(await rateLimit('contact:192.0.2.1')).toEqual({allowed:true,remaining:4,resetAfterMs:3600000});
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('https://redis.example.com/');
    const command = JSON.parse(String(init?.body));
    expect(command.slice(0,3)).toEqual(['EVAL', expect.stringContaining("redis.call('PTTL'"), 1]);
    expect(command[3]).toMatch(/^test:rate:v1:5:3600000:[0-9a-f]{64}$/);
    expect(init?.body).not.toContain('192.0.2.1');
    expect(init?.cache).toBe('no-store'); expect(init?.redirect).toBe('error');
    expect(init?.headers).toEqual({Authorization:'Bearer fake-token','Content-Type':'application/json'});
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('returns denied decision and Redis expiry',async()=>{
    vi.mocked(fetch).mockResolvedValue(new Response('{"result":[0,0,1700]}'));
    expect(await rateLimit('contact:a')).toEqual({allowed:false,remaining:0,resetAfterMs:1700});
  });
  it('uses KV REST variables when Upstash variables are absent', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('KV_REST_API_URL', 'https://kv.example.com');
    vi.stubEnv('KV_REST_API_TOKEN', 'kv-token');
    await rateLimit('contact:kv');
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('https://kv.example.com/');
    expect(init?.headers).toEqual({ Authorization: 'Bearer kv-token', 'Content-Type': 'application/json' });
  });
  it('prefers configured Upstash variables over KV REST variables', async () => {
    vi.stubEnv('KV_REST_API_URL', 'https://kv.example.com');
    vi.stubEnv('KV_REST_API_TOKEN', 'kv-token');
    await rateLimit('contact:precedence');
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('https://redis.example.com/');
    expect(init?.headers).toEqual({ Authorization: 'Bearer fake-token', 'Content-Type': 'application/json' });
  });
  it.each(['UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','RATE_LIMIT_HMAC_SECRET'])('fails closed on missing %s',async name=>{
    vi.stubEnv(name,'');await expect(rateLimit('x')).rejects.toBeInstanceOf(RateLimitUnavailable);expect(fetch).not.toHaveBeenCalled();
  });
  it.each(['http://redis.example.com','https://user:pass@redis.example.com','https://redis.example.com/?token=fake','https://redis.example.com/path','not-a-url'])('rejects unsafe URL %s',async url=>{
    vi.stubEnv('UPSTASH_REDIS_REST_URL',url);await expect(rateLimit('x')).rejects.toThrow('Rate-limit service unavailable.');expect(fetch).not.toHaveBeenCalled();
  });
  it.each([null,{}, {error:'fake-private-provider-details'}, {result:[2,0,10]},{result:[0,1,10]},{result:[1,5,10]},{result:[1,0,0]},{result:[1,0,3600001]},{result:['1',0,10]}])('rejects malformed response %j',async body=>{
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(body)));
    await expect(rateLimit('x')).rejects.toThrow('Rate-limit service unavailable.');
  });
  it.each([401,429,500])('fails closed on HTTP %i',async status=>{
    vi.mocked(fetch).mockResolvedValue(new Response('synthetic secret provider payload',{status}));await expect(rateLimit('x')).rejects.toThrow('Rate-limit service unavailable.');
  });
  it('sanitizes network failures without retrying',async()=>{
    vi.mocked(fetch).mockRejectedValue(new Error('synthetic credentials'));await expect(rateLimit('x')).rejects.toThrow('Rate-limit service unavailable.');expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('times out and fails closed within two seconds',async()=>{
    vi.useFakeTimers();vi.mocked(fetch).mockImplementation(async (_url,init)=>new Promise((_resolve,reject)=>{init?.signal?.addEventListener('abort',()=>reject(new Error('abort')));}));
    const pending=expect(rateLimit('x')).rejects.toBeInstanceOf(RateLimitUnavailable);await vi.advanceTimersByTimeAsync(2001);await pending;
  });
  it('separates endpoint and policy keys',async()=>{
    vi.mocked(fetch).mockImplementation(async()=>new Response('{"result":[1,0,1]}'));
    await rateLimit('contact:192.0.2.1');await rateLimit('github:192.0.2.1');await rateLimit('contact:192.0.2.1',{limit:2,windowMs:1000});
    expect(new Set(vi.mocked(fetch).mock.calls.map(([,init])=>JSON.parse(String(init?.body))[3])).size).toBe(3);
  });
  it.each([{limit:0,windowMs:1000},{limit:1,windowMs:0},{limit:1.5,windowMs:1000},{limit:1,windowMs:86400001}])('rejects bad policy %j',async opts=>{await expect(rateLimit('x',opts)).rejects.toBeInstanceOf(RateLimitUnavailable);expect(fetch).not.toHaveBeenCalled();});
});
