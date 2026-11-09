import { isIP } from 'node:net';

/** Trust only platform-overwritten headers, never arbitrary forwarded input.
 * Off Vercel an operator must explicitly name a trusted, overwritten header.
 * Missing/invalid addresses share a conservative unknown quota, never bypass it.
 */
export function clientIp(headers: Headers): string {
  const header = process.env.VERCEL === '1' ? 'x-vercel-forwarded-for' : process.env.RATE_LIMIT_TRUSTED_IP_HEADER?.trim();
  if (!header || !/^[a-zA-Z0-9-]+$/.test(header)) return 'unknown';
  const value = headers.get(header)?.trim();
  if (!value || value.length > 64 || value.includes('%') || !isIP(value)) return 'unknown';
  if (isIP(value) === 4) return value;
  const canonical = new URL(`http://[${value}]/`).hostname.slice(1, -1);
  // Collapse IPv4-mapped IPv6 addresses to the equivalent IPv4 key.
  const mapped = /^::ffff:([0-9a-f]+):([0-9a-f]+)$/.exec(canonical);
  if (mapped) {
    const high = parseInt(mapped[1], 16), low = parseInt(mapped[2], 16);
    return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
  }
  return canonical;
}
