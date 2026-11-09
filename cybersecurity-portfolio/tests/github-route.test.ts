import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('@/lib/rate-limit',()=>({rateLimit:vi.fn()}));
vi.mock('@/lib/github',()=>({getPinnedRepos:vi.fn()}));
import { rateLimit } from '@/lib/rate-limit';
import { getPinnedRepos } from '@/lib/github';
import { GET } from '@/app/api/github/route';
beforeEach(()=>{vi.mocked(rateLimit).mockReset().mockResolvedValue({allowed:true,remaining:29,resetAfterMs:60000});vi.mocked(getPinnedRepos).mockReset().mockResolvedValue(null);});
afterEach(()=>vi.restoreAllMocks());
describe('GitHub shared quota integration',()=>{
 it('blocks upstream fetch on quota exhaustion',async()=>{vi.mocked(rateLimit).mockResolvedValue({allowed:false,remaining:0,resetAfterMs:1501});const r=await GET(new Request('http://localhost/api/github?user=example'));expect(r.status).toBe(429);expect(r.headers.get('Retry-After')).toBe('2');expect(r.headers.get('Cache-Control')).toBe('no-store');expect(getPinnedRepos).not.toHaveBeenCalled();});
 it('fails closed on unavailable store',async()=>{vi.mocked(rateLimit).mockRejectedValue(new Error('synthetic-private-error'));const r=await GET(new Request('http://localhost/api/github?user=example'));expect(r.status).toBe(503);expect(r.headers.get('Retry-After')).toBe('60');expect(getPinnedRepos).not.toHaveBeenCalled();expect(await r.text()).not.toContain('synthetic-private-error');});
 it('preserves optional enrichment and prevents shared caching',async()=>{const r=await GET(new Request('http://localhost/api/github?user=example'));expect(r.status).toBe(200);expect(await r.json()).toEqual({ok:true,repos:null});expect(r.headers.get('Cache-Control')).toBe('no-store');});
 it('retains invalid-user validation',async()=>{expect((await GET(new Request('http://localhost/api/github?user=bad!'))).status).toBe(400);expect(getPinnedRepos).not.toHaveBeenCalled();});
});
