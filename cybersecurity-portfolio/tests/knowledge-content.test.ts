import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { articles } from '../content/articles';

describe('knowledge guides', () => {
  it('preserves the seven public article routes and complete sections', () => {
    expect(articles.map(a => a.slug)).toEqual(['threat-modeling-personal-projects', 'ubuntu-hardening-checklist', 'siem-tuning-without-blinding', 'secure-headers-nextjs', 'python-soc-automation-safely', 'home-lab-network-isolation', 'from-logs-to-findings']);
    for (const article of articles) {
      expect(article.sections.length).toBeGreaterThanOrEqual(3);
      expect(new Set(article.sections.map(s => s.id)).size).toBe(article.sections.length);
      expect(article.sections.every(s => s.paragraphs.length > 0)).toBe(true);
    }
  });
  it('distinguishes guidance from completed project evidence', () => {
    const intro = fs.readFileSync('app/knowledge/page.tsx', 'utf8');
    expect(intro).toContain('completed project');
    expect(JSON.stringify(articles)).not.toContain('78%');
    const csp = articles.find(a => a.slug === 'secure-headers-nextjs')!;
    expect(JSON.stringify(csp)).toContain('fresh nonce for framework scripts');
    expect(JSON.stringify(csp)).toContain('Untrusted inline scripts remain blocked');
  });
  it('keeps animation opt-in and observes dynamically added cards', () => {
    const css = fs.readFileSync('app/knowledge-fixes.css', 'utf8');
    expect(css).toContain('.reveal:not(.reveal-pending) { opacity: 1;');
    expect(css).toContain('.prose { min-width: 0; }');
    const reveal = fs.readFileSync('components/Reveal.tsx', 'utf8');
    expect(reveal).toContain('MutationObserver');
    expect(reveal).toContain('[pathname]');
  });
});
