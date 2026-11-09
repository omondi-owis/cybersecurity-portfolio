import { afterEach, describe, expect, it, vi } from 'vitest';
import { clientIp } from '@/lib/client-ip';
afterEach(()=>vi.unstubAllEnvs());
describe('trusted client IP',()=>{
 it('ignores arbitrary forwarded headers off-platform',()=>{vi.stubEnv('VERCEL','');vi.stubEnv('RATE_LIMIT_TRUSTED_IP_HEADER','');expect(clientIp(new Headers({'x-forwarded-for':'192.0.2.1','x-real-ip':'192.0.2.2'}))).toBe('unknown');});
 it('prefers Vercel platform header',()=>{vi.stubEnv('VERCEL','1');expect(clientIp(new Headers({'x-forwarded-for':'192.0.2.1','x-vercel-forwarded-for':'192.0.2.2'}))).toBe('192.0.2.2');});
 it.each(['192.0.2.1, 192.0.2.2','bad-ip','fe80::1%eth0',''])('groups invalid IP %s',value=>{vi.stubEnv('VERCEL','1');expect(clientIp(new Headers({'x-vercel-forwarded-for':value}))).toBe('unknown');});
 it('canonicalizes equivalent IPv6 forms',()=>{vi.stubEnv('VERCEL','1');expect(clientIp(new Headers({'x-vercel-forwarded-for':'2001:0DB8:0:0:0:0:0:1'}))).toBe('2001:db8::1');});
 it('canonicalizes IPv4-mapped IPv6',()=>{vi.stubEnv('VERCEL','1');expect(clientIp(new Headers({'x-vercel-forwarded-for':'::ffff:192.0.2.1'}))).toBe('192.0.2.1');});
 it('supports explicitly trusted non-Vercel proxy',()=>{vi.stubEnv('VERCEL','');vi.stubEnv('RATE_LIMIT_TRUSTED_IP_HEADER','x-client-ip');expect(clientIp(new Headers({'x-client-ip':'192.0.2.3'}))).toBe('192.0.2.3');});
});
