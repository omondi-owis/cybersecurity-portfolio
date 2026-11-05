# VYRA — Cybersecurity Case Studies

VYRA is a cybersecurity case-study site covering security operations infrastructure,
detection engineering, reference-lab documentation, technical research, and secure
application design. Project and lab status labels are explicit; reference exercises
remain reference exercises and are not presented as client delivery.

**Stack:** Next.js 15 (App Router, TypeScript) · React 19 · Zod · hand-built CSS
design system · Vitest · GitHub Actions (typecheck, tests, audit, secret scan, build, CodeQL).

---

## Quick start

```bash
cp .env.example .env   # fill only with real values; empty hides the link
npm install
npm run dev            # http://localhost:3000
```

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run audit` | `npm audit` (moderate+) |
| `npm run secret-scan` | Local secret / private-infrastructure scan |

## Configuration

`content/site.ts` reads public site identity and links from environment variables.
Configure `.env` using `.env.example`:

```
NEXT_PUBLIC_OWNER_NAME / NEXT_PUBLIC_OWNER_TITLE / NEXT_PUBLIC_SITE_URL
CONTACT_EMAIL
NEXT_PUBLIC_GITHUB_URL / LINKEDIN / INSTAGRAM / YOUTUBE / TIKTOK / WHATSAPP
NEXT_PUBLIC_CV_URL
```

Never invent values; leave optional values empty to hide related UI. Server secrets
(`RESEND_API_KEY`, `GITHUB_TOKEN`, `CONTACT_TO_EMAIL`) never use the
`NEXT_PUBLIC_` prefix and never reach the browser.

Repository, demo, and documentation links in `content/projects.ts` remain empty
until a corresponding public destination is available.

## Content model

- `content/projects.ts` — technical case studies, including explicitly labeled
  academic and research work.
- `content/labs.ts` — isolated-lab reference entries with methods, evidence,
  findings, and mitigations.
- `content/articles.ts` — security knowledge-base articles.
- `content/site.ts` and `content/timeline.ts` — site configuration and timeline data.

Routes use `generateStaticParams()`, so adding a content object creates its route
without app-route changes.

## Security controls

- Strict CSP, HSTS, framing denial, and hardened `Permissions-Policy` in `next.config.js`.
- Middleware protection for scanner paths, API size caps, and request IDs.
- Contact API validation, honeypot handling, per-IP rate limiting, metadata-only audit logs, and optional Resend delivery.
- CI checks for type safety, tests, dependency audit, secret scanning, CodeQL, and production build.
- Public disclosure policy at `/disclosure`; security model in `SECURITY.md` and `/security`.

## Project structure

```
app/            # routes and API handlers
components/     # interface components and diagrams
content/        # case studies, lab entries, articles, site configuration
lib/            # validation, rate limiting, utilities, GitHub enrichment
public/         # brand assets and PWA manifest
tests/          # Vitest tests
.github/        # CI, CodeQL, Dependabot
scripts/        # secret-scan.sh
```

## Deployment

See `DEPLOYMENT.md` for environment and deployment guidance, `ARCHITECTURE.md`
for system design, and `SECURITY.md` for the threat model and review checklist.

## License

All rights reserved. Do not reuse VYRA identity or case-study content without
permission.
