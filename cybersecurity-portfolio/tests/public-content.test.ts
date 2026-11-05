import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
describe('public portfolio content', () => {
  it('uses hardcoded VYRA public branding and disables public personal links', async () => {
    vi.stubEnv('NEXT_PUBLIC_OWNER_NAME', 'Legacy Owner'); vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://legacy.test'); vi.resetModules();
    const { site } = await import('../content/site');
    expect(site.name).toBe('VYRA');
    expect(site.siteUrl).toBe('https://cybersecurity-portfolio-zp1e.vercel.app');
    expect(site.email).toBe('');
    expect(site.github).toBe('');
    expect(site.cvUrl).toBe('');
  });
  it('does not publish unsupported tuning statistics', () => {
    for (const path of ['content/articles.ts', 'content/labs.ts']) {
      const text = fs.readFileSync(path, 'utf8');
      expect(text).not.toContain('78%'); expect(text).not.toContain('82%');
      expect(text).not.toContain('zero lost true positives');
    }
  });
});
