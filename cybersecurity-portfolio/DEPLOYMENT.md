# Deployment

Preferred topology (free-tier friendly):

```
GitHub → (CI: typecheck, test, audit, secret-scan, build) → Host → Cloudflare → Users
```

Any Next.js host works (Vercel, Netlify, self-hosted Node). Cloudflare in front
provides TLS, WAF, DDoS absorption, and bot controls.

## Environment checklist

Copy `.env.example` → `.env` (host dashboard for production). Fill **only real
values**; empty hides the feature:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin, e.g. `https://raphael.example.com`. No localhost in prod. |
| `NEXT_PUBLIC_OWNER_NAME` / `TITLE` | No | Defaults are already correct. |
| `CONTACT_EMAIL` | No | Enables `mailto:` links. Empty = form-only. |
| `NEXT_PUBLIC_GITHUB_URL` etc. | No | Empty links are hidden, never dead. |
| `NEXT_PUBLIC_CV_URL` | No | Empty = résumé summary only, no fake download. |
| `CONTACT_TO_EMAIL` + `RESEND_API_KEY` | No | Enables contact delivery. Without them, submissions validate + log for manual review. |
| `GITHUB_TOKEN` | No | Enables `/api/github` enrichment. Without it, zero external calls. |

## Deploy steps

1. `npm run typecheck && npm run test && npm run secret-scan && npm run build`
2. Push to `main` (CI repeats all checks + CodeQL).
3. Host builds with `npm ci && npm run build`, serves with `npm start`
   (or the platform's Next.js adapter).
4. Put Cloudflare in front: Full (strict) TLS, HSTS on, WAF managed rules on,
   `/_next/*` cached, `/api/*` bypass-cache.
5. Verify post-deploy:
   - `curl -sI https://YOUR-DOMAIN/ | grep -iE 'content-security-policy|strict-transport|frame'`
   - `GET /api/contact` → 405; oversized POST → 413; 6th rapid POST → 429
   - `/sitemap.xml` + `/robots.txt` resolve; OG image loads
   - No console errors; keyboard + mobile + light-mode pass

## Domain readiness

- No hardcoded origins: canonical URLs derive from `NEXT_PUBLIC_SITE_URL`.
- HSTS header is `preload`-ready; submit only after confirming HTTPS everywhere.
- When the professional domain is live, update `NEXT_PUBLIC_SITE_URL` and the
  Cloudflare edge config — no code changes needed.

## Rollback

Stateless SSG + API: roll back via the host's previous deployment. No
migrations exist (no database), so rollback is always safe.
