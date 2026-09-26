# Security

Public threat model and control set for this portfolio. The `/security` page is
the visitor-facing version; this file is the engineering record.

## Threat model (realistic, behavior-based)

In scope: automated scanners, bots, credential-stuffing, brute force, XSS,
CSRF, injection (NoSQL/command/path), SSRF, malicious uploads (no upload
feature exists), API abuse, spam, scraping, DDoS, dependency vulnerabilities,
credential compromise, supply-chain attacks, configuration errors.

Controls target **technique and behavior**, never origin or identity.

Explicitly out of scope by removal: user auth, file uploads, admin panel,
visitor database. A portfolio does not need them, so they do not exist.

## Controls by layer

1. **Edge** — TLS + HSTS, CDN WAF/DDoS, bot controls, edge rate limits.
2. **Application** — strict CSP (`script-src 'self'`, no inline JS),
   `frame-ancestors 'none'`, `nosniff`, minimal `Permissions-Policy`,
   React auto-escaping + schema validation on dynamic data.
3. **API** — JSON-only, 10 KB caps (middleware + handler), Zod validation,
   honeypot with fake-success, 5/hr/IP (contact) and 30/min/IP (github)
   rate limits, `Retry-After`, safe generic errors, request-ID correlation.
4. **Data** — minimal collection (contact fields only), no visitor DB,
   secrets server-side only (`RESEND_API_KEY`, `GITHUB_TOKEN`).
5. **Development** — `npm audit` in CI, CodeQL, Dependabot, secret-scan
   script (CI + manual), `.env` never committed, `.env.example` shape-only.
6. **Operations** — metadata-only audit logs (no bodies, emails, or tokens),
   abuse logging (rate limits, honeypot trips), disclosure policy + runbook.

## Pre-push safety checklist

```bash
npm run typecheck && npm run test && npm run audit
npm run secret-scan
npm run build
```

Then verify: no `.env` tracked (`git ls-files | grep env`), no private IPs /
hostnames / Tailscale keys / tokens in the diff, headers present on staging
(`curl -sI`), contact 429 path tested, no new `NEXT_PUBLIC_*` secrets.

## Review checklist (against OWASP Top 10)

- [ ] Injection: Zod on all API input; no shell; no raw queries; angle-bracket rejection on free text
- [ ] XSS: React escaping; CSP self-only scripts; no `dangerouslySetInnerHTML` anywhere
- [ ] Misconfig: headers on `/(.*)`; `poweredByHeader: false`; API `no-store`
- [ ] Vulnerable components: `npm audit` + Dependabot + lockfile
- [ ] AuthN/AuthZ: N/A — no auth surface exists (documented, not forgotten)
- [ ] Logging failures: metadata-only logs; abuse events recorded; no secret leakage
- [ ] SSRF: GitHub proxy URL is fixed-template + strict username allowlist; timeout + no-store
- [ ] Request abuse: size caps, rate limits, method allow-listing (POST-only contact)

## Disclosure

See `/disclosure` and the in-app policy. Report via `[SECURITY]`-prefixed
message; scope is this site + its contact API only. Good-faith research is
welcomed, credited (or anonymous), and never treated as hostile.

## Known tradeoffs (documented, not hidden)

- Theme flashes dark once for light-mode users (no inline script by CSP choice).
- No inline JSON-LD (same reason) — add via CSP hash if rich results are needed.
- In-memory rate limiting is single-instance-correct; scale needs shared store.
- Contact delivery without `RESEND_API_KEY` queues to logs for manual review.
