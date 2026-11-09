import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { spawn, execFile, type ChildProcess } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const run = promisify(execFile);
const server = process.env.REDIS_TEST_SERVER;
const cli = process.env.REDIS_TEST_CLI;
// Optional integration suite. Uses a disposable, Unix-socket-only real Redis.
// No existing database, network listener or hosted service is accessed.
describe.skipIf(!server || !cli)('atomic Redis integration across independent module instances',()=>{
 let child: ChildProcess; let dir: string; let socket: string;
 async function command(...args: string[]) { const {stdout}=await run(cli!,['-s',socket,'--json',...args]);return JSON.parse(stdout); }
 beforeAll(async()=>{
  dir=mkdtempSync(join(tmpdir(),'vyra-redis-'));socket=join(dir,'redis.sock');
  child=spawn(server!,['--port','0','--unixsocket',socket,'--save','','--appendonly','no'],{stdio:'ignore'});
  let ready=false;for(let i=0;i<100;i++){try{if(await command('PING')==='PONG'){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,20));}
  if(!ready)throw new Error('Disposable Redis did not start');
 });
 afterAll(async()=>{if(child){child.kill();await new Promise<void>(resolve=>{if(child.exitCode!==null)resolve();else child.once('exit',()=>resolve());});}if(dir)rmSync(dir,{recursive:true,force:true});});
 beforeEach(async()=>{
  await command('FLUSHDB');vi.stubEnv('UPSTASH_REDIS_REST_URL','https://redis.example.com');vi.stubEnv('UPSTASH_REDIS_REST_TOKEN','fake-token');vi.stubEnv('RATE_LIMIT_HMAC_SECRET','synthetic-only-secret-32-characters-long');vi.stubEnv('RATE_LIMIT_NAMESPACE','test:atomic');
  // Only HTTP transport is adapted; Lua/expiry/concurrency execute on real Redis.
  vi.stubGlobal('fetch',vi.fn(async (_url: unknown,init?: RequestInit)=>{
   const args=JSON.parse(String(init?.body)).map(String);const result=await command(...args);return new Response(JSON.stringify({result}));
  }));
 });
 afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
 it('allows exactly five of sixty concurrent requests across independent instances',async()=>{
  vi.resetModules();const a=await import('@/lib/rate-limit');vi.resetModules();const b=await import('@/lib/rate-limit');
  expect(a.rateLimit).not.toBe(b.rateLimit);
  const results=await Promise.all(Array.from({length:60},(_,i)=>(i%2?a:b).rateLimit('contact:192.0.2.1',{limit:5,windowMs:10000})));
  expect(results.filter(r=>r.allowed)).toHaveLength(5);expect(results.filter(r=>!r.allowed)).toHaveLength(55);
  const keys=await command('KEYS','test:atomic:*');expect(keys).toHaveLength(1);expect(await command('GET',keys[0])).toBe('5');expect(await command('PTTL',keys[0])).toBeGreaterThan(0);
 });
 it('expires idle keys without traffic and permits a new window',async()=>{
  const {rateLimit}=await import('@/lib/rate-limit');const opts={limit:1,windowMs:250};expect((await rateLimit('expiry',opts)).allowed).toBe(true);expect((await rateLimit('expiry',opts)).allowed).toBe(false);
  await new Promise(r=>setTimeout(r,350));expect(await command('DBSIZE')).toBe(0);expect((await rateLimit('expiry',opts)).allowed).toBe(true);
 });
 it('does not extend the window when requests are blocked',async()=>{
  const {rateLimit}=await import('@/lib/rate-limit');const opts={limit:1,windowMs:1000};await rateLimit('blocked',opts);await new Promise(r=>setTimeout(r,100));const blocked=await rateLimit('blocked',opts);expect(blocked.allowed).toBe(false);expect(blocked.resetAfterMs).toBeLessThan(950);
 });
 it('separates API namespaces and repairs a missing TTL',async()=>{
  const {rateLimit}=await import('@/lib/rate-limit');const opts={limit:1,windowMs:1000};expect((await rateLimit('contact:x',opts)).allowed).toBe(true);expect((await rateLimit('github:x',opts)).allowed).toBe(true);
  const keys=await command('KEYS','test:atomic:*');expect(keys).toHaveLength(2);for(const key of keys)await command('PERSIST',key);
  expect((await rateLimit('contact:x',opts)).allowed).toBe(true);expect((await rateLimit('contact:x',opts)).allowed).toBe(false);
 });
});
