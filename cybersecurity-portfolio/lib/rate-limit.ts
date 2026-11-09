import { createHmac } from 'node:crypto';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAfterMs: number;
}
export class RateLimitUnavailable extends Error {
  constructor() { super('Rate-limit service unavailable.'); this.name = 'RateLimitUnavailable'; }
}

/** Atomic fixed window, measured by Redis TTL, not function-instance clocks.
 * Saturate at the quota; denied requests do not extend expiry or grow counters.
 * Repair missing expiry defensively. Only this script may write this namespace.
 */
export const RATE_LIMIT_SCRIPT = `
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local count = tonumber(redis.call('GET', KEYS[1]) or '0')
if count < 0 or count ~= math.floor(count) then return redis.error_reply('invalid counter') end
local ttl = redis.call('PTTL', KEYS[1])
if ttl <= 0 then
  redis.call('SET', KEYS[1], 1, 'PX', window)
  return {1, limit - 1, window}
end
if count >= limit then return {0, 0, ttl} end
count = redis.call('INCR', KEYS[1])
return {1, math.max(0, limit - count), ttl}
`;

/** No per-instance fallback: missing config or backend failure must not bypass quotas.
 * All instances must use the SAME writable Redis DB, namespace and HMAC secret.
 * HMAC pseudonymizes IP-bearing input; it is not anonymous data.
 */
export async function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number } = { limit: 5, windowMs: 3_600_000 }
): Promise<RateLimitResult> {
  if (!key || key.length > 256 || !Number.isSafeInteger(opts.limit) || opts.limit < 1 ||
      !Number.isSafeInteger(opts.windowMs) || opts.windowMs < 1 || opts.windowMs > 86_400_000) {
    throw new RateLimitUnavailable();
  }
  const endpoint = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const secret = process.env.RATE_LIMIT_HMAC_SECRET?.trim();
  const namespace = process.env.RATE_LIMIT_NAMESPACE?.trim() || 'vyra:rate:v1';
  if (!endpoint || !token || !secret || secret.length < 32 || !/^[a-zA-Z0-9:_-]{1,80}$/.test(namespace)) {
    throw new RateLimitUnavailable();
  }
  let url: URL;
  try { url = new URL(endpoint); } catch { throw new RateLimitUnavailable(); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new RateLimitUnavailable();
  }
  const digest = createHmac('sha256', secret).update(key).digest('hex');
  const storeKey = `${namespace}:${opts.limit}:${opts.windowMs}:${digest}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2000);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', RATE_LIMIT_SCRIPT, 1, storeKey, opts.limit, opts.windowMs]),
      cache: 'no-store', redirect: 'error', signal: ctrl.signal,
    });
    if (!res.ok) throw new RateLimitUnavailable();
    const data: unknown = await res.json();
    if (!data || typeof data !== 'object' || 'error' in data || !('result' in data)) throw new RateLimitUnavailable();
    const result = data.result;
    if (!Array.isArray(result) || result.length !== 3 || !result.every(Number.isSafeInteger)) throw new RateLimitUnavailable();
    const [allowed, remaining, ttl] = result as number[];
    if ((allowed !== 0 && allowed !== 1) || remaining < 0 || remaining >= opts.limit ||
        (allowed === 0 && remaining !== 0) || ttl < 1 || ttl > opts.windowMs) throw new RateLimitUnavailable();
    return { allowed: allowed === 1, remaining, resetAfterMs: ttl };
  } catch {
    // Never surface provider payloads, endpoints, credentials or client identifiers.
    throw new RateLimitUnavailable();
  } finally { clearTimeout(timer); }
}
