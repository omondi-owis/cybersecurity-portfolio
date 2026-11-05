import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
describe('public portfolio content', () => {
  it('defaults canonical and share URLs to the real deployment', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', ''); vi.resetModules();
    const { site } = await import('../content/site');
    expect(site.siteUrl).toBe('https://cybersecurity-portfolio-zp1e.vercel.app');
  });
  it('honours an explicit public site origin', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.test'); vi.resetModules();
    const { site } = await import('../content/site');
    expect(site.siteUrl).toBe('https://portfolio.test');
  });
  it('does not publish unsupported tuning statistics', () => {
    for (const path of ['content/articles.ts', 'content/labs.ts']) {
      const text = fs.readFileSync(path, 'utf8');
      expect(text).not.toContain('78%'); expect(text).not.toContain('82%');
      expect(text).not.toContain('zero lost true positives');
    }
  });
});
