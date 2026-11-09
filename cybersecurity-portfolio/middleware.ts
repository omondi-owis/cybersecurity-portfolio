import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { baselineCsp, createNonce, pageCsp } from './lib/csp';

/**
 * Edge middleware: defense-in-depth layer.
 * - Enforces API request-size limits (10 KB)
 * - Adds request correlation ID
 * - Blocks obviously malicious paths (scanner noise) with 404 instead of hitting routes
 * - Issues a cryptographically secure, per-request CSP nonce for rendered HTML
 * - API routes are no-store; HTML is dynamic/no-store so a nonce cannot be reused
 *
 * Full rate limiting lives in the API route (atomic shared Redis quotas)
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
  const isApi = pathname.startsWith('/api/');
  const nonce = createNonce();
  const csp = isApi ? baselineCsp() : pageCsp(nonce);

  const responseHeaders = new Headers({
    'Content-Security-Policy': csp,
    'x-request-id': requestId,
  });

  if (isApi) {
    responseHeaders.set('Cache-Control', 'no-store, max-age=0');
  } else {
    responseHeaders.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  }

  if (BLOCKED_PATH_RE.test(pathname)) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: responseHeaders,
    });
  }

  // API request-size guard (defense against oversized payloads before body parsing)
  if (isApi) {
    const len = req.headers.get('content-length');
    if (len && Number(len) > MAX_API_BYTES) {
      return NextResponse.json(
        { ok: false, error: 'Payload too large. Maximum 10 KB.' },
        { status: 413, headers: responseHeaders }
      );
    }
    const response = NextResponse.next();
    responseHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  // Replace any caller-supplied nonce; the renderer receives only our value.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('Content-Security-Policy', csp);
  requestHeaders.set('x-nonce', nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  responseHeaders.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
