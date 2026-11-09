import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

describe('security and contact copy', () => {
  it('describes the implemented nonce-based CSP accurately', () => {
    const page = fs.readFileSync('app/security/page.tsx', 'utf8');
    expect(page).toContain('per-request script nonces; untrusted inline scripts and event handlers blocked');
    expect(page).toContain('production script-src has no unsafe-inline or unsafe-eval');
    expect(page).toContain('style-src-attr unsafe-inline');
    expect(page).not.toContain('Inline scripts are currently allowed');
    expect(page).not.toContain('nonce/hash-based policy is a future hardening step');
  });

  it('does not promise form delivery without configuration', () => {
    const page = fs.readFileSync('app/contact/page.tsx', 'utf8');
    expect(page).not.toContain('regardless');
    expect(page).not.toContain('Direct email is being set up');
    expect(page).toContain('If sending is temporarily unavailable');
    expect(page).toContain('keep your message');
  });
});
