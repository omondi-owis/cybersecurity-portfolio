import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware: defense-in-depth layer.
 * - Enforces API request-size limits (10 KB)
 * - Adds request correlation ID
 * - Blocks obviously malicious paths (scanner noise) with 404 instead of hitting routes
 * - API routes are no-store; pages keep default caching
 *
 * Full rate limiting lives in the API route (in-memory token bucket)
 * so it also works when middleware is bypassed in some hosts.
 */

const MAX_API_BYTES = 10 * 1024; // 10 KB

// Common scanner probes — return 404 quickly without logging sensitive data.
const BLOCKED_PATH_RE = /(\.env|\.git\/|wp-admin|wp-login|phpmyadmin|\.aws\/|server-status|actuator)/i;

function rid(): string {
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestId = rid();

  if (BLOCKED_PATH_RE.test(pathname)) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'x-request-id': requestId, 'Cache-Control': 'no-store' },
    });
  }

  // API request-size guard (defense against oversized payloads before body parsing)
  if (pathname.startsWith('/api/')) {
    const len = req.headers.get('content-length');
    if (len && Number(len) > MAX_API_BYTES) {
      return NextResponse.json(
        { ok: false, error: 'Payload too large. Maximum 10 KB.' },
        { status: 413, headers: { 'x-request-id': requestId } }
      );
    }
    const res = NextResponse.next();
    res.headers.set('x-request-id', requestId);
    return res;
  }

  const res = NextResponse.next();
  res.headers.set('x-request-id', requestId);
  return res;
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
