import { describe,it,expect } from 'vitest';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
describe('security and contact copy',()=>{
 it('describes actual configured script CSP accurately',async()=>{
  const config=require('../next.config.js'); const rules=await config.headers();
  const csp=rules[0].headers.find((h:{key:string})=>h.key==='Content-Security-Policy').value;
  expect(csp).toContain("script-src 'self' 'unsafe-inline'");
  const page=fs.readFileSync('app/security/page.tsx','utf8');
  expect(page).not.toContain('Zero inline scripts site-wide'); expect(page).not.toContain('self-only scripts, no inline JS');
  expect(page).toContain('Inline scripts are currently allowed'); expect(page).toContain('nonce/hash-based policy is a future hardening step');
 });
 it('does not promise form delivery without configuration',()=>{
  const page=fs.readFileSync('app/contact/page.tsx','utf8');
  expect(page).not.toContain('regardless');expect(page).not.toContain('Direct email is being set up');
   expect(page).toContain('If sending is temporarily unavailable');expect(page).toContain('keep your message');
 });
});
