import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, __resetRateLimits } from '@/lib/rate-limit';

describe('rateLimit (token bucket)', () => {
  beforeEach(() => __resetRateLimits());

  it('allows up to the limit, then blocks', () => {
    const opts = { limit: 3, windowMs: 60_000, now: 1_000 };
    expect(rateLimit('k', opts).allowed).toBe(true);
    expect(rateLimit('k', opts).allowed).toBe(true);
    expect(rateLimit('k', opts).allowed).toBe(true);
    const blocked = rateLimit('k', opts);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets after the window', () => {
    expect(rateLimit('k', { limit: 1, windowMs: 1000, now: 0 }).allowed).toBe(true);
    expect(rateLimit('k', { limit: 1, windowMs: 1000, now: 500 }).allowed).toBe(false);
    expect(rateLimit('k', { limit: 1, windowMs: 1000, now: 1001 }).allowed).toBe(true);
  });

  it('isolates keys', () => {
    const opts = { limit: 1, windowMs: 60_000, now: 0 };
    expect(rateLimit('a', opts).allowed).toBe(true);
    expect(rateLimit('b', opts).allowed).toBe(true);
  });
});
