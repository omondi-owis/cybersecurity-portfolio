import { NextResponse } from 'next/server';
import { getPinnedRepos } from '@/lib/github';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/client-ip';

export const dynamic = 'force-dynamic';

/**
 * GET /api/github?user=<name>
 * Optional enrichment proxy: server holds the token, client only sees
 * public repo summaries. Fail-soft: { repos: null } when unconfigured.
 */
export async function GET(req: Request) {
  const headers = new Headers(req.headers);
  const ip = clientIp(headers);

  let rl;
  try {
    rl = await rateLimit(`github:${ip}`, { limit: 30, windowMs: 60 * 1000 });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Service temporarily unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' } }
    );
  }
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'Rate limited.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetAfterMs / 1000)), 'Cache-Control': 'no-store' } });
  }

  const url = new URL(req.url);
  const user = (url.searchParams.get('user') ?? '').trim().slice(0, 39);
  if (!user || !/^[a-zA-Z0-9-]+$/.test(user)) {
    return NextResponse.json({ ok: false, error: 'Invalid user parameter.' }, { status: 400 });
  }

  const repos = await getPinnedRepos(user);
  return NextResponse.json(
    { ok: true, repos },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
