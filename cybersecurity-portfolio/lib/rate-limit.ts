/**
 * In-memory token-bucket rate limiter.
 * Correct for a single-instance deployment; document that multi-instance
 * deployments should move to a shared store (Redis/Upstash).
 */

interface Bucket {
  tokens: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAfterMs: number;
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number; now?: number } = { limit: 5, windowMs: 60 * 60 * 1000 }
): RateLimitResult {
  const now = opts.now ?? Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    const fresh: Bucket = { tokens: opts.limit - 1, resetAt: now + opts.windowMs };
    buckets.set(key, fresh);
    return { allowed: true, remaining: fresh.tokens, resetAfterMs: opts.windowMs };
  }

  if (existing.tokens <= 0) {
    return { allowed: false, remaining: 0, resetAfterMs: existing.resetAt - now };
  }

  existing.tokens -= 1;
  return { allowed: true, remaining: existing.tokens, resetAfterMs: existing.resetAt - now };
}

/** Test-only helper to reset state. */
export function __resetRateLimits(): void {
  buckets.clear();
}
