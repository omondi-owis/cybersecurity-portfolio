import { describe, it, expect } from 'vitest';
import { formatDate, readingMinutes, excerpt, slugify, escapeHtml } from '@/lib/utils';

describe('utils', () => {
  it('formats ISO dates', () => {
    expect(formatDate('2026-03-14')).toBe('14 Mar 2026');
  });

  it('estimates reading time with a floor of 1', () => {
    expect(readingMinutes('hello world')).toBe(1);
    expect(readingMinutes('word '.repeat(400))).toBe(2);
  });

  it('truncates excerpts without mid-word cuts', () => {
    const e = excerpt('one two three four five six', 14);
    expect(e.endsWith('…')).toBe(true);
    expect(e).not.toContain('four');
  });

  it('slugifies headings', () => {
    expect(slugify('Hello, World! 2026')).toBe('hello-world-2026');
  });

  it('escapes HTML entities', () => {
    expect(escapeHtml('<b>"x"&\'y\'</b>')).toBe('&lt;b&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/b&gt;');
  });
});
